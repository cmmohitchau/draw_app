// useSocket.ts
"use client";

import { Shape } from "@/components/clientComponent";
import { WS_URL } from "@repo/common/urls";
import { useEffect, useState } from "react";

export function useSocket(id: number) {
  console.log("starting of useSocket");
  

  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
    console.log("starting of socket var " , socket);


  useEffect(() => {

    const token = localStorage.getItem("token");
    const ws = new WebSocket(`${WS_URL}/?token=${token}`);
    console.log("after calling to ws server " , ws);
    

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, []);

   

  return { loading, socket };
}
