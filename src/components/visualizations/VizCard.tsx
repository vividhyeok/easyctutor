'use client';

import React from 'react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface VizCardProps {
    title: string;
    step?: number;
    totalSteps?: number;
    onPrev?: () => void;
    onNext?: () => void;
    onReset?: () => void;
    nextLabel?: string;
    nextDisabled?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function VizCard({
    title,
    step,
    totalSteps,
    onPrev,
    onNext,
    onReset,
    nextLabel = '다음',
    nextDisabled = false,
    children,
    className = '',
}: VizCardProps) {
    const hasControls = onNext || onPrev || onReset;
    const hasStep = step !== undefined && totalSteps !== undefined;

    return (
        <div className={`w-full my-8 bg-white rounded-sm border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] ${className}`}>
            {/* Header — matches CodePlayground */}
            <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b-2 border-stone-800 bg-[#f5f5f4]">
                <div className="flex items-center gap-2 md:gap-4">
                    <span className="font-heading font-bold text-sm md:text-lg text-stone-800 tracking-tight">{title}</span>
                    {hasStep && (
                        <span className="font-mono text-[10px] md:text-xs font-bold text-stone-400 bg-stone-200 px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                            STEP {step} / {totalSteps}
                        </span>
                    )}
                </div>

                {hasControls && (
                    <div className="flex items-center gap-1 md:gap-2">
                        {onPrev && (
                            <button
                                type="button"
                                onClick={onPrev}
                                className="p-1 md:p-1.5 rounded-md hover:bg-stone-200 text-stone-600 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        )}
                        {onNext && (
                            <button
                                type="button"
                                onClick={onNext}
                                disabled={nextDisabled}
                                className="p-1 md:p-1.5 rounded-md hover:bg-stone-200 text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        )}
                        {(onPrev || onNext) && onReset && (
                            <div className="h-5 w-0.5 bg-stone-300 mx-0.5"></div>
                        )}
                        {onReset && (
                            <button
                                type="button"
                                onClick={onReset}
                                className="p-1 px-2 text-stone-500 hover:text-stone-900 transition-colors"
                                title="처음으로"
                            >
                                <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                        )}
                        {onNext && (
                            <>
                                <div className="h-5 w-0.5 bg-stone-300 mx-0.5"></div>
                                <button
                                    type="button"
                                    onClick={onNext}
                                    disabled={nextDisabled}
                                    className={`flex items-center gap-1 px-2 py-1 md:px-4 md:py-1.5 rounded-full border-2 text-xs md:text-sm font-bold transition-all ${nextDisabled
                                        ? 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed'
                                        : 'bg-yellow-400 border-stone-900 text-stone-900 hover:bg-yellow-300'
                                    }`}
                                >
                                    <span className="font-heading hidden sm:inline">{nextDisabled ? '완료' : nextLabel}</span>
                                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4 sm:hidden" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="bg-[#fffdf5] p-4 md:p-6 font-body">
                {children}
            </div>
        </div>
    );
}
