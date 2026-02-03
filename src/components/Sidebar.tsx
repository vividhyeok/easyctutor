'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Chapter, Section } from '@/lib/types';
import { useReadingProgress } from '@/hooks/useProgress';
import { BookOpen, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface SidebarProps {
    chapters: Chapter[];
    className?: string;
}

// Client-side TOC extraction
function extractTOC(content: string): Section[] {
    const headingRegex = /^## (.*)$/gm;
    const sections: Section[] = [];
    const matches = content.matchAll(headingRegex);

    for (const match of matches) {
        const title = match[1].trim();
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
        sections.push({
            id: slug,
            title,
            level: 2
        });
    }

    return sections;
}

export function Sidebar({ chapters, className }: SidebarProps) {
    const pathname = usePathname();
    const { progress } = useReadingProgress();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

    // Extract chapter ID from pathname
    const activeChapterId = pathname.match(/\/chapters\/(\d+)/)?.[1];

    // Auto-expand active chapter and scroll to it
    useEffect(() => {
        if (activeChapterId) {
            setExpandedChapterId(activeChapterId);

            // Scroll sidebar to show active chapter at top
            setTimeout(() => {
                const element = document.getElementById(`sidebar-chapter-${activeChapterId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [activeChapterId]);

    const toggleChapter = (chapterId: string) => {
        setExpandedChapterId(prev => (prev === chapterId ? null : chapterId));
    };

    return (
        <aside className={cn(
            "h-screen sticky top-0 border-r border-gray-100 bg-[#fdfbf7] flex flex-col transition-all duration-300",
            isCollapsed ? "w-16" : "w-80", // Increased width from w-64 to w-80
            className
        )} style={{ fontFamily: 'var(--font-nav)' }}>
            <div className={cn("p-6 border-b border-gray-100 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900 tracking-tight">
                        <BookOpen className="w-7 h-7" />
                        <span>쉬운 C언어</span>
                    </Link>
                )}
                <button
                    onClick={() => {
                        const newState = !isCollapsed;
                        setIsCollapsed(newState);
                        // Dispatch event for other components to react (e.g. SectionNavigator button positioning)
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { collapsed: newState } }));
                        }
                    }}
                    className={cn(
                        "p-1.5 rounded-lg hover:bg-gray-200 transition-colors",
                        isCollapsed && "mx-auto"
                    )}
                    aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
                    )}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {chapters.map((chapter) => {
                    const isActive = pathname === `/chapters/${chapter.id}`;
                    const isCompleted = progress?.chapters[chapter.id]?.completed;
                    const isExpanded = expandedChapterId === chapter.id;
                    const toc = isExpanded ? extractTOC(chapter.content) : [];

                    return (
                        <div key={chapter.id} id={`sidebar-chapter-${chapter.id}`}>
                            <div className="flex items-center relative">
                                {/* Subtle background for progress/active state */}
                                <div className={cn(
                                    "absolute inset-0 rounded-lg transition-colors duration-200 -z-10",
                                    isActive ? "bg-stone-200/60" :
                                        isCompleted ? "bg-green-50/50" : "transparent"
                                )} />

                                <Link
                                    href={`/chapters/${chapter.id}`}
                                    className={cn(
                                        "group flex items-center justify-between p-3 rounded-lg transition-all duration-200 flex-1",
                                        isCollapsed && "justify-center"
                                    )}
                                    title={isCollapsed ? chapter.title : undefined}
                                >
                                    {!isCollapsed && (
                                        <span className={cn(
                                            "text-[1.1rem] leading-tight transition-colors", // Increased font size
                                            isActive ? "text-black font-semibold" : // Weight 600
                                                isCompleted ? "text-gray-800 font-semibold" :
                                                    "text-gray-900 font-medium hover:text-black"
                                        )}>
                                            {chapter.title}
                                        </span>
                                    )}
                                </Link>

                                {/* Expand/Collapse button */}
                                {!isCollapsed && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleChapter(chapter.id);
                                        }}
                                        className="p-2 mr-1 hover:bg-gray-200/50 rounded-md transition-colors"
                                        aria-label={isExpanded ? "접기" : "펼치기"}
                                    >
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Nested TOC - show when expanded */}
                            {isExpanded && !isCollapsed && toc.length > 0 && (
                                <div className="mt-2 ml-1 space-y-1">
                                    {/* Removed border-l-2 and large margin-left */}
                                    {toc.map((section) => (
                                        <a
                                            key={section.id}
                                            href={`/chapters/${chapter.id}#${section.id}`}
                                            className="block text-[1.05rem] text-gray-800 hover:text-black font-normal py-1.5 px-3 transition-colors leading-snug rounded hover:bg-black/5"
                                        // Font size increased (~1.6x of previous xs/sm), Weight 400
                                        >
                                            {section.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>


        </aside>
    );
}
