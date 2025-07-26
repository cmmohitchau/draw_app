import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8081 });

interface User {
    rooms: Set<string>;
    ws: WebSocket;
    userId: string;
}

const users: User[] = [];
const roomMap: Map<string, Set<User>> = new Map();

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string") return null;
        if (!decoded || !(decoded as JwtPayload).userId) return null;
        return (decoded as JwtPayload).userId;
    } catch (e) {
        console.error("JWT verification failed:", e);
        return null;
    }
}

wss.on("connection", (ws, request) => {
    console.log("Client connected");

    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if (!userId) {
        ws.close();
        return;
    }

    const user: User = {
        userId,
        ws,
        rooms: new Set(),
    };

    users.push(user);

    ws.on("message", async (data) => {
        try {
            const parsedData = JSON.parse(data.toString());
            const { type } = parsedData;

            if (!type) {
                ws.send(JSON.stringify({ error: "Missing type field" }));
                return;
            }

            switch (type) {
                case "join_room": {
                    const { roomId } = parsedData;
                    if (!roomId) {
                        ws.send(JSON.stringify({ error: "Missing roomId" }));
                        return;
                    }

                    user.rooms.add(roomId);

                    if (!roomMap.has(roomId)) {
                        roomMap.set(roomId, new Set());
                    }

                    roomMap.get(roomId)!.add(user);
                    break;
                }

                case "leave_room": {
                    const { roomId } = parsedData;
                    if (!roomId) {
                        ws.send(JSON.stringify({ error: "Missing roomId" }));
                        return;
                    }

                    user.rooms.delete(roomId);
                    const roomUsers = roomMap.get(roomId);
                    if (roomUsers) {
                        roomUsers.delete(user);
                        if (roomUsers.size === 0) {
                            roomMap.delete(roomId);
                        }
                    }
                    break;
                }

                case "shape": {
                    const { roomId, shape } = parsedData;

                    if (!roomId || !shape || !shape.type) {
                        ws.send(JSON.stringify({ error: "Invalid shape payload" }));
                        return;
                    }

                    await prismaClient.shape.create({
                        data: {
                            RoomId : roomId,
                            userId: user.userId,
                            type: shape.type,
                            x: shape.x,
                            y: shape.y,
                            width: shape.width,
                            height: shape.height,
                            color: shape.color,
                            pencilPoints: shape.pencilPoints,
                        },
                    });

                    const roomUsers = roomMap.get(roomId);
                    if (roomUsers) {
                        for (const u of roomUsers) {
                            u.ws.send(JSON.stringify({
                                type: "shape",
                                shape,
                                roomId,
                            }));
                        }
                    }

                    break;
                }

                case "chat": {
                    // Placeholder
                    break;
                }

                default:
                    ws.send(JSON.stringify({ error: "Unknown message type" }));
                    break;
            }
        } catch (e) {
            console.error("Error handling message:", e);
            ws.send(JSON.stringify({ error: "Internal server error" }));
        }
    });

    ws.on("close", () => {
        console.log(`User ${user.userId} disconnected`);
        // Remove user from users list
        const index = users.findIndex((u) => u.ws === ws);
        if (index !== -1) {
            users.splice(index, 1);
        }

        // Remove user from all rooms
        for (const roomId of user.rooms) {
            const roomUsers = roomMap.get(roomId);
            if (roomUsers) {
                roomUsers.delete(user);
                if (roomUsers.size === 0) {
                    roomMap.delete(roomId);
                }
            }
        }
    });
});
