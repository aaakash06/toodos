import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { Task } from '../../types';
import TaskItem from './TaskItem';
import { useTodo } from '../../contexts/TodoContext';
import AddTask from './AddTask';
import { type DragEndResult, parseDroppableId } from '../../utils/dragAndDrop';

interface TaskListProps {
  title: string;
  tasks: Task[];
  droppableId: string;
}

export default function DraggableTaskList({ title, tasks, droppableId }: TaskListProps) {
  const { moveTask } = useTodo();

  const handleDragEnd = (result: DragEndResult) => {
    const { source, destination } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // No movement actually occurred
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Parse the droppable IDs to get type and ID
    const sourceDroppable = parseDroppableId(source.droppableId);
    const destinationDroppable = parseDroppableId(destination.droppableId);

    // Get the task being moved
    const taskId = tasks[source.index].id;

    // Update the task with the new project/section ID
    moveTask(taskId, {
      projectId: destinationDroppable.type === 'project' ? destinationDroppable.id : undefined,
      sectionId: destinationDroppable.type === 'section' ? destinationDroppable.id : undefined,
      index: destination.index
    });
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              className="space-y-1"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? 'opacity-70 shadow-md' : ''}`}
                    >
                      <TaskItem task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-4">
        <AddTask />
      </div>
    </div>
  );
}
