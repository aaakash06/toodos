import { useMemo } from 'react';
import type { Task } from '../../types';
import TaskItem from './TaskItem';
import { useTodo } from '../../contexts/TodoContext';

export default function TaskList() {
  const { getFilteredTasks, currentView } = useTodo();

  // Get tasks filtered according to current view
  const tasks = useMemo(() => {
    return getFilteredTasks();
  }, [getFilteredTasks]);

  // Get view title
  const getViewTitle = () => {
    switch (currentView.type) {
      case 'inbox': return 'Inbox';
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'project': {
        // Find project name if it's a project view
        const { projects } = useTodo();
        const project = projects.find(p => p.id === currentView.projectId);
        return project ? project.name : 'Project';
      }
      default: return 'Tasks';
    }
  };

  // Group tasks for the Upcoming view
  const groupedTasks = useMemo(() => {
    if (currentView.type !== 'upcoming') {
      return null;
    }

    const grouped: Record<string, Task[]> = {};

    for (const task of tasks) {
      if (!task.dueDate) continue;

      const dateKey = task.dueDate.toISOString().split('T')[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(task);
    }

    return grouped;
  }, [tasks, currentView.type]);

  if (tasks.length === 0) {
    return (
      <div className="py-10">
        <h1 className="text-2xl font-bold mb-4">{getViewTitle()}</h1>
        <p className="text-gray-500 italic">No tasks to display.</p>
      </div>
    );
  }

  // For Upcoming view, show tasks grouped by date
  if (currentView.type === 'upcoming' && groupedTasks) {
    return (
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">{getViewTitle()}</h1>

        {Object.entries(groupedTasks).map(([dateKey, dateTasks]) => (
          <div key={dateKey} className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-2">
              {new Date(dateKey).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <div className="space-y-1">
              {dateTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // For normal views
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">{getViewTitle()}</h1>
      <div className="space-y-1">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
