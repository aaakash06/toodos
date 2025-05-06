import { useState } from 'react';
import { FiCircle, FiCheckCircle, FiCalendar, FiFlag, FiTrash, FiEdit } from 'react-icons/fi';
import { format } from 'date-fns';
import type { Task, Priority } from '../../types';
import { useTodo } from '../../contexts/TodoContext';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { completeTask, deleteTask, updateTask } = useTodo();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.content);

  // Get the color based on priority
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const handleComplete = () => {
    completeTask(task.id);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      updateTask(task.id, { content: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(task.content);
    }
  };

  return (
    <div
      className={`group flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors ${
        task.completed ? 'opacity-60' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`flex-shrink-0 mt-0.5 ${task.completed ? 'text-green-500' : ''}`}
        onClick={handleComplete}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed ? <FiCheckCircle className="text-green-500" /> : <FiCircle />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <>
            <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.content}
            </p>

            {task.dueDate && (
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <FiCalendar className="mr-1" />
                <span>{format(task.dueDate, 'MMM d')}</span>
              </div>
            )}
          </>
        )}
      </div>

      {isHovered && !isEditing && (
        <div className="flex items-center space-x-1 text-gray-400">
          <button
            className="p-1 hover:text-gray-700 transition-colors"
            onClick={handleEdit}
            aria-label="Edit task"
          >
            <FiEdit />
          </button>
          <button
            className="p-1 hover:text-red-500 transition-colors"
            onClick={handleDelete}
            aria-label="Delete task"
          >
            <FiTrash />
          </button>
          <button
            className={`p-1 hover:text-yellow-500 transition-colors ${getPriorityColor(task.priority)}`}
            aria-label="Set priority"
          >
            <FiFlag />
          </button>
        </div>
      )}
    </div>
  );
}
