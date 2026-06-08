import React from 'react';
import { 
  TextInput, 
  TextInputLabel, 
  TextInputField, 
  Select, 
  SelectLabel, 
  SelectTrigger, 
  SelectListbox, 
  Button 
} from '@eqds';
import { type TaskStatus, type TaskPriority } from '@types';
import { type TaskFilters, type SortField, type SortOrder } from '@hooks/useTaskFilters';

interface BoardFiltersProps {
  filters: TaskFilters;
  onFilterChange: (filters: Partial<TaskFilters>) => void;
  onClearFilters: () => void;
}

export const BoardFilters: React.FC<BoardFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const statusOptions = [
    { label: 'Backlog', value: 'Backlog' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Done', value: 'Done' },
  ];

  const priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
  ];

  const sortOptions = [
    { label: 'Recently Updated', value: 'updatedAt:desc' },
    { label: 'Oldest Updated', value: 'updatedAt:asc' },
    { label: 'Recently Created', value: 'createdAt:desc' },
    { label: 'Oldest Created', value: 'createdAt:asc' },
    { label: 'Priority (High to Low)', value: 'priority:desc' },
    { label: 'Priority (Low to High)', value: 'priority:asc' },
  ];

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(':') as [SortField, SortOrder];
    onFilterChange({ sortBy, sortOrder });
  };

  const currentSortValue = `${filters.sortBy}:${filters.sortOrder}`;

  return (
    <div className="flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <TextInput>
          <TextInputLabel>Search tasks</TextInputLabel>
          <TextInputField
            placeholder="Title or description..."
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange({ search: e.target.value })}
          />
        </TextInput>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Status</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  const newStatus = filters.status.includes(opt.value as TaskStatus)
                    ? filters.status.filter((s) => s !== opt.value)
                    : [...filters.status, opt.value as TaskStatus];
                  onFilterChange({ status: newStatus });
                }}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.status.includes(opt.value as TaskStatus)
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Priority</label>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  const newPriority = filters.priority.includes(opt.value as TaskPriority)
                    ? filters.priority.filter((p) => p !== opt.value)
                    : [...filters.priority, opt.value as TaskPriority];
                  onFilterChange({ priority: newPriority });
                }}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.priority.includes(opt.value as TaskPriority)
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Select
          value={currentSortValue}
          options={sortOptions}
          onChange={handleSortChange}
        >
          <SelectLabel>Sort by</SelectLabel>
          <SelectTrigger />
          <SelectListbox />
        </Select>
      </div>

      {(filters.status.length > 0 || filters.priority.length > 0 || filters.search) && (
        <div className="flex justify-end border-t border-neutral-200 dark:border-neutral-800 pt-3">
          <Button variant="secondary" size="sm" onClick={onClearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};
