import { useState } from 'react';
import { FiPlus, FiCalendar, FiFlag } from 'react-icons/fi';
import { useTodo } from '../../contexts/TodoContext';
import type { Priority } from '../../types';

export default function AddTask() {
  const { addTask, currentView } = useTodo();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskContent, setTaskContent] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<Priority>(4);

  const handleAddTask = () => {
    if (!taskContent.trim()) return;

    // Determine projectId based on current view
    let projectId: string | null = null;
    if (currentView.type === 'project' && currentView.projectId) {
      projectId = currentView.projectId;
    } else if (currentView.type === 'inbox') {
      projectId = 'inbox';
    }

    addTask({
      content: taskContent.trim(),
      completed: false,
      projectId,
      sectionId: null,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      labels: []
    });

    // Reset form
    setTaskContent('');
    setDueDate('');
    setPriority(4);
    setIsAddingTask(false);
  };

  // Get priority style
  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  // Handle pressing Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
    }
  };

  if (!isAddingTask) {
    return (
      <button
        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors p-2"
        onClick={() => setIsAddingTask(true)}
      >
        <FiPlus />
        <span>Add task</span>
      </button>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Task name"
        value={taskContent}
        onChange={(e) => setTaskContent(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        autoFocus
      />

      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          <button
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() => document.getElementById('due-date')?.click()}
          >
            <FiCalendar />
          </button>
          <input
            id="due-date"
            type="date"
            className="text-sm border border-gray-300 rounded-md p-1 hidden"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="relative group">
            <button className={`${getPriorityColor(priority)} hover:text-gray-700 p-1`}>
              <FiFlag />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md p-2 hidden group-hover:block z-10">
              <div className="space-y-2">
                <button
                  className="text-red-500 hover:bg-gray-100 p-1 rounded-md w-full text-left"
                  onClick={() => setPriority(1)}
                >
                  Priority 1
                </button>
                <button
                  className="text-orange-500 hover:bg-gray-100 p-1 rounded-md w-full text-left"
                  onClick={() => setPriority(2)}
                >
                  Priority 2
                </button>
                <button
                  className="text-blue-500 hover:bg-gray-100 p-1 rounded-md w-full text-left"
                  onClick={() => setPriority(3)}
                >
                  Priority 3
                </button>
                <button
                  className="text-gray-400 hover:bg-gray-100 p-1 rounded-md w-full text-left"
                  onClick={() => setPriority(4)}
                >
                  Priority 4
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-x-2">
          <button
            className="px-3 py-1 text-gray-500 hover:text-gray-700 rounded-md"
            onClick={() => setIsAddingTask(false)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddTask}
            disabled={!taskContent.trim()}
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  );
}
