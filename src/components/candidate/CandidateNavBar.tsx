
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Edit, Save } from 'lucide-react';

interface CandidateNavBarProps {
  projectName: string;
  projectId: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSaveChanges: () => void;
}

const CandidateNavBar: React.FC<CandidateNavBarProps> = ({
  projectName,
  projectId,
  isEditing,
  onToggleEdit,
}) => {
  return (
    <div className="bg-[#fff9f5] border-b border-t border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/candidates">
              <Button variant="ghost" className="flex items-center text-sm text-gray-700 hover:text-gray-900 px-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Candidate List
              </Button>
            </Link>
            <Link to={`/project/${projectId}`}>
              <Button variant="outline" className="flex items-center text-sm border-orange-300 bg-white text-orange-800 hover:bg-orange-50 hover:text-orange-900 shadow-sm">
                <Eye className="h-4 w-4 mr-2" />
                View Project: {projectName}
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={onToggleEdit} variant="default" className="flex items-center text-sm bg-coral text-white hover:bg-coral/90 shadow-sm">
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Candidate'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateNavBar;
