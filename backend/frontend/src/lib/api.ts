import { hc } from "hono/client"; 
import type { TAPIRoutes } from "@server/app";

// const client = hc<TAPIRoutes>("http://localhost:3002/");
const client = hc<TAPIRoutes>("/");

export const api = client.api;
