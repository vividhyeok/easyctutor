'use client';

import { Suspense } from 'react';
import { SectionNavigator } from './SectionNavigator';
import type { ChapterSection } from '@/lib/types';

interface SectionNavigatorWrapperProps {
    chapterId: string;
    sections: ChapterSection[];
    previousChapterId?: string;
    nextChapterId?: string;
}

export function SectionNavigatorWrapper({
    chapterId,
    sections,
    previousChapterId,
    nextChapterId,
}: SectionNavigatorWrapperProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SectionNavigator
                chapterId={chapterId}
                sections={sections}
                previousChapterId={previousChapterId}
                nextChapterId={nextChapterId}
            />
        </Suspense>
    );
}
