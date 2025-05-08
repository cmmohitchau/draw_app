import { WS_URL } from "@repo/common/urls";
import axios from "axios";
import { useEffect, useState } from "react";

export function useSocket() {

    const [loading , setLoading] = useState(true);
    const [socket , setSocket] = useState<WebSocket | null>(null);


    useEffect( () => {
        const token = localStorage.getItem("token");
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
            setSocket(ws);
            setLoading(false);
        }
    } , []);

    return {loading , socket};
}