import React from 'react';

export default function Header({ title, children }: { title: string; children?: React.ReactNode }) {
    return (
        <div className="mb-5 flex items-center justify-between">
            <div className="text-2xl font-bold">{title}</div>
            {children}
        </div>
    );
}
