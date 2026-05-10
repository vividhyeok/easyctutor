'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodePlayground } from '../code/CodePlayground';

export function MallocFreeViz() {
    const code = `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // malloc: n칸 빌리기
    int *a = (int*)malloc(sizeof(int) * 5);

    a[0] = 10;  a[1] = 20;
    a[2] = 30;  a[3] = 40;
    a[4] = 50;

    printf("%d\\n", a[2]); // 30

    free(a); // 메모리 반납!
    return 0;
}`;

    const simulationSteps = [
        6,  // malloc
        8,  // a[0], a[1]
        9,  // a[2], a[3]
        10, // a[4]
        12, // printf
        14, // free
    ];

    const [mallocDone, setMallocDone] = useState(false);
    const [filledCount, setFilledCount] = useState(0);
    const [freed, setFreed] = useState(false);
    const [highlight, setHighlight] = useState(-1);
    const values = [10, 20, 30, 40, 50];

    const handleStepChange = (stepIndex: number) => {
        if (stepIndex === -1) {
            setMallocDone(false);
            setFilledCount(0);
            setFreed(false);
            setHighlight(-1);
            return;
        }
        if (stepIndex === 0) { setMallocDone(true); setFilledCount(0); setFreed(false); setHighlight(-1); }
        if (stepIndex === 1) { setMallocDone(true); setFilledCount(2); setFreed(false); setHighlight(-1); }
        if (stepIndex === 2) { setMallocDone(true); setFilledCount(4); setFreed(false); setHighlight(-1); }
        if (stepIndex === 3) { setMallocDone(true); setFilledCount(5); setFreed(false); setHighlight(-1); }
        if (stepIndex === 4) { setMallocDone(true); setFilledCount(5); setFreed(false); setHighlight(2); }
        if (stepIndex === 5) { setMallocDone(true); setFilledCount(5); setFreed(true); setHighlight(-1); }
    };

    return (
        <CodePlayground
            code={code}
            title="malloc / free 시각화"
            simulationSteps={simulationSteps}
            onStepChange={handleStepChange}
            visualizer={
                <div className="flex flex-col w-full h-full p-3 md:p-6 gap-4 md:gap-6 bg-[#fffdf5] font-body text-stone-800 items-center justify-center">

                    {/* 메모리 영역 */}
                    <div className="w-full max-w-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-stone-500 font-heading">메모리 (힙 영역)</span>
                            {mallocDone && !freed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full"
                                >
                                    malloc 완료
                                </motion.span>
                            )}
                            {freed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full"
                                >
                                    free 완료
                                </motion.span>
                            )}
                        </div>

                        <div className="flex gap-1 md:gap-2 p-3 md:p-4 bg-stone-100 rounded-xl border border-stone-200 min-h-[80px] items-center justify-center">
                            {!mallocDone && (
                                <span className="text-sm text-stone-400">아직 메모리가 없어요</span>
                            )}
                            <AnimatePresence>
                                {mallocDone && !freed && Array.from({ length: 5 }).map((_, i) => (
                                    <motion.div
                                        key={`cell-${i}`}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{
                                            opacity: 1,
                                            scale: highlight === i ? 1.15 : 1,
                                            borderColor: highlight === i ? '#eab308' : (i < filledCount ? '#a8a29e' : '#d6d3d1'),
                                        }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ delay: i * 0.08 }}
                                        className={`flex flex-col items-center justify-center w-11 h-14 md:w-14 md:h-16 border-2 rounded-lg transition-colors duration-200 ${highlight === i ? 'bg-yellow-50' : i < filledCount ? 'bg-white' : 'bg-stone-50'}`}
                                    >
                                        <span className="font-heading font-bold text-sm md:text-base text-stone-700">
                                            {i < filledCount ? values[i] : ''}
                                        </span>
                                        <span className="text-[9px] md:text-[10px] text-stone-400 font-mono">a[{i}]</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <AnimatePresence>
                                {freed && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center text-stone-400 gap-1"
                                    >
                                        <span className="text-2xl">💨</span>
                                        <span className="text-xs">반납됐어요</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* 포인터 박스 */}
                    <AnimatePresence>
                        {mallocDone && !freed && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3"
                            >
                                <div className="border-2 border-blue-300 bg-blue-50 rounded-lg px-3 py-2 font-mono text-xs md:text-sm">
                                    <span className="text-blue-500">int *</span>
                                    <span className="font-bold text-blue-700">a</span>
                                    <span className="text-stone-400"> = 시작 주소</span>
                                </div>
                                <span className="text-stone-400 text-xs">↑ 배열처럼 a[i]로 써요</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 설명 */}
                    <div className="relative px-4 py-3 border-2 border-dashed border-stone-300 rounded-xl bg-white w-full max-w-sm text-center shadow-sm">
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-stone-400">
                            지금 일어나는 일
                        </span>
                        <p className="text-sm md:text-base font-heading break-keep leading-snug">
                            {!mallocDone && '실행 버튼을 눌러보세요!'}
                            {mallocDone && filledCount === 0 && !freed && 'malloc이 int 5칸짜리 공간을 빌려왔어요.'}
                            {mallocDone && filledCount > 0 && filledCount < 5 && !freed && `a[0]~a[${filledCount - 1}]에 값을 넣었어요.`}
                            {mallocDone && filledCount === 5 && !freed && highlight === -1 && '5칸 모두 채워졌어요!'}
                            {mallocDone && filledCount === 5 && !freed && highlight === 2 && 'a[2]의 값 30을 출력해요.'}
                            {freed && 'free(a)로 빌린 메모리를 반납했어요. 이제 a를 쓰면 위험해요!'}
                        </p>
                    </div>
                </div>
            }
        />
    );
}
