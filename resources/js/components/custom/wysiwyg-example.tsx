import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { Wysiwyg } from './wysiwyg';

interface WysiwygExampleProps {
    initialContent?: string;
    onSave?: (content: string) => void;
    label?: string;
    required?: boolean;
    error?: string;
}

export function WysiwygExample({
    initialContent = '',
    onSave,
    label = 'Content',
    required = false,
    error,
}: WysiwygExampleProps) {
    const [content, setContent] = useState(initialContent);
    const [isDirty, setIsDirty] = useState(false);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setIsDirty(true);
    };

    const handleSave = () => {
        onSave?.(content);
        setIsDirty(false);
    };

    const handleReset = () => {
        setContent(initialContent);
        setIsDirty(false);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Label htmlFor="wysiwyg-content" className="text-sm font-medium">
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                </CardTitle>
                <CardDescription>
                    Use the toolbar to format your text. Changes are saved automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Wysiwyg
                    content={content}
                    onChange={handleContentChange}
                    minHeight="200px"
                    maxHeight="400px"
                    className="w-full"
                />

                {error && <p className="text-destructive text-sm">{error}</p>}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isDirty && (
                            <span className="text-muted-foreground text-sm">
                                You have unsaved changes
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {isDirty && (
                            <Button variant="outline" size="sm" onClick={handleReset}>
                                Reset
                            </Button>
                        )}
                        <Button size="sm" onClick={handleSave} disabled={!isDirty}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Example of how to use the WYSIWYG component in a form
export function WysiwygFormExample() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        description: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSave = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.content.trim()) newErrors.content = 'Content is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Form submitted:', formData);
            // Handle form submission here
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="title">Title</Label>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="border-input mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="Enter title..."
                />
                {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title}</p>}
            </div>

            <WysiwygExample
                initialContent={formData.content}
                onSave={(content) => handleSave('content', content)}
                label="Main Content"
                required
                error={errors.content}
            />

            <WysiwygExample
                initialContent={formData.description}
                onSave={(description) => handleSave('description', description)}
                label="Description"
            />

            <Button type="submit">Submit Form</Button>
        </form>
    );
}
