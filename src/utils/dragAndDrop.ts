import type { DropResult } from '@hello-pangea/dnd';
import type { Task } from '../types';

export interface TaskListMapping {
  [key: string]: Task[];
}

export interface DragEndResult extends DropResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
}

/**
 * Reorders tasks within the same list
 */
export const reorderTasks = (
  list: Task[],
  startIndex: number,
  endIndex: number
): Task[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves a task from one list to another
 */
export const moveBetweenLists = (
  sourceList: Task[],
  destinationList: Task[],
  source: {
    index: number;
  },
  destination: {
    index: number;
  }
): {
  sourceList: Task[];
  destinationList: Task[];
  movedTask: Task;
} => {
  const sourceClone = Array.from(sourceList);
  const destClone = Array.from(destinationList);

  const [removed] = sourceClone.splice(source.index, 1);
  destClone.splice(destination.index, 0, removed);

  return {
    sourceList: sourceClone,
    destinationList: destClone,
    movedTask: removed
  };
};

/**
 * Parse a droppableId to get the type and id
 * Format: type:id (e.g., "project:123" or "section:456")
 */
export const parseDroppableId = (droppableId: string): { type: string; id: string } => {
  const [type, id] = droppableId.split(':');
  return { type, id };
};
