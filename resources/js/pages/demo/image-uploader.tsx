import AppLayout from '@/layouts/app-layout';
import MultipleImageUploader from '@/pages/room/gallery';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Demo', href: '/demo' },
    { title: 'Image Uploader', href: '/demo/image-uploader' },
];

export default function ImageUploaderDemo() {
    const [images, setImages] = useState<{ file?: File; url?: string; caption?: string }[]>([]);

    const handleImagesChange = (newImages: { file?: File; url?: string; caption?: string }[]) => {
        setImages(newImages);
        console.log('Images changed:', newImages);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Image Uploader Demo" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Image Uploader Demo</h1>

                <div className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold">With Initial Images:</h2>
                    <MultipleImageUploader
                        initialImages={[
                            {
                                url: 'https://picsum.photos/300/200?random=1',
                                caption: 'Sample image 1',
                            },
                            {
                                url: 'https://picsum.photos/300/200?random=2',
                                caption: 'Sample image 2',
                            },
                        ]}
                        onChange={handleImagesChange}
                    />
                </div>

                <div className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold">Empty (no initial images):</h2>
                    <MultipleImageUploader onChange={handleImagesChange} />
                </div>

                <div className="mt-6">
                    <h2 className="mb-2 text-lg font-semibold">Current Images State:</h2>
                    <div className="mb-2 text-sm text-gray-600">
                        <p>
                            • <strong>Initial images</strong> will have <code>url</code> but no{' '}
                            <code>file</code>
                        </p>
                        <p>
                            • <strong>New uploads</strong> will have <code>file</code> but no{' '}
                            <code>url</code>
                        </p>
                        <p>
                            • <strong>Captions</strong> are preserved for both types
                        </p>
                    </div>
                    <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
                        {JSON.stringify(images, null, 2)}
                    </pre>
                </div>
            </div>
        </AppLayout>
    );
}
