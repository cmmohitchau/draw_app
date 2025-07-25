import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`); // ["{type : "chat" , roomId : 1 ,  shape : {x  , y , height , width , } } ,{type : "chat" , roomId : 2 ,  shape : }" ]
    const messages = res.data.message;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}