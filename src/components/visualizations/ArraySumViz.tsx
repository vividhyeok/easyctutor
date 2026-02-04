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

    // Mapping steps to code lines:
    // 4: int a[5]...
    // 5: int sum = 0;
    // 7: for init (i=0)
    // 8: sum += a[i]
    // 7: for update/check
    const simulationSteps = [
        4, 5, // Init
        7, 8, // i=0
        7, 8, // i=1
        7, 8, // i=2
        7, 8, // i=3
        7, 8, // i=4
        7, 11 // Finish
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [data] = useState([3, 5, 2, 8, 1]);
    const [sum, setSum] = useState(0);
    const [activeIndex, setActiveIndex] = useState(-1);

    const handleStepChange = (stepIndex: number, line: number) => {
        setCurrentStep(stepIndex);

        // Logic to sync state with playback
        // stepIndex 0: Init array
        // stepIndex 1: Init sum = 0
        if (stepIndex <= 1) {
            setSum(0);
            setActiveIndex(-1);
        }

        // Loop steps: 2,3 (i=0), 4,5 (i=1), 6,7 (i=2)...
        // Pattern: 2 + (i * 2) is check, 2 + (i * 2) + 1 is add
        if (stepIndex >= 2 && stepIndex < 2 + 5 * 2) {
            const loopStep = stepIndex - 2;
            const index = Math.floor(loopStep / 2);
            const isAdding = loopStep % 2 === 1; // The line with sum += a[i]

            setActiveIndex(index);

            // Calculate sum up to this point
            // If isAdding is true, we just executed the addition line, so include current
            // BUT for visual smoothness, we might want to update sum only after the line?
            // Let's pre-calculate. 
            const prevSum = data.slice(0, index).reduce((a, b) => a + b, 0);
            setSum(isAdding ? prevSum + data[index] : prevSum);
        }

        if (stepIndex >= 2 + 5 * 2) {
            setSum(data.reduce((a, b) => a + b, 0));
            setActiveIndex(5); // Out of bounds
        }
    };

    return (
        <CodePlayground
            code={code}
            title="패턴 1: 합계 구하기"
            simulationSteps={simulationSteps}
            onStepChange={handleStepChange}
            visualizer={
                <div className="flex flex-col items-center justify-center w-full h-full gap-6 md:gap-12 relative px-2 md:px-0">

                    {/* Array Memory Block */}
                    <div className="flex gap-1 md:gap-2 p-2 md:p-4 bg-stone-100 rounded-xl border border-stone-200/50 shadow-inner">
                        {data.map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 md:gap-2 relative">
                                <div className={`w-9 h-9 md:w-12 md:h-12 flex items-center justify-center bg-white border-2 rounded-lg font-heading font-bold text-sm md:text-lg transition-colors duration-300 ${i === activeIndex ? 'border-yellow-400 text-stone-900 bg-yellow-50' : 'border-stone-200 text-stone-400'
                                    }`}>
                                    {val}
                                    {/* Flying Particle Animation */}
                                    <AnimatePresence>
                                        {i === activeIndex && currentStep % 2 === 1 && currentStep > 1 && (
                                            <motion.div
                                                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                                animate={{ opacity: 0, x: 0, y: 80, scale: 0.5 }}
                                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                                className="absolute inset-0 bg-yellow-400 rounded-lg z-10 opacity-50"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span className="text-[10px] md:text-xs text-stone-500 font-mono">a[{i}]</span>

                                {/* Pointer Arrow */}
                                {i === activeIndex && (
                                    <motion.div
                                        layoutId="pointer"
                                        className="absolute -top-6 md:-top-8 text-yellow-500"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] md:text-xs font-bold font-sans mb-0.5 md:mb-1">i</span>
                                            <ArrowUp className="rotate-180 w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Sum Variable Box */}
                    <div className="flex flex-col items-center relative">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white border-2 border-stone-300 rounded-xl md:rounded-2xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
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
                        <p className="mt-2 md:mt-4 text-stone-500 font-sans text-xs md:text-sm h-5 text-center">
                            {activeIndex === -1 ? "변수 초기화 중..." :
                                activeIndex < 5 ? `a[${activeIndex}] 값을 sum에 더합니다.` :
                                    "모든 덧셈이 완료되었습니다."}
                        </p>
                    </div>
                </div>
            }
        />
    );
}
