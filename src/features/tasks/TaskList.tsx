import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit3, Save, Trash2, GripVertical } from 'lucide-react';
import blink from '@/blink/client';
import { logKpiEvent } from '@/lib/utils';

interface TaskListProps {
  projectId?: string;
  candidateId?: string;
  onTasksChange?: (tasks: Task[]) => void;
}

const TaskList = ({ projectId, candidateId, onTasksChange }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser(state.user);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    const whereClause: any = { userId: user.id };
    if (projectId) {
      whereClause.projectId = projectId;
    } else if (candidateId) {
      whereClause.candidateId = candidateId;
    }

    try {
      const fetchedTasks = await blink.db.tasks.list({
        where: whereClause,
        orderBy: { displayOrder: 'asc' },
      });
      const transformedTasks = fetchedTasks.map(task => ({
        ...task,
        status: Number(task.completed) > 0 ? 'Complete' : 'To Do',
      }));

      const activeTaskIndex = transformedTasks.findIndex(task => task.status === 'In Progress');
      if (activeTaskIndex === -1 && transformedTasks.length > 0) {
        const firstTodoIndex = transformedTasks.findIndex(task => task.status === 'To Do');
        if (firstTodoIndex !== -1) {
          transformedTasks[firstTodoIndex].status = 'In Progress';
        }
      }

      setTasks(transformedTasks);
      if (onTasksChange) {
        onTasksChange(transformedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [user, projectId, candidateId, onTasksChange]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedTasks = items.map((task, index) => ({ ...task, displayOrder: index }));
    setTasks(updatedTasks);

    try {
      await blink.db.tasks.upsertMany(updatedTasks.map(({ status, ...task }) => ({ ...task, completed: status === 'Complete' ? 1 : 0 })));
    } catch (error) {
      console.error('Error updating task order:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !user) return;
    setIsLoading(true);
    try {
      const { object: generatedTask } = await blink.ai.generateObject({
        prompt: `Given the shorthand task "${newTask}", generate a polished, professional task description suitable for a recruiter's workflow.`,
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
          },
          required: ['title'],
        },
      });

      const taskToAdd = {
        id: `task-${Date.now()}`,
        title: (generatedTask as { title: string }).title,
        completed: 0,
        displayOrder: tasks.length,
        userId: user.id,
        projectId: projectId,
        candidateId: candidateId,
      };

      await blink.db.tasks.create(taskToAdd);
      fetchTasks();
      setNewTask('');
    } catch (error) {
      console.error('Error generating task:', error);
      const taskToAdd = {
        id: `task-${Date.now()}`,
        title: newTask,
        completed: 0,
        displayOrder: tasks.length,
        userId: user.id,
        projectId: projectId,
        candidateId: candidateId,
      };
      await blink.db.tasks.create(taskToAdd);
      fetchTasks();
      setNewTask('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'Complete' ? 'To Do' : 'Complete';
    if (newStatus === 'Complete') {
      logKpiEvent('task_completed', { taskId, projectId, candidateId });
    }
    const updatedTask = { ...task, status: newStatus, completed: newStatus === 'Complete' ? 1 : 0 };
    const { status, ...dbTask } = updatedTask;
    try {
      await blink.db.tasks.update(taskId, dbTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSave = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, title: editingTaskText };
    const { status, ...dbTask } = updatedTask;

    try {
      await blink.db.tasks.update(taskId, { title: editingTaskText });
      setEditingTaskId(null);
      setEditingTaskText('');
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await blink.db.tasks.delete(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.title);
  };

  const activeTaskIndex = tasks.findIndex(task => task.status === 'In Progress');

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <p className="text-sm text-foreground/60 mb-4">
        Complete each step to move the project forward. Tasks must be marked complete in sequence, but you can customize or add new steps at any time.
      </p>
      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add custom task (e.g., follow up w/ BD lead)"
          className="w-full p-2 border rounded-md"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button onClick={handleAddTask} disabled={isLoading || !user}>
          {isLoading ? 'Adding...' : 'Add Task'}
        </Button>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => {
                const isLocked = activeTaskIndex !== -1 && index > activeTaskIndex && tasks[activeTaskIndex].status !== 'Complete';
                const isEditing = editingTaskId === task.id;

                return (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-3 mb-2 rounded-lg flex items-center gap-3 transition-all ${
                          isLocked
                            ? 'bg-gray-100 opacity-60'
                            : task.status === 'Complete'
                            ? 'bg-green-50 border-l-4 border-green-400'
                            : task.status === 'In Progress'
                            ? 'bg-yellow-50 border-l-4 border-yellow-400 shadow-sm'
                            : 'bg-white'
                        } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>
                        <Checkbox
                          checked={task.status === 'Complete'}
                          onCheckedChange={() => handleToggleComplete(task.id)}
                          disabled={isLocked}
                        />
                        <div className="flex-grow">
                          {isEditing ? (
                            <Input
                              value={editingTaskText}
                              onChange={(e) => setEditingTaskText(e.target.value)}
                              className="h-8"
                            />
                          ) : (
                            <p className={`${task.status === 'Complete' ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </p>
                          )}
                          {task.timestamp && task.status === 'Complete' && (
                            <p className="text-xs text-gray-400">
                              Completed: {new Date(task.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <Button size="sm" onClick={() => handleSave(task.id)}><Save className="h-4 w-4" /></Button>
                          ) : (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(task)}><Edit3 className="h-4 w-4" /></Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(task.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;