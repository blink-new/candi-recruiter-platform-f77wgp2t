import { Checkbox } from "@/components/ui/checkbox"

// Mock data for now
const mockQuestions = {
  screening: [
    'Can you walk me through your resume and highlight your most relevant experience for this role?',
    'What motivated you to apply for this position and what do you know about our company?',
    'Why are you considering leaving your current role, and what are you looking for in your next opportunity?',
    'What are your salary expectations for this role?',
    'Describe your ideal work environment and management style.',
    'What is your availability to interview and what is your potential start date?',
  ],
  behavioral: [
    'Tell me about a time you had to fill a very niche role under a tight deadline. What was your strategy?',
    'How do you maintain a strong and diverse candidate pipeline during a slow hiring period?',
    'Describe a situation where you had to convince a passive candidate to consider a new opportunity. What was your approach and what was the outcome?',
    'Walk me through the most complex negotiation you handled with a candidate. What were the challenges and how did you overcome them?',
    'Tell me about a time you made a misjudgment on a candidate who didn\'t work out. What did you learn from that experience and what would you do differently?',
    'Describe a time you used data to influence a hiring decision or strategy. What was the impact?'
  ],
  probing: [
    'You mentioned direct sourcing is a strength. Can you elaborate on your specific process and the tools you find most effective for finding untapped talent?',
    'On your resume, you list "stakeholder management" as a key skill. Can you provide a specific example of how you\'ve managed expectations with a particularly difficult hiring manager?',
    'You said you improved time-to-fill by 20% in your last role. What specific changes did you implement to achieve that result, and how did you measure success?',
    'Can you elaborate on your experience with different Applicant Tracking Systems? Which ones are you most proficient with and why?',
  ],
  pitch: 'Based on your expressed interest in leadership and your deep experience with high-growth startups, this role offers a clear and accelerated path to managing a small, high-impact team within the first 12-18 months. You\'ll also have significant equity potential as an early and influential member of our core team, directly shaping the future of our product.'
}

const AiInterviewScriptGenerator = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold font-serif mb-4">Suggested Interview Questions</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Screening Questions</h3>
          <ul className="space-y-2">
            {mockQuestions.screening.map((q, i) => (
              <li key={i} className="flex items-start">
                <Checkbox id={`sc-${i}`} className="mt-1 mr-3" />
                <label htmlFor={`sc-${i}`} className="text-sm text-gray-700 leading-relaxed">{q}</label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Behavioral Questions</h3>
          <ul className="space-y-2">
            {mockQuestions.behavioral.map((q, i) => (
              <li key={i} className="flex items-start">
                <Checkbox id={`bh-${i}`} className="mt-1 mr-3" />
                <label htmlFor={`bh-${i}`} className="text-sm text-gray-700 leading-relaxed">{q}</label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Probing Questions</h3>
          <ul className="space-y-2">
            {mockQuestions.probing.map((q, i) => (
              <li key={i} className="flex items-start">
                <Checkbox id={`pr-${i}`} className="mt-1 mr-3" />
                <label htmlFor={`pr-${i}`} className="text-sm text-gray-700 leading-relaxed">{q}</label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">How to Pitch This Opportunity</h3>
          <p className="text-sm text-gray-700 bg-blue-50 p-4 rounded-md border border-blue-200 leading-relaxed">
            {mockQuestions.pitch}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AiInterviewScriptGenerator