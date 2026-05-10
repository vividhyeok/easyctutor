'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodePlayground } from '../code/CodePlayground';
import { ArrowUp } from 'lucide-react';

export function ArraySumViz() {
    const code = `#include <stdio.h>

int main(void) {
    int a[5] = {3, 5, 2, 8, 1};
    int sum = 0;

    for (int i = 0; i < 5; i++) {
        sum += a[i];
    }

    printf("%d", sum);
    return 0;
}`;

    const simulationSteps = [
        4, 5,       // Init
        7, 8,       // i=0
        7, 8,       // i=1
        7, 8,       // i=2
        7, 8,       // i=3
        7, 8,       // i=4
        7, 11       // Finish
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [data] = useState([3, 5, 2, 8, 1]);
    const [sum, setSum] = useState(0);
    const [activeIndex, setActiveIndex] = useState(-1);
    // flyKey increments each time a new addition fires, to re-trigger the particle
    const [flyKey, setFlyKey] = useState(0);
    const [flyValue, setFlyValue] = useState<number | null>(null);

    const handleStepChange = (stepIndex: number, line: number) => {
        setCurrentStep(stepIndex);

        if (stepIndex <= 1) {
            setSum(0);
            setActiveIndex(-1);
            return;
        }

        if (stepIndex >= 2 && stepIndex < 2 + 5 * 2) {
            const loopStep = stepIndex - 2;
            const index = Math.floor(loopStep / 2);
            const isAdding = loopStep % 2 === 1;

            setActiveIndex(index);

            const prevSum = data.slice(0, index).reduce((a, b) => a + b, 0);
            if (isAdding) {
                setSum(prevSum + data[index]);
                setFlyValue(data[index]);
                setFlyKey(k => k + 1);
            } else {
                setSum(prevSum);
            }
        }

        if (stepIndex >= 2 + 5 * 2) {
            setSum(data.reduce((a, b) => a + b, 0));
            setActiveIndex(5);
        }
    };

    return (
        <CodePlayground
            code={code}
            title="패턴 1: 합계 구하기"
            simulationSteps={simulationSteps}
            onStepChange={handleStepChange}
            visualizer={
                // outer container is `relative` and `overflow-visible`
                // so the flying particle can animate freely between array and sum
                <div className="flex flex-col items-center justify-center w-full h-full gap-6 md:gap-10 relative px-2 md:px-0">

                    {/* Flying "+value" particle — sibling of both array and sum, free from any overflow clip */}
                    <AnimatePresence>
                        {flyValue !== null && (
                            <motion.div
                                key={flyKey}
                                className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-20 font-mono font-bold text-yellow-600 text-xl md:text-2xl"
                                initial={{ top: '20%', opacity: 1, scale: 1 }}
                                animate={{ top: '72%', opacity: 0, scale: 0.7 }}
                                exit={{}}
                                transition={{ duration: 0.7, ease: 'easeIn' }}
                                onAnimationComplete={() => setFlyValue(null)}
                            >
                                +{flyValue}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Array Memory Block */}
                    <div className="flex w-full justify-start sm:justify-center gap-1 md:gap-2 p-2 md:p-4 bg-stone-100 rounded-xl border border-stone-200/50 shadow-inner pb-8">
                        {data.map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 md:gap-2 relative flex-shrink-0">
                                <div className={`w-9 h-9 md:w-12 md:h-12 flex items-center justify-center bg-white border-2 rounded-lg font-heading font-bold text-sm md:text-lg transition-colors duration-300 ${
                                    i === activeIndex ? 'border-yellow-400 text-stone-900 bg-yellow-50' : 'border-stone-200 text-stone-400'
                                }`}>
                                    {val}
                                </div>
                                <span className="text-[10px] md:text-xs text-stone-500 font-mono">a[{i}]</span>

                                {/* Pointer Arrow — lives inside the array block's relative cell */}
                                {i === activeIndex && (
                                    <motion.div
                                        layoutId="pointer"
                                        className="absolute -top-7 md:-top-8 text-yellow-500"
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] md:text-xs font-bold mb-0.5">i</span>
                                            <ArrowUp className="rotate-180 w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Sum Variable Box */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white border-2 border-stone-300 rounded-xl md:rounded-2xl flex flex-col items-center justify-center shadow-lg relative">
                            <span className="text-stone-400 text-[10px] md:text-xs font-mono absolute top-1.5 left-2 md:top-2 md:left-3">sum</span>
                            <motion.span
                                key={sum}
                                initial={{ scale: 1.2, color: '#eab308' }}
                                animate={{ scale: 1, color: '#1c1917' }}
                                className="text-2xl md:text-4xl font-heading font-black"
                            >
                                {sum}
                            </motion.span>
                        </div>
                        <p className="mt-2 md:mt-3 text-stone-500 font-sans text-xs md:text-sm h-5 text-center">
                            {activeIndex === -1 ? '변수 초기화 중...' :
                                activeIndex < 5 ? `a[${activeIndex}] 값을 sum에 더합니다.` :
                                    '모든 덧셈이 완료되었습니다.'}
                        </p>
                    </div>
                </div>
            }
        />
    );
}
