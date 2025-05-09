import { useSocket } from "@/app/hooks/useSocket";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useState } from "react";

export default function ClientComponent({id} : {id : number}) {
    const [message , setMessage] = useState("");
    const {loading , socket} = useSocket();

    if(loading) {
        return <div>
            Loading..........
        </div>
    }

    return(
        <div>
            <canvas width="120" height="120">
                An alternative text describing what your canvas displays.
            </canvas>
        </div>
    )
}