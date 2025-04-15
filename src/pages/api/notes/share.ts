import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { noteId } = req.body;

  if (!noteId || isNaN(Number(noteId))) {
    return res.status(400).json({ error: 'Invalid note ID' });
  }

  try {
    const shareToken = nanoid(10);

    const updatedNote = await prisma.note.update({
      where: { id: Number(noteId) },
      data: { shareToken },
    });

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shared/${shareToken}`;

    return res.status(200).json({ shareUrl });
  } catch (error) {
    console.error('Error sharing note:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
