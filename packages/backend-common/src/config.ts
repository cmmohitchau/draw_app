import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.JWT_SECRET);


export const JWT_SECRET = process.env.JWT_SECRET || "12345";
