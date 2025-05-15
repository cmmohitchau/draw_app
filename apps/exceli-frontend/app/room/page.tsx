"use client"
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Room() {
    const [name , setName] = useState("");
    const router = useRouter();

    function handleRoom() {
        router.push(`/canva/${name}`)
    }
    return(
        <div className="h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="bg-slate-300 dark:bg-gray-900 w-80 rounded-2xl px-6 py-10">
                    <Input placeholder="Room name" className="pl-4" onChange={ (e) => setName(e.target.value)} />
                    <Button size="lg" className="bg-green-400 w-full cursor-pointer rounded-2xl mt-4 " children="Join Room" onClick={handleRoom} />
                </div>

            </div>
        </div>
    )
} 