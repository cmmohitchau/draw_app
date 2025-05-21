import { z } from "zod";

export const signupSchema = z.object({
    name : z.string(),
    email : z.string().email(),
    password : z.string().min(4).max(20)
})

export const signinSchema = z.object({
    email : z.string().email(),
    password : z.string().min(4).max(20)

})

export const roomSchema = z.object({
    name : z.string().min(3).max(20)
})