import { useState } from 'react';
import EditableField from './EditableField';

// Mock data for now
const mockData = {
  yearsAtPosition: 3,
  totalExperience: 8,
  sectors: ['Technology', 'Fintech', 'SaaS'],
  jobLevels: ['Senior', 'Director'],
  marketFocus: 'APAC-wide',
  tools: ['LinkedIn Recruiter', 'Gllue', 'Lever'],
  sourcingMethod: 'Referrals & Direct Sourcing',
};

interface ProfessionalBackgroundProps {
  isEditing: boolean;
}

const ProfessionalBackground: React.FC<ProfessionalBackgroundProps> = ({ isEditing }) => {
  const [profData, setProfData] = useState(mockData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfData(prev => ({ ...prev, [name]: value }));
    console.log(`Autosaving ${name}: ${value}`);
  };

  const handleMultiSelectChange = (name: string, newValue: string) => {
    const values = newValue.split(',').map(s => s.trim()).filter(Boolean);
    setProfData(prev => ({ ...prev, [name]: values }));
    console.log(`Autosaving ${name}: ${values}`);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold font-heading mb-4 text-gray-800">Professional Background</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <EditableField 
          label="Years at current position" 
          name="yearsAtPosition"
          value={profData.yearsAtPosition} 
          isEditing={isEditing}
          onChange={handleChange}
          type="number"
        />
        <EditableField 
          label="Total years of recruitment experience" 
          name="totalExperience"
          value={profData.totalExperience} 
          isEditing={isEditing}
          onChange={handleChange}
          type="number"
        />
        <EditableField 
          label="Sectors recruited for" 
          name="sectors"
          value={profData.sectors} 
          isEditing={isEditing}
          onChange={(e) => handleMultiSelectChange('sectors', e.target.value)}
          className="md:col-span-2" 
          placeholder="e.g. Technology, Fintech, SaaS"
        />
        <EditableField 
          label="Job levels placed" 
          name="jobLevels"
          value={profData.jobLevels} 
          isEditing={isEditing}
          onChange={(e) => handleMultiSelectChange('jobLevels', e.target.value)}
          placeholder="e.g. Senior, Director"
        />
        <EditableField 
          label="Candidate market focus" 
          name="marketFocus"
          value={profData.marketFocus} 
          isEditing={isEditing}
          onChange={handleChange}
        />
        <EditableField 
          label="Recruitment tools used" 
          name="tools"
          value={profData.tools} 
          isEditing={isEditing}
          onChange={(e) => handleMultiSelectChange('tools', e.target.value)}
          className="md:col-span-2" 
          placeholder="e.g. LinkedIn Recruiter, Lever"
        />
        <EditableField 
          label="Preferred sourcing method" 
          name="sourcingMethod"
          value={profData.sourcingMethod} 
          isEditing={isEditing}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ProfessionalBackground;