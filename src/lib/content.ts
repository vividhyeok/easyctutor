import 'server-only';
import fs from 'fs';
import path from 'path';
import GithubSlugger from 'github-slugger';
import { Chapter, Section } from './types';

export type { Chapter, Section };


const CONTENT_PATH = path.join(process.cwd(), 'content', 'tutoring.md');

// Cache the chapters to avoid re-parsing on every call during build
let cachedChapters: Chapter[] | null = null;

export function getAllChapters(): Chapter[] {
    if (cachedChapters) return cachedChapters;

    if (!fs.existsSync(CONTENT_PATH)) {
        console.warn('Content file not found at:', CONTENT_PATH);
        return [];
    }

    const fileContent = fs.readFileSync(CONTENT_PATH, 'utf-8');

    // Regex to match Chapter Headings: # 0장. 제목 OR # 1장 제목
    // Matches: #, optional space, digits, "장", optional dot, optional space, rest of line
    const chapterRegex = /^# ?(\d+)장\.? ?(.*)$/gm;

    const matches = Array.from(fileContent.matchAll(chapterRegex));
    const chapters: Chapter[] = [];

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const nextMatch = matches[i + 1];

        // index in the full string
        const startIndex = match.index!;
        const endIndex = nextMatch ? nextMatch.index! : fileContent.length;

        // Full chapter text including the heading
        const fullChapterText = fileContent.slice(startIndex, endIndex);

        // Extract title parts
        const chapterNum = match[1]; // "0", "1"...
        const chapterTitleText = match[2].trim(); // "제목"
        const fullTitle = `${chapterNum}장. ${chapterTitleText}`; // Normalize title format

        // Remove the H1 line from the content if we want to render it separately, 
        // BUT the requirement says "Each chapter page renders from that chapter's H1...".
        // Actually, usually we render the title in the Hero/Header and the rest in Markdown.
        // The prompt says: "상단: 장 제목 + 진행률 바; 본문: tutoring.md에서 파싱된 해당 장 chunk를 마크다운 렌더링"
        // So we should arguably keep the content *after* the H1. 
        // Let's remove the first line (Heading) to avoid double H1s if we render a custom Header.
        const contentBody = fullChapterText.replace(/^# .+$/m, '').trim();

        chapters.push({
            id: chapterNum,
            title: fullTitle,
            slug: chapterNum,
            content: contentBody,
        });
    }

    // Handle case where text exists *before* the first chapter? (0장 starts immediately per prompt)
    // Assuming tutoring.md starts with # 0장...

    cachedChapters = chapters;
    return chapters;
}

export function getChapter(id: string): Chapter | undefined {
    const chapters = getAllChapters();
    return chapters.find((c) => c.id === id);
}

export function getTableOfContents(markdownContent: string): Section[] {
    const slugger = new GithubSlugger();
    const headingRegex = /^## (.*)$/gm;
    const sections: Section[] = [];

    const matches = markdownContent.matchAll(headingRegex);
    for (const match of matches) {
        const title = match[1].trim();
        const slug = slugger.slug(title);
        console.log(`📋 TOC: "${title}" -> ID: "${slug}"`);
        sections.push({
            id: slug,
            title,
            level: 2
        });
    }

    return sections;
}
