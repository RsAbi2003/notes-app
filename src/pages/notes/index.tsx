import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Layout from '@/components/layout';
import NoteList from '@/components/notelist';

interface Note {
  id: number;
  title: string;
  content: string;
  author: { email: string };
  tags: { name: string }[];
}

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!API_URL) {
      setError('API URL is not defined in environment variables.');
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/notes`)
      .then((res) => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching notes');
        console.error('Error fetching notes:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-100 py-12 px-6">
      <Layout>
        <div className="max-w-4xl mx-auto">
          {/* Clickable animated header */}
          <Link href="/notes">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-8 text-center cursor-pointer relative after:content-[''] after:absolute after:left-1/2 after:transform after:-translate-x-1/2 after:-bottom-2 after:w-0 after:h-[3px] after:bg-indigo-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-2/3">
              All Notes
            </h1>
          </Link>

          {/* Display loading or error messages */}
          {loading && (
            <p className="text-center text-lg text-indigo-600 animate-pulse">
              Loading notes...
            </p>
          )}
          {error && <p className="text-center text-red-500 font-medium">{error}</p>}

          {/* Render NoteList if notes are available */}
          {!loading && !error && (
            <div className="mt-8">
              <NoteList notes={notes} />
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Home;
