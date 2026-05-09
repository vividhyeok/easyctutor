import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import { Chapter, ChapterSection, ChapterSummary, Section } from './types';

export type { Chapter, ChapterSection, ChapterSummary, Section };

const CONTENT_DIR = path.join(process.cwd(), 'content');
const CHAPTERS_DIR = path.join(CONTENT_DIR, 'chapters');
const LEGACY_CONTENT_PATHS = [
    path.join(CONTENT_DIR, 'tutoring.md'),
    path.join(process.cwd(), 'tutoring.md'),
];

let cachedChapters: Chapter[] | null = null;

export function getAllChapters(): ChapterSummary[] {
    return getChapterSummaries();
}

export function getChapterSummaries(): ChapterSummary[] {
    return getChapters().map(toChapterSummary);
}

export function getChapter(id: string): Chapter | undefined {
    return getChapters().find((chapter) => chapter.id === id || chapter.slug === id);
}

export function getChapterNavigation(id: string): {
    previousChapter?: ChapterSummary;
    nextChapter?: ChapterSummary;
} {
    const chapters = getChapterSummaries();
    const currentIndex = chapters.findIndex((chapter) => chapter.id === id || chapter.slug === id);

    return {
        previousChapter: currentIndex > 0 ? chapters[currentIndex - 1] : undefined,
        nextChapter: currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : undefined,
    };
}

export function getTableOfContents(markdownContent: string): Section[] {
    return buildChapterSections(markdownContent).map(toSectionSummary);
}

function getChapters(): Chapter[] {
    if (process.env.NODE_ENV === 'development') {
        return loadChapters();
    }

    if (!cachedChapters) {
        cachedChapters = loadChapters();
    }

    return cachedChapters;
}

function loadChapters(): Chapter[] {
    const chapterFiles = getChapterFiles();
    const chapters = chapterFiles.length > 0
        ? chapterFiles.map((filePath, index) => parseChapterDocument(
            fs.readFileSync(filePath, 'utf-8'),
            {
                fileName: path.basename(filePath),
                fallbackOrder: index,
            },
        )).filter(isChapter)
        : parseLegacyContent();

    return chapters.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id, undefined, { numeric: true }));
}

function getChapterFiles(): string[] {
    if (!fs.existsSync(CHAPTERS_DIR)) {
        return [];
    }

    return fs.readdirSync(CHAPTERS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('_'))
        .map((entry) => path.join(CHAPTERS_DIR, entry.name))
        .sort((a, b) => {
            const aOrder = getOrderFromFileName(path.basename(a));
            const bOrder = getOrderFromFileName(path.basename(b));

            if (aOrder !== undefined && bOrder !== undefined && aOrder !== bOrder) {
                return aOrder - bOrder;
            }

            return path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true });
        });
}

function parseLegacyContent(): Chapter[] {
    const legacyPath = LEGACY_CONTENT_PATHS.find((contentPath) => fs.existsSync(contentPath));

    if (!legacyPath) {
        console.warn('No chapter content found. Add Markdown files to content/chapters.');
        return [];
    }

    const fileContent = fs.readFileSync(legacyPath, 'utf-8');
    const matches = Array.from(fileContent.matchAll(/^#\s+.+$/gm))
        .filter((match) => /^\d+/.test(match[0].replace(/^#\s+/, '')));

    return matches.map((match, index) => {
        const startIndex = match.index ?? 0;
        const nextMatch = matches[index + 1];
        const endIndex = nextMatch?.index ?? fileContent.length;
        const chapterContent = fileContent.slice(startIndex, endIndex).trim();

        return parseChapterDocument(chapterContent, {
            fileName: path.basename(legacyPath),
            fallbackOrder: index,
        });
    }).filter(isChapter);
}

function parseChapterDocument(rawMarkdown: string, context: { fileName: string; fallbackOrder: number }): Chapter | null {
    const { data, content } = matter(rawMarkdown);
    const headingMatch = content.match(/^#\s+(.+)$/m);

    if (!headingMatch) {
        console.warn(`Skipping ${context.fileName}: missing top-level chapter heading.`);
        return null;
    }

    const heading = headingMatch[1].trim();
    const headingInfo = parseChapterHeading(heading);
    const fileOrder = getOrderFromFileName(context.fileName);
    const order = readNumber(data.order) ?? headingInfo.order ?? fileOrder ?? context.fallbackOrder;
    const id = readString(data.id) ?? String(headingInfo.order ?? fileOrder ?? context.fallbackOrder);
    const slug = readString(data.slug) ?? id;
    const displayTitle = readString(data.title) ?? headingInfo.displayTitle;
    const title = readString(data.navTitle) ?? (headingInfo.order === undefined ? `${id}장. ${displayTitle}` : heading);
    const contentBody = content.replace(/^#\s+.+\r?\n?/m, '').trim();

    return {
        id,
        title,
        displayTitle,
        slug,
        order,
        content: contentBody,
        sections: buildChapterSections(contentBody),
    };
}

function buildChapterSections(markdownContent: string): ChapterSection[] {
    const slugger = new GithubSlugger();
    const chunks = splitMarkdownSections(markdownContent);

    return chunks.map((sectionContent, index) => {
        const headingMatch = sectionContent.match(/^##\s+(.+)$/m);
        const title = headingMatch?.[1].trim() ?? `Section ${index + 1}`;

        return {
            id: headingMatch ? slugger.slug(title) : `section-${index + 1}`,
            title,
            level: headingMatch ? 2 : 0,
            index,
            content: sectionContent,
        };
    });
}

function splitMarkdownSections(markdownContent: string): string[] {
    const trimmedContent = markdownContent.trim();

    if (!trimmedContent) {
        return [];
    }

    return trimmedContent
        .split(/\r?\n\s*---\s*\r?\n/)
        .map((section) => section.trim())
        .filter(Boolean);
}

function parseChapterHeading(heading: string): { order?: number; displayTitle: string } {
    const numberMatch = heading.match(/^(\d+)/);
    const displayTitle = heading.replace(/^\d+\s*(?:장)?\.?\s*/u, '').trim();

    return {
        order: numberMatch ? Number(numberMatch[1]) : undefined,
        displayTitle: displayTitle || heading,
    };
}

function getOrderFromFileName(fileName: string): number | undefined {
    const match = fileName.match(/^(\d+)/);
    return match ? Number(match[1]) : undefined;
}

function toChapterSummary(chapter: Chapter): ChapterSummary {
    return {
        id: chapter.id,
        title: chapter.title,
        displayTitle: chapter.displayTitle,
        slug: chapter.slug,
        order: chapter.order,
        sections: chapter.sections.map(toSectionSummary),
    };
}

function toSectionSummary(section: ChapterSection): Section {
    return {
        id: section.id,
        title: section.title,
        level: section.level,
        index: section.index,
    };
}

function readString(value: unknown): string | undefined {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
    }

    if (typeof value === 'number') {
        return String(value);
    }

    return undefined;
}

function readNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
}

function isChapter(chapter: Chapter | null): chapter is Chapter {
    return chapter !== null;
}
