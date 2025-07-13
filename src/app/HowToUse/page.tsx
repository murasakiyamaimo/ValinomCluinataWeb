"use client"

import React, { useState } from "react";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import LiquidGlassButton from "@/components/LiquidGlassButton";

// アプリケーションのメインコンポーネント
const UsagePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('tab1');
    const [isPitchMode, setIsPitchMode] = useState(false); // false = 子音符追加モード, true = ルート音ピッチモード

    const tabContent = {
        tab1: {
            heading: "音符の追加・削除・選択",
            items: [
                {
                    title: "音符の選択",
                    description: "スコア表示エリア上で既存のピッチライン（音符）をクリックすると選択できます。選択された音符は青いハイライトで表示されます。"
                },
                {
                    title: "新しいルート音の追加",
                    description: `キーボードで <span class="kbd">Ctrl</span> + <span class="kbd">→</span> を押すと、和音図の右側に新しいルート音を追加できます。`
                },
                {
                    title: "音符のミュート/ミュート解除",
                    description: `音符を選択した状態で <span class="kbd">Ctrl</span> + <span class="kbd">Space</span> を押すと、ミュート状態を切り替えられます。`
                },
                {
                    title: "音符の削除",
                    description: `音符を選択した状態で <span class="kbd">Delete</span> キーを押すと削除できます。（ルート音は削除不可）`
                }
            ]
        },
        tab2: {
            heading: "ピッチ操作モードの切り替え",
            description: `<span class="kbd">Shift</span> キーを押すと、下の２つのモードが切り替わります。`,
            modeDescription: isPitchMode
                ? `<p class="text-stone-700">次元ボタンが、<strong class="text-teal-700">ルート音全体のピッチ</strong>を変更する操作になります。</p>`
                : `<p class="text-stone-700">次元ボタンが、選択中の音符に<strong class="text-teal-700">新しい子音符を追加</strong>する操作になります。</p>`
        },
        tab3: {
            heading: "次元ボタンによる操作",
            description: "`Shift`キーで切り替えたモードによって、次元ボタンの役割が変わります。",
            modes: [
                {
                    title: "ルート音ピッチモード",
                    explanation: "次元ボタンは<strong class='text-teal-700'>ルート音全体のピッチ</strong>を変更します。",
                    actions: [
                        "<span class='font-mono text-teal-700'>D2, D3...</span>: ピッチを上げます。",
                        "<span class='font-mono text-teal-700'>D2_Down, D3_Down...</span>: ピッチを下げます。"
                    ]
                },
                {
                    title: "子音符追加モード",
                    explanation: "次元ボタンは選択された音符に<strong class='text-teal-700'>新しい子音符</strong>を追加します。",
                    actions: [
                        "<span class='font-mono text-teal-700'>D2, D3...</span>: 上に子音符を追加します。",
                        "<span class='font-mono text-teal-700'>D2_Down, D3_Down...</span>: 下に子音符を追加します。"
                    ]
                }
            ]
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-gray-900 to-black font-inter text-stone-800 bg-cover"
             style={{backgroundImage: "url('/images/BackgroundImage.png')"}}>
            {/* styled-jsxの属性を削除し、通常のstyleタグとして記述 */}
            <style global jsx>{`
                body {
                    font-family: 'Noto Sans JP', sans-serif;
                    background-color: #f8f8f8; /* Light background for the overall page */
                }
                .kbd {
                    background-color: #F3F4F6;
                    border: 1px solid #D1D5DB;
                    border-bottom-width: 2px;
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-family: monospace;
                    font-weight: 500;
                    color: #1F2937;
                    white-space: nowrap; /* Prevent line breaks inside kbd */
                }
                .tooltip-container {
                    position: relative;
                }
                .tooltip {
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity 0.3s;
                    position: absolute;
                    background-color: rgba(31, 41, 55, 0.9); /* stone-800 with opacity */
                    color: white;
                    font-size: 0.75rem; /* text-xs */
                    border-radius: 0.25rem; /* rounded */
                    padding: 0.5rem 0.75rem; /* py-2 px-3 */
                    z-index: 20; /* Higher than other elements */
                    bottom: calc(100% + 0.5rem); /* bottom-full mb-2 */
                    left: 50%;
                    transform: translateX(-50%);
                    white-space: nowrap;
                }
                .tooltip-container:hover .tooltip {
                    visibility: visible;
                    opacity: 1;
                }
                /* Specific tooltip positioning for canvas */
                #score-canvas-mock:hover .tooltip-canvas {
                    visibility: visible;
                    opacity: 1;
                }
                .tooltip-canvas {
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity 0.3s;
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, 0.5); /* bg-black bg-opacity-50 */
                    color: white;
                    font-size: 1.125rem; /* text-lg */
                    font-weight: bold;
                    border-radius: 0.5rem; /* rounded-lg */
                    padding: 1rem; /* p-4 */
                    z-index: 10;
                }
            `}</style>

            <header className="text-center mb-12 mt-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white">アプリ操作方法</h1>
            </header>

            <main className="w-full max-w-5xl mx-auto bg-repeat">

                {/* Section 1: UI Tour */}
                <LiquidGlassCard>
                    <section id="ui-tour" className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 text-center text-white">アプリの画面</h2>
                        <p className="text-center text-white mb-8 max-w-3xl mx-auto">
                            下のアプリ画面の模型にカーソルを合わせると、各要素の説明が表示されます。
                        </p>
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Left Panel */}
                                <div className="md:col-span-1 bg-stone-100 p-4 rounded-lg flex flex-col gap-4">
                                    <div className="tooltip-container">
                                        <LiquidGlassButton
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg items-center justify-center gap-2">
                                            <div className={"w-full h-full items-center justify-center flex"}>
                                                <svg className="w-6 h-6 " fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                再生
                                            </div>
                                        </LiquidGlassButton>
                                        <div className="tooltip">再生ボタン: 和音図の再生を開始・停止します。</div>
                                    </div>
                                    <div className="tooltip-container">
                                        <input type="text" placeholder="再生時間(秒)"
                                               className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-stone-800"/>
                                        <div className="tooltip">時間入力フィールド:
                                            和音図の再生時間を秒単位で設定します。
                                        </div>
                                    </div>
                                    <div className="tooltip-container">
                                        <select
                                            className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-stone-800">
                                            <option>Sine</option>
                                            <option>Sawtooth</option>
                                            <option>Square</option>
                                            <option>Triangle</option>
                                        </select>
                                        <div className="tooltip">シンセサイザータイプ選択:
                                            サウンドの波形タイプを選択します。
                                        </div>
                                    </div>
                                    <div className="tooltip-container mt-4 border-t border-stone-300 pt-4">
                                        <p className="text-sm font-semibold text-stone-700 mb-2 text-center">次元ボタン</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <LiquidGlassButton
                                                className="bg-white hover:bg-stone-200 text-stone-800">2D</LiquidGlassButton>
                                            <LiquidGlassButton className="bg-white hover:bg-stone-200 text-stone-800">2D
                                                ▼</LiquidGlassButton>
                                            <LiquidGlassButton
                                                className="bg-white hover:bg-stone-200 text-stone-800">3D</LiquidGlassButton>
                                            <LiquidGlassButton className="bg-white hover:bg-stone-200 text-stone-800">3D
                                                ▼</LiquidGlassButton>
                                            <LiquidGlassButton
                                                className="bg-white hover:bg-stone-200 text-stone-800">4D</LiquidGlassButton>
                                            <LiquidGlassButton className="bg-white hover:bg-stone-200 text-stone-800">4D
                                                ▼</LiquidGlassButton>
                                            <LiquidGlassButton
                                                className="bg-white hover:bg-stone-200 text-stone-800">5D</LiquidGlassButton>
                                            <LiquidGlassButton className="bg-white hover:bg-stone-200 text-stone-800">5D
                                                ▼</LiquidGlassButton>
                                        </div>
                                        <div className="tooltip">次元ボタン:
                                            音符の次元を変更したり、ピッチを変更したりするために使用されます。
                                        </div>
                                    </div>
                                </div>
                                {/* Right Panel - Score Canvas Mock */}
                                <div id="score-canvas-mock"
                                     className="md:col-span-3 relative bg-gray-700 rounded-lg p-4 h-80 overflow-hidden flex items-center justify-center">
                                    {/* Simple visual mock-up of the canvas content */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-full relative">
                                            {/* Center line */}
                                            <div className="absolute left-0 right-0 h-px bg-stone-400"
                                                 style={{top: '50%'}}></div>
                                            {/* Other lines */}
                                            {Array.from({length: 4}).map((_, i) => (
                                                <React.Fragment key={`line-up-${i}`}>
                                                    <div className="absolute left-0 right-0 h-px bg-stone-500"
                                                         style={{top: `calc(50% - ${40 * (i + 1)}px)`}}></div>
                                                    <div className="absolute left-0 right-0 h-px bg-stone-500"
                                                         style={{top: `calc(50% + ${40 * (i + 1)}px)`}}></div>
                                                </React.Fragment>
                                            ))}
                                            {/* Mock notes */}
                                            <div className="absolute bg-white rounded-full w-5 h-5"
                                                 style={{left: '50px', top: 'calc(50% - 10px)'}}></div>
                                            <div className="absolute bg-white/80 rounded-md w-32 h-2"
                                                 style={{left: '80px', top: 'calc(50% - 5px)'}}></div>
                                            <div className="absolute bg-white/80 rounded-md w-32 h-2"
                                                 style={{left: '220px', top: 'calc(50% - 40px - 5px)'}}></div>
                                        </div>
                                    </div>
                                    <div className="tooltip-canvas">
                                        スコア表示エリア: 和音図が表示され、音符の追加や選択が行われるメインエリアです。
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </LiquidGlassCard>

                <div className={"h-10"}></div>

                {/* Section 2: Editing Guide */}
                <LiquidGlassCard>
                    <section id="editing-guide" className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">和音図の編集方法</h2>
                        <p className="text-center text-stone-600 mb-8 max-w-3xl mx-auto">
                            和音図の編集は、キーボードショートカットとマウス操作を組み合わせて行います。以下のタブを切り替えて、各操作の詳細を確認してください。これにより、複雑なコマンドも体系的に学ぶことができます。
                        </p>

                        <div className="w-full max-w-4xl mx-auto">
                            {/* Tabs */}
                            <div className="mb-4 flex space-x-1 p-1 bg-stone-200 rounded-xl">
                                <LiquidGlassButton
                                    onClick={() => setActiveTab('tab1')}
                                    className={`${activeTab === 'tab1' ? 'bg-white shadow text-stone-700' : 'text-stone-600'} w-full text-center`}
                                >
                                    基本操作
                                </LiquidGlassButton>
                                <LiquidGlassButton
                                    onClick={() => setActiveTab('tab2')}
                                    className={`${activeTab === 'tab2' ? 'bg-white shadow text-stone-700' : 'text-stone-600'} w-full text-center`}
                                >
                                    モード切替
                                </LiquidGlassButton>
                                <LiquidGlassButton
                                    onClick={() => setActiveTab('tab3')}
                                    className={`${activeTab === 'tab3' ? 'bg-white shadow text-stone-700' : 'text-stone-600'} w-full text-center`}
                                >
                                    次元ボタン
                                </LiquidGlassButton>
                            </div>

                            {/* Tab Content */}
                            <div id="tab-content"
                                 className="bg-white p-6 rounded-lg shadow-inner border border-stone-200 min-h-[300px] text-left">
                                {activeTab === 'tab1' && (
                                    <div id="tab1" className="tab-panel">
                                        <h3 className="font-bold text-xl mb-4 text-teal-800">{tabContent.tab1.heading}</h3>
                                        <ul className="space-y-4">
                                            {tabContent.tab1.items.map((item, index) => (
                                                <li key={index} className="flex items-start gap-4">
                                                    <div
                                                        className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                                    <div>
                                                        <h4 className="font-semibold">{item.title}</h4>
                                                        <p className="text-stone-600"
                                                           dangerouslySetInnerHTML={{__html: item.description}}/>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {activeTab === 'tab2' && (
                                    <div id="tab2" className="tab-panel">
                                        <h3 className="font-bold text-xl mb-4 text-teal-800">{tabContent.tab2.heading}</h3>
                                        <div className="flex flex-col items-center">
                                            <p className="mb-4 text-stone-600"
                                               dangerouslySetInnerHTML={{__html: tabContent.tab2.description}}/>
                                            <div className="flex items-center justify-center space-x-2 mb-4">
                                                <span id="mode-label-1"
                                                      className={`font-semibold ${!isPitchMode ? 'text-teal-700' : 'text-stone-500'}`}>子音符追加モード</span>
                                                <label htmlFor="mode-toggle"
                                                       className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        id="mode-toggle"
                                                        className="sr-only peer"
                                                        checked={isPitchMode}
                                                        onChange={() => setIsPitchMode(!isPitchMode)}
                                                    />
                                                    <div
                                                        className="w-10 h-6 right-1 bg-stone-300 rounded-full peer peer-checked:bg-teal-600 transition-colors"></div>
                                                    <div
                                                        className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
                                                </label>
                                                <span id="mode-label-2"
                                                      className={`font-semibold ${isPitchMode ? 'text-teal-700' : 'text-stone-500'}`}>ルート音ピッチモード</span>
                                            </div>
                                            <div id="mode-description"
                                                 className="w-full bg-stone-100 p-4 rounded-lg text-center"
                                                 dangerouslySetInnerHTML={{__html: tabContent.tab2.modeDescription}}/>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'tab3' && (
                                    <div id="tab3" className="tab-panel">
                                        <h3 className="font-bold text-xl mb-4 text-teal-800">{tabContent.tab3.heading}</h3>
                                        <p className="text-stone-600 mb-4"
                                           dangerouslySetInnerHTML={{__html: tabContent.tab3.description}}/>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {tabContent.tab3.modes.map((mode, index) => (
                                                <div key={index} className="bg-stone-100 p-4 rounded-lg">
                                                    <h4 className="font-semibold text-lg mb-2">{mode.title}</h4>
                                                    <p className="text-sm text-stone-600"
                                                       dangerouslySetInnerHTML={{__html: mode.explanation}}/>
                                                    <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                                                        {mode.actions.map((action, actionIndex) => (
                                                            <li key={actionIndex}
                                                                dangerouslySetInnerHTML={{__html: action}}/>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </LiquidGlassCard>
            </main>

            <footer className="text-center mt-16 border-t border-stone-200 pt-6 w-full max-w-5xl mx-auto">
                <p className="text-sm text-stone-500">操作方法はデスクトップ版のv1.3.0に基づくものです</p>
            </footer>
        </div>
    );
};

export default UsagePage;