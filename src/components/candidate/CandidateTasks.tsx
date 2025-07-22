
import { useState } from 'react';
import { Check, Lock } from 'lucide-react';

const tasksByStatus = {
  Sourced: ['Initial contact', 'Follow-up email', 'Schedule screening call'],
  Messaged: ['Confirm screening call', 'Prepare for call', 'Conduct screening call'],
  Interested: ['Schedule technical interview', 'Send prep materials', 'Conduct technical interview'],
  Interviewing: ['Schedule final interview', 'Gather feedback', 'Make decision'],
  Hired: ['Send offer letter', 'Initiate onboarding'],
  Archived: [],
};

const CandidateTasks = ({ status }) => {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const tasks = tasksByStatus[status] || [];

  const handleToggleTask = (index: number) => {
    if (completedTasks.includes(index)) {
      setCompletedTasks(completedTasks.filter((i) => i !== index));
    } else {
      setCompletedTasks([...completedTasks, index]);
    }
  };

  const isTaskLocked = (index: number) => {
    if (index === 0) return false;
    return !completedTasks.includes(index - 1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Candidate Task List</h3>
      {tasks.length > 0 ? (
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <li key={index} className="flex items-center">
              <button
                onClick={() => !isTaskLocked(index) && handleToggleTask(index)}
                disabled={isTaskLocked(index)}
                className={`w-6 h-6 mr-3 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  completedTasks.includes(index)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                } ${isTaskLocked(index) ? 'cursor-not-allowed bg-gray-100' : 'hover:bg-green-200'}`}
              >
                {isTaskLocked(index) ? (
                  <Lock size={14} />
                ) : completedTasks.includes(index) ? (
                  <Check size={16} />
                ) : null}
              </button>
              <span className={`transition-colors duration-200 ${
                  completedTasks.includes(index) ? 'text-gray-400 line-through' : 'text-gray-700'
                } ${isTaskLocked(index) ? 'text-gray-400' : ''}`}
              >
                {task}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No tasks for the current status.</p>
      )}
       {tasks.length > 0 && completedTasks.length === tasks.length && (
        <p className="text-green-600 font-semibold mt-4">All tasks completed!</p>
      )}
    </div>
  );
};

export default CandidateTasks;
