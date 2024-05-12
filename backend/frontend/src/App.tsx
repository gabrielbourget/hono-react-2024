import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import "./App.css";
import { api } from "@/src/lib/api";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      // const res = await client.api.expenses["total-spent"].$get();
      const res = await api.expenses["total-spent"].$get();
      const data = await res.json() as { total: number };
      setTotalSpent(data.total);
    };

    fetchTotal(); 
  }, []);

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you've spent </CardDescription>
      </CardHeader>
      <CardContent>{totalSpent}</CardContent>
    </Card>
  );
}

export default App;
