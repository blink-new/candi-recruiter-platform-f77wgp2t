import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blink from '@/blink/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Briefcase
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  location: string;
  teamMembers: Array<{ id: string; name: string; avatar?: string }>;
  lastUpdated: string;
  status: 'open' | 'closed';
  candidateCount: number;
  tasks: Array<{ id: string; title: string; completed: boolean }>;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
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
    const fetchProjects = async () => {
      if (!user) return;
      const fetchedProjects = await blink.db.projects.list({ where: { userId: user.id } });
      const projectsWithCounts = await Promise.all(
        fetchedProjects.map(async (project) => {
          const candidates = await blink.db.candidates.list({ where: { userId: user.id } });
          const allTasks = await blink.db.tasks.list({ where: { userId: user.id } });
          const tasks = allTasks.filter(t => t.projectId === project.id);
          return {
            ...project,
            candidateCount: candidates.length,
            tasks: tasks.map(t => ({ ...t, completed: Number(t.completed) > 0 })),
            teamMembers: [], // This will be implemented later
            lastUpdated: '' // This will be implemented later
          };
        })
      );
      setProjects(projectsWithCounts);
    };

    fetchProjects();
  }, [user]);

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'open').length,
    totalCandidates: projects.reduce((sum, p) => sum + p.candidateCount, 0),
    completedTasks: projects.reduce((sum, p) => sum + p.tasks.filter(t => t.completed).length, 0)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-foreground/70">
              Here's what's happening with your recruiting projects today.
            </p>
          </div>
          <Link to="/create-project">
            <Button className="bg-coral hover:bg-coral-dark text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Total Projects</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-coral/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-coral" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Active Projects</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Total Candidates</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCandidates}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Tasks Completed</p>
                  <p className="text-2xl font-bold text-foreground">{stats.completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
            Your Projects
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="card-gradient border-0 shadow-sm card-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-heading font-semibold text-foreground mb-2">
                        {project.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-foreground/70 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {project.location}
                      </div>
                    </div>
                    <Badge 
                      variant={project.status === 'open' ? 'default' : 'secondary'}
                      className={project.status === 'open' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Team Members */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-foreground/70">Team:</span>
                      <div className="flex -space-x-2">
                        {project.teamMembers.slice(0, 3).map((member, index) => (
                          <Avatar key={member.id} className="w-6 h-6 border-2 border-white">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs bg-coral text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.teamMembers.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{project.teamMembers.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-foreground/70">
                      <Users className="h-4 w-4 mr-1" />
                      {project.candidateCount} candidates
                    </div>
                  </div>

                  {/* Top 3 Tasks */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground/70 mb-2">Recent Tasks</h4>
                    <div className="space-y-2">
                      {project.tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center space-x-2">
                          <CheckCircle 
                            className={`h-4 w-4 ${
                              task.completed 
                                ? 'text-green-500' 
                                : 'text-gray-300'
                            }`}
                          />
                          <span className={`text-sm ${
                            task.completed 
                              ? 'text-foreground/70 line-through' 
                              : 'text-foreground'
                          }`}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-foreground/60">
                      <Clock className="h-4 w-4 mr-1" />
                      Updated {project.lastUpdated}
                    </div>
                    <Link to={`/project/${project.id}`}>
                      <Button variant="outline" size="sm" className="border-coral text-coral hover:bg-coral hover:text-white">
                        View Project
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="card-gradient border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-heading font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/upload">
                <Button variant="outline" className="w-full justify-start border-coral text-coral hover:bg-coral hover:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Interview Recording
                </Button>
              </Link>
              
              <Link to="/candidates">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Browse All Candidates
                </Button>
              </Link>
              
              <Link to="/insights">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Market Insights
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}