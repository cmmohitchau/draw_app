import express, {Request ,  Response } from "express";
import { roomSchema, signinSchema, signupSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import cors from "cors";
import shapeRouter from "./routes/shape.route";


const app = express();

app.use(express.json());
app.use(cors());

app.use("/shape" , shapeRouter);

app.post("/signup" , async(req : Request, res : Response) : Promise<any> => {
    const parsedData = signupSchema.safeParse(req.body);

    if (!parsedData.success || !parsedData.data) {
        return res.status(401).json({
            message: "invalid input"
        });
    }
    console.log("parsed data");
    
    const { email, password, name } = parsedData.data;
    
    
        console.log("after parsed data");

    try {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email
            }
        });
            console.log("after existing user");


        if (existingUser) {
            return res.status(403).json({
                message: "user already exist"
            });
        }
            console.log("user does not exist");

        

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
            console.log("hashed password");

        const newUser = await prismaClient.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });

        
        console.log("before token and after db save");
        
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
                console.log(token);
                
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
    const userId = req.id;
    

    try {
        const room = await prismaClient.room.create({
            data : {
                slug : parsedData.data?.name,
                adminId : userId
            }
        })
        console.log(room);
        
        
    
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
            RoomId : roomId
        },
        take : 50,
    })

    console.log("getting messages from http backend " , messages);
    

    res.json({
        messages
    })
})

app.get("/roomId/:slug" , async (req , res) => {
    const slug = req.params.slug;

    const roomVar = await prismaClient.room.findFirst({
        where : {
            slug
        }
    })

    res.json({
        roomId : roomVar?.id
    })
})



app.listen(3001 , () => {
    console.log("app is runnning on port " , 3001);
    
})