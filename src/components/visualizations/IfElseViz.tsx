'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VizCard } from './VizCard';

export function IfElseViz() {
    const [score, setScore] = useState(75);
    const passed = score >= 60;

    return (
        <VizCard title="if / else — 조건에 따라 다른 길을 가요">
            {/* 슬라이더 */}
            <div className="flex flex-col items-center gap-2 mb-8">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-stone-500">score =</span>
                    <motion.span
                        key={score}
                        initial={{ scale: 1.25 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="text-2xl font-mono font-bold text-stone-900 w-14 text-center"
                    >
                        {score}
                    </motion.span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={score}
                    onChange={e => setScore(Number(e.target.value))}
                    className="w-48 md:w-72 accent-yellow-400 cursor-pointer"
                />
                <div className="flex justify-between w-48 md:w-72 text-xs text-stone-400 font-mono">
                    <span>0</span>
                    <span className="font-bold text-stone-500">기준: 60</span>
                    <span>100</span>
                </div>
            </div>

            {/* 분기 다이어그램 */}
            <div className="flex flex-col items-center mb-6 select-none">
                {/* 조건 박스 */}
                <motion.div
                    className="border-2 bg-stone-900 text-white font-mono text-sm px-6 py-2.5 rounded-lg z-10"
                    animate={{ borderColor: passed ? '#3b82f6' : '#ef4444' }}
                    transition={{ duration: 0.25 }}
                >
                    if (score &gt;= 60)
                </motion.div>

                {/* T 자 연결선 */}
                <div className="flex w-full max-w-[280px] md:max-w-sm">
                    <div className="flex-1 border-b-2 border-stone-300 h-6" />
                    <div className="w-px bg-stone-300 h-6" />
                    <div className="flex-1 border-b-2 border-stone-300 h-6" />
                </div>

                {/* 두 갈래 */}
                <div className="flex w-full max-w-[280px] md:max-w-sm gap-3">
                    {/* YES 갈래 */}
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-px bg-stone-300 h-4" />
                        <span className="text-[11px] font-bold text-blue-500 font-heading tracking-wide">YES</span>
                        <motion.div
                            className={`w-full border-2 rounded-xl px-2 py-3 text-center text-sm font-bold font-mono transition-colors duration-300 ${
                                passed
                                    ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm'
                                    : 'border-stone-200 bg-stone-50 text-stone-300'
                            }`}
                            animate={{ scale: passed ? 1.04 : 0.96 }}
                            transition={{ duration: 0.2 }}
                        >
                            합격!
                            <div className="text-[10px] font-normal mt-1 font-body opacity-80">
                                printf("합격");
                            </div>
                        </motion.div>
                    </div>

                    {/* NO 갈래 */}
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-px bg-stone-300 h-4" />
                        <span className="text-[11px] font-bold text-red-400 font-heading tracking-wide">NO</span>
                        <motion.div
                            className={`w-full border-2 rounded-xl px-2 py-3 text-center text-sm font-bold font-mono transition-colors duration-300 ${
                                !passed
                                    ? 'border-red-400 bg-red-50 text-red-700 shadow-sm'
                                    : 'border-stone-200 bg-stone-50 text-stone-300'
                            }`}
                            animate={{ scale: !passed ? 1.04 : 0.96 }}
                            transition={{ duration: 0.2 }}
                        >
                            불합격
                            <div className="text-[10px] font-normal mt-1 font-body opacity-80">
                                printf("불합격");
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* 코드 블록 */}
            <div className="bg-stone-900 rounded-lg p-3 md:p-4 font-mono text-sm text-stone-300 mb-4">
                <div className={`-mx-2 px-2 py-0.5 rounded transition-colors duration-300 ${passed ? 'bg-blue-900/50 text-white' : ''}`}>
                    <span className="text-purple-400">if</span>
                    {' (score >= 60) {'}
                </div>
                <div className={`pl-5 py-0.5 transition-colors duration-300 ${passed ? 'text-white' : 'text-stone-600'}`}>
                    printf(<span className="text-green-400">"합격\n"</span>);
                </div>
                <div className="text-stone-400">{'}'}</div>
                <div className={`-mx-2 px-2 py-0.5 rounded transition-colors duration-300 ${!passed ? 'bg-red-900/50 text-white' : ''}`}>
                    <span className="text-purple-400">else</span>
                    {' {'}
                </div>
                <div className={`pl-5 py-0.5 transition-colors duration-300 ${!passed ? 'text-white' : 'text-stone-600'}`}>
                    printf(<span className="text-green-400">"불합격\n"</span>);
                </div>
                <div className="text-stone-400">{'}'}</div>
            </div>

            {/* 설명 */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-body text-center min-h-[48px] flex items-center justify-center">
                <motion.span
                    key={passed ? 'pass' : 'fail'}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    className={passed ? 'text-blue-700 font-bold' : 'text-red-600 font-bold'}
                >
                    {passed
                        ? `score(${score})가 60 이상이에요 → if 블록 실행 → "합격" 출력!`
                        : `score(${score})가 60 미만이에요 → else 블록 실행 → "불합격" 출력`
                    }
                </motion.span>
            </div>
        </VizCard>
    );
}
