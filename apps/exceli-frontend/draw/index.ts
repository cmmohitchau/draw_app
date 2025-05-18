import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";

type Shape = {
    type : "rect",
    x : number,
    y : number,
    height : number,
    width : number
} | {
    type : "circle",
    radius : number,
    centerX : number,
    centerY : number
}
export async function initDraw(canvas : HTMLCanvasElement , roomId : string , socket : WebSocket) {

    const ctx = canvas.getContext("2d");
    const existingShape : Shape [] = await getExistingShape(roomId);
    console.log("in initDraw fun and ctx is " , ctx);
    
    if(!ctx) return;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if(message.type === "chat") {
            const parsedData = JSON.parse(message.message);
            existingShape.push(parsedData);
            clearCanvas(existingShape , canvas , ctx);
        }
    }

    clearCanvas(existingShape , canvas , ctx);
    ctx.fillStyle = "rgba(0 , 0 , 0)";

    ctx.fillRect(0 , 0 , canvas.width , canvas.height);

    let startX = 0;
    let startY = 0;
    let clicked = false;

    canvas.addEventListener("mousedown" , (e) => {
        console.log("x : " , e.clientX , " y : " , e.clientY);
        startX = e.clientX;
        startY = e.clientY;    
        clicked = true;    
    })

    canvas.addEventListener("mouseup" , (e) => {
        console.log("x : " , e.clientX , " y : " , e.clientY);
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        const shape : Shape = {
            type : "rect",
            x : startX,
            y : startY,
            width,
            height
        }

        existingShape.push(shape);
        socket.send(JSON.stringify({
            type : "chat",
            message : JSON.stringify(shape)
        }));
    })

    canvas.addEventListener("mousemove" , (e) => {
        if(clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShape , canvas , ctx);
            ctx.strokeStyle = "rgba(255 , 255 , 255)";
            ctx.strokeRect(startX , startY , width , height);
        }
    })
    
}


function clearCanvas(existingShape : Shape [], canvas : HTMLCanvasElement , ctx : CanvasRenderingContext2D) {
    ctx.clearRect(0 , 0 , canvas.width , canvas.height);
    ctx.fillStyle = "rgba(0 , 0 , 0)";
    ctx.fillRect(0 , 0 , canvas.width , canvas.height);

    existingShape.map(shape => {
        if(shape.type === "rect") {
            ctx.strokeStyle = "rgba(255 , 255 , 255)";
            ctx.strokeRect(shape.x , shape.y , shape.width  , shape.height);
        }
    })

}

async function getExistingShape(roomId : string) {
    const res = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
    const messages = res.data.message;

    const shapes = messages.map((x : {message : string}) => {
        const messasgeData = JSON.parse(x.message);
        return messasgeData;
    })
    
    return shapes;

    
}