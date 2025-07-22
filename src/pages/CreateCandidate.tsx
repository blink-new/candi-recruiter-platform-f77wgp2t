import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  User, 
  Linkedin, 
  Brain, 
  AlertCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import CandidateForm from '@/components/candidate/CandidateForm';
import CandidateReviewSummary from '@/components/candidate/CandidateReviewSummary';
import { AIExtractionService } from '@/components/candidate/AIExtractionService';
import blink from '@/blink/client';
import { Candidate, AIExtractionResult } from '@/features/candidates/types';

type ViewState = 'selection' | 'upload' | 'linkedin' | 'processing' | 'review' | 'edit';

const CreateCandidatePage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('selection');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [extractionResult, setExtractionResult] = useState<AIExtractionResult | null>(null);
  const [candidateData, setCandidateData] = useState<Partial<Candidate>>({});
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await blink.auth.me();
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        // Handle not being logged in
      }
    };
    fetchUser();
  }, []);

  const processWithAI = async (extractionPromise: Promise<AIExtractionResult>) => {
    setIsProcessing(true);
    setView('processing');
    setProgress(0);
    setProcessingStep('Initiating AI analysis...');

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 300);

    try {
      const result = await extractionPromise;
      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.data) {
        setProcessingStep('Analysis complete. Preparing summary...');
        setExtractionResult(result);
        setView('review');
      } else {
        throw new Error(result.error || 'Failed to extract data. The document might be unreadable or the profile private.');
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error during AI processing:', error);
      setExtractionResult({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' });
      setView('selection'); // Go back to selection on failure
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    processWithAI(AIExtractionService.extractFromFile(file));
  };

  const handleLinkedInExtraction = () => {
    if (!linkedinUrl.trim()) return;
    processWithAI(AIExtractionService.extractFromLinkedIn(linkedinUrl));
  };

  const handleConfirmCandidate = async () => {
    if (!extractionResult?.data || !userId) return;

    setIsProcessing(true);
    try {
      const newCandidate: Candidate = {
        ...extractionResult.data,
        id: `candi_${Date.now()}`,
        userId,
        status: 'sourced',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await blink.db.candidates.create(newCandidate);
      navigate(`/candidate/${newCandidate.id}`);
    } catch (error) {
      console.error('Error creating candidate:', error);
      alert('Failed to save candidate. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditDetails = () => {
    if (extractionResult?.data) {
      setCandidateData(extractionResult.data);
      setView('edit');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsProcessing(true);
    try {
      const newCandidate: Candidate = {
        ...(candidateData as Omit<Candidate, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>),
        id: `candi_${Date.now()}`,
        userId,
        status: candidateData.status || 'sourced',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await blink.db.candidates.create(newCandidate);
      navigate(`/candidate/${newCandidate.id}`);
    } catch (error) {
      console.error('Error creating candidate manually:', error);
      alert('Failed to save candidate. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetToSelection = () => {
    setView('selection');
    setExtractionResult(null);
    setCandidateData({});
    setLinkedinUrl('');
    setIsProcessing(false);
    setProgress(0);
    setProcessingStep('');
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragActive(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const renderSelectionView = () => (
    <div className="text-center space-y-8">
      <div className="space-y-2">
        <Sparkles className="mx-auto h-10 w-10 text-[#f67280]" />
        <h2 className="text-3xl font-bold">AI-Powered Candidate Creation</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Upload a resume or LinkedIn profile to let our AI extract all relevant information automatically.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card onClick={() => setView('upload')} className="cursor-pointer transition-all hover:shadow-lg hover:border-[#f67280]/50">
          <CardContent className="p-6 text-center space-y-3">
            <FileText className="mx-auto h-10 w-10 text-[#f67280]" />
            <h3 className="text-xl font-semibold">Upload Resume</h3>
            <p className="text-sm text-gray-500">PDF, DOCX, PNG, or JPG</p>
          </CardContent>
        </Card>
        <Card onClick={() => setView('linkedin')} className="cursor-pointer transition-all hover:shadow-lg hover:border-[#f67280]/50">
          <CardContent className="p-6 text-center space-y-3">
            <Linkedin className="mx-auto h-10 w-10 text-[#0077b5]" />
            <h3 className="text-xl font-semibold">LinkedIn Profile</h3>
            <p className="text-sm text-gray-500">Analyze a public profile URL</p>
          </CardContent>
        </Card>
        <Card onClick={() => setView('edit')} className="cursor-pointer transition-all hover:shadow-lg hover:border-gray-400">
          <CardContent className="p-6 text-center space-y-3">
            <User className="mx-auto h-10 w-10 text-gray-600" />
            <h3 className="text-xl font-semibold">Manual Entry</h3>
            <p className="text-sm text-gray-500">Fill out the form yourself</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUploadView = () => (
    <div className="max-w-2xl mx-auto space-y-4">
      <h3 className="text-2xl font-semibold text-center">Upload Resume</h3>
      <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-10 text-center transition-all ${dragActive ? 'border-[#f67280] bg-[#fff9f5]' : 'border-gray-300'}`}>
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h4 className="font-medium">Drop your resume here, or click to browse</h4>
        <p className="text-sm text-gray-500 mt-1">Supports PDF, DOCX, PNG, JPG up to 10MB</p>
        <Button asChild variant="link" className="mt-3 text-[#f67280]"><label htmlFor="resume-upload">Select File</label></Button>
        <input id="resume-upload" type="file" className="hidden" accept=".pdf,.docx,.png,.jpg,.jpeg" onChange={handleFileInputChange} />
      </div>
    </div>
  );

  const renderLinkedInView = () => (
    <div className="max-w-xl mx-auto space-y-4">
      <h3 className="text-2xl font-semibold text-center">LinkedIn Profile Analysis</h3>
      <div className="flex space-x-2">
        <Input placeholder="https://www.linkedin.com/in/username" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
        <Button onClick={handleLinkedInExtraction} disabled={!linkedinUrl.trim() || isProcessing} className="bg-[#f67280] hover:bg-[#f67280]/90">
          <Brain className="h-4 w-4 mr-2" /> Analyze
        </Button>
      </div>
    </div>
  );

  const renderProcessingView = () => (
    <div className="max-w-lg mx-auto text-center space-y-6">
      <Brain className="mx-auto h-12 w-12 text-[#f67280] animate-pulse" />
      <h3 className="text-2xl font-semibold">AI Analysis in Progress...</h3>
      <p className="text-gray-600">{processingStep}</p>
      <Progress value={progress} className="w-full h-2" />
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'selection': return renderSelectionView();
      case 'upload': return renderUploadView();
      case 'linkedin': return renderLinkedInView();
      case 'processing': return renderProcessingView();
      case 'review':
        return extractionResult?.data ? (
          <CandidateReviewSummary
            data={extractionResult.data}
            confidenceScore={extractionResult.confidence_score}
            onConfirm={handleConfirmCandidate}
            onEdit={handleEditDetails}
            onCancel={resetToSelection}
            isLoading={isProcessing}
          />
        ) : null;
      case 'edit':
        return (
          <CandidateForm
            candidateData={candidateData}
            setCandidateData={setCandidateData}
            handleSubmit={handleManualSubmit}
            isReviewMode={false}
          />
        );
      default: return renderSelectionView();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fff9f5]">
      <Navigation />
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-gray-200/80">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-24">
                  {view !== 'selection' && (
                    <Button variant="ghost" onClick={resetToSelection} className="flex items-center space-x-1 text-gray-600">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </Button>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-center flex-grow">Create New Candidate</CardTitle>
                <div className="w-24"></div>
              </div>
              {extractionResult?.error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{extractionResult.error}</AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateCandidatePage;
