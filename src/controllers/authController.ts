//  controller is a function that handles a Api from routes and returns a response

import { prisma } from "../config/db.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req: any, res: any) => {
  try {
    console.log("=== Registration request received ===");
    console.log("Request body:", req.body);

    const body = req.body;
    const { name, email, password } = body;

    console.log("Extracted values:", { name, email, password: password ? "exists" : "missing" });

    // Check if user already exists
    const userExisting = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (userExisting) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    const token: string | undefined = generateToken(newUser.id, res);

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ message: "User created successfully", user: userWithoutPassword, token: token });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error", details: (error as Error).message });
  }
};


export const loginUser = async (req: any, res: any) => {
  console.log("=== Login request received ===");
  console.log("Request body:", req.body);
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // verify password with bcrypt


    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // .generatea a token

    const token = generateToken(user.id, res);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error);
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error", details: (error as Error).message });
  }
}


// for the logout user


export const logoutUser = async (req: any, res: any) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      sameSite: "strict"
    })
    res.status(200).json({
      status: "success",
      message: "Logout successful"
    })
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error", details: (error as Error).message });
  }


}