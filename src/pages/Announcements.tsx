const useGetAnnouncements = () => ({ data: [] });
const useSendAnnouncement = () => ({ mutate: () => {} });
const useGetChannels = () => ({ data: [] });
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Megaphone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export function Announcements() {
  const { data: history } = useGetAnnouncements();
  const { data: channels } = useGetChannels();
  const sendAnnouncement = useSendAnnouncement();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({ channelId: "", content: "", embedTitle: "", embedColor: "#5865F2" });

  const textChannels = channels?.filter(c => c.type === 'text' || c.type === 'announcement') || [];

  const handleSend = () => {
    if (!formData.channelId || !formData.content) return;

    sendAnnouncement.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/guild/announcements"] });
        toast({ title: "Announcement dispatched successfully" });
        setFormData({ ...formData, content: "", embedTitle: "" });
      }
    });
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Megaphone className="text-primary w-8 h-8" />
          Broadcast Center
        </h1>
        <p className="text-muted-foreground mt-1">Send formatted announcements directly to your server</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-card/40 border-border/50 shadow-sm backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Destination Channel</Label>
                <Select value={formData.channelId} onValueChange={(val) => setFormData({ ...formData, channelId: val })}>
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Select a channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {textChannels.map(c => (
                      <SelectItem key={c.id} value={c.id}># {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Embed Title (Optional)</Label>
                <Input 
                  value={formData.embedTitle} 
                  onChange={(e) => setFormData({ ...formData, embedTitle: e.target.value })} 
                  placeholder="e.g. 📢 Server Update!" 
                  className="bg-background border-border/50 font-display"
                />
              </div>

              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea 
                  value={formData.content} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  placeholder="Type your announcement here... (Supports Discord Markdown)" 
                  className="bg-background border-border/50 min-h-[150px] font-sans resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label>Embed Color</Label>
                <div className="flex gap-3">
                  <Input 
                    type="color" 
                    value={formData.embedColor} 
                    onChange={(e) => setFormData({ ...formData, embedColor: e.target.value })} 
                    className="w-16 h-10 p-1 bg-background border-border/50 cursor-pointer"
                  />
                  <Input 
                    type="text" 
                    value={formData.embedColor} 
                    onChange={(e) => setFormData({ ...formData, embedColor: e.target.value })} 
                    className="flex-1 bg-background border-border/50 font-mono"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSend} 
                disabled={!formData.channelId || !formData.content || sendAnnouncement.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                size="lg"
              >
                {sendAnnouncement.isPending ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Dispatch Broadcast</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg border-b border-border/50 pb-2">Broadcast History</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {history?.map((item) => (
              <div key={item.id} className="bg-card/30 border border-border/50 rounded-lg p-4 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">#{item.channelName}</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(item.sentAt), "MMM d, HH:mm")}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap text-card-foreground/90">{item.content}</p>
                <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground flex justify-between">
                  <span>Sent by {item.sentBy}</span>
                  {item.messageId && <span className="font-mono">ID: {item.messageId}</span>}
                </div>
              </div>
            ))}
            {history?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground italic bg-card/20 rounded-lg border border-border/30">
                No previous broadcasts found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
