'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VizCard } from './VizCard';

export function StringNullViz() {
    const [step, setStep] = useState(0);
    const text = "HELLO";
    const maxStep = text.length + 1; // 5글자 + 널문자

    const nextLabel =
        step === 0 ? '시작하기' :
        step < 5 ? '다음 글자' :
        step === 5 ? '널 문자 넣기' : '완성';

    return (
        <VizCard
            title={`문자열 "HELLO"가 메모리에 저장되는 모습`}
            step={step + 1}
            totalSteps={maxStep + 1}
            onPrev={step > 0 ? () => setStep(s => s - 1) : undefined}
            onNext={() => setStep(s => Math.min(s + 1, maxStep))}
            onReset={() => setStep(0)}
            nextLabel={nextLabel}
            nextDisabled={step >= maxStep}
        >
            <div className="flex w-full justify-start sm:justify-center items-center gap-2 md:gap-3 mb-6 overflow-x-auto overflow-y-visible pb-2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className="text-xs text-stone-400 font-mono">s[{i}]</div>
                        <motion.div
                            className={`w-11 h-11 md:w-14 md:h-14 border-2 rounded-lg flex items-center justify-center text-base md:text-xl font-bold font-mono shadow-sm`}
                            animate={{
                                scale: i === step - 1 ? [1, 1.15, 1] : 1,
                                borderColor:
                                    i === 5 && step > 5 ? '#ef4444' :
                                    i < step ? '#1c1917' : '#e7e5e4',
                                backgroundColor:
                                    i === 5 && step > 5 ? '#fef2f2' :
                                    i < step ? '#fafaf9' : '#ffffff',
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className={
                                i === 5 && step > 5 ? 'text-red-600' :
                                i < step && i < 5 ? 'text-stone-800' : 'text-transparent'
                            }>
                                {i < 5 ? (i < step ? text[i] : '.') : (step > 5 ? '\\0' : '.')}
                            </span>
                        </motion.div>
                        <div className="text-[10px] text-stone-400 text-center leading-tight">
                            {i === 5 ? <span className="text-red-500 font-bold">끝 표시</span> : '문자'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 md:p-4 text-center min-h-[56px] flex items-center justify-center">
                <p className="text-sm md:text-base text-stone-700 font-body">
                    {step === 0 && '비어있는 배열 s[6]을 준비했어요.'}
                    {step > 0 && step <= 5 && `문자 '${text[step - 1]}'를 s[${step - 1}]에 넣었어요.`}
                    {step > 5 && (
                        <span className="text-red-600 font-bold">
                            마지막에 널 문자(\0)가 들어가야 문자열이 완성돼요!
                        </span>
                    )}
                </p>
            </div>
        </VizCard>
    );
}
