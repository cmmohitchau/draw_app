import {WebSocketServer , WebSocket} from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";

const wss = new WebSocketServer({ port : 8081 });

interface User {
    rooms : string[],
    ws : WebSocket,
    userId : string
}
const users : User[] = [];

function checkUser(token : string) : string | null  {
    const decoded = jwt.verify(token,  JWT_SECRET);

    if(typeof decoded == "string") {
        return null;
    }
    if(!decoded || !(decoded as JwtPayload).userId) {
        return null;
    }

    return decoded.userId;
}

wss.on('connection' , (ws , request) => {
    console.log("client connected");
    
    const url = request.url;

    if(!url) {
        ws.close();
        return;
    }

    const queyparams = new URLSearchParams(url.split('?')[1]);
    const token = queyparams.get('token') || "";
    console.log("token : " , token);
    
    const userId = checkUser(token);
    
    if(userId == null) {
        ws.close();
        return null;
    }

    users.push({
        userId,
        ws,
        rooms : []
    })
    
    ws.on('message' , (data) => {
        const parsedData = JSON.parse(data as unknown as string);
        // {type : "join_room" , roomId : 1}
        const user = users.find(x => x.ws == ws);
        try {
            console.log(parsedData.type);
            
            if(parsedData.type == "join_room") {
                const user = users.find(x => x.ws == ws);
                //Todo :- check access control
                user?.rooms.push(parsedData.roomId);
            } else if(parsedData.type == "leave_room") {
                const user = users.find(x => x.ws == ws);
                if(!user) return;
                user.rooms = user?.rooms.filter(x => x != parsedData.roomId);
            } else if(parsedData.type == "chat") {
                const user = users.find(x => x.ws == ws);
                const message = parsedData.message;
                const roomId = parsedData.roomId;

                users.forEach(user => {
                    if( user.rooms.includes(roomId) ) {
                        user.ws.send(JSON.stringify({
                            type : "chat",
                            message,
                            roomId
                        }));
                    }
                })
            }

        } catch(e) {
            console.log("Error : " ,e);
            
        }
    })
})