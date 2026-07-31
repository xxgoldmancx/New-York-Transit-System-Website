const useGetMyProfile = () => ({ data: null });
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, ShieldAlert, Ticket, Calendar, Shield, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PageLoader } from "@/components/ui/page-loader";

export function Profile() {
  const { data: profile } = useGetMyProfile();

  if (!profile) return <PageLoader />;

  const xpForNextLevel = (profile.level + 1) * 1000;
  const progress = (profile.xp / xpForNextLevel) * 100;

  return (
    <div className="p-8 max-w-[900px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 border-2 border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.3)]">
          <UserCircle className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 drop-shadow-sm">Player Identity</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-wider">Personal Dossier</p>
        </div>
      </div>

      <Card className="card-juicy bg-black/60 border-primary/30 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl relative">
        {/* Banner with retro grid */}
        <div className="h-40 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8)),radial-gradient(ellipse_at_top,rgba(255,0,255,0.3),transparent_70%)] border-b border-primary/20 relative overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff00ff1a_1px,transparent_1px),linear-gradient(to_bottom,#ff00ff1a_1px,transparent_1px)] bg-[size:20px_20px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom"></div>
        </div>
        
        <CardContent className="pt-0 relative px-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-8">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-black rounded-2xl shadow-[0_0_30px_rgba(255,0,255,0.5)] bg-card group-hover:shadow-[0_0_50px_rgba(255,0,255,0.8)] transition-all duration-300">
                <AvatarImage src={profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.userId}/${profile.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${(BigInt(profile.userId) >> 22n) % 6n}.png`} className="object-cover" />
                <AvatarFallback className="rounded-2xl text-4xl font-display bg-primary text-white">{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-3 -right-3 bg-secondary text-black font-display font-bold px-3 py-1 rounded-lg text-sm border-2 border-black shadow-[0_0_10px_rgba(0,255,255,0.6)]">
                LVL {profile.level}
              </div>
            </div>
            
            <div className="flex-1 pb-2">
              <h2 className="text-3xl font-display font-bold text-white drop-shadow-md">{profile.username}</h2>
              <p className="text-sm text-primary/70 font-mono mt-1">ID: {profile.userId}</p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-md border border-secondary/30 px-6 py-3 rounded-2xl text-center shadow-[0_0_15px_rgba(0,255,255,0.1)]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-secondary/80 font-bold mb-1 font-mono">Global Rank</p>
              <p className="text-3xl font-display font-bold text-secondary drop-shadow-[0_0_8px_currentColor]">#{profile.rank}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-24 h-24 text-primary" />
                </div>
                <div className="flex justify-between items-end mb-4 relative z-10">
                  <h3 className="font-display font-bold text-xl text-white">Experience Matrix</h3>
                  <span className="text-sm text-primary font-mono font-bold bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                    {profile.xp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
                  </span>
                </div>
                <div className="relative h-4 bg-black rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_1s_linear_infinite]"></div>
                  </div>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground mt-3 uppercase tracking-widest text-right">
                  {(100 - progress).toFixed(1)}% to next level
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-destructive/20 transition-colors shadow-[inset_0_0_20px_rgba(255,0,0,0.1)]">
                  <ShieldAlert className="w-8 h-8 text-destructive drop-shadow-[0_0_8px_currentColor]" />
                  <span className="text-4xl font-bold font-display text-white">{profile.warningCount}</span>
                  <span className="text-[10px] font-mono text-destructive uppercase tracking-widest">Active Warnings</span>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-purple-500/20 transition-colors shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]">
                  <Ticket className="w-8 h-8 text-purple-400 drop-shadow-[0_0_8px_currentColor]" />
                  <span className="text-4xl font-bold font-display text-white">{profile.ticketCount}</span>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Support Tickets</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-mono font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Clearance Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.roles.length > 0 ? (
                    profile.roles.map(role => (
                      <Badge key={role} variant="outline" className="bg-black/50 border-white/20 text-white font-mono text-xs px-3 py-1.5 hover:border-primary/50 transition-colors">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm font-mono text-muted-foreground italic bg-black/30 px-4 py-2 rounded-lg border border-white/5">No clearance assigned</span>
                  )}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-mono font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" /> Registration Data
                </h3>
                <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                  <p className="text-white font-display text-xl mb-1">{format(new Date(profile.joinedAt), "MMMM do, yyyy")}</p>
                  <p className="text-xs font-mono text-secondary">
                    Active for {Math.floor((Date.now() - new Date(profile.joinedAt).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: -20px 0; }
          100% { background-position: 20px 0; }
        }
      `}} />
    </div>
  );
}
