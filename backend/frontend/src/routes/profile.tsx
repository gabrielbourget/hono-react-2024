import { type UserType } from "@kinde-oss/kinde-typescript-sdk";
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";

export const Route = createFileRoute('/profile')({
  component: Profile,
})

const getCurrentUser = async () => {
  const res = await api.me.$get();
  if (!res.ok) throw new Error("Failed to fetch current user");

  return await res.json() as { user: UserType };
}

function Profile() {
  const { isPending, data, error } = useQuery({ queryKey: ["get-current-user"], queryFn: getCurrentUser});
  
  if (isPending) return "Loading...";

  if (error) return "Error fetching current user.";

  return (
    <div className="p-2">Hello {data.user.family_name}</div>
  );
}
