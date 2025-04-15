import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import NoteForm from '@/components/noteform';
import Layout from '@/components/layout';

const CreateNotePage = () => {
  const router = useRouter();
  const API_URL = 'http://localhost:3000/api/notes';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateNote = async (noteData: { title: string; content: string; tags: string[] }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noteData.title,
          content: noteData.content,
          authorId: 3, // Replace with actual logged-in user ID
          tags: noteData.tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      toast.success('Note created successfully!');
      router.push('/notes');
    } catch (err: any) {
      console.error('Error creating note:', err);
      toast.error(err.message || 'Something went wrong');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Create a New Note
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <NoteForm onSubmit={handleCreateNote} />
          <button
            onClick={() => router.push('/notes')}
            className="w-full mt-4 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition-all"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Cancel'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateNotePage;
