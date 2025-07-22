import { useState } from 'react';
import { Linkedin, Mail, Phone, PlusCircle } from 'lucide-react';
import EditableField from './EditableField';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Mock data for now
const mockData = {
  linkedin: 'https://linkedin.com/in/anhnguyen',
  email: 'anh.nguyen@example.com',
  phone: '+84 123 456 789',
  likelihood: 78,
  fitSummary: 'Anh demonstrates exceptional strength in business development and client relationship management, consistently exceeding targets in her previous roles. Her experience aligns well with the key requirements for Project Alpha. However, a notable gap is her limited exposure to supply chain recruitment, a critical competency for this position. This could present a learning curve and potential risk. It is recommended to probe deeper into her adaptability and willingness to quickly learn new industry verticals during the interview process.',
};

interface SummaryOverviewProps {
  isEditing: boolean;
}

const SummaryOverview: React.FC<SummaryOverviewProps> = ({ isEditing }) => {
  const [summaryData, setSummaryData] = useState(mockData);
  const [manualSummary, setManualSummary] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSummaryData(prev => ({ ...prev, [name]: value }));
    // Here you would typically call a function to autosave the data
    // For now, we just log it to the console
    console.log(`Autosaving ${name}: ${value}`);
  };

  const handleAppendSummary = () => {
    if (manualSummary.trim() !== '') {
      const newSummary = `${summaryData.fitSummary}\n\n**Manual Addition:** ${manualSummary}`;
      setSummaryData(prev => ({ ...prev, fitSummary: newSummary }));
      setManualSummary('');
      console.log(`Appended to summary: ${manualSummary}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold font-heading mb-4 text-gray-800">Summary Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <EditableField
            label="LinkedIn"
            name="linkedin"
            value={summaryData.linkedin}
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
          />
          <EditableField
            label="Email"
            name="email"
            value={summaryData.email}
            isEditing={isEditing}
            onChange={handleChange}
            type="text"
            placeholder="candidate@email.com"
          />
          <EditableField
            label="Phone"
            name="phone"
            value={summaryData.phone}
            isEditing={isEditing}
            onChange={handleChange}
            type="text"
            placeholder="+1 234 567 890"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Likelihood to Join</h3>
            <div className="flex items-center mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${summaryData.likelihood}%` }}
                ></div>
              </div>
              <span className="ml-4 text-lg font-semibold text-gray-700">{summaryData.likelihood}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">AI-Generated Fit Summary</h3>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  name="fitSummary"
                  value={summaryData.fitSummary}
                  onChange={handleChange}
                  placeholder="Enter AI fit summary..."
                  className="w-full text-base bg-orange-50/50 border-orange-200 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                  rows={6}
                />
                <div className="flex items-center space-x-2 pt-2">
                  <Textarea
                    value={manualSummary}
                    onChange={(e) => setManualSummary(e.target.value)}
                    placeholder="Add a manual note to append to the summary..."
                    className="w-full text-sm bg-gray-50 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    rows={2}
                  />
                  <Button onClick={handleAppendSummary} size="sm" variant="outline" className="h-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Append
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-1 whitespace-pre-wrap">
                {summaryData.fitSummary}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryOverview;