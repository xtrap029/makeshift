import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useState } from 'react';

export default function ImageWithFallback({
    src,
    alt,
    className = '',
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    const [hasError, setHasError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gray-200 ${className}`}>
            {(!loaded || hasError) && (
                <PlaceholderPattern className="absolute inset-0 z-0 size-full stroke-neutral-500/10" />
            )}

            {!hasError && (
                <img
                    src={src}
                    alt={alt}
                    className="relative h-full w-full object-cover"
                    onLoad={() => setLoaded(true)}
                    onError={() => setHasError(true)}
                />
            )}
        </div>
    );
}
