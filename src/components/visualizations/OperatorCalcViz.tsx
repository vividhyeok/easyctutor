'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VizCard } from './VizCard';

const OPS = [
    { op: '+', label: '더하기' },
    { op: '-', label: '빼기' },
    { op: '*', label: '곱하기' },
    { op: '/', label: '나누기 — 몫만 남아요' },
    { op: '%', label: '나머지' },
] as const;

function calcResult(a: number, b: number, op: string): { value: string; isSpecial: boolean; note?: string } {
    if (!Number.isFinite(a) || !Number.isFinite(b)) return { value: '?', isSpecial: false };
    if (b === 0 && (op === '/' || op === '%')) {
        return { value: '오류', isSpecial: true, note: '0으로 나눌 수 없어요' };
    }
    switch (op) {
        case '+': return { value: String(a + b), isSpecial: false };
        case '-': return { value: String(a - b), isSpecial: false };
        case '*': return { value: String(a * b), isSpecial: false };
        case '/': {
            const q = Math.trunc(a / b);
            const exact = a / b;
            const special = q !== exact;
            return {
                value: String(q),
                isSpecial: special,
                note: special ? `실제 ${exact.toFixed(2)} → 소수점 버림!` : undefined,
            };
        }
        case '%': {
            return { value: String(a % b), isSpecial: false };
        }
        default: return { value: '?', isSpecial: false };
    }
}

export function OperatorCalcViz() {
    const [rawA, setRawA] = useState('10');
    const [rawB, setRawB] = useState('3');

    const a = parseInt(rawA, 10);
    const b = parseInt(rawB, 10);
    const valid = !isNaN(a) && !isNaN(b);

    return (
        <VizCard title="연산자 직접 해보기">
            {/* 입력 */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold font-heading text-stone-400 tracking-wider">a</span>
                    <input
                        type="number"
                        value={rawA}
                        onChange={e => setRawA(e.target.value)}
                        className="w-20 h-12 text-center text-xl font-mono font-bold border-2 border-stone-800 rounded-lg bg-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold font-heading text-stone-400 tracking-wider">b</span>
                    <input
                        type="number"
                        value={rawB}
                        onChange={e => setRawB(e.target.value)}
                        className="w-20 h-12 text-center text-xl font-mono font-bold border-2 border-stone-800 rounded-lg bg-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                </div>
            </div>

            {/* 결과 테이블 */}
            {valid ? (
                <div className="bg-stone-900 rounded-lg overflow-hidden mb-4">
                    <div className="grid grid-cols-[auto_1fr_auto_1fr] text-xs font-heading font-bold text-stone-500 px-4 py-2 border-b border-stone-700 tracking-wider">
                        <span className="w-6">op</span>
                        <span className="pl-3">식</span>
                        <span className="pr-4 text-right">결과</span>
                        <span className="pl-3">설명</span>
                    </div>
                    {OPS.map(({ op, label }) => {
                        const { value, isSpecial, note } = calcResult(a, b, op);
                        return (
                            <div
                                key={op}
                                className={`grid grid-cols-[auto_1fr_auto_1fr] items-center px-4 py-2.5 border-b border-stone-800 last:border-0 transition-colors duration-150 ${isSpecial ? 'bg-yellow-400/10' : ''}`}
                            >
                                <span className={`w-6 font-mono font-bold text-base ${isSpecial ? 'text-yellow-400' : 'text-stone-400'}`}>{op}</span>
                                <span className="pl-3 font-mono text-sm text-stone-300">
                                    {a} {op} {b}
                                </span>
                                <motion.span
                                    key={`${a}-${b}-${op}`}
                                    initial={{ scale: 1.3, opacity: 0.5 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                    className={`pr-4 font-mono font-bold text-lg text-right ${isSpecial ? 'text-yellow-300' : 'text-white'}`}
                                >
                                    {value}
                                </motion.span>
                                <span className={`pl-3 text-xs font-body leading-tight break-keep ${isSpecial ? 'text-yellow-400' : 'text-stone-500'}`}>
                                    {note ?? label}
                                </span>
                            </div>
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
                <span className="font-mono mx-1 bg-stone-100 px-1 rounded">10 / 3</span>은 몫 <span className="font-bold">3</span>,
                <span className="font-mono mx-1 bg-stone-100 px-1 rounded">10 % 3</span>은 나머지 <span className="font-bold">1</span>이에요.
            </div>
        </VizCard>
    );
}
