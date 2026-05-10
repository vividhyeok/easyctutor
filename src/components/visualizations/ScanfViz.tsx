'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, ArrowRight } from 'lucide-react';
import { VizCard } from './VizCard';

export function ScanfViz() {
    const [step, setStep] = useState(0);
    const [typed, setTyped] = useState('');
    const [stored, setStored] = useState<number | null>(null);

    const DEMO_VALUE = 42;

    const handleNext = () => {
        if (step === 0) {
            setStep(1);
            // 타이핑 애니메이션 시뮬레이션
            let i = 0;
            const str = String(DEMO_VALUE);
            const interval = setInterval(() => {
                i++;
                setTyped(str.slice(0, i));
                if (i >= str.length) {
                    clearInterval(interval);
                    setTimeout(() => setStep(2), 400);
                }
            }, 200);
        } else if (step === 2) {
            setStored(DEMO_VALUE);
            setStep(3);
        }
    };

    const handleReset = () => {
        setStep(0);
        setTyped('');
        setStored(null);
    };

    const stepLabels = ['키보드 입력 시작', 'Enter 누르기', '완료'];

    return (
        <VizCard
            title="scanf — 키보드 입력이 변수로 들어오는 과정"
            step={step}
            totalSteps={3}
            onPrev={step > 0 && step !== 1 ? () => { setStep(s => s - 1); if (step === 3) { setStored(null); setTyped(''); setStep(2); } } : undefined}
            onNext={step < 3 && step !== 1 ? handleNext : undefined}
            onReset={handleReset}
            nextLabel={step < 3 ? stepLabels[step] : '완료'}
            nextDisabled={step >= 3 || step === 1}
        >
            {/* 흐름 다이어그램 */}
            <div className="flex items-center justify-center gap-3 md:gap-6 mb-6">
                {/* 키보드 */}
                <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ opacity: step >= 1 ? 1 : 0.4 }}
                >
                    <div className={`w-16 h-16 md:w-20 md:h-20 border-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors duration-300 ${step >= 1 ? 'border-blue-400 bg-blue-50' : 'border-stone-200 bg-stone-50'}`}>
                        <Keyboard className={`w-6 h-6 md:w-8 md:h-8 transition-colors ${step >= 1 ? 'text-blue-500' : 'text-stone-300'}`} />
                        <AnimatePresence mode="wait">
                            {step >= 1 && (
                                <motion.span
                                    key={typed}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-mono font-bold text-blue-700 text-sm"
                                >
                                    {typed || ' '}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    <span className="text-xs text-stone-500 font-body">키보드</span>
                </motion.div>

                {/* 화살표 1 */}
                <motion.div animate={{ opacity: step >= 2 ? 1 : 0.2 }}>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-stone-400" />
                </motion.div>

                {/* scanf 박스 */}
                <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ opacity: step >= 2 ? 1 : 0.4 }}
                >
                    <motion.div
                        className={`w-16 h-16 md:w-20 md:h-20 border-2 rounded-xl flex items-center justify-center transition-colors duration-300 ${step >= 2 ? 'border-yellow-400 bg-yellow-50' : 'border-stone-200 bg-stone-50'}`}
                        animate={{ scale: step === 2 ? [1, 1.08, 1] : 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className={`font-mono font-bold text-sm transition-colors ${step >= 2 ? 'text-yellow-700' : 'text-stone-300'}`}>scanf</span>
                    </motion.div>
                    <span className="text-xs text-stone-500 font-body">처리</span>
                </motion.div>

                {/* 화살표 2 */}
                <motion.div animate={{ opacity: step >= 3 ? 1 : 0.2 }}>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-stone-400" />
                </motion.div>

                {/* 변수 박스 */}
                <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ opacity: step >= 3 ? 1 : 0.4 }}
                >
                    <motion.div
                        className={`w-16 h-16 md:w-20 md:h-20 border-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors duration-300 ${step >= 3 ? 'border-green-400 bg-green-50' : 'border-stone-200 bg-stone-50'}`}
                        animate={{ scale: step === 3 ? [1, 1.12, 1] : 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <AnimatePresence>
                            {step >= 3 && stored !== null && (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="font-mono font-bold text-green-700 text-xl"
                                >
                                    {stored}
                                </motion.span>
                            )}
                            {step < 3 && (
                                <span className="text-stone-300 text-xs font-mono">???</span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <span className="text-xs text-stone-500 font-body">int age</span>
                </motion.div>
            </div>

            {/* 코드 */}
            <div className="bg-stone-900 rounded-lg p-3 md:p-4 font-mono text-sm text-stone-300 mb-4">
                <div className="text-stone-500 text-xs mb-2">// 입력 받는 코드</div>
                <div className={`-mx-2 px-2 py-0.5 rounded transition-colors ${step === 0 ? 'bg-stone-700/50 text-white' : ''}`}>
                    <span className="text-blue-400">int</span> age;
                </div>
                <div className={`-mx-2 px-2 py-0.5 rounded transition-colors ${step >= 1 && step < 3 ? 'bg-yellow-900/40 text-white' : ''}`}>
                    <span className="text-yellow-400">scanf</span>(<span className="text-green-400">"%d"</span>, &amp;age);
                </div>
                <div className={`-mx-2 px-2 py-0.5 rounded transition-colors ${step >= 3 ? 'bg-green-900/40 text-white' : ''}`}>
                    <span className="text-yellow-400">printf</span>(<span className="text-green-400">"age = %d\n"</span>, age);
                    {step >= 3 && <span className="text-stone-500 text-xs ml-2">// age = {stored}</span>}
                </div>
            </div>

            {/* 설명 */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-body text-center min-h-[48px] flex items-center justify-center">
                {step === 0 && 'int age; — age라는 이름의 칸을 준비했어요. 아직 값은 없어요.'}
                {step === 1 && `키보드에서 숫자를 입력하는 중이에요...`}
                {step === 2 && `숫자 ${DEMO_VALUE}을 다 입력했어요. Enter를 누르면 scanf가 age에 넣어줘요!`}
                {step === 3 && <span className="text-green-700 font-bold">age에 {stored}가 저장됐어요! &amp;age는 "age가 있는 메모리 주소"를 알려줘요.</span>}
            </div>
        </VizCard>
    );
}
