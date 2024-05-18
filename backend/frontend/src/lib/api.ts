import type { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { hc } from "hono/client"; 
import type { TAPIRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { TExpense, TCreateExpense } from "@server/sharedTypes";

// const client = hc<TAPIRoutes>("http://localhost:3002/");
const client = hc<TAPIRoutes>("/");

export const api = client.api;

const getCurrentUser = async () => {
  const res = await api.me.$get();
  if (!res.ok) throw new Error("Failed to fetch current user");

  const data = await res.json() as { user: UserType }
  return data;
};

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity
});

export const getExpenses = async () => {
  const res = await api.expenses.$get();
  if (!res.ok) throw new Error("Failed to fetch expenses");

  const data = await res.json() as { expenses: TExpense [] }; 

  return data;
};

export const getExpensesQueryOptions = queryOptions({
  queryKey: ["get-expenses"],
  queryFn: getExpenses,
  staleTime: 1000 * 60 * 5 
});

export const createExpense = async ({ value }: { value: TCreateExpense}) => {
  const res = await api.expenses.$post({ json: value });
  if (!res.ok) throw new Error("Failed to create expense");

  const newExpense = await res.json();
  return newExpense;
};

export const loadingCreateExpenseQueryOptions = queryOptions<{ expense?: TCreateExpense }>({
  queryKey: ["loading-create-expense"],
  queryFn: () => ({}),
  staleTime: Infinity
});