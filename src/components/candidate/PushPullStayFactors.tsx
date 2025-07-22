import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Mock data for now
const mockData = {
  push: ['Low commission structure', 'Poor management and lack of support', 'No clear career progression'],
  pull: ['Opportunity for team leadership', 'Autonomy in a 360° role', 'Specialization in high-growth tech sectors'],
  stay: ['Potential for a significant counteroffer', 'Upcoming promotion to Senior Manager'],
};

interface FactorSectionProps {
  title: string;
  factors: string[];
  color: string;
  isEditing: boolean;
  onFactorsChange: (factors: string[]) => void;
}

const FactorSection: React.FC<FactorSectionProps> = ({ title, factors, color, isEditing, onFactorsChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFactorsChange(e.target.value.split('\n'));
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-semibold text-lg mb-2"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        isEditing ? (
          <textarea
            value={factors.join('\n')}
            onChange={handleTextChange}
            className="w-full p-2 border border-orange-200 rounded-md bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[100px]"
          />
        ) : (
          <ul className="space-y-2 pl-4 border-l-2" style={{ borderColor: color }}>
            {factors.map((factor, index) => (
              <li key={index} className="text-gray-700">{factor}</li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

interface PushPullStayFactorsProps {
  isEditing: boolean;
}

const PushPullStayFactors: React.FC<PushPullStayFactorsProps> = ({ isEditing }) => {
  const [factorsData, setFactorsData] = useState(mockData);

  const handleFactorsChange = (factorType: 'push' | 'pull' | 'stay', factors: string[]) => {
    setFactorsData(prev => ({ ...prev, [factorType]: factors }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold font-serif mb-6">Push / Pull / Stay Factors</h2>
      <div className="space-y-6">
        <FactorSection
          title="Push Factors (Why they might leave)"
          factors={factorsData.push}
          color="#f67280"
          isEditing={isEditing}
          onFactorsChange={(factors) => handleFactorsChange('push', factors)}
        />
        <FactorSection
          title="Pull Factors (Why they are interested)"
          factors={factorsData.pull}
          color="#81C784"
          isEditing={isEditing}
          onFactorsChange={(factors) => handleFactorsChange('pull', factors)}
        />
        <FactorSection
          title="Stay Factors (What might keep them)"
          factors={factorsData.stay}
          color="#64B5F6"
          isEditing={isEditing}
          onFactorsChange={(factors) => handleFactorsChange('stay', factors)}
        />
      </div>
    </div>
  );
};

export default PushPullStayFactors;
