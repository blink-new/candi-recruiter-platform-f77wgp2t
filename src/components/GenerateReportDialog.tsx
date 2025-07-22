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
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import blink from '@/blink/client';
import { Candidate } from '@/features/candidates/types';
import { logKpiEvent } from '@/lib/utils';

interface GenerateReportDialogProps {
  projectId?: string;
}

export default function GenerateReportDialog({ projectId }: GenerateReportDialogProps) {
  const [report, setReport] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!projectId) return;
      const fetchedCandidates = await blink.db.candidates.list({ where: { projectId } });
      setCandidates(fetchedCandidates);
    };

    fetchCandidates();
  }, [projectId]);

  const generateReport = async () => {
    if (selectedCandidates.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one candidate.', variant: 'destructive' });
      return;
    }

    const candidatesToReport = candidates.filter(c => selectedCandidates.includes(c.id));

    const { text: generatedReport } = await blink.ai.generateText({
      prompt: `Generate a concise report for a hiring manager for the following candidates: ${candidatesToReport.map(c => c.name).join(', ')}. Include top three reasons to proceed, any hesitations or concerns, push/pull/stay factors, and next steps.`,
    });

    setReport(generatedReport);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    toast({ title: 'Success', description: 'Report copied to clipboard.' });
    logKpiEvent('report_exported', { projectId, candidateIds: selectedCandidates });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="candidate">Candidate(s)</Label>
            <Select onValueChange={(value) => setSelectedCandidates(value ? [value] : [])}>
              <SelectTrigger>
                <SelectValue placeholder="Select candidate(s)" />
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
          <div>
            <Label htmlFor="report">Report</Label>
            <Textarea id="report" value={report} onChange={(e) => setReport(e.target.value)} rows={10} />
          </div>
          <div className="flex justify-between">
            <Button onClick={generateReport}>Generate with AI</Button>
            <Button onClick={handleCopy}>Copy Email Text</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
