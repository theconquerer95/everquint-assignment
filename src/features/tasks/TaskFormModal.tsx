import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '@eqds';
import { TaskForm } from './TaskForm';
import { type Task } from '../../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  initialTask,
  onSave,
}) => {
  const [isDirty, setIsDirty] = useState(false);

  const handleCancelOrClose = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to discard them?'
      );
      if (!confirmLeave) return;
    }
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleCancelOrClose}>
      <ModalHeader>
        <ModalTitle>
          {initialTask ? 'Edit Task' : 'Create New Task'}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="pt-2">
          <TaskForm
            initialTask={initialTask}
            onSave={(data) => {
              onSave(data);
              onClose();
            }}
            onCancel={handleCancelOrClose}
            setIsDirty={setIsDirty}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};
