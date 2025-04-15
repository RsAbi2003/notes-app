import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Note {
  id: number;
  title: string;
  content: string;
  author: {
    email: string;
  };
  tags: { name: string }[];
}

interface NoteDetailsProps {
  apiUrl: string;
}

const NoteDetails = ({ apiUrl }: NoteDetailsProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch note details when the page loads or ID changes
  useEffect(() => {
    if (id) {
      axios
        .get(`${apiUrl}/notes/${id}`)
        .then((res) => {
          setNote(res.data);
        })
        .catch((err) => {
          setError('Error fetching note');
          console.error(err);
        });
    }
  }, [id, apiUrl]);

  // Handle deleting the note
  const handleDelete = async () => {
    if (id) {
      try {
        await axios.delete(`${apiUrl}/notes/${id}`);
        router.push('/'); // Redirect to the homepage after deletion
      } catch (err) {
        setError('Failed to delete note');
        console.error(err);
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!note) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <p className="mb-4">{note.content}</p>
      <p>
        <strong>Author:</strong> {note.author.email}
      </p>
      <p>
        <strong>Tags:</strong> {note.tags.map((tag) => tag.name).join(', ')}
      </p>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Delete Note
      </button>
    </div>
  );
};

export default NoteDetails;
