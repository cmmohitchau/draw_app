import { prismaClient } from '@repo/db/client';
import { Request, Response } from 'express';

export const CreateShapes = async (req: Request, res: Response) => {
    try {
        const user=await prismaClient.user.findFirst({where:{id:req.id}})
        if(!user){
            res.status(400).json({message:"User is not Valid!"})
            return;
        }
        const room=await prismaClient.room.findFirst({where:{slug:req.body.name}})
        if(!room){
            res.status(400).json({message:"Room is not Valid!"})
            return;
        }
        await prismaClient.shape.create({data:{
            RoomId:room?.id,
            userId:user.id,
            type:req.body.type,
            width:req.body.width,
            height:req.body.height,
            pencilPoints:req.body.pencilPoints,
            color:req.body.color,
            x:req.body.x,
            y:req.body.y
        }})
        res.status(201).json({message:"New Message Added!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

export const RoomShapes = async (req: Request, res: Response) => {
    try {
        const user=await prismaClient.user.findFirst({where:{id:req.id}})
        if(!user){
            res.status(400).json({message:"User is not Valid!"})
            return;
        }
        const roomId = req.params.id;
        const room=await prismaClient.room.findFirst({where:{id:Number(roomId)}})
        if(!room){
            res.status(400).json({message:"Room is not Valid!"})
            return;
        }
        const allshapes=await prismaClient.shape.findMany({where:{RoomId:room.id}})
        res.status(200).json({allshapes})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
export const DeleteShape = async (req: Request, res: Response) => {
    try {
        const user=await prismaClient.user.findFirst({where:{id:req.id}})
        if(!user){
            res.status(400).json({message:"User is not Valid!"})
            return;
        }
        const room=await prismaClient.room.findFirst({where:{}})
        if(!room){
            res.status(400).json({message:"Room is not Valid!"})
            return;
        }
        const ShapeId=await prismaClient.shape.findFirst({where:{
            RoomId:room?.id,
            userId:user.id,
            type:req.body.type,
            width:req.body.width,
            height:req.body.height,
            pencilPoints:req.body.pencilPoints,
            x:req.body.x,
            y:req.body.y
        }})
        await prismaClient.shape.delete({
            where: {
                id: Number(ShapeId?.id),
            },
        });
        res.status(200).json({message:"Message is Deleted!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
export const DeleteRoomShape = async (req: Request, res: Response) => {
    try {
        const user=await prismaClient.user.findFirst({where:{id:req.id}})
        if(!user){
            res.status(400).json({message:"User is not Valid!"})
            return;
        }
        const room=await prismaClient.room.findFirst({where:{slug:req.params.id}})
        if(!room){
            res.status(400).json({message:"Room is not Valid!"})
            return;
        }
        const allchats=await prismaClient.shape.deleteMany({where:{RoomId:room.id}})
        res.status(200).json({allchats})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}