"use client"
import { MenuIcon, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Header({ setShowSideBar }) {

    const { data: session } = useSession();

    return (
        <header className="sticky h-15 top-0 bg-white border-b border-gray-300 px-10 py-3 flex justify-between items-center">

            <h2 onClick={() => setShowSideBar(true)} className="text-lg cursor-pointer"><MenuIcon/></h2>

            <div className="flex items-center gap-3 text-gray-700">
                <div className="text-right">
                    <h1 className="text-sm">{session?.user.name}</h1>
                </div>
                {
                    session?.user.profileImage
                        ? <div className="w-8 h-8 text-gray-500 rounded-full flex items-center justify-center text-xs">
                            <Image className="rounded-full border border border-gray-500" src={session.user.profileImage} alt="profil-image" width={900} height={900}/>
                        </div>
                        : <div className="w-8 h-8 border border border-gray-500 text-gray-500 rounded-full flex items-center justify-center text-xs">
                            <User className="w-5 h-5" />
                        </div>
                }

            </div>

        </header>
    )
}