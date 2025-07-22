import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ParsedCandidateData } from '@/features/candidates/types';
import {
  User, Briefcase, DollarSign, Target, Brain, Check, Edit, X, Loader2, Sparkles, TrendingUp, ShieldCheck, AlertTriangle, Languages, MapPin, Phone, Mail, Linkedin
} from 'lucide-react';

interface CandidateReviewSummaryProps {
  data: ParsedCandidateData;
  confidenceScore?: number;
  onConfirm: () => void;
  onEdit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <Card className="bg-white/60">
    <CardHeader>
      <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
        {icon}{title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-sm">
      {children}
    </CardContent>
  </Card>
);

const DataRow = ({ label, value, confidence }: { label: string; value?: string | number | string[]; confidence?: number }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  return (
    <div className="grid grid-cols-3 gap-4 items-start">
      <dt className="font-medium text-gray-600 col-span-1">{label}</dt>
      <dd className="text-gray-800 col-span-2">
        {Array.isArray(value) ? (
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => <Badge key={index} variant="secondary" className="font-normal">{item}</Badge>)}
          </div>
        ) : (
          <p>{value}</p>
        )}
        {confidence !== undefined && (
          <div className="flex items-center mt-1">
            <Progress value={confidence} className="w-24 h-1 mr-2" />
            <span className="text-xs text-gray-500">{confidence}%</span>
          </div>
        )}
      </dd>
    </div>
  );
};

const CandidateReviewSummary = ({ data, confidenceScore, onConfirm, onEdit, onCancel, isLoading }: CandidateReviewSummaryProps) => {
  const getConfidence = (field: keyof ParsedCandidateData) => data.confidence_scores?.[field];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="text-center space-y-2">
          <Sparkles className="mx-auto h-10 w-10 text-[#f67280]" />
          <CardTitle className="text-3xl font-bold">AI Extraction Complete</CardTitle>
          <p className="text-gray-600">Review the extracted information below. You can confirm directly or edit for accuracy.</p>
          {confidenceScore !== undefined && (
            <div className="flex items-center justify-center space-x-2 pt-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-700">Overall Confidence:</span>
              <span className="font-bold text-lg text-green-700">{confidenceScore}%</span>
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Basic Information" icon={<User className="mr-2 h-5 w-5 text-[#f67280]" />}>
            <DataRow label="Full Name" value={data.name} confidence={getConfidence('name')} />
            <DataRow label="Email" value={data.email} confidence={getConfidence('email')} icon={<Mail className="h-4 w-4 mr-2" />} />
            <DataRow label="Phone" value={data.phone} confidence={getConfidence('phone')} icon={<Phone className="h-4 w-4 mr-2" />} />
            <DataRow label="Location" value={data.location} confidence={getConfidence('location')} icon={<MapPin className="h-4 w-4 mr-2" />} />
            <DataRow label="LinkedIn" value={data.linkedin_url} confidence={getConfidence('linkedin_url')} icon={<Linkedin className="h-4 w-4 mr-2" />} />
          </SectionCard>

          <SectionCard title="Professional Background" icon={<Briefcase className="mr-2 h-5 w-5 text-[#f67280]" />}>
            <DataRow label="Current Title" value={data.current_job_title} confidence={getConfidence('current_job_title')} />
            <DataRow label="Current Company" value={data.current_company} confidence={getConfidence('current_company')} />
            <DataRow label="Years in Role" value={data.years_in_current_role} confidence={getConfidence('years_in_current_role')} />
            <DataRow label="Total Experience" value={data.total_years_experience} confidence={getConfidence('total_years_experience')} />
          </SectionCard>

          <SectionCard title="Recruiting Specialization" icon={<Target className="mr-2 h-5 w-5 text-[#f67280]" />}>
            <DataRow label="Industries" value={data.industries} confidence={getConfidence('industries')} />
            <DataRow label="Seniority Levels" value={data.seniority_levels_placed} confidence={getConfidence('seniority_levels_placed')} />
            <DataRow label="Market Focus" value={data.market_focus} confidence={getConfidence('market_focus')} />
            <DataRow label="Tools" value={data.recruitment_tools} confidence={getConfidence('recruitment_tools')} />
            <DataRow label="Sourcing Methods" value={data.sourcing_methods} confidence={getConfidence('sourcing_methods')} />
          </SectionCard>

          <SectionCard title="Performance & Compensation" icon={<DollarSign className="mr-2 h-5 w-5 text-[#f67280]" />}>
            <DataRow label="Current Salary" value={data.current_salary} confidence={getConfidence('current_salary')} />
            <DataRow label="Commission" value={data.commission_structure} confidence={getConfidence('commission_structure')} />
            <DataRow label="Revenue Generated" value={data.revenue_generated} confidence={getConfidence('revenue_generated')} />
          </SectionCard>
        </div>

        {/* Right Column - AI Insights */}
        <div className="space-y-6">
          <SectionCard title="AI Insights" icon={<Brain className="mr-2 h-5 w-5 text-[#f67280]" />}>
            {data.ai_summary && <p className="text-gray-700 italic bg-yellow-50 p-3 rounded-md">{data.ai_summary}</p>}
            <DataRow label="Strengths" value={data.strengths} />
            <DataRow label="Red Flags" value={data.red_flags} />
          </SectionCard>

          <SectionCard title="Career Motivation" icon={<TrendingUp className="mr-2 h-5 w-5 text-[#f67280]" />}>
            <DataRow label="Push Factors" value={data.push_factors} />
            <DataRow label="Pull Factors" value={data.pull_factors} />
            <DataRow label="Stay Factors" value={data.stay_factors} />
            {data.likelihood_score && (
              <div className="pt-2">
                <p className="font-medium text-gray-600 mb-1">Likelihood to Move</p>
                <div className="flex items-center">
                  <Progress value={data.likelihood_score} className="w-full h-2" />
                  <span className="ml-3 font-bold text-lg text-[#f67280]">{data.likelihood_score}%</span>
                </div>
              </div>
            )}
          </SectionCard>

          {data.missing_critical_info && data.missing_critical_info.length > 0 && (
            <SectionCard title="Missing Info" icon={<AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />}>
              <p className="text-amber-800">The AI recommends gathering more information on:</p>
              <ul className="list-disc list-inside text-amber-700">
                {data.missing_critical_info.map((info, i) => <li key={i}>{info}</li>)}
              </ul>
            </SectionCard>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4 pt-6 border-t mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isLoading} className="w-32">
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button variant="secondary" onClick={onEdit} disabled={isLoading} className="w-32">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button onClick={onConfirm} disabled={isLoading} className="w-48 bg-[#f67280] hover:bg-[#f67280]/90">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Confirm & Create
        </Button>
      </div>
    </div>
  );
};

export default CandidateReviewSummary;
