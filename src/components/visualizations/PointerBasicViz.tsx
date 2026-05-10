'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { VizCard } from './VizCard';

export function PointerBasicViz() {
    const [step, setStep] = useState(0);
    // 0: initial  1: p = &a  2: *p = 20

    const steps = [
        { label: '시작', next: 'p = &a 실행' },
        { label: 'p = &a', next: '*p = 20 실행' },
        { label: '*p = 20', next: '완료' },
    ];

    return (
        <VizCard
            title="포인터 p가 변수 a를 가리키는 과정"
            step={step + 1}
            totalSteps={3}
            onPrev={step > 0 ? () => setStep(s => s - 1) : undefined}
            onNext={() => setStep(s => Math.min(s + 1, 2))}
            onReset={() => setStep(0)}
            nextLabel={steps[step].next}
            nextDisabled={step >= 2}
        >
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mb-8 relative overflow-visible">

                {/* Pointer Variable Box */}
                <div className="relative">
                    <div className="text-center mb-2 font-mono font-bold text-stone-600 text-sm md:text-base">int *p</div>
                    <motion.div
                        className="w-24 h-24 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-center relative z-10"
                        animate={{ borderColor: step >= 1 ? '#3b82f6' : '#bfdbfe' }}
                    >
                        <div className="text-center">
                            <div className="text-xs text-stone-400 mb-1">메모리: 0x200</div>
                            <div className="font-mono font-bold text-lg text-blue-600">
                                {step === 0 ? '???' : <span className="text-red-500">0x100</span>}
                            </div>
                        </div>
                    </motion.div>

                    {step >= 1 && (
                        <>
                            <motion.div
                                className="hidden md:block absolute top-1/2 left-full w-24 h-0.5 bg-red-500 z-0 origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ArrowDown className="absolute -right-3 -top-3 w-6 h-6 text-red-500 -rotate-90" />
                            </motion.div>
                            <motion.div
                                className="md:hidden absolute top-full left-1/2 h-12 w-0.5 bg-red-500 z-0 origin-top"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ArrowDown className="absolute -bottom-4 -left-3 w-6 h-6 text-red-500" />
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Regular Variable Box */}
                <div>
                    <div className="text-center mb-2 font-mono font-bold text-stone-600 text-sm md:text-base">int a</div>
                    <motion.div
                        className="w-24 h-24 bg-stone-50 border-2 border-stone-200 rounded-xl flex items-center justify-center"
                        animate={{
                            scale: step === 2 ? [1, 1.1, 1] : 1,
                            backgroundColor: step === 2 ? '#fefce8' : '#fafaf9',
                            borderColor: step === 2 ? '#eab308' : '#e7e5e4'
                        }}
                    >
                        <div className="text-center">
                            <div className="text-xs text-stone-400 mb-1">메모리: 0x100</div>
                            <div className={`font-mono font-bold text-2xl ${step === 2 ? 'text-yellow-600' : 'text-stone-800'}`}>
                                {step === 2 ? '20' : '10'}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Code Highlight */}
            <div className="bg-stone-900 rounded-lg p-4 mb-4 font-mono text-sm text-stone-300 shadow-inner overflow-x-auto">
                <div className={`${step === 0 ? 'text-white bg-stone-700/50 -mx-2 px-2 py-0.5 rounded' : ''} transition-colors`}>
                    int a = 10;
                </div>
                <div className={`${step === 1 ? 'text-white bg-green-900/50 -mx-2 px-2 py-0.5 rounded' : ''} transition-colors`}>
                    int *p = &a; <span className="text-stone-500 text-xs">// p에 a의 주소(0x100) 대입</span>
                </div>
                <div className={`${step === 2 ? 'text-white bg-green-900/50 -mx-2 px-2 py-0.5 rounded' : ''} transition-colors`}>
                    *p = 20; <span className="text-stone-500 text-xs">// p가 가리키는 곳의 값을 20으로</span>
                </div>
            </div>

            <div className="text-center text-sm text-stone-600 font-body">
                {step === 0 && 'a에 10을 저장했어요. p는 아직 아무것도 안 가리켜요.'}
                {step === 1 && 'p에 a의 주소(0x100)를 넣었어요. 이제 p는 a를 가리켜요.'}
                {step === 2 && '*p = 20 → p가 가리키는 a의 값이 20으로 바뀌었어요!'}
            </div>
        </VizCard>
    );
}
