'use client';

import { useEffect, useRef } from 'react';
import { useReadingProgress } from '@/hooks/useProgress';

// Simple throttle implementation if we don't want to install lodash
function simpleThrottle(func: (...args: any[]) => void, limit: number) {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

export function ChapterController({ chapterId }: { chapterId: string }) {
    const { updateChapterProgress, progress } = useReadingProgress();
    const isInitialMount = useRef(true);

    // Scroll Restoration
    useEffect(() => {
        if (!progress) return; // Wait for hydration

        // Only restore on first mount/chapter change if not already at top (browser might handle it)
        // Actually next.js scroll restoration is tricky. 
        // We'll rely on our manual restore if meaningful.
        const chapterData = progress.chapters[chapterId];
        if (chapterData && chapterData.scrollRatio > 0 && isInitialMount.current) {
            // A small delay to ensure content layout
            setTimeout(() => {
                const height = document.documentElement.scrollHeight - window.innerHeight;
                window.scrollTo({
                    top: height * chapterData.scrollRatio,
                    behavior: 'smooth'
                });
            }, 100);
        }
        isInitialMount.current = false;
    }, [chapterId, progress]); // Dependency on progress ensures we have data

    // Scroll Tracking
    useEffect(() => {
        const handleScroll = simpleThrottle(() => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            const totalScrollable = docHeight - windowHeight;
            const ratio = totalScrollable > 0 ? scrollTop / totalScrollable : 1;

            const isCompleted = ratio > 0.85;

            // Optimized: Only update if significant change or completion status changes?
            // For simplicity, we just update the throttled value.
            updateChapterProgress(chapterId, {
                scrollRatio: ratio,
                completed: isCompleted ? true : undefined // undefined to merge with existing true if simpler
            });

            // If completed, ensure it stays completed (logic is in hook, but let's be explicit)
            // Hook logic: ...currentChapterData, ...data. 
            // We pass { completed: true } only if currently true. 
            // If we want to strictly set true once true, we should handle that in the hook or here by checking previous state.
            // The hook logic `completed: false` default might override if we pass `completed: false`.
            // Let's passed `completed: true` only when condition is met. 
            // However, if user scrolls up, we don't want to un-complete.
            // So we should read current completion status? 
            // Actually the `updateChapterProgress` implementation spreads `...currentChapterData` then `...data`.
            // So if we pass `completed: true`, it overwrites. If we don't pass `completed`, it keeps old value.
            // So passing `completed: ratio > 0.85 ? true : undefined` works perfectly if we want to set it to true.
            // But `undefined` in object literal? JSON.stringify handles it? No, spread handles it? 
            // { ...a, b: undefined } -> b is undefined. 
            // We need to conditionally add the property.

            const updatePayload: any = { scrollRatio: ratio };
            if (isCompleted) {
                updatePayload.completed = true;
            }
            updateChapterProgress(chapterId, updatePayload);

        }, 500);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [chapterId, updateChapterProgress]);

    return null; // Logic only component
}
