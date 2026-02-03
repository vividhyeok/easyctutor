'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Chapter } from '@/lib/types';
import { useReadingProgress } from '@/hooks/useProgress';
import { CheckCircle2, Circle, ArrowRight, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HomeChapterList({ chapters }: { chapters: Chapter[] }) {
    const { progress } = useReadingProgress();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // SSR Fallback (Skeleton or just list)
        return (
            <div className="space-y-3">
                {chapters.map((chapter) => (
                    <div key={chapter.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 bg-white/50 opacity-50">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                        <span className="font-heading text-lg text-gray-400">{chapter.title}</span>
                    </div>
                ))}
            </div>
        );
    }

    const lastChapterId = progress?.lastChapter;
    const completedCount = Object.values(progress?.chapters || {}).filter(c => c.completed).length;
    const totalChapters = chapters.length;
    const completionPercentage = Math.round((completedCount / totalChapters) * 100);

    return (
        <div className="space-y-6">
            {/* Resume Button */}
            {progress && progress.lastChapter && (
                <div className="mb-8">
                    <Link
                        href={`/chapters/${progress.lastChapter}`}
                        className="group flex items-center justify-between p-4 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-gray-800 transition-all transform hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-3">
                            <PlayCircle className="w-6 h-6 text-yellow-400" />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">이어서 학습하기</span>
                                <span className="font-heading font-bold text-lg">
                                    {chapters.find(c => c.id === progress.lastChapter)?.title || '시작하기'}
                                </span>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </div>
            )}

            {/* Progress Stats */}
            <div className="flex items-center justify-between px-2 text-sm text-gray-500 mb-2">
                <span>전체 진도</span>
                <span className="font-mono">{completionPercentage}% Completed</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div
                    className="h-full bg-green-500 transition-all duration-1000 ease-out"
                    style={{ width: `${completionPercentage}%` }}
                />
            </div>

            {/* Chapter List */}
            <div className="space-y-3">
                {chapters.map((chapter) => {
                    const isCompleted = progress?.chapters[chapter.id]?.completed;
                    const isStarted = progress?.chapters[chapter.id]?.visited;
                    const isLastActive = chapter.id === lastChapterId;

                    return (
                        <Link
                            key={chapter.id}
                            href={`/chapters/${chapter.id}`}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-lg border transition-all duration-200",
                                isLastActive
                                    ? "border-yellow-400 ring-1 ring-yellow-400 bg-yellow-50"
                                    : "border-gray-100 hover:border-gray-300 hover:bg-white"
                            )}
                        >
                            <div className="shrink-0">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                ) : isStarted ? (
                                    <Circle className="w-6 h-6 text-yellow-500 fill-yellow-100" />
                                ) : (
                                    <Circle className="w-6 h-6 text-gray-300" />
                                )}
                            </div>

                            <div className="flex-1">
                                <span className={cn(
                                    "font-heading text-lg block leading-tight",
                                    isCompleted ? "text-gray-500 line-through decoration-gray-300" : "text-gray-900"
                                )}>
                                    {chapter.title}
                                </span>
                            </div>

                            {isLastActive && (
                                <span className="text-[10px] font-bold text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    Current
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
