import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";

export async function getExistingShapes(roomId: number) {
    const res = await axios.get(`${BACKEND_URL}/shape/${roomId}`); 
    const messages = res.data.message;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}