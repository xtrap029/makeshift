import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Extension } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExtension from '@tiptap/extension-underline';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Redo,
    Strikethrough,
    Underline,
    Undo,
} from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

export interface WysiwygProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    className?: string;
    editorClassName?: string;
    toolbarClassName?: string;
    disabled?: boolean;
    minHeight?: string;
    maxHeight?: string;
    showFloatingMenu?: boolean;
    showBubbleMenu?: boolean;
    extensions?: Extension[];
    editorProps?: Record<string, unknown>;
}

const Wysiwyg = React.forwardRef<HTMLDivElement, WysiwygProps>(
    (
        {
            content = '',
            onChange,
            className,
            editorClassName,
            toolbarClassName,
            disabled = false,
            minHeight = '200px',
            maxHeight = '400px',
            showFloatingMenu = true,
            showBubbleMenu = true,
            extensions = [],
            editorProps = {},
            ...props
        },
        ref
    ) => {
        const editor = useEditor({
            extensions: [
                StarterKit,
                UnderlineExtension,
                Placeholder.configure({
                    placeholder: 'Start typing...',
                }),
                ...extensions,
            ],
            content,
            editable: !disabled,
            onUpdate: ({ editor }) => {
                onChange?.(editor.getHTML());
            },
            editorProps: {
                attributes: {
                    class: cn('focus:outline-none', editorClassName),
                    style: `min-height: ${minHeight}; max-height: ${maxHeight}; overflow: auto;`,
                },
                ...editorProps,
            },
        });

        const providerValue = useMemo(() => ({ editor }), [editor]);

        const toggleBold = useCallback(() => {
            editor?.chain().focus().toggleBold().run();
        }, [editor]);

        const toggleItalic = useCallback(() => {
            editor?.chain().focus().toggleItalic().run();
        }, [editor]);

        const toggleUnderline = useCallback(() => {
            editor?.chain().focus().toggleUnderline().run();
        }, [editor]);

        const toggleStrike = useCallback(() => {
            editor?.chain().focus().toggleStrike().run();
        }, [editor]);

        const toggleCode = useCallback(() => {
            editor?.chain().focus().toggleCode().run();
        }, [editor]);

        const toggleHeading1 = useCallback(() => {
            editor?.chain().focus().toggleHeading({ level: 1 }).run();
        }, [editor]);

        const toggleHeading2 = useCallback(() => {
            editor?.chain().focus().toggleHeading({ level: 2 }).run();
        }, [editor]);

        const toggleHeading3 = useCallback(() => {
            editor?.chain().focus().toggleHeading({ level: 3 }).run();
        }, [editor]);

        const toggleBulletList = useCallback(() => {
            editor?.chain().focus().toggleBulletList().run();
        }, [editor]);

        const toggleOrderedList = useCallback(() => {
            editor?.chain().focus().toggleOrderedList().run();
        }, [editor]);

        const toggleCodeBlock = useCallback(() => {
            editor?.chain().focus().toggleCodeBlock().run();
        }, [editor]);

        const undo = useCallback(() => {
            editor?.chain().focus().undo().run();
        }, [editor]);

        const redo = useCallback(() => {
            editor?.chain().focus().redo().run();
        }, [editor]);

        if (!editor) {
            return null;
        }

        return (
            <div ref={ref} className={cn('w-full', className)} {...props}>
                <EditorContext.Provider value={providerValue}>
                    {/* Toolbar */}
                    <div
                        className={cn(
                            'border-input bg-background flex flex-wrap items-center gap-1 rounded-t-md border p-2',
                            toolbarClassName
                        )}
                    >
                        {/* Text Formatting */}
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleBold}
                                className={cn(editor.isActive('bold') && 'bg-accent')}
                                disabled={disabled}
                            >
                                <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleItalic}
                                className={cn(editor.isActive('italic') && 'bg-accent')}
                                disabled={disabled}
                            >
                                <Italic className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleUnderline}
                                className={cn(editor.isActive('underline') && 'bg-accent')}
                                disabled={disabled}
                            >
                                <Underline className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleStrike}
                                className={cn(editor.isActive('strike') && 'bg-accent')}
                                disabled={disabled}
                            >
                                <Strikethrough className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleCode}
                                className={cn(editor.isActive('code') && 'bg-accent')}
                                disabled={disabled}
                            >
                                <Code className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="bg-border mx-1 h-6 w-px" />

                        {/* Headings */}
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleHeading1}
                                className={cn(
                                    editor.isActive('heading', { level: 1 }) && 'bg-accent'
                                )}
                                disabled={disabled}
                            >
                                <Heading1 className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleHeading2}
                                className={cn(
                                    editor.isActive('heading', { level: 2 }) && 'bg-accent'
                                )}
                                disabled={disabled}
                            >
                                <Heading2 className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleHeading3}
                                className={cn(
                                    editor.isActive('heading', { level: 3 }) && 'bg-accent'
                                )}
                                disabled={disabled}
                            >
                                <Heading3 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="bg-border mx-1 h-6 w-px" />

                        {/* Lists and Blocks */}
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleBulletList}
                                className={cn(editor.isActive('bulletList') && 'bg-accent')}
                                disabled={disabled}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleOrderedList}
                                className={cn(editor.isActive('orderedList') && 'bg-accent')}
                                disabled={disabled}
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={toggleCodeBlock}
                                className={cn(editor.isActive('codeBlock') && 'bg-accent')}
                                disabled={disabled}
                            >
                                <Code className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="bg-border mx-1 h-6 w-px" />

                        {/* History */}
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={undo}
                                disabled={!editor.can().undo() || disabled}
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={redo}
                                disabled={!editor.can().redo() || disabled}
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="border-input rounded-b-md border-x border-b">
                        <EditorContent
                            editor={editor}
                            className={cn(
                                'focus-within:ring-ring p-3 focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none',
                                disabled && 'cursor-not-allowed opacity-50'
                            )}
                        />
                    </div>

                    {/* Floating Menu */}
                    {showFloatingMenu && (
                        <FloatingMenu
                            editor={editor}
                            className="bg-background border-input rounded-md border p-1 shadow-lg"
                        >
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleHeading1}
                                    className={cn(
                                        editor.isActive('heading', { level: 1 }) && 'bg-accent'
                                    )}
                                >
                                    <Heading1 className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleBulletList}
                                    className={cn(editor.isActive('bulletList') && 'bg-accent')}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleOrderedList}
                                    className={cn(editor.isActive('orderedList') && 'bg-accent')}
                                >
                                    <ListOrdered className="h-4 w-4" />
                                </Button>
                            </div>
                        </FloatingMenu>
                    )}

                    {/* Bubble Menu */}
                    {showBubbleMenu && (
                        <BubbleMenu
                            editor={editor}
                            className="bg-background border-input rounded-md border p-1 shadow-lg"
                        >
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleBold}
                                    className={cn(editor.isActive('bold') && 'bg-accent')}
                                >
                                    <Bold className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleItalic}
                                    className={cn(editor.isActive('italic') && 'bg-accent')}
                                >
                                    <Italic className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleUnderline}
                                    className={cn(editor.isActive('underline') && 'bg-accent')}
                                >
                                    <Underline className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleStrike}
                                    className={cn(editor.isActive('strike') && 'bg-accent')}
                                >
                                    <Strikethrough className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleCode}
                                    className={cn(editor.isActive('code') && 'bg-accent')}
                                >
                                    <Code className="h-4 w-4" />
                                </Button>
                            </div>
                        </BubbleMenu>
                    )}
                </EditorContext.Provider>
            </div>
        );
    }
);

Wysiwyg.displayName = 'Wysiwyg';

export { Wysiwyg };
