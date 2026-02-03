'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodePlayground } from '../code/CodePlayground';
import { ArrowUp } from 'lucide-react';

export function ArrayReverseViz() {
    const code = `#include <stdio.h>

int main(void) {
    int a[5] = {10, 20, 30, 40, 50};

    for (int i = 4; i >= 0; i--) {
        printf("%d ", a[i]);
    }
    
    return 0;
}`;

    // Steps:
    // 4: Init
    // 6: Loop (i=4)
    // 7: Print
    // 6: Loop (i=3)
    // 7: Create...

    const simulationSteps = [
        4,
        6, 7, // i=4
        6, 7, // i=3
        6, 7, // i=2
        6, 7, // i=1
        6, 7, // i=0
        6, 9  // End
    ];

    const [data] = useState([10, 20, 30, 40, 50]);
    const [output, setOutput] = useState<number[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    const handleStepChange = (stepIndex: number) => {
        // Reset
        if (stepIndex === 0) {
            setOutput([]);
            setActiveIndex(-1);
            return;
        }

        // Pattern: 1 + (step * 2) is check/update, +1 is Print
        // i starts at 4, decrements

        if (stepIndex >= 1 && stepIndex < 1 + 5 * 2) {
            const loopStep = stepIndex - 1;
            const index = 4 - Math.floor(loopStep / 2);
            const isPrinting = loopStep % 2 === 1;

            setActiveIndex(index);

            if (isPrinting) {
                // Need to append current val if not already there for this step
                // Simple way: reconstruction
                const printedSoFar = data.slice(index + 1).reverse(); // 50, 40... if current is 3
                // logic is tricky with react state updates in sequence.
                // Better to just set explicit state based on index
                // If i=4, output [50]
                // If i=3, output [50, 40]
                const newOutput = [];
                for (let k = 4; k >= index; k--) newOutput.push(data[k]);
                setOutput(newOutput);
            } else {
                // Just updated i, haven't printed yet
                const newOutput = [];
                for (let k = 4; k > index; k--) newOutput.push(data[k]);
                setOutput(newOutput);
            }
        }

        if (stepIndex === 11) {
            setActiveIndex(-1); // Done
        }
    };

    return (
        <CodePlayground
            code={code}
            title="패턴 4: 거꾸로 출력하기"
            simulationSteps={simulationSteps}
            onStepChange={handleStepChange}
            visualizer={
                <div className="flex flex-col items-center justify-center w-full h-full gap-12 relative">

                    {/* Array Block */}
                    <div className="flex gap-2 p-4 bg-stone-100 rounded-xl border border-stone-200/50">
                        {data.map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 relative">
                                <span className={`text-xs font-mono mb-1 ${i === activeIndex ? 'text-orange-500 font-bold' : 'text-stone-400'}`}>
                                    {i}
                                </span>
                                <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg font-heading font-bold text-lg transition-colors duration-300 ${i === activeIndex ? 'border-orange-400 text-stone-900 bg-orange-50' : 'border-stone-200 text-stone-400'
                                    }`}>
                                    {val}
                                </div>
                                {i === activeIndex && (
                                    <motion.div layoutId="ptr3" className="absolute -bottom-8 text-orange-500">
                                        <ArrowUp className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Output Stream */}
                    <div className="w-full px-8">
                        <div className="text-xs text-stone-400 font-mono mb-2 border-b border-stone-200 pb-1 w-full text-left">
                            CONSOLE OUTPUT
                        </div>
                        <div className="flex gap-3 bg-stone-900 text-green-400 p-4 rounded-lg font-mono text-sm h-16 items-center overflow-x-auto">
                            <AnimatePresence>
                                {output.map((val, i) => (
                                    <motion.span
                                        key={`${val}-${i}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="shrink-0"
                                    >
                                        {val}
                                    </motion.span>
                                ))}
                                {activeIndex !== -1 && (
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="w-2 h-4 bg-green-400 inline-block align-middle ml-1"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            }
        />
    );
}
