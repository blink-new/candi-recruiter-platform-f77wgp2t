
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Filter, Archive, Linkedin, ExternalLink, ChevronDown } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Candidate } from '@/features/candidates/types';

const mockCandidates: Candidate[] = [
  { id: '1', name: 'Aria Montgomery', title: 'Senior Recruiter', company: 'TalentFind Inc.', project: 'Project Phoenix', industry: ['Fintech', 'AI'], status: 'Sourced', linkedinUrl: '#', taskCompleteness: 75, likelihoodOfRecruitment: 88, userId: '1', createdAt: '2023-10-26T10:00:00Z' },
  { id: '2', name: 'Spencer Hastings', title: 'Tech Sourcer', company: 'Innovate Solutions', project: 'Project Chimera', industry: ['HealthTech'], status: 'Interested', linkedinUrl: '#', taskCompleteness: 50, likelihoodOfRecruitment: 65, userId: '1', createdAt: '2023-10-26T10:00:00Z' },
  { id: '3', name: 'Hanna Marin', title: 'Recruitment Lead', company: 'PeopleFirst', project: 'Project Gryphon', industry: ['MarTech', 'E-commerce'], status: 'Interviewing', linkedinUrl: '#', taskCompleteness: 90, likelihoodOfRecruitment: 92, userId: '1', createdAt: '2023-10-26T10:00:00Z' },
  { id: '4', name: 'Emily Fields', title: 'Talent Acquisition Specialist', company: 'ConnectCo', project: 'Project Phoenix', industry: ['EdTech'], status: 'Hired', linkedinUrl: '#', taskCompleteness: 100, likelihoodOfRecruitment: 98, userId: '1', createdAt: '2023-10-26T10:00:00Z' },
];

const mockArchivedCandidates: Candidate[] = [
    { id: '5', name: 'Alison DiLaurentis', title: 'Recruiting Coordinator', company: 'Stealth Startup', project: 'Project Chimera', industry: ['Cybersecurity'], status: 'Archived', linkedinUrl: '#', taskCompleteness: 25, likelihoodOfRecruitment: 15, userId: '1', createdAt: '2023-10-26T10:00:00Z' },
]

const LikelihoodIndicator = ({ score }: { score: number }) => {
    const getColor = () => {
        if (score > 85) return 'bg-green-500';
        if (score > 60) return 'bg-yellow-500';
        return 'bg-red-500';
    }
    return <div className={`w-3 h-3 rounded-full ${getColor()}`} />;
}

const CandidatesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState(mockCandidates);
  const [archivedCandidates, setArchivedCandidates] = useState(mockArchivedCandidates);
  const [filters, setFilters] = useState({
    industry: '',
    status: '',
    project: '',
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleArchive = (candidateId: string) => {
    const candidateToArchive = candidates.find(c => c.id === candidateId);
    if (candidateToArchive) {
        setCandidates(candidates.filter(c => c.id !== candidateId));
        setArchivedCandidates([...archivedCandidates, {...candidateToArchive, status: 'Archived'}]);
    }
  }

  const filteredCandidates = candidates.filter(candidate => {
    return (
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filters.industry ? candidate.industry?.includes(filters.industry) : true) &&
      (filters.status ? candidate.status === filters.status : true) &&
      (filters.project ? candidate.project === filters.project : true)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">All Candidates</h1>
            <Link to="/create-candidate">
              <Button>Add New Candidate</Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex space-x-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select onValueChange={(value) => handleFilterChange('industry', value)}>
              <SelectTrigger className="w-[180px]">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fintech">Fintech</SelectItem>
                <SelectItem value="HealthTech">HealthTech</SelectItem>
                <SelectItem value="MarTech">MarTech</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-[180px]">
                 <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sourced">Sourced</SelectItem>
                <SelectItem value="Interested">Interested</SelectItem>
                <SelectItem value="Interviewing">Interviewing</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('project', value)}>
              <SelectTrigger className="w-[180px]">
                 <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project Phoenix">Project Phoenix</SelectItem>
                <SelectItem value="Project Chimera">Project Chimera</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredCandidates.map(candidate => (
              <Card key={candidate.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <Link to={`/candidate/${candidate.id}`}>
                            <CardTitle className="text-lg hover:text-coral">{candidate.name}</CardTitle>
                        </Link>
                        <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="text-gray-400 hover:text-blue-600" size={20}/>
                        </a>
                    </div>
                    <p className="text-sm text-gray-600">{candidate.title} at {candidate.company}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.industry?.map(ind => (
                      <Badge key={ind} variant="secondary">{ind}</Badge>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Project</span>
                        <Link to={`/project/1`} className="flex items-center text-coral hover:underline">
                            {candidate.project} <ExternalLink size={14} className="ml-1"/>
                        </Link>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Task Completeness</span>
                        <div className="w-1/2">
                            <Progress value={candidate.taskCompleteness} className="h-2" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Likelihood of Recruitment</span>
                        <div className="flex items-center space-x-2">
                            <LikelihoodIndicator score={candidate.likelihoodOfRecruitment || 0} />
                            <span>{candidate.likelihoodOfRecruitment}%</span>
                        </div>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={(e) => {e.preventDefault(); handleArchive(candidate.id)}}>
                        <Archive size={16} className="mr-2"/>
                        Archive Candidate
                    </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Archived Candidates */}
          <div className="mt-12">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="archived">
                    <AccordionTrigger>
                        <div className="flex items-center text-lg font-semibold">
                            <Archive size={20} className="mr-3 text-gray-600"/>
                            Archived Candidates ({archivedCandidates.length})
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                            {archivedCandidates.map(candidate => (
                                <Card key={candidate.id} className="bg-gray-100">
                                    <CardHeader>
                                        <CardTitle className="text-md text-gray-600">{candidate.name}</CardTitle>
                                        <p className="text-sm text-gray-500">{candidate.title} at {candidate.company}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <Badge variant="secondary">Archived</Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidatesPage;
