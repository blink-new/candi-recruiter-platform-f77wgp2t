import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, DollarSign, Target, Brain, Info, X, Plus } from 'lucide-react';
import { Candidate } from '@/features/candidates/types';
import { useState, useEffect } from 'react';

interface CandidateFormProps {
  candidateData: Partial<Candidate>;
  setCandidateData: (data: Partial<Candidate>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isReviewMode?: boolean;
}

const CandidateForm = ({ candidateData, setCandidateData, handleSubmit, isReviewMode = false }: CandidateFormProps) => {
  const [tagInputs, setTagInputs] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: keyof Candidate, value: any) => {
    if (isReviewMode) return;
    setCandidateData({ ...candidateData, [field]: value });
  };

  const handleTagInputChange = (field: string, value: string) => {
    setTagInputs(prev => ({ ...prev, [field]: value }));
  };

  const addTag = (field: keyof Candidate, tag: string) => {
    if (!tag.trim() || isReviewMode) return;
    const currentTags = (candidateData[field] as string[]) || [];
    if (!currentTags.map(t => t.toLowerCase()).includes(tag.trim().toLowerCase())) {
      setCandidateData({ ...candidateData, [field]: [...currentTags, tag.trim()] });
    }
    handleTagInputChange(field as string, '');
  };

  const removeTag = (field: keyof Candidate, tagToRemove: string) => {
    if (isReviewMode) return;
    const currentTags = (candidateData[field] as string[]) || [];
    setCandidateData({ ...candidateData, [field]: currentTags.filter(tag => tag !== tagToRemove) });
  };

  const TagInput = ({ field, placeholder, suggestions = [] }: { field: keyof Candidate, placeholder: string, suggestions?: string[] }) => {
    const tags = (candidateData[field] as string[]) || [];
    const inputValue = tagInputs[field as string] || '';

    return (
      <div className="space-y-2">
        {!isReviewMode && (
          <div className="flex space-x-2">
            <Input
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => handleTagInputChange(field as string, e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(field, inputValue);
                }
              }}
            />
            <Button type="button" variant="outline" size="icon" onClick={() => addTag(field, inputValue)} disabled={!inputValue.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        {suggestions.length > 0 && !isReviewMode && (
          <div className="flex flex-wrap gap-1 pt-1">
            {suggestions.map((suggestion, i) => (
              <button key={i} type="button" onClick={() => addTag(field, suggestion)} className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600">
                + {suggestion}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] pt-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center">
              {tag}
              {!isReviewMode && (
                <button type="button" onClick={() => removeTag(field, tag)} className="ml-1.5 rounded-full hover:bg-red-200/50 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-[#f67280]" />Basic Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Full Name *" required value={candidateData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} readOnly={isReviewMode} />
          <Input placeholder="LinkedIn URL" value={candidateData.linkedin_url || ''} onChange={(e) => handleInputChange('linkedin_url', e.target.value)} readOnly={isReviewMode} />
          <Input type="email" placeholder="Email Address" value={candidateData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} readOnly={isReviewMode} />
          <Input placeholder="Phone Number" value={candidateData.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} readOnly={isReviewMode} />
          <Input placeholder="Current Location" value={candidateData.location || ''} onChange={(e) => handleInputChange('location', e.target.value)} readOnly={isReviewMode} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5 text-[#f67280]" />Professional Background</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Current Job Title" value={candidateData.current_job_title || ''} onChange={(e) => handleInputChange('current_job_title', e.target.value)} readOnly={isReviewMode} />
          <Input placeholder="Company" value={candidateData.current_company || ''} onChange={(e) => handleInputChange('current_company', e.target.value)} readOnly={isReviewMode} />
          <Input placeholder="Years at Current Position" type="number" value={candidateData.years_in_current_role || ''} onChange={(e) => handleInputChange('years_in_current_role', Number(e.target.value))} readOnly={isReviewMode} />
          <Input placeholder="Total Years of Experience" type="number" value={candidateData.total_years_experience || ''} onChange={(e) => handleInputChange('total_years_experience', Number(e.target.value))} readOnly={isReviewMode} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5 text-[#f67280]" />Recruiting Specialization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium">Industries</label><TagInput field="industries" placeholder="Add industry..." suggestions={['Tech', 'FMCG', 'Healthcare']} /></div>
          <div><label className="text-sm font-medium">Seniority Levels Placed</label><TagInput field="seniority_levels_placed" placeholder="Add seniority level..." suggestions={['Junior', 'Senior', 'Director']} /></div>
          <div><label className="text-sm font-medium">Market Focus</label><TagInput field="market_focus" placeholder="Add market segment..." suggestions={['Local', 'Expat', 'Regional']} /></div>
          <div><label className="text-sm font-medium">Recruitment Tools</label><TagInput field="recruitment_tools" placeholder="Add tool..." suggestions={['LinkedIn Recruiter', 'Gllue', 'ATS']} /></div>
          <div><label className="text-sm font-medium">Sourcing Methods</label><TagInput field="sourcing_methods" placeholder="Add method..." suggestions={['BD', 'Delivery', '360°']} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5 text-[#f67280]" />Performance & Compensation</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Current Base Salary (Annual)" value={candidateData.current_salary || ''} onChange={(e) => handleInputChange('current_salary', e.target.value)} readOnly={isReviewMode} />
          <Input placeholder="Commission Structure" value={candidateData.commission_structure || ''} onChange={(e) => handleInputChange('commission_structure', e.target.value)} readOnly={isReviewMode} />
          <Input placeholder="Revenue Generated (Past Year)" value={candidateData.revenue_generated || ''} onChange={(e) => handleInputChange('revenue_generated', e.target.value)} readOnly={isReviewMode} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><Brain className="mr-2 h-5 w-5 text-[#f67280]" />AI Insights & Analysis</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium">AI Summary</label><Textarea value={candidateData.ai_summary || ''} onChange={(e) => handleInputChange('ai_summary', e.target.value)} readOnly={isReviewMode} rows={3} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Key Strengths</label><TagInput field="strengths" placeholder="Add strength..." /></div>
            <div><label className="text-sm font-medium">Potential Concerns</label><TagInput field="red_flags" placeholder="Add concern..." /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="text-sm font-medium">Push Factors</label><TagInput field="push_factors" placeholder="Add push factor..." /></div>
            <div><label className="text-sm font-medium">Pull Factors</label><TagInput field="pull_factors" placeholder="Add pull factor..." /></div>
            <div><label className="text-sm font-medium">Stay Factors</label><TagInput field="stay_factors" placeholder="Add stay factor..." /></div>
          </div>
          <div><label className="text-sm font-medium">Likelihood Score (0-100)</label><Input type="number" min="0" max="100" value={candidateData.likelihood_score || ''} onChange={(e) => handleInputChange('likelihood_score', Number(e.target.value))} readOnly={isReviewMode} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-[#f67280]" />Status & Classification</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={candidateData.status || ''} onValueChange={(value) => handleInputChange('status', value as Candidate['status'])} disabled={isReviewMode}>
            <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sourced">Sourced</SelectItem>
              <SelectItem value="messaged">Messaged</SelectItem>
              <SelectItem value="unsure">Unsure</SelectItem>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="follow-up">Follow-Up</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <div><label className="text-sm font-medium">Tags</label><TagInput field="tags" placeholder="Add tag..." suggestions={['High Priority', 'Referral', 'Passive']} /></div>
        </CardContent>
      </Card>

      {!isReviewMode && (
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" size="lg" className="bg-[#f67280] hover:bg-[#f67280]/90">
            Save Candidate Details
          </Button>
        </div>
      )}
    </form>
  );
};

export default CandidateForm;
