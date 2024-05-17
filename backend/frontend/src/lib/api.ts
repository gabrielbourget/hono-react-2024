import type { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { hc } from "hono/client"; 
import type { TAPIRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";

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
