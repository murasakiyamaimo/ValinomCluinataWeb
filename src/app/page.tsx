import Link from "next/link";
import Image from "next/image";

export default function Page(){
    return(
        <div className={"w-screen min-h-screen"}>
            <div className={"container mx-auto"}>
                <header className={"w-full p-6 flex items-center justify-between"}>
                    <Link href={"/"} className={"text-3xl font-bold"}>ValinomCluinata</Link>
                    <div className={"flex space-x-3"}>
                        <Link href={"/"} className={"font-bold"}>ダウンロード</Link>
                        <Link href={"/editor"} className={"font-bold"}>ブラウザ版</Link>
                    </div>
                </header>
                <main  className={"w-full p-6 grid grid-cols-4 grid-rows-3 gap-6"}>
                    <div className={"relative min-h-96 col-span-4 row-span-2 bg-gray-500 rounded-3xl shadow-md hover:shadow-2xl transition-shadow"}>
                        <Image src={"/images/ValinomCluinata.png"} alt={"background"} className={"rounded-3xl"} objectFit={"cover"} fill></Image>
                    </div>
                    <div className={"col-span-3 row-span-1 bg-pink-200 rounded-3xl shadow-md hover:shadow-2xl transition-shadow"}></div>
                    <div className={"col-span-1 row-span-1 bg-pink-400 rounded-3xl shadow-md hover:shadow-2xl transition-shadow"}></div>
                </main>
                <footer className={"w-full p-6 flex min-h-24 mt-10 justify-between"}>
                    <div className={"text-xl font-bold"}>ValinomCluinata</div>
                    <div className={"text-md"}>Copyright 2025 murasakiyamaimo</div>
                </footer>
            </div>
        </div>
    );
}