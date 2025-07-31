import type { PencilPoints, Shape, SizeKey, TextType, Tools } from "@/components/clientComponent"
import { getExistingShapes, getExistingTexts } from "./http"
import { TextSearch } from "lucide-react"
import { text } from "stream/consumers"

interface axis {
  x: number
  y: number
}

export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null
  private existingShape: Shape[]
  private existingText : TextType[]
  private roomId: number
  private clicked: boolean
  private start: axis
  private end: axis
  private font : string;
  private fontSize : SizeKey;
  private strokeColor: string
  private strokeWidth: number
  private selectedTool: Tools = "Rectangle"
  private newShapesAfterErasing: Shape[] | null
  private pencilPoints: PencilPoints[]
  socket: WebSocket

  constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.existingShape = []
    this.existingText = []
    this.roomId = roomId
    this.socket = socket
    this.clicked = false
    this.strokeColor = "rgba(255, 255 , 255 , 1)"
    this.newShapesAfterErasing = null
    this.strokeWidth = 1
    this.start = { x: 0, y: 0 }
    this.end = { x: 0, y: 0 }
    this.pencilPoints = []
    this.font = "Arial"
    this.fontSize = "M"
    this.init()
    this.initHandler()
    this.initMouseHandler()
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
  }

  setTool(tool: Tools) {
    this.selectedTool = tool
  }

  async init() {
    try {
      this.existingShape = await getExistingShapes(this.roomId);
      this.existingText = await getExistingTexts(this.roomId);
      this.clearCanvas()
    } catch (error) {
      console.error("Error loading existing shapes:", error)
    }
  }

  initHandler() {
    this.socket.addEventListener("message", (event) => {
      try {
        const parsedMessage = JSON.parse(event.data) // {type: "shape",shape,roomId,}
        console.log("parsed data in fe " , parsedMessage);
        
        if (parsedMessage.type === "shape") {
          const parsedShape = parsedMessage.shape //shape = { type: "Arrow", x: this.start.x, y: this.start.y, height, width, color: this.strokeColor }
          this.existingShape.push(parsedShape)
          this.clearCanvas()
        } else if(parsedMessage.type === "chat") {
          
          const chat = parsedMessage.shape;
          console.log("chat format in fe " , chat);

          this.existingText.push(chat);
          this.clearCanvas();
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error)
      }                       
    })
  }

  clearCanvas() {
    if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPreviousShapes(this.existingShape, this.canvas , this.existingText);
    }
  }


  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true
    this.start.x = e.clientX;
    this.start.y = e.clientY;

    // Reset pencil points for new drawing
    if (this.selectedTool === "Pencil") {
      this.pencilPoints = []
    }

    if(this.selectedTool === "Text") {
      console.log("mouse down handler when text is chosen");
      
      this.writeText(this.ctx);

    }
  }

  mouseUpHandler = (e: MouseEvent) => {
    
  this.clicked = false
  if (this.selectedTool === "Text") return;
  const rect = this.canvas.getBoundingClientRect();
  const endX = e.clientX - rect.left;
  const endY = e.clientY - rect.top;
  
  const width = endX - this.start.x;
  const height = endY - this.start.y;
    

    const selectedTool = this.selectedTool
    let shape: Shape | null = null

    if (selectedTool === "Rectangle") {
      shape = { type: "Rectangle", x : this.start.x, y : this.start.y , height, width, color: this.strokeColor }
    } else if (selectedTool === "Circle") {
      shape = { type: "Circle", x : this.start.x, y : this.start.y, height, width, color: this.strokeColor }
    } else if (selectedTool === "Line") {
      shape = { type: "Line", x : this.start.x, y : this.start.y, height, width, color: this.strokeColor }
    } else if (selectedTool === "Triangle") {
      shape = { type: "Triangle",x : this.start.x, y : this.start.y, height, width, color: this.strokeColor }
    } else if (selectedTool === "Arrow") {
      shape = { type: "Arrow", x : this.start.x, y : this.start.y, height, width, color: this.strokeColor }
    } else if (selectedTool === "Rhombus") {
      shape = { type: "Rhombus", x : this.start.x, y : this.start.y, height, width, color: this.strokeColor }
    } else if (selectedTool === "Pencil") {
      shape = {
        type: "Pencil",
        x: this.start.x,
        y: this.start.y,
        height,
        width,
        color: this.strokeColor,
        pencilPoints: [...this.pencilPoints],
      }
    } else if (selectedTool === "Eraser") {
      // Handle eraser logic here
    } else {
      console.log("mouse is up");
      
    }

    if (shape) {
      this.existingShape.push(shape);
      
      this.socket.send(
        JSON.stringify({
          type: "shape",
          shape,
          roomId: this.roomId,
        }),
      )

      // Clear pencil points after saving
      if (this.selectedTool === "Pencil") {
        this.pencilPoints = []
      }
    }
  }

  mouseMoveHandler = (e: MouseEvent) => {
    if (this.clicked && this.ctx) {
      if(this.selectedTool === "Text") return;
      const rect = this.canvas.getBoundingClientRect()
      const currentX = e.clientX - rect.left
      const currentY = e.clientY - rect.top

      // Clear canvas and redraw existing shapes
      this.clearCanvas()

      this.ctx.strokeStyle = this.strokeColor
      this.ctx.lineWidth = this.strokeWidth

      const selectedTool = this.selectedTool

      if (selectedTool === "Rectangle") {
        this.drawRectPreview(currentX, currentY)
      } else if (selectedTool === "Circle") {
        this.drawCirclePreview(currentX, currentY)
      } else if (selectedTool === "Pencil") {
        this.drawPencil(e, this.pencilPoints, this.canvas, this.strokeColor)
      } else if (selectedTool === "Triangle") {
        this.drawTrianglePreview(currentX, currentY)
      } else if (selectedTool === "Rhombus") {
        this.drawRhombusPreview(currentX, currentY)
      } else if (selectedTool === "Line") {
        this.drawLinePreview(currentX, currentY)
      } else if (selectedTool === "Arrow") {
        this.drawArrowPreview(currentX, currentY)
      } else if (selectedTool === "Eraser") {
        // Handle eraser preview if needed
      }
    }
  }

  mouseDoubleClick = (e : MouseEvent) => {
    this.clicked = true
    console.log("double mouse click");
    
    this.start.x = e.clientX;
    this.start.y = e.clientY;
    this.writeText(this.ctx);
  }

  initMouseHandler() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler)
    this.canvas.addEventListener("mouseup", this.mouseUpHandler)
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    this.canvas.addEventListener("dblclick", this.mouseDoubleClick)

  }

  drawPreviousShapes = (existingShapes: Shape[], canvas: HTMLCanvasElement , existingTexts : TextType[]) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if(existingShapes ) {
      existingShapes.forEach((shape) => {
        ctx.strokeStyle = shape.color || this.strokeColor
        ctx.lineWidth = this.strokeWidth

        if (shape.type === "Rectangle") {
          ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        } else if (shape.type === "Circle") {
          ctx.beginPath()
          ctx.ellipse(
            shape.x + shape.width / 2,
            shape.y + shape.height / 2,
            Math.abs(shape.width) / 2,
            Math.abs(shape.height) / 2,
            0,
            0,
            2 * Math.PI,
          )
          ctx.stroke()
        } else if (shape.type === "Line") {
          ctx.beginPath()
          ctx.moveTo(shape.x, shape.y)
          ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
          ctx.stroke()
        } else if (shape.type === "Triangle") {
          const midX = shape.x + shape.width / 2
          ctx.beginPath()
          ctx.moveTo(midX, shape.y)
          ctx.lineTo(shape.x, shape.y + shape.height)
          ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
          ctx.closePath()
          ctx.stroke()
        } else if (shape.type === "Arrow") {
          this.drawArrowShape(ctx, shape)
        } else if (shape.type === "Rhombus") {
          this.drawRhombusShape(ctx, shape)
        } else if (shape.type === "Pencil") {
          this.drawPencilShape(ctx, shape)
        }
      })
    }
    const fontSizeMap: Record<SizeKey, string> = {
    XS : "12px",
    S : "14px",
    M: "16px",
    L: "18px",
    XL : "20px"

    };    
    if(existingTexts ) {
        existingTexts.forEach( (textShape) => {
          console.log("iterating through existing shape");
          
          const fontSize = fontSizeMap[textShape.fontSize as SizeKey] || "14px";
          ctx.font = `${fontSize} ${textShape.font}`;
          ctx.fillStyle = textShape.color || this.strokeColor;
          ctx.fillText(textShape.content , textShape.x , textShape.y);
        })
      }


  }

  // Preview methods that don't clear the canvas
  drawRectPreview(currentX: number, currentY: number) {
    if (!this.ctx) return
    const width = currentX - this.start.x
    const height = currentY - this.start.y
    this.ctx.strokeRect(this.start.x, this.start.y, width, height)
  }

  drawCirclePreview(currentX: number, currentY: number) {
    if (!this.ctx) return
    const width = Math.abs(currentX - this.start.x)
    const height = Math.abs(currentY - this.start.y)
    const centerX = this.start.x + (currentX - this.start.x) / 2
    const centerY = this.start.y + (currentY - this.start.y) / 2

    this.ctx.beginPath()
    this.ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI)
    this.ctx.stroke()
  }

  drawLinePreview(currentX: number, currentY: number) {
    if (!this.ctx) return
    this.ctx.beginPath()
    this.ctx.moveTo(this.start.x, this.start.y)
    this.ctx.lineTo(currentX, currentY)
    this.ctx.stroke()
  }

  drawTrianglePreview(currentX: number, currentY: number) {
    if (!this.ctx) return
    const midX = (this.start.x + currentX) / 2
    this.ctx.beginPath()
    this.ctx.moveTo(midX, this.start.y)
    this.ctx.lineTo(this.start.x, currentY)
    this.ctx.lineTo(currentX, currentY)
    this.ctx.closePath()
    this.ctx.stroke()
  }

  drawArrowPreview(currentX: number, currentY: number) {
    if (!this.ctx) return
    const headLength = 20
    const dx = currentX - this.start.x
    const dy = currentY - this.start.y
    const angle = Math.atan2(dy, dx)

    this.ctx.beginPath()
    this.ctx.moveTo(this.start.x, this.start.y)
    this.ctx.lineTo(currentX, currentY)

    // Arrow head
    this.ctx.moveTo(currentX, currentY)
    this.ctx.lineTo(
      currentX - headLength * Math.cos(angle - Math.PI / 10),
      currentY - headLength * Math.sin(angle - Math.PI / 10),
    )
    this.ctx.moveTo(currentX, currentY)
    this.ctx.lineTo(
      currentX - headLength * Math.cos(angle + Math.PI / 10),
      currentY - headLength * Math.sin(angle + Math.PI / 10),
    )
    this.ctx.stroke()
  }

  drawRhombusPreview(currentX: number, currentY: number) {
    if (!this.ctx) return
    const width = currentX - this.start.x
    const height = currentY - this.start.y
    const centerX = this.start.x + width / 2
    const centerY = this.start.y + height / 2

    this.ctx.beginPath()
    this.ctx.moveTo(centerX, this.start.y)
    this.ctx.lineTo(this.start.x, centerY)
    this.ctx.lineTo(centerX, this.start.y + height)
    this.ctx.lineTo(this.start.x + width, centerY)
    this.ctx.closePath()
    this.ctx.stroke()
  }

  // Helper methods for drawing saved shapes
  drawArrowShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    const endX = shape.x + shape.width
    const endY = shape.y + shape.height
    const headLength = 20
    const dx = shape.width
    const dy = shape.height
    const angle = Math.atan2(dy, dx)

    ctx.beginPath()
    ctx.moveTo(shape.x, shape.y)
    ctx.lineTo(endX, endY)
    ctx.moveTo(endX, endY)
    ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 10), endY - headLength * Math.sin(angle - Math.PI / 10))
    ctx.moveTo(endX, endY)
    ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 10), endY - headLength * Math.sin(angle + Math.PI / 10))
    ctx.stroke()
  }

  drawRhombusShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    const centerX = shape.x + shape.width / 2
    const centerY = shape.y + shape.height / 2

    ctx.beginPath()
    ctx.moveTo(centerX, shape.y)
    ctx.lineTo(shape.x, centerY)
    ctx.lineTo(centerX, shape.y + shape.height)
    ctx.lineTo(shape.x + shape.width, centerY)
    ctx.closePath()
    ctx.stroke()
  }

  drawPencilShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    const points = shape.pencilPoints
    if (!points || points.length < 2) return

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2
      const midY = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY)
    }

    const last = points[points.length - 1]
    ctx.lineTo(last.x, last.y)
    ctx.stroke()
  }

  drawPencil = (
    e: MouseEvent,
    pencilPoints: { x: number; y: number }[],
    canvas: HTMLCanvasElement,
    chooseColors: string,
  ) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const x = e.clientX - this.start.x;
    const y = e.clientY - this.start.y;
    pencilPoints.push({ x, y })

    ctx.strokeStyle = chooseColors
    ctx.lineWidth = this.strokeWidth
    ctx.beginPath()

    if (pencilPoints.length < 2) {
      const p = pencilPoints[0]
      if (p) {
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x, p.y)
      }
    } else {
      ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y)

      for (let i = 1; i < pencilPoints.length - 1; i++) {
        const midX = (pencilPoints[i].x + pencilPoints[i + 1].x) / 2
        const midY = (pencilPoints[i].y + pencilPoints[i + 1].y) / 2
        ctx.quadraticCurveTo(pencilPoints[i].x, pencilPoints[i].y, midX, midY)
      }

      const last = pencilPoints[pencilPoints.length - 1]
      ctx.lineTo(last.x, last.y)
    }

    ctx.stroke()
  }

  writeText(ctx : CanvasRenderingContext2D | null) {
    
    if( !this.canvas || !ctx) return;
    console.log("in write text function");
    

    const input = document.createElement('input');
    input.type = "text";
    input.style.position = "absolute";
    const rect = this.canvas.getBoundingClientRect();
    input.style.left = `${this.start.x + rect.left}px`;
    input.style.top = `${this.start.y + rect.top}px`;
    input.style.background = "transparent";
    input.style.border = "2px solid red";
    input.style.color = this.strokeColor;
    input.style.font = this.font;
    input.style.zIndex = "1000";

    document.body.appendChild(input);
    setTimeout(() => input.focus(), 0); // Fix for cursor focus
    console.log("after input focus");
    

    const submitText = () => {
      const text = input.value.trim();
      console.log("text in input is " , text);
      
      if(text) {
        const textShape : TextType = {
          x : this.start.x,
          y : this.start.y,
          color : this.strokeColor,
          font : this.font,
          fontSize : this.fontSize,
          content : text
        }
        console.log("text shape in fe " , textShape);
        
      this.existingText.push(textShape);
      console.log("existing text " , this.existingText);
      console.log("format sending from fe to ws " , JSON.stringify({
          type : "chat",
          shape : textShape,
          roomId : this.roomId
        }));
      this.socket.send(
        JSON.stringify({
          type : "chat",
          shape : textShape,
          roomId : this.roomId
        })
      );

      this.clearCanvas();
      }
      document.body.removeChild(input);
    };

    input.addEventListener("keydown" , (e) => {
      if(e.key === "Enter") {
        submitText();
      }
    });
    input.addEventListener("blur" , submitText);
  }


}
