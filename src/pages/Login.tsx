import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Linkedin, 
  Mail, 
  Eye, 
  EyeOff,
  CheckCircle,
  Users,
  FolderOpen
} from 'lucide-react'
import blink from '@/blink/client'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [linkedinImport, setLinkedinImport] = useState(false)
  const [showImportOptions, setShowImportOptions] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: ''
  })
  
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // For demo purposes, we'll simulate login
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to CANDI.",
        })
        navigate('/dashboard')
      } else {
        // For demo purposes, we'll simulate signup
        toast({
          title: "Account created!",
          description: "Welcome to CANDI. Let's get started.",
        })
        navigate('/dashboard')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLinkedInAuth = () => {
    setShowImportOptions(true)
    toast({
      title: "LinkedIn Connected",
      description: "Successfully connected to LinkedIn. Choose what to import.",
    })
  }

  const handleImportComplete = () => {
    toast({
      title: "Import Complete",
      description: "Successfully imported your LinkedIn data.",
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-foreground/70 hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-coral to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-2xl font-heading font-bold text-foreground">CANDI</span>
          </div>
          
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-foreground/70">
            {isLogin 
              ? 'Sign in to access your recruiting dashboard' 
              : 'Join thousands of recruiters using CANDI'
            }
          </p>
        </div>

        {/* LinkedIn Import Modal */}
        {showImportOptions && (
          <Card className="mb-6 border-peach/30 bg-peach/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Linkedin className="h-5 w-5 text-blue-600 mr-2" />
                Import from LinkedIn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="import-projects" 
                    defaultChecked 
                    className="border-coral data-[state=checked]:bg-coral"
                  />
                  <div className="flex-1">
                    <Label htmlFor="import-projects" className="text-sm font-medium">
                      Import existing projects
                    </Label>
                    <p className="text-xs text-foreground/60">
                      Bring over your current recruiting projects and job postings
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-coral/10 text-coral">
                    <FolderOpen className="h-3 w-3 mr-1" />
                    12 found
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="import-candidates" 
                    defaultChecked 
                    className="border-coral data-[state=checked]:bg-coral"
                  />
                  <div className="flex-1">
                    <Label htmlFor="import-candidates" className="text-sm font-medium">
                      Import candidate folders
                    </Label>
                    <p className="text-xs text-foreground/60">
                      Import your saved candidates and their information
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-coral/10 text-coral">
                    <Users className="h-3 w-3 mr-1" />
                    247 found
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  onClick={handleImportComplete}
                  className="flex-1 bg-coral hover:bg-coral-dark text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Import Selected
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="border-coral text-coral hover:bg-coral hover:text-white"
                >
                  Skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Login/Signup Card */}
        <Card className="card-gradient border-0 shadow-xl">
          <CardContent className="p-6">
            {/* LinkedIn Login */}
            <Button 
              onClick={handleLinkedInAuth}
              variant="outline" 
              className="w-full mb-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              disabled={loading}
            >
              <Linkedin className="h-4 w-4 mr-2" />
              Continue with LinkedIn
            </Button>
            
            <div className="relative mb-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-foreground/60">
                or continue with email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required={!isLogin}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-foreground/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-foreground/60" />
                    )}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    required 
                    className="border-coral data-[state=checked]:bg-coral"
                  />
                  <Label htmlFor="terms" className="text-sm text-foreground/70">
                    I agree to the{' '}
                    <a href="#" className="text-coral hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-coral hover:underline">Privacy Policy</a>
                  </Label>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-coral hover:bg-coral-dark text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center mt-6">
              <p className="text-sm text-foreground/70">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                {' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-coral hover:underline font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="text-center mt-4">
                <a href="#" className="text-sm text-coral hover:underline">
                  Forgot your password?
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center space-x-4 text-xs text-foreground/60">
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              SOC 2 Compliant
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              GDPR Ready
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              256-bit SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}