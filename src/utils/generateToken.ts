import jwt from "jsonwebtoken";
import type { Response } from "express";

interface JwtPayload {
  id: string;
}

export const generateToken = (userId: string, res: Response): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not configured");
    }

    const payload: JwtPayload = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict"
    })

    return token;
}   