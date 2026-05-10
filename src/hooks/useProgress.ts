'use client';

import { useCallback, useSyncExternalStore } from 'react';

export interface ChapterProgress {
    visited: boolean;
    completed: boolean;
    scrollRatio: number;
    currentSectionIndex?: number;
    lastAnchor?: string;
    updatedAt: number;
}

export interface ProgressData {
    lastChapter: string;
    lastSectionIndex?: number;
    chapters: Record<string, ChapterProgress>;
}

const STORAGE_KEY = 'c_tutoring_progress_v1';
const INITIAL_PROGRESS: ProgressData = { lastChapter: '0', chapters: {} };

let memoryProgress: ProgressData = INITIAL_PROGRESS;
let hasLoadedStorage = false;
const listeners = new Set<() => void>();

export function useReadingProgress() {
    const progress = useSyncExternalStore(
        subscribeToProgress,
        getProgressSnapshot,
        getServerProgressSnapshot,
    );

    const updateChapterProgress = useCallback((chapterId: string, data: Partial<ChapterProgress>) => {
        const prev = getProgressSnapshot();
        const currentChapterData = prev.chapters[chapterId] ?? createEmptyChapterProgress();
        const patch = stripUndefined(data);
        const nextChapterData: ChapterProgress = {
            ...currentChapterData,
            ...patch,
            completed: Boolean(currentChapterData.completed || patch.completed),
            scrollRatio: clampProgressRatio(patch.scrollRatio ?? currentChapterData.scrollRatio),
            updatedAt: Date.now(),
            visited: true,
        };

        const nextProgress: ProgressData = {
            ...prev,
            lastChapter: chapterId,
            lastSectionIndex: patch.currentSectionIndex ?? prev.lastSectionIndex,
            chapters: {
                ...prev.chapters,
                [chapterId]: nextChapterData,
            },
        };

        persistProgress(nextProgress);
    }, []);

    const resetProgress = useCallback(() => {
        persistProgress(INITIAL_PROGRESS);
    }, []);

    return { progress, updateChapterProgress, resetProgress };
}

function subscribeToProgress(listener: () => void) {
    listeners.add(listener);

    const handleStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY) {
            return;
        }

        memoryProgress = normalizeProgress(parseProgress(event.newValue));
        hasLoadedStorage = true;
        emitProgressChange();
    };

    if (typeof window !== 'undefined') {
        window.addEventListener('storage', handleStorage);
    }

    return () => {
        listeners.delete(listener);
        if (typeof window !== 'undefined') {
            window.removeEventListener('storage', handleStorage);
        }
    };
}

function getProgressSnapshot(): ProgressData {
    if (!hasLoadedStorage && typeof window !== 'undefined') {
        memoryProgress = normalizeProgress(parseProgress(window.localStorage.getItem(STORAGE_KEY)));
        hasLoadedStorage = true;

        if (!window.localStorage.getItem(STORAGE_KEY)) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryProgress));
        }
    }

    return memoryProgress;
}

function getServerProgressSnapshot(): ProgressData {
    return INITIAL_PROGRESS;
}

function persistProgress(nextProgress: ProgressData) {
    memoryProgress = normalizeProgress(nextProgress);
    hasLoadedStorage = true;

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryProgress));
    }

    emitProgressChange();
}

function emitProgressChange() {
    listeners.forEach((listener) => listener());
}

function parseProgress(rawValue: string | null): unknown {
    if (!rawValue) {
        return INITIAL_PROGRESS;
    }

    try {
        return JSON.parse(rawValue);
    } catch {
        return INITIAL_PROGRESS;
    }
}

function normalizeProgress(value: unknown): ProgressData {
    if (!isRecord(value)) {
        return INITIAL_PROGRESS;
    }

    const chaptersValue = isRecord(value.chapters) ? value.chapters : {};
    const chapters: Record<string, ChapterProgress> = {};

    Object.entries(chaptersValue).forEach(([chapterId, chapterValue]) => {
        if (!isRecord(chapterValue)) {
            return;
        }

        chapters[chapterId] = {
            visited: Boolean(chapterValue.visited),
            completed: Boolean(chapterValue.completed),
            scrollRatio: clampProgressRatio(readNumber(chapterValue.scrollRatio) ?? 0),
            currentSectionIndex: readNumber(chapterValue.currentSectionIndex),
            lastAnchor: typeof chapterValue.lastAnchor === 'string' ? chapterValue.lastAnchor : undefined,
            updatedAt: readNumber(chapterValue.updatedAt) ?? 0,
        };
    });

    return {
        lastChapter: typeof value.lastChapter === 'string' ? value.lastChapter : INITIAL_PROGRESS.lastChapter,
        lastSectionIndex: readNumber(value.lastSectionIndex),
        chapters,
    };
}

function createEmptyChapterProgress(): ChapterProgress {
    return {
        visited: false,
        completed: false,
        scrollRatio: 0,
        updatedAt: 0,
    };
}

function stripUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
    ) as Partial<T>;
}

function clampProgressRatio(value: number): number {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.min(1, Math.max(0, value));
}

function readNumber(value: unknown): number | undefined {
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}
