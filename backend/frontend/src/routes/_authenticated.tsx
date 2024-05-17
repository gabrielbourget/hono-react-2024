import { createFileRoute, Outlet } from "@tanstack/react-router"
import { userQueryOptions } from "@/src/lib/api";

const Login = () => {
  return (
    <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
      <div>Please Log In.</div>
      <a href="/api/login">Login</a>
    </div>
  );
}

const AuthRouteComponent = () => {
  const { user } = Route.useRouteContext();

  if (!user) return <Login />;

  return <Outlet />;
}

// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (err) {
      console.error(err);
    }
  },
  component: AuthRouteComponent,
});
