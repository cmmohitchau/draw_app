import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers["authorization"] ?? "";
        

        const decoded = jwt.verify(token as string, JWT_SECRET as string) as {userId : string};

        if(decoded.userId) {
          req.id = decoded.userId;
          
          next();
        } else {
          res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }
        
    } catch (e) {
         res.status(401).json({ message: "Unauthorized: Invalid or expired token" , exception : e } ,
         );
    }
}
