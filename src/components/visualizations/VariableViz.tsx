'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VizCard } from './VizCard';

const VARS = [
    { type: 'int', name: 'age', val: '20', color: 'border-blue-400 bg-blue-50', labelColor: 'text-blue-600', valColor: 'text-blue-800' },
    { type: 'float', name: 'height', val: '172.5', color: 'border-orange-400 bg-orange-50', labelColor: 'text-orange-600', valColor: 'text-orange-800' },
    { type: 'char', name: 'grade', val: "'A'", color: 'border-purple-400 bg-purple-50', labelColor: 'text-purple-600', valColor: 'text-purple-800' },
];

export function VariableViz() {
    const [step, setStep] = useState(0);
    // step 0: 메모리는 비어있음
    // step 1: age 선언
    // step 2: height 선언
    // step 3: grade 선언

    const stepLabels = ['age 선언하기', 'height 선언하기', 'grade 선언하기'];

    return (
        <VizCard
            title="변수 선언 — 메모리에 이름표 붙이기"
            step={step + 1}
            totalSteps={VARS.length + 1}
            onPrev={step > 0 ? () => setStep(s => s - 1) : undefined}
            onNext={() => setStep(s => Math.min(s + 1, VARS.length))}
            onReset={() => setStep(0)}
            nextLabel={step < VARS.length ? stepLabels[step] : '완료'}
            nextDisabled={step >= VARS.length}
        >
            {/* 메모리 칸들 */}
            <div className="flex flex-col gap-3 mb-6">
                <div className="text-xs font-bold text-stone-400 font-heading mb-1 text-center tracking-widest uppercase">메모리</div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {VARS.map((v, i) => (
                        <div key={v.name} className="flex flex-col items-center gap-1.5">
                            <AnimatePresence mode="wait">
                                {step > i ? (
                                    <motion.div
                                        key="filled"
                                        initial={{ scale: 0.7, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                        className={`w-24 h-20 border-2 rounded-xl flex flex-col items-center justify-center shadow-sm ${v.color}`}
                                    >
                                        <div className={`text-[10px] font-bold font-heading mb-1 ${v.labelColor}`}>{v.type}</div>
                                        <div className="font-mono font-bold text-stone-800 text-base">{v.val}</div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        className="w-24 h-20 border-2 border-dashed border-stone-200 rounded-xl flex items-center justify-center"
                                    >
                                        <span className="text-stone-300 text-xs font-mono">비어있음</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className={`text-sm font-mono font-bold transition-colors duration-300 ${step > i ? v.labelColor : 'text-stone-300'}`}>
                                {v.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 코드 하이라이트 */}
            <div className="bg-stone-900 rounded-lg p-3 md:p-4 font-mono text-sm text-stone-300 mb-4">
                <div className="text-stone-500 text-xs mb-2">// 변수 선언</div>
                {VARS.map((v, i) => (
                    <div
                        key={v.name}
                        className={`transition-colors duration-200 -mx-2 px-2 py-0.5 rounded ${step === i + 1 ? 'bg-green-900/50 text-white' : step > i + 1 ? 'text-stone-400' : ''}`}
                    >
                        <span className="text-blue-400">{v.type}</span>
                        {' '}
                        <span className="text-white">{v.name}</span>
                        <span className="text-stone-400">{' = '}</span>
                        <span className="text-yellow-300">{v.val}</span>
                        <span className="text-stone-400">;</span>
                    </div>
                ))}
            </div>

            {/* 설명 */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-600 text-center font-body min-h-[48px] flex items-center justify-center">
                {step === 0 && '메모리는 비어있어요. 변수를 선언하면 이름표가 붙은 칸이 생겨요!'}
                {step === 1 && 'int age = 20 → 정수를 담는 칸에 "age"라는 이름표를 붙이고 20을 저장했어요.'}
                {step === 2 && 'float height = 172.5 → 소수점이 있는 숫자를 담는 칸이에요.'}
                {step === 3 && "char grade = 'A' → 문자 한 글자를 담는 칸이에요. 작은따옴표를 꼭 써야 해요!"}
            </div>
        </VizCard>
    );
}
