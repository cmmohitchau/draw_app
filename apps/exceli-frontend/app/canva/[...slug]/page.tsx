
import ServerComponent from "@/components/serverComponent";
import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";

async function getRoomId(slug : string) {
    const roomId = await axios.get(`${BACKEND_URL}/roomId/${slug}`);
    return roomId;
    
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

    return <ServerComponent id={Number(roomId)} />

}