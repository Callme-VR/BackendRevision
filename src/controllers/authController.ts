//  controller is a function that handles a Api from routes and returns a response

import { prisma } from "../config/db.js";
import bcrypt from 'bcrypt';

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

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
    
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error", details: (error as Error).message });
  }
};