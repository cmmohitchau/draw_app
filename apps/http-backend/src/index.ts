import express from "express";
import { signinSchema, signupSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) : Promise<any> => {
    const body = req.body;
    const parsedData = signupSchema.safeParse(body);

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

        

        const token = jwt.sign({ email }, JWT_SECRET as string);
        
        return res.status(200).json({
            message: "user created success",
            token
        });

    } catch (e) {
        res.status(500).json({
            message: "Error while signup"
        });
    }
});

app.post("/signin" , async (req ,res) : Promise<any>=> {
    const parsedData = signinSchema.safeParse(req.body);

    if(!parsedData || !parsedData.data) {
        return res.status(401).json({
            message  : "incorrect input"
        })
    }
    
    try {
        const existingUser = await prismaClient.user.findUnique({
            where : {
                email : parsedData.data.email
            }
        })
    
        if(existingUser) {
            const match =  bcrypt.compare(parsedData.data.password , existingUser.password);
    
            if(!match) {
                res.status(403).json({
                    message : "authorization failed"
                })
            }
            const email = parsedData.data.email;
            const id = existingUser.id;
    
            const token = jwt.sign({id , email} , JWT_SECRET);
    
            res.status(200).json({
                message : "user signed in successfully",
                token
            })
    
        }
    } catch(e) {
        res.status(500).json({
            message : "error while signin"
        })
    }
})

app.post("/room" , middleware , (req   , res) => {

    const userId = (req as any ).userId;


})

app.listen(3001 , () => {
    console.log("app is runnning on port " , 3001);
    
})