import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";

export async function getExistingShapes(roomId: number) {
    console.log("in getExistingShapes " , roomId);
    
    const res = await axios.get(`${BACKEND_URL}/shape/${roomId}`); 
    
    const shapes = res.data.allshapes;

    return shapes;
}