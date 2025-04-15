// components/notelist.tsx
import Link from 'next/link';

interface Note {
  id: number;
  title: string;
  content: string;
  author: {
    email: string;
  };
  tags: { name: string }[];
}

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div key={note.id} className="border p-4 rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-bold">{note.title}</h2>
          <p className="text-gray-700">{note.content.substring(0, 100)}...</p>
          <p className="text-gray-500">By: {note.author.email}</p>
          <div className="mt-2">
            {note.tags.map((tag) => (
              <span key={tag.name} className="bg-blue-200 text-blue-700 px-2 py-1 rounded mr-2">
                {tag.name}
              </span>
            ))}
          </div>
          <Link href={`/notes/${note.id}`} className="block mt-4 text-blue-500">
            View Note
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
