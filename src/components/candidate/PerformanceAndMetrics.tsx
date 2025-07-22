import { useState } from 'react';
import EditableField from './EditableField';

// Mock data for now
const mockData = {
  salary: '120,000 USD + 20% commission',
  revenue: '1.2M USD',
  placements: 12,
  timeToFill: '32 days',
  clientAccounts: 8,
  experienceType: '360°',
};

const totalFields = 6;
const filledFields = Object.values(mockData).filter(v => v !== null && v !== '' && v !== 0).length;
const completeness = Math.round((filledFields / totalFields) * 100);

interface PerformanceAndMetricsProps {
  isEditing: boolean;
}

const PerformanceAndMetrics: React.FC<PerformanceAndMetricsProps> = ({ isEditing }) => {
  const [performanceData, setPerformanceData] = useState(mockData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPerformanceData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-serif">Performance and Metrics</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">KPI Completeness</span>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div className="bg-coral h-2 rounded-full" style={{ width: `${completeness}%` }}></div>
          </div>
          <span className="text-sm font-semibold text-coral">{completeness}%</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <EditableField
          label="Current base salary & commission"
          value={performanceData.salary}
          isEditing={isEditing}
          onChange={handleChange}
          type="text"
        />
        <EditableField
          label="Annual revenue generated"
          value={performanceData.revenue}
          isEditing={isEditing}
          onChange={handleChange}
          type="text"
        />
        <EditableField
          label="Quarterly placements"
          value={performanceData.placements}
          isEditing={isEditing}
          onChange={handleChange}
          type="number"
        />
        <EditableField
          label="Time-to-fill average"
          value={performanceData.timeToFill}
          isEditing={isEditing}
          onChange={handleChange}
          type="text"
        />
        <EditableField
          label="Active client accounts handled"
          value={performanceData.clientAccounts}
          isEditing={isEditing}
          onChange={handleChange}
          type="number"
        />
        <EditableField
          label="BD or 360° experience"
          value={performanceData.experienceType}
          isEditing={isEditing}
          onChange={handleChange}
          type="text"
        />
      </div>
    </div>
  );
};

export default PerformanceAndMetrics;
