'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodePlayground } from '../code/CodePlayground';
import { ArrowUp, Check, X } from 'lucide-react';

export function ArrayCountViz() {
    const code = `#include <stdio.h>

int main(void) {
    int a[5] = {3, 8, 5, 12, 7};
    int cnt = 0;

    for (int i = 0; i < 5; i++) {
        if (a[i] % 2 == 0) {
            cnt++;
        }
    }
    
    printf("%d", cnt);
    return 0;
}`;

    // Mapping steps:
    // 4: init array
    // 5: cnt = 0
    // 7: for init (i=0, val=3)
    // 8: check (3%2!=0) -> False

    // 7: loop (i=1, val=8)
    // 8: check (8%2==0) -> True
    // 9: cnt++

    // 7: loop (i=2, val=5)
    // 8: check (False)

    // 7: loop (i=3, val=12)
    // 8: check (True)
    // 9: cnt++

    // 7: loop (i=4, val=7)
    // 8: check (False)

    // 7: finish

    const simulationSteps = [
        4, 5,      // Init
        7, 8,      // 3
        7, 8, 9,   // 8 (cnt++)
        7, 8,      // 5
        7, 8, 9,   // 12 (cnt++)
        7, 8,      // 7
        7, 12      // Print
    ];

    const [data] = useState([3, 8, 5, 12, 7]);
    const [cnt, setCnt] = useState(0);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [checkResult, setCheckResult] = useState<'even' | 'odd' | null>(null);

    const handleStepChange = (stepIndex: number) => {
        // Reset
        if (stepIndex <= 1) {
            setCnt(0);
            setActiveIndex(-1);
            setCheckResult(null);
            return;
        }

        // Manual step logic
        // i=0 (3): Steps 2,3
        if (stepIndex === 2) { setActiveIndex(0); setCheckResult(null); }
        if (stepIndex === 3) { setCheckResult('odd'); }

        // i=1 (8): Steps 4,5,6
        if (stepIndex === 4) { setActiveIndex(1); setCheckResult(null); }
        if (stepIndex === 5) { setCheckResult('even'); }
        if (stepIndex === 6) { setCnt(1); }

        // i=2 (5): Steps 7,8
        if (stepIndex === 7) { setActiveIndex(2); setCheckResult(null); }
        if (stepIndex === 8) { setCheckResult('odd'); }

        // i=3 (12): Steps 9,10,11
        if (stepIndex === 9) { setActiveIndex(3); setCheckResult(null); }
        if (stepIndex === 10) { setCheckResult('even'); }
        if (stepIndex === 11) { setCnt(2); }

        // i=4 (7): Steps 12,13
        if (stepIndex === 12) { setActiveIndex(4); setCheckResult(null); }
        if (stepIndex === 13) { setCheckResult('odd'); }

        // Finish
        if (stepIndex === 14) { setActiveIndex(5); setCheckResult(null); }
    };

    return (
        <CodePlayground
            code={code}
            title="패턴 3: 짝수 개수 세기"
            simulationSteps={simulationSteps}
            onStepChange={handleStepChange}
            visualizer={
                <div className="flex flex-col items-center justify-center w-full h-full gap-5 md:gap-10 relative px-2 md:px-0">

                    {/* Array Block */}
                    <div className="flex gap-1 md:gap-2 p-2 md:p-4 bg-stone-100 rounded-xl border border-stone-200/50">
                        {data.map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 md:gap-2 relative">
                                <div className={`w-9 h-9 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-lg font-heading font-bold text-sm md:text-lg transition-all duration-300 ${i === activeIndex && i < 5
                                    ? (checkResult === 'even' ? 'bg-green-100 border-green-500 text-green-700'
                                        : checkResult === 'odd' ? 'bg-red-50 border-red-300 text-red-300'
                                            : 'bg-white border-blue-400 text-stone-900')
                                    : 'bg-white border-stone-200 text-stone-400'
                                    }`}>
                                    {val}
                                </div>
                                {i === activeIndex && i < 5 && (
                                    <motion.div layoutId="ptr2" className="absolute -top-5 md:-top-8 text-blue-500">
                                        <ArrowUp className="rotate-180 w-4 h-4 md:w-5 md:h-5" />
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Gate/Check Logic */}
                    <div className="h-8 md:h-10">
                        <AnimatePresence>
                            {checkResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-sm ${checkResult === 'even' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-400'
                                        }`}
                                >
                                    {checkResult === 'even' ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : <X className="w-3 h-3 md:w-4 md:h-4" />}
                                    {checkResult === 'even' ? '짝수입니다! (cnt 증가)' : '짝수가 아닙니다.'}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Count Variable Box */}
                    <div className="flex flex-col items-center relative">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white border-2 border-stone-300 rounded-xl md:rounded-2xl flex flex-col items-center justify-center shadow-md relative overflow-hidden">
                            <span className="text-stone-400 text-[10px] md:text-xs font-mono absolute top-1.5 left-2 md:top-2 md:left-3">cnt</span>
                            <motion.span
                                key={cnt}
                                initial={{ scale: 1.5, color: '#3b82f6' }}
                                animate={{ scale: 1, color: '#1c1917' }}
                                className="text-2xl md:text-4xl font-heading font-black"
                            >
                                {cnt}
                            </motion.span>
                        </div>
                    </div>
                </div>
            }
        />
    );
}
