import { Hono } from "hono";
import { z } from "zod";
import { getUser } from "@/src/kinde";
import { db } from "@/src/db/index";
import { expenses as expensesTable } from "@/src/db/schema/expenses";
import { and, desc, eq, sum } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.string(),
});

export type TExpense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const mockExpenses: TExpense[] = [
  { id: 1, title: "Groceries", amount: "100" },
  { id: 2, title: "Rent", amount: "1500" },
  { id: 3, title: "Coffee", amount: "5" },
  { id: 4, title: "Transportation", amount: "20" },
  { id: 5, title: "Entertainment", amount: "100" },
  { id: 6, title: "Misc", amount: "50" },
];

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const expenses = await db.select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);

    return c.json({ expenses });
  })


  .get("/total-spent", getUser, async (c) => {
    const user = c.var.user;
    const result = await db.select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then(res => res[0]);
    
    return c.json(result);
  })


  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const expense = await db.select()
    .from(expensesTable)
    .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
    .then(res => res[0]);
    
    if (!expense) return c.notFound();

    return c.json({ expense });
  })


  .post("/", getUser, zValidator("json", createPostSchema), async (c) => {
    const user = c.var.user;
    const expense = c.req.valid("json");

    const createdExpense = await db.insert(expensesTable)
      .values({ ...expense, userId: user.id })
      .returning();

    return c.json(createdExpense);
  })


  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id")); 
    const user = c.var.user;
    
    const expense = await db.delete(expensesTable)
    .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
    .returning();
    
    if (!expense) return c.notFound();

    return c.json({ expense })
  });