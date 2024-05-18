import { Hono } from "hono";
import { getUser } from "@/src/kinde";
import { db } from "@/src/db/index";
import { expenses as expensesTable } from "@/src/db/schema/expenses";
import { and, desc, eq, sum } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createExpenseSchema } from "../sharedTypes";

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


  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
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