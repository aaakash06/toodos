import { TodoProvider } from './contexts/TodoContext';
import Layout from './components/layout/Layout';
import TaskList from './components/tasks/TaskList';
import DraggableTaskList from './components/tasks/DraggableTaskList';
import { useTodo } from './contexts/TodoContext';

function TodoApp() {
  const { currentView, getFilteredTasks } = useTodo();
  const tasks = getFilteredTasks();

  // Use draggable task list only for project view (for drag and drop between projects)
  const shouldUseDraggable = currentView.type === 'project' || currentView.type === 'inbox';

  // Generate the droppable ID based on current view
  const getDroppableId = () => {
    if (currentView.type === 'project' && currentView.projectId) {
      return `project:${currentView.projectId}`;
    }
    return `${currentView.type}:main`;
  };

  return (
    <Layout>
      {shouldUseDraggable ? (
        <DraggableTaskList
          title={getViewTitle(currentView)}
          tasks={tasks}
          droppableId={getDroppableId()}
        />
      ) : (
        <TaskList />
      )}
    </Layout>
  );
}

// Helper function to get view title
function getViewTitle(currentView: { type: string; projectId?: string }) {
  switch (currentView.type) {
    case 'inbox': return 'Inbox';
    case 'today': return 'Today';
    case 'upcoming': return 'Upcoming';
    default: return 'Tasks';
  }
}

export default function App() {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
}
