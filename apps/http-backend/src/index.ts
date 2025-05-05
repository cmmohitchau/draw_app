import express, {Request ,  Response } from "express";
import { roomSchema, signinSchema, signupSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CustomRequest } from "@repo/backend-common/types";


const app = express();

app.use(express.json());

app.post("/signup" , async(req : Request, res : Response) : Promise<any> => {
    const parsedData = signupSchema.safeParse(req.body);

    if (!parsedData.success || !parsedData.data) {
        return res.status(401).json({
            message: "invalid input"
        });
    }

    const { email, password, name } = parsedData.data;
    

    try {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(403).json({
                message: "user already exist"
            });
        }
        

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await prismaClient.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });

        
        console.log("before token");
        
        const token = jwt.sign({ userId : newUser.id }, JWT_SECRET as string);
        console.log("after token");

        return res.status(200).json({
            message: "user created success",
            token
        });

    } catch (e) {
        res.status(500).json({
            message: "Error while signup"
        });
    }
})
app.post("/signin" , async (req  ,res) => {
    const parsedData = signinSchema.safeParse(req.body);

    if(!parsedData.success || !parsedData.data) {
         res.status(401).json({
            message  : "incorrect input"
        })
    }
    
    try {
        const existingUser = await prismaClient.user.findUnique({
            where : {
                email : parsedData.data?.email
            }
        })
        
        if(!parsedData.data?.password) {
            return;
        }
        if(existingUser) {
            const match = await bcrypt.compare(parsedData.data?.password, existingUser.password);
    
            if(!match) {
                res.status(403).json({
                    message : "authorization failed"
                })
            }
    
            const token = jwt.sign({userId : existingUser.id} , JWT_SECRET);
    
                res.status(200).json({
                message : "user signed in successfully",
                token
            })
    
        }
        else {
            res.status(404).json({
                message: "user not found"
            });
        }
    } catch(e) {
        res.status(500).json({
            message : "error while signin"
        })
    }
})

app.post("/room" , middleware ,async (req   , res) => {

    const parsedData = roomSchema.safeParse(req.body);

    if(!parsedData.success) {
        res.status(401).json({
            message : "invalid input"
        })
        return;
    } 
    //@ts-ignore
    const userId = req.userId;
    

    try {
        const room = await prismaClient.room.create({
            data : {
                slug : parsedData.data?.name,
                adminId : userId
            }
        })

        
    
        res.status(200).json({
            message : "room created success",
            roomId  : room.id
        })
    } catch(e) {
        res.status(500).json({
            message : "room already exist"
        })
    }


})

app.get("/chat/:roomId" , async (req , res) => {
    const roomId = Number(req.params.roomId);

    const messages = await prismaClient.chat.findMany({
        where : {
            id : roomId
        },
        take : 50,
        orderBy : {id : "desc"}
    })

    res.json({
        messages
    })
})

app.listen(3001 , () => {
    console.log("app is runnning on port " , 3001);
    
})