'use client';

import { Suspense } from 'react';
import { SectionNavigator } from './SectionNavigator';

interface SectionNavigatorWrapperProps {
    chapterId: string;
    content: string;
}

export function SectionNavigatorWrapper({ chapterId, content }: SectionNavigatorWrapperProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SectionNavigator chapterId={chapterId} content={content} />
        </Suspense>
    );
}
