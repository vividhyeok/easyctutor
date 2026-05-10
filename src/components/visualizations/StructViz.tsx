'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';

export function StructViz() {
    const [step, setStep] = useState(0);
    // 0: 흩어진 변수들  1: struct로 묶인 모습  2: 멤버 접근(.)

    return (
        <div className="w-full max-w-2xl mx-auto my-6 md:my-12 p-4 md:p-8 bg-white rounded-xl shadow-lg border border-stone-200">
            <h3 className="text-center font-heading font-bold text-base md:text-xl text-stone-800 mb-6 md:mb-8">
                구조체 — 흩어진 변수를 한 덩어리로
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6 md:mb-8">

                {/* 왼쪽: 흩어진 변수들 */}
                <motion.div
                    className={`flex flex-col gap-2 p-4 border-2 rounded-xl transition-colors duration-300 ${step === 0 ? 'border-stone-400 bg-stone-50' : 'border-stone-200 bg-stone-50 opacity-50'}`}
                    animate={{ scale: step === 0 ? 1 : 0.95 }}
                >
                    <div className="text-xs font-bold text-stone-500 font-heading mb-1 text-center">흩어진 변수</div>
                    {[
                        { type: 'char', name: 'name[]', val: '"kim"' },
                        { type: 'int', name: 'id', val: '20260001' },
                        { type: 'int', name: 'score', val: '95' },
                    ].map((v, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="bg-white border border-stone-300 rounded-lg px-3 py-2 font-mono text-xs md:text-sm min-w-[120px]">
                                <span className="text-stone-400">{v.type} </span>
                                <span className="font-bold text-stone-700">{v.name}</span>
                                <span className="text-stone-400"> = </span>
                                <span className="text-stone-800">{v.val}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* 화살표 */}
                <AnimatePresence>
                    {step >= 1 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center"
                        >
                            <ArrowRight className="w-7 h-7 text-yellow-500" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 오른쪽: struct 박스 */}
                <AnimatePresence>
                    {step >= 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="border-2 border-yellow-400 rounded-xl p-4 bg-yellow-50 min-w-[160px]"
                        >
                            <div className="text-xs font-bold text-yellow-700 font-heading mb-3 text-center">
                                struct Student s
                            </div>
                            <div className="flex flex-col gap-0 rounded-lg overflow-hidden border border-yellow-300">
                                {[
                                    { field: 'name', val: '"kim"', color: 'bg-orange-50' },
                                    { field: 'id', val: '20260001', color: 'bg-yellow-50' },
                                    { field: 'score', val: '95', color: 'bg-amber-50' },
                                ].map((f, i) => (
                                    <motion.div
                                        key={f.field}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.15 }}
                                        className={`flex items-center justify-between px-3 py-2 border-b last:border-b-0 border-yellow-200 ${f.color} ${step === 2 ? 'hover:bg-yellow-100' : ''}`}
                                    >
                                        <span className="font-mono text-xs md:text-sm font-bold text-stone-600">
                                            s.
                                            <motion.span
                                                animate={{ color: step === 2 ? '#ca8a04' : '#57534e' }}
                                                className="text-stone-700"
                                            >
                                                {f.field}
                                            </motion.span>
                                        </span>
                                        <span className="font-mono text-xs md:text-sm text-stone-700">{f.val}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 코드 예시 */}
            <AnimatePresence>
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-stone-900 rounded-lg p-4 mb-5 font-mono text-sm text-stone-300 shadow-inner"
                    >
                        <div className="text-stone-500 text-xs mb-2">// 이렇게 접근해요</div>
                        <div><span className="text-yellow-400">s.name</span>  → "kim"</div>
                        <div><span className="text-yellow-400">s.id</span>    → 20260001</div>
                        <div><span className="text-yellow-400">s.score</span> → 95</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 설명 */}
            <div className="bg-stone-50 rounded-lg px-4 py-3 mb-5 text-sm text-stone-600 text-center font-body">
                {step === 0 && '변수가 제각각 흩어져 있어요. 학생이 많아지면 관리하기 힘들어요.'}
                {step === 1 && '구조체로 묶으면 s 하나에 이름, 학번, 점수가 다 들어가요!'}
                {step === 2 && 's.name, s.id처럼 점(.)으로 원하는 칸에 접근할 수 있어요.'}
            </div>

            <div className="flex justify-center gap-3">
                <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors font-medium text-sm"
                >
                    <RotateCcw className="w-4 h-4" />
                    처음부터
                </button>
                <button
                    type="button"
                    onClick={() => setStep(s => Math.min(s + 1, 2))}
                    disabled={step >= 2}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all ${step >= 2 ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-stone-900 text-white hover:bg-stone-800 shadow-md transform hover:scale-105'}`}
                >
                    {step === 0 ? '구조체로 묶어보기' : step === 1 ? '멤버 접근해보기' : '완료!'}
                </button>
            </div>
        </div>
    );
}
