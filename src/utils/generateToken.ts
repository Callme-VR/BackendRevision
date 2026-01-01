import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: any) => {
    const payload = { userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "7d" as const });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict"
    })

    return token;
}   