import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type Task, type TaskStatus, type TaskPriority } from '@types';

export type SortField = 'createdAt' | 'updatedAt' | 'priority';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilters {
  status: TaskStatus[];
  priority: TaskPriority[];
  search: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export const useTaskFilters = (tasks: Task[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo((): TaskFilters => {
    const statusParam = searchParams.get('status');
    const priorityParam = searchParams.get('priority');
    const searchParam = searchParams.get('q') || '';
    const sortByParam = searchParams.get('sort') as SortField || 'updatedAt';
    const sortOrderParam = (searchParams.get('order') as SortOrder) || 'desc';

    return {
      status: statusParam ? (statusParam.split(',') as TaskStatus[]) : [],
      priority: priorityParam ? (priorityParam.split(',') as TaskPriority[]) : [],
      search: searchParam,
      sortBy: sortByParam,
      sortOrder: sortOrderParam,
    };
  }, [searchParams]);

  const setFilters = (newFilters: Partial<TaskFilters>) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    if (newFilters.status !== undefined) {
      if (newFilters.status.length > 0) {
        updatedParams.set('status', newFilters.status.join(','));
      } else {
        updatedParams.delete('status');
      }
    }

    if (newFilters.priority !== undefined) {
      if (newFilters.priority.length > 0) {
        updatedParams.set('priority', newFilters.priority.join(','));
      } else {
        updatedParams.delete('priority');
      }
    }

    if (newFilters.search !== undefined) {
      if (newFilters.search) {
        updatedParams.set('q', newFilters.search);
      } else {
        updatedParams.delete('q');
      }
    }

    if (newFilters.sortBy !== undefined) {
      updatedParams.set('sort', newFilters.sortBy);
    }

    if (newFilters.sortOrder !== undefined) {
      updatedParams.set('order', newFilters.sortOrder);
    }

    setSearchParams(updatedParams);
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Status Filter
    if (filters.status.length > 0) {
      result = result.filter((task) => filters.status.includes(task.status));
    }

    // Priority Filter
    if (filters.priority.length > 0) {
      result = result.filter((task) => filters.priority.includes(task.priority));
    }

    // Text Search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'priority') {
        const priorityMap: Record<TaskPriority, number> = { High: 3, Medium: 2, Low: 1 };
        comparison = priorityMap[a.priority] - priorityMap[b.priority];
      } else {
        comparison = new Date(a[filters.sortBy]).getTime() - new Date(b[filters.sortBy]).getTime();
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [tasks, filters]);

  const clearFilters = () => {
    setSearchParams({});
  };

  return {
    filters,
    setFilters,
    filteredAndSortedTasks,
    clearFilters,
    isFiltered: filters.status.length > 0 || filters.priority.length > 0 || !!filters.search,
  };
};
