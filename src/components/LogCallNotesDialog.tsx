import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import blink from '@/blink/client';
import { Candidate } from '@/features/candidates/types';

interface LogCallNotesDialogProps {
  projectId?: string;
  candidateId?: string;
}

export default function LogCallNotesDialog({ projectId, candidateId }: LogCallNotesDialogProps) {
  const [notes, setNotes] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(candidateId || '');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [previousNotes, setPreviousNotes] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!projectId) return;
      const fetchedCandidates = await blink.db.candidates.list({ where: { projectId } });
      setCandidates(fetchedCandidates);
    };

    if (!candidateId) {
      fetchCandidates();
    }
  }, [projectId, candidateId]);

  useEffect(() => {
    const fetchPreviousNotes = async () => {
      if (!selectedCandidate) return;
      const fetchedNotes = await blink.db.call_notes.list({
        where: { candidate_id: selectedCandidate },
        orderBy: { created_at: 'desc' },
        limit: 3,
      });
      setPreviousNotes(fetchedNotes);
    };

    fetchPreviousNotes();
  }, [selectedCandidate]);

  const handleSubmit = async () => {
    const user = await blink.auth.me();
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to log notes.', variant: 'destructive' });
      return;
    }

    if (!selectedCandidate) {
      toast({ title: 'Error', description: 'Please select a candidate.', variant: 'destructive' });
      return;
    }

    await blink.db.call_notes.create({
      id: `note_${Date.now()}`,
      user_id: user.id,
      project_id: projectId,
      candidate_id: selectedCandidate,
      note: notes,
    });

    toast({ title: 'Success', description: 'Call notes logged.' });
    setNotes('');
    // Refresh previous notes
    const fetchedNotes = await blink.db.call_notes.list({
      where: { candidate_id: selectedCandidate },
      orderBy: { created_at: 'desc' },
      limit: 3,
    });
    setPreviousNotes(fetchedNotes);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Phone className="h-4 w-4 mr-2" />
          Log Call Notes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Call Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!candidateId && (
            <div>
              <Label htmlFor="candidate">Candidate</Label>
              <Select onValueChange={setSelectedCandidate} value={selectedCandidate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((candidate) => (
                    <SelectItem key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} />
          </div>
          {previousNotes.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Previous Notes</h4>
              <div className="space-y-2">
                {previousNotes.map((note) => (
                  <div key={note.id} className="text-sm p-2 bg-gray-100 rounded">
                    <p className="font-mono text-xs text-gray-500">{new Date(note.created_at).toLocaleString()}</p>
                    <p>{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button onClick={handleSubmit}>Log Notes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
