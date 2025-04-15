'use client'

import { useRef, useState } from 'react'

export default function DrawingEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushColor, setBrushColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(4)
  const [snapshots, setSnapshots] = useState<string[]>([])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Save snapshot for undo
    const snapshot = canvas.toDataURL()
    setSnapshots([...snapshots, snapshot])

    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.stroke()
  }

  const endDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const undo = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const lastSnapshot = snapshots.pop()
    if (canvas && ctx && lastSnapshot) {
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = lastSnapshot
      setSnapshots([...snapshots])
    }
  }

  const saveDrawing = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const imageData = canvas.toDataURL('image/png')
    const response = await fetch('/api/drawings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData }),
    })

    if (response.ok) {
      alert('Drawing saved!')
    } else {
      alert('Failed to save drawing.')
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Drawing Editor</h1>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <span>Color:</span>
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
        </label>

        <label className="flex items-center gap-2">
          <span>Brush:</span>
          <input
            type="range"
            min={1}
            max={20}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
          <span>{brushSize}px</span>
        </label>

        <button onClick={clearCanvas} className="bg-red-500 text-white px-3 py-1 rounded">
          Clear
        </button>

        <button onClick={undo} className="bg-yellow-500 text-white px-3 py-1 rounded">
          Undo
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-300 rounded-lg bg-white shadow-md cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />

      <button
        onClick={saveDrawing}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Save Drawing
      </button>
    </div>
  )
}
