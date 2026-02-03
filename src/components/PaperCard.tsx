import { cn } from "@/lib/utils";

interface PaperCardProps {
    children: React.ReactNode;
    className?: string;
}

export function PaperCard({ children, className }: PaperCardProps) {
    return (
        <div className={cn("paper-card", className)}>
            {children}
        </div>
    );
}
