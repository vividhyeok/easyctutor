'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodePlayground } from '../code/CodePlayground';

export function ScopeViz() {
    const code = `#include <stdio.h>

int main(void) {
    int x = 10;      // main 블록 변수

    {
        int y = 3;   // 안쪽 블록 변수
        // x, y 둘 다 사용 가능
    }
    // 여기서 y는 사라져요
    // x만 남아요

    return 0;
}`;

    const simulationSteps = [
        4,  // int x = 10
        7,  // int y = 3 (블록 진입)
        8,  // x, y 모두 보임
        10, // 블록 끝 — y 사라짐
        11, // x만 남음
    ];

    const [step, setStep] = useState(-1);

    const handleStepChange = (stepIndex: number) => {
        setStep(stepIndex);
    };

    const showX = step >= 0;
    const inBlock = step >= 1 && step <= 2;
    const showY = step === 1 || step === 2;
    const blockClosed = step >= 3;
    const yGone = step >= 3;

    return (
        <CodePlayground
            code={code}
            title="변수 범위(스코프) 시각화"
            simulationSteps={simulationSteps}
            onStepChange={handleStepChange}
            visualizer={
                <div className="flex flex-col w-full h-full p-4 md:p-8 gap-4 md:gap-6 bg-[#fffdf5] font-body text-stone-800 items-center justify-center">

                    {/* 메인 블록 */}
                    <div className="w-full max-w-xs md:max-w-sm relative">
                        <div className="border-2 border-stone-400 rounded-xl p-4 md:p-6 bg-white shadow-sm">
                            <div className="text-xs font-bold text-stone-500 font-heading mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-stone-400 inline-block" />
                                main() 블록
                            </div>

                            {/* x 변수 */}
                            <AnimatePresence>
                                {showX && (
                                    <motion.div
                                        key="var-x"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 mb-4"
                                    >
                                        <div className="w-14 h-10 md:w-16 md:h-12 bg-stone-100 border-2 border-stone-400 rounded-lg flex flex-col items-center justify-center">
                                            <span className="text-[9px] text-stone-400 font-mono">int x</span>
                                            <span className="font-bold text-base md:text-lg text-stone-800">10</span>
                                        </div>
                                        <span className="text-xs text-stone-500">← main 끝날 때까지 살아있어요</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 안쪽 블록 */}
                            <div className={`border-2 rounded-xl p-3 md:p-4 transition-colors duration-300 ${inBlock ? 'border-blue-400 bg-blue-50' : blockClosed ? 'border-dashed border-stone-300 bg-stone-50 opacity-60' : 'border-dashed border-stone-300 bg-stone-50'}`}>
                                <div className="text-xs font-bold mb-3 font-heading flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full inline-block ${inBlock ? 'bg-blue-400' : 'bg-stone-300'}`} />
                                    <span className={inBlock ? 'text-blue-600' : 'text-stone-400'}>
                                        안쪽 블록 {'{ }'}
                                    </span>
                                    {blockClosed && <span className="text-stone-400 text-[10px]">(닫혔어요)</span>}
                                </div>

                                {/* y 변수 */}
                                <AnimatePresence>
                                    {showY && !yGone && (
                                        <motion.div
                                            key="var-y"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-14 h-10 md:w-16 md:h-12 bg-blue-100 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center">
                                                <span className="text-[9px] text-blue-500 font-mono">int y</span>
                                                <span className="font-bold text-base md:text-lg text-blue-700">3</span>
                                            </div>
                                            <span className="text-xs text-blue-600">← 블록 안에서만 살아요</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {yGone && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs text-stone-400 text-center py-1"
                                    >
                                        y는 블록 밖에서 사라졌어요
                                    </motion.div>
                                )}

                                {!showY && !yGone && (
                                    <div className="text-xs text-stone-400 text-center py-1">
                                        블록 안으로 들어가면 y가 생겨요
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 설명 박스 */}
                    <div className="w-full max-w-xs md:max-w-sm">
                        <div className="relative px-4 py-3 border-2 border-dashed border-stone-300 rounded-xl bg-white text-center shadow-sm">
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-stone-400">
                                지금 볼 수 있는 변수
                            </span>
                            <p className="text-sm md:text-base font-heading break-keep leading-snug">
                                {step === -1 && '실행 버튼을 눌러보세요!'}
                                {step === 0 && 'x만 보여요.'}
                                {step === 1 && 'x와 y 둘 다 보여요.'}
                                {step === 2 && 'x와 y 둘 다 사용할 수 있어요!'}
                                {step === 3 && '블록이 닫혔어요. y는 사라졌어요. x만 남았어요.'}
                                {step === 4 && 'x만 사용할 수 있어요. y를 쓰려고 하면 에러나요!'}
                            </p>
                        </div>
                    </div>
                </div>
            }
        />
    );
}
