'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Repeat, Cpu, Monitor } from 'lucide-react';
import { VizCard } from './VizCard';

export function ArrayFlowViz() {
    const steps = [
        { title: "1. 입력", icon: Database, desc: "배열에 값을 받는다", color: "text-blue-600 bg-blue-50 border-blue-200" },
        { title: "2. 순회", icon: Repeat, desc: "처음부터 끝까지 훑는다", color: "text-purple-600 bg-purple-50 border-purple-200" },
        { title: "3. 계산", icon: Cpu, desc: "합, 최대 등 값을 만든다", color: "text-orange-600 bg-orange-50 border-orange-200" },
        { title: "4. 출력", icon: Monitor, desc: "결과를 보여준다", color: "text-green-600 bg-green-50 border-green-200" },
    ];

    return (
        <VizCard title="배열 문제 해결의 4단계">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-2">
                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        <motion.div
                            className="flex flex-col items-center gap-2 md:gap-3 w-full md:w-auto"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.4 }}
                        >
                            <motion.div
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border-2 shadow-sm ${step.color}`}
                                whileHover={{ scale: 1.1 }}
                            >
                                <step.icon className="w-6 h-6 md:w-8 md:h-8" />
                            </motion.div>
                            <div className="text-center">
                                <div className="font-bold text-stone-900 text-sm md:text-base mb-0.5">{step.title}</div>
                                <div className="text-[10px] md:text-xs text-stone-500 break-keep w-20 md:w-24">{step.desc}</div>
                            </div>
                        </motion.div>

                        {i < steps.length - 1 && (
                            <>
                                <motion.div
                                    className="hidden md:block text-stone-300"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 + 0.1 }}
                                >
                                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                                </motion.div>
                                <motion.div
                                    className="md:hidden text-stone-300"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 + 0.1 }}
                                >
                                    <ArrowRight className="w-4 h-4 rotate-90" />
                                </motion.div>
                            </>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </VizCard>
    );
}
