import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  switch (req.method) {
    // ✅ GET user by ID
    case "GET":
      try {
        const user = await prisma.user.findUnique({
          where: { id: Number(id) },
          include: { notes: true }
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
      }
      break;

    // ✅ PUT (Update) user by ID
    case "PUT":
      const { email, password } = req.body;

      if (!email && !password) {
        return res.status(400).json({ error: "Email or password required" });
      }

      try {
        const updatedUser = await prisma.user.update({
          where: { id: Number(id) },
          data: {
            email: email || undefined,
            password: password || undefined
          }
        });

        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
      }
      break;

    // ✅ DELETE user by ID with success message
    case "DELETE":
      try {
        const user = await prisma.user.findUnique({
          where: { id: Number(id) }
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        await prisma.user.delete({
          where: { id: Number(id) }
        });

        // ✅ Return success message
        res.status(200).json({ message: `User with ID ${id} deleted successfully` });

      } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
