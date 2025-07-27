"use client"

import { useSocket } from "@/app/hooks/useSocket"
import { ArrowRight, Circle, Diamond, Eraser, Pencil, RectangleHorizontal, Slash, Triangle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { IconButton } from "./ui/IconButton"
import { Game } from "@/draw/Game"

export type Tools = "Rectangle" | "Circle" | "Line" | "Rhombus" | "Pencil" | "Triangle" | "Arrow" | "Eraser"

export type PencilPoints = { x: number; y: number }

export type Shape = {
  type: string
  x: number
  y: number
  width: number
  height: number
  pencilPoints?: PencilPoints[]
  color?: string
}

export default function ClientComponent({ id }: { id: number }) {


  const { loading, socket } = useSocket(id);

  const [selectedTool, setSelectedTool] = useState<Tools>("Rectangle")
  const [game, setGame] = useState<Game>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    game?.setTool(selectedTool)
  }, [selectedTool, game])

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  useEffect(() => {
    if (canvasRef.current && socket) {
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) {
        console.error("Canvas context not available")
        return
      }

      const g = new Game(canvasRef.current, id, socket)
      
      setGame(g)

      return () => g.destroy()
    }
  }, [canvasRef, socket, id])

  if (loading || !socket) {
    return (
      <div className="min-h-screen flex justify-center items-center" role="status">
        <div className="flex flex-col justify-center items-center">
          <svg
            aria-hidden="true"
            className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: "100vh" }}>
      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ display: "block" }}>
        {/* Fallback content for browsers that don't support canvas */}
        Your browser does not support the canvas element. Selected tool: {selectedTool}
      </canvas>
    </div>
  )
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tools
  setSelectedTool: (s: Tools) => void
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        zIndex: 10, // ensure it's above canvas
      }}
    >
      <div className="flex flex-wrap gap-1">
        <IconButton onClick={() => setSelectedTool("Pencil")} activated={selectedTool === "Pencil"} icon={<Pencil />} />
        <IconButton onClick={() => setSelectedTool("Circle")} activated={selectedTool === "Circle"} icon={<Circle />} />
        <IconButton
          onClick={() => setSelectedTool("Rectangle")}
          activated={selectedTool === "Rectangle"}
          icon={<RectangleHorizontal />}
        />
        <IconButton onClick={() => setSelectedTool("Line")} activated={selectedTool === "Line"} icon={<Slash />} />
        <IconButton
          onClick={() => setSelectedTool("Arrow")}
          activated={selectedTool === "Arrow"}
          icon={<ArrowRight />}
        />
        <IconButton
          onClick={() => setSelectedTool("Rhombus")}
          activated={selectedTool === "Rhombus"}
          icon={<Diamond />}
        />
        <IconButton onClick={() => setSelectedTool("Eraser")} activated={selectedTool === "Eraser"} icon={<Eraser />} />
        <IconButton
          onClick={() => setSelectedTool("Triangle")}
          activated={selectedTool === "Triangle"}
          icon={<Triangle />}
        />
      </div>
    </div>
  )
}
