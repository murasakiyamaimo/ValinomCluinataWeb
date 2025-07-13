import Image from "next/image";
import React from "react";

interface Props{
    backgroundImage?: string,
    className?: string,
    children?: React.ReactNode | React.ReactNode[]
}

export default function LiquidGlassCard({backgroundImage,className,children}:Props) {
    return(
        <div
            className={`relative rounded-2xl md:rounded-3xl shadow-md hover:shadow-2xl transition-shadow duration-400 ${className}`}>
            {backgroundImage && <Image
                src={backgroundImage}
                alt={"Background image"}
                className={"absolute rounded-3xl"}
                style={{backgroundPosition: "center"}}
                objectFit={"cover"}
                fill
            />}
            <div className="h-full bg-black/20 hover:backdrop-blur-sm border duration-400 border-white/50 rounded-2xl md:rounded-3xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-6 relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
                <div className="h-full z-10 flex flex-col justify-center items-center transition-all duration-500">
                    {children}
                </div>
            </div>
        </div>
    )
}