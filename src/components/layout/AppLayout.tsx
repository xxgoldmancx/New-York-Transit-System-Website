const useGetMe = () => ({ data: null });
const useGetGuild = () => ({ data: null });
const useLogout = () => ({ mutate: () => {} });
import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, Users, AlertTriangle, Ban, 
  UserCircle, Trophy, Ticket, Shield, Hash, Megaphone,
  Settings, LogOut, Key
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useGetMe();
  const { data: guild } = useGetGuild();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/";
      }
    });
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background dark text-foreground">
        <Sidebar className="border-r border-primary/20 bg-sidebar/80 backdrop-blur-md">
          <SidebarHeader className="border-b border-primary/20 p-4 h-[72px] flex items-center">
            <div className="flex items-center gap-3 w-full">
              <div className="relative group">
                <Avatar className="h-10 w-10 rounded-xl bg-card border border-primary/30 shadow-[0_0_15px_rgba(255,0,255,0.2)] group-hover:shadow-[0_0_25px_rgba(255,0,255,0.6)] transition-all duration-300">
                  <AvatarImage src={guild?.icon || undefined} />
                  <AvatarFallback className="rounded-xl font-display font-bold text-primary">{guild ? guild.name.substring(0, 2).toUpperCase() : "NX"}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="font-display font-bold text-base truncate tracking-wide text-white logo-wobble cursor-default">{guild?.name ?? "Nexus System"}</span>
                <span className="text-[10px] font-mono text-secondary font-medium uppercase tracking-widest flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${guild ? "bg-secondary animate-pulse" : "bg-yellow-500"} shadow-[0_0_5px_currentColor]`}></span>
                  {guild ? `${guild.onlineCount} Online` : "Offline"}
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4 gap-6">
            {user.isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-display font-bold mb-2 ml-2">Root Access</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/"}>
                        <Link href="/" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                          <LayoutDashboard size={18} className={location === "/" ? "text-primary" : "text-muted-foreground"} />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/members"}>
                        <Link href="/members" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                          <Users size={18} className={location === "/members" ? "text-secondary" : "text-muted-foreground"} />
                          <span>Members</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/warnings"}>
                        <Link href="/warnings" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                          <AlertTriangle size={18} className={location === "/warnings" ? "text-yellow-500" : "text-muted-foreground"} />
                          <span>Warnings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/bans"}>
                        <Link href="/bans" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                          <Ban size={18} className={location === "/bans" ? "text-destructive" : "text-muted-foreground"} />
                          <span>Bans</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/roles"}>
                        <Link href="/roles" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                          <Shield size={18} className={location === "/roles" ? "text-purple-400" : "text-muted-foreground"} />
                          <span>Roles</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/channels"}>
                        <Link href="/channels" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                          <Hash size={18} className={location === "/channels" ? "text-blue-400" : "text-muted-foreground"} />
                          <span>Channels</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/announcements"}>
                        <Link href="/announcements" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                          <Megaphone size={18} className={location === "/announcements" ? "text-orange-400" : "text-muted-foreground"} />
                          <span>Announcements</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/settings"}>
                        <Link href="/settings" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                          <Settings size={18} className={location === "/settings" ? "text-slate-300" : "text-muted-foreground"} />
                          <span>Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/admin/users"}>
                        <Link href="/admin/users" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                          <Key size={18} className={location === "/admin/users" ? "text-emerald-400" : "text-muted-foreground"} />
                          <span>Admin Users</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-secondary/70 font-display font-bold mb-2 ml-2">Clubhouse</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/profile"}>
                      <Link href="/profile" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                        <UserCircle size={18} className={location === "/profile" ? "text-primary" : "text-muted-foreground"} />
                        <span>My Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/leaderboard"}>
                      <Link href="/leaderboard" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                        <Trophy size={18} className={location === "/leaderboard" ? "text-yellow-400" : "text-muted-foreground"} />
                        <span>Leaderboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.startsWith("/tickets")}>
                      <Link href="/tickets" className="flex items-center gap-3 font-medium transition-all hover-juicy rounded-lg">
                        <Ticket size={18} className={location.startsWith("/tickets") ? "text-emerald-400" : "text-muted-foreground"} />
                        <span>Tickets</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-primary/20 bg-card/30">
            <div className="flex items-center gap-3 bg-background/50 p-2.5 rounded-xl border border-primary/20 hover:border-primary/50 transition-colors shadow-sm">
              <Avatar className="h-9 w-9 rounded-lg border border-primary/30">
                <AvatarImage src={user.discordId && user.avatar ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png` : user.discordId ? `https://cdn.discordapp.com/embed/avatars/${(BigInt(user.discordId) >> 22n) % 6n}.png` : undefined} />
                <AvatarFallback className="rounded-lg font-display bg-primary/20 text-primary">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="font-bold font-display text-sm truncate">{user.username}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono truncate">
                  {user.isAdmin ? <span className="text-primary font-bold">Admin</span> : 'Member'}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:shadow-[0_0_10px_rgba(255,0,0,0.5)] rounded-lg transition-all"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          <div className="flex-1 overflow-y-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
