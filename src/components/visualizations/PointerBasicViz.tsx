'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, RotateCcw, MousePointer2 } from 'lucide-react';

export function PointerBasicViz() {
    const [step, setStep] = useState(0);
    // Steps: 0: initial, 1: p = &a, 2: *p = 20

    const handleNext = () => {
        if (step < 2) setStep(prev => prev + 1);
    };

    const handleReset = () => {
        setStep(0);
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-6 md:my-12 p-4 md:p-8 bg-white rounded-xl shadow-lg border border-stone-200">
            <h3 className="text-center font-heading font-bold text-base md:text-xl text-stone-800 mb-8">
                포인터 p가 변수 a를 가리키는 과정
            </h3>

            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mb-10 relative">

                {/* Pointer Variable Box */}
                <div className="relative">
                    <div className="text-center mb-2 font-mono font-bold text-stone-600">int *p</div>
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

                    {/* Arrow Connection */}
                    {step >= 1 && (
                        <motion.div
                            className="absolute top-1/2 left-full w-12 md:w-24 h-0.5 bg-red-500 z-0 origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ArrowDown className="absolute -right-3 -top-3 w-6 h-6 text-red-500 -rotate-90" />
                        </motion.div>
                    )}
                </div>

                {/* Regular Variable Box */}
                <div>
                    <div className="text-center mb-2 font-mono font-bold text-stone-600">int a</div>
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

            {/* Code Block */}
            <div className="bg-stone-900 rounded-lg p-4 mb-6 font-mono text-sm text-stone-300 shadow-inner">
                <div className={`${step === 0 ? 'text-white bg-stone-700/50 -mx-2 px-2 py-0.5 rounded' : ''} transition-colors`}>
                    int a = 10;
                </div>
                <div className={`${step === 1 ? 'text-white bg-green-900/50 -mx-2 px-2 py-0.5 rounded' : ''} transition-colors`}>
                    int *p = &a;  <span className="text-stone-500 text-xs">// p에 a의 주소(0x100) 대입</span>
                </div>
                <div className={`${step === 2 ? 'text-white bg-green-900/50 -mx-2 px-2 py-0.5 rounded' : ''} transition-colors`}>
                    *p = 20;      <span className="text-stone-500 text-xs">// p가 가리키는 곳(*p)을 20으로 변경</span>
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
                    disabled={step >= 2}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all
                        ${step >= 2
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-900 text-white hover:bg-stone-800 shadow-md transform hover:scale-105'}
                    `}
                >
                    <MousePointer2 className="w-4 h-4" />
                    {step === 0 ? 'p = &a 실행' : (step === 1 ? '*p = 20 실행' : '완료')}
                </button>
            </div>
        </div>
    );
}
