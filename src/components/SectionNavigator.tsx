'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useReadingProgress } from '@/hooks/useProgress';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ChapterSection } from '@/lib/types';

interface SectionNavigatorProps {
    chapterId: string;
    sections: ChapterSection[];
    previousChapterId?: string;
    nextChapterId?: string;
}

export function SectionNavigator({
    chapterId,
    sections,
    previousChapterId,
    nextChapterId,
}: SectionNavigatorProps) {
    const { progress, updateChapterProgress } = useReadingProgress();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const sectionItems = React.useMemo(() => sections.filter((section) => section.content.trim().length > 0), [sections]);
    const totalSections = sectionItems.length;
    const hasNextChapter = Boolean(nextChapterId);
    const hasPrevChapter = Boolean(previousChapterId);

    const [currentSection, setCurrentSection] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (mounted) {
            return;
        }

        const pos = searchParams.get('pos');
        let nextSection = 0;

        if (pos === 'end') {
            nextSection = Math.max(totalSections - 1, 0);
        } else if (pos !== 'start' && progress) {
            const savedSection = progress.chapters[chapterId]?.currentSectionIndex;
            const isLastChapter = progress.lastChapter === chapterId;

            if (isLastChapter && savedSection !== undefined && savedSection < totalSections) {
                nextSection = savedSection;
            }
        }

        const timer = window.setTimeout(() => {
            setCurrentSection(nextSection);
            setMounted(true);
        }, 0);

        return () => window.clearTimeout(timer);
    }, [progress, chapterId, totalSections, mounted, searchParams]);

    useEffect(() => {
        if (mounted && totalSections > 0) {
            const isAtLastSection = currentSection === totalSections - 1;
            updateChapterProgress(chapterId, {
                currentSectionIndex: currentSection,
                completed: isAtLastSection ? true : undefined
            });
        }
    }, [currentSection, chapterId, updateChapterProgress, mounted, totalSections]);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (!hash) return;

            setTimeout(() => {
                const decodedHash = decodeURIComponent(hash);
                const existingElement = document.getElementById(decodedHash)
                    ?? document.getElementById(`section-panel-${decodedHash}`);

                if (existingElement) {
                    existingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return;
                }

                const targetSectionIndex = sectionItems.findIndex((section) => {
                    if (section.id === decodedHash) return true;

                    const chapterNumMatch = decodedHash.match(/^(\d+-\d+)/);
                    return Boolean(chapterNumMatch && section.title.startsWith(chapterNumMatch[1]));
                });

                if (targetSectionIndex !== -1 && targetSectionIndex !== currentSection) {
                    setDirection(targetSectionIndex > currentSection ? 1 : -1);
                    setCurrentSection(targetSectionIndex);

                    setTimeout(() => {
                        const element = document.getElementById(decodedHash)
                            ?? document.getElementById(`section-panel-${decodedHash}`);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 400);
                }
            }, 100);
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [sectionItems, currentSection]);

    const goToNext = React.useCallback(() => {
        if (currentSection < totalSections - 1) {
            setDirection(1);
            setCurrentSection(prev => prev + 1);
        } else if (nextChapterId) {
            router.push(`/chapters/${nextChapterId}?pos=start`);
        }
    }, [currentSection, totalSections, nextChapterId, router]);

    const goToPrevious = React.useCallback(() => {
        if (currentSection > 0) {
            setDirection(-1);
            setCurrentSection(prev => prev - 1);
        } else if (previousChapterId) {
            router.push(`/chapters/${previousChapterId}?pos=end`);
        }
    }, [currentSection, previousChapterId, router]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentSection]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'ArrowLeft') {
                goToPrevious();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrevious]);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    useEffect(() => {
        const handleSidebarToggle = (e: CustomEvent) => setIsSidebarCollapsed(e.detail.collapsed);
        window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
        return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    }, []);

    const activeSection = sectionItems[currentSection];

    if (!activeSection) {
        return null;
    }

    if (totalSections <= 1 && !hasNextChapter && !hasPrevChapter) {
        return <MarkdownRenderer content={activeSection.content} />;
    }

    return (
        <div className="relative pb-32">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    id={`section-panel-${activeSection.id}`}
                    key={currentSection}
                    initial={{ opacity: 0, y: direction * 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: direction * -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <MarkdownRenderer content={activeSection.content} />
                </motion.div>
            </AnimatePresence>

            <div
                className={`fixed bottom-10 z-50 flex items-center justify-center gap-32 pointer-events-none transition-all duration-500 ease-in-out ${isSidebarCollapsed
                    ? 'left-0 md:left-16 w-full md:w-[calc(100%-4rem)]'
                    : 'left-0 md:left-80 w-full md:w-[calc(100%-20rem)]'
                    }`}
            >
                <button
                    onClick={goToPrevious}
                    disabled={currentSection === 0 && !hasPrevChapter}
                    className={`pointer-events-auto w-14 h-14 rounded-full bg-white border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center justify-center transition-all hover:scale-110 hover:bg-yellow-50 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] ${currentSection === 0 && !hasPrevChapter ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                    <ChevronLeft className="w-8 h-8 text-stone-800" />
                </button>

                <button
                    onClick={goToNext}
                    disabled={currentSection === totalSections - 1 && !hasNextChapter}
                    className={`pointer-events-auto w-14 h-14 rounded-full bg-white border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center justify-center transition-all hover:scale-110 hover:bg-yellow-50 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] ${currentSection === totalSections - 1 && !hasNextChapter ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                    <ChevronRight className="w-8 h-8 text-stone-800" />
                </button>
            </div>
        </div>
    );
}
