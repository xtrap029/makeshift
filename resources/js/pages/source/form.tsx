import Header from '@/components/custom/page/header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SourceForm } from '@/types/form';
import { Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Form({
    data,
    setData,
    processing,
    errors,
    submit,
}: {
    data: Partial<SourceForm>;
    setData: (key: keyof SourceForm, value: SourceForm[keyof SourceForm]) => void;
    processing: boolean;
    errors: Record<string, string>;
    submit: FormEventHandler;
}) {
    return (
        <form className="flex flex-col gap-6" onSubmit={submit}>
            <Header title={`${data.id ? 'Edit' : 'Create'} Source`} />
            <div className="grid gap-6">
                <div className="col-span-12 grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="Name"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="col-span-12 grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        type="text"
                        value={data.description || ''}
                        onChange={(e) => setData('description', e.target.value)}
                        disabled={processing}
                        placeholder="Description"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/sources">Cancel</Link>
                    </Button>
                </div>
            </div>
        </form>
    );
}
