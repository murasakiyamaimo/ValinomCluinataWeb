import Link from "next/link";
import Image from "next/image";

export default function Page(){
    return(
        <div className={"min-h-screen overflow-x-hidden"}>
            <div className={"container mx-auto px-4"}>
                <header className={"w-full p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between"}>
                    <Link href={"/"} className={"text-xl md:text-3xl font-bold"}>ValinomCluinata</Link>
                    <div className={"w-full justify-end flex space-x-2 md:space-x-3"}>
                        <a download target="_blank" rel="noopener noreferrer" href={"//valinomcluinata.murasakiyamaimo.net/wp-content/uploads/2025/05/ValinomCluinata.zip"} className={"text-sm md:text-base font-bold"}>ダウンロード</a>
                        <Link href={"/editor"} className={"text-sm md:text-base font-bold"}>ブラウザ版</Link>
                    </div>
                </header>
                <main className={"w-full p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-5 gap-4 md:gap-6"}>

                    {/*ダウンロード*/}
                    <div className={"relative min-h-64 md:min-h-96 col-span-1 md:col-span-4 row-span-1 md:row-span-3 bg-gray-500 rounded-2xl md:rounded-3xl shadow-md hover:shadow-2xl transition-shadow"}>
                        <Image src={"/images/ValinomCluinata.png"} alt={"logo image"} className={"absolute rounded-2xl md:rounded-3xl"} objectFit={"cover"} fill></Image>
                        <div className={"absolute w-full h-full rounded-2xl md:rounded-3xl opacity-30 dark:opacity-40 bg-black"}></div>
                        <div className={"absolute w-full h-full rounded-2xl md:rounded-3xl flex flex-col hover:backdrop-blur-xs space-y-4 md:space-y-6 justify-center items-center transition-all duration-500"}>
                            <div className={"pt-12 md:pt-24 text-white text-sm md:text-base"}>Thanks to LAMPLIGHT</div>
                            <a download target="_blank" rel="noopener noreferrer" href={"//valinomcluinata.murasakiyamaimo.net/wp-content/uploads/2025/05/ValinomCluinata.zip"}>
                                <button className={"p-2 md:p-3 bg-white text-black rounded-lg text-sm md:text-base"}>ダウンロード</button>
                            </a>
                        </div>
                    </div>

                    {/*使い方*/}
                    <div className={"relative col-span-1 md:col-span-3 row-span-1 md:row-span-2 min-h-48 md:min-h-auto rounded-2xl md:rounded-3xl shadow-md hover:shadow-2xl transition-shadow"}>
                        <Image src={"/images/usage.png"} alt={"usage image"} className={"absolute rounded-2xl md:rounded-3xl"} style={{backgroundPosition:"center"}} objectFit={"cover"} fill></Image>
                        <div className={"absolute w-full h-full rounded-2xl md:rounded-3xl opacity-20 dark:opacity-40 bg-black"}></div>
                        <div className={"absolute w-full h-full rounded-2xl md:rounded-3xl flex flex-col hover:backdrop-blur-xs space-y-4 md:space-y-6 justify-center items-center transition-all duration-500"}>
                            <div className={"pt-2 md:pt-3 text-white text-sm md:text-base"}>Usage</div>
                            <Link href={"/usage"}>
                                <button className={"p-2 md:p-3 bg-white text-black rounded-lg text-sm md:text-base"}>使い方を見る</button>
                            </Link>
                        </div>
                    </div>

                    {/*About*/}
                    <Link href={"https://lamplight0.sakura.ne.jp/a/"} target={"_blank"} className={"col-span-1 md:col-span-1 row-span-1 md:row-span-2 min-h-32 md:min-h-auto bg-gradient-to-br from-amber-200 to-amber-400 rounded-2xl md:rounded-3xl shadow-md hover:shadow-2xl transition-shadow"}>
                        <div className={"h-full p-4 md:p-6 text-white flex flex-col justify-center items-center"}>
                            <div className={"text-lg md:text-3xl"}>About</div>
                            <div className={"text-lg md:text-3xl"}>LAMPLIGHT</div>
                        </div>
                    </Link>
                </main>
                <footer className={"w-full p-4 md:p-6 flex flex-col md:flex-row min-h-16 md:min-h-24 mt-6 md:mt-10 justify-between items-center space-y-2 md:space-y-0"}>
                    <div className={"text-lg md:text-xl font-bold"}>ValinomCluinata</div>
                    <div className={"text-sm md:text-md text-center md:text-right"}>Copyright 2025 murasakiyamaimo</div>
                </footer>
            </div>
        </div>
    );
}