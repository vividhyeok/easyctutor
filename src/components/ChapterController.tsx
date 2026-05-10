'use client';

import { useEffect, useRef } from 'react';
import { useReadingProgress, type ChapterProgress } from '@/hooks/useProgress';

function simpleThrottle(func: () => void, limit: number) {
    let inThrottle = false;

    return () => {
        if (inThrottle) {
            return;
        }

        func();
        inThrottle = true;
        window.setTimeout(() => {
            inThrottle = false;
        }, limit);
    };
}

export function ChapterController({ chapterId }: { chapterId: string }) {
    const { updateChapterProgress, progress } = useReadingProgress();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (!isInitialMount.current) {
            return;
        }

        const chapterData = progress.chapters[chapterId];
        const shouldSkipRestore = window.location.hash || window.location.search.includes('pos=');

        if (chapterData && chapterData.scrollRatio > 0.05 && !shouldSkipRestore) {
            const timer = window.setTimeout(() => {
                const height = document.documentElement.scrollHeight - window.innerHeight;
                window.scrollTo({
                    top: height * chapterData.scrollRatio,
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                });
            }, 100);

            isInitialMount.current = false;
            return () => window.clearTimeout(timer);
        }

        isInitialMount.current = false;
    }, [chapterId, progress.chapters]);

    useEffect(() => {
        const handleScroll = simpleThrottle(() => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const totalScrollable = docHeight - windowHeight;
            const ratio = totalScrollable > 0 ? scrollTop / totalScrollable : 1;
            const updatePayload: Partial<ChapterProgress> = { scrollRatio: ratio };

            if (ratio > 0.85) {
                updatePayload.completed = true;
            }

            updateChapterProgress(chapterId, updatePayload);
        }, 500);

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [chapterId, updateChapterProgress]);

    return null;
}
