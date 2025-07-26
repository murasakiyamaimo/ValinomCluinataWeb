'use client'

import React, {useMemo, useState} from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable,} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface PanelItem {
    id: string;
    title: string;
    component?: React.ReactNode | ((props: any) => React.ReactNode);
    initialSize?: String;
    fixedPosition?: 'left' | 'right-top' | 'right-bottom';
}

interface SortablePanelProps {
    panel: PanelItem;
    isVisible: boolean;
    canDrag: boolean;
    panelProps?: Record<string, any>;
}

function SortablePanel({ panel, canDrag, isVisible, panelProps }: SortablePanelProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: panel.id, disabled: !canDrag });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 0, // ドラッグ中は前面に
        opacity: isDragging ? 0.8 : 1,
        display: isVisible ? 'flex' : 'none', // 表示/非表示の切り替え
    };

    if (!isVisible) return null; // 非表示の場合はレンダリングしない

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(canDrag ? listeners : {})} // canDragがtrueの場合のみlistenersを適用
            className={`
        relative border border-gray-600 m-1 flex flex-col overflow-hidden
        ${panel.initialSize || 'flex-grow'}
        ${panel.fixedPosition === 'left' ? 'bg-gray-900' : panel.fixedPosition === 'right-top' ? 'bg-gray-700' : 'bg-gray-800'}
        text-white
      `}
        >
            <div className="p-2 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
                <h3 className="text-sm font-semibold">{panel.title}</h3>
                {/* 将来的に、ここにドラッグハンドルアイコンなどを追加可能 */}
            </div>
            <div className="flex-grow overflow-auto p-4">
                {typeof panel.component === 'function'
                    ? React.createElement(panel.component, panelProps) // panelProps を渡す
                    : panel.component
                }
            </div>
        </div>
    );
}

interface IDEProps {
    initialPanels: PanelItem[];
    panelProps?: { [key: string]: Record<string, any> };
}

const IDE: React.FC<IDEProps> = ({ initialPanels, panelProps = {} }) => {
    // パネルの表示状態を管理 (全てのパネルを対象)
    const [panelVisibility, setPanelVisibility] = useState<{ [key: string]: boolean }>(() => {
        const visibility: { [key: string]: boolean } = {};
        initialPanels.forEach(panel => {
            visibility[panel.id] = true; // デフォルトですべて表示
        });
        return visibility;
    });

    // 右側の並べ替え可能なパネルの順序を管理
    const [rightSortablePanelOrder, setRightSortablePanelOrder] = useState<string[]>(() =>
        initialPanels
            .filter(p => p.fixedPosition === 'right-top' || p.fixedPosition === 'right-bottom')
            .map(p => p.id)
    );

    // 左側の固定パネル (今回はエクスプローラー)
    const leftPanel = useMemo(() => initialPanels.find(p => p.fixedPosition === 'left'), [initialPanels]);

    // 右側のソート可能なパネルのデータを現在の順序で取得
    const rightSortablePanels = useMemo(() => {
        const panelsMap = new Map(initialPanels.map(p => [p.id, p]));
        return rightSortablePanelOrder.map(id => panelsMap.get(id)!);
    }, [initialPanels, rightSortablePanelOrder]);

    const sensors = useSensors(useSensor(PointerSensor));

    // 表示/非表示を切り替える関数
    const togglePanelVisibility = (panelId: string) => {
        setPanelVisibility(prev => ({
            ...prev,
            [panelId]: !prev[panelId],
        }));
    };

    // ドラッグ終了時の処理 (右側パネルの並べ替え)
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setRightSortablePanelOrder((items) => {
                const oldIndex = items.findIndex(item => item === active.id);
                const newIndex = items.findIndex(item => item === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <div className="flex h-screen bg-gray-800 text-white">
            {/* 左サイドバー */}
            {leftPanel && (
                <SortablePanel
                    key={leftPanel.id}
                    panel={leftPanel}
                    isVisible={panelVisibility[leftPanel.id]}
                    canDrag={false} // 左サイドバーはドラッグ不可（固定）
                    panelProps={panelProps[leftPanel.id]}
                />
            )}

            {/* 右側のメインコンテンツエリア */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col flex-grow">
                    <SortableContext items={rightSortablePanelOrder} strategy={verticalListSortingStrategy}>
                        {rightSortablePanels.map((panel) => (
                            <SortablePanel
                                key={panel.id}
                                panel={panel}
                                isVisible={panelVisibility[panel.id]}
                                canDrag={false} // 右側のパネルはドラッグ可能
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
};

export default IDE;