import React from "react";

interface Props{
    children?: React.ReactNode | React.ReactNode[]
}

export default function LiquidGlassButton({children}:Props) {
    return(
        <button
            className={"p-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-300 border border-white/30"}
        >
            {children}
        </button>
    );
}