import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

type TRouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<TRouterContext>()({
  component: () => (
    <>
      <Navbar />
      <Root />
    </>
  ),
});

const Navbar = () => (
  <>
    <div className="p-2 flex justify-between max-w-2xl m-auto items-baseline">
      <Link to="/" className="[&.active]:font-bold">
        <h1 className="text-xl font-bold">Expense Tracker</h1>
      </Link>
      <div className="flex gap-2">
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          Create
        </Link>
      </div>
    </div>
    <hr />
  </>
);

const Root = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
);
