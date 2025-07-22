import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FolderOpen, 
  CheckCircle, 
  Mic, 
  Download,
  Calendar,
  Target,
  Award,
  Activity,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  Edit,
  Upload,
  Clock,
  User
} from 'lucide-react'

interface KPIDetail {
  id: string
  title: string
  project?: string
  timestamp: string
  status: 'success' | 'pending' | 'failed'
}

interface MetricCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  details: KPIDetail[]
  description?: string
}

function MetricCard({ title, value, icon, color, details, description }: MetricCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color }}>{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs text-muted-foreground hover:text-foreground">
              <Eye className="h-3 w-3 mr-1" />
              View Details
              {isOpen ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronRight className="h-3 w-3 ml-1" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {details.map((detail) => (
                <div key={detail.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                  <div className="flex-1">
                    <p className="font-medium truncate">{detail.title}</p>
                    {detail.project && (
                      <p className="text-muted-foreground">{detail.project}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={detail.status === 'success' ? 'default' : detail.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {detail.status}
                    </Badge>
                    <p className="text-muted-foreground mt-1">{detail.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

import blink from '@/blink/client';

export default function PersonalKPI() {
  const [timeRange, setTimeRange] = useState('month');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [kpiData, setKpiData] = useState<any>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser(state.user);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchKpiData = async () => {
      if (!user) return;

      const events = await blink.db.kpi_events.list({ where: { userId: user.id } });

      const tasksCompleted = events.filter(e => e.eventType === 'task_completed').length;
      const candidatesAdded = events.filter(e => e.eventType === 'candidate_added').length;
      const projectsCreated = events.filter(e => e.eventType === 'project_created').length;
      const transcriptsAnalyzed = events.filter(e => e.eventType === 'transcript_analyzed').length;
      const summariesReviewed = events.filter(e => e.eventType === 'summary_reviewed').length;
      const reportsExported = events.filter(e => e.eventType === 'report_exported').length;
      const meetingsRecorded = events.filter(e => e.eventType === 'meeting_recorded').length;

      setKpiData({
        tasksCompleted: { value: tasksCompleted, details: [] },
        candidatesAdded: { value: candidatesAdded, details: [] },
        projectsCreated: { value: projectsCreated, details: [] },
        transcriptsAnalyzed: { value: transcriptsAnalyzed, details: [] },
        summariesReviewed: { value: summariesReviewed, details: [] },
        reportsExported: { value: reportsExported, details: [] },
        meetingsRecorded: { value: meetingsRecorded, details: [] },
      });
    };

    fetchKpiData();
  }, [user, timeRange]);

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setReportGenerated(true)
    
    // Simulate file download
    setTimeout(() => {
      setReportGenerated(false)
    }, 3000)
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'last30': return 'Last 30 Days'
      case 'quarter': return 'This Quarter'
      case 'custom': return 'Custom Range'
      default: return 'This Month'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Personal KPI Report</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span>{user?.role}</span>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{getTimeRangeLabel()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-coral hover:bg-coral/90">
                    <Download className="h-4 w-4" />
                    Generate KPI Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Generate KPI Report</DialogTitle>
                    <DialogDescription>
                      Choose your preferred format and time period for the report export.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Reporting Period</label>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="last30">Last 30 Days</SelectItem>
                          <SelectItem value="quarter">Quarter</SelectItem>
                          <SelectItem value="custom">Custom Date Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Format</label>
                      <Select value={reportFormat} onValueChange={setReportFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="csv">CSV Data Export</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleGenerateReport} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : reportGenerated ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Report Ready!
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Tasks Completed"
            value={kpiData?.tasksCompleted.value}
            icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
            color="#22c55e"
            details={kpiData?.tasksCompleted.details}
            description="Breakdown per project available"
          />
          
          <MetricCard
            title="Candidates Added/Edited"
            value={kpiData?.candidatesAdded.value}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            color="#f67280"
            details={kpiData?.candidatesAdded.details}
            description="New profiles and updates"
          />
          
          <MetricCard
            title="Projects Created"
            value={kpiData?.projectsCreated.value}
            icon={<FolderOpen className="h-4 w-4 text-muted-foreground" />}
            color="#3b82f6"
            details={kpiData?.projectsCreated.details}
            description="New recruitment projects"
          />
          
          <MetricCard
            title="Transcripts Analyzed"
            value={kpiData?.transcriptsAnalyzed.value}
            icon={<Mic className="h-4 w-4 text-muted-foreground" />}
            color="#8b5cf6"
            details={kpiData?.transcriptsAnalyzed.details}
            description="AI-processed interviews"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="AI Summaries Reviewed"
            value={kpiData?.summariesReviewed.value}
            icon={<Edit className="h-4 w-4 text-muted-foreground" />}
            color="#f59e0b"
            details={kpiData?.summariesReviewed.details}
            description="Generated summaries edited"
          />
          
          <MetricCard
            title="Reports Exported"
            value={kpiData?.reportsExported.value}
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            color="#06b6d4"
            details={kpiData?.reportsExported.details}
            description="PDF and CSV exports"
          />
          
          <MetricCard
            title="Meetings Recorded"
            value={kpiData?.meetingsRecorded.value}
            icon={<Upload className="h-4 w-4 text-muted-foreground" />}
            color="#ec4899"
            details={kpiData?.meetingsRecorded.details}
            description="Attached to candidates"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trends
              </CardTitle>
              <CardDescription>Your activity over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tasks Completion Rate</span>
                    <span className="text-sm text-muted-foreground">94%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Candidate Response Rate</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-coral h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Interview-to-Hire Ratio</span>
                    <span className="text-sm text-muted-foreground">35%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI Insights Utilization</span>
                    <span className="text-sm text-muted-foreground">89%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>Your recruiting milestones this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Goal Achiever</div>
                    <div className="text-xs text-muted-foreground">Exceeded monthly targets by 15%</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">New</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-coral/5 rounded-lg border border-coral/20">
                  <div className="p-2 bg-coral/10 rounded-full">
                    <Users className="h-4 w-4 text-coral" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Talent Scout</div>
                    <div className="text-xs text-muted-foreground">Added 40+ high-quality candidates</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Mic className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">AI Expert</div>
                    <div className="text-xs text-muted-foreground">20+ recordings analyzed with insights</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Activity className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Consistent Performer</div>
                    <div className="text-xs text-muted-foreground">15-day activity streak</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity Timeline
            </CardTitle>
            <CardDescription>Your latest actions across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'candidate', action: 'Added candidate "John Smith" to "Senior Frontend Engineer" project', time: '2 hours ago', icon: Users, color: 'text-coral' },
                { type: 'task', action: 'Completed task "Initial screening call" for "Product Manager" project', time: '4 hours ago', icon: CheckCircle, color: 'text-green-600' },
                { type: 'recording', action: 'Analyzed interview recording for candidate "Emily Chen"', time: '1 day ago', icon: Mic, color: 'text-purple-600' },
                { type: 'summary', action: 'Reviewed and edited AI summary for "Data Scientist" project', time: '1 day ago', icon: Edit, color: 'text-orange-600' },
                { type: 'export', action: 'Exported candidate report for "UX Designer" project', time: '2 days ago', icon: Download, color: 'text-blue-600' },
                { type: 'project', action: 'Created new project "Senior Backend Engineer - Remote"', time: '3 days ago', icon: FolderOpen, color: 'text-indigo-600' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-background rounded-full border">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}