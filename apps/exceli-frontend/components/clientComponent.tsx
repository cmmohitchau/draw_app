import { useSocket } from "@/app/hooks/useSocket";
import { useState } from "react";

export default function ClientComponent({id} : {id : number}) {

    const {loading , socket} = useSocket(id);

    if(loading) {
        return <div>
            Loading..........
        </div>
    }

    return(
        <div>
            <canvas width="120" height="120">

            </canvas>
        </div>
    )
}