export interface Section {
    id: string;
    title: string;
    level: number;
    index: number;
}

export interface ChapterSection extends Section {
    content: string;
}

export interface ChapterSummary {
    id: string;
    title: string;
    displayTitle: string;
    slug: string;
    order: number;
    sections: Section[];
}

export interface Chapter extends Omit<ChapterSummary, 'sections'> {
    content: string;
    sections: ChapterSection[];
}
