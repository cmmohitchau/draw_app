import { PencilPoints, Shape, Tools } from "@/components/clientComponent";
import { getExistingShapes } from "./http";
import { drawPreviousShapes, handleMousedown, handleMousemove, handleMouseup } from "@/draw/action";

interface axis {
    x : number,
    y : number
}

export class Game {
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D | null;
    private existingShape : Shape[];
    private roomId : number;
    private clicked : boolean;
    private start: axis;
    private end : axis;
    private strokeColor : string;
    private strokeWidth : number;
    private selectedTool : Tools = "rect";
    private pencilPoints : PencilPoints [];
    socket : WebSocket;

    constructor(canvas : HTMLCanvasElement , roomId : number , socket : WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.existingShape = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.strokeColor = "rgba(255, 255, 255, 1)";
        this.strokeWidth = 1;
        this.start = {x : 0 ,y :  0};
        this.end = {x : 0 ,y :  0};
        this.pencilPoints = [];
        this.init();
        this.initHandler();
        this.initMouseHandler();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown" , this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup" , this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove" , this.mouseMoveHandler)

    }

    setTool(tool : Tools) {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShape = await getExistingShapes(this.roomId);
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
        }
    }

    mouseDownHandler = (e : MouseEvent) => {
        this.clicked = true
        this.start.x = e.clientX
        this.start.y = e.clientY
    }

    mouseUpHandler = (e : MouseEvent) => {
        this.clicked = false
        const width = e.clientX - this.start.x;
        const height = e.clientY - this.start.y;
        this.end.x = e.clientX;
        this.end.y = e.clientY;
        

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.start.x,
                y: this.start.y,
                height,
                width,
                color : this.strokeColor
            }
        } else if (selectedTool === "circle") {
            shape = {
                type : "circle",
                x: this.start.x,
                y: this.start.y,
                height,
                width,
                color : this.strokeColor               
            }
            
        } else if (selectedTool === "line") {
            shape = {
                type : "line",
                x: this.start.x,
                y: this.start.y,
                height,
                width,
                color : this.strokeColor               
            }
        } else if (selectedTool === "triangle") {
            shape = {
                type : "triangle",
                x: this.start.x,
                y: this.start.y,
                height,
                width,
                color : this.strokeColor               
            }
        } else if (selectedTool === "arrow") {
            shape = {
                type : "arrow",
                x: this.start.x,
                y: this.start.y,
                height,
                width,
                color : this.strokeColor               
            }
        } else if (selectedTool === "rhombus") {
            shape = {
                type : "rhombus",
                x: this.start.x,
                y: this.start.y,
                height,
                width,
                color : this.strokeColor               
            }
        } else if (selectedTool === "pencil") {
            shape = {
                type : "circle",
                x: this.start.x,
                y: this.start.y,
                height,
                width,
                color : this.strokeColor  ,
                pencilPoints : this.pencilPoints         
            }
        } else if (selectedTool === "eraser") {
            
        }

        if (!shape) {
            return;
        }

        this.existingShape.push(shape);        

        this.socket.send(JSON.stringify({
            type: "shape",
            shape: JSON.stringify({
                shape
            }),
            RoomId: this.roomId
        }))
    }

    mouseMoveHandler = (e : MouseEvent) => {
        if (this.clicked) {
            if(this.ctx) {
                const width = e.clientX - this.start.x;
                const height = e.clientY - this.start.y;
                this.clearCanvas();
                this.ctx.strokeStyle = this.strokeColor;
                const selectedTool = this.selectedTool;
                if (selectedTool === "rect") {
                    
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