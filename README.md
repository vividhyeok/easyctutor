# Static Tutoring Site

This is a static, responsive tutoring website built with Next.js 14, TypeScript, and Tailwind CSS. It is designed to render a single Markdown file (`content/tutoring.md`) into a beautiful, chapter-based learning experience.

## Features

- **Static Content Generation**: Parses `tutoring.md` at build time to generate static pages for each chapter.
- **Progress Tracking**: Locally tracks user reading progress and scroll position using `localStorage`.
- **Responsive Design**: Mobile-friendly navigation with a drawer menu and desktop sidebar.
- **Custom Styling**: "Paper-like" aesthetic with custom fonts (OmuDaye, A2z) and syntax highlighting.
- **Table of Contents**: Automatically generated TOC from markdown headings.

## Project Structure

- `content/tutoring.md`: The single source of truth for the site's content.
- `src/lib/content.ts`: Logic for parsing markdown and splitting chapters.
- `src/components`: UI components (Sidebar, MarkdownRenderer, etc.).
- `src/app`: Next.js App Router pages.

## Getting Started

### Prerequisites

- Node.js 18+ installed.

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

This project is configured for **Static Export**.

```bash
npm run build
```
The output will be in the `out/` directory.

### Deployment

You can deploy the `out/` folder to any static hosting service like GitHub Pages, Vercel, or Netlify.

**Vercel / Netlify:**
- Build Command: `npm run build`
- Output Directory: `out`

## Customization

- **Content**: Edit `content/tutoring.md`. Preserve the `# 1장. Title` format for chapter splitting.
- **Styles**: Edit `src/app/globals.css` for fonts and colors.
