'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepVisualizerProps {
    totalSteps: number;
    currentStep: number;
    onStepChange: (step: number) => void;
    title?: string;
    children: React.ReactNode;
    autoPlayInterval?: number;
}

export function StepVisualizer({
    totalSteps,
    currentStep,
    onStepChange,
    title,
    children,
    autoPlayInterval = 2000,
}: StepVisualizerProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const nextStep = useCallback(() => {
        if (currentStep < totalSteps - 1) {
            onStepChange(currentStep + 1);
        } else {
            setIsPlaying(false); // Stop when reaching the end
        }
    }, [currentStep, totalSteps, onStepChange]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            onStepChange(currentStep - 1);
        }
    }, [currentStep, onStepChange]);

    const reset = useCallback(() => {
        onStepChange(0);
        setIsPlaying(false);
    }, [onStepChange]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                nextStep();
            }, autoPlayInterval);
        }
        return () => clearInterval(interval);
    }, [isPlaying, nextStep, autoPlayInterval]);

    return (
        <div className="w-full max-w-2xl mx-auto my-12 border border-stone-200 bg-[#fdfbf7] rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
                <h4 className="font-heading font-semibold text-stone-700">{title || '시각화 흐름'}</h4>
                <div className="text-sm font-sans text-stone-400">
                    단계 <span className="text-stone-900 font-medium">{currentStep + 1}</span> / {totalSteps}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden">
                {children}
            </div>

            {/* Controls */}
            <div className="px-6 py-4 bg-stone-50/50 border-t border-stone-200 flex items-center justify-center gap-4">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="p-2 text-stone-500 hover:text-stone-900 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="이전 단계"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 flex items-center justify-center bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
                    title={isPlaying ? "일시정지" : "재생"}
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                    onClick={nextStep}
                    disabled={currentStep === totalSteps - 1}
                    className="p-2 text-stone-500 hover:text-stone-900 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="다음 단계"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <button
                    onClick={reset}
                    className="absolute right-6 p-2 text-stone-400 hover:text-stone-600 transition-colors"
                    title="처음부터"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
