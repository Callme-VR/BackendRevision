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
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/express.js";

interface JwtPayload {
  id: string;
}

// Read the token from the request
// Check if token is valid
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(401).json({ error: "Not authorized, no token provided" });
        return;
    }

    try {
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ error: "JWT_SECRET not configured" });
            return;
        }

        // Verify token and extract the user Id
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            res.status(401).json({ error: "User no longer exists" });
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Not authorized, token failed" });
    }
};