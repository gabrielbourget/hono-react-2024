import app from "@/src/app";

Bun.serve({
  port: 3002,
  fetch: app.fetch,
});

console.log("Server is up.");
