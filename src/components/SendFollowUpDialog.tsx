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
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import blink from '@/blink/client';
import { Candidate } from '@/features/candidates/types';
import { logKpiEvent } from '@/lib/utils';

interface SendFollowUpDialogProps {
  projectId?: string;
  candidateId?: string;
}

export default function SendFollowUpDialog({ projectId, candidateId }: SendFollowUpDialogProps) {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [platform, setPlatform] = useState('Email');
  const [selectedCandidate, setSelectedCandidate] = useState(candidateId || '');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
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

  const generateMessage = async () => {
    if (!selectedCandidate) {
      toast({ title: 'Error', description: 'Please select a candidate.', variant: 'destructive' });
      return;
    }

    const candidate = candidates.find(c => c.id === selectedCandidate);
    if (!candidate) return;

    const { text: generatedMessage } = await blink.ai.generateText({
      prompt: `Generate a follow-up message for a candidate named ${candidate.name} who is currently in the ${candidate.status} stage. The message should be for ${platform}.`,
    });

    setMessage(generatedMessage);

    if (platform === 'Email') {
      const { text: generatedSubject } = await blink.ai.generateText({
        prompt: `Generate a subject line for a follow-up email to a candidate named ${candidate.name}.`,
      });
      setSubject(generatedSubject);
    }
  };

  const handleCopy = () => {
    let textToCopy = '';
    if (platform === 'Email') {
      textToCopy = `Subject: ${subject}\n\n${message}`;
    } else {
      textToCopy = message;
    }
    navigator.clipboard.writeText(textToCopy);
    toast({ title: 'Success', description: 'Message copied to clipboard.' });
    logKpiEvent('follow_up_sent', { projectId, candidateId: selectedCandidate, platform });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Mail className="h-4 w-4 mr-2" />
          Send Follow-up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Follow-up</DialogTitle>
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
            <Label htmlFor="platform">Platform</Label>
            <Select onValueChange={setPlatform} value={platform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="LinkedIn InMail">LinkedIn InMail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {platform === 'Email' && (
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Textarea id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} rows={1} />
            </div>
          )}
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} />
          </div>
          <div className="flex justify-between">
            <Button onClick={generateMessage}>Generate with AI</Button>
            <Button onClick={handleCopy}>Copy All</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
