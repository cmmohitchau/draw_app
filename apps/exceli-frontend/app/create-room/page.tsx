"use client"
import { Input } from "@repo/ui/input";
import { Card } from "../room/page";
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
       router.push(`/roomPage/${roomId}`);
    }
    return(
        <Card>
            <Input 
            placeholder="Room name" 
            className="pl-4" 
            onChange={ (e) => setSlug(e.target.value)
            } />

            <Button 
            size="lg" 
            className="bg-green-400 
            w-full 
            cursor-pointer 
            rounded-2xl mt-4 " 
            children="Create Room" 
            onClick={handleRoom} />
                
            <Link href="/room">join-room</Link>
        </Card>
    )
}