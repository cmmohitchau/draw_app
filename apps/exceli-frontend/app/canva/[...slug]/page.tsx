
import ClientComponent from "@/components/clientComponent";
import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";

async function getRoomId(slug : string) {
    
const url = new URL(`/roomId/${slug}`, BACKEND_URL);
const res = await axios.get(url.toString());
    console.log("in canva room " , res.data);
         
    return res.data.roomId;
}


export default async function Canvas({
    params
} : {
    params : {
        slug : string[];
    }
}) {
    const slugArray = await(params);
  const slug = slugArray.slug[0];
    console.log("slug in canva room " , slug);
    
    const roomId = await getRoomId(slug);
    
    console.log("in canva room after getting roomId " , roomId);
    
    return <ClientComponent id={roomId} />

}