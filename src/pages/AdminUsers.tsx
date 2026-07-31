const useGetMe = () => ({ data: null });
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, ShieldAlert, Key, Loader2, Mail, MessageSquare } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type AdminUser = {
  id: number;
  username: string;
  avatar: string | null;
  isAdmin: boolean;
  authProvider: string;
  email: string | null;
  createdAt: string;
};

export function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: me } = useGetMe();

  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    }
  });

  const grantAdmin = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch("/api/admin/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Failed to grant admin");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Admin rights granted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const revokeAdmin = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch("/api/admin/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Failed to revoke admin");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Admin rights revoked" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "discord": return <MessageSquare className="w-3 h-3" />;
      case "google": return <Chrome className="w-3 h-3" />;
      case "github": return <Github className="w-3 h-3" />;
      case "email": return <Mail className="w-3 h-3" />;
      default: return null;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "discord": return "bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30";
      case "google": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "github": return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      case "email": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Key className="w-7 h-7 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">System Users</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-wider">Root access management</p>
        </div>
      </div>

      <div className="bg-card/40 border border-primary/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
        <Table>
          <TableHeader className="bg-black/40">
            <TableRow className="border-primary/20 hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Identity</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Auth Vector</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Created</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Clearance</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            )}
            {users?.map((user) => (
              <TableRow key={user.id} className="border-primary/10 hover:bg-white/5 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 border border-primary/30 rounded-lg group-hover:shadow-[0_0_10px_rgba(255,0,255,0.3)] transition-all">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className="rounded-lg bg-black text-primary font-display font-bold">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-display font-bold text-foreground">{user.username}</div>
                      <div className="text-xs text-muted-foreground font-mono">{user.email || 'No email provided'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`font-mono text-[10px] uppercase px-2 py-0.5 flex items-center gap-1.5 w-max ${getProviderColor(user.authProvider)}`}>
                    {getProviderIcon(user.authProvider)}
                    {user.authProvider}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-mono text-muted-foreground">
                  {format(new Date(user.createdAt), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(255,0,255,0.3)] font-mono text-[10px] uppercase px-2">
                      <ShieldAlert className="w-3 h-3 mr-1" /> Root
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30 font-mono text-[10px] uppercase px-2">
                      <Shield className="w-3 h-3 mr-1" /> User
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {me?.id !== user.id.toString() && (
                    user.isAdmin ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => revokeAdmin.mutate(user.id)}
                        disabled={revokeAdmin.isPending}
                        className="bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive hover:text-white font-mono text-xs uppercase hover-juicy"
                      >
                        Revoke
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => grantAdmin.mutate(user.id)}
                        disabled={grantAdmin.isPending}
                        className="bg-primary/10 text-primary border-primary/30 hover:bg-primary hover:text-white font-mono text-xs uppercase hover-juicy"
                      >
                        Grant
                      </Button>
                    )
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
