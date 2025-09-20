import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ImageUp, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ImageUploading, { ImageType } from 'react-images-uploading';
import { toast } from 'sonner';

type ImageWithText = ImageType & {
    caption?: string;
};

type ExistingImage = {
    url: string;
    caption?: string;
};

type Props = {
    initialImages?: ExistingImage[];
    onChange?: (images: { file?: File; url?: string; caption?: string }[]) => void;
    roomId: number;
    setOpenGallery: (open: boolean) => void;
};

const Gallery: React.FC<Props> = ({ initialImages = [], onChange, roomId, setOpenGallery }) => {
    const [images, setImages] = useState<ImageWithText[]>([]);

    useEffect(() => {
        if (initialImages.length > 0) {
            const mapped = initialImages.map((img) => ({
                data_url: '/storage/' + img.url,
                url: img.url,
                caption: img.caption || '',
                file: undefined,
            }));
            setImages(mapped);
        } else {
            setImages([]);
        }
    }, [initialImages]);

    useEffect(() => {
        if (onChange && images.length > 0) {
            const payload = images.map((img) => ({
                file: img.file,
                url: img.url,
                caption: img.caption,
            }));
            onChange(payload);
        }
    }, [images, onChange]);

    const handleImageChange = (imageList: ImageType[]) => {
        setImages((prev) => {
            const newImages = imageList.map((img, i) => {
                const existingImage = prev.find((p) => p.data_url === img.data_url);
                return {
                    ...img,
                    caption: existingImage?.caption || prev[i]?.caption || '',
                };
            });
            return newImages;
        });
    };

    const handleCaptionChange = (index: number, value: string) => {
        setImages((prev) => {
            const updated = [...prev];
            if (updated[index]) {
                updated[index].caption = value;
            }
            return updated;
        });
    };

    const moveImage = (index: number, direction: 'left' | 'right') => {
        const newIndex = direction === 'left' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= images.length) return;

        const updated = [...images];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setImages(updated);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            images.forEach((img, index) => {
                if (img.file) {
                    formData.append(`images[${index}][file]`, img.file);
                } else if (img.url) {
                    formData.append(`images[${index}][url]`, img.url);
                }

                if (img.caption) {
                    formData.append(`images[${index}][caption]`, img.caption);
                }

                formData.append(
                    `images[${index}][temp_id]`,
                    Math.random().toString(36).substring(2, 15)
                );
            });

            await axios.post(`/api/rooms/${roomId}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Images uploaded successfully');
            router.reload({ only: ['room'] });
            setOpenGallery(false);
        } catch (err) {
            toast.error('Images upload failed');
            console.error('API upload failed', err);
        }
    };

    return (
        <div className="space-y-6">
            <ImageUploading
                multiple
                value={images}
                onChange={handleImageChange}
                maxNumber={10}
                dataURLKey="data_url"
                maxFileSize={2 * 1024 * 1024}
            >
                {({ imageList, onImageUpload, onImageRemove, dragProps }) => (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div
                                onClick={onImageUpload}
                                {...dragProps}
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-3 border-dashed border-gray-300 text-center font-medium transition-colors hover:border-gray-400 hover:bg-gray-50"
                            >
                                <ImageUp size={45} className="text-gray-500" />
                                <span>Upload Images</span>
                                <span className="text-xs text-gray-500">
                                    PNG, JPG, JPEG up to 2MB
                                </span>
                            </div>
                            {imageList.map((image, index) => (
                                <Card key={index} className="relative px-1 py-1">
                                    <CardContent className="p-2">
                                        <div className="relative flex flex-col">
                                            <img
                                                src={image.data_url}
                                                alt=""
                                                className="h-[120px] w-full rounded-md border border-gray-200 object-cover shadow-md"
                                            />
                                            {images.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => onImageRemove(index)}
                                                    className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
                                                >
                                                    <X />
                                                </Button>
                                            )}

                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => moveImage(index, 'left')}
                                                    className="absolute bottom-2 left-2 h-6 w-6 rounded-full p-0"
                                                >
                                                    <ChevronLeft />
                                                </Button>
                                            )}

                                            {index < images.length - 1 && (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => moveImage(index, 'right')}
                                                    className="absolute right-2 bottom-2 h-6 w-6 rounded-full p-0"
                                                >
                                                    <ChevronRight />
                                                </Button>
                                            )}
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="Enter caption"
                                            value={images[index]?.caption || ''}
                                            onChange={(e) =>
                                                handleCaptionChange(index, e.target.value)
                                            }
                                            className="mt-2"
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </ImageUploading>

            <div className="flex justify-center gap-2">
                {images.length > 0 && <Button onClick={handleSubmit}>Save Changes</Button>}
                <Button onClick={() => setOpenGallery(false)} variant="outline">
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default Gallery;
