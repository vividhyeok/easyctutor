'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Section } from '@/lib/types';

interface TableOfContentsProps {
    sections: Section[];
    activeId?: string;
    className?: string;
    onItemClick?: () => void;
}

export function TableOfContents({ sections, activeId, className, onItemClick }: TableOfContentsProps) {
    if (sections.length === 0) return null;

    return (
        <nav className={cn("text-sm", className)}>
            <h4 className="font-heading font-medium text-gray-500 mb-4 px-2">이 장의 내용</h4>
            <ul className="space-y-1">
                {sections.map((section) => (
                    <li key={section.id}>
                        <Link
                            href={`#${section.id}`}
                            onClick={onItemClick}
                            className={cn(
                                "block py-1.5 px-3 rounded-md transition-colors duration-200",
                                activeId === section.id
                                    ? "bg-yellow-100 text-gray-900 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            {section.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
