"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Room() {
    const [name , setName] = useState("");
    const router = useRouter();

    function handleRoom() {
        console.log("in room page before pushing to /canva/room-name");
        
        router.push(`/canva/${name}`)
    }
    return(
      <div className="min-h-screen p-2 flex justify-center">
        <div className="flex flex-col justify-center">

          <Card size="sm">
            <Input 
            placeholder="Room name" 
            className="px-4 py-3 rounded-md" 
            onchange={ (e) => setName(e.target.value)} />

            <Button
            size="sm"
              className="bg-green-400 w-full cursor-pointer rounded-2xl mt-4 "
               children="Join Room"
                onclick={handleRoom} />
            <Link href="/create-room" className="underline text-center text-blue-500">create-room</Link>

        </Card>
        </div>

      </div>
    )
} 