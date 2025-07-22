import blink from '@/blink/client';
import { ParsedCandidateData, AIExtractionResult } from '@/features/candidates/types';

export class AIExtractionService {
  private static readonly COMPREHENSIVE_EXTRACTION_SCHEMA = {
    type: 'object',
    properties: {
      // Basic Information
      name: { type: 'string', description: 'Full name of the recruiting professional' },
      email: { type: 'string', description: 'Email address if available' },
      phone: { type: 'string', description: 'Phone number if available' },
      location: { type: 'string', description: 'Current location/city/country' },
      linkedin_url: { type: 'string', description: 'LinkedIn profile URL' },
      
      // Professional Background
      current_job_title: { type: 'string', description: 'Current job title/position' },
      current_company: { type: 'string', description: 'Current company name' },
      years_in_current_role: { type: 'number', description: 'Years in current position' },
      total_years_experience: { type: 'number', description: 'Total years of professional recruiting experience' },
      
      // Recruiting Specialization - Core Value Extraction
      industries: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Industries they recruit for (e.g., Technology, FMCG, Healthcare, Finance, Manufacturing, Retail, Automotive, Pharma, Consulting)'
      },
      seniority_levels_placed: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Seniority levels they typically place (e.g., Graduate, Junior, Mid-level, Senior, Manager, Director, VP, C-Level, Board)'
      },
      market_focus: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Market segments they focus on (e.g., Local market, Expat candidates, Chinese returnees, Regional APAC, Global mobility, Niche specialists)'
      },
      recruitment_tools: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Tools and platforms they use (e.g., LinkedIn Recruiter, Gllue, WeCom, Workday, Greenhouse, ATS systems, Boolean search, Xing, Indeed)'
      },
      sourcing_methods: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Their approach and methodology (e.g., BD focused, Delivery only, 360° recruitment, Headhunting, Executive search, RPO, Contingency, Retained search)'
      },
      
      // Performance & Compensation - Critical for Assessment
      current_salary: { type: 'string', description: 'Current salary/compensation package' },
      commission_structure: { type: 'string', description: 'Commission, bonus structure, or incentive plan' },
      revenue_generated: { type: 'string', description: 'Revenue generated, billing targets, or placement fees achieved' },
      
      // Advanced AI Analysis - The Intelligence Layer
      ai_summary: { 
        type: 'string', 
        description: 'Comprehensive professional summary highlighting key strengths, specializations, and market positioning (2-3 sentences)'
      },
      strengths: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Key professional strengths, achievements, and competitive advantages (be specific about recruiting capabilities)'
      },
      red_flags: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Potential concerns or risks (e.g., frequent job changes, employment gaps, unclear career progression, performance issues, cultural fit concerns)'
      },
      push_factors: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Factors that might push them to leave current role (e.g., limited growth, poor management, low compensation, market changes, company instability)'
      },
      pull_factors: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Factors that would attract them to new opportunities (e.g., career advancement, better compensation, new challenges, market expansion, leadership opportunities)'
      },
      stay_factors: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Factors that might keep them in current role (e.g., job security, good relationships, recent promotion, equity vesting, family considerations)'
      },
      likelihood_score: { 
        type: 'number', 
        minimum: 0, 
        maximum: 100,
        description: 'Likelihood of being open to new opportunities based on career stage, recent changes, and market indicators (0-100)'
      },
      
      // Qualitative Insights - The Strategic Layer
      business_development_exposure: { 
        type: 'string',
        description: 'Level of BD/sales exposure and client-facing experience (e.g., Strong BD background, Delivery focused, Mixed approach)'
      },
      client_facing_strength: { 
        type: 'string',
        description: 'Assessment of client relationship and communication skills based on profile content'
      },
      career_trajectory: { 
        type: 'string',
        description: 'Analysis of career progression pattern (e.g., Steady upward progression, Lateral moves for experience, Recent acceleration, Plateau period)'
      },
      market_reputation: { 
        type: 'string',
        description: 'Indicators of market standing and professional reputation based on available information'
      },
      
      // Language and Cultural Fit
      languages: {
        type: 'array',
        items: { type: 'string' },
        description: 'Languages mentioned or inferred (e.g., English, Mandarin, Cantonese, Japanese, Korean)'
      },
      cultural_background: {
        type: 'string',
        description: 'Cultural background or market familiarity that could be relevant for recruiting roles'
      },
      
      // Confidence and Quality Scores
      confidence_scores: {
        type: 'object',
        description: 'Confidence level (0-100) for each extracted field based on clarity and availability of information',
        additionalProperties: { type: 'number', minimum: 0, maximum: 100 }
      },
      
      // Meta Analysis
      extraction_quality: {
        type: 'string',
        enum: ['excellent', 'good', 'fair', 'poor'],
        description: 'Overall quality of information available for extraction'
      },
      missing_critical_info: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of critical information that could not be extracted and should be gathered'
      }
    },
    required: ['name', 'extraction_quality']
  };

  static async extractFromFile(file: File): Promise<AIExtractionResult> {
    try {
      // Validate file type and size
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        return {
          success: false,
          error: 'Unsupported file type. Please upload PDF, DOCX, PNG, or JPG files.'
        };
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return {
          success: false,
          error: 'File size too large. Please upload files smaller than 10MB.'
        };
      }

      // Extract text content from file
      const textContent = await blink.data.extractFromBlob(file);
      
      if (!textContent || textContent.trim().length < 100) {
        return {
          success: false,
          error: 'Unable to extract meaningful content from the file. The file may be corrupted, password-protected, or contain insufficient text. Please try a different file or enter details manually.'
        };
      }

      // Enhanced AI prompt for comprehensive extraction
      const prompt = `
        You are an expert recruiter and talent analyst with deep expertise in evaluating recruiting professionals. 
        Analyze this resume/CV with the precision of a senior recruiting director who needs to make strategic hiring decisions.
        
        CRITICAL FOCUS AREAS:
        1. RECRUITING SPECIALIZATION: What markets, industries, and seniority levels do they focus on?
        2. PERFORMANCE INDICATORS: Look for metrics, achievements, revenue numbers, placement success rates
        3. TOOLS & METHODOLOGY: What recruiting tools, platforms, and approaches do they use?
        4. BUSINESS DEVELOPMENT: How client-facing are they? BD-focused or delivery-focused?
        5. CAREER TRAJECTORY: What does their progression tell us about ambition and capability?
        6. MARKET POSITIONING: How do they position themselves in the recruiting market?
        
        INTELLIGENCE EXTRACTION:
        - Extract not just facts, but insights about their recruiting style and capabilities
        - Identify patterns that indicate their level of sophistication and market knowledge
        - Look for subtle indicators of performance, client relationships, and market reputation
        - Assess their likely motivations and career drivers based on their background
        - Consider cultural and language factors that might be relevant
        
        QUALITY STANDARDS:
        - Be thorough but accurate - if information isn't clearly stated, don't fabricate
        - For likelihood_score, consider career stage, recent achievements, market conditions, and any satisfaction indicators
        - Provide actionable insights that a hiring manager could use immediately
        - Flag any missing critical information that should be gathered through follow-up
        
        Resume/CV Content:
        ${textContent}
        
        File name: ${file.name}
        File type: ${file.type}
      `;

      const { object: extractedData } = await blink.ai.generateObject({
        prompt,
        schema: this.COMPREHENSIVE_EXTRACTION_SCHEMA
      });

      // Post-process and validate the extracted data
      const processedData = this.postProcessExtractedData(extractedData as ParsedCandidateData);
      const overallConfidence = this.calculateOverallConfidence(extractedData.confidence_scores || {});

      return {
        success: true,
        data: processedData,
        extraction_method: 'resume',
        raw_content: textContent,
        confidence_score: overallConfidence
      };

    } catch (error) {
      console.error('Error extracting from file:', error);
      return {
        success: false,
        error: 'Failed to process the file. This could be due to file corruption, network issues, or unsupported content format. Please try again or enter details manually.'
      };
    }
  }

  static async extractFromLinkedIn(url: string): Promise<AIExtractionResult> {
    try {
      // Enhanced LinkedIn URL validation
      if (!this.isValidLinkedInUrl(url)) {
        return {
          success: false,
          error: 'Please enter a valid LinkedIn profile URL. Format: https://www.linkedin.com/in/username or https://linkedin.com/in/username'
        };
      }

      // Normalize the URL
      const normalizedUrl = this.normalizeLinkedInUrl(url);

      // Scrape LinkedIn profile with enhanced error handling
      const { markdown, metadata } = await blink.data.scrape(normalizedUrl);
      
      if (!markdown || markdown.trim().length < 200) {
        return {
          success: false,
          error: 'Unable to access sufficient content from this LinkedIn profile. The profile may be private, have limited public information, or be temporarily unavailable. Please check the URL and ensure the profile is public.'
        };
      }

      // Enhanced LinkedIn-specific AI prompt
      const prompt = `
        You are analyzing a LinkedIn profile of a recruiting professional with the expertise of a senior talent acquisition leader.
        Extract comprehensive information with special attention to LinkedIn-specific indicators.
        
        LINKEDIN-SPECIFIC ANALYSIS:
        1. HEADLINE & SUMMARY: Often contains key specializations and value propositions
        2. EXPERIENCE SECTION: Look for progression, achievements, and specific recruiting metrics
        3. SKILLS & ENDORSEMENTS: Indicate areas of expertise and peer recognition
        4. RECOMMENDATIONS: May contain performance indicators and client feedback
        5. ACTIVITY & POSTS: Can indicate thought leadership and market engagement
        6. CONNECTIONS: High connection count may indicate strong network (recruiting asset)
        
        RECRUITING INTELLIGENCE:
        - Identify their recruiting niche and market positioning
        - Look for client testimonials or success stories in recommendations
        - Extract any mentioned metrics (placements, revenue, client satisfaction)
        - Assess their personal branding and market presence
        - Consider their network size and engagement as recruiting assets
        
        MOTIVATION ANALYSIS:
        - Recent job changes or promotions may indicate satisfaction/dissatisfaction
        - Activity level and content sharing can indicate engagement
        - Career progression pattern suggests ambition and growth trajectory
        - Industry connections and thought leadership indicate market standing
        
        LinkedIn Profile Content:
        ${markdown}
        
        Profile URL: ${normalizedUrl}
        Page Title: ${metadata?.title || 'N/A'}
        Meta Description: ${metadata?.description || 'N/A'}
      `;

      const { object: extractedData } = await blink.ai.generateObject({
        prompt,
        schema: this.COMPREHENSIVE_EXTRACTION_SCHEMA
      });

      // Ensure LinkedIn URL is included and post-process
      const dataWithUrl = {
        ...extractedData,
        linkedin_url: normalizedUrl
      };

      const processedData = this.postProcessExtractedData(dataWithUrl as ParsedCandidateData);
      const overallConfidence = this.calculateOverallConfidence(extractedData.confidence_scores || {});

      return {
        success: true,
        data: processedData,
        extraction_method: 'linkedin',
        raw_content: markdown,
        confidence_score: overallConfidence
      };

    } catch (error) {
      console.error('Error extracting from LinkedIn:', error);
      return {
        success: false,
        error: 'Failed to analyze LinkedIn profile. This could be due to network issues, profile privacy settings, or temporary LinkedIn restrictions. Please try again later or enter details manually.'
      };
    }
  }

  static async enhanceWithAdditionalAnalysis(data: ParsedCandidateData, rawContent: string): Promise<ParsedCandidateData> {
    try {
      // Strategic enhancement prompt
      const prompt = `
        As a senior recruiting director, provide strategic insights about this recruiting professional.
        Focus on actionable intelligence that would inform hiring and engagement decisions.
        
        Current Analysis: ${JSON.stringify(data, null, 2)}
        
        Raw Content: ${rawContent.substring(0, 3000)}...
        
        STRATEGIC ENHANCEMENT FOCUS:
        1. COMPETITIVE POSITIONING: How do they stack up in the recruiting market?
        2. HIRING POTENTIAL: What would make them an attractive hire?
        3. ENGAGEMENT STRATEGY: What would motivate them to consider new opportunities?
        4. RISK ASSESSMENT: What are the potential challenges or concerns?
        5. VALUE PROPOSITION: What unique value do they bring to a recruiting team?
        
        Provide enhanced insights that go beyond basic facts to strategic intelligence.
      `;

      const { object: enhancedAnalysis } = await blink.ai.generateObject({
        prompt,
        schema: {
          type: 'object',
          properties: {
            enhanced_summary: { 
              type: 'string',
              description: 'Enhanced professional summary with strategic insights'
            },
            competitive_positioning: { 
              type: 'string',
              description: 'How they position in the recruiting market'
            },
            hiring_potential: { 
              type: 'string',
              description: 'What makes them an attractive hire'
            },
            engagement_strategy: { 
              type: 'array',
              items: { type: 'string' },
              description: 'Recommended approach for engaging this candidate'
            },
            risk_factors: { 
              type: 'array',
              items: { type: 'string' },
              description: 'Potential risks or challenges in hiring'
            },
            value_proposition: { 
              type: 'array',
              items: { type: 'string' },
              description: 'Unique value they would bring to a team'
            },
            updated_likelihood_score: { 
              type: 'number', 
              minimum: 0, 
              maximum: 100,
              description: 'Refined likelihood score based on deeper analysis'
            },
            next_steps: {
              type: 'array',
              items: { type: 'string' },
              description: 'Recommended next steps for engaging this candidate'
            }
          }
        }
      });

      // Merge enhanced insights with original data
      return {
        ...data,
        ai_summary: enhancedAnalysis.enhanced_summary || data.ai_summary,
        push_factors: [...(data.push_factors || []), ...(enhancedAnalysis.risk_factors || [])],
        pull_factors: [...(data.pull_factors || []), ...(enhancedAnalysis.value_proposition || [])],
        likelihood_score: enhancedAnalysis.updated_likelihood_score || data.likelihood_score,
        // Store additional insights in a structured way
        strengths: [...(data.strengths || []), ...(enhancedAnalysis.value_proposition || [])]
      };

    } catch (error) {
      console.error('Error enhancing analysis:', error);
      return data; // Return original data if enhancement fails
    }
  }

  private static postProcessExtractedData(data: ParsedCandidateData): ParsedCandidateData {
    // Clean and validate extracted data
    const processed = { ...data };
    
    // Ensure arrays are properly formatted
    const arrayFields = ['industries', 'seniority_levels_placed', 'market_focus', 'recruitment_tools', 'sourcing_methods', 'strengths', 'red_flags', 'push_factors', 'pull_factors', 'stay_factors', 'languages'];
    
    arrayFields.forEach(field => {
      if (processed[field as keyof ParsedCandidateData]) {
        const value = processed[field as keyof ParsedCandidateData];
        if (Array.isArray(value)) {
          // Remove empty strings and duplicates
          processed[field as keyof ParsedCandidateData] = [...new Set(value.filter(item => item && item.trim()))] as any;
        }
      }
    });
    
    // Validate and cap likelihood score
    if (processed.likelihood_score) {
      processed.likelihood_score = Math.max(0, Math.min(100, processed.likelihood_score));
    }
    
    // Clean up text fields
    const textFields = ['name', 'email', 'phone', 'location', 'current_job_title', 'current_company', 'ai_summary'];
    textFields.forEach(field => {
      const value = processed[field as keyof ParsedCandidateData];
      if (typeof value === 'string') {
        processed[field as keyof ParsedCandidateData] = value.trim() as any;
      }
    });
    
    return processed;
  }

  private static isValidLinkedInUrl(url: string): boolean {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-.]+\/?$/i;
    return linkedinRegex.test(url);
  }

  private static normalizeLinkedInUrl(url: string): string {
    // Ensure https and www
    let normalized = url.toLowerCase().trim();
    if (!normalized.startsWith('http')) {
      normalized = 'https://' + normalized;
    }
    if (!normalized.includes('www.')) {
      normalized = normalized.replace('linkedin.com', 'www.linkedin.com');
    }
    // Remove trailing slash
    return normalized.replace(/\/$/, '');
  }

  private static calculateOverallConfidence(confidenceScores: { [key: string]: number }): number {
    const scores = Object.values(confidenceScores);
    if (scores.length === 0) return 75; // Default confidence
    
    // Weight critical fields more heavily
    const criticalFields = ['name', 'current_job_title', 'current_company', 'industries', 'total_years_experience'];
    const criticalScores = Object.entries(confidenceScores)
      .filter(([key]) => criticalFields.includes(key))
      .map(([, score]) => score);
    
    if (criticalScores.length > 0) {
      const criticalAvg = criticalScores.reduce((sum, score) => sum + score, 0) / criticalScores.length;
      const overallAvg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      // Weight critical fields at 70%, others at 30%
      return Math.round(criticalAvg * 0.7 + overallAvg * 0.3);
    }
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }
}
