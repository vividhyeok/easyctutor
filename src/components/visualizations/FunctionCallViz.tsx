'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodePlayground } from '../code/CodePlayground';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function FunctionCallViz() {
    const code = `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main(void) {
    int result;
    result = add(3, 5);
    printf("%d\\n", result);
    return 0;
}`;

    const simulationSteps = [
        8,  // int result;
        9,  // result = add(3, 5) — 호출
        3,  // return a + b
        9,  // add 결과 받음
        10, // printf
    ];

    const [phase, setPhase] = useState<'idle' | 'calling' | 'inside' | 'returning' | 'done'>('idle');
    const [argA, setArgA] = useState<number | null>(null);
    const [argB, setArgB] = useState<number | null>(null);
    const [retVal, setRetVal] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);

    const handleStepChange = (stepIndex: number) => {
        if (stepIndex === -1) {
            setPhase('idle');
            setArgA(null);
            setArgB(null);
            setRetVal(null);
            setResult(null);
            return;
        }
        if (stepIndex === 0) { setPhase('idle'); setArgA(null); setArgB(null); setRetVal(null); setResult(null); }
        if (stepIndex === 1) { setPhase('calling'); setArgA(3); setArgB(5); setRetVal(null); setResult(null); }
        if (stepIndex === 2) { setPhase('inside'); setArgA(3); setArgB(5); setRetVal(8); setResult(null); }
        if (stepIndex === 3) { setPhase('returning'); setArgA(3); setArgB(5); setRetVal(8); setResult(8); }
        if (stepIndex === 4) { setPhase('done'); setArgA(3); setArgB(5); setRetVal(8); setResult(8); }
    };

    const mainBoxColor = phase === 'calling' ? 'border-yellow-400 bg-yellow-50' :
        phase === 'returning' || phase === 'done' ? 'border-green-400 bg-green-50' : 'border-stone-300 bg-white';
    const funcBoxColor = phase === 'inside' ? 'border-blue-400 bg-blue-50' :
        phase === 'calling' ? 'border-yellow-300 bg-yellow-50/50' : 'border-stone-300 bg-white';

    return (
        <CodePlayground
            code={code}
            title="함수 호출 흐름"
            simulationSteps={simulationSteps}
            onStepChange={handleStepChange}
            visualizer={
                <div className="flex flex-col w-full h-full p-3 md:p-6 gap-4 md:gap-6 bg-[#fffdf5] font-body text-stone-800">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8">

                        {/* main 함수 박스 */}
                        <motion.div
                            className={`w-full md:w-44 border-2 rounded-xl p-3 md:p-4 transition-colors duration-300 ${mainBoxColor}`}
                            animate={{ scale: phase === 'done' ? [1, 1.04, 1] : 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="text-xs font-bold text-stone-500 font-heading mb-2">main()</div>
                            <div className="flex items-center justify-between text-sm font-mono">
                                <span className="text-stone-500">result =</span>
                                <motion.span
                                    key={String(result)}
                                    initial={{ scale: 1.3, color: '#16a34a' }}
                                    animate={{ scale: 1, color: result !== null ? '#15803d' : '#a8a29e' }}
                                    className="font-bold text-lg"
                                >
                                    {result !== null ? result : '?'}
                                </motion.span>
                            </div>
                            {phase === 'done' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-2 text-xs text-green-600 font-bold"
                                >
                                    출력: {result}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* 화살표 영역 */}
                        <div className="flex md:flex-col items-center gap-2 min-w-[80px] md:min-w-0">
                            <AnimatePresence>
                                {(phase === 'calling' || phase === 'inside') && (
                                    <motion.div
                                        key="call-arrow"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex md:flex-col items-center gap-1 text-yellow-600"
                                    >
                                        <ArrowRight className="hidden md:block w-5 h-5 text-yellow-500" />
                                        <ArrowRight className="md:hidden w-4 h-4 text-yellow-500 rotate-0" />
                                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-2 py-1 text-xs font-mono whitespace-nowrap">
                                            a={argA}, b={argB}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {(phase === 'returning' || phase === 'done') && (
                                    <motion.div
                                        key="ret-arrow"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex md:flex-col items-center gap-1 text-green-600"
                                    >
                                        <ArrowLeft className="hidden md:block w-5 h-5 text-green-500" />
                                        <ArrowLeft className="md:hidden w-4 h-4 text-green-500" />
                                        <div className="bg-green-100 border border-green-300 rounded-lg px-2 py-1 text-xs font-mono whitespace-nowrap">
                                            return {retVal}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {phase === 'idle' && (
                                <div className="text-stone-300 text-xs text-center">
                                    <div className="hidden md:block">↔</div>
                                    <div className="md:hidden">→</div>
                                </div>
                            )}
                        </div>

                        {/* add 함수 박스 */}
                        <motion.div
                            className={`w-full md:w-44 border-2 rounded-xl p-3 md:p-4 transition-colors duration-300 ${funcBoxColor}`}
                            animate={{ scale: phase === 'inside' ? [1, 1.04, 1] : 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="text-xs font-bold text-stone-500 font-heading mb-2">add(a, b)</div>
                            <div className="flex flex-col gap-1 text-sm font-mono">
                                <div className="flex justify-between">
                                    <span className="text-stone-500">a =</span>
                                    <span className={`font-bold ${phase === 'inside' ? 'text-blue-600' : 'text-stone-400'}`}>{argA !== null ? argA : '?'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-500">b =</span>
                                    <span className={`font-bold ${phase === 'inside' ? 'text-blue-600' : 'text-stone-400'}`}>{argB !== null ? argB : '?'}</span>
                                </div>
                                {phase === 'inside' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border-t border-blue-200 pt-1 mt-1 flex justify-between"
                                    >
                                        <span className="text-stone-500">return</span>
                                        <span className="font-bold text-blue-600">{retVal}</span>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* 설명 박스 */}
                    <div className="flex justify-center">
                        <div className="relative px-4 py-3 border-2 border-dashed border-stone-300 rounded-xl bg-white w-full max-w-sm text-center shadow-sm">
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-stone-400">
                                지금 일어나는 일
                            </span>
                            <p className="text-sm md:text-base font-heading break-keep leading-snug">
                                {phase === 'idle' && '실행 버튼을 눌러보세요!'}
                                {phase === 'calling' && `main이 add(3, 5)를 호출해요. 값이 복사돼서 들어가요.`}
                                {phase === 'inside' && `add 안에서 3 + 5를 계산하고 8을 돌려줄 준비를 해요.`}
                                {phase === 'returning' && `add가 8을 반환해요. main의 result에 저장돼요.`}
                                {phase === 'done' && `result에 8이 저장됐어요. 이제 printf로 출력해요!`}
                            </p>
                        </div>
                    </div>
                </div>
            }
        />
    );
}
