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
const roomMap: Map <string, Set<User>> = new Map();

function sendData(roomUsers : any , type : string, shape :  any, roomId : number) {
    if (roomUsers) {
        for (const u of roomUsers) {
            console.log("sending shape to the every userfrom ws  " , JSON.stringify({
                type,
                shape,
                roomId,
            }));
            
            u.ws.send(JSON.stringify({
                type,
                shape,
                roomId,
            }));
        }
    }
    
}

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token as string, JWT_SECRET as string) as {userId : string};

        if (!decoded || !decoded.userId) return null;
        return decoded.userId;
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
    console.log("token from params " , token);
    
    const userId = checkUser(token);
    console.log("after userId " , userId);
    

    if (!userId) {
        ws.close();
        return;
    }
    console.log("after passing the check");
    

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
            console.log("parsed data in ws server " , parsedData);
            

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
                    console.log("joined in roomId in ws server " , roomId);
                    

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
                    

                    if (!roomId || !shape || !shape || !shape.type) {
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
                    sendData(roomUsers , type , shape , roomId);

                    break;
                }

                case "chat": {
                    const { shape , roomId } = parsedData;
                    console.log("shape in type chat " , shape);
                    
                    if (!roomId || !shape ) {
                        ws.send(JSON.stringify({ error: "Invalid shape payload" }));
                        return;
                    }

                    await prismaClient.chat.create({
                        data : {
                            RoomId : roomId,
                            userId: user.userId,
                            x: shape.x,
                            y: shape.y,
                            fontSize: "M",
                            content : shape.content,
                            font: shape.font,
                            color: shape.color,
                        }
                    })
                    const roomUsers = roomMap.get(roomId);
                    console.log("after checking shape sent in ws " , shape );
                    
                    sendData(roomUsers , type , shape , roomId);
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
