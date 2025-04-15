// pages/notes/[id].tsx

import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ShareNoteButton from '@/components/sharenote'
import Layout from '@/components/layout'

interface NotePageProps {
  noteId: string
  noteTitle: string
  noteContent: string
  noteTags: string[]
}

const NotePage: React.FC<NotePageProps> = ({ noteId, noteTitle, noteContent, noteTags }) => {
  const [note, setNote] = useState({ title: noteTitle, content: noteContent, tags: noteTags })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Optional: refetch the note content if needed (client-side logic)
    const fetchNote = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/notes/${noteId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch note')
        }
        const data = await response.json()
        setNote({
          title: data.title,
          content: data.content,
          tags: data.tags,
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Fetch note only when `noteId` is available
    if (noteId) {
      fetchNote()
    }
  }, [noteId])

  if (loading) return <p className="text-center text-gray-500">Loading...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!note) return <p className="text-center text-gray-500">Note not found</p>

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{note.title}</h1>
        <p className="text-gray-700 mb-4">{note.content}</p>
        <div className="text-gray-500 text-sm">Tags: {note.tags?.join(', ')}</div>
        <div className="mt-4">
          <ShareNoteButton noteId={noteId} />
        </div>
        <button
          onClick={() => router.push('/notes')}
          className="mt-4 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition-all"
        >
          Back to Notes
        </button>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }

  try {
    const response = await fetch(`http://localhost:3000/api/notes/${id}`)
    if (!response.ok) {
      return { notFound: true }
    }

    const data = await response.json()

    return {
      props: {
        noteId: id,
        noteTitle: data.title,
        noteContent: data.content,
        noteTags: data.tags ? data.tags.map((tag: any) => tag.name) : [],
      },
    }
  } catch (error) {
    return { notFound: true }
  }
}

export default NotePage
