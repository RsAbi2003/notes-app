import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { imageData } = req.body

    if (!imageData) return res.status(400).json({ error: 'No image data provided' })

    const base64Data = imageData.replace(/^data:image\/png;base64,/, '')
    const filename = `${Date.now()}.png`
    const filePath = path.join(process.cwd(), 'public', 'drawings', filename)

    fs.mkdirSync(path.join(process.cwd(), 'public', 'drawings'), { recursive: true })
    fs.writeFileSync(filePath, base64Data, 'base64')

    res.status(200).json({ message: 'Drawing saved', file: `/drawings/${filename}` })
  } else {
    res.status(405).end('Method Not Allowed')
  }
}
