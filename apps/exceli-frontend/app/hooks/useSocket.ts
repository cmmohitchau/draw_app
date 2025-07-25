"use client"
import { WS_URL } from "@repo/common/urls";
import { useEffect, useState } from "react";

export function useSocket(id : number) {

    const [loading , setLoading] = useState(true);
    const [socket , setSocket] = useState<WebSocket | null>(null);



    useEffect( () => {
        const token = localStorage.getItem("token");
        console.log("roomId in use socket : " , id);
        
        
        
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        
        ws.onopen = () => {
            setSocket(ws);
            
            const data = JSON.stringify({
                type : "join_room",
                RoomId :id
            });
            ws.send(data);
            setLoading(false);            
        }        
        return () => {
        ws.close();
    };
    } , []);

    return {loading , socket};
}