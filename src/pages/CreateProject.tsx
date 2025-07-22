import { logKpiEvent } from '@/lib/utils';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import blink from '@/blink/client'
import { 
  Upload, 
  X, 
  Plus, 
  Users, 
  MapPin, 
  Building2, 
  FileText, 
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react'

interface ProjectFormData {
  title: string
  location: string
  industries: string[]
  customIndustry: string
  invitedUsers: string[]
  newUserEmail: string
  files: File[]
}

interface ProjectSummary {
  qualifications: string[]
  skills: string[]
  experience: string
  pushFactors: string[]
  pullFactors: string[]
  overview: string
}

const predefinedIndustries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Consulting', 'Media', 'Real Estate', 'Automotive',
  'Energy', 'Telecommunications', 'Aerospace', 'Biotechnology', 'Gaming'
]

export default function CreateProject() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    location: '',
    industries: [],
    customIndustry: '',
    invitedUsers: [],
    newUserEmail: '',
    files: []
  })

  const [projectSummary, setProjectSummary] = useState<ProjectSummary>({
    qualifications: [],
    skills: [],
    experience: '',
    pushFactors: [],
    pullFactors: [],
    overview: ''
  })

  const [editingSummary, setEditingSummary] = useState(false)

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addIndustry = (industry: string) => {
    if (industry && !formData.industries.includes(industry)) {
      handleInputChange('industries', [...formData.industries, industry])
    }
  }

  const removeIndustry = (industry: string) => {
    handleInputChange('industries', formData.industries.filter(i => i !== industry))
  }

  const addCustomIndustry = () => {
    if (formData.customIndustry.trim()) {
      addIndustry(formData.customIndustry.trim())
      handleInputChange('customIndustry', '')
    }
  }

  const addUser = () => {
    if (formData.newUserEmail.trim() && !formData.invitedUsers.includes(formData.newUserEmail.trim())) {
      handleInputChange('invitedUsers', [...formData.invitedUsers, formData.newUserEmail.trim()])
      handleInputChange('newUserEmail', '')
    }
  }

  const removeUser = (email: string) => {
    handleInputChange('invitedUsers', formData.invitedUsers.filter(u => u !== email))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    handleInputChange('files', [...formData.files, ...files])
  }

  const removeFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index)
    handleInputChange('files', newFiles)
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Project title is required", variant: "destructive" })
      return false
    }
    if (!formData.location.trim()) {
      toast({ title: "Error", description: "Location is required", variant: "destructive" })
      return false
    }
    if (formData.industries.length === 0) {
      toast({ title: "Error", description: "At least one industry is required", variant: "destructive" })
      return false
    }
    return true
  }

  const processFilesWithAI = async (): Promise<ProjectSummary> => {
    let combinedContent = `Project: ${formData.title}\nLocation: ${formData.location}\nIndustries: ${formData.industries.join(', ')}\n\n`
    
    // Process uploaded files
    for (const file of formData.files) {
      try {
        setProcessingProgress(prev => prev + 20)
        const text = await blink.data.extractFromBlob(file)
        combinedContent += `\n--- ${file.name} ---\n${text}\n`
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
      }
    }

    setProcessingProgress(60)

    // Generate AI summary
    const { object } = await blink.ai.generateObject({
      prompt: `Analyze this hiring project information and extract key details for a recruiter platform. 

Content to analyze:
${combinedContent}

Please provide a structured analysis with:
1. Core qualifications (education, certifications, must-have requirements)
2. Key skills (technical and soft skills)
3. Experience requirements (years, specific experience types)
4. Push factors (reasons candidates might want to leave current roles)
5. Pull factors (what would attract candidates to this opportunity)
6. Brief overview summary

Be specific and actionable for recruiters.`,
      schema: {
        type: 'object',
        properties: {
          qualifications: {
            type: 'array',
            items: { type: 'string' },
            description: 'Core qualifications and requirements'
          },
          skills: {
            type: 'array',
            items: { type: 'string' },
            description: 'Key technical and soft skills needed'
          },
          experience: {
            type: 'string',
            description: 'Experience requirements and background needed'
          },
          pushFactors: {
            type: 'array',
            items: { type: 'string' },
            description: 'Factors that might motivate candidates to leave current roles'
          },
          pullFactors: {
            type: 'array',
            items: { type: 'string' },
            description: 'Attractive aspects of this opportunity'
          },
          overview: {
            type: 'string',
            description: 'Brief summary of the project and role'
          }
        },
        required: ['qualifications', 'skills', 'experience', 'pushFactors', 'pullFactors', 'overview']
      }
    })

    setProcessingProgress(100)
    return object as ProjectSummary
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsProcessing(true)
    setProcessingProgress(10)
    setStep(2)

    try {
      const summary = await processFilesWithAI()
      setProjectSummary(summary)
      
      const user = await blink.auth.me()
      const projectId = `proj_${Date.now()}`
      
      await blink.db.projects.create({
        id: projectId,
        title: formData.title,
        location: formData.location,
        industries: formData.industries,
        invitedUsers: formData.invitedUsers,
        userId: user.id,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        summary: projectSummary
      })

      logKpiEvent('project_created', { projectId, title: formData.title });

      toast({
        title: "Success!",
        description: "Project brief generated successfully. Review and edit as needed."
      })
      
      setStep(3)
    } catch (error) {
      console.error('Error processing project:', error)
      toast({
        title: "Error",
        description: "Failed to process project. Please try again.",
        variant: "destructive"
      })
      setStep(1)
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const saveProject = async () => {
    try {
      // Save project to database
      const user = await blink.auth.me()
      const projectId = `proj_${Date.now()}`
      
      await blink.db.projects.create({
        id: projectId,
        title: formData.title,
        location: formData.location,
        industries: formData.industries,
        invitedUsers: formData.invitedUsers,
        userId: user.id,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        summary: projectSummary
      })

      toast({
        title: "Project Created!",
        description: `${formData.title} has been created successfully.`
      })

      navigate(`/project/${projectId}`)
    } catch (error) {
      console.error('Error saving project:', error)
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      })
    }
  }

  const updateSummaryField = (field: keyof ProjectSummary, value: any) => {
    setProjectSummary(prev => ({ ...prev, [field]: value }))
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#fff9f5] p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-[#f67280]" />
                Processing Project
              </CardTitle>
              <CardDescription>
                AI is analyzing your files and generating the project brief...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>
              
              <div className="text-center text-sm text-gray-600">
                {processingProgress < 30 && "Extracting content from uploaded files..."}
                {processingProgress >= 30 && processingProgress < 70 && "Analyzing project requirements..."}
                {processingProgress >= 70 && "Generating AI insights and summary..."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#fff9f5] p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2e2e2e] font-['DM_Sans']">Project Brief</h1>
              <p className="text-gray-600">Review and edit the AI-generated project summary</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back to Form
              </Button>
              <Button 
                onClick={editingSummary ? () => setEditingSummary(false) : () => setEditingSummary(true)}
                variant="outline"
              >
                {editingSummary ? 'Done Editing' : 'Edit Summary'}
              </Button>
              <Button onClick={saveProject} className="bg-[#f67280] hover:bg-[#f67280]/90">
                Create Project
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{formData.title}</CardTitle>
              <CardDescription>
                {formData.location} • {formData.industries.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overview */}
              <div>
                <Label className="text-base font-semibold">Project Overview</Label>
                {editingSummary ? (
                  <Textarea
                    value={projectSummary.overview}
                    onChange={(e) => updateSummaryField('overview', e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                ) : (
                  <p className="mt-2 text-gray-700">{projectSummary.overview}</p>
                )}
              </div>

              {/* Core Qualifications */}
              <div>
                <Label className="text-base font-semibold">Core Qualifications</Label>
                {editingSummary ? (
                  <div className="mt-2 space-y-2">
                    {projectSummary.qualifications.map((qual, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={qual}
                          onChange={(e) => {
                            const newQuals = [...projectSummary.qualifications]
                            newQuals[index] = e.target.value
                            updateSummaryField('qualifications', newQuals)
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newQuals = projectSummary.qualifications.filter((_, i) => i !== index)
                            updateSummaryField('qualifications', newQuals)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSummaryField('qualifications', [...projectSummary.qualifications, ''])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Qualification
                    </Button>
                  </div>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {projectSummary.qualifications.map((qual, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        {qual}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Key Skills */}
              <div>
                <Label className="text-base font-semibold">Key Skills</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {projectSummary.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#ffd39f]/20 text-[#2e2e2e]">
                      {skill}
                      {editingSummary && (
                        <button
                          onClick={() => {
                            const newSkills = projectSummary.skills.filter((_, i) => i !== index)
                            updateSummaryField('skills', newSkills)
                          }}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {editingSummary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newSkill = prompt('Enter new skill:')
                        if (newSkill) {
                          updateSummaryField('skills', [...projectSummary.skills, newSkill])
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Experience Requirements */}
              <div>
                <Label className="text-base font-semibold">Experience Requirements</Label>
                {editingSummary ? (
                  <Textarea
                    value={projectSummary.experience}
                    onChange={(e) => updateSummaryField('experience', e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                ) : (
                  <p className="mt-2 text-gray-700">{projectSummary.experience}</p>
                )}
              </div>

              {/* Push/Pull Factors */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-semibold text-red-600">Push Factors</Label>
                  <p className="text-sm text-gray-600 mb-2">Why candidates might leave current roles</p>
                  <ul className="space-y-1">
                    {projectSummary.pushFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className="text-base font-semibold text-green-600">Pull Factors</Label>
                  <p className="text-sm text-gray-600 mb-2">What attracts candidates to this role</p>
                  <ul className="space-y-1">
                    {projectSummary.pullFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-[#2e2e2e] font-['DM_Sans']">Create New Project</h1>
          <p className="text-gray-600">Start a new hiring project with AI-powered insights</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#f67280]" />
              Project Details
            </CardTitle>
            <CardDescription>
              Provide basic information about your hiring project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Senior Frontend Developer - React Team"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA (Remote OK)"
                  className="pl-10"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </div>

            {/* Industries */}
            <div className="space-y-3">
              <Label>Industries *</Label>
              <div className="flex flex-wrap gap-2">
                {predefinedIndustries.map((industry) => (
                  <Button
                    key={industry}
                    variant={formData.industries.includes(industry) ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      formData.industries.includes(industry) 
                        ? removeIndustry(industry)
                        : addIndustry(industry)
                    }
                    className={formData.industries.includes(industry) 
                      ? "bg-[#f67280] hover:bg-[#f67280]/90" 
                      : ""
                    }
                  >
                    {industry}
                  </Button>
                ))}
              </div>
              
              {/* Custom Industry */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom industry..."
                  value={formData.customIndustry}
                  onChange={(e) => handleInputChange('customIndustry', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomIndustry()}
                />
                <Button onClick={addCustomIndustry} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Selected Industries */}
              {formData.industries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.industries.map((industry) => (
                    <Badge key={industry} variant="secondary" className="bg-[#ffd39f]/20">
                      {industry}
                      <button
                        onClick={() => removeIndustry(industry)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              <Label>Invite Team Members</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter email address..."
                    className="pl-10"
                    value={formData.newUserEmail}
                    onChange={(e) => handleInputChange('newUserEmail', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addUser()}
                  />
                </div>
                <Button onClick={addUser} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.invitedUsers.length > 0 && (
                <div className="space-y-2">
                  {formData.invitedUsers.map((email) => (
                    <div key={email} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{email}</span>
                      <Button
                        onClick={() => removeUser(email)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <Label>Upload Documents (Optional)</Label>
              <p className="text-sm text-gray-600">
                Job descriptions, company brochures, or other relevant files
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.md"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>

              {formData.files.length > 0 && (
                <div className="space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        onClick={() => removeFile(index)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#f67280] hover:bg-[#f67280]/90"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Create Project
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
  )
}
