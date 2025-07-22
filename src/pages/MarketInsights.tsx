import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts'
import { 
  Download, Filter, TrendingUp, Users, DollarSign, Globe, 
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  MapPin, Calendar, Briefcase, Languages
} from 'lucide-react'

// Mock data for demonstration
const salaryData = [
  { role: 'Software Engineer', location: 'San Francisco', avgSalary: 165000, count: 45 },
  { role: 'Software Engineer', location: 'New York', avgSalary: 155000, count: 38 },
  { role: 'Software Engineer', location: 'Austin', avgSalary: 135000, count: 32 },
  { role: 'Product Manager', location: 'San Francisco', avgSalary: 180000, count: 28 },
  { role: 'Product Manager', location: 'New York', avgSalary: 170000, count: 25 },
  { role: 'Data Scientist', location: 'San Francisco', avgSalary: 175000, count: 22 },
  { role: 'UX Designer', location: 'San Francisco', avgSalary: 145000, count: 18 },
  { role: 'DevOps Engineer', location: 'Seattle', avgSalary: 150000, count: 20 }
]

const experienceData = [
  { industry: 'Technology', avgYears: 5.2, candidates: 156 },
  { industry: 'Finance', avgYears: 7.8, candidates: 89 },
  { industry: 'Healthcare', avgYears: 6.1, candidates: 67 },
  { industry: 'E-commerce', avgYears: 4.9, candidates: 78 },
  { industry: 'Media', avgYears: 5.7, candidates: 45 },
  { industry: 'Education', avgYears: 8.2, candidates: 34 }
]

const industryActivity = [
  { industry: 'Technology', projects: 45, growth: 12 },
  { industry: 'Finance', projects: 28, growth: 8 },
  { industry: 'Healthcare', projects: 22, growth: 15 },
  { industry: 'E-commerce', projects: 19, growth: 22 },
  { industry: 'Media', projects: 15, growth: 5 },
  { industry: 'Education', projects: 12, growth: -3 }
]

const languageData = [
  { language: 'English', demand: 95, projects: 128 },
  { language: 'Spanish', demand: 35, projects: 42 },
  { language: 'Mandarin', demand: 28, projects: 31 },
  { language: 'French', demand: 22, projects: 25 },
  { language: 'German', demand: 18, projects: 20 },
  { language: 'Japanese', demand: 15, projects: 18 }
]

const hiringVelocityData = [
  { month: 'Jan', hires: 45, applications: 320 },
  { month: 'Feb', hires: 52, applications: 380 },
  { month: 'Mar', hires: 48, applications: 350 },
  { month: 'Apr', hires: 61, applications: 420 },
  { month: 'May', hires: 58, applications: 410 },
  { month: 'Jun', hires: 67, applications: 480 }
]

const regionData = [
  { region: 'San Francisco Bay Area', projects: 45, avgSalary: 165000 },
  { region: 'New York Metro', projects: 38, avgSalary: 155000 },
  { region: 'Austin', projects: 25, avgSalary: 135000 },
  { region: 'Seattle', projects: 22, avgSalary: 150000 },
  { region: 'Boston', projects: 18, avgSalary: 145000 },
  { region: 'Los Angeles', projects: 16, avgSalary: 140000 }
]

const COLORS = ['#f67280', '#ff6b6b', '#ffd39f', '#fff3b0', '#c7ceea', '#b5ead7']

export default function MarketInsights() {
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedSeniority, setSelectedSeniority] = useState('all')
  const [chartType, setChartType] = useState('bar')

  const handleExport = (dataType: string) => {
    // Mock export functionality
    console.log(`Exporting ${dataType} data...`)
    // In a real app, this would generate and download a file
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Market Insights</h1>
            <p className="text-foreground/70">Anonymized trends and analytics across all platform projects</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" onClick={() => handleExport('all')}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="sf">San Francisco</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                    <SelectItem value="seattle">Seattle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Seniority</label>
                <Select value={selectedSeniority} onValueChange={setSelectedSeniority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                    <SelectItem value="lead">Lead (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Last 6 months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last month</SelectItem>
                    <SelectItem value="3months">Last 3 months</SelectItem>
                    <SelectItem value="6months">Last 6 months</SelectItem>
                    <SelectItem value="1year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Total Projects</p>
                  <p className="text-2xl font-bold text-foreground">164</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Active Candidates</p>
                  <p className="text-2xl font-bold text-foreground">2,847</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% from last month
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Avg. Salary</p>
                  <p className="text-2xl font-bold text-foreground">$156K</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +5% from last month
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Global Reach</p>
                  <p className="text-2xl font-bold text-foreground">23</p>
                  <p className="text-xs text-foreground/70 mt-1">Countries</p>
                </div>
                <Globe className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Salary Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Average Salaries by Role & Location
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    <LineChartIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('salary')}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'bar' ? (
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Avg Salary']} />
                    <Bar dataKey="avgSalary" fill="#f67280" />
                  </BarChart>
                ) : (
                  <LineChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Avg Salary']} />
                    <Line type="monotone" dataKey="avgSalary" stroke="#f67280" strokeWidth={2} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Industry Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Most Active Industries
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExport('industry')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={industryActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="industry" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="projects" fill="#ff6b6b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Experience & Language Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Experience by Industry */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Average Experience by Industry
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExport('experience')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={experienceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="industry" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} years`, 'Avg Experience']} />
                  <Area type="monotone" dataKey="avgYears" stroke="#ffd39f" fill="#ffd39f" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Language Demand */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Language Requirements
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExport('language')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ language, demand }) => `${language} (${demand}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="demand"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Hiring Velocity & Regional Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hiring Velocity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Hiring Velocity Trends
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExport('velocity')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hiringVelocityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hires" stroke="#f67280" strokeWidth={2} name="Hires" />
                  <Line type="monotone" dataKey="applications" stroke="#ff6b6b" strokeWidth={2} name="Applications" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Regional Heatmap */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Regional Activity
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExport('regional')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div key={region.region} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          backgroundColor: COLORS[index % COLORS.length],
                          opacity: 0.8 
                        }}
                      />
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="secondary">{region.projects} projects</Badge>
                      <span className="text-foreground/70">${region.avgSalary.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Saturation Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Market Saturation & Compensation Benchmarks
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport('benchmarks')}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Location</th>
                    <th className="text-left py-3 px-4 font-medium">Avg Salary</th>
                    <th className="text-left py-3 px-4 font-medium">Candidates</th>
                    <th className="text-left py-3 px-4 font-medium">Market Saturation</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-background/50">
                      <td className="py-3 px-4 font-medium">{item.role}</td>
                      <td className="py-3 px-4">{item.location}</td>
                      <td className="py-3 px-4">${item.avgSalary.toLocaleString()}</td>
                      <td className="py-3 px-4">{item.count}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={item.count > 40 ? 'destructive' : item.count > 25 ? 'default' : 'secondary'}
                        >
                          {item.count > 40 ? 'High' : item.count > 25 ? 'Medium' : 'Low'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}