// what is middleware 
// middleware is a function that runs between the request and the response
// middleware is used to authenticate the user
// middleware is used to validate the data
// middleware is used to log the request
// middleware is used to protect the route
// middleware is used to add a feature to the request
// middleware is used to add a feature to the response
// middleware is used to add a feature to the request and response
// middleware is used to add a feature to the request and response


import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authMiddleware=async(req:any,res:any,next:any)=>{
    try {
        // read the token from the request header
        
        
    } catch (error) {
        
    }
}