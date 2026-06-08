import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TextInputLabel,
  TextInputField,
  TextInputError,
  TextArea,
  TextAreaLabel,
  TextAreaField,
  TextAreaError,
  Select,
  SelectLabel,
  SelectTrigger,
  SelectListbox,
  SelectError,
  Button,
} from '@eqds';
import { type Task, type TaskStatus, type TaskPriority } from '@types';
import { type SelectOption } from '@eqds/Select/select-context';

interface TaskFormProps {
  initialTask?: Task;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  setIsDirty?: (isDirty: boolean) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  onSave,
  onCancel,
  setIsDirty,
}) => {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? 'Backlog');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? 'Medium');
  const [assignee, setAssignee] = useState(initialTask?.assignee ?? '');
  const [tagsInput, setTagsInput] = useState(initialTask?.tags.join(', ') ?? '');

  // Validation error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Monitor for changes to track dirty state
  useEffect(() => {
    const isDirty =
      title !== (initialTask?.title ?? '') ||
      description !== (initialTask?.description ?? '') ||
      status !== (initialTask?.status ?? 'Backlog') ||
      priority !== (initialTask?.priority ?? 'Medium') ||
      assignee !== (initialTask?.assignee ?? '') ||
      tagsInput !== (initialTask?.tags.join(', ') ?? '');

    setIsDirty?.(isDirty);
  }, [title, description, status, priority, assignee, tagsInput, initialTask, setIsDirty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus on first error element
      const firstErrorKey = Object.keys(newErrors)[0];
      const errEl = document.getElementById(firstErrorKey);
      if (errEl) {
        errEl.focus();
      }
      return;
    }

    // Process tags: split by comma, trim whitespace, filter empty values
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee: assignee.trim() || 'Unassigned',
      tags,
    });
  };

  const statusOptions: SelectOption<TaskStatus>[] = [
    { value: 'Backlog', label: 'Backlog' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' },
  ];

  const priorityOptions: SelectOption<TaskPriority>[] = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <TextInput error={errors.title} required id="title">
        <TextInputLabel>Title</TextInputLabel>
        <TextInputField
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          placeholder="Bug: broken login button"
        />
        <TextInputError />
      </TextInput>

      <TextArea error={errors.description} required id="description">
        <TextAreaLabel>Description</TextAreaLabel>
        <TextAreaField
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          placeholder="Describe the task details..."
          rows={5}
        />
        <TextAreaError />
      </TextArea>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select<TaskStatus>
          value={status}
          options={statusOptions}
          onChange={setStatus}
          id="status"
        >
          <SelectLabel>Status</SelectLabel>
          <SelectTrigger />
          <SelectListbox />
          <SelectError />
        </Select>

        <Select<TaskPriority>
          value={priority}
          options={priorityOptions}
          onChange={setPriority}
          id="priority"
        >
          <SelectLabel>Priority</SelectLabel>
          <SelectTrigger />
          <SelectListbox />
          <SelectError />
        </Select>
      </div>

      <TextInput id="assignee">
        <TextInputLabel>Assignee</TextInputLabel>
        <TextInputField
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="John Doe"
        />
      </TextInput>

      <TextInput id="tags">
        <TextInputLabel>Tags</TextInputLabel>
        <TextInputField
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="frontend, bug, high-priority"
        />
        <p className="text-xs text-neutral-400 mt-1">Separate tags with commas</p>
      </TextInput>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialTask ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
