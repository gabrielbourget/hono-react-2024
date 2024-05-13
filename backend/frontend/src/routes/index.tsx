import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { api } from "@/src/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute('/')({
  component: Index,
});

const getTotalSpent = async () => {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) throw new Error("Failed to fetch total spent");

  return await res.json() as { total: number };
}

function Index() {
  const { isPending, data, error } = useQuery({ queryKey: ["get-total-spent"], queryFn: getTotalSpent});
  
  if (isPending) return "Loading...";

  if (error) return "Error fetching total spent.";
  
  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you've spent </CardDescription>
      </CardHeader>
      <CardContent>{data.total}</CardContent>
    </Card>
  );
}
