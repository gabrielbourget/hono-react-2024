import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/src/lib/api";

const Profile = () => {
  const { isPending, data, error } = useQuery(userQueryOptions);
  
  if (isPending) return "Loading...";

  if (error) return "Error fetching current user.";

  return (
    <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
      <div className="p-2">Hello {data.user.family_name}</div>
      <a href="/api/logout">Logout</a>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
});
