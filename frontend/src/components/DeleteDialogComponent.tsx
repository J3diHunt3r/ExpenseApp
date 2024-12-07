// components/DeleteDialogComponent.tsx
import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../src/components/ui/dialog';
import { Button } from '../../src/components/ui/button';

const DeleteDialogComponent = ({
  isOpen,
  onClose,
  onDelete,
  expenseName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  expenseName: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the expense "{expenseName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialogComponent;
