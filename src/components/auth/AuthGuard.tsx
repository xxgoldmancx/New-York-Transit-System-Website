import { ReactNode } from "react";
import { Login } from "@/pages/Login";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isError } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background dark">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // If error (like 401 Unauthorized), show login page
  if (isError || !user) {
    return <Login />;
  }

  return <>{children}</>;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey() }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background dark">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 bg-background dark text-center px-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Access denied</h1>
        <p className="text-muted-foreground max-w-sm">
          This area is restricted to server administrators. Head back to your profile instead.
        </p>
        <a href="/profile" className="mt-2 text-sm font-medium text-primary hover:underline">
          Go to My Profile
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
