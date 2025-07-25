import axios from "axios";
import { BACKEND_URL } from "@repo/common/urls";

export const drawPreviousShapes = (existingShapes: any, canvasRef: any) => {
    existingShapes.forEach((e: any) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        ctx.lineWidth = 2

        if (!canvas || !ctx) return;
        ctx.strokeStyle = e.color
        if (e.type == "Rectangle") {
            ctx.strokeRect(e.x, e.y, e.width, e.height)
        } else if (e.type == "Circle") {
            ctx.beginPath();
            ctx.ellipse(
                e.x + e.width / 2,
                e.y + e.height / 2,
                Math.abs(e.width) / 2,
                Math.abs(e.height) / 2,
                0,
                0,
                2 * Math.PI
            );
            ctx.stroke();
        } else if (e.type === "Line") {
            ctx.beginPath();
            ctx.moveTo(e.x, e.y);
            ctx.lineTo(e.x + e.width, e.y + e.height);
            ctx.stroke();
        } else if (e.type === "Triangle") {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const midX = e.x + e.width / 2;

            ctx.beginPath();
            ctx.moveTo(midX, e.y);                   // Top
            ctx.lineTo(e.x, e.y + e.height);         // Bottom-left
            ctx.lineTo(e.x + e.width, e.y + e.height); // Bottom-right
            ctx.closePath();
            ctx.stroke();
        } else if (e.type === "Arrow") {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const endX = e.x + e.width;
            const endY = e.y + e.height;

            const headLength = 20;
            const dx = endX - e.x;
            const dy = endY - e.y;
            const angle = Math.atan2(dy, dx);

            ctx.beginPath();

            // Line
            ctx.moveTo(e.x, e.y);
            ctx.lineTo(endX, endY);

            // Arrow head
            ctx.moveTo(endX, endY);
            ctx.lineTo(
                endX - headLength * Math.cos(angle - Math.PI / 10),
                endY - headLength * Math.sin(angle - Math.PI / 10)
            );
            ctx.moveTo(endX, endY);
            ctx.lineTo(
                endX - headLength * Math.cos(angle + Math.PI / 10),
                endY - headLength * Math.sin(angle + Math.PI / 10)
            );

            ctx.stroke();
        } else if (e.type === "Rhombus") {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const centerX = e.x + e.width / 2;
            const centerY = e.y + e.height / 2;

            ctx.beginPath();
            ctx.moveTo(centerX, e.y);                  // Top vertex
            ctx.lineTo(e.x, centerY);                  // Left vertex
            ctx.lineTo(centerX, e.y + e.height);      // Bottom vertex
            ctx.lineTo(e.x + e.width, centerY);       // Right vertex
            ctx.closePath();
            ctx.stroke();
        } else if (e.type === "Pencil") {
            const points = e.pencilPoints;
            if (!points || points.length < 2) return;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length - 1; i++) {
                const midX = (points[i].x + points[i + 1].x) / 2;
                const midY = (points[i].y + points[i + 1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
            }
            // Draw the last segment
            const last = points[points.length - 1];
            if (last) {
                ctx.lineTo(last.x, last.y);
            }
            console.log("from inside the pencil")
            ctx.stroke();
        }
    })
}
const isPointNearLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number, threshold = 5) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;

    let xx, yy;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy) < threshold;
};
export const drawRect = (e: MouseEvent, startPoint: { x: number; y: number }, canvas: HTMLCanvasElement, chooseColors: string) => {
    const rectangle = canvas.getBoundingClientRect()
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2
    const x = e.clientX - rectangle.left
    const y = e.clientY - rectangle.top
    const width = x - startPoint.x
    const height = y - startPoint.y
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = chooseColors
    ctx.strokeRect(startPoint.x, startPoint.y, width, height)
}
export const drawLine = (
    e: MouseEvent,
    startPoint: { x: number; y: number },
    canvas: HTMLCanvasElement,
    chooseColors: string
) => {
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2

    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = chooseColors;
    ctx.stroke();
};
export const drawCircle = (
    e: MouseEvent,
    startPoint: { x: number; y: number },
    canvas: HTMLCanvasElement,
    chooseColors: string
) => {
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2

    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const x = Math.min(startPoint.x, endX);
    const y = Math.min(startPoint.y, endY);
    const width = Math.abs(endX - startPoint.x);
    const height = Math.abs(endY - startPoint.y);

    const centerX = x + width / 2;
    const centerY = y + height / 2;

    ctx.beginPath();

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = chooseColors;
    ctx.stroke();
};
export const drawTriangle = (
    e: MouseEvent,
    startPoint: { x: number; y: number },
    canvas: HTMLCanvasElement,
    chooseColors: string
) => {
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2

    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const midX = (startPoint.x + endX) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(midX, startPoint.y);           // Top vertex
    ctx.lineTo(startPoint.x, endY);           // Bottom-left vertex
    ctx.lineTo(endX, endY);                   // Bottom-right vertex
    ctx.closePath();
    ctx.strokeStyle = chooseColors;
    ctx.stroke();
};
export const drawArrow = (
    e: MouseEvent,
    startPoint: { x: number; y: number },
    canvas: HTMLCanvasElement,
    chooseColors: string
) => {
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2

    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const headLength = 20; // length of the arrow head
    const dx = endX - startPoint.x;
    const dy = endY - startPoint.y;
    const angle = Math.atan2(dy, dx);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    // Line
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endX, endY);

    // Arrow head
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - headLength * Math.cos(angle - Math.PI / 10),
        endY - headLength * Math.sin(angle - Math.PI / 10)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 10),
        endY - headLength * Math.sin(angle + Math.PI / 10)
    );

    ctx.strokeStyle = chooseColors;
    ctx.stroke();
};
export const drawRhombus = (
    e: MouseEvent,
    startPoint: { x: number; y: number },
    canvas: HTMLCanvasElement,
    chooseColors: string
) => {
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2

    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const width = endX - startPoint.x;
    const height = endY - startPoint.y;

    const centerX = startPoint.x + width / 2;
    const centerY = startPoint.y + height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(centerX, startPoint.y);                 // Top vertex
    ctx.lineTo(startPoint.x, centerY);                 // Left vertex
    ctx.lineTo(centerX, startPoint.y + height);        // Bottom vertex
    ctx.lineTo(startPoint.x + width, centerY);         // Right vertex
    ctx.closePath();
    ctx.strokeStyle = chooseColors;
    ctx.stroke();
};
export const drawPencil = (
    e: MouseEvent,
    pencilPoints: { x: number; y: number }[],
    canvas: HTMLCanvasElement,
    chooseColors: string
) => {
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!pencilPoints) return;
    ctx.lineWidth = 2

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pencilPoints.push({ x, y });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    if (pencilPoints.length < 2) {
        // Not enough points to draw curves, just draw a dot or move to first point
        const p = pencilPoints[0];
        if (p) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y);
        }
    } else {
        if (pencilPoints[0]) {
            ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);

            for (let i = 1; i < pencilPoints.length - 1; i++) {
                if (pencilPoints[i + 1]) {
                    if (pencilPoints[i + 1]) {
                        //@ts-ignore
                        const midX = (pencilPoints[i].x + pencilPoints[i + 1].x) / 2;
                        //@ts-ignore
                        const midY = (pencilPoints[i].y + pencilPoints[i + 1].y) / 2;
                        if (pencilPoints[i]) {
                            ctx.quadraticCurveTo(pencilPoints[i]!.x, pencilPoints[i]!.y, midX, midY);
                        }
                    }
                }
            }
        }

        // Draw last line segment
        const last = pencilPoints[pencilPoints.length - 1];
        if (last) {
            ctx.lineTo(last.x, last.y);
        }
    }

    ctx.strokeStyle = chooseColors;
    ctx.stroke();
};
let newShapesAfterErasing: any = null;
export const handleEraserClick = (
    e: MouseEvent,
    canvasRef: any,
    existingShapes: any[],
    setexistingShapes: any,
    setShape: any
) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newShapes = existingShapes.filter((shape) => {
        if (shape.type === "Rectangle") {
            return !(
                clickX >= shape.x &&
                clickX <= shape.x + shape.width &&
                clickY >= shape.y &&
                clickY <= shape.y + shape.height
            );
        }

        if (shape.type === "Circle") {
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;
            const radiusX = shape.width / 2;
            const radiusY = shape.height / 2;
            const dx = clickX - centerX;
            const dy = clickY - centerY;
            return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) > 1;
        }

        if (shape.type === "Line" || shape.type === "Arrow") {
            return !isPointNearLine(
                clickX, clickY,
                shape.x, shape.y,
                shape.x + shape.width, shape.y + shape.height
            );
        }

        if (shape.type === "Triangle" || shape.type === "Rhombus") {
            // rough bounding box check
            return !(
                clickX >= shape.x &&
                clickX <= shape.x + shape.width &&
                clickY >= shape.y &&
                clickY <= shape.y + shape.height
            );
        }

        // if (shape.type === "Pencil" || shape.type === "PenTool") {
        //     const points = shape.points;
        //     for (let i = 0; i < points.length - 1; i++) {
        //         if (isPointNearLine(clickX, clickY, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)) {
        //             return false; // erase
        //         }
        //     }
        //     return true;
        // }

        setShape(shape)
        return true;
    });
    newShapesAfterErasing = newShapes
};

export const handleMousedown = (e: MouseEvent, canvasRef: any, setStartPoint: any, chooseShapes: any, setPencilPoints: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (chooseShapes === "Pencil") {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPoint({ x, y });
        setPencilPoints([{ x, y }]);
    }
    const rectangle = canvas.getBoundingClientRect()
    setStartPoint({ x: e.clientX - rectangle.left, y: e.clientY - rectangle.top })
}
export const handleMousemove = (e: MouseEvent, canvasRef: any, startPoint: any, chooseShapes: any, existingShapes: any, setendPoint: any, pencilPoints: any, setexistingShapes: any, setShape: any, chooseColors: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!startPoint) return;
    const rectangle = canvas.getBoundingClientRect()
    setendPoint({ x: e.clientX - rectangle.left, y: e.clientY - rectangle.top })
    if (chooseShapes == "Rectangle") {
        drawRect(e, startPoint, canvas, chooseColors)
    }
    if (chooseShapes == "Circle") {
        drawCircle(e, startPoint, canvas, chooseColors)
    }
    if (chooseShapes === "Line") {
        drawLine(e, startPoint, canvas, chooseColors);
    }
    if (chooseShapes === "Triangle") {
        drawTriangle(e, startPoint, canvas, chooseColors);
    }
    if (chooseShapes === "Arrow") {
        drawArrow(e, startPoint, canvas, chooseColors);
    }
    if (chooseShapes === "Rhombus") {
        drawRhombus(e, startPoint, canvas, chooseColors);
    }
    if (chooseShapes === "Pencil" && pencilPoints.length > 0) {
        drawPencil(e, pencilPoints, canvas, chooseColors);
    }
    if (chooseShapes === "Eraser") {
        handleEraserClick(e, canvasRef, existingShapes, setexistingShapes, setShape);
        return;
    }
    drawPreviousShapes(existingShapes, canvasRef)
}
export const handleMouseup = (e: MouseEvent, canvasRef: any, startPoint: any, setStartPoint: any, chooseShapes: any, setexistingShapes: any, setPencilPoints: any, pencilPoints: any, setShape: any, existingShapes: any, chooseColors: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!startPoint) return;
    const roomId = localStorage.getItem("roomId")
    if (chooseShapes == "Rectangle") {
        const rectangle = canvas.getBoundingClientRect()
        const x = e.clientX - rectangle.left
        const y = e.clientY - rectangle.top
        const width = x - startPoint.x
        const height = y - startPoint.y
        setexistingShapes((prev: any) => [...prev, { type: "Rectangle", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors }])
        setShape({ type: "Rectangle", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors })
        const token = localStorage.getItem("token")
        axios.post(`${BACKEND_URL}/shape`,
            {
                type: "Rectangle",
                slug:roomId,
                width: width,
                height: height,
                color: chooseColors,
                x: startPoint.x,
                y: startPoint.y
            },
            { headers: { Authorization: token } })
            .then((e) => console.log(e))
            .catch((e) => console.log(e))
    }
    if (chooseShapes == "Circle") {
        const rectangle = canvas.getBoundingClientRect()
        const x = e.clientX - rectangle.left
        const y = e.clientY - rectangle.top
        const width = x - startPoint.x
        const height = y - startPoint.y
        setexistingShapes((prev: any) => [...prev, { type: "Circle", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors }])
        setShape({ type: "Circle", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors })
        const token = localStorage.getItem("token")
        axios.post(`${BACKEND_URL}/shape`,
            {
                type: "Circle",
                width: width,
                slug:roomId,
                height: height,
                color: chooseColors,
                x: startPoint.x,
                y: startPoint.y
            },
            { headers: { Authorization: token } })
            .then((e) => console.log(e))
            .catch((e) => console.log(e))
    }
    if (chooseShapes == "Line") {
        const rectangle = canvas.getBoundingClientRect()
        const x = e.clientX - rectangle.left
        const y = e.clientY - rectangle.top
        const width = x - startPoint.x
        const height = y - startPoint.y
        setexistingShapes((prev: any) => [...prev, { type: "Line", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors }])
        setShape({ type: "Line", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors })
        const token = localStorage.getItem("token")
        axios.post(`${BACKEND_URL}/shape`,
            {
                type: "Line",
                slug:roomId,
                width: width,
                height: height,
                color: chooseColors,
                x: startPoint.x,
                y: startPoint.y
            },
            { headers: { Authorization: token } })
            .then((e) => console.log(e))
            .catch((e) => console.log(e))
    }
    if (chooseShapes == "Triangle") {
        const rectangle = canvas.getBoundingClientRect()
        const x = e.clientX - rectangle.left
        const y = e.clientY - rectangle.top
        const width = x - startPoint.x
        const height = y - startPoint.y
        setexistingShapes((prev: any) => [...prev, { type: "Triangle", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors }])
        setShape({ type: "Triangle", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors })
        const token = localStorage.getItem("token")
        axios.post(`${BACKEND_URL}/shape`,
            {
                type: "Triangle",
                slug:roomId,
                width: width,
                height: height,
                color: chooseColors,
                x: startPoint.x,
                y: startPoint.y
            },
            { headers: { Authorization: token } })
            .then((e) => console.log(e))
            .catch((e) => console.log(e))
    }
    if (chooseShapes == "Arrow") {
        const rectangle = canvas.getBoundingClientRect()
        const x = e.clientX - rectangle.left
        const y = e.clientY - rectangle.top
        const width = x - startPoint.x
        const height = y - startPoint.y
        setexistingShapes((prev: any) => [...prev, { type: "Arrow", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors }])
        setShape({ type: "Arrow", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors })
        const token = localStorage.getItem("token")
        axios.post(`${BACKEND_URL}/shape`,
            {
                type: "Arrow",
                slug:roomId,
                width: width,
                height: height,
                color: chooseColors,
                x: startPoint.x,
                y: startPoint.y
            },
            { headers: { Authorization: token } })
            .then((e) => console.log(e))
            .catch((e) => console.log(e))
    }
    if (chooseShapes == "Rhombus") {
        const rectangle = canvas.getBoundingClientRect()
        const x = e.clientX - rectangle.left
        const y = e.clientY - rectangle.top
        const width = x - startPoint.x
        const height = y - startPoint.y
        setexistingShapes((prev: any) => [...prev, { type: "Rhombus", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors }])
        setShape({ type: "Rhombus", x: startPoint.x, y: startPoint.y, width, height, color: chooseColors })
        const token = localStorage.getItem("token")
        axios.post(`${BACKEND_URL}/shape`,
            {
                type: "Rhombus",
                width: width,
                slug:roomId,
                height: height,
                color: chooseColors,
                x: startPoint.x,
                y: startPoint.y
            },
            { headers: { Authorization: token } })
            .then((e) => console.log(e))
            .catch((e) => console.log(e))
    }
    if (chooseShapes == "Pencil") {
        const rectangle = canvas.getBoundingClientRect()
        const x = e.clientX - rectangle.left
        const y = e.clientY - rectangle.top
        const width = x - startPoint.x
        const height = y - startPoint.y
        setexistingShapes((prev: any) => [...prev, { type: "Pencil", x: startPoint.x, y: startPoint.y, width, height, pencilPoints: pencilPoints, color: chooseColors }])

        setShape({ type: "Pencil", x: startPoint.x, y: startPoint.y, width, height, pencilPoints: pencilPoints, color: chooseColors })
        setPencilPoints([]);
        const token = localStorage.getItem("token")
        axios.post(`${BACKEND_URL}/shape`,
            {
                type: "Pencil",
                width: width,
                slug:roomId,
                height: height,
                color: chooseColors,
                pencilPoints: pencilPoints,
                x: startPoint.x,
                y: startPoint.y
            },
            { headers: { Authorization: token } })
            .then((e) => console.log(e))
            .catch((e) => console.log(e))
    }
    if (chooseShapes == "Eraser") {
        const rectangle = canvas.getBoundingClientRect()
        const x = e.clientX - rectangle.left
        const y = e.clientY - rectangle.top
        const width = x - startPoint.x
        const height = y - startPoint.y
        console.log("hi", newShapesAfterErasing)
        setexistingShapes(newShapesAfterErasing)
        // drawPreviousShapes(existingShapes, canvasRef)
        const token = localStorage.getItem("token")
        axios.post(`${BACKEND_URL}/shape`,
            {
                type: "Circle",
                width: width,
                slug:roomId,
                height: height,
                color: chooseColors,
                x: startPoint.x,
                y: startPoint.y
            },
            { headers: { Authorization: token } })
            .then((e) => console.log(e))
            .catch((e) => console.log(e))

    }
    setStartPoint(null)
}

