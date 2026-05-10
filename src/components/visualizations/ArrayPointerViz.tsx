'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { VizCard } from './VizCard';

export function ArrayPointerViz() {
    const [index, setIndex] = useState(0);
    const arr = [10, 20, 30, 40, 50];

    return (
        <VizCard
            title="포인터 p가 배열을 타고 이동하는 모습"
            step={index + 1}
            totalSteps={arr.length}
            onPrev={index > 0 ? () => setIndex(i => i - 1) : undefined}
            onNext={() => setIndex(i => Math.min(i + 1, arr.length - 1))}
            onReset={() => setIndex(0)}
            nextLabel="p++ (다음 칸으로)"
            nextDisabled={index >= arr.length - 1}
        >
            <div className="flex w-full justify-start sm:justify-center items-end gap-2 md:gap-4 mb-6 min-h-36 overflow-visible px-1 pb-12">
                {arr.map((val, i) => (
                    <div key={i} className="flex flex-col items-center relative gap-2 flex-shrink-0">
                        <motion.div
                            className={`w-12 h-12 md:w-16 md:h-16 border-2 rounded-lg flex items-center justify-center text-base md:text-xl font-bold font-mono shadow-sm transition-colors duration-200
                                ${i === index ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-stone-200 text-stone-500'}
                            `}
                            animate={{ scale: i === index ? 1.1 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {val}
                        </motion.div>
                        <div className="text-xs text-stone-400 font-mono">a[{i}]</div>

                        {i === index && (
                            <motion.div
                                className="absolute -bottom-11 flex flex-col items-center text-blue-600 font-bold"
                                layoutId="ptr-indicator"
                            >
                                <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
                                <div className="text-xs md:text-sm font-mono mt-0.5">p</div>
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-stone-900 rounded-lg p-3 md:p-4 font-mono text-sm text-stone-300 mb-4">
                <div className="text-stone-500 text-xs mb-2">// 현재 상태</div>
                <div>
                    <span className="text-yellow-400">*p</span>
                    <span className="text-stone-300"> == </span>
                    <span className="text-green-400">a[{index}]</span>
                    <span className="text-stone-300"> == </span>
                    <span className="text-white font-bold">{arr[index]}</span>
                </div>
                <div className="text-stone-500 mt-1 text-xs">// p는 시작 주소에서 {index}칸 이동한 위치</div>
            </div>

            <div className="text-center text-sm text-stone-600 font-body">
                {index === 0 && 'p는 배열의 첫 번째 칸(a[0])을 가리키고 있어요.'}
                {index > 0 && index < 4 && `p++를 ${index}번 했어요. 지금은 a[${index}](= ${arr[index]})을 가리켜요.`}
                {index === 4 && `배열 끝에 도달했어요! a[4](= ${arr[4]})를 가리켜요.`}
            </div>
        </VizCard>
    );
}
