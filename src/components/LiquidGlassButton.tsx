import React from "react";

interface Props{
    children?: React.ReactNode | React.ReactNode[]
    className?: string
    onClick?: () => void;
}

export default function LiquidGlassButton({children, className, onClick}:Props) {
    return(
        <button
            onClick={onClick}
            className={"p-3 px-2 py-2 w-full bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-300 border border-white/30" + {className}}
        >
            {children}
        </button>
    );
}