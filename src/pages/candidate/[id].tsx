import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import CandidateNavBar from '@/components/candidate/CandidateNavBar';
import SummaryOverview from '@/components/candidate/SummaryOverview';
import ProfessionalBackground from '@/components/candidate/ProfessionalBackground';
import PerformanceAndMetrics from '@/components/candidate/PerformanceAndMetrics';
import PushPullStayFactors from '@/components/candidate/PushPullStayFactors';
import NotesAndHistory from '@/components/candidate/NotesAndHistory';
import MeetingRecordings from '@/components/candidate/MeetingRecordings';
import AiInterviewScriptGenerator from '@/components/candidate/AiInterviewScriptGenerator';
import TaskList from '@/features/tasks/TaskList';
import ResumeUpload from '@/components/candidate/ResumeUpload';
import blink from '@/blink/client';
import { Candidate } from '@/features/candidates/types';

const CandidateProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (id) {
        const data = await blink.db.candidates.get(id);
        setCandidate(data);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    if (!candidate) return;
    await blink.db.candidates.update(candidate.id, candidate);
    setIsEditing(false);
  };

  if (!candidate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fff9f5] text-[#2e2e2e] font-sans">
      <Navigation />
      <CandidateNavBar 
        projectName={candidate.projectName || 'Project'}
        projectId={candidate.projectId || ''}
        isEditing={isEditing}
        onToggleEdit={handleToggleEdit}
        onSaveChanges={handleSaveChanges}
      />
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold font-heading text-[#2e2e2e]">{candidate.name}</h1>
            <p className="text-lg text-gray-500">
              {candidate.currentJobTitle} at {candidate.currentCompany}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SummaryOverview isEditing={isEditing} candidate={candidate} setCandidate={setCandidate} />
            <ProfessionalBackground isEditing={isEditing} candidate={candidate} setCandidate={setCandidate} />
            <PerformanceAndMetrics isEditing={isEditing} candidate={candidate} setCandidate={setCandidate} />
            <PushPullStayFactors isEditing={isEditing} candidate={candidate} setCandidate={setCandidate} />
            <NotesAndHistory candidateId={candidate.id} />
            <MeetingRecordings candidateId={candidate.id} />
          </div>
          <div className="lg:col-span-1 space-y-8">
            {id && <ResumeUpload candidateId={id} onUploadComplete={setCandidate} />}
            <TaskList candidateId={id} />
            <AiInterviewScriptGenerator candidateId={id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateProfilePage;
