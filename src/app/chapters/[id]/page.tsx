import React from 'react';
import { notFound } from 'next/navigation';
import { getAllChapters, getChapter } from '@/lib/content';
import { ChapterController } from '@/components/ChapterController';
import { SectionNavigator } from '@/components/SectionNavigator';
import { PaperCard } from '@/components/PaperCard';
import { ProgressBar } from '@/components/ProgressBar';
import { TableOfContents } from '@/components/TableOfContents';
import { getTableOfContents } from '@/lib/content';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const chapters = getAllChapters();
    return chapters.map((chapter) => ({
        id: chapter.id,
    }));
}

export default async function ChapterPage({ params }: PageProps) {
    const { id } = await params;
    const chapter = getChapter(id);

    if (!chapter) {
        return notFound();
    }

    const toc = getTableOfContents(chapter.content);

    return (
        <>
            <ProgressBar />
            <ChapterController chapterId={chapter.id} />
            <div className="flex flex-col items-center justify-center p-2 md:p-8 lg:p-12">
                {/* Main Content */}
                <div className="w-full max-w-4xl shrink-0">
                    <PaperCard>
                        <header className="pb-3 border-b border-gray-200">
                            <span className="text-yellow-600 font-bold tracking-widest uppercase text-xs block">
                                Chapter {chapter.id}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 leading-tight mt-0">
                                {chapter.title.replace(/^\d+장\.?\s*/, '')}
                            </h1>
                        </header>
                        <div className="prose prose-xl prose-slate max-w-none text-gray-800 leading-relaxed">
                            <SectionNavigator chapterId={chapter.id} content={chapter.content} />
                        </div>
                    </PaperCard>
                </div>
            </div>
        </>
    );
}
