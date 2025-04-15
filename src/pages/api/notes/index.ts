import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return await getNotes(req, res);
  } else if (req.method === "POST") {
    return await createNote(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// 🟢 GET: Fetch all notes
async function getNotes(req: NextApiRequest, res: NextApiResponse) {
  try {
    const notes = await prisma.note.findMany({
      include: {
        tags: true, // Include associated tags
        author: { select: { id: true, email: true } }, // Include author details
      },
    });

    return res.status(200).json(notes);
  } catch (error) {
    console.error("🚨 Error fetching notes:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}

// 🔹 POST: Create a new note
async function createNote(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, content, authorId, tags } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({ error: "Title, content, and authorId are required" });
    }

    // 🔍 Ensure the author exists
    const existingUser = await prisma.user.findUnique({ where: { id: authorId } });
    if (!existingUser) {
      return res.status(400).json({ error: "Author not found" });
    }

    // 🔹 Ensure all tags exist before connecting
    const tagObjects = await Promise.all(
      (tags || []).map(async (tag: string) => {
        const existingTag = await prisma.tag.findUnique({ where: { name: tag } });
        return existingTag || (await prisma.tag.create({ data: { name: tag } }));
      })
    );

    // 📝 Create the note
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        authorId,
        tags: { connect: tagObjects.map((tag) => ({ id: tag.id })) },
      },
    });

    return res.status(201).json(newNote);
  } catch (error) {
    console.error("🚨 Error creating note:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
