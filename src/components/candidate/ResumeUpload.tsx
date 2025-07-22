import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, File, X } from 'lucide-react';
import blink from '@/blink/client';
import { Candidate } from '@/features/candidates/types';

interface ResumeUploadProps {
  candidateId: string;
  onUploadComplete: (candidate: Candidate) => void;
}

export default function ResumeUpload({ candidateId, onUploadComplete }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const { publicUrl } = await blink.storage.upload(file, `resumes/${candidateId}/${file.name}`);
      const { object: parsedData } = await blink.ai.generateObject({
        prompt: `Extract candidate information from this resume. Prioritize accuracy and fill in as many fields as possible.`,
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            title: { type: 'string' },
            company: { type: 'string' },
            experience: { type: 'string' },
            education: { type: 'string' },
          },
        },
      });

      const candidate = await blink.db.candidates.get(candidateId);
      const updatedCandidate = { ...candidate };

      if (parsedData.name && !updatedCandidate.name) updatedCandidate.name = parsedData.name;
      if (parsedData.title && !updatedCandidate.currentJobTitle) updatedCandidate.currentJobTitle = parsedData.title;
      if (parsedData.company && !updatedCandidate.currentCompany) updatedCandidate.currentCompany = parsedData.company;
      if (parsedData.experience && !updatedCandidate.totalExperience) updatedCandidate.totalExperience = parseInt(parsedData.experience, 10);
      if (parsedData.education && !updatedCandidate.education) updatedCandidate.education = parsedData.education;

      updatedCandidate.resumeUrl = publicUrl;

      await blink.db.candidates.update(candidateId, updatedCandidate);
      onUploadComplete(updatedCandidate);

      toast({ title: 'Success', description: 'Resume uploaded and parsed.' });
      setFile(null);
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({ title: 'Error', description: 'Failed to upload resume.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Resume</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <Label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, DOCX, PNG, JPG</p>
            </div>
            <Input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.png,.jpg" />
          </Label>
        </div>
        {file && (
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-2">
              <File className="h-5 w-5 text-gray-500" />
              <span className="text-sm">{file.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
          {isUploading ? 'Uploading...' : 'Upload and Parse Resume'}
        </Button>
      </div>
    </div>
  );
}
