'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Chapter } from '@/lib/types';
import { useReadingProgress } from '@/hooks/useProgress';
import { Menu, X, CheckCircle2, Circle, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileDrawerProps {
    chapters: Chapter[];
}

export function MobileDrawer({ chapters }: MobileDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { progress } = useReadingProgress();

    // Find current chapter info
    const currentChapterId = pathname.match(/\/chapters\/(\d+)/)?.[1];
    const currentChapter = chapters.find(c => c.id === currentChapterId);

    // Close drawer on route change
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Top Bar */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#fdfbf7]/90 backdrop-blur border-b border-gray-200 z-40 flex items-center justify-between px-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-1 -ml-1 text-gray-700 hover:bg-gray-100 rounded-md"
                        aria-label="Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-heading font-bold text-lg truncate text-gray-800">
                        {currentChapter ? currentChapter.title : '노트 교재'}
                    </span>
                </div>

                {/* Simple Progress text if in chapter */}
                {currentChapter && progress?.chapters[currentChapter.id] && (
                    <span className="text-xs font-mono text-gray-500 shrink-0">
                        {Math.round((progress.chapters[currentChapter.id].scrollRatio || 0) * 100)}%
                    </span>
                )}
            </header>

            {/* Drawer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 md:hidden"
                        />
                        <motion.nav
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-[#fdfbf7] z-50 shadow-xl flex flex-col md:hidden"
                        >
                            <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
                                <span className="font-heading font-bold text-lg">목차</span>
                                <button onClick={() => setIsOpen(false)} className="p-1 text-gray-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                                {chapters.map((chapter) => {
                                    const isActive = pathname === `/chapters/${chapter.id}`;
                                    const isCompleted = progress?.chapters[chapter.id]?.completed;

                                    return (
                                        <Link
                                            key={chapter.id}
                                            href={`/chapters/${chapter.id}`}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg",
                                                isActive ? "bg-yellow-100 text-gray-900" : "text-gray-700 active:bg-gray-50"
                                            )}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className={cn("w-5 h-5", isActive ? "text-green-600" : "text-green-500")} />
                                            ) : (
                                                <Circle className={cn("w-5 h-5", isActive ? "text-yellow-600" : "text-gray-300")} />
                                            )}
                                            <span className="font-heading font-medium">{chapter.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-gray-100">
                                <Link href="/" className="block w-full py-3 text-center bg-gray-900 text-white rounded-lg font-medium">
                                    홈으로 이동
                                </Link>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
