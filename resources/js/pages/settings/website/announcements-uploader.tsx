import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ImageUp, Smartphone, X } from 'lucide-react';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import ImageUploading, { ImageType } from 'react-images-uploading';

type ImageWithLink = ImageType & {
    link?: string;
    mobile_data_url?: string;
    mobile_url?: string;
    mobile_file?: File;
};

type ExistingImage = {
    url: string;
    link?: string | null;
    mobileUrl?: string | null;
};

type Props = {
    initialImages?: ExistingImage[];
};

export type AnnouncementsUploaderHandle = {
    save: () => Promise<void>;
};

const AnnouncementsUploader = forwardRef<AnnouncementsUploaderHandle, Props>(
    ({ initialImages = [] }, ref) => {
        const [images, setImages] = useState<ImageWithLink[]>([]);

        useEffect(() => {
            if (initialImages.length > 0) {
                const mapped = initialImages.map((img) => ({
                    data_url: '/storage/' + img.url,
                    url: img.url,
                    link: img.link || '',
                    file: undefined,
                    mobile_data_url: img.mobileUrl ? '/storage/' + img.mobileUrl : undefined,
                    mobile_url: img.mobileUrl || undefined,
                    mobile_file: undefined,
                }));
                setImages(mapped);
            } else {
                setImages([]);
            }
        }, [initialImages]);

        const handleImageChange = (imageList: ImageType[]) => {
            setImages((prev) => {
                const newImages = imageList.map((img, i) => {
                    const existingImage = prev.find((p) => p.data_url === img.data_url);
                    return {
                        ...img,
                        link: existingImage?.link || prev[i]?.link || '',
                        mobile_data_url: existingImage?.mobile_data_url || prev[i]?.mobile_data_url,
                        mobile_url: existingImage?.mobile_url || prev[i]?.mobile_url,
                        mobile_file: existingImage?.mobile_file || prev[i]?.mobile_file,
                    };
                });
                return newImages;
            });
        };

        const handleLinkChange = (index: number, value: string) => {
            setImages((prev) => {
                const updated = [...prev];
                if (updated[index]) {
                    updated[index].link = value;
                }
                return updated;
            });
        };

        const handleMobileImageChange = (index: number, file: File) => {
            setImages((prev) => {
                const updated = [...prev];
                if (updated[index]) {
                    updated[index] = {
                        ...updated[index],
                        mobile_file: file,
                        mobile_data_url: URL.createObjectURL(file),
                        mobile_url: undefined,
                    };
                }
                return updated;
            });
        };

        const handleMobileImageRemove = (index: number) => {
            setImages((prev) => {
                const updated = [...prev];
                if (updated[index]) {
                    updated[index] = {
                        ...updated[index],
                        mobile_file: undefined,
                        mobile_data_url: undefined,
                        mobile_url: undefined,
                    };
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

        useImperativeHandle(ref, () => ({
            save: async () => {
                if (images.length === 0) return;

                const formData = new FormData();

                images.forEach((img, index) => {
                    if (img.file) {
                        formData.append(`images[${index}][file]`, img.file);
                    } else if (img.url) {
                        formData.append(`images[${index}][url]`, img.url);
                    }

                    if (img.link) {
                        formData.append(`images[${index}][link]`, img.link);
                    }

                    if (img.mobile_file) {
                        formData.append(`images[${index}][mobile_file]`, img.mobile_file);
                    } else if (img.mobile_url) {
                        formData.append(`images[${index}][mobile_url]`, img.mobile_url);
                    }

                    formData.append(
                        `images[${index}][temp_id]`,
                        Math.random().toString(36).substring(2, 15)
                    );
                });

                await axios.post(`/api/announcements/images`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            },
        }));

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
                                        Up to 2MB · 2172 × 596px
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
                                                placeholder="Link (optional)"
                                                value={images[index]?.link || ''}
                                                onChange={(e) =>
                                                    handleLinkChange(index, e.target.value)
                                                }
                                                className="mt-2"
                                            />
                                            <div className="mt-2 flex items-center gap-2">
                                                {images[index]?.mobile_data_url ? (
                                                    <div className="relative">
                                                        <img
                                                            src={images[index].mobile_data_url}
                                                            alt=""
                                                            className="size-14 rounded-md border border-gray-200 object-cover shadow-sm"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleMobileImageRemove(index)
                                                            }
                                                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
                                                        >
                                                            <X className="size-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <label className="flex size-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border-2 border-dashed border-gray-300 text-center transition-colors hover:border-gray-400 hover:bg-gray-50">
                                                        <Smartphone
                                                            size={16}
                                                            className="text-gray-500"
                                                        />
                                                        <input
                                                            type="file"
                                                            accept="image/png,image/jpg,image/jpeg"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file =
                                                                    e.target.files?.[0];
                                                                if (file) {
                                                                    handleMobileImageChange(
                                                                        index,
                                                                        file
                                                                    );
                                                                }
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                                <span className="text-xs text-gray-500">
                                                    Mobile (optional)
                                                    <br />
                                                    1080 × 1080px
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </ImageUploading>
            </div>
        );
    }
);

AnnouncementsUploader.displayName = 'AnnouncementsUploader';

export default AnnouncementsUploader;
