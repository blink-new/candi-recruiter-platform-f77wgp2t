import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  ChevronDown,
  Plus,
  BarChart3,
  Users,
  Mic,
  Settings,
  User,
  Bell,
  Palette,
  Link as LinkIcon,
  LogOut,
  FolderOpen,
  Home,
  Calendar as CalendarIcon,
} from 'lucide-react'
import blink from '@/blink/client'

interface Project {
  id: string
  title: string
  status: 'open' | 'closed'
}

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [projects] = useState<Project[]>([
    { id: '1', title: 'Senior Frontend Engineer - SF', status: 'open' },
    { id: '2', title: 'Product Manager - Remote', status: 'open' },
    { id: '3', title: 'Data Scientist - NYC', status: 'closed' },
    { id: '4', title: 'UX Designer - Austin', status: 'open' },
  ])

  const handleLogout = () => {
    blink.auth.logout('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src="/logo.png" alt="CANDI Logo" className="w-8 h-8" />
            <span className="text-xl font-heading font-bold text-foreground">CANDI</span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center space-x-6">
            {/* Projects Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`flex items-center space-x-1 ${
                    location.pathname.startsWith('/project') ? 'bg-coral/10 text-coral' : ''
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Projects</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Your Projects</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {projects.map((project) => (
                  <DropdownMenuItem key={project.id} asChild>
                    <Link to={`/project/${project.id}`} className="flex items-center justify-between w-full">
                      <span className="truncate">{project.title}</span>
                      <Badge 
                        variant={project.status === 'open' ? 'default' : 'secondary'}
                        className={project.status === 'open' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {project.status}
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/create-project" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Market Insights */}
            <Link to="/market-insights">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-1 ${
                  isActive('/market-insights') ? 'bg-coral/10 text-coral' : ''
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Market Insights</span>
              </Button>
            </Link>

            {/* Calendar */}
            <Link to="/calendar">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-1 ${
                  isActive('/calendar') ? 'bg-coral/10 text-coral' : ''
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Calendar</span>
              </Button>
            </Link>



            {/* Candidates */}
            <Link to="/candidates">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-1 ${
                  location.pathname.startsWith('/candidate') || isActive('/candidates') ? 'bg-coral/10 text-coral' : ''
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Candidates</span>
              </Button>
            </Link>

            {/* Upload Recording */}
            <Link to="/upload">
              <Button 
                variant="outline" 
                className={`flex items-center space-x-1 border-coral text-coral hover:bg-coral hover:text-white ${
                  isActive('/upload') ? 'bg-coral text-white' : ''
                }`}
              >
                <Mic className="h-4 w-4" />
                <span>Upload Recording</span>
              </Button>
            </Link>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Palette className="h-4 w-4 mr-2" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Integrations
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}