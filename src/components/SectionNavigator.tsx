'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import GithubSlugger from 'github-slugger';
import { useReadingProgress } from '@/hooks/useProgress';
import { useRouter, useSearchParams } from 'next/navigation';

interface SectionNavigatorProps {
    chapterId: string;
    content: string;
}

export function SectionNavigator({ chapterId, content }: SectionNavigatorProps) {
    const { progress, updateChapterProgress } = useReadingProgress();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Split content by horizontal rules (---)
    const sections = React.useMemo(() => {
        const s = content.split(/\r?\n\s*---\s*\r?\n/).filter(str => str.trim().length > 0);
        return s;
    }, [content]);

    const [currentSection, setCurrentSection] = useState(0);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

    const chNum = parseInt(chapterId, 10);
    const hasNextChapter = !isNaN(chNum) && chNum < 23;
    const hasPrevChapter = !isNaN(chNum) && chNum > 0;

    useEffect(() => {
        console.log('SectionNavigator Debug:', {
            chapterId,
            chNum,
            hasNextChapter,
            currentSection,
            totalSections: sections.length,
            isAtEnd: currentSection === sections.length - 1,
            buttonDisabled: currentSection === sections.length - 1 && !hasNextChapter
        });
    }, [chapterId, chNum, hasNextChapter, currentSection, sections.length]);

    // Load initial section logic
    useEffect(() => {
        if (!mounted) {
            const pos = searchParams.get('pos');

            if (pos === 'end') {
                // If coming from next chapter (prev button), go to last section
                setCurrentSection(sections.length - 1);
            } else if (pos === 'start') {
                // If coming from prev chapter (next button), go to first section
                setCurrentSection(0);
            } else if (progress) {
                // Normal restore (refresh or direct visit)
                const savedSection = progress.chapters[chapterId]?.currentSectionIndex;
                const isLastChapter = progress.lastChapter === chapterId;

                if (isLastChapter && savedSection !== undefined && savedSection < sections.length) {
                    setCurrentSection(savedSection);
                }
            }
            setMounted(true);
        }
    }, [progress, chapterId, sections.length, mounted, searchParams]);

    // Save progress when section changes
    useEffect(() => {
        if (mounted) {
            const isAtLastSection = currentSection === sections.length - 1;
            updateChapterProgress(chapterId, {
                currentSectionIndex: currentSection,
                completed: isAtLastSection ? true : undefined
            });
        }
    }, [currentSection, chapterId, updateChapterProgress, mounted, sections.length]);

    // ... (Existing keyboard and scroll effects remain same) ...

    // Handle URL hash navigation (same as before)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1); // Remove #
            if (!hash) return;

            setTimeout(() => {
                let element = document.getElementById(decodeURIComponent(hash));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return;
                }

                const slugger = new GithubSlugger();
                const decodedHash = decodeURIComponent(hash);

                const targetSectionIndex = sections.findIndex((section) => {
                    const headingMatches = section.match(/^##\s+(.+)$/gm);
                    if (headingMatches) {
                        return headingMatches.some(heading => {
                            const headingText = heading.replace(/^##\s+/, '');
                            const slug = slugger.slug(headingText);
                            if (slug === decodedHash) return true;
                            const chapterNumMatch = decodedHash.match(/^(\d+-\d+)/);
                            if (chapterNumMatch && headingText.startsWith(chapterNumMatch[1])) return true;
                            return false;
                        });
                    }
                    return false;
                });

                if (targetSectionIndex !== -1 && targetSectionIndex !== currentSection) {
                    setDirection(targetSectionIndex > currentSection ? 1 : -1);
                    setCurrentSection(targetSectionIndex);
                    setTimeout(() => {
                        const el = document.getElementById(decodedHash);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 400);
                }
            }, 100);
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [sections, currentSection]);

    const goToNext = React.useCallback(() => {
        if (currentSection < sections.length - 1) {
            setDirection(1);
            setCurrentSection(prev => prev + 1);
        } else if (hasNextChapter) {
            router.push(`/chapters/${parseInt(chapterId) + 1}?pos=start`);
        }
    }, [currentSection, sections.length, hasNextChapter, chapterId, router]);

    const goToPrevious = React.useCallback(() => {
        if (currentSection > 0) {
            setDirection(-1);
            setCurrentSection(prev => prev - 1);
        } else if (hasPrevChapter) {
            router.push(`/chapters/${parseInt(chapterId) - 1}?pos=end`);
        }
    }, [currentSection, hasPrevChapter, chapterId, router]);

    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentSection]);

    // Keyboard navigation
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

    if (sections.length <= 1 && !hasNextChapter && !hasPrevChapter) {
        return <MarkdownRenderer content={content} />;
    }

    return (
        <div className="relative pb-32">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, y: direction * 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: direction * -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <MarkdownRenderer content={sections[currentSection]} />
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
                    disabled={currentSection === sections.length - 1 && !hasNextChapter}
                    className={`pointer-events-auto w-14 h-14 rounded-full bg-white border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center justify-center transition-all hover:scale-110 hover:bg-yellow-50 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] ${currentSection === sections.length - 1 && !hasNextChapter ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                    <ChevronRight className="w-8 h-8 text-stone-800" />
                </button>
            </div>
        </div>
    );
}
