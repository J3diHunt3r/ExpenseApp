import { api } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { TrashIcon, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { toast } from '@/hooks/use-toast';

import ChartsComponent from '@/components/ChartsComponent';
import DrawerComponent from '@/components/DrawerComponent';
import PaginationComponent from '@/components/PaginationComponent';
import { Card } from '@/components/ui/card';
import DeleteDialogComponent from '@/components/DeleteDialogComponent';
import EditDialogComponent from '@/components/EditDialogComponent';

// tanStack autosaves the correct route
export const Route = createFileRoute('/expenses')({
  component: Expenses,
});

async function getAllExpenses() {
  const result = await api.expenses.$get();
  if (!result.ok) {
    throw new Error("Server error");
  }
  const data = await result.json();
  return data;
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: getAllExpenses,
  });

  const queryClient = useQueryClient();  // For invalidating queries

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle delete state (dialog visibility)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  // Edit expense state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseNameToDelete, setExpenseNameToDelete] = useState('');

  if (error) return 'An error has occurred: ' + error.message;

  // Sliced data for the current page
  const paginatedData = data?.expenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Total number of pages
  const totalPages = Math.ceil((data?.expenses.length || 0) / itemsPerPage);

  // Prepare data for the charts
  const paginatedChartData = paginatedData?.map((expense) => ({
    name: expense.title,
    value: expense.amount,
  }));

    // Prepare data for the charts
    const fullChartData = data?.expenses?.map((expense) => ({
      name: expense.title,
      value: expense.amount,
    }));
  

  // Handle deleting an expense
  const handleDeleteExpense = async () => {
    try {
      if (expenseToDelete !== null) {
        console.log('here: ' + expenseToDelete);
        
        await api.expenses[expenseToDelete].$delete();
        queryClient.invalidateQueries(['get-all-expenses']);
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete expense", error);
    }
  };
  

 // Handle editing an expense
 const handleEditExpense = (expense: any) => {
  setExpenseToEdit(expense);
  setTitle(expense.title);
  setAmount(expense.amount.toString());
  setIsEditDialogOpen(true);
};

const handleSubmitExpense = async () => {
  try {
    if (expenseToEdit) {
      // Update existing expense
      await api.expenses[expenseToEdit.id].$put({ title, amount });
      toast({ title: "Expense updated", variant: "success" });
    } else {
      // Add new expense
      await api.expenses.$post({ title, amount });
      toast({ title: "Expense added", variant: "success" });
    }
    queryClient.invalidateQueries(['get-all-expenses']);
    setIsEditDialogOpen(false);
  } catch (error) {
    toast({ title: "Error saving expense", variant: "destructive" });
  }
};


  return (
    <>
      <div className="p-2 max-w-3xl m-auto">
        {/* Table */}
        <Card className="w-[100%] m-auto">
        <Table>
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        <Skeleton className="h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4" />
                      </TableCell>
                    </TableRow>
                  ))
              : paginatedData?.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell className="text-right">{expense.amount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Delete Dialog */}
                        <Button
                          onClick={() => {
                            setExpenseToDelete(expense.id);
                            setExpenseNameToDelete(expense.title);
                            setIsDeleteDialogOpen(true);
                          }}
                          variant="destructive"
                        >
                          <TrashIcon className="text-gray-500 hover:text-red-500" />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-1 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                              Delete
                            </span>
                        </Button>
                        {/* Edit Dialog */}
                        <Button onClick={() => handleEditExpense(expense)} variant="link">
                          <PencilIcon className="text-gray-500 hover:text-blue-500" />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-1 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                              Edit
                            </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <PaginationComponent currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

        </Card>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          {/* Open Drawer Button */}
          <DrawerComponent fullChartData={fullChartData || [] } />
        </div>

        {/* Charts */}
        <div className="flex justify-center gap-8 mt-8">
          {/* Bar Chart */}
          <ChartsComponent chartData={paginatedChartData || []} />
        </div>
        <EditDialogComponent
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          expenseToEdit={expenseToEdit}
          onSubmit={handleSubmitExpense}
          title={title}
          setTitle={setTitle}
          amount={amount}
          setAmount={setAmount}
        />
        <DeleteDialogComponent
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleDeleteExpense}
          expenseName={expenseNameToDelete}
        />
      </div>
    </>
  );
}

export default Expenses;
