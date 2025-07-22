import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Brain, 
  BarChart3, 
  Mic, 
  Target, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-heading font-bold text-foreground">CANDI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#product" className="text-neutral-600 hover:text-primary transition-colors">Product</a>
              <a href="#features" className="text-neutral-600 hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-neutral-600 hover:text-primary transition-colors">About</a>
              <Link to="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/40">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="bg-gradient-to-r from-secondary/20 to-primary/10 text-primary border-secondary/20 mb-6 font-medium">
              AI-Powered Recruiting Intelligence
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Streamline your recruiting workflow with{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">candidate analysis</span>,{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI summaries</span>, and{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">cross-project insights</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              CANDI transforms how recruiters work with intelligent candidate tracking, 
              automated transcript analysis, and data-driven insights across all your projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-secondary text-secondary-foreground hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/5 px-8 py-3 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Everything you need to recruit smarter
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              From candidate discovery to final hire, CANDI provides the tools and insights 
              to make every recruiting decision data-driven.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Candidate Intelligence</h3>
                <p className="text-neutral-600 mb-4">
                  Track candidates across projects with AI-powered likelihood scoring and behavioral insights.
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Smart candidate matching
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">AI Transcript Analysis</h3>
                <p className="text-neutral-600 mb-4">
                  Upload interview recordings and get instant transcripts with sentiment analysis and key insights.
                </p>
                <div className="flex items-center text-amber-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Automated insights
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Market Insights</h3>
                <p className="text-neutral-600 mb-4">
                  Get real-time hiring trends, salary benchmarks, and industry analytics across all projects.
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Data-driven decisions
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Project Management</h3>
                <p className="text-neutral-600 mb-4">
                  Organize candidates by project with task tracking and team collaboration features.
                </p>
                <div className="flex items-center text-amber-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Streamlined workflow
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">AI-Powered Summaries</h3>
                <p className="text-neutral-600 mb-4">
                  Get intelligent project summaries with push/pull factors and candidate recommendations.
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Smart recommendations
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">LinkedIn Integration</h3>
                <p className="text-neutral-600 mb-4">
                  Import existing projects and candidate data directly from LinkedIn Recruiter.
                </p>
                <div className="flex items-center text-amber-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Seamless import
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-heading font-semibold text-foreground mb-8">
            Trusted by recruiting teams worldwide
          </h3>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
              ))}
              <span className="ml-2 text-neutral-700 font-medium">4.9/5</span>
            </div>
            <div className="text-neutral-400">•</div>
            <div className="text-neutral-700 font-medium">500+ recruiters</div>
            <div className="text-neutral-400">•</div>
            <div className="text-neutral-700 font-medium">10,000+ candidates tracked</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="product" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-orange-50/20 to-yellow-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Ready to transform your recruiting process?
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Join hundreds of recruiters who are already using CANDI to make smarter hiring decisions.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-neutral-500 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-white border-t border-neutral-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-heading font-bold text-foreground">CANDI</span>
              </div>
              <p className="text-neutral-600 text-sm">
                Candidate Analysis & Intelligence platform for modern recruiting teams.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 mt-8 pt-8 text-center text-sm text-neutral-500">
            &copy; 2025 CANDI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}