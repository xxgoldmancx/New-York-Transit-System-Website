const useGetMembers = () => ({ members: [], isLoading: false });
const useKickMember = () => ({ mutate: () => {} });
const useBanMember = () => ({ mutate: () => {} });
const useMuteMember = () => ({ mutate: () => {} });
const useCreateWarning = () => ({ mutate: () => {} });
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, MoreVertical, ShieldAlert, Ban, UserMinus, VolumeX, ShieldQuestion, Loader2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Members() {
  const [search, setSearch] = useState("");
  const { data: members, isLoading } = useGetMembers({ search: search || undefined });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const kick = useKickMember();
  const ban = useBanMember();
  const mute = useMuteMember();
  const warn = useCreateWarning();

  const [actionModal, setActionModal] = useState<{
    type: 'kick' | 'ban' | 'mute' | 'warn' | null,
    member: any | null
  }>({ type: null, member: null });

  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("60"); 

  const handleAction = () => {
    const { type, member } = actionModal;
    if (!type || !member) return;

    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moderation/members"] });
      toast({ title: `Successfully ${type}ed ${member.username}`, variant: "default" });
      setActionModal({ type: null, member: null });
      setReason("");
    };

    const onError = (err: any) => {
      toast({ title: `Failed to ${type} ${member.username}`, description: err.message || "An error occurred", variant: "destructive" });
    };

    if (type === 'kick') kick.mutate({ data: { userId: member.userId, reason } }, { onSuccess, onError });
    if (type === 'ban') ban.mutate({ data: { userId: member.userId, reason } }, { onSuccess, onError });
    if (type === 'warn') warn.mutate({ data: { userId: member.userId, reason } }, { onSuccess, onError });
    if (type === 'mute') mute.mutate({ data: { userId: member.userId, reason, duration: parseInt(duration) } }, { onSuccess, onError });
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/20 border-2 border-secondary/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            <Users className="w-7 h-7 text-secondary" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-blue-400 drop-shadow-sm">Member Directory</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-wider">Guild Population Control</p>
          </div>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <Input 
            placeholder="Search identity or ID..." 
            className="pl-12 py-6 bg-black/40 border-secondary/30 focus-visible:ring-secondary focus-visible:border-secondary font-mono text-white rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.1)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-black/40 border border-secondary/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
        <Table>
          <TableHeader className="bg-black/60">
            <TableRow className="border-secondary/20 hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase tracking-wider text-secondary/80">Identity</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-secondary/80">Clearance Roles</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-secondary/80">Enlisted</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto shadow-[0_0_15px_currentColor] rounded-full" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && members?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground font-mono">
                  No records found in database.
                </TableCell>
              </TableRow>
            )}
            {members?.map((member) => (
              <TableRow key={member.userId} className="border-secondary/10 hover:bg-white/5 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border border-secondary/30 rounded-xl group-hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all">
                      <AvatarImage src={member.avatar ? `https://cdn.discordapp.com/avatars/${member.userId}/${member.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${(BigInt(member.userId) >> 22n) % 6n}.png`} />
                      <AvatarFallback className="rounded-xl bg-black text-secondary font-display font-bold">{member.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-display font-bold text-lg text-white flex items-center gap-2">
                        {member.nickname || member.username}
                        {member.bot && <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-primary/20 text-primary border-primary/30 uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(255,0,255,0.2)]">Bot</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">@{member.username} • {member.userId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {member.roles.length > 0 ? (
                      member.roles.slice(0, 3).map(roleId => (
                        <Badge key={roleId} variant="outline" className="bg-white/5 border-white/10 text-xs font-mono font-normal">
                          {roleId}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono opacity-50">No clearance</span>
                    )}
                    {member.roles.length > 3 && (
                      <Badge variant="outline" className="bg-secondary/10 border-secondary/30 text-secondary text-xs font-mono font-normal">+{member.roles.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                  {format(new Date(member.joinedAt), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-white/10 rounded-xl hover-juicy text-muted-foreground hover:text-white">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card/90 backdrop-blur-xl border-primary/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                      <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-primary/80">Moderation Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-primary/20" />
                      <DropdownMenuItem onClick={() => setActionModal({ type: 'warn', member })} className="gap-3 font-display text-sm cursor-pointer focus:bg-yellow-500/20 focus:text-yellow-400 py-2.5">
                        <ShieldAlert className="w-4 h-4" /> Issue Warning
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActionModal({ type: 'mute', member })} className="gap-3 font-display text-sm cursor-pointer focus:bg-orange-500/20 focus:text-orange-400 py-2.5">
                        <VolumeX className="w-4 h-4" /> Enforce Timeout
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-primary/20" />
                      <DropdownMenuItem onClick={() => setActionModal({ type: 'kick', member })} className="gap-3 font-display text-sm cursor-pointer focus:bg-destructive/20 focus:text-destructive text-destructive py-2.5">
                        <UserMinus className="w-4 h-4" /> Kick User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActionModal({ type: 'ban', member })} className="gap-3 font-display text-sm cursor-pointer focus:bg-destructive/20 focus:text-destructive text-destructive py-2.5">
                        <Ban className="w-4 h-4" /> Permaban
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={actionModal.type !== null} onOpenChange={(open) => !open && setActionModal({ type: null, member: null })}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display capitalize text-2xl flex items-center gap-3 text-white">
              {actionModal.type === 'ban' || actionModal.type === 'kick' ? 
                <ShieldQuestion className="text-destructive w-7 h-7 drop-shadow-[0_0_10px_currentColor]" /> : 
                <ShieldAlert className="text-yellow-500 w-7 h-7 drop-shadow-[0_0_10px_currentColor]" />
              }
              {actionModal.type} Action
            </DialogTitle>
            <DialogDescription className="font-mono text-xs mt-2">
              Executing protocol against target <span className="font-bold text-primary">@{actionModal.member?.username}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Reason (Required)</Label>
              <Input 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                placeholder={`Input justification...`} 
                className="bg-black/50 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-mono text-white rounded-lg"
              />
            </div>
            {actionModal.type === 'mute' && (
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Duration (Minutes)</Label>
                <Input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  className="bg-black/50 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-mono text-white rounded-lg"
                  min="1"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setActionModal({ type: null, member: null })} className="bg-transparent border-white/10 hover:bg-white/5 font-display">Abort</Button>
            <Button 
              variant={actionModal.type === 'ban' || actionModal.type === 'kick' ? 'destructive' : 'default'} 
              onClick={handleAction}
              disabled={!reason.trim()}
              className={`capitalize font-display font-bold hover-juicy ${actionModal.type === 'warn' || actionModal.type === 'mute' ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'shadow-[0_0_15px_rgba(255,0,0,0.4)]'}`}
            >
              Execute {actionModal.type}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
