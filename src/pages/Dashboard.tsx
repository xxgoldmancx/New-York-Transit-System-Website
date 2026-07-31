const useGetGuild = () => ({ data: null, isLoading: false, isError: false });
const useGetGuildStats = () => ({ data: null, isLoading: false, isError: false });
const useGetMembers = () => ({ data: [] });
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserMinus, AlertTriangle, Ticket, Activity, Crown, ShieldAlert, Ban, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { PageLoader } from "@/components/ui/page-loader";

export function Dashboard() {
  const { data: guild, isLoading: guildLoading, isError: guildError } = useGetGuild();
  const { data: stats, isLoading: statsLoading, isError: statsError } = useGetGuildStats();
  const { data: members } = useGetMembers({ limit: 5 }); 

  if (guildLoading || statsLoading) return <PageLoader />;

  if (!guild || !stats || guildError || statsError) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-destructive/20 border-2 border-destructive/50 flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.3)] logo-wobble">
        <ShieldAlert className="w-10 h-10 text-destructive" />
      </div>
      <div>
        <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">System Offline</h2>
        <p className="text-muted-foreground mt-2 max-w-sm font-mono text-sm">
          Nexus Bot connection severed. Install the bot to re-establish uplink.
        </p>
      </div>
      <a
        href={`https://discord.com/api/oauth2/authorize?client_id=1524604199810371604&permissions=8&scope=bot`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-display font-bold hover-juicy shadow-[0_0_20px_rgba(255,0,255,0.4)]"
      >
        <Zap className="w-5 h-5" /> Initialize Bot
      </a>
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">Command Center</h1>
          <p className="text-secondary font-mono text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_currentColor]"></span>
            Live telemetry for {guild.name}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-black/40 border border-primary/30 px-6 py-3 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_10px_currentColor] animate-pulse"></div>
            <span className="text-sm font-mono font-bold text-white">{guild.onlineCount} Online</span>
          </div>
          <div className="w-px h-6 bg-primary/30"></div>
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono font-bold text-white">{guild.memberCount} Members</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-juicy bg-black/40 backdrop-blur-md border-primary/20 hover:border-primary/50 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-widest text-primary/80">Total Population</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{guild.memberCount.toLocaleString()}</div>
            <p className="text-xs text-secondary mt-2 flex items-center gap-1 font-mono font-bold bg-secondary/10 w-fit px-2 py-0.5 rounded-full border border-secondary/30">
              +{stats.memberGrowth[stats.memberGrowth.length - 1]?.count || 0} this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-juicy bg-black/40 backdrop-blur-md border-yellow-500/20 hover:border-yellow-500/50 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-widest text-yellow-500/80">Active Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{stats.totalWarnings.toLocaleString()}</div>
            <p className="text-xs text-yellow-500 mt-2 font-mono uppercase tracking-wider">Attention Required</p>
          </CardContent>
        </Card>

        <Card className="card-juicy bg-black/40 backdrop-blur-md border-purple-500/20 hover:border-purple-500/50 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Ticket className="w-16 h-16 text-purple-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-widest text-purple-500/80">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{stats.openTickets.toLocaleString()}</div>
            <p className="text-xs text-purple-400 mt-2 font-mono uppercase tracking-wider">Total: {stats.totalTickets}</p>
          </CardContent>
        </Card>

        <Card className="card-juicy bg-black/40 backdrop-blur-md border-destructive/20 hover:border-destructive/50 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Ban className="w-16 h-16 text-destructive" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-widest text-destructive/80">Total Bans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{stats.totalBans.toLocaleString()}</div>
            <p className="text-xs text-destructive mt-2 font-mono uppercase tracking-wider">Permaban enforced</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-black/50 border-primary/20 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white drop-shadow-[0_0_8px_rgba(255,0,255,0.5)]">Population Trajectory</CardTitle>
            <CardDescription className="font-mono text-xs uppercase text-muted-foreground tracking-wider">30-Day Growth Analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.memberGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                    fontFamily="Space Mono"
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => format(new Date(value), "MMM d")}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                    fontFamily="Space Mono"
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderColor: "hsl(var(--primary)/0.5)", borderRadius: "12px", backdropFilter: "blur(8px)", fontFamily: "Space Mono" }}
                    itemStyle={{ color: "hsl(var(--primary))", fontWeight: "bold" }}
                    labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary)/0.5))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-primary/20 backdrop-blur-md flex flex-col">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white flex items-center gap-3 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
              <Activity className="w-5 h-5 text-secondary" />
              Live Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-secondary/50 before:via-primary/50 before:to-transparent">
              {stats.recentActivity.map((activity, i) => (
                <div key={i} className="relative flex items-start gap-4 group">
                  <div className="absolute left-0 mt-1.5 w-5 h-5 rounded-full bg-black border-2 border-secondary flex items-center justify-center z-10 group-hover:shadow-[0_0_10px_rgba(0,255,255,0.8)] transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  </div>
                  <div className="pl-8">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary">{activity.type}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{format(new Date(activity.timestamp), 'HH:mm:ss')}</span>
                    </div>
                    <p className="text-sm text-white/90">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/50 border-yellow-500/20 backdrop-blur-md hover:border-yellow-500/40 transition-colors">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white flex items-center gap-3 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              <Crown className="w-6 h-6 text-yellow-500" />
              Server Specs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Boost Level</p>
                <p className="text-2xl font-display font-bold text-white flex items-center gap-3">
                  Lvl {guild.boostLevel}
                  <span className="text-xs bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full border border-pink-500/30 font-mono shadow-[0_0_10px_rgba(236,72,153,0.3)]">{guild.boostCount} Boosts</span>
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Channels</p>
                <p className="text-2xl font-display font-bold text-white">{guild.channelCount}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Roles</p>
                <p className="text-2xl font-display font-bold text-white">{guild.roleCount}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">System ID</p>
                <p className="text-sm font-mono text-muted-foreground">{guild.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-secondary/20 backdrop-blur-md hover:border-secondary/40 transition-colors">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white flex items-center gap-3 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
              <UserMinus className="w-6 h-6 text-secondary" />
              New Recruits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members?.slice(0, 4).map(member => (
                <div key={member.userId} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 hover:border-secondary/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <img 
                      src={member.avatar ? `https://cdn.discordapp.com/avatars/${member.userId}/${member.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${(BigInt(member.userId) >> 22n) % 6n}.png`}
                      alt={member.username}
                      className="w-12 h-12 rounded-xl border border-secondary/30 group-hover:shadow-[0_0_10px_rgba(0,255,255,0.4)] transition-all"
                    />
                    <div>
                      <p className="font-display font-bold text-base text-white flex items-center gap-2">
                        {member.username}
                        {member.bot && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-md uppercase font-mono font-bold tracking-wider border border-primary/30">Bot</span>}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">{format(new Date(member.joinedAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
