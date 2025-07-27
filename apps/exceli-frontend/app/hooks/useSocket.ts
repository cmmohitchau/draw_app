// useSocket.ts
"use client";

import { Shape } from "@/components/clientComponent";
import { WS_URL } from "@repo/common/urls";
import { useEffect, useState } from "react";

const socketCache: { [roomId: number]: WebSocket } = {};

export function useSocket(id: number) {
  console.log("starting of useSocket");

  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (socketCache[id]) {
      console.log("Using cached socket for room", id);
      setSocket(socketCache[id]);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    socketCache[id] = ws;

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          RoomId: id,
        })
      );
      setLoading(false);
      console.log("after setting socket in useSocket");
    };

    ws.onclose = () => {
      console.log("WebSocket closed for room", id);
      delete socketCache[id]; // Clear cache on close
    };

    return () => {
      ws.close();
    };
  }, [id]);

   

  return { loading, socket };
}
