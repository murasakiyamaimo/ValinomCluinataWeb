import Image from "next/image";
import Link from "next/link";

export default function HowToUse() {
    return (
        <div
            className="relative col-span-1 md:col-span-3 row-span-1 md:row-span-2 rounded-2xl md:rounded-3xl shadow-md hover:shadow-2xl transition-shadow">
            <Image src={"/images/HowToUse.png"} alt={"HowToUse image"}
                   className={"absolute rounded-2xl md:rounded-3xl"} style={{backgroundPosition: "center"}}
                   objectFit={"cover"} fill></Image>
            <div
                className="w-full bg-black/20 hover:backdrop-blur-sm border border-white/50 rounded-2xl md:rounded-3xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-6 text-white relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
                <div className="h-52 relative z-10">
                    <div className="h-full flex flex-col space-y-6 transition-all duration-500 justify-center items-center text-center">
                        <div><h3 className="text-lg font-semibold mb-2">How to use</h3></div>
                        <button
                            className="p-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-300 border border-white/30">
                            使い方を見る
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}