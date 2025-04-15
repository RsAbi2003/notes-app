import DrawPad from '@/components/drawpad'

export default function DrawPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Create a Drawing</h1>
      <DrawPad />
    </div>
  )
}
