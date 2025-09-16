import React from 'react';

interface RichTextProps {
    html: string;
}

const RichText: React.FC<RichTextProps> = ({ html }) => {
    return (
        <div
            className="/* Headings */ /* Paragraphs & spacing */ /* Lists */ /* Inline text styles */ /* Inline code */ /* Code blocks */ [&_b]:font-bold [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_em]:italic [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_i]:italic [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p]:leading-relaxed [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:text-gray-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default RichText;
