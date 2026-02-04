'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Repeat, Cpu, Monitor } from 'lucide-react';

export function ArrayFlowViz() {
    const steps = [
        { title: "1. 입력", icon: Database, desc: "배열에 값을 받는다" },
        { title: "2. 순회", icon: Repeat, desc: "처음부터 끝까지 훑는다" },
        { title: "3. 계산", icon: Cpu, desc: "합, 최대 등 값을 만든다" },
        { title: "4. 출력", icon: Monitor, desc: "결과를 보여준다" },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto my-6 md:my-12 p-4 md:p-8 bg-white rounded-xl shadow-lg border border-stone-200">
            <h3 className="text-center font-heading font-bold text-base md:text-xl text-stone-800 mb-6 md:mb-10">
                배열 문제 해결의 4단계
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        <motion.div
                            className="flex flex-col items-center gap-2 md:gap-3 relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.3, duration: 0.5 }}
                        >
                            <motion.div
                                className="w-12 h-12 md:w-16 md:h-16 bg-stone-100 rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-stone-200 text-stone-600 shadow-sm"
                                whileHover={{ scale: 1.1, borderColor: '#ca8a04', color: '#ca8a04', backgroundColor: '#fefce8' }}
                            >
                                <step.icon className="w-6 h-6 md:w-8 md:h-8" />
                            </motion.div>

                            <div className="text-center">
                                <div className="font-bold text-stone-900 text-sm md:text-base mb-0.5 md:mb-1">{step.title}</div>
                                <div className="text-[10px] md:text-xs text-stone-500 break-keep w-20 md:w-24">{step.desc}</div>
                            </div>
                        </motion.div>

                        {i < steps.length - 1 && (
                            <motion.div
                                className="hidden md:block text-stone-300"
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.3 + 0.15 }}
                            >
                                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>
                        )}

                        {i < steps.length - 1 && (
                            <motion.div
                                className="md:hidden text-stone-300 py-1"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.3 + 0.15 }}
                            >
                                <ArrowRight className="w-5 h-5 rotate-90" />
                            </motion.div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
