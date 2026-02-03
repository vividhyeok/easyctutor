'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodePlayground } from '../code/CodePlayground';
import { ArrowUp, Crown } from 'lucide-react';

export function ArrayMaxViz() {
    const code = `#include <stdio.h>

int main(void) {
    int a[5] = {12, 45, 23, 67, 34};
    int mx = a[0];

    for (int i = 1; i < 5; i++) {
        if (a[i] > mx) {
            mx = a[i];
        }
    }
    
    printf("%d", mx);
    return 0;
}`;

    // Mapping steps:
    // 4: init array
    // 5: mx = a[0]
    // 7: for init (i=1)
    // 8: check a[i] > mx
    // 9: mx = a[i] (only if true)
    // 7: loop update

    const simulationSteps = [
        4, 5, // Init
        7, 8, 9, // i=1 (45 > 12 -> True, update)
        7, 8,    // i=2 (23 > 45 -> False)
        7, 8, 9, // i=3 (67 > 45 -> True, update)
        7, 8,    // i=4 (34 > 67 -> False)
        7, 12    // Finish
    ];

    const [data] = useState([12, 45, 23, 67, 34]);
    const [mx, setMx] = useState(12);
    const [activeIndex, setActiveIndex] = useState(0);
    const [comparison, setComparison] = useState<{ val: number, isLarger: boolean } | null>(null);

    const handleStepChange = (stepIndex: number, line: number) => {
        // Reset
        if (stepIndex <= 1) {
            setMx(data[0]);
            setActiveIndex(0);
            setComparison(null);
            return;
        }

        // Manual step logic based on known simulation array
        // Steps: [4,5], [7,8,9], [7,8], [7,8,9], [7,8], ...

        // i=1: Steps 2,3,4
        if (stepIndex === 2) { setActiveIndex(1); setComparison(null); } // line 7
        if (stepIndex === 3) { setComparison({ val: data[1], isLarger: true }); } // line 8
        if (stepIndex === 4) { setMx(data[1]); setComparison(null); } // line 9

        // i=2: Steps 5,6
        if (stepIndex === 5) { setActiveIndex(2); setComparison(null); } // line 7
        if (stepIndex === 6) { setComparison({ val: data[2], isLarger: false }); } // line 8

        // i=3: Steps 7,8,9
        if (stepIndex === 7) { setActiveIndex(3); setComparison(null); } // line 7
        if (stepIndex === 8) { setComparison({ val: data[3], isLarger: true }); } // line 8
        if (stepIndex === 9) { setMx(data[3]); setComparison(null); } // line 9

        // i=4: Steps 10,11
        if (stepIndex === 10) { setActiveIndex(4); setComparison(null); }
        if (stepIndex === 11) { setComparison({ val: data[4], isLarger: false }); }

        // Final
        if (stepIndex === 12) { setActiveIndex(5); setComparison(null); }
    };

    return (
        <CodePlayground
            code={code}
            title="패턴 2: 최댓값 찾기"
            simulationSteps={simulationSteps}
            onStepChange={handleStepChange}
            visualizer={
                <div className="flex flex-col items-center justify-center w-full h-full gap-10 relative">

                    {/* Array Block */}
                    <div className="flex gap-2 p-4 bg-stone-100 rounded-xl border border-stone-200/50">
                        {data.map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 relative">
                                <div className={`w-12 h-12 flex items-center justify-center bg-white border-2 rounded-lg font-heading font-bold text-lg transition-colors duration-300 ${i === activeIndex && i < 5 ? 'border-purple-400 text-stone-900 bg-purple-50' : 'border-stone-200 text-stone-400'
                                    }`}>
                                    {val}
                                </div>
                                {i === activeIndex && i < 5 && (
                                    <motion.div layoutId="ptr" className="absolute -top-8 text-purple-500">
                                        <ArrowUp className="rotate-180 w-5 h-5" />
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Comparison Logic */}
                    <AnimatePresence>
                        {comparison && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm ${comparison.isLarger ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-500'
                                    }`}
                            >
                                {comparison.val} {comparison.isLarger ? '> ' : '<= '} {mx} ?
                                {comparison.isLarger ? ' (교체!)' : ' (패스)'}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Max Variable Box */}
                    <div className="flex flex-col items-center relative">
                        <div className="absolute -top-6 text-yellow-500">
                            <Crown className="w-8 h-8 fill-current" />
                        </div>
                        <div className="w-24 h-24 bg-gradient-to-br from-stone-800 to-stone-900 border-4 border-yellow-500/50 rounded-2xl flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
                            <span className="text-stone-400 text-xs font-mono absolute top-2 left-3">mx</span>
                            <motion.span
                                key={mx}
                                initial={{ scale: 1.5, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-heading font-black text-white"
                            >
                                {mx}
                            </motion.span>
                        </div>
                    </div>
                </div>
            }
        />
    );
}
