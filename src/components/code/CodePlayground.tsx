'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Play, RotateCcw, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

const SPEEDS = [
    { label: '느리게', ms: 2500 },
    { label: '보통', ms: 1500 },
    { label: '빠르게', ms: 700 },
] as const;
type SpeedIndex = 0 | 1 | 2;

interface CodePlaygroundProps {
    code: string;
    language?: string;
    visualizer?: React.ReactNode;
    simulationSteps?: number[];
    onStepChange?: (stepIndex: number, currentLine: number) => void;
    outputLines?: string[];
    title?: string;
}

const EMPTY_SIMULATION_STEPS: number[] = [];

export function CodePlayground({
    code,
    language = 'c',
    visualizer,
    simulationSteps = EMPTY_SIMULATION_STEPS,
    onStepChange,
    outputLines = [],
    title = '예제 코드',
}: CodePlaygroundProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [speedIndex, setSpeedIndex] = useState<SpeedIndex>(1); // 기본: 보통
    const lines = useMemo(() => code.trim().split('\n'), [code]);
    const [activeLineNumber, setActiveLineNumber] = useState<number | null>(null);
    const prefersReducedMotion = useReducedMotion();

    const effectiveSteps = useMemo(() => (
        simulationSteps.length > 0
            ? simulationSteps
            : Array.from({ length: lines.length }, (_, i) => i + 1)
    ), [lines.length, simulationSteps]);

    const intervalMs = prefersReducedMotion ? 3000 : SPEEDS[speedIndex].ms;

    const reset = useCallback(() => {
        setIsPlaying(false);
        setCurrentStepIndex(-1);
        setActiveLineNumber(null);
        onStepChange?.(-1, -1);
    }, [onStepChange]);

    const nextStep = useCallback(() => {
        if (currentStepIndex >= effectiveSteps.length - 1) {
            setIsPlaying(false);
            return;
        }
        const next = currentStepIndex + 1;
        setCurrentStepIndex(next);
        const lineNum = effectiveSteps[next];
        setActiveLineNumber(lineNum);
        onStepChange?.(next, lineNum);
    }, [currentStepIndex, effectiveSteps, onStepChange]);

    const manualStep = useCallback((direction: 'prev' | 'next') => {
        setIsPlaying(false);
        let next = direction === 'next' ? currentStepIndex + 1 : currentStepIndex - 1;
        if (next < -1) next = -1;
        if (next >= effectiveSteps.length) next = effectiveSteps.length - 1;
        if (next !== currentStepIndex) {
            setCurrentStepIndex(next);
            if (next === -1) {
                setActiveLineNumber(null);
                onStepChange?.(-1, -1);
                return;
            }
            const lineNum = effectiveSteps[next];
            setActiveLineNumber(lineNum);
            onStepChange?.(next, lineNum);
        }
    }, [currentStepIndex, effectiveSteps, onStepChange]);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = window.setInterval(nextStep, intervalMs);
        return () => window.clearInterval(interval);
    }, [isPlaying, nextStep, intervalMs]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) setIsPlaying(false);
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const lineProps = (lineNumber: number) => {
        const isActive = lineNumber === activeLineNumber;
        return {
            style: {
                display: 'block',
                width: '100%',
                minWidth: 'max-content',
                backgroundColor: isActive ? 'rgba(234, 179, 8, 0.2)' : undefined,
                borderLeft: isActive ? '3px solid #eab308' : '3px solid transparent',
                transition: 'background-color 0.2s',
                paddingLeft: '1rem',
                paddingRight: '1rem',
            },
        };
    };

    return (
        <div data-learning-interactive className="w-full my-8 bg-white rounded-sm border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between px-2 py-2 md:px-4 md:py-3 border-b-2 border-stone-800 bg-[#f5f5f4] gap-2">
                <div className="flex items-center gap-2 md:gap-4">
                    <span className="font-heading font-bold text-sm md:text-lg text-stone-800 tracking-tight">{title}</span>
                    <span className="font-mono text-[10px] md:text-xs font-bold text-stone-400 bg-stone-200 px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                        STEP {currentStepIndex + 1} / {effectiveSteps.length}
                    </span>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                    {/* Speed Control */}
                    <div className="hidden sm:flex items-center gap-0.5 mr-1 md:mr-2 bg-stone-200 rounded-full p-0.5">
                        {SPEEDS.map((s, i) => (
                            <button
                                key={s.label}
                                type="button"
                                onClick={() => setSpeedIndex(i as SpeedIndex)}
                                className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold transition-all ${speedIndex === i ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-800'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="h-5 md:h-6 w-0.5 bg-stone-300 mx-0.5 hidden sm:block"></div>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-0.5 md:gap-1 mr-1 md:mr-2">
                        <button
                            type="button"
                            onClick={() => manualStep('prev')}
                            disabled={currentStepIndex < 0}
                            aria-label="이전 실행 단계"
                            className="p-1 md:p-1.5 rounded-md hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => manualStep('next')}
                            disabled={currentStepIndex >= effectiveSteps.length - 1}
                            aria-label="다음 실행 단계"
                            className="p-1 md:p-1.5 rounded-md hover:bg-stone-200 text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>

                    <div className="h-5 md:h-6 w-0.5 bg-stone-300 mx-0.5 md:mx-1"></div>

                    <button
                        type="button"
                        onClick={reset}
                        className="p-1 px-2 md:px-3 text-xs md:text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors font-body"
                    >
                        <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    <button
                        type="button"
                        aria-label={isPlaying ? '자동 실행 일시정지' : '자동 실행 시작'}
                        onClick={() => {
                            if (currentStepIndex >= effectiveSteps.length - 1) {
                                reset();
                                setTimeout(() => setIsPlaying(true), 100);
                            } else {
                                setIsPlaying(!isPlaying);
                            }
                        }}
                        className={`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-full border-2 text-xs md:text-sm font-bold shadow-sm transition-all active:translate-y-0.5 ${isPlaying
                            ? 'bg-white border-stone-800 text-stone-800 hover:bg-stone-100'
                            : 'bg-yellow-400 border-stone-900 text-stone-900 hover:bg-yellow-300'
                        }`}
                    >
                        {isPlaying ? (
                            <>
                                <Pause className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                <span className="font-heading hidden sm:inline">멈춤</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                <span className="font-heading hidden sm:inline">자동 실행</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`flex min-w-0 flex-col md:flex-row ${visualizer ? 'min-h-[350px] md:min-h-[500px]' : ''}`}>
                {/* Code Panel */}
                <div className={`flex-1 min-w-0 relative bg-[#1e1e1e] ${visualizer ? 'md:border-r-2 border-stone-800' : ''}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-700 to-transparent opacity-20 z-10"></div>
                    <div className="overflow-auto custom-scrollbar h-full">
                        <SyntaxHighlighter
                            language={language}
                            style={vscDarkPlus}
                            showLineNumbers={true}
                            wrapLines={true}
                            lineProps={lineProps}
                            customStyle={{
                                margin: 0,
                                padding: '2rem 1rem',
                                background: 'transparent',
                                fontSize: '15px',
                                fontFamily: 'D2Coding, Consolas, monospace',
                                lineHeight: '1.7',
                                minWidth: 'max-content',
                            }}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                </div>

                {/* Visual / Output Panel */}
                {(visualizer || outputLines.length > 0) && (
                    <div className="flex-1 min-w-0 bg-[#fffdf5] flex flex-col relative overflow-x-auto overflow-y-visible">
                        {visualizer ? (
                            <div className="flex-1 relative min-w-0 overflow-x-auto overflow-y-visible flex items-center justify-center p-4 md:p-6 font-body">
                                {visualizer}
                            </div>
                        ) : (
                            <div className="flex-1 p-6 font-mono text-sm text-stone-800 overflow-y-auto bg-[#f8f6f1]">
                                <div className="text-xs font-bold text-stone-400 mb-3 pb-2 border-b border-stone-300 font-sans tracking-widest">CONSOLE OUTPUT</div>
                                {outputLines.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 opacity-30 gap-2">
                                        <Play className="w-8 h-8 text-stone-400" />
                                        <span className="text-stone-500 font-hand">실행 버튼을 눌러보세요</span>
                                    </div>
                                ) : (
                                    outputLines.map((line, idx) => (
                                        <div key={idx} className="mb-1.5">{line}</div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
