"use client"

import Link from "next/link";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import HoverCard from "@/components/HoverCard";

export default function Page(){
    return(
        <div className={"min-h-screen overflow-x-hidden"}>
            <div className={"container mx-auto px-4"}>
                <header className={"w-full p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between"}>
                    <Link href={"/"} className={"text-xl md:text-3xl font-bold"}>ValinomCluinata</Link>
                    <div className={"w-full justify-end flex space-x-2 md:space-x-3"}>
                        <a download target="_blank" rel="noopener noreferrer" href={"//valinomcluinata.murasakiyamaimo.net/wp-content/uploads/2025/05/ValinomCluinata.zip"} className={"text-sm md:text-base font-bold"}>ダウンロード</a>
                        <Link href={"/editor"} className={"text-sm md:text-base font-bold"}>ブラウザ版</Link>
                        <HoverCard><a className={"text-sm md:text-base font-bold"}>Takutompisa</a></HoverCard>
                    </div>
                </header>
                <main
                    className={"w-full p-6 grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-5 gap-4 md:gap-6"}>

                    {/*ダウンロード*/}
                    <LiquidGlassCard
                        backgroundImage={"/images/ValinomCluinata.png"}
                        className={"h-96 col-span-1 md:col-span-4 row-span-1 md:row-span-3"}
                    >
                        <div className={"pt-12 md:pt-24 text-white text-sm md:text-base"}>Thanks to LAMPLIGHT</div>
                        <Link
                            href={"http://valinomcluinata.murasakiyamaimo.net/wp-content/uploads/2025/05/ValinomCluinata.zip"}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <LiquidGlassButton>ダウンロード</LiquidGlassButton>
                        </Link>
                    </LiquidGlassCard>

                    {/*使い方*/}
                    <LiquidGlassCard
                        backgroundImage={"/images/HowToUse.png"}
                        className={"col-span-1 md:col-span-3 row-span-1 md:row-span-2"}
                    >
                        <div><h3 className="text-white text-lg font-semibold mb-2">How to use</h3></div>
                        <Link href={"/HowToUse"}>
                            <LiquidGlassButton>使い方を見る</LiquidGlassButton>
                        </Link>
                    </LiquidGlassCard>

                    {/*About*/}
                    <Link
                        href={"https://lamplight0.sakura.ne.jp/a/"}
                        target={"_blank"}
                        className={"col-span-1 md:col-span-1 row-span-1 md:row-span-2 min-h-32 md:min-h-auto bg-gradient-to-br from-amber-200 to-amber-400 rounded-2xl md:rounded-3xl shadow-md hover:shadow-2xl transition-shadow"}
                    >
                        <div className={"h-full p-4 md:p-6 text-white flex flex-col justify-center items-center"}>
                            <div className={"text-lg md:text-3xl"}>About</div>
                            <div className={"text-lg md:text-3xl"}>LAMPLIGHT</div>
                        </div>
                    </Link>
                </main>
                <footer
                    className={"w-full p-4 md:p-6 flex flex-col md:flex-row min-h-16 md:min-h-24 mt-6 md:mt-10 justify-between items-center space-y-2 md:space-y-0"}>
                    <div className={"text-lg md:text-xl font-bold"}>ValinomCluinata</div>
                    <div className={"text-sm md:text-md text-center md:text-right"}>Copyright 2025 murasakiyamaimo</div>
                </footer>
            </div>
        </div>
    );
}