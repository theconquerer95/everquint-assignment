import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@eqds';
import { type Task, type TaskStatus } from '@types';
import { useTaskStore } from '@hooks/useTaskStore';
import { formatDistanceToNow } from 'date-fns';
import { type BadgeVariant } from '@eqds/Badge/badge-context';
import { ConfirmTaskDeletionModal } from './ConfirmTaskDeletionModal';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const moveTask = useTaskStore((state) => state.moveTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getPriorityColor = (priority: Task['priority']): BadgeVariant => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return 'default';
    }
  };

  const formattedTime = (() => {
    try {
      return formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true });
    } catch {
      return 'some time ago';
    }
  })();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    moveTask(task.id, e.target.value as TaskStatus);
  };

  return (
    <>
      <Card wrapperClassName="hover:shadow-md transition-shadow duration-200">
        <CardHeader wrapperClassName="flex flex-row items-start justify-between gap-2 pb-2">
          <div className="flex flex-col gap-1">
            <CardTitle wrapperClassName="text-base font-semibold leading-tight line-clamp-2">
              {task.title}
            </CardTitle>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent wrapperClassName="py-2 text-sm text-neutral-600 dark:text-neutral-300">
          <p className="line-clamp-3 mb-3 break-words whitespace-pre-wrap">{task.description}</p>
          
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="tag" wrapperClassName="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span>Assignee: <strong className="text-neutral-700 dark:text-neutral-200">{task.assignee || 'Unassigned'}</strong></span>
            <span>{formattedTime}</span>
          </div>
        </CardContent>

        <div className="px-6 pb-4 flex items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-500/10">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 py-1 px-2 rounded cursor-pointer border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            aria-label="Change task status"
          >
            <option value="Backlog">Backlog</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(task)}
                aria-label="Edit task"
              >
                Edit
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label="Delete task"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      <ConfirmTaskDeletionModal
        task={task}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={(taskId) => deleteTask(taskId)}
      />
    </>
  );
};
