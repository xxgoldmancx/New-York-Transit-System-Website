const useGetTicket = () => ({ data: null, isLoading: false });
const useGetTicketMessages = () => ({ data: [], isLoading: false });
const useAddTicketMessage = () => ({ mutate: () => {} });
const useUpdateTicket = () => ({ mutate: () => {} });
const useGetMe = () => ({ data: null });
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Shield, Lock, CheckCircle2, Ticket as TicketIcon } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { useToast } from "@/hooks/use-toast";

export function TicketDetail() {
  const { id } = useParams();
  const ticketId = parseInt(id || "0");
  
  const { data: ticket, isLoading: ticketLoading } = useGetTicket(ticketId, { query: { queryKey: getGetTicketQueryKey(ticketId), enabled: !!ticketId } });
  const { data: messages, isLoading: messagesLoading } = useGetTicketMessages(ticketId, { query: { queryKey: getGetTicketMessagesQueryKey(ticketId), enabled: !!ticketId } });
  const { data: me } = useGetMe();
  
  const addMessage = useAddTicketMessage();
  const updateTicket = useUpdateTicket();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [reply, setReply] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (ticketLoading || messagesLoading) return <PageLoader />;
  if (!ticket) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <TicketIcon className="w-16 h-16 text-muted-foreground opacity-50" />
      <div className="text-xl font-display font-bold text-muted-foreground">Ticket Not Found</div>
    </div>
  );

  const handleReply = () => {
    if (!reply.trim()) return;

    addMessage.mutate({ id: ticketId, data: { content: reply } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTicketMessagesQueryKey(ticketId) });
        queryClient.invalidateQueries({ queryKey: getGetTicketQueryKey(ticketId) });
        setReply("");
      }
    });
  };

  const handleStatusChange = (status: "open" | "closed" | "pending") => {
    updateTicket.mutate({ id: ticketId, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTicketQueryKey(ticketId) });
        toast({ title: `Ticket status updated to ${status}` });
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-black/20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-primary/20 bg-card/80 backdrop-blur-md shrink-0 z-10 flex flex-col gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/tickets" className="text-muted-foreground hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/10 hover-juicy bg-black/40 border border-white/5">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{ticket.title}</h1>
              <div className="text-xs text-muted-foreground font-mono flex items-center gap-2 mt-1 uppercase tracking-wider">
                <span className="text-primary font-bold">#{ticket.id}</span> • Opened by <span className="font-bold text-secondary">@{ticket.username}</span> on {format(new Date(ticket.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            {me?.isAdmin ? (
              <Select value={ticket.status} onValueChange={(val) => handleStatusChange(val as any)}>
                <SelectTrigger className={`h-9 font-display font-bold uppercase tracking-wider text-xs w-[140px] border-2 ${
                  ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 focus:ring-emerald-500' :
                  ticket.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 focus:ring-yellow-500' :
                  'bg-white/5 text-muted-foreground border-white/10 focus:ring-white'
                }`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/30 font-display uppercase text-xs font-bold">
                  <SelectItem value="open" className="text-emerald-400">Open</SelectItem>
                  <SelectItem value="pending" className="text-yellow-400">Pending</SelectItem>
                  <SelectItem value="closed" className="text-muted-foreground">Closed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className={`font-display font-bold text-xs uppercase tracking-wider px-4 py-1.5 border-2 ${
                ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                ticket.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                'bg-black/50 text-muted-foreground border-white/10'
              }`}>
                {ticket.status}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative scroll-smooth">
        {/* Thread timeline line */}
        <div className="absolute left-11 top-6 bottom-6 w-px bg-gradient-to-b from-primary/50 via-secondary/20 to-transparent z-0 hidden sm:block"></div>

        {/* OP Description */}
        <div className="flex gap-4 max-w-[800px] relative z-10 group">
          <Avatar className="w-10 h-10 border-2 border-secondary/50 rounded-xl shrink-0 mt-1 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
            <AvatarImage src={ticket.userAvatar ? `https://cdn.discordapp.com/avatars/${ticket.userId}/${ticket.userAvatar}.png` : undefined} />
            <AvatarFallback className="bg-black text-secondary font-display">{ticket.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-secondary text-lg">{ticket.username}</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{format(new Date(ticket.createdAt), "MMM d, HH:mm")}</span>
            </div>
            <div className="bg-black/60 border border-secondary/20 rounded-2xl rounded-tl-none p-5 text-sm text-white/90 shadow-md whitespace-pre-wrap font-sans leading-relaxed group-hover:border-secondary/40 transition-colors">
              {ticket.description}
            </div>
          </div>
        </div>

        {/* Replies */}
        {messages?.map((msg) => {
          const isMe = msg.userId === me?.id;
          const isStaff = msg.isStaff;

          return (
            <div key={msg.id} className={`flex gap-4 max-w-[800px] relative z-10 group ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
              <Avatar className={`w-10 h-10 border-2 rounded-xl shrink-0 mt-1 ${isStaff ? 'border-primary shadow-[0_0_10px_rgba(255,0,255,0.3)]' : 'border-secondary/50 shadow-[0_0_10px_rgba(0,255,255,0.2)]'}`}>
                <AvatarImage src={msg.avatar ? `https://cdn.discordapp.com/avatars/${msg.userId}/${msg.avatar}.png` : undefined} />
                <AvatarFallback className="bg-black font-display text-white">{msg.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className={`flex-1 space-y-1.5 ${isMe ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                  <span className={`font-display font-bold text-lg flex items-center gap-2 ${isStaff ? 'text-primary' : 'text-secondary'}`}>
                    {msg.username}
                    {isStaff && <Shield className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{format(new Date(msg.createdAt), "MMM d, HH:mm")}</span>
                </div>
                
                <div className={`
                  inline-block rounded-2xl p-5 text-sm text-left whitespace-pre-wrap shadow-md font-sans leading-relaxed transition-colors
                  ${isMe 
                    ? 'bg-[linear-gradient(135deg,hsl(var(--primary)/0.8)_0%,hsl(var(--primary)/0.6)_100%)] text-white rounded-tr-none border border-primary/50 shadow-[0_5px_15px_rgba(255,0,255,0.2)]' 
                    : isStaff 
                      ? 'bg-primary/10 border-2 border-primary/40 rounded-tl-none text-white group-hover:border-primary/60' 
                      : 'bg-black/60 border border-secondary/20 rounded-tl-none text-white/90 group-hover:border-secondary/40'}
                `}>
                  {msg.content}
                </div>
              </div>
            </div>
          )
        })}

        {ticket.status === 'closed' && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-60">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-muted-foreground">Uplink Severed</p>
          </div>
        )}
      </div>

      {/* Reply Input */}
      {ticket.status !== 'closed' && (
        <div className="p-4 bg-card/80 backdrop-blur-md border-t border-primary/20 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20">
          <div className="relative max-w-[800px] mx-auto bg-black/60 rounded-2xl border-2 border-white/10 focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(255,0,255,0.2)] transition-all p-1">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Transmit message..."
              className="min-h-[100px] border-none focus-visible:ring-0 resize-none bg-transparent font-sans text-base text-white p-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleReply();
                }
              }}
            />
            <div className="flex justify-between items-center px-4 pb-3 pt-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 opacity-70">
                <CheckCircle2 className="w-3 h-3 text-secondary" /> [ENTER] to send • [SHIFT+ENTER] for new line
              </span>
              <Button 
                onClick={handleReply} 
                disabled={!reply.trim() || addMessage.isPending}
                className="rounded-xl bg-primary hover:bg-primary/90 text-white font-display font-bold tracking-wide shadow-[0_0_15px_rgba(255,0,255,0.3)] hover-juicy px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                Transmit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
