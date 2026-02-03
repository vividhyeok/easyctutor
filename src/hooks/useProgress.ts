'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export interface ChapterProgress {
    visited: boolean;
    completed: boolean;
    scrollRatio: number;
    currentSectionIndex?: number; // Last viewed section index
    lastAnchor?: string;
    updatedAt: number;
}

export interface ProgressData {
    lastChapter: string; // The ID of the last visited chapter
    lastSectionIndex?: number; // Global last viewed section index
    chapters: Record<string, ChapterProgress>;
}

const STORAGE_KEY = 'c_tutoring_progress_v1';

export function useReadingProgress() {
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const pathname = usePathname();

    // Load progress on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setProgress(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse progress', e);
            }
        } else {
            setProgress({ lastChapter: '0', chapters: {} });
        }
    }, []);

    const saveProgress = useCallback((newData: ProgressData) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        setProgress(newData);
    }, []);

    const updateChapterProgress = useCallback((chapterId: string, data: Partial<ChapterProgress>) => {
        setProgress((prev) => {
            if (!prev) return null;

            const currentChapterData = prev.chapters[chapterId] || {
                visited: false,
                completed: false,
                scrollRatio: 0,
                updatedAt: 0
            };

            const updatedChapterData: ChapterProgress = {
                ...currentChapterData,
                ...data,
                updatedAt: Date.now(),
                visited: true // Always true if updating
            };

            // If we are updating progress, also update lastChapter and lastSectionIndex
            const newData: ProgressData = {
                ...prev,
                lastChapter: chapterId,
                lastSectionIndex: data.currentSectionIndex ?? prev.lastSectionIndex,
                chapters: {
                    ...prev.chapters,
                    [chapterId]: updatedChapterData
                }
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            return newData;
        });
    }, []);

    return { progress, updateChapterProgress };
}
