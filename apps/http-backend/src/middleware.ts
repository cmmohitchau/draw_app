import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {CustomRequest} from "@repo/backend-common/types";

export function middleware(req : Request, res : Response , next : NextFunction) {

    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token , JWT_SECRET) as JwtPayload;

    if(decoded) {
        (req as any).userId = decoded.userId;
        next()
    }
    res.status(401).json({
        message : "unauthorized "
    })
    
}