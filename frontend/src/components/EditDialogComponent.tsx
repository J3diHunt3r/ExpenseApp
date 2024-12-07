// components/DialogComponent.tsx
import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../src/components/ui/dialog';
import { Button } from '../../src/components/ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

const EditDialogComponent = ({
  isOpen,
  onClose,
  expenseToEdit,
  onSubmit,
  title,
  setTitle,
  amount,
  setAmount
}: {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit: any;
  onSubmit: () => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'title') {
      setTitle(event.target.value);
    } else if (event.target.name === 'amount') {
      setAmount(event.target.value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
          <DialogDescription>
            {expenseToEdit ? 'Edit your expense details' : 'Add a new expense.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Expense Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="Enter expense title"
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              value={amount}
              onChange={handleChange}
              placeholder="Enter amount"
              type="number"
            />
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit}>{expenseToEdit ? 'Save Changes' : 'Add Expense'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogComponent;
