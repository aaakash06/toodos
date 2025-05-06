import { useMemo, useState } from 'react';
import {
  FiInbox,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiCircle,
  FiClock
} from 'react-icons/fi';
import { useTodo } from '../../contexts/TodoContext';
import AddProject from '../projects/AddProject';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { projects, currentView, setCurrentView } = useTodo();
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  // Filter out the inbox project
  const userProjects = useMemo(() => {
    return projects.filter(project => project.id !== 'inbox');
  }, [projects]);

  const handleViewChange = (type: 'inbox' | 'today' | 'upcoming' | 'project', projectId?: string) => {
    if (type === 'project' && projectId) {
      setCurrentView({ type, projectId });
    } else {
      setCurrentView({ type });
    }
  };

  const isActive = (type: 'inbox' | 'today' | 'upcoming' | 'project', projectId?: string) => {
    if (currentView.type !== type) return false;
    if (type === 'project' && projectId) {
      return currentView.projectId === projectId;
    }
    return true;
  };

  return (
    <>
      <aside
        className={`bg-[#FAFAFA] text-gray-700 border-r border-gray-300 h-[calc(100vh-48px)] overflow-y-auto transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-4">
          <nav className="space-y-1">
            {/* Inbox */}
            <button
              className={`w-full flex items-center gap-2 py-2 px-3 rounded-md ${
                isActive('inbox') ? 'bg-[#ececec] font-medium' : 'hover:bg-[#ececec]'
              }`}
              onClick={() => handleViewChange('inbox')}
            >
              <FiInbox className="text-[#246fe0]" />
              <span>Inbox</span>
            </button>

            {/* Today */}
            <button
              className={`w-full flex items-center gap-2 py-2 px-3 rounded-md ${
                isActive('today') ? 'bg-[#ececec] font-medium' : 'hover:bg-[#ececec]'
              }`}
              onClick={() => handleViewChange('today')}
            >
              <FiCalendar className="text-[#058527]" />
              <span>Today</span>
            </button>

            {/* Upcoming */}
            <button
              className={`w-full flex items-center gap-2 py-2 px-3 rounded-md ${
                isActive('upcoming') ? 'bg-[#ececec] font-medium' : 'hover:bg-[#ececec]'
              }`}
              onClick={() => handleViewChange('upcoming')}
            >
              <FiClock className="text-[#692fc2]" />
              <span>Upcoming</span>
            </button>
          </nav>

          {/* Projects Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 py-2">
              <button
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                onClick={() => setProjectsExpanded(!projectsExpanded)}
              >
                {projectsExpanded ? <FiChevronDown /> : <FiChevronRight />}
                <span className="text-sm font-medium">Projects</span>
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 p-1"
                onClick={() => setIsAddProjectOpen(true)}
                aria-label="Add Project"
              >
                <FiPlus />
              </button>
            </div>

            {projectsExpanded && (
              <div className="mt-1 space-y-1">
                {userProjects.map((project) => (
                  <button
                    key={project.id}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-md ${
                      isActive('project', project.id) ? 'bg-[#ececec] font-medium' : 'hover:bg-[#ececec]'
                    }`}
                    onClick={() => handleViewChange('project', project.id)}
                  >
                    <FiCircle style={{ color: project.color }} className="text-xs" />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      <AddProject isOpen={isAddProjectOpen} onClose={() => setIsAddProjectOpen(false)} />
    </>
  );
}
