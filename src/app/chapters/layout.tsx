import { getAllChapters } from '@/lib/content';
import { Sidebar } from '@/components/Sidebar';
import { MobileDrawer } from '@/components/MobileDrawer';

export default function ChaptersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const chapters = getAllChapters();

    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden md:block shrink-0">
                <Sidebar chapters={chapters} />
            </div>

            {/* Mobile Drawer */}
            <MobileDrawer chapters={chapters} />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden pt-14 md:pt-0">
                {children}
            </main>
        </div>
    );
}
