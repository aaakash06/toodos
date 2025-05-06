import { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type Task, type Project, type Section, Priority, type ViewType } from '../types';
import { format } from 'date-fns';

interface TodoState {
  tasks: Task[];
  projects: Project[];
  currentView: ViewType;
}

type TodoAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; changes: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string } // Task ID
  | { type: 'COMPLETE_TASK'; payload: string } // Task ID
  | { type: 'ADD_PROJECT'; payload: { name: string; color: string } }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; changes: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: string } // Project ID
  | { type: 'ADD_SECTION'; payload: { name: string; projectId: string } }
  | { type: 'UPDATE_SECTION'; payload: { id: string; changes: Partial<Section> } }
  | { type: 'DELETE_SECTION'; payload: string } // Section ID
  | { type: 'MOVE_TASK'; payload: { taskId: string; destination: { projectId?: string; sectionId?: string; index?: number } } }
  | { type: 'SET_CURRENT_VIEW'; payload: ViewType };

interface TodoContextType extends TodoState {
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, changes: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  addProject: (name: string, color: string) => void;
  updateProject: (id: string, changes: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addSection: (name: string, projectId: string) => void;
  updateSection: (id: string, changes: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  moveTask: (taskId: string, destination: { projectId?: string; sectionId?: string; index?: number }) => void;
  setCurrentView: (viewType: ViewType) => void;
  getFilteredTasks: () => Task[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Sample initial data
const defaultProjects: Project[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    color: '#ff0000',
    order: 0,
    sections: [],
    tasks: []
  }
];

// Sample tasks
const sampleTasks: Task[] = [
  {
    id: '1',
    content: 'Complete Todoist clone project',
    completed: false,
    projectId: 'inbox',
    sectionId: null,
    priority: 1,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    createdAt: new Date(),
    labels: []
  },
  {
    id: '2',
    content: 'Learn about React DnD',
    completed: false,
    projectId: 'inbox',
    sectionId: null,
    priority: 2,
    dueDate: new Date(),
    createdAt: new Date(),
    labels: []
  },
  {
    id: '3',
    content: 'Set up project architecture',
    completed: true,
    projectId: 'inbox',
    sectionId: null,
    priority: 3,
    dueDate: null,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    labels: []
  },
  {
    id: '4',
    content: 'Add dark mode support',
    completed: false,
    projectId: 'inbox',
    sectionId: null,
    priority: 4,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    createdAt: new Date(),
    labels: []
  },
  // Personal project tasks
  {
    id: '5',
    content: 'Go for a run',
    completed: false,
    projectId: 'personal',
    sectionId: null,
    priority: 2,
    dueDate: new Date(),
    createdAt: new Date(),
    labels: []
  },
  {
    id: '6',
    content: 'Read a book',
    completed: false,
    projectId: 'personal',
    sectionId: null,
    priority: 3,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    createdAt: new Date(),
    labels: []
  },
  // Work project tasks
  {
    id: '7',
    content: 'Prepare presentation',
    completed: false,
    projectId: 'work',
    sectionId: null,
    priority: 1,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    createdAt: new Date(),
    labels: []
  },
  {
    id: '8',
    content: 'Send weekly report',
    completed: false,
    projectId: 'work',
    sectionId: null,
    priority: 2,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    createdAt: new Date(),
    labels: []
  },
];

// Sample projects
const sampleProjects: Project[] = [
  ...defaultProjects,
  {
    id: 'personal',
    name: 'Personal',
    color: '#ff9933',
    order: 1,
    sections: [],
    tasks: []
  },
  {
    id: 'work',
    name: 'Work',
    color: '#14aaf5',
    order: 2,
    sections: [],
    tasks: []
  }
];

// Initial state with sample data
const initialState: TodoState = {
  tasks: sampleTasks,
  projects: sampleProjects,
  currentView: { type: 'inbox' }
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date()
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask]
      };
    }

    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.changes }
            : task
        )
      };
    }

    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    }

    case 'COMPLETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        )
      };
    }

    case 'ADD_PROJECT': {
      const newProject: Project = {
        id: uuidv4(),
        name: action.payload.name,
        color: action.payload.color,
        order: state.projects.length,
        sections: [],
        tasks: []
      };
      return {
        ...state,
        projects: [...state.projects, newProject]
      };
    }

    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { ...project, ...action.payload.changes }
            : project
        )
      };
    }

    case 'DELETE_PROJECT': {
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        tasks: state.tasks.filter(task => task.projectId !== action.payload)
      };
    }

    case 'ADD_SECTION': {
      const newSection: Section = {
        id: uuidv4(),
        name: action.payload.name,
        projectId: action.payload.projectId,
        order: 0, // Will be updated
        tasks: []
      };

      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === action.payload.projectId) {
            return {
              ...project,
              sections: [...project.sections, newSection]
            };
          }
          return project;
        })
      };
    }

    case 'UPDATE_SECTION': {
      return {
        ...state,
        projects: state.projects.map(project => {
          const updatedSections = project.sections.map(section =>
            section.id === action.payload.id
              ? { ...section, ...action.payload.changes }
              : section
          );
          return { ...project, sections: updatedSections };
        })
      };
    }

    case 'DELETE_SECTION': {
      return {
        ...state,
        projects: state.projects.map(project => ({
          ...project,
          sections: project.sections.filter(section => section.id !== action.payload)
        })),
        tasks: state.tasks.map(task =>
          task.sectionId === action.payload
            ? { ...task, sectionId: null }
            : task
        )
      };
    }

    case 'MOVE_TASK': {
      const { taskId, destination } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              projectId: destination.projectId ?? task.projectId,
              sectionId: destination.sectionId ?? task.sectionId
            };
          }
          return task;
        })
      };
    }

    case 'SET_CURRENT_VIEW': {
      return {
        ...state,
        currentView: action.payload
      };
    }

    default:
      return state;
  }
}

// Provider component
export function TodoProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or use initialState
  const storedState = localStorage.getItem('todoState');
  const parsedState = storedState ? JSON.parse(storedState) : initialState;

  // Properly parse dates
  if (parsedState.tasks) {
    parsedState.tasks = parsedState.tasks.map((task: Omit<Task, 'dueDate' | 'createdAt'> & { dueDate: string | null; createdAt: string }) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      createdAt: new Date(task.createdAt)
    }));
  }

  const [state, dispatch] = useReducer(todoReducer, parsedState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('todoState', JSON.stringify(state));
  }, [state]);

  // Helper function to filter tasks based on current view
  const getFilteredTasks = (): Task[] => {
    const { currentView, tasks } = state;

    switch (currentView.type) {
      case 'inbox':
        return tasks.filter(task => !task.projectId || task.projectId === 'inbox');

      case 'today': {
        const today = format(new Date(), 'yyyy-MM-dd');
        return tasks.filter(task =>
          task.dueDate && format(task.dueDate, 'yyyy-MM-dd') === today
        );
      }

      case 'upcoming':
        return tasks.filter(task =>
          task.dueDate && task.dueDate >= new Date()
        ).sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
          }
          return 0;
        });

      case 'project':
        if (currentView.projectId) {
          return tasks.filter(task => task.projectId === currentView.projectId);
        }
        return [];

      default:
        return tasks;
    }
  };

  // Context actions
  const value: TodoContextType = {
    ...state,
    addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
    updateTask: (id, changes) => dispatch({ type: 'UPDATE_TASK', payload: { id, changes } }),
    deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
    completeTask: (id) => dispatch({ type: 'COMPLETE_TASK', payload: id }),
    addProject: (name, color) => dispatch({ type: 'ADD_PROJECT', payload: { name, color } }),
    updateProject: (id, changes) => dispatch({ type: 'UPDATE_PROJECT', payload: { id, changes } }),
    deleteProject: (id) => dispatch({ type: 'DELETE_PROJECT', payload: id }),
    addSection: (name, projectId) => dispatch({ type: 'ADD_SECTION', payload: { name, projectId } }),
    updateSection: (id, changes) => dispatch({ type: 'UPDATE_SECTION', payload: { id, changes } }),
    deleteSection: (id) => dispatch({ type: 'DELETE_SECTION', payload: id }),
    moveTask: (taskId, destination) => dispatch({ type: 'MOVE_TASK', payload: { taskId, destination } }),
    setCurrentView: (viewType) => dispatch({ type: 'SET_CURRENT_VIEW', payload: viewType }),
    getFilteredTasks
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// Custom hook to use the TodoContext
export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
