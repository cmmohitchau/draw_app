
import ServerComponent from "@/components/serverComponent";
import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";

async function getRoomId(slug : string) {
    
    const res = await axios.get(`${BACKEND_URL}/roomId/${slug}`);
        
    return res.data.id;
    
}


export default async function Canvas({
    params
} : {
    params : {
        slug : string
    }
}) {
    const slug = (await params).slug;
    const roomId = await getRoomId(slug);
    
        
    return <ServerComponent id={roomId} />

}