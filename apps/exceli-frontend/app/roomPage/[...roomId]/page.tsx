import ClientComponent from "@/components/clientComponent";


export default async function RoomPage( { params } : { params : { roomId : string} }) {
    const id = (await params).roomId;
    const roomId = Number(id);    
    console.log("roomId in room page , " , roomId);
    

    return <ClientComponent id={roomId} />
}