import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

// Mock data for now
const initialNotes = [
  {
    id: 1,
    user: 'KF',
    timestamp: '2023-10-27 10:15 AM',
    content: 'Initial screening call. Candidate seems very knowledgeable about the fintech space. Strong communication skills.',
  },
  {
    id: 2,
    user: 'JD',
    timestamp: '2023-10-28 02:30 PM',
    content: 'Follow-up email sent with project details. They are reviewing and will get back to us by EOD Monday.',
  },
];

interface NotesAndHistoryProps {
  isEditing: boolean;
}

const NotesAndHistory: React.FC<NotesAndHistoryProps> = ({ isEditing }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim() === '') return;

    const note = {
      id: notes.length + 1,
      user: 'ME', // Placeholder for current user
      timestamp: new Date().toLocaleString(),
      content: newNote,
    };

    setNotes([...notes, note]);
    setNewNote('');
  };

  const handleNoteChange = (id: number, content: string) => {
    setNotes(notes.map(note => note.id === id ? { ...note, content } : note));
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold font-serif mb-4">Notes and History</h2>
      <div className="space-y-4 mb-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <span className="font-bold text-sm mr-2">{note.user}</span>
                <span className="text-xs text-gray-500">{note.timestamp}</span>
              </div>
              {isEditing && (
                <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(note.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={note.content}
                onChange={(e) => handleNoteChange(note.id, e.target.value)}
                className="w-full p-1 border border-orange-200 rounded-md bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            ) : (
              <p className="text-gray-800">{note.content}</p>
            )}
          </div>
        ))}
      </div>
      <div>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-coral focus:border-coral"
          rows={3}
        ></textarea>
        <div className="text-right mt-2">
          <Button onClick={handleAddNote} className="bg-coral hover:bg-coral-dark text-white">
            Add Note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotesAndHistory;
