import { date, index, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  date: date("date").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (expenses) => {
  return {
    userIdIndex: index("user_id_idx").on(expenses.userId),
  }
});

export const insertExpenseSchema = createInsertSchema(expenses, {
  id: z.number().int().positive().min(1),
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters."})
    .max(100, { message: "Title must be less than 100 characters."}),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Amount must be a valid monetary amount."}), 
});
export const selectExpenseSchema = createSelectSchema(expenses);
