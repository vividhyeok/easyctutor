'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, RotateCcw, ChevronRight } from 'lucide-react';

export function ArrayPointerViz() {
    const [index, setIndex] = useState(0);
    const arr = [10, 20, 30, 40, 50];

    const handleNext = () => {
        if (index < 4) setIndex(prev => prev + 1);
    };

    const handleReset = () => {
        setIndex(0);
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-6 md:my-12 p-4 md:p-8 bg-white rounded-xl shadow-lg border border-stone-200">
            <h3 className="text-center font-heading font-bold text-base md:text-xl text-stone-800 mb-8">
                포인터 p가 배열을 타고 이동하는 모습
            </h3>

            <div className="flex justify-center items-end gap-2 md:gap-4 mb-6 h-32">
                {arr.map((val, i) => (
                    <div key={i} className="flex flex-col items-center relative gap-2">
                        {/* Array Box */}
                        <div className={`w-12 h-12 md:w-16 md:h-16 border-2 rounded-lg flex items-center justify-center text-lg md:text-xl font-bold font-mono shadow-sm transition-colors
                            ${i === index ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-stone-200 text-stone-500'}
                        `}>
                            {val}
                        </div>
                        <div className="text-xs text-stone-400 font-mono">a[{i}]</div>

                        {/* Pointer Indicator */}
                        {i === index && (
                            <motion.div
                                className="absolute -bottom-10 flex flex-col items-center text-blue-600 font-bold"
                                layoutId="pointer"
                            >
                                <ArrowUp className="w-6 h-6" />
                                <div className="text-sm font-mono mt-1">*p</div>
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 mb-6 text-center">
                <div className="font-mono text-lg font-bold text-stone-800 mb-1">
                    printf("%d", *p); <span className="text-blue-600">👉 {arr[index]}</span>
                </div>
                <div className="text-sm text-stone-500">
                    현재 p는 a[{index}]를 가리키고 있어요. (주소 + {index}칸)
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors font-medium text-sm"
                >
                    <RotateCcw className="w-4 h-4" />
                    처음부터
                </button>
                <button
                    onClick={handleNext}
                    disabled={index >= 4}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all
                        ${index >= 4
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-900 text-white hover:bg-stone-800 shadow-md transform hover:scale-105'}
                    `}
                >
                    <ChevronRight className="w-4 h-4" />
                    p++ (다음 칸으로)
                </button>
            </div>
        </div>
    );
}
