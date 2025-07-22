import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Trash2 } from 'lucide-react';

// Mock data for now
const mockRecordings = [
  {
    id: 1,
    title: 'Screening Call - 2023-10-28',
    transcript: `Interviewer: Thanks for joining, Anh. To start, could you walk me through your experience with high-volume tech recruiting?\n\nAnh Nguyen: Absolutely. At TechCorp, I managed the full-cycle recruitment for our engineering department. On average, I handled 15-20 requisitions simultaneously, from sourcing to closing. My main focus was on senior and principal engineers.\n\nInterviewer: That's impressive. What sourcing channels were most effective for you?\n\nAnh Nguyen: While we used standard job boards, I found the most success with direct sourcing on LinkedIn Recruiter and building a strong referral network. About 60% of my placements came from proactive outreach.\n\nInterviewer: How do you assess candidate fit beyond just technical skills?\n\nAnh Nguyen: I use a mix of behavioral questions and situational scenarios. I try to understand their motivations, how they handle pressure, and what they're looking for in their next role. It's about finding a long-term partner for the company, not just filling a seat.`,
    insights: {
      tone: 'Confident, professional, and articulate. Candidate speaks clearly and provides specific examples to back up her claims.',
      hesitations: 'Slight hesitation when discussing challenges with passive candidates, suggesting this might be an area to probe further. Otherwise, very fluid conversation.',
      strongStatements: 'Emphasized success with proactive sourcing and building referral networks. Clearly articulated her philosophy on finding long-term partners, not just filling seats.',
      redFlags: 'None immediately apparent. The only area for deeper exploration is her experience with niche, hard-to-fill roles beyond standard engineering.',
      behavioralTraits: 'Proactive, results-oriented, strong communicator, relationship-builder.',
      followUpQuestions: [
        'Can you provide an example of a particularly challenging role you had to fill and your strategy for it?',
        'How do you measure the quality of your hires over the long term?',
      ]
    }
  },
  {
    id: 2,
    title: 'Technical Interview - 2023-11-02',
    transcript: `Interviewer: Let's dive into a technical scenario. Imagine you have a role that has been open for 60 days with very few qualified applicants. What steps would you take?\n\nAnh Nguyen: First, I'd partner with the hiring manager to re-evaluate the job description and must-have qualifications. Often, the requirements might be too restrictive. Second, I'd conduct a market analysis to see if our compensation is competitive. Third, I would launch a targeted sourcing campaign, leveraging tools like LinkedIn Recruiter and reaching out to my network for referrals...`,
    insights: {
      tone: 'Analytical, structured, and solution-oriented.',
      hesitations: 'None noted. Candidate was quick to break down the problem and propose a multi-faceted solution.',
      strongStatements: 'Demonstrated a clear, logical process for problem-solving. Showed initiative by suggesting a re-evaluation of the job description.',
      redFlags: 'None. Candidate appears very capable of handling difficult recruiting challenges.',
      behavioralTraits: 'Problem-solver, strategic thinker, data-informed.',
      followUpQuestions: [
        'How would you handle a hiring manager who is resistant to changing the job description?',
      ]
    }
  }
];

const MeetingRecordings = () => {
  const [recordings, setRecordings] = useState(mockRecordings);
  const [activeRecordingId, setActiveRecordingId] = useState(mockRecordings[0].id);
  const [isEditing, setIsEditing] = useState(false);

  const activeRecording = recordings.find(r => r.id === activeRecordingId);

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newRecordings = recordings.map(r => {
      if (r.id === activeRecordingId) {
        return { ...r, transcript: e.target.value };
      }
      return r;
    });
    setRecordings(newRecordings);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-heading text-gray-800">Meeting Recordings & Transcripts</h2>
        <Button variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Upload Recording
        </Button>
      </div>

      <div className="flex space-x-2 mb-6 border-b">
        {recordings.map(rec => (
          <button 
            key={rec.id} 
            onClick={() => setActiveRecordingId(rec.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors duration-200 ${
              activeRecordingId === rec.id 
                ? 'bg-white border-t border-l border-r text-coral' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}>
            {rec.title}
          </button>
        ))}
      </div>

      {activeRecording && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg text-gray-800">Transcript</h3>
              <div className="flex items-center space-x-2">
                <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm">
                  {isEditing ? 'Save Transcript' : 'Edit Transcript'}
                </Button>
                <Button variant="outline" size="sm"><Download className="h-4 w-4" /></Button>
                <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="relative">
              <textarea
                readOnly={!isEditing}
                value={activeRecording.transcript}
                onChange={handleTranscriptChange}
                className={`w-full h-96 p-3 rounded-md bg-gray-50 border ${isEditing ? 'border-coral' : 'border-gray-200'} focus:ring-coral focus:border-coral transition-all duration-200`}
              />
              <div className="text-xs text-gray-500 mt-1">Last edited by KF on 2023-10-29 09:00 AM</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">AI-Synthesized Insights</h3>
            <div className="space-y-4 bg-blue-50/30 p-4 rounded-lg border border-blue-100">
              <div>
                <h4 className="font-semibold text-sm text-gray-700">Tone Analysis</h4>
                <p className="text-sm text-gray-600">{activeRecording.insights.tone}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700">Behavioral Traits</h4>
                <p className="text-sm text-gray-600">{activeRecording.insights.behavioralTraits}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700">Hesitations & Concerns</h4>
                <p className="text-sm text-gray-600">{activeRecording.insights.hesitations}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700">Strong Statements</h4>
                <p className="text-sm text-gray-600">{activeRecording.insights.strongStatements}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700">Potential Red Flags</h4>
                <p className="text-sm text-gray-600">{activeRecording.insights.redFlags}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700">Suggested Follow-up Questions</h4>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  {activeRecording.insights.followUpQuestions.map((q, i) => (
                    <li key={i} className="text-sm text-gray-600">{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRecordings;