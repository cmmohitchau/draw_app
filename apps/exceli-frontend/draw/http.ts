import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";
import { Axis3D } from "lucide-react";

export async function getExistingShapes(roomId: number) {
    
    const res = await axios.get(`${BACKEND_URL}/shape/${roomId}`); 
    
    const shapes = res.data.allshapes;

    return shapes;
}

export async function getExistingTexts(roomId : number) {
    const res = await axios.get(`${BACKEND_URL}/chat/${roomId}`);

    const message = res.data.messages; //[{x , y , color , font , fontSize } , {x , y , color , font , fontSize }];
    console.log("existing chats " , message);
    

    return message;

}