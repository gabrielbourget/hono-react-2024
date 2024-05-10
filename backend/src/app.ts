import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "@/src/routes/expenses";

const app = new Hono();

app.use("*", logger());

app.get("/test", c => {
  return c.json({ "response": "hello" });
});

app.route("/api/expenses", expensesRoute);

export default app;
