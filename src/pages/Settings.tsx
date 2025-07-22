import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  User, 
  Bell, 
  Settings as SettingsIcon, 
  Link as LinkIcon, 
  BarChart3, 
  Camera, 
  Globe, 
  Moon, 
  Sun, 
  Home,
  Linkedin,
  Mail,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react'

export default function Settings() {
  const { toast } = useToast()
  
  // Profile state
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    role: 'Senior Technical Recruiter',
    email: 'sarah.johnson@company.com',
    avatar: ''
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    candidateUpdates: true,
    weeklySummaries: true,
    aiInsights: false,
    projectInvitations: true
  })

  // User preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
    defaultLanding: 'dashboard'
  })

  // Integration status
  const [integrations, setIntegrations] = useState({
    linkedin: { connected: true, email: 'sarah.johnson@linkedin.com' },
    google: { connected: false, email: '' },
    email: { connected: true, email: 'sarah.johnson@company.com' }
  })

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    })
  }

  const handleNotificationToggle = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications ${value ? 'enabled' : 'disabled'}.`,
    })
  }

  const handleIntegrationToggle = (service: string) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        connected: !prev[service as keyof typeof prev].connected
      }
    }))
    
    const isConnecting = !integrations[service as keyof typeof integrations].connected
    toast({
      title: `${service.charAt(0).toUpperCase() + service.slice(1)} ${isConnecting ? 'Connected' : 'Disconnected'}`,
      description: `Your ${service} account has been ${isConnecting ? 'connected' : 'disconnected'} successfully.`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="kpi" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              KPI Report
            </TabsTrigger>
          </TabsList>

          {/* Profile Section */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} className="w-full md:w-auto">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Section */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">New Candidate Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when candidates update their status or information
                      </p>
                    </div>
                    <Switch
                      checked={notifications.candidateUpdates}
                      onCheckedChange={(checked) => handleNotificationToggle('candidateUpdates', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Weekly Summaries</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly reports on your recruiting activities
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklySummaries}
                      onCheckedChange={(checked) => handleNotificationToggle('weeklySummaries', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">AI-Generated Insights</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when AI generates new insights about candidates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.aiInsights}
                      onCheckedChange={(checked) => handleNotificationToggle('aiInsights', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Shared Project Invitations</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you're invited to collaborate on projects
                      </p>
                    </div>
                    <Switch
                      checked={notifications.projectInvitations}
                      onCheckedChange={(checked) => handleNotificationToggle('projectInvitations', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Section */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>
                  Customize your CANDI experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Language
                    </Label>
                    <Select value={preferences.language} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, language: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {preferences.theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      Theme
                    </Label>
                    <Select value={preferences.theme} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, theme: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Default Landing Page
                    </Label>
                    <Select value={preferences.defaultLanding} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, defaultLanding: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="candidates">Candidates</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                        <SelectItem value="insights">Market Insights</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Section */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  Manage your connected services and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* LinkedIn Integration */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Linkedin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">LinkedIn</h3>
                        <p className="text-sm text-muted-foreground">
                          {integrations.linkedin.connected 
                            ? `Connected as ${integrations.linkedin.email}`
                            : 'Connect your LinkedIn account for enhanced candidate sourcing'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integrations.linkedin.connected ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Disconnected
                        </Badge>
                      )}
                      <Button
                        variant={integrations.linkedin.connected ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleIntegrationToggle('linkedin')}
                      >
                        {integrations.linkedin.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>

                  {/* Google Integration */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Mail className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Google</h3>
                        <p className="text-sm text-muted-foreground">
                          {integrations.google.connected 
                            ? `Connected as ${integrations.google.email}`
                            : 'Connect Google for calendar integration and email sync'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integrations.google.connected ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Disconnected
                        </Badge>
                      )}
                      <Button
                        variant={integrations.google.connected ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleIntegrationToggle('google')}
                      >
                        {integrations.google.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>

                  {/* Email Integration */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm text-muted-foreground">
                          {integrations.email.connected 
                            ? `Connected as ${integrations.email.email}`
                            : 'Connect your email for automated candidate communications'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integrations.email.connected ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Disconnected
                        </Badge>
                      )}
                      <Button
                        variant={integrations.email.connected ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleIntegrationToggle('email')}
                      >
                        {integrations.email.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KPI Report Section */}
          <TabsContent value="kpi" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal KPI Report</CardTitle>
                <CardDescription>
                  Track your recruiting performance and platform activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Projects Created</div>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">47</div>
                    <div className="text-sm text-muted-foreground">Candidates Added</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-muted-foreground">Tasks Completed</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-muted-foreground">Recordings Analyzed</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Added candidate "John Smith" to "Senior Developer" project</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Completed task "Initial screening call" for "Marketing Manager" project</span>
                      <span className="text-xs text-muted-foreground">1 day ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Analyzed interview recording for candidate "Sarah Wilson"</span>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Generate Full Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}