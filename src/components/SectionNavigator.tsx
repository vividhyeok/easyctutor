'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import GithubSlugger from 'github-slugger';
import { useReadingProgress } from '@/hooks/useProgress';
import { useRouter } from 'next/navigation';

interface SectionNavigatorProps {
    chapterId: string;
    content: string;
}

export function SectionNavigator({ chapterId, content }: SectionNavigatorProps) {
    const { progress, updateChapterProgress } = useReadingProgress();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Split content by horizontal rules (---)
    const sections = React.useMemo(() => {
        const s = content.split(/\r?\n\s*---\s*\r?\n/).filter(str => str.trim().length > 0);
        return s;
    }, [content]);

    const [currentSection, setCurrentSection] = useState(0);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

    const hasNextChapter = parseInt(chapterId) < 8;
    const hasPrevChapter = parseInt(chapterId) > 0;

    // Load initial section from progress (ONLY on initial page load, not internal nav)
    useEffect(() => {
        if (progress && !mounted) {
            // Only restore section if this is a direct navigation (no hash)
            // and user is resuming (not starting fresh from home link)
            const savedSection = progress.chapters[chapterId]?.currentSectionIndex;

            // Check if we're resuming from the last chapter or starting fresh
            const isLastChapter = progress.lastChapter === chapterId;

            if (isLastChapter && savedSection !== undefined && savedSection < sections.length) {
                setCurrentSection(savedSection);
            }
            // Otherwise start from section 0 (default)
            setMounted(true);
        }
    }, [progress, chapterId, sections.length, mounted]);

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

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSection, sections.length, hasNextChapter, hasPrevChapter]);

    // Scroll to top when section changes
    useEffect(() => {
        if (mounted) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentSection, mounted]);

    // Handle URL hash navigation (from TOC clicks)
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

    const goToNext = () => {
        if (currentSection < sections.length - 1) {
            setDirection(1);
            setCurrentSection(prev => prev + 1);
        } else if (hasNextChapter) {
            router.push(`/chapters/${parseInt(chapterId) + 1}`);
        }
    };

    const goToPrevious = () => {
        if (currentSection > 0) {
            setDirection(-1);
            setCurrentSection(prev => prev - 1);
        } else if (hasPrevChapter) {
            router.push(`/chapters/${parseInt(chapterId) - 1}`);
        }
    };

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
