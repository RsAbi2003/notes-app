import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ token, user: { id: user.id, email: user.email } });
  }

  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true },
      });

      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.status(200).json({ user });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
