import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import blink from '@/blink/client'
import { Upload, FileAudio, Play, Pause, Download, Copy, Check, AlertTriangle, TrendingUp, TrendingDown, Minus, User, Clock, Volume2, Brain, Flag, Target, MessageSquare, Edit3, Save, X } from 'lucide-react'

interface Project {
  id: string
  title: string
  location: string
  status: string
}

interface Candidate {
  id: string
  name: string
  current_role: string
  company: string
  project_id: string
}

interface TranscriptSegment {
  speaker: string
  text: string
  timestamp: number
  confidence: number
}

interface AIInsights {
  overall_tone: string
  confidence_level: string
  hesitation_markers: string[]
  key_moments: Array<{
    timestamp: number
    description: string
    importance: 'high' | 'medium' | 'low'
  }>
  behavioral_traits: string[]
  strengths: string[]
  concerns: string[]
  flags: Array<{
    type: 'positive' | 'negative' | 'neutral'
    description: string
    timestamp?: number
  }>
  follow_up_questions: string[]
  recommendation: string
}

export default function UploadRecording() {
  const [step, setStep] = useState<'upload' | 'assign' | 'processing' | 'review'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState('')
  const [showNewCandidateForm, setShowNewCandidateForm] = useState(false)
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    current_role: '',
    company: '',
    email: '',
    phone: ''
  })
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTranscript, setEditedTranscript] = useState('')
  const [processing, setProcessing] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Load user and projects
  const loadData = useCallback(async () => {
    try {
      const userData = await blink.auth.me()
      setUser(userData)

      const projectsData = await blink.db.projects.list({
        where: { user_id: userData.id },
        orderBy: { updated_at: 'desc' }
      })
      setProjects(projectsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      })
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Load candidates when project is selected
  const loadCandidates = useCallback(async (projectId: string) => {
    try {
      const candidatesData = await blink.db.candidates.list({
        where: { project_id: projectId },
        orderBy: { name: 'asc' }
      })
      setCandidates(candidatesData)
    } catch (error) {
      console.error('Error loading candidates:', error)
      toast({
        title: "Error",
        description: "Failed to load candidates",
        variant: "destructive"
      })
    }
  }, [toast])

  useEffect(() => {
    if (selectedProject) {
      loadCandidates(selectedProject)
    }
  }, [selectedProject, loadCandidates])

  const handleFileUpload = async (uploadedFile: File) => {
    if (!uploadedFile.type.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, MP4, WAV)",
        variant: "destructive"
      })
      return
    }

    setFile(uploadedFile)
    setStep('assign')

    // Upload file to storage
    try {
      setUploadProgress(10)
      const { publicUrl } = await blink.storage.upload(
        uploadedFile,
        `recordings/${Date.now()}-${uploadedFile.name}`,
        {
          onProgress: (percent) => setUploadProgress(percent)
        }
      )
      setAudioUrl(publicUrl)
      setUploadProgress(100)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload audio file",
        variant: "destructive"
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileUpload(droppedFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileUpload(selectedFile)
    }
  }

  const createNewCandidate = async () => {
    if (!newCandidate.name || !newCandidate.current_role || !selectedProject) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const candidateData = {
        id: `cand_${Date.now()}`,
        user_id: user.id,
        project_id: selectedProject,
        name: newCandidate.name,
        current_role: newCandidate.current_role,
        company: newCandidate.company,
        email: newCandidate.email,
        phone: newCandidate.phone,
        status: 'Sourced',
        likelihood_score: 50,
        created_at: new Date().toISOString()
      }

      await blink.db.candidates.create(candidateData)
      setSelectedCandidate(candidateData.id)
      setShowNewCandidateForm(false)
      setNewCandidate({ name: '', current_role: '', company: '', email: '', phone: '' })
      
      // Reload candidates
      await loadCandidates(selectedProject)
      
      toast({
        title: "Candidate created",
        description: `${newCandidate.name} has been added to the project`
      })
    } catch (error) {
      console.error('Error creating candidate:', error)
      toast({
        title: "Error",
        description: "Failed to create candidate",
        variant: "destructive"
      })
    }
  }

  const startProcessing = async () => {
    if (!selectedProject || !selectedCandidate || !file || !audioUrl) {
      toast({
        title: "Missing information",
        description: "Please select a project and candidate",
        variant: "destructive"
      })
      return
    }

    setStep('processing')
    setProcessing(true)

    try {
      // Simulate AI processing with realistic transcript and insights
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock transcript data
      const mockTranscript: TranscriptSegment[] = [
        {
          speaker: "Interviewer",
          text: "Thank you for taking the time to speak with us today. Could you start by telling me about your current role and what you enjoy most about it?",
          timestamp: 0,
          confidence: 0.95
        },
        {
          speaker: "Candidate",
          text: "Of course! I'm currently a Senior Software Engineer at TechCorp, where I've been for about three years. What I really enjoy is the collaborative environment and the opportunity to work on challenging problems that impact millions of users.",
          timestamp: 15,
          confidence: 0.92
        },
        {
          speaker: "Interviewer",
          text: "That sounds great. What would you say are some of the biggest challenges you're facing in your current position?",
          timestamp: 35,
          confidence: 0.94
        },
        {
          speaker: "Candidate",
          text: "Well, honestly, I think the main challenge is... um... the lack of growth opportunities. I've been in the same role for a while now, and while I love the technical work, I'm looking for more leadership responsibilities and the chance to mentor junior developers.",
          timestamp: 50,
          confidence: 0.88
        },
        {
          speaker: "Interviewer",
          text: "I understand. What attracts you to this particular opportunity with our company?",
          timestamp: 75,
          confidence: 0.96
        },
        {
          speaker: "Candidate",
          text: "I'm really excited about your company's mission and the innovative projects you're working on. The role seems to offer exactly the kind of leadership opportunities I'm looking for, plus the chance to work with cutting-edge technology.",
          timestamp: 85,
          confidence: 0.93
        }
      ]

      // Mock AI insights
      const mockInsights: AIInsights = {
        overall_tone: "Professional and enthusiastic",
        confidence_level: "High confidence with occasional hesitation",
        hesitation_markers: ["um", "honestly", "I think"],
        key_moments: [
          {
            timestamp: 50,
            description: "Candidate expressed frustration with lack of growth opportunities",
            importance: "high"
          },
          {
            timestamp: 85,
            description: "Strong enthusiasm for company mission and role",
            importance: "high"
          }
        ],
        behavioral_traits: ["Collaborative", "Growth-oriented", "Technical expertise", "Leadership aspirations"],
        strengths: [
          "Clear communication skills",
          "Strong technical background",
          "Desire for professional growth",
          "Team-oriented mindset"
        ],
        concerns: [
          "May be seeking rapid advancement",
          "Current role dissatisfaction could indicate pattern"
        ],
        flags: [
          {
            type: "positive",
            description: "Strong alignment with company values",
            timestamp: 85
          },
          {
            type: "neutral",
            description: "Seeking growth opportunities - ensure role can provide this",
            timestamp: 50
          }
        ],
        follow_up_questions: [
          "What specific leadership responsibilities are you most interested in?",
          "How do you handle situations when growth opportunities are limited?",
          "Can you describe a time when you mentored a junior developer?"
        ],
        recommendation: "Strong candidate with clear motivation for change. Recommend proceeding to next round with focus on leadership potential and growth trajectory."
      }

      setTranscript(mockTranscript)
      setAiInsights(mockInsights)
      setEditedTranscript(mockTranscript.map(segment => `${segment.speaker}: ${segment.text}`).join('\n\n'))
      setProcessing(false)
      setStep('review')

      toast({
        title: "Processing complete",
        description: "Audio has been transcribed and analyzed"
      })
    } catch (error) {
      console.error('Error processing audio:', error)
      setProcessing(false)
      toast({
        title: "Processing failed",
        description: "Failed to process audio file",
        variant: "destructive"
      })
    }
  }

  const saveRecording = async () => {
    if (!selectedCandidate || !file || !transcript || !aiInsights) return

    try {
      const recordingData = {
        id: `rec_${Date.now()}`,
        user_id: user.id,
        project_id: selectedProject,
        candidate_id: selectedCandidate,
        file_name: file.name,
        file_url: audioUrl,
        file_size: file.size,
        duration: duration,
        transcript: JSON.stringify(transcript),
        ai_insights: JSON.stringify(aiInsights),
        tone_analysis: aiInsights.overall_tone,
        confidence_score: transcript.reduce((acc, seg) => acc + seg.confidence, 0) / transcript.length,
        key_moments: JSON.stringify(aiInsights.key_moments),
        flags: JSON.stringify(aiInsights.flags),
        status: 'completed',
        created_at: new Date().toISOString()
      }

      await blink.db.interview_recordings.create(recordingData)

      toast({
        title: "Recording saved",
        description: "Interview recording has been saved to candidate profile"
      })

      navigate(`/candidate/${selectedCandidate}`)
    } catch (error) {
      console.error('Error saving recording:', error)
      toast({
        title: "Error",
        description: "Failed to save recording",
        variant: "destructive"
      })
    }
  }

  const copyTranscript = () => {
    navigator.clipboard.writeText(editedTranscript)
    toast({
      title: "Copied",
      description: "Transcript copied to clipboard"
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.8) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Upload Recording</h1>
          <p className="text-foreground/70">Upload and analyze interview audio files with AI-powered transcription and insights</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {['upload', 'assign', 'processing', 'review'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName ? 'bg-coral text-white' :
                  ['upload', 'assign', 'processing', 'review'].indexOf(step) > index ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {['upload', 'assign', 'processing', 'review'].indexOf(step) > index ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    ['upload', 'assign', 'processing', 'review'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-foreground/60">
            <span>Upload File</span>
            <span>Assign to Project</span>
            <span>AI Processing</span>
            <span>Review & Save</span>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Audio File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-coral transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <FileAudio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Drop your audio file here</h3>
                <p className="text-foreground/60 mb-4">or click to browse</p>
                <p className="text-sm text-foreground/50">Supports MP3, MP4, WAV files up to 100MB</p>
                <input
                  id="file-input"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-foreground/60 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Assign */}
        {step === 'assign' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>File Uploaded Successfully</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <FileAudio className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">{file?.name}</p>
                    <p className="text-sm text-green-600">{file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assign to Project & Candidate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project">Select Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title} - {project.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProject && (
                  <div>
                    <Label htmlFor="candidate">Select Candidate</Label>
                    <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        {candidates.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            {candidate.name} - {candidate.current_role} at {candidate.company}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Create New Candidate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedCandidate === 'new' && (
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Create New Candidate</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={newCandidate.name}
                            onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Current Role *</Label>
                          <Input
                            id="role"
                            value={newCandidate.current_role}
                            onChange={(e) => setNewCandidate(prev => ({ ...prev, current_role: e.target.value }))}
                            placeholder="Senior Software Engineer"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={newCandidate.company}
                            onChange={(e) => setNewCandidate(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="TechCorp Inc."
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newCandidate.email}
                            onChange={(e) => setNewCandidate(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newCandidate.phone}
                          onChange={(e) => setNewCandidate(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <Button onClick={createNewCandidate} className="w-full">
                        Create Candidate
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  onClick={startProcessing} 
                  disabled={!selectedProject || !selectedCandidate || selectedCandidate === 'new'}
                  className="w-full"
                >
                  Start AI Processing
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 animate-pulse" />
                AI Processing in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-lg font-medium text-foreground mb-2">Analyzing your interview recording</h3>
              <p className="text-foreground/60 mb-6">Our AI is transcribing the audio and generating insights...</p>
              <div className="space-y-2 text-sm text-foreground/50">
                <p>✓ Audio uploaded and validated</p>
                <p>✓ Speaker identification in progress</p>
                <p>✓ Transcription with punctuation</p>
                <p>✓ Behavioral analysis and insights</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 'review' && transcript.length > 0 && aiInsights && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transcript Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Interview Transcript
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      {isEditing ? 'Save' : 'Edit'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyTranscript}>
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedTranscript}
                    onChange={(e) => setEditedTranscript(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Edit transcript here..."
                  />
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {transcript.map((segment, index) => (
                      <div key={index} className="border-l-4 border-gray-200 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-coral">
                            {segment.speaker}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-foreground/50">
                            <Clock className="w-3 h-3" />
                            {formatTime(segment.timestamp)}
                            <span className={`${getConfidenceColor(segment.confidence)}`}>
                              {Math.round(segment.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-foreground/80 text-sm leading-relaxed">
                          {segment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Insights Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Analysis & Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Assessment */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Overall Assessment</h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">{aiInsights.recommendation}</p>
                  </div>
                </div>

                {/* Tone & Confidence */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Tone</h4>
                    <Badge variant="secondary">{aiInsights.overall_tone}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Confidence</h4>
                    <Badge variant="secondary">{aiInsights.confidence_level}</Badge>
                  </div>
                </div>

                {/* Key Moments */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key Moments</h4>
                  <div className="space-y-2">
                    {aiInsights.key_moments.map((moment, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <Target className={`w-4 h-4 mt-0.5 ${
                          moment.importance === 'high' ? 'text-red-500' :
                          moment.importance === 'medium' ? 'text-yellow-500' :
                          'text-gray-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground/80">{moment.description}</p>
                          <p className="text-xs text-foreground/50">{formatTime(moment.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Concerns */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Strengths</h4>
                    <div className="space-y-1">
                      {aiInsights.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-sm text-foreground/80">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Concerns</h4>
                    <div className="space-y-1">
                      {aiInsights.concerns.map((concern, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-600" />
                          <span className="text-sm text-foreground/80">{concern}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Flags */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Flags</h4>
                  <div className="space-y-2">
                    {aiInsights.flags.map((flag, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        {getFlagIcon(flag.type)}
                        <div className="flex-1">
                          <p className="text-sm text-foreground/80">{flag.description}</p>
                          {flag.timestamp && (
                            <p className="text-xs text-foreground/50">{formatTime(flag.timestamp)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow-up Questions */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Suggested Follow-up Questions</h4>
                  <div className="space-y-1">
                    {aiInsights.follow_up_questions.map((question, index) => (
                      <div key={index} className="text-sm text-foreground/80 p-2 bg-yellow-50 rounded">
                        {question}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={saveRecording} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save to Candidate Profile
                  </Button>
                  <Button variant="outline" onClick={() => setStep('assign')}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}