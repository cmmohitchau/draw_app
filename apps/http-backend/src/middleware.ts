import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers["authorization"] ?? "";
        

        const decoded = jwt.verify(token, JWT_SECRET);

        if(decoded) {
          //@ts-ignore
          req.userId = decoded.userId;
          
          next();
        } else {
          res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }
        
    } catch (e) {
         res.status(401).json({ message: "Unauthorized: Invalid or expired token" , exception : e } ,
         );
    }
}
