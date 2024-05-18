import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/src/components/ui/table";
import { Skeleton } from '@/src/components/ui/skeleton';
import { getExpensesQueryOptions, loadingCreateExpenseQueryOptions } from '@/src/lib/api';
import { Button } from '@/src/components/ui/button';
import { Trash } from 'lucide-react';

const Expenses = () => {
  const { isPending, data, error } = useQuery(getExpensesQueryOptions);
  const { data: loadingCreateExpense } = useQuery(loadingCreateExpenseQueryOptions);
  
  if (error) return "Error fetching expenses.";
  
  return (
    <div className="p-2 max-w-3xl m-auto">
      <Table>
        <TableCaption>A list of your recent expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            loadingCreateExpense?.expense ? (
              <TableRow>
                <TableCell className="font-medium"><Skeleton className="h-4" /></TableCell>
                <TableCell>{loadingCreateExpense?.expense.title}</TableCell>
                <TableCell>{loadingCreateExpense?.expense.amount}</TableCell>
                <TableCell>{loadingCreateExpense?.expense.date.split("T")[0]}</TableCell>
                <TableCell><Skeleton className="h-4" /></TableCell>
              </TableRow>
            ) : undefined
          }
          {
            isPending ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium"><Skeleton className="h-4" /></TableCell>
                  <TableCell><Skeleton className="h-4" /></TableCell>
                  <TableCell><Skeleton className="h-4" /></TableCell>
                  <TableCell><Skeleton className="h-4" /></TableCell>
                  <TableCell><Skeleton className="h-4" /></TableCell>
                </TableRow>
              ))
            ) : (
              data?.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.date.split("T")[0]}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" onClick={() => null}><Trash /></Button>
                  </TableCell>
                </TableRow>
              ))
            )
          }
        </TableBody>
      </Table>
    </div>
  )
};

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
});
