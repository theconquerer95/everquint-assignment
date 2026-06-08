import React from 'react';
import { type Task, type TaskStatus } from '@types';
import { TaskCard } from './TaskCard';
import { Badge } from '@eqds';
import { type BadgeVariant } from '@eqds/Badge/badge-context';

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit?: (task: Task) => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({ status, tasks, onEdit }) => {
  const getStatusBadgeVariant = (s: TaskStatus): BadgeVariant => {
    switch (s) {
      case 'Backlog':
        return 'status-backlog';
      case 'In Progress':
        return 'status-in-progress';
      case 'Done':
        return 'status-done';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-[280px] bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(status)}>
            {status}
          </Badge>
          <span className="text-xs font-semibold text-neutral-500 bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400 font-medium">No tasks in {status}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  );
};
