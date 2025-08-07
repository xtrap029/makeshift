import { AnimatePresence, motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

export default function Animation({
    children,
    isRandom,
    isVertical,
}: PropsWithChildren<{ isRandom?: boolean; isVertical?: boolean }>) {
    const transitionDuration = () => {
        return isRandom ? -Math.random() * 100 : -50;
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ [isVertical ? 'y' : 'x']: transitionDuration(), opacity: 0 }}
                animate={{ [isVertical ? 'y' : 'x']: 0, opacity: 1 }}
                exit={{ [isVertical ? 'y' : 'x']: transitionDuration(), opacity: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    bounce: 0.4,
                    delay: isRandom ? Math.random() * 0.3 : 0,
                }}
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
