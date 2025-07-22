import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  MapPin, 
  Building2, 
  Users, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Save, 
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Clock,
  Target,
  Briefcase,
  Globe,
  Star,
  AlertCircle,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import TaskList from '@/features/tasks/TaskList';
import SendFollowUpDialog from '@/components/SendFollowUpDialog';
import LogCallNotesDialog from '@/components/LogCallNotesDialog';
import GenerateReportDialog from '@/components/GenerateReportDialog';
import { Candidate } from '@/features/candidates/types';
import { logKpiEvent } from '@/lib/utils';
import blink from '@/blink/client';

// Mock data for the project
const mockProject = {
  id: '1',
  title: 'Senior Frontend Engineer - FinTech',
  location: 'San Francisco, CA',
  industry: 'Financial Technology',
  status: 'open',
  assignedUsers: [
    { id: '1', name: 'Sarah Chen', avatar: '', initials: 'SC', role: 'Lead Recruiter' },
    { id: '2', name: 'Mike Rodriguez', avatar: '', initials: 'MR', role: 'Hiring Manager' }
  ],
  summary: {
    qualifications: "Bachelor's degree in Computer Science or related field, 5+ years of React/TypeScript experience, strong understanding of modern frontend architecture and state management",
    industry: 'Financial Technology, Banking, or related fintech experience preferred. Understanding of financial regulations and compliance is a plus',
    languages: 'English (native level required), Spanish (conversational preferred for client interactions)',
    experience: '5-8 years of frontend development experience with leadership potential',
    pushFactors: [
      'Limited growth opportunities in current role',
      'Outdated technology stack and legacy systems',
      'Poor work-life balance and long hours',
      'Lack of learning and development budget'
    ],
    pullFactors: [
      'Cutting-edge technology and modern stack',
      'Competitive compensation package ($150k-$200k)',
      'Remote-first culture with flexible hours',
      'Equity package and stock options',
      'Strong learning and development opportunities',
      'Collaborative team environment'
    ],
    stayFactors: [
      'Strong relationships with current team',
      'Upcoming promotion or raise expected',
      'Comfortable with current responsibilities',
      'Good benefits package at current company'
    ]
  },
  createdAt: '2024-01-15',
  lastUpdated: '2024-01-19'
}

const mockTasks = [
  { 
    id: '1', 
    title: 'Define job requirements and ideal candidate profile', 
    completed: true, 
    locked: false,
    description: 'Create detailed job description, define must-have vs nice-to-have skills',
    dueDate: '2024-01-16'
  },
  { 
    id: '2', 
    title: 'Source initial candidate pool (20-30 candidates)', 
    completed: true, 
    locked: false,
    description: 'Use LinkedIn, GitHub, and other platforms to identify potential candidates',
    dueDate: '2024-01-18'
  },
  { 
    id: '3', 
    title: 'Screen and qualify candidates (phone/video)', 
    completed: false, 
    locked: false,
    description: 'Conduct initial screening calls to assess basic fit and interest',
    dueDate: '2024-01-22'
  },
  { 
    id: '4', 
    title: 'Conduct technical interviews', 
    completed: false, 
    locked: true,
    description: 'Technical assessment and coding challenges with engineering team',
    dueDate: '2024-01-25'
  },
  { 
    id: '5', 
    title: 'Final interviews with hiring manager', 
    completed: false, 
    locked: true,
    description: 'Cultural fit and leadership potential assessment',
    dueDate: '2024-01-29'
  },
  { 
    id: '6', 
    title: 'Reference checks and offer preparation', 
    completed: false, 
    locked: true,
    description: 'Verify background and prepare competitive offer package',
    dueDate: '2024-02-01'
  }
]



const mockInsights = {
  pushTrends: [
    { factor: 'Limited growth opportunities', count: 8, percentage: 67 },
    { factor: 'Outdated technology stack', count: 6, percentage: 50 },
    { factor: 'Poor work-life balance', count: 5, percentage: 42 },
    { factor: 'Lack of learning budget', count: 4, percentage: 33 }
  ],
  pullTrends: [
    { factor: 'Competitive compensation', count: 10, percentage: 83 },
    { factor: 'Remote work flexibility', count: 9, percentage: 75 },
    { factor: 'Modern tech stack', count: 7, percentage: 58 },
    { factor: 'Equity opportunities', count: 6, percentage: 50 }
  ],
  stayTrends: [
    { factor: 'Current team relationships', count: 6, percentage: 50 },
    { factor: 'Upcoming promotion/raise', count: 4, percentage: 33 },
    { factor: 'Comfortable current role', count: 3, percentage: 25 },
    { factor: 'Good benefits package', count: 2, percentage: 17 }
  ]
}

import { Task } from '@/features/tasks/types';
import { Candidate } from '@/features/candidates/types';

export default function ProjectWorkspace() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(mockProject)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.title);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser(state.user);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!projectId) return;
      const fetchedCandidates = await blink.db.candidates.list({ where: { projectId } });
      setCandidates(fetchedCandidates);
    };

    fetchCandidates();
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interviewing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Interested': return 'bg-green-100 text-green-800 border-green-200'
      case 'Follow-Up': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Messaged': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Sourced': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Unsure': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLikelihoodColor = (likelihood: number) => {
    if (likelihood >= 70) return 'text-green-600'
    if (likelihood >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getLikelihoodIcon = (likelihood: number) => {
    if (likelihood >= 70) return <Star className="h-3 w-3 fill-current" />
    if (likelihood >= 50) return <AlertCircle className="h-3 w-3" />
    return <Circle className="h-3 w-3" />
  }

  const completedTasks = tasks.filter(task => task.status === 'Complete').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-foreground/60">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="p-0 h-auto font-normal"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Projects
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{project.title}</span>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-3xl font-heading font-bold border-none p-0 h-auto bg-transparent"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    setProject(prev => ({ ...prev, title: editedTitle }))
                    setIsEditingTitle(false)
                  }}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditedTitle(project.title)
                    setIsEditingTitle(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-heading font-bold text-foreground">{project.title}</h1>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Clock className="h-3 w-3 mr-1" />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>

          {/* Project Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
              <MapPin className="h-4 w-4 text-coral flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-xs text-foreground/60">Location</Label>
                <Input
                  value={project.location}
                  onChange={(e) => setProject(prev => ({ ...prev, location: e.target.value }))}
                  className="border-none p-0 h-auto bg-transparent font-medium"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
              <Building2 className="h-4 w-4 text-coral flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-xs text-foreground/60">Industry</Label>
                <Input
                  value={project.industry}
                  onChange={(e) => setProject(prev => ({ ...prev, industry: e.target.value }))}
                  className="border-none p-0 h-auto bg-transparent font-medium"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
              <Users className="h-4 w-4 text-coral flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-xs text-foreground/60">Team Members</Label>
                <div className="flex items-center gap-1 mt-1">
                  {project.assignedUsers.map(user => (
                    <Avatar key={user.id} className="h-6 w-6">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                  <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Email</Label>
                          <Input placeholder="colleague@company.com" />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="recruiter">Recruiter</SelectItem>
                              <SelectItem value="hiring-manager">Hiring Manager</SelectItem>
                              <SelectItem value="interviewer">Interviewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">Add Member</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
              <Target className="h-4 w-4 text-coral flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-xs text-foreground/60">Status</Label>
                <Select value={project.status} onValueChange={(value) => setProject(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="border-none p-0 h-auto bg-transparent font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Project Progress</span>
              <span className="text-sm text-foreground/60">{completedTasks}/{totalTasks} tasks completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-coral h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Summary and Candidates */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Project Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-coral" />
                  AI Project Summary
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingSummary(!isEditingSummary)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-coral" />
                    <h4 className="font-semibold">Required Qualifications</h4>
                  </div>
                  {isEditingSummary ? (
                    <Textarea
                      value={project.summary.qualifications}
                      onChange={(e) => setProject(prev => ({
                        ...prev,
                        summary: { ...prev.summary, qualifications: e.target.value }
                      }))}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="text-sm text-foreground/70 leading-relaxed">{project.summary.qualifications}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-coral" />
                      <h4 className="font-semibold">Industry Experience</h4>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">{project.summary.industry}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-coral" />
                      <h4 className="font-semibold">Language Requirements</h4>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">{project.summary.languages}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-coral" />
                    <h4 className="font-semibold">Experience Level</h4>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">{project.summary.experience}</p>
                </div>


              </CardContent>
            </Card>



            {/* Candidate Grid */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-coral" />
                  Project Candidates
                  <Badge variant="outline">{candidates.length}</Badge>
                </CardTitle>
                <Button size="sm" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Candidate
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {candidates.map(candidate => (
                    <div
                      key={candidate.id}
                      className="p-4 border rounded-lg bg-white hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => navigate(`/candidate/${candidate.id}`)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className="bg-coral/10 text-coral font-semibold">
                            {candidate.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold truncate group-hover:text-coral transition-colors">
                              {candidate.name}
                            </h4>
                            <div className="flex items-center gap-1 text-sm">
                              {getLikelihoodIcon(candidate.likelihood)}
                              <span className={`font-medium ${getLikelihoodColor(candidate.likelihood)}`}>
                                {candidate.likelihood}%
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-foreground/70 truncate">{candidate.title}</p>
                          <p className="text-sm text-foreground/50 truncate mb-2">{candidate.company}</p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getStatusColor(candidate.status)} variant="outline">
                              {candidate.status}
                            </Badge>
                            <span className="text-xs text-foreground/50">
                              {candidate.experience} exp
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {candidate.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {candidate.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-foreground/50">
                            <span>{candidate.location}</span>
                            <span>Last contact: {new Date(candidate.lastContact).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Task List */}
          <div className="space-y-6">
            <TaskList projectId={projectId} onTasksChange={setTasks} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => navigate('/calendar')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interviews
                </Button>
                <SendFollowUpDialog projectId={projectId} />
                <LogCallNotesDialog projectId={projectId} />
                <GenerateReportDialog projectId={projectId} />

              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}