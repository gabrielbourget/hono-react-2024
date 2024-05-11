import { Hono } from "hono";
import { z } from "zod";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type TExpense = z.infer<typeof expenseSchema>;

const createPostSchema = z.object({
  title: z.string(),
  amount: z.number(),
});

const mockExpenses: TExpense[] = [
  { id: 1, title: "Groceries", amount: 100 },
  { id: 2, title: "Rent", amount: 1500 },
  { id: 3, title: "Coffee", amount: 5 },
  { id: 4, title: "Transportation", amount: 20 },
  { id: 5, title: "Entertainment", amount: 100 },
  { id: 6, title: "Misc", amount: 50 },
];

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: mockExpenses });
  })
  .get("/total-spent", (c) => {
    const total = mockExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    return c.json({ total });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id")); 
    const expense = mockExpenses.find((expense) => expense.id === id);
    
    if (!expense) return c.notFound();

    return c.json({ expense });
  })
  .post("/", async (c) => {
    const data = await c.req.json();
    const expense = createPostSchema.parse(data);
    console.log(expense); 
    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id")); 
    const index = mockExpenses.findIndex((expense) => expense.id === id);
    
    if (index === -1) return c.notFound();

    const deletedExpense = mockExpenses.splice(index, 1)[0];

    return c.json({ expense: deletedExpense })
  });
  // - TODO: -> put
