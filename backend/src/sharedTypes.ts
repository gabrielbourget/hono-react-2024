import { z } from "zod";

import { insertExpenseSchema, selectExpenseSchema } from "./db/schema/expenses";

export type TExpense = z.infer<typeof selectExpenseSchema>;

export const createExpenseSchema = insertExpenseSchema.omit({ id: true, userId: true });
