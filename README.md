# Static Tutoring Site

This is a static, responsive tutoring website built with Next.js, TypeScript, and Tailwind CSS. The site renders chapter-based Markdown content into a consistent learning UI with progress tracking and section navigation.

## Content Editing

The primary content source is now split by chapter:

- `content/chapters/00.md`
- `content/chapters/01.md`
- `content/chapters/02.md`
- ...

Edit the chapter file you want to change. Keep one top-level `#` heading at the top of each chapter file, and use `---` between learning sections when you want the next/previous section controls to page through the chapter.

Optional frontmatter is supported when you need to override metadata:

```md
---
id: "23"
order: 23
title: "새 챕터 제목"
navTitle: "23장. 새 챕터 제목"
---

# 23장. 새 챕터 제목
```

`content/tutoring.md` is kept only as a legacy fallback. When `content/chapters/*.md` exists, the app uses the per-chapter files.

## Features

- **Chapter File Content**: Reads individual Markdown files from `content/chapters`.
- **Static Content Generation**: Generates static chapter routes at build time.
- **Progress Tracking**: Locally tracks reading progress and scroll position using `localStorage`.
- **Responsive Design**: Mobile-friendly navigation with a drawer menu and desktop sidebar.
- **Consistent Rendering**: One Markdown renderer and shared navigation data keep the UI style consistent.
- **Table of Contents**: Sidebar sections are generated from chapter Markdown headings.

## Project Structure

- `content/chapters/*.md`: Primary chapter content files.
- `content/tutoring.md`: Legacy fallback for old single-file content.
- `src/lib/content.ts`: Content loading, parsing, section splitting, and chapter navigation.
- `src/components`: UI components such as Sidebar, MarkdownRenderer, and SectionNavigator.
- `src/app`: Next.js App Router pages.

## Getting Started

### Prerequisites

- Node.js 20.9+ recommended for the current Next.js version.

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building for Production

This project is configured for static export.

```bash
npm run build
```

The output will be in the `out/` directory.
