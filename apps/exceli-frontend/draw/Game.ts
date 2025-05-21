import { Tool } from "@/components/clientComponent";
import { getExistingShape } from "./http";

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
    private roomId : number;
    private clicked : boolean;
    private startX : number = 0;
    private startY : number = 0;
    private endX : number = 0;
    private endY : number = 0;
    private selectedTool : Tool = "rect";

    socket : WebSocket;

    constructor(canvas : HTMLCanvasElement , roomId : number , socket : WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.existingShape = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandler();
        this.initMouseHandler();
        console.log("in game constructor");
    }

    destroy() {
        this.canvas.removeEventListener("mousedown" , this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup" , this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove" , this.mouseMoveHandler)

    }

    setTool(tool : Tool) {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShape = await getExistingShape(this.roomId);
        console.log(this.existingShape);
        this.clearCanvas();
    }

    initHandler() {
        this.socket.addEventListener("message" , (event) => {
            const message = JSON.parse(event.data);

            if(message.type == "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShape.push(parsedShape.shape);
                this.clearCanvas();
            }
        })
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
        this.endX = e.clientX;
        this.endY = e.clientY;
        

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
        } else  {
            const shape = {
                type : "pencil",
                startX : this.startX,
                startY : this.startY,
                endX : this.endX,
                endY : this.endY
            }
        }

        if (!shape) {
            return;
        }

        this.existingShape.push(shape);
        console.log(this.existingShape);
        

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            RoomId: this.roomId
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
                } else if (selectedTool === "pencil") {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.startX , this.startY);
                    this.ctx.lineTo(this.endX , this.endY);
                    this.ctx.stroke();
                    this.ctx.closePath(); 
                }
            }
        }
    }

    initMouseHandler() {
            this.canvas.addEventListener("mousedown", this.mouseDownHandler)

            this.canvas.addEventListener("mouseup", this.mouseUpHandler)

            this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    

    }
}