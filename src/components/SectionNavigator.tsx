'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import GithubSlugger from 'github-slugger';

interface SectionNavigatorProps {
    content: string;
}

export function SectionNavigator({ content }: SectionNavigatorProps) {
    // Split content by horizontal rules (---)
    // Handle both Unix (\n) and Windows (\r\n) line endings
    const sections = content.split(/\r?\n---\r?\n/).filter(s => s.trim().length > 0);
    const [currentSection, setCurrentSection] = useState(0);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && currentSection > 0) {
                goToPrevious();
            } else if (e.key === 'ArrowRight' && currentSection < sections.length - 1) {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSection, sections.length]);

    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentSection]);

    // Handle URL hash navigation (from TOC clicks)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1); // Remove #
            if (!hash) return;

            console.log('🔍 Looking for hash:', hash);

            // Wait a bit for the current section to render, then find the heading
            setTimeout(() => {
                // First, try to find the element in the current section
                let element = document.getElementById(hash);

                if (element) {
                    console.log('✅ Found element in current section, scrolling...');
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return;
                }

                // If not found, search through all sections using Markdown matching (more reliable than waiting for DOM)
                console.log('🔎 Searching markdown sections for match...');
                const slugger = new GithubSlugger();

                // Decode hash in case it's URI encoded
                const decodedHash = decodeURIComponent(hash);

                const targetSectionIndex = sections.findIndex((section, idx) => {
                    // Match headings like "## 8-6. 자주 하는 실수 모음"
                    const headingMatches = section.match(/^##\s+(.+)$/gm);

                    if (headingMatches) {
                        return headingMatches.some(heading => {
                            const headingText = heading.replace(/^##\s+/, '');

                            // Debug logs
                            console.log(`Checking heading: "${headingText}" against hash: "${decodedHash}"`);

                            // 1. Try slug match
                            const slug = slugger.slug(headingText);
                            if (slug === decodedHash) return true;
                            if (decodedHash.length > 3 && (slug.startsWith(decodedHash) || decodedHash.startsWith(slug))) return true;

                            // 2. Try direct text match (robust fallback)
                            // If hash is like "8-6-", extract "8-6" and check if heading starts with "8-6"
                            const chapterNumMatch = decodedHash.match(/^(\d+-\d+)/);
                            if (chapterNumMatch) {
                                const chapterNum = chapterNumMatch[1]; // e.g. "8-6"
                                if (headingText.startsWith(chapterNum)) {
                                    console.log(`  MATCH via chapter number: ${chapterNum}`);
                                    return true;
                                }
                            }

                            return false;
                        });
                    }
                    return false;
                });

                if (targetSectionIndex !== -1 && targetSectionIndex !== currentSection) {
                    console.log(`🎯 Found in section ${targetSectionIndex}, navigating...`);
                    setDirection(targetSectionIndex > currentSection ? 1 : -1);
                    setCurrentSection(targetSectionIndex);

                    // After navigation, try to scroll
                    setTimeout(() => {
                        const el = document.getElementById(decodedHash);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 400);
                } else {
                    console.log('❌ Could not find section containing hash:', decodedHash);
                }
            }, 100);
        };

        // Check hash on mount and on hash change
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [sections, currentSection]);

    const goToNext = () => {
        if (currentSection < sections.length - 1) {
            setDirection(1);
            setCurrentSection(prev => prev + 1);
        }
    };

    const goToPrevious = () => {
        if (currentSection > 0) {
            setDirection(-1);
            setCurrentSection(prev => prev - 1);
        }
    };

    // Track sidebar state for responsive button positioning
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Listen for sidebar toggle events
        const handleSidebarToggle = (e: CustomEvent) => {
            console.log('Sidebar toggled:', e.detail.collapsed);
            setIsSidebarCollapsed(e.detail.collapsed);
        };

        window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
        return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    }, []);

    // If only one section, just render normally
    if (sections.length <= 1) {
        return <MarkdownRenderer content={content} />;
    }

    return (
        <div className="relative pb-32">
            {/* Content Area with Animation */}
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

            {/* Floating Navigation Buttons - Bottom Center */}
            {/* Position container to match main content area (after sidebar) */}
            {/* Sidebar width: expanded w-80 (20rem), collapsed w-16 (4rem) */}
            <div
                className={`fixed bottom-10 z-50 flex items-center justify-center gap-32 pointer-events-none transition-all duration-500 ease-in-out ${isSidebarCollapsed
                        ? 'left-0 md:left-16 w-full md:w-[calc(100%-4rem)]'
                        : 'left-0 md:left-80 w-full md:w-[calc(100%-20rem)]'
                    }`}
            >
                {/* Previous Button */}
                <button
                    onClick={goToPrevious}
                    disabled={currentSection === 0}
                    className={`pointer-events-auto w-14 h-14 rounded-full bg-white border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center justify-center transition-all hover:scale-110 hover:bg-yellow-50 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] ${currentSection === 0 ? 'opacity-30 cursor-not-allowed hover:scale-100 hover:bg-white' : ''
                        }`}
                    aria-label="이전 섹션"
                >
                    <ChevronLeft className="w-8 h-8 text-stone-800" />
                </button>

                {/* Next Button */}
                <button
                    onClick={goToNext}
                    disabled={currentSection === sections.length - 1}
                    className={`pointer-events-auto w-14 h-14 rounded-full bg-white border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center justify-center transition-all hover:scale-110 hover:bg-yellow-50 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] ${currentSection === sections.length - 1 ? 'opacity-30 cursor-not-allowed hover:scale-100 hover:bg-white' : ''
                        }`}
                    aria-label="다음 섹션"
                >
                    <ChevronRight className="w-8 h-8 text-stone-800" />
                </button>
            </div>
        </div>
    );
}
