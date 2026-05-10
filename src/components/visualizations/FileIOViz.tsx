'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Keyboard, FileText, Monitor, ArrowRight } from 'lucide-react';
import { VizCard } from './VizCard';

export function FileIOViz() {
    const writeFlow = [
        { icon: Keyboard, label: '키보드', desc: 'scanf로 입력', color: 'bg-blue-50 border-blue-300 text-blue-600' },
        { icon: FileText, label: '프로그램', desc: 'fprintf 처리', color: 'bg-yellow-50 border-yellow-400 text-yellow-700' },
        { icon: FileText, label: 'data.txt', desc: '파일에 저장', color: 'bg-green-50 border-green-400 text-green-700' },
    ];

    const readFlow = [
        { icon: FileText, label: 'data.txt', desc: '저장된 파일', color: 'bg-green-50 border-green-400 text-green-700' },
        { icon: FileText, label: '프로그램', desc: 'fscanf 처리', color: 'bg-yellow-50 border-yellow-400 text-yellow-700' },
        { icon: Monitor, label: '화면', desc: 'printf 출력', color: 'bg-purple-50 border-purple-300 text-purple-600' },
    ];

    const FlowRow = ({ items, title, delay = 0 }: { items: typeof writeFlow, title: string, delay?: number }) => (
        <div className="w-full">
            <div className="text-xs font-bold text-stone-500 font-heading mb-2 md:mb-3">{title}</div>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                {items.map((item, i) => (
                    <React.Fragment key={i}>
                        <motion.div
                            className={`flex flex-col items-center gap-1 md:gap-2 flex-1 min-w-[72px] border-2 rounded-xl p-2 md:p-3 ${item.color}`}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: delay + i * 0.2, duration: 0.4 }}
                        >
                            <item.icon className="w-5 h-5 md:w-7 md:h-7" />
                            <span className="font-bold text-[11px] md:text-sm text-stone-800">{item.label}</span>
                            <span className="text-[9px] md:text-xs text-stone-500 text-center break-keep">{item.desc}</span>
                        </motion.div>
                        {i < items.length - 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: delay + i * 0.2 + 0.1 }}
                            >
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-stone-300 flex-shrink-0" />
                            </motion.div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    return (
        <VizCard title="파일 입출력의 흐름">
            <div className="flex flex-col gap-5 md:gap-8">
                <FlowRow items={writeFlow} title="📝 파일에 쓰기 (fopen + fprintf + fclose)" delay={0} />

                <div className="border-t-2 border-dashed border-stone-200" />

                <FlowRow items={readFlow} title="📖 파일에서 읽기 (fopen + fscanf + fclose)" delay={0.1} />
            </div>

            <div className="mt-5 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                {[
                    { step: '① fopen', desc: '"w"(쓰기) 또는 "r"(읽기) 모드로 파일 열기', color: 'bg-yellow-50 border-yellow-300' },
                    { step: '② 읽기/쓰기', desc: 'fprintf로 파일에 쓰고, fscanf로 파일에서 읽기', color: 'bg-blue-50 border-blue-300' },
                    { step: '③ fclose', desc: '다 쓰면 반드시 닫기 — 안 닫으면 저장 안 될 수 있어요!', color: 'bg-red-50 border-red-300' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className={`border-2 rounded-xl p-3 ${item.color}`}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                    >
                        <div className="font-bold text-stone-800 text-sm mb-1 font-heading">{item.step}</div>
                        <div className="text-xs text-stone-600 break-keep leading-relaxed">{item.desc}</div>
                    </motion.div>
                ))}
            </div>
        </VizCard>
    );
}
