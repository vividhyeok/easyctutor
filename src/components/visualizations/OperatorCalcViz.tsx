'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VizCard } from './VizCard';

const OPS = [
    { op: '+', label: '더하기', color: 'border-blue-400 bg-blue-50', textColor: 'text-blue-700', resultColor: 'text-blue-900' },
    { op: '-', label: '빼기', color: 'border-purple-400 bg-purple-50', textColor: 'text-purple-700', resultColor: 'text-purple-900' },
    { op: '*', label: '곱하기', color: 'border-orange-400 bg-orange-50', textColor: 'text-orange-700', resultColor: 'text-orange-900' },
    { op: '/', label: '나누기(몫)', color: 'border-green-400 bg-green-50', textColor: 'text-green-700', resultColor: 'text-green-900' },
    { op: '%', label: '나머지', color: 'border-red-400 bg-red-50', textColor: 'text-red-600', resultColor: 'text-red-800' },
] as const;

function calcResult(a: number, b: number, op: string): { value: string; note?: string } {
    if (!Number.isFinite(a) || !Number.isFinite(b)) return { value: '?' };
    switch (op) {
        case '+': return { value: String(a + b) };
        case '-': return { value: String(a - b) };
        case '*': return { value: String(a * b) };
        case '/':
            if (b === 0) return { value: '오류', note: '0으로 나눌 수 없어요' };
            const q = Math.trunc(a / b);
            const exact = a / b;
            return {
                value: String(q),
                note: q !== exact ? `실제 값 ${exact.toFixed(2)} → 소수점 버림` : undefined,
            };
        case '%':
            if (b === 0) return { value: '오류', note: '0으로 나눌 수 없어요' };
            return { value: String(((a % b) + Math.abs(b)) % Math.abs(b) * Math.sign(a === 0 ? 1 : a) || a % b) };
        default:
            return { value: '?' };
    }
}

export function OperatorCalcViz() {
    const [rawA, setRawA] = useState('10');
    const [rawB, setRawB] = useState('3');

    const a = parseInt(rawA, 10);
    const b = parseInt(rawB, 10);
    const validA = !isNaN(a);
    const validB = !isNaN(b);

    return (
        <VizCard title="C 연산자 직접 해보기 — 숫자를 바꿔서 결과를 확인해봐요">
            {/* 숫자 입력 */}
            <div className="flex items-end justify-center gap-3 md:gap-6 mb-6">
                <div className="flex flex-col items-center gap-1.5">
                    <label className="text-xs font-bold text-stone-500 font-heading tracking-wide">a</label>
                    <input
                        type="number"
                        value={rawA}
                        onChange={e => setRawA(e.target.value)}
                        className="w-20 h-14 text-center text-2xl font-mono font-bold border-2 border-stone-800 rounded-lg bg-white shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                    <label className="text-xs font-bold text-stone-500 font-heading tracking-wide">연산자</label>
                    <div className="flex gap-1 text-2xl font-mono font-bold text-stone-400 h-14 items-center px-2">
                        + - * / %
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                    <label className="text-xs font-bold text-stone-500 font-heading tracking-wide">b</label>
                    <input
                        type="number"
                        value={rawB}
                        onChange={e => setRawB(e.target.value)}
                        className="w-20 h-14 text-center text-2xl font-mono font-bold border-2 border-stone-800 rounded-lg bg-white shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                </div>
            </div>

            {/* 결과 카드들 */}
            {validA && validB ? (
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
                    {OPS.map(({ op, label, color, textColor, resultColor }) => {
                        const { value, note } = calcResult(a, b, op);
                        return (
                            <motion.div
                                key={op}
                                layout
                                className={`border-2 rounded-xl p-3 md:p-4 flex flex-col items-center gap-1.5 ${color} min-w-[calc(33%-8px)] md:min-w-0 md:flex-1`}
                                whileHover={{ scale: 1.04 }}
                                transition={{ duration: 0.15 }}
                            >
                                <div className={`font-mono text-sm font-bold ${textColor} opacity-70`}>
                                    {a} <span className="text-base">{op}</span> {b}
                                </div>
                                <motion.div
                                    key={value}
                                    initial={{ scale: 1.3, opacity: 0.6 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                    className={`font-mono font-bold text-2xl md:text-3xl ${resultColor}`}
                                >
                                    {value}
                                </motion.div>
                                <div className={`text-[10px] font-heading font-bold ${textColor} opacity-60`}>
                                    {label}
                                </div>
                                {note && (
                                    <div className={`text-[9px] md:text-[10px] text-center ${textColor} opacity-70 leading-tight break-keep max-w-[80px]`}>
                                        {note}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-stone-400 text-sm py-8 font-body">
                    숫자를 입력해주세요
                </div>
            )}

            {/* 안내 */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-body text-stone-600 text-center">
                <span className="font-bold text-stone-800">/ 와 %</span>를 같이 보세요 —
                {' '}<span className="font-mono bg-stone-100 px-1 rounded">10 / 3 = 3</span>(몫),{' '}
                <span className="font-mono bg-stone-100 px-1 rounded">10 % 3 = 1</span>(나머지)이에요.
                C에서 정수 나누기는 소수점을 버려요!
            </div>
        </VizCard>
    );
}
