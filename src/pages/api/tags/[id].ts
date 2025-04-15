import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  switch (req.method) {
    // ✅ GET: Fetch a tag by ID
    case "GET":
      try {
        const tag = await prisma.tag.findUnique({
          where: { id: Number(id) },
          include: { notes: true }
        });

        if (!tag) {
          return res.status(404).json({ error: "Tag not found" });
        }

        res.status(200).json(tag);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch tag" });
      }
      break;

    // ✅ PUT: Update a tag by ID
    case "PUT":
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Tag name is required" });
      }

      try {
        const updatedTag = await prisma.tag.update({
          where: { id: Number(id) },
          data: { name }
        });

        res.status(200).json(updatedTag);
      } catch (error) {
        res.status(500).json({ error: "Failed to update tag" });
      }
      break;

    // ✅ DELETE: Remove a tag by ID
    case "DELETE":
      try {
        const tag = await prisma.tag.findUnique({
          where: { id: Number(id) }
        });

        if (!tag) {
          return res.status(404).json({ error: "Tag not found" });
        }

        await prisma.tag.delete({
          where: { id: Number(id) }
        });

        res.status(200).json({ message: `Tag with ID ${id} deleted successfully` });

      } catch (error) {
        res.status(500).json({ error: "Failed to delete tag" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
