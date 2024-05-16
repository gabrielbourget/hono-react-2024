import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { api } from "@/src/lib/api";
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/src/components/ui/table";
import { Skeleton } from '@/src/components/ui/skeleton';
import type { TExpense } from "@server/routes/expenses";

const getExpenses = async () => {
  const res = await api.expenses.$get();
  if (!res.ok) throw new Error("Failed to fetch expenses");

  const data = await res.json() as { expenses: TExpense[] }; 

  return data;
};

const Expenses = () => {
  const { isPending, data, error } = useQuery({ queryKey: ["get-expenses"], queryFn: getExpenses});
  
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            isPending ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium"><Skeleton className="h-4" /></TableCell>
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
                </TableRow>
              ))
            )
          }
        </TableBody>
      </Table>
    </div>
  )
};

export const Route = createFileRoute('/expenses')({
  component: Expenses,
});
