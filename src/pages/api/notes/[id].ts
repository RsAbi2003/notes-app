// pages/api/notes/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validate ID
  const noteId = Number(id);
  if (!id || isNaN(noteId)) {
    return res.status(400).json({ error: 'Invalid note ID' });
  }

  try {
    switch (req.method) {
      // GET /api/notes/:id
      case 'GET': {
        const note = await prisma.note.findUnique({
          where: { id: noteId },
          include: { tags: true },
        });

        if (!note) {
          return res.status(404).json({ error: 'Note not found' });
        }

        return res.status(200).json(note);
      }

      // PUT /api/notes/:id
      case 'PUT': {
        const { title, content, tags } = req.body;

        const updatedNote = await prisma.note.update({
          where: { id: noteId },
          data: {
            title,
            content,
            tags: {
              set: tags?.map((tag: { id: number }) => ({ id: tag.id })) || [],
            },
          },
          include: { tags: true },
        });

        return res.status(200).json(updatedNote);
      }

      // DELETE /api/notes/:id
      case 'DELETE': {
        await prisma.note.delete({
          where: { id: noteId },
        });

        return res.status(200).json({ message: 'Note deleted successfully' });
      }

      // Method Not Allowed
      default: {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      }
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}
