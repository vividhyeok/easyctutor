import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrayFlowViz } from './visualizations/ArrayFlowViz';
import { ArraySumViz } from './visualizations/ArraySumViz';
import { ArrayMaxViz } from './visualizations/ArrayMaxViz';
import { ArrayCountViz } from './visualizations/ArrayCountViz';
import { ArrayReverseViz } from './visualizations/ArrayReverseViz';
import { LoopBasicViz } from './visualizations/LoopBasicViz';
import { StringNullViz } from './visualizations/StringNullViz';
import { PointerBasicViz } from './visualizations/PointerBasicViz';
import { ArrayPointerViz } from './visualizations/ArrayPointerViz';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            rehypePlugins={[
                [rehypeRaw, {
                    passThrough: [
                        'loopbasicviz', 'arrayflowviz', 'arraysumviz', 'arraymaxviz', 'arraycountviz', 'arrayreverseviz',
                        'stringnullviz', 'pointerbasicviz', 'arraypointerviz',
                        'LoopBasicViz', 'ArrayFlowViz', 'ArraySumViz', 'ArrayMaxViz', 'ArrayCountViz', 'ArrayReverseViz',
                        'StringNullViz', 'PointerBasicViz', 'ArrayPointerViz'
                    ]
                }],
                rehypeSlug
            ]}
            components={{
                h1: ({ node, ...props }: any) => <h1 className="heading" {...props} />,
                h2: ({ node, ...props }: any) => <h2 className="heading mt-8 mb-4 text-2xl" {...props} />,
                h3: ({ node, ...props }: any) => <h3 className="heading mt-6 mb-3 text-xl" {...props} />,
                strong: ({ node, ...props }: any) => <span className="hl font-semibold" {...props} />,
                u: ({ node, ...props }: any) => <u className="wave-underline" {...props} />,

                // Robust paragraph unwrapper for visualizations
                p: ({ node, children, ...props }: any) => {
                    const childrenArray = React.Children.toArray(children);

                    // Check if any child is a visualization component or code block
                    const hasBlockContent = childrenArray.some((child: any) => {
                        // Check if it's a React Element
                        if (React.isValidElement(child)) {
                            const type = child.type;
                            // Check for component names (function names)
                            if (typeof type === 'function') {
                                const name = type.name || '';
                                return name.includes('Viz') || name.includes('viz') || name.includes('Playground') || name.includes('playground');
                            }
                            // Check for HTML tags that should be blocks
                            if (typeof type === 'string') {
                                return ['div', 'section', 'pre'].includes(type) ||
                                    (child.props as any)?.className?.includes('code-card');
                            }
                        }
                        return false;
                    });

                    if (hasBlockContent) {
                        // Return fragment to completely unwrap from p tag
                        return <>{children}</>;
                    }

                    return <p className="leading-7 mb-6" {...props}>{children}</p>;
                },

                // Visualization Components
                arrayflowviz: () => <ArrayFlowViz />,
                arraysumviz: () => <ArraySumViz />,
                arraymaxviz: () => <ArrayMaxViz />,
                arraycountviz: () => <ArrayCountViz />,
                arrayreverseviz: () => <ArrayReverseViz />,

                // Compatibility for CamelCase if needed
                ArrayFlowViz: () => <ArrayFlowViz />,
                ArraySumViz: () => <ArraySumViz />,
                ArrayMaxViz: () => <ArrayMaxViz />,
                ArrayCountViz: () => <ArrayCountViz />,
                ArrayReverseViz: () => <ArrayReverseViz />,

                // Chapter 6
                LoopBasicViz: () => <LoopBasicViz />,
                loopbasicviz: () => <LoopBasicViz />,

                // Chapter 16
                StringNullViz: () => <StringNullViz />,
                stringnullviz: () => <StringNullViz />,

                // Chapter 13
                PointerBasicViz: () => <PointerBasicViz />,
                pointerbasicviz: () => <PointerBasicViz />,

                // Chapter 15
                ArrayPointerViz: () => <ArrayPointerViz />,
                arraypointerviz: () => <ArrayPointerViz />,

                // Code blocks: custom black card
                code: ({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode;[key: string]: any }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';

                    // Check if content has newlines (multi-line = block code)
                    const hasNewlines = String(children).includes('\n');

                    // Inline code - single backtick without newlines
                    if (inline || !hasNewlines) {
                        return (
                            <code className="inline-code" {...props}>
                                {children}
                            </code>
                        );
                    }

                    // Block code with language
                    if (match) {
                        return (
                            <div className="code-card not-prose">
                                <div className="flex justify-between items-center mb-2 px-2">
                                    <span className="text-xs text-gray-400 uppercase">{language}</span>
                                </div>
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={language}
                                    PreTag="div"
                                    customStyle={{
                                        background: 'transparent',
                                        padding: 0,
                                        margin: 0,
                                        fontSize: '16px',
                                        lineHeight: '1.7',
                                        fontFamily: 'D2Coding, Consolas, Monaco, "Courier New", monospace'
                                    }}
                                    codeTagProps={{
                                        style: {
                                            fontSize: '16px',
                                            fontFamily: 'D2Coding, Consolas, Monaco, "Courier New", monospace',
                                            lineHeight: '1.7'
                                        }
                                    }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        );
                    }

                    // Block code without language
                    return (
                        <div className="code-card not-prose">
                            <pre style={{ background: 'transparent', padding: 0, margin: 0 }} {...props}>
                                {children}
                            </pre>
                        </div>
                    );
                },

                // Horizontal rules - add more spacing
                hr: ({ node, ...props }: any) => (
                    <hr className="my-12 border-t-2 border-gray-200" {...props} />
                ),

                // Blockquotes
                blockquote: ({ node, ...props }: any) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-8" {...props} />
                ),
            } as any}
        >
            {content}
        </ReactMarkdown>
    );
}
