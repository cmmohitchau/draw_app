
import { Router } from "express";
import { middleware } from "../middleware";
import { CreateShapes, DeleteRoomShape, DeleteShape, RoomShapes } from "../controllers/shape.controller";

const router : Router  = Router();

router.post("/", middleware, CreateShapes);
router.get("/:id", middleware, RoomShapes);
router.post("/delete", middleware, DeleteShape);
router.delete("/room/:id", middleware, DeleteRoomShape);


export default router;