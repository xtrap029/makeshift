import { PaginationLink } from '@/types/pagination';
import { Link } from '@inertiajs/react';

interface Props {
    links: PaginationLink[];
}

function formatLabel(label: string): React.ReactNode {
    if (label.includes('&laquo;')) return 'Prev';
    if (label.includes('&raquo;')) return 'Next';

    return label.replace(/&nbsp;/g, ' ').trim();
}

const Pagination: React.FC<Props> = ({ links }) => {
    return (
        <div className="mt-5 flex flex-wrap justify-center gap-1">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url ?? ''}
                    className={`rounded-md border px-3 py-1 text-sm ${
                        link.active ? 'bg-primary text-white' : 'bg-white text-gray-700'
                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                >
                    {formatLabel(link.label)}
                </Link>
            ))}
        </div>
    );
};

export default Pagination;
