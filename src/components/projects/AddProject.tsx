import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useTodo } from '../../contexts/TodoContext';

interface AddProjectProps {
  isOpen: boolean;
  onClose: () => void;
}

const colorOptions = [
  { name: 'Berry Red', value: '#b8256f' },
  { name: 'Red', value: '#db4035' },
  { name: 'Orange', value: '#ff9933' },
  { name: 'Yellow', value: '#fad000' },
  { name: 'Olive Green', value: '#afb83b' },
  { name: 'Lime Green', value: '#7ecc49' },
  { name: 'Green', value: '#299438' },
  { name: 'Mint Green', value: '#6accbc' },
  { name: 'Teal', value: '#158fad' },
  { name: 'Sky Blue', value: '#14aaf5' },
  { name: 'Light Blue', value: '#96c3eb' },
  { name: 'Blue', value: '#4073ff' },
  { name: 'Grape', value: '#884dff' },
  { name: 'Violet', value: '#af38eb' },
  { name: 'Lavender', value: '#eb96eb' },
  { name: 'Magenta', value: '#e05194' },
  { name: 'Salmon', value: '#ff8d85' },
  { name: 'Charcoal', value: '#808080' },
  { name: 'Grey', value: '#b8b8b8' },
  { name: 'Taupe', value: '#ccac93' }
];

export default function AddProject({ isOpen, onClose }: AddProjectProps) {
  const { addProject } = useTodo();
  const [projectName, setProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

  const handleAddProject = () => {
    if (!projectName.trim()) return;

    addProject(projectName.trim(), selectedColor);

    // Reset form
    setProjectName('');
    setSelectedColor(colorOptions[0].value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Add project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="project-name"
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-4">
            <p className="block text-sm font-medium text-gray-700 mb-1">Color</p>
            <div className="grid grid-cols-10 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  className={`w-6 h-6 rounded-full ${
                    selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddProject}
            disabled={!projectName.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
