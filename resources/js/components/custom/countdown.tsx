import { useEffect, useState } from 'react';

export default function Countdown({ deadline }: { deadline: string }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const target = new Date(deadline).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;

            if (distance <= 0) {
                clearInterval(interval);
                setTimeLeft('');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`
                ${days > 0 ? `${days}d ` : ''}
                ${hours > 0 ? `${hours}h ` : ''}
                ${minutes > 0 ? `${minutes}m ` : ''}
                ${seconds}s
            `);
        }, 1000);

        return () => clearInterval(interval);
    }, [deadline]);

    return <span>{timeLeft}</span>;
}
