import React, { useState, useEffect, useRef, MouseEvent } from 'react';

interface Props {
    children: React.ReactNode;
}

const Toolbar: React.FC<Props> = ({children}:Props) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 500, y: 400 });
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const toolbarRef = useRef<HTMLDivElement>(null); // useRefにHTMLDivElement型を指定

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: globalThis.MouseEvent) => { // globalThis.MouseEventを使用
        if (!isDragging) return;
        setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset]);

    return (
        <div
            ref={toolbarRef}
            style={{
                top: position.y,
                left: position.x,
            }}
            className={`fixed bg-gray-800 text-white p-4 border border-white rounded-md shadow-lg z-50 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
        >
            <h3 className="text-lg font-semibold mb-4">ツールバー</h3>
            {children}
        </div>
    );
};

export default Toolbar;