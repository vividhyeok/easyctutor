'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VizCard } from './VizCard';

export function IfElseViz() {
    const [score, setScore] = useState(75);
    const passed = score >= 60;

    return (
        <VizCard title="if / else — 조건에 따라 다른 길을 가요">
            {/* 점수 슬라이더 */}
            <div className="flex flex-col items-center gap-2 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-stone-500">score =</span>
                    <motion.span
                        key={score}
                        initial={{ scale: 1.3, color: '#1c1917' }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-mono font-bold text-stone-900 w-12 text-center"
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
                    className="w-48 md:w-64 accent-yellow-400 cursor-pointer"
                />
                <div className="flex justify-between w-48 md:w-64 text-xs text-stone-400 font-mono">
                    <span>0</span>
                    <span className="text-red-400 font-bold">60 (기준)</span>
                    <span>100</span>
                </div>
            </div>

            {/* 분기 다이어그램 */}
            <div className="flex flex-col items-center gap-0 mb-6">
                {/* 조건 박스 */}
                <motion.div
                    className="border-2 border-stone-800 bg-stone-900 text-white font-mono text-sm px-5 py-2.5 rounded-lg shadow"
                    animate={{ borderColor: passed ? '#3b82f6' : '#ef4444' }}
                >
                    if (score &gt;= 60)
                </motion.div>

                {/* 분기선 */}
                <div className="flex items-start w-full max-w-xs relative h-12">
                    <div className="absolute left-1/2 top-0 w-0.5 h-6 bg-stone-400 -translate-x-1/2" />
                    <div className="absolute left-1/4 right-1/4 top-6 h-0.5 bg-stone-400" />
                    <div className="absolute left-1/4 top-6 w-0.5 h-6 bg-stone-400" />
                    <div className="absolute right-1/4 top-6 w-0.5 h-6 bg-stone-400" />

                    {/* YES / NO 라벨 */}
                    <span className="absolute left-[14%] top-7 text-[10px] font-bold text-blue-500">YES</span>
                    <span className="absolute right-[10%] top-7 text-[10px] font-bold text-red-400">NO</span>
                </div>

                {/* 결과 박스 */}
                <div className="flex w-full max-w-xs justify-between px-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={passed ? 'pass' : 'pass-dim'}
                            className={`w-[44%] border-2 rounded-lg px-3 py-2.5 text-center text-sm font-bold font-mono transition-all duration-200 ${passed ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md' : 'border-stone-200 bg-stone-50 text-stone-400'}`}
                            animate={{ scale: passed ? 1.05 : 1 }}
                        >
                            합격!
                            <div className="text-[10px] font-normal mt-0.5 font-body">printf("합격");</div>
                        </motion.div>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={!passed ? 'fail' : 'fail-dim'}
                            className={`w-[44%] border-2 rounded-lg px-3 py-2.5 text-center text-sm font-bold font-mono transition-all duration-200 ${!passed ? 'border-red-400 bg-red-50 text-red-700 shadow-md' : 'border-stone-200 bg-stone-50 text-stone-400'}`}
                            animate={{ scale: !passed ? 1.05 : 1 }}
                        >
                            불합격
                            <div className="text-[10px] font-normal mt-0.5 font-body">printf("불합격");</div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* 코드 */}
            <div className="bg-stone-900 rounded-lg p-3 md:p-4 font-mono text-sm text-stone-300 mb-4">
                <div className={`-mx-2 px-2 py-0.5 rounded transition-colors ${passed ? 'bg-blue-900/40 text-white' : ''}`}>
                    <span className="text-purple-400">if</span>
                    <span className="text-stone-300"> (score &gt;= 60) </span>
                    <span className="text-stone-400">{'{'}</span>
                </div>
                <div className={`ml-4 -mx-2 pl-6 pr-2 py-0.5 rounded transition-colors ${passed ? 'text-white' : 'text-stone-500'}`}>
                    printf(<span className="text-green-400">"합격\n"</span>);
                </div>
                <div className="text-stone-400">{'}'} </div>
                <div className={`-mx-2 px-2 py-0.5 rounded transition-colors ${!passed ? 'bg-red-900/40 text-white' : ''}`}>
                    <span className="text-purple-400">else</span>
                    <span className="text-stone-400"> {'{'}</span>
                </div>
                <div className={`ml-4 -mx-2 pl-6 pr-2 py-0.5 rounded transition-colors ${!passed ? 'text-white' : 'text-stone-500'}`}>
                    printf(<span className="text-green-400">"불합격\n"</span>);
                </div>
                <div className="text-stone-400">{'}'}</div>
            </div>

            {/* 설명 */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-body text-center min-h-[48px] flex items-center justify-center">
                <span className={passed ? 'text-blue-700 font-bold' : 'text-red-600 font-bold'}>
                    {passed
                        ? `score(${score})가 60 이상이에요 → if 블록 실행 → "합격" 출력!`
                        : `score(${score})가 60 미만이에요 → else 블록 실행 → "불합격" 출력`
                    }
                </span>
            </div>
        </VizCard>
    );
}
