import { Tool } from "@/components/clientComponent";
import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";
import { Short_Stack } from "next/font/google";
import { CanvasHTMLAttributes } from "react";

type Shapes = {
    type : "rect";
    x : number;
    y : number;
    width : number;
    height : number
} | {
    type : "circle";
    centerX : number;
    centerY : number;
    radius : number
} | {
    type : "pencil";
    startX : number;
    startY : number;
    endX : number;
    endY : number
}

export class Game {
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D | null;
    private existingShape : Shapes[];
    private roomId : string;

    private clicked : boolean;
    private startX : number;
    private startY : number;
    private selectedTool : Tool = "rect";

    socket : WebSocket;
    constructor(canvas : HTMLCanvasElement , roomId : string , socket : WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.existingShape = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandler();
        this.initMouseHandlers();

    }

    destroy() {
        this.canvas.removeEventListener("mousedown" , this.mouseHandler);

    }

    setTool(tool : Tool) {
        this.selectedTool = tool;
    }

    async init() {
        const res = await axios.get(`${BACKEND_URL}/chat/${this.roomId}`);
        
    }

    initHandler() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if(message.type == "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShape.push(parsedShape.shape);
                this.clearCanvas();

            }

        }
    }

    clearCanvas() {
        if(this.ctx) {
            this.ctx.clearRect(0 , 0 , this.canvas.width , this.canvas.height);
            this.ctx.fillStyle = "rgba(0 , 0 , 0 )";
            this.ctx.fillRect(0 , 0 , this.canvas.width , this.canvas.height);

            this.existingShape.map( (shape) => {
                if(shape.type == "rect") {
                    if(this.ctx) {
                        this.ctx.strokeStyle = "rgba(255 , 255 , 255)";
                        this.ctx.strokeRect(shape.x , shape.y , shape.width , shape.height);
                    }
                } else if(shape.type == "circle") {
                    if(this.ctx) {
                        this.ctx.beginPath();
                        this.ctx.arc(shape.centerX , shape.centerY , Math.abs(shape.radius) , 0 , Math.PI * 2);
                        this.ctx.stroke();
                        this.ctx.closePath();
                    }

                }
            })
        }
    }

    mouseDownHandler = (e : MouseEvent) => {
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY
    }

    mouseUpHandler = (e : MouseEvent) => {
        this.clicked = false
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        const selectedTool = this.selectedTool;
        let shape: Shapes | null = null;
        if (selectedTool === "rect") {

            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            }
        }

        if (!shape) {
            return;
        }

        this.existingShape.push(shape);

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }
    mouseMoveHandler = (e : MouseEvent) => {
        if (this.clicked) {
            if(this.ctx) {
                const width = e.clientX - this.startX;
                const height = e.clientY - this.startY;
                this.clearCanvas();
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                const selectedTool = this.selectedTool;
                console.log(selectedTool)
                if (selectedTool === "rect") {
                    this.ctx.strokeRect(this.startX, this.startY, width, height);   
                } else if (selectedTool === "circle") {
                    const radius = Math.max(width, height) / 2;
                    const centerX = this.startX + radius;
                    const centerY = this.startY + radius;
                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.closePath();                
                }
            }
        }
    }



}