import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from '@eqds';
import { type Task } from '@types';

interface ConfirmTaskDeletionModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string) => void;
}

export const ConfirmTaskDeletionModal: React.FC<ConfirmTaskDeletionModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!task) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Confirm Deletion</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p className="text-body text-text-body">
          Are you sure you want to delete the task <strong className="text-text-heading">"{task.title}"</strong>? 
          This action cannot be undone.
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="flex justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm(task.id);
              onClose();
            }}
          >
            Delete Task
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
