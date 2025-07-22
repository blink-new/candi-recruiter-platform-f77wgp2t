export interface Candidate {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  // Basic Information
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  avatar?: string;
  initials?: string;

  // Professional Background
  current_job_title?: string;
  current_company?: string;
  years_in_current_role?: number;
  total_years_experience?: number;

  // Recruiting Specialization - Core Value
  industries?: string[];
  seniority_levels_placed?: string[];
  market_focus?: string[];
  recruitment_tools?: string[];
  sourcing_methods?: string[];

  // Performance & Compensation
  current_salary?: string;
  commission_structure?: string;
  revenue_generated?: string;

  // AI-Driven Qualitative Analysis
  ai_summary?: string;
  strengths?: string[];
  red_flags?: string[];
  push_factors?: string[];
  pull_factors?: string[];
  stay_factors?: string[];
  likelihood_score?: number; // 0-100

  // Strategic & Cultural Insights
  business_development_exposure?: string;
  client_facing_strength?: string;
  career_trajectory?: string;
  market_reputation?: string;
  languages?: string[];
  cultural_background?: string;

  // Metadata & Status
  status: 'sourced' | 'messaged' | 'unsure' | 'interested' | 'follow-up' | 'interviewing' | 'hired' | 'archived';
  tags?: string[];
  project_id?: string;

  // AI Extraction Metadata
  extraction_method?: 'resume' | 'linkedin' | 'manual';
  extraction_quality?: 'excellent' | 'good' | 'fair' | 'poor';
  confidence_scores?: { [key: string]: number };
  missing_critical_info?: string[];
  raw_content?: string;
}

// This is the direct output from the AI extraction service
export type ParsedCandidateData = Omit<Candidate, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status' | 'project_id'>;

export interface AIExtractionResult {
  success: boolean;
  data?: ParsedCandidateData;
  error?: string;
  confidence_score?: number; // Overall confidence
  extraction_method?: 'resume' | 'linkedin';
  raw_content?: string;
}
