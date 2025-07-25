"use client"
import { Input } from "@repo/ui/input";
import {Card} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getRoomIdServer } from "../create-room-server";

export default function CreateRoom() {
    const [slug , setSlug] = useState("");
    const router = useRouter();
   async function handleRoom() {
       const roomId = await getRoomIdServer(slug);
       console.log("roomId  " , roomId);
       
       router.push(`/roomPage/${roomId}`);
    }
    return(
    <div className="min-h-screen p-2 flex justify-center">
        <div className="flex flex-col justify-center">
            <Card>
                <Input 
                placeholder="Room name" 
                className="px-4 py-3 rounded-md" 
                onchange={ (e) => setSlug(e.target.value)
                } />

                <Button 
                className="bg-green-400 
                w-full 
                cursor-pointer 
                rounded-2xl mt-4 " 
                children="Create Room" 
                onclick={handleRoom} />
                    
                <Link href="/room" className="underline text-blue-500">join-room</Link>
            </Card>
        </div>
    </div>
    )
}