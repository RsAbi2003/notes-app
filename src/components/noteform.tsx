import { useState } from 'react';

interface NoteFormProps {
  initialNote?: {
    title: string;
    content: string;
    tags: string[];
  };
  onSubmit: (noteData: { title: string; content: string; tags: string[] }) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ initialNote, onSubmit }) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [tags, setTags] = useState(initialNote?.tags.join(', ') || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const tagArray = tags.split(',').map((tag) => tag.trim());

    onSubmit({ title, content, tags: tagArray });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Content"
          className="border p-2 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="border p-2 w-full"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Create Note'}
      </button>
    </form>
  );
};

export default NoteForm;
