import Link from 'next/link';
import { getAllChapters } from '@/lib/content';
import { PaperCard } from '@/components/PaperCard';
import { BookOpen, ArrowRight } from 'lucide-react';
import { HomeChapterList } from '@/components/HomeChapterList'; // We'll create a client component for the progress-aware list

export default function HomePage() {
  const chapters = getAllChapters();

  return (
    <main className="min-h-screen p-4 md:p-16 flex flex-col items-center justify-center max-w-6xl mx-auto">
      <div className="text-center mb-10 md:mb-16 space-y-4 md:space-y-6">
        <h1 className="font-heading font-black text-4xl md:text-7xl text-gray-900 mb-6 md:mb-8 tracking-tight">
          쉬운 C언어
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 font-sans max-w-3xl mx-auto leading-relaxed font-light">
          IDE를 켜두고 <strong className="font-bold text-gray-900">직접 코드를 따라 치며</strong> 학습하세요.<br className="hidden md:block" />
          가장 빠르고 확실한 C언어 입문 가이드입니다.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <HomeChapterList chapters={chapters} />
      </div>
    </main>
  );
}
