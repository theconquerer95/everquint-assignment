import React from 'react';
import { useTaskStore } from '@hooks/useTaskStore';
import { BoardColumn } from './BoardColumn';
import { Button } from '@eqds';
import { type Task } from '@types';

interface BoardProps {
  filteredTasks: Task[];
  onEditTask?: (task: Task) => void;
  onAddTask?: () => void;
  isFiltered?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  filteredTasks,
  onEditTask,
  onAddTask,
  isFiltered = false,
}) => {
  const tasks = useTaskStore((state) => state.tasks);

  const backlogTasks = filteredTasks.filter((task) => task.status === 'Backlog');
  const inProgressTasks = filteredTasks.filter((task) => task.status === 'In Progress');
  const doneTasks = filteredTasks.filter((task) => task.status === 'Done');

  // Overall App Empty State (No tasks at all in store)
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          Create your first task
        </h3>
        <p className="text-neutral-500 mb-6">
          Your board is empty. Get started by adding a new task to your workflow backlog.
        </p>
        {onAddTask && (
          <Button variant="primary" onClick={onAddTask}>
            Add Task
          </Button>
        )}
      </div>
    );
  }

  // Filter Empty State (No tasks match the active filters)
  if (filteredTasks.length === 0 && isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          No matches found
        </h3>
        <p className="text-neutral-500 mb-6">
          No tasks matched your active filter settings. Try adjusting or clearing your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-stretch w-full">
      <BoardColumn status="Backlog" tasks={backlogTasks} onEdit={onEditTask} />
      <BoardColumn status="In Progress" tasks={inProgressTasks} onEdit={onEditTask} />
      <BoardColumn status="Done" tasks={doneTasks} onEdit={onEditTask} />
    </div>
  );
};
export default Board;
