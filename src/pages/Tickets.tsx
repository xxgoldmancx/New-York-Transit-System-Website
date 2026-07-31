const useGetTickets = () => ({ data: [], isLoading: false });
const useCreateTicket = () => ({ mutate: () => {} });
const TicketInputPriority = {};
import { Link } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Ticket as TicketIcon, Search, Plus, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { useToast } from "@/hooks/use-toast";

export function Tickets() {
  const { data: tickets, isLoading } = useGetTickets();
  const createTicket = useCreateTicket();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", description: "", priority: TicketInputPriority.medium });
  const [search, setSearch] = useState("");

  if (isLoading) return <PageLoader />;

  const handleCreate = () => {
    createTicket.mutate({ data: newTicket }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
        setIsCreateOpen(false);
        setNewTicket({ title: "", description: "", priority: TicketInputPriority.medium });
        toast({ title: "Ticket created successfully" });
      }
    });
  };

  const filteredTickets = tickets?.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.id.toString().includes(search)
  ) || [];

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <TicketIcon className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-sm">Support Desk</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-wider">Communication Uplinks</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <Input 
              placeholder="Search uplinks..." 
              className="pl-11 bg-black/40 border-purple-500/30 focus-visible:ring-purple-500 focus-visible:border-purple-500 font-mono text-white rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-500 hover:bg-purple-400 text-white font-display font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] hover-juicy rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> New Uplink
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card/95 backdrop-blur-xl border-purple-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-white">Initialize Uplink</DialogTitle>
                <DialogDescription className="font-mono text-xs mt-2 text-muted-foreground">
                  Open a secure line to the moderation team.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Subject</Label>
                  <Input 
                    value={newTicket.title} 
                    onChange={(e) => setNewTicket(p => ({ ...p, title: e.target.value }))} 
                    placeholder="Brief description..." 
                    className="bg-black/50 border-purple-500/30 focus-visible:ring-purple-500 focus-visible:border-purple-500 font-sans text-white rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Details</Label>
                  <Textarea 
                    value={newTicket.description} 
                    onChange={(e) => setNewTicket(p => ({ ...p, description: e.target.value }))} 
                    placeholder="Provide full context here..." 
                    className="bg-black/50 border-purple-500/30 focus-visible:ring-purple-500 focus-visible:border-purple-500 font-sans text-white rounded-lg min-h-[120px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="bg-transparent border-white/10 hover:bg-white/5 font-display">Cancel</Button>
                <Button 
                  onClick={handleCreate} 
                  disabled={!newTicket.title.trim() || !newTicket.description.trim() || createTicket.isPending}
                  className="bg-purple-500 hover:bg-purple-400 text-white font-display font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] hover-juicy"
                >
                  Establish Connection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl bg-black/20">
            <TicketIcon className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-mono uppercase tracking-widest text-sm">No active uplinks found</p>
          </div>
        )}
        
        {filteredTickets.map((ticket) => (
          <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
            <div className="bg-black/40 border-2 border-white/5 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all cursor-pointer group hover:-translate-y-1 h-full flex flex-col backdrop-blur-md">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className={`font-mono text-[10px] uppercase px-2 py-0.5 border ${
                  ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  ticket.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                  'bg-white/5 text-muted-foreground border-white/10'
                }`}>
                  {ticket.status === 'open' && <Clock className="w-3 h-3 mr-1" />}
                  {ticket.status === 'pending' && <MessageSquare className="w-3 h-3 mr-1" />}
                  {ticket.status === 'closed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {ticket.status}
                </Badge>
                <span className="text-[10px] font-mono text-muted-foreground">#{ticket.id}</span>
              </div>
              
              <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">{ticket.title}</h3>
              
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-display font-bold text-white">
                    {ticket.username[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground truncate max-w-[100px]">@{ticket.username}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {format(new Date(ticket.createdAt), "MMM d")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
