'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CodePlayground } from '../code/CodePlayground';
import { ArrowRight, Check, X } from 'lucide-react';

export function LoopBasicViz() {
    const code = `#include <stdio.h>

int main(void) {
    // 1. i는 0부터 시작
    // 2. 3보다 작으면 계속
    // 3. 한 번 돌 때마다 1 증가
    for (int i = 0; i < 3; i++) {
        printf("%d\\n", i);
    }
    return 0;
}`;

    const simulationSteps = [
        7, 8, // i=0
        7, 8, // i=1
        7, 8, // i=2
        7     // i=3 (Fail)
    ];

    const [iVal, setIVal] = useState(0);
    const [stepState, setStepState] = useState<'init' | 'check' | 'body' | 'update'>('init');
    const [output, setOutput] = useState<string[]>([]);

    const handleStepChange = (stepIndex: number) => {
        // Reset
        if (stepIndex === -1) {
            setIVal(0);
            setOutput([]);
            setStepState('init');
            return;
        }

        // Deterministic state calculation
        // i=0 loop: steps 0, 1
        // i=1 loop: steps 2, 3
        // i=2 loop: steps 4, 5
        // i=3 loop: steps 6

        let nextIVal = 0;
        let nextStepState: 'init' | 'check' | 'body' | 'update' = 'init';
        let nextOutput: string[] = [];

        if (stepIndex <= 1) { // i=0
            nextIVal = 0;
            nextStepState = (stepIndex === 0) ? 'check' : 'body';
            if (stepIndex === 1) nextOutput = ["0"];
        } else if (stepIndex <= 3) { // i=1
            nextIVal = 1;
            nextStepState = (stepIndex === 2) ? 'check' : 'body';
            nextOutput = ["0"];
            if (stepIndex === 3) nextOutput.push("1");
        } else if (stepIndex <= 5) { // i=2
            nextIVal = 2;
            nextStepState = (stepIndex === 4) ? 'check' : 'body';
            nextOutput = ["0", "1"];
            if (stepIndex === 5) nextOutput.push("2");
        } else { // i=3
            nextIVal = 3;
            nextStepState = 'check';
            nextOutput = ["0", "1", "2"];
        }

        setIVal(nextIVal);
        setStepState(nextStepState);
        setOutput(nextOutput);
    };

    // Sketchy border radius style
    const handDrawnBorder = "255px 15px 225px 15px / 15px 225px 15px 255px";

    return (
        <CodePlayground
            code={code}
            title="반복문 개념도"
            simulationSteps={simulationSteps}
            onStepChange={handleStepChange}
            visualizer={
                <div className="flex flex-col w-full h-full p-6 gap-8 bg-[#fffdf5] font-body text-stone-800">

                    {/* Visual Diagram Area */}
                    <div className="flex items-center justify-around py-4">

                        {/* Loop Variable */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm font-bold text-stone-500 font-heading">현재 i 값</span>
                            <div
                                className="w-20 h-20 bg-stone-800 flex items-center justify-center text-3xl font-bold text-white shadow-md transition-all duration-300"
                                style={{ borderRadius: handDrawnBorder }}
                            >
                                {iVal}
                            </div>
                        </div>

                        {/* Flow Blocks */}
                        <div className="flex gap-3">
                            {/* Start */}
                            <div className={`px-4 py-3 border-2 flex flex-col items-center gap-1 transition-colors duration-300 ${stepState === 'init' ? 'border-blue-500 bg-blue-50' : 'border-stone-300 bg-white'
                                }`} style={{ borderRadius: "10px" }}>
                                <span className="text-xs font-bold text-stone-400">시작</span>
                                <span className="font-heading text-xl">0</span>
                            </div>

                            <ArrowRight className="text-stone-300 self-center" />

                            {/* Condition */}
                            <div className={`px-4 py-3 border-2 flex flex-col items-center gap-1 transition-colors duration-300 ${stepState === 'check' ? (iVal < 3 ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-stone-300 bg-white'
                                }`} style={{ borderRadius: "10px" }}>
                                <span className="text-xs font-bold text-stone-400">조건(3보다 작음?)</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-heading text-xl">
                                        {iVal} &lt; 3
                                    </span>
                                    {stepState === 'check' && (
                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            {iVal < 3 ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
                                        </motion.span>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Current Action / Narrator */}
                    <div className="flex justify-center">
                        <div className={`relative px-8 py-4 border-2 border-dashed border-stone-300 rounded-xl bg-white w-full max-w-sm text-center shadow-sm transition-all duration-300 ${stepState === 'body' ? 'border-yellow-400 bg-yellow-50 scale-105' : ''
                            }`}>
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs font-bold text-stone-400">
                                지금 컴퓨터가 하는 생각
                            </span>
                            <p className="text-lg font-heading break-keep leading-tight">
                                {stepState === 'init' && "i를 0으로 만들고 시작하자!"}
                                {stepState === 'check' && (iVal < 3 ? `i가 ${iVal}이니까 3보다 작네? 통과!` : `i가 ${iVal}이네? 3보다 작지 않으니 멈춰!`)}
                                {stepState === 'body' && `i값 ${iVal}을 출력하자!`}
                                {stepState === 'update' && "이제 i를 1개 늘리자."}
                            </p>
                        </div>
                    </div>

                    {/* Output Preview */}
                    <div className="mt-auto border-t-2 border-stone-200 pt-4 px-2">
                        <div className="flex items-center gap-2 text-stone-400 text-sm font-bold mb-2">
                            <span>출력 결과</span>
                            <div className="h-px bg-stone-200 flex-1"></div>
                        </div>
                        <div className="flex gap-3 font-mono text-lg text-stone-800 h-8">
                            {output.map((v, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-stone-100 px-2 rounded border border-stone-200"
                                >
                                    {v}
                                </motion.span>
                            ))}
                            {stepState === 'body' && (
                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity }} className="w-2 h-6 bg-stone-400" />
                            )}
                        </div>
                    </div>

                </div>
            }
        />
    );
}
