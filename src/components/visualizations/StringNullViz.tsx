'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw, Check } from 'lucide-react';

export function StringNullViz() {
    const [step, setStep] = useState(0);
    const text = "HELLO";
    const maxStep = text.length; // 5 steps for letters, +1 for null

    const handleNext = () => {
        if (step <= maxStep) setStep(prev => prev + 1);
    };

    const handleReset = () => {
        setStep(0);
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-6 md:my-12 p-4 md:p-8 bg-white rounded-xl shadow-lg border border-stone-200">
            <h3 className="text-center font-heading font-bold text-base md:text-xl text-stone-800 mb-6">
                문자열 "HELLO"가 메모리에 저장되는 모습
            </h3>

            <div className="flex justify-center items-center gap-2 md:gap-4 mb-8">
                {/* Array Boxes */}
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className="text-xs text-stone-400 font-mono">s[{i}]</div>
                        <motion.div
                            className={`w-10 h-10 md:w-14 md:h-14 border-2 rounded-lg flex items-center justify-center text-lg md:text-2xl font-bold font-mono shadow-sm
                                ${i < step && i < 5 ? 'border-stone-800 bg-stone-50 text-stone-800' : ''}
                                ${i === 5 && step > 5 ? 'border-red-500 bg-red-50 text-red-600' : ''}
                                ${i >= step ? 'border-stone-200 bg-white text-transparent' : ''}
                            `}
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{
                                scale: i < step ? 1 : 0.8,
                                opacity: i < step ? 1 : 0.5,
                                borderColor: i === 5 && step > 5 ? '#ef4444' : (i < step ? '#292524' : '#e7e5e4')
                            }}
                        >
                            {i < 5 ? (i < step ? text[i] : '') : (step > 5 ? '\\0' : '')}
                        </motion.div>
                        <div className="text-[10px] text-stone-400">
                            {i === 5 ? '끝 표시' : '문자'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 mb-6 text-center h-16 flex items-center justify-center">
                <p className="text-sm md:text-base text-stone-600 font-medium">
                    {step === 0 && "비어있는 배열 s[6]을 준비했어요."}
                    {step > 0 && step <= 5 && `문자 '${text[step - 1]}'를 s[${step - 1}]에 넣었어요.`}
                    {step > 5 && <span className="text-red-600 font-bold">마지막에 널 문자(\0)가 들어가야 문자열이 완성돼요!</span>}
                </p>
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
                    disabled={step > 5}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all
                        ${step > 5
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-900 text-white hover:bg-stone-800 shadow-md transform hover:scale-105'}
                    `}
                >
                    {step > 5 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    {step === 0 ? '시작하기' : (step === 5 ? '널 문자 넣기' : (step > 5 ? '완성' : '다음 글자'))}
                </button>
            </div>
        </div>
    );
}
