'use client'

import React, { useState } from 'react'

interface ShareNoteButtonProps {
  noteId: string
}

const ShareNoteButton: React.FC<ShareNoteButtonProps> = ({ noteId }) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleShare = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/notes/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId }),
      })

      if (!response.ok) {
        throw new Error('Failed to share note')
      }

      const data = await response.json()
      setShareUrl(data.shareUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleShare}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Sharing...' : 'Share Note'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {shareUrl && (
        <div className="mt-4">
          <p className="font-semibold">Shareable Link:</p>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {shareUrl}
          </a>
        </div>
      )}
    </div>
  )
}

export default ShareNoteButton
