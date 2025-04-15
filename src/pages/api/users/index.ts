import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // ✅ Validation: Ensure fields are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // ✅ Check for existing user
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      // ✅ Create a new user
      const newUser = await prisma.user.create({
        data: {
          email,
          password,  // In production, you should hash the password before storing it!
        },
      });

      res.status(201).json(newUser);

    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  }

  // ✅ Get all users
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        include: { notes: true },
      });

      res.status(200).json(users);

    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
