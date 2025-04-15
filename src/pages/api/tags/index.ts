import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // ✅ GET: Fetch all tags
    case "GET":
      try {
        const tags = await prisma.tag.findMany({
          include: { notes: true }  // Include related notes
        });

        res.status(200).json(tags);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch tags" });
      }
      break;

    // ✅ POST: Create a new tag
    case "POST":
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Tag name is required" });
      }

      try {
        const newTag = await prisma.tag.create({
          data: { name }
        });

        res.status(201).json(newTag);
      } catch (error) {
        res.status(500).json({ error: "Failed to create tag" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
