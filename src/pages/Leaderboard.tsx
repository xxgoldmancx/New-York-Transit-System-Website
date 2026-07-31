const useGetLeaderboard = () => ({ data: [], isLoading: false });
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Crown } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { motion } from "framer-motion";

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="text-center space-y-4 mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        <div className="inline-flex items-center justify-center p-4 bg-yellow-500/20 rounded-2xl text-yellow-400 mb-4 border-2 border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.4)] logo-wobble">
          <Trophy className="w-10 h-10" />
        </div>
        <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">Hall of Fame</h1>
        <p className="text-yellow-500/70 font-mono tracking-widest uppercase text-sm">Top operatives by experience points</p>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        {leaderboard?.map((entry, index) => {
          const isTop3 = entry.rank <= 3;
          
          let rankColor = "text-muted-foreground";
          let borderGlow = "";
          let bgClass = "bg-black/60 border-white/10";
          let badgeIcon = null;

          if (entry.rank === 1) {
            rankColor = "text-yellow-400";
            borderGlow = "shadow-[0_0_30px_rgba(234,179,8,0.3)]";
            bgClass = "bg-[linear-gradient(90deg,rgba(234,179,8,0.15)_0%,rgba(0,0,0,0.6)_100%)] border-yellow-500/50";
            badgeIcon = <Crown className="w-6 h-6" />;
          } else if (entry.rank === 2) {
            rankColor = "text-slate-300";
            borderGlow = "shadow-[0_0_20px_rgba(148,163,184,0.2)]";
            bgClass = "bg-[linear-gradient(90deg,rgba(148,163,184,0.1)_0%,rgba(0,0,0,0.6)_100%)] border-slate-400/40";
            badgeIcon = <Medal className="w-6 h-6" />;
          } else if (entry.rank === 3) {
            rankColor = "text-amber-600";
            borderGlow = "shadow-[0_0_20px_rgba(217,119,6,0.2)]";
            bgClass = "bg-[linear-gradient(90deg,rgba(217,119,6,0.1)_0%,rgba(0,0,0,0.6)_100%)] border-amber-600/40";
            badgeIcon = <Medal className="w-6 h-6" />;
          }

          return (
            <motion.div 
              key={entry.userId}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4, type: "spring" }}
              className={`flex items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border backdrop-blur-xl ${bgClass} ${borderGlow} relative overflow-hidden group hover:-translate-y-1 transition-transform`}
            >
              {isTop3 && (
                <div className={`absolute top-0 right-0 w-48 h-48 bg-current opacity-[0.05] -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl pointer-events-none ${rankColor}`}></div>
              )}

              <div className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center font-display font-bold text-2xl sm:text-3xl ${rankColor} bg-black/50 rounded-xl border border-white/5 shrink-0 shadow-inner group-hover:scale-110 transition-transform`}>
                #{entry.rank}
              </div>

              <Avatar className={`w-14 h-14 sm:w-16 sm:h-16 border-2 sm:border-4 rounded-xl ${isTop3 ? 'border-current ' + rankColor : 'border-white/10'} shadow-lg`}>
                <AvatarImage src={entry.avatar ? `https://cdn.discordapp.com/avatars/${entry.userId}/${entry.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${(BigInt(entry.userId) >> 22n) % 6n}.png`} />
                <AvatarFallback className="font-display bg-black text-white text-xl">{entry.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className={`font-display font-bold text-lg sm:text-2xl truncate ${isTop3 ? 'text-white' : 'text-white/90'}`}>{entry.username}</h3>
                  {badgeIcon && <span className={`${rankColor} drop-shadow-[0_0_8px_currentColor] animate-pulse`}>{badgeIcon}</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 sm:mt-2">
                  <div className="text-xs sm:text-sm font-display font-bold bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-md">
                    LVL {entry.level}
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-muted-foreground">
                    {entry.xp.toLocaleString()} <span className="text-[10px] uppercase">XP</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center justify-center w-32">
                <div className="w-full bg-black/50 h-2 rounded-full border border-white/5 overflow-hidden">
                  <div 
                    className={`h-full ${isTop3 ? 'bg-current ' + rankColor : 'bg-primary'}`} 
                    style={{ width: `${Math.max(10, 100 - (entry.rank * 5))}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
