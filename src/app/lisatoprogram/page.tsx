'use client'

import React, {useMemo, useState} from 'react';
import IDE, {PanelItem} from "@/components/IDE";
import compile from "../../utils/compile";
import { v4 as uuidv4 } from "uuid";

interface FileItem {
    id: string,
    name: string,
    type: 'file' | 'folder',
    content?: string,
}

const idePanels = (
    selectedFileContent: string,
    onFileContentChange: (content: string) => void,
    onExecuteCode: () => void, // 新しい引数: 実行ボタンクリックハンドラ
    compilerLog: string, // 新しい引数: コンパイラからのログ/エラー
    executionResult: string // 新しい引数: 実行結果
): PanelItem[] => [
    {
        id: 'explorer-panel',
        title: 'エクスプローラー',
        component: (props: { onNewFileClick: () => void; files: FileItem[]; onFileClick: (file: FileItem) => void }) => (
            <div className="flex flex-col space-y-2">
                <button onClick={props.onNewFileClick} className="self-start p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <div>+ ファイル作成</div>
                </button>
                {props.files.map((file) => (
                    <p key={file.id} onClick={() => file.type === 'file' && props.onFileClick(file)}>
                        {file.type === 'file' ? '📄' : '📁'} {file.name}
                    </p>
                ))}
            </div>
        ),
        initialSize: 'w-64', // Tailwind CSSの幅クラス
        fixedPosition: 'left', // レイアウト上の固定位置
    },
    {
        id: 'code-editor',
        title: 'メインエディタ',
        component: (
            <textarea
                className="w-full h-full p-2 bg-gray-900 text-white resize-none outline-none pointer-events-auto"
                value={selectedFileContent}
                onChange={(e) => onFileContentChange(e.target.value)}
            />
        ),
        initialSize: 'flex-grow', // 残りのスペースを埋める
        fixedPosition: 'right-top', // 右上部
    },
    {
        id: 'terminal-panel',
        title: 'ターミナル',
        component: (
            <div>
                <button
                    onClick={onExecuteCode}
                    className="p-1 bg-green-600 text-white rounded hover:bg-green-700 mb-2"
                >
                    実行
                </button>
                {compilerLog && (
                    <div className="bg-gray-900 text-red-400 p-2 overflow-auto text-sm">
                        <pre>{compilerLog}</pre>
                    </div>
                )}

            </div>
        ),
        initialSize: 'h-48', // Tailwind CSSの高さクラス
        fixedPosition: 'right-bottom', // 右下部
    },
    {
        id: 'output-panel',
        title: '出力',
        component: (
            <div>
                {executionResult && (
                    <pre>{executionResult}</pre>
                )}
            </div>
        ),
        initialSize: 'h-32',
        fixedPosition: 'right-bottom', // ターミナルと同じエリアで並べ替え可能に
    },
];

const Lisatoprogram: React.FC = () => {
    const [showNewFileModal, setShowNewFileModal] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [files, setFiles] = useState<FileItem[]>([
        { id: uuidv4(), name: 'test.lis', type: 'file', content: 'janase "Hello World";' },
    ]);
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    const [selectedFileID, setSelectedFileID] = useState<string | null>('');
    const [compilerLog, setCompilerLog] = useState<string>(''); // コンパイラログ（エラー含む）
    const [executionResult, setExecutionResult] = useState<string>(''); // 実行結果

    React.useEffect(() => {
        if (files.length > 0 && selectedFileID === null) {
            const firstFile = files.find(file => file.type === 'file');
            if (firstFile) {
                setSelectedFileContent(firstFile.content || '');
                setSelectedFileID(firstFile.id);
            }
        }
    }, [files, selectedFileID]);

    const handleCreateFile = () => {
        const newFile: FileItem = {
            id: uuidv4(),
            name: newFileName,
            type: 'file', // デフォルトでファイルとして作成
            content: '',
        };
        setFiles(prevFiles => [...prevFiles, newFile]);
        setShowNewFileModal(false); // モーダルを閉じる
        setNewFileName(''); // 入力フィールドをクリア
    };

    const handleFileSelect = (file: FileItem) => {
        setSelectedFileContent(file.content || '');
        setSelectedFileID(file.id);
    };

    const handleFileContentChange = (content: string) => {
        setSelectedFileContent(content);
        // 選択中のファイルのcontentを更新
        setFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === selectedFileID ? { ...file, content: content } : file
            )
        );
    };

    const handleExecuteCode = async () => {
        setCompilerLog('コンパイル中...');
        setExecutionResult(''); // 以前の結果をクリア
        const result = await compile(selectedFileContent);

        if (result.success) {
            setCompilerLog('コンパイル成功！');
            setExecutionResult(result.executionResult || '実行結果なし');
        } else {
            setCompilerLog(result.log || result.error || '不明なコンパイルエラー');
            setExecutionResult('実行エラーが発生しました。');
        }
    };

    // IDEに渡すパネル設定をuseMemoでメモ化
    const panels = useMemo(() => idePanels(selectedFileContent, handleFileContentChange, handleExecuteCode, compilerLog, executionResult),
        [selectedFileContent, handleFileContentChange, handleExecuteCode, compilerLog, executionResult]
    );


    return (
        <>
            <IDE initialPanels={panels} panelProps={{
                'explorer-panel': {
                    onNewFileClick: () => setShowNewFileModal(true),
                    files: files,
                    onFileClick: handleFileSelect,
                },
                'terminal-panel': { // ターミナルパネルにonExecuteCodeを渡す
                    onExecuteCode: handleExecuteCode,
                    compilerLog: compilerLog,
                },
                'output-panel': { // 出力パネルにexecutionResultを渡す
                    executionResult: executionResult,
                }
            }}/>

            {showNewFileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">新しいファイルを作成</h2>
                        <input
                            type="text"
                            placeholder="ファイル名を入力"
                            className="border p-2 w-full mb-4"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowNewFileModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleCreateFile}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                作成
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>


    )
}

export default Lisatoprogram;