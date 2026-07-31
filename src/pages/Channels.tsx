const useGetChannels = () => ({ data: [], isLoading: false });
const useCreateChannel = () => ({ mutate: () => {} });
const useUpdateChannel = () => ({ mutate: () => {} });
const useDeleteChannel = () => ({ mutate: () => {} });
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Hash, Volume2, Megaphone, Folder, Plus, Settings2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function ChannelIcon({ type }: { type: string }) {
  if (type === 'voice') return <Volume2 className="w-4 h-4" />;
  if (type === 'announcement') return <Megaphone className="w-4 h-4" />;
  if (type === 'category') return <Folder className="w-4 h-4" />;
  return <Hash className="w-4 h-4" />;
}

export function Channels() {
  const { data: channels, isLoading } = useGetChannels();
  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [modal, setModal] = useState<{ isOpen: boolean, mode: 'create' | 'edit', channelId?: string, parentId?: string }>({
    isOpen: false, mode: 'create'
  });
  
  const [formData, setFormData] = useState({ name: "", type: "text", topic: "" });

  const categories = channels?.filter(c => c.type === 'category').sort((a, b) => a.position - b.position) || [];
  const orphanChannels = channels?.filter(c => c.type !== 'category' && !c.parentId).sort((a, b) => a.position - b.position) || [];

  const handleOpenCreate = (parentId?: string) => {
    setFormData({ name: "", type: "text", topic: "" });
    setModal({ isOpen: true, mode: 'create', parentId });
  };

  const handleOpenEdit = (channel: any) => {
    setFormData({ name: channel.name, type: channel.type, topic: channel.topic || "" });
    setModal({ isOpen: true, mode: 'edit', channelId: channel.id });
  };

  const handleSave = () => {
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guild/channels"] });
      setModal({ isOpen: false, mode: 'create' });
      toast({ title: `Channel ${modal.mode === 'create' ? 'created' : 'updated'} successfully` });
    };

    if (modal.mode === 'create') {
      createChannel.mutate({ data: { 
        name: formData.name, 
        type: formData.type as any, 
        topic: formData.topic || undefined,
        parentId: modal.parentId 
      }}, { onSuccess });
    } else if (modal.channelId) {
      updateChannel.mutate({ id: modal.channelId, data: { name: formData.name, topic: formData.topic || undefined } }, { onSuccess });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this channel?")) return;
    deleteChannel.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/guild/channels"] });
        toast({ title: "Channel deleted" });
      }
    });
  };

  const renderChannelList = (list: any[]) => (
    <div className="space-y-1 mt-2">
      {list.map(channel => (
        <div key={channel.id} className="group flex items-center justify-between p-2 hover:bg-muted/50 rounded-md border border-transparent hover:border-border/50 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
            <ChannelIcon type={channel.type} />
            <span className="font-medium text-sm">{channel.name}</span>
            {channel.topic && <span className="text-xs text-muted-foreground/50 truncate max-w-[200px] hidden md:inline-block">— {channel.topic}</span>}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenEdit(channel)}>
              <Settings2 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(channel.id)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Hash className="text-primary w-8 h-8" />
            Channels
          </h1>
          <p className="text-muted-foreground mt-1">Structure your server's layout</p>
        </div>
        <Button onClick={() => handleOpenCreate()} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          <Plus className="w-4 h-4 mr-2" /> New Category
        </Button>
      </div>

      <div className="bg-card/40 border border-border/50 rounded-xl p-4 shadow-sm backdrop-blur-sm">
        {orphanChannels.length > 0 && (
          <div className="mb-6 pb-6 border-b border-border/50">
            <div className="text-xs font-display font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Uncategorized</div>
            {renderChannelList(orphanChannels)}
          </div>
        )}

        <Accordion type="multiple" defaultValue={categories.map(c => c.id)} className="space-y-4">
          {categories.map((category) => {
            const children = channels?.filter(c => c.parentId === category.id).sort((a, b) => a.position - b.position) || [];
            return (
              <AccordionItem key={category.id} value={category.id} className="border border-border/50 rounded-lg px-2 bg-background/50">
                <div className="flex items-center w-full pr-2">
                  <AccordionTrigger className="hover:no-underline flex-1 py-3 text-sm font-display font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                    {category.name}
                  </AccordionTrigger>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenCreate(category.id)} title="Add channel">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenEdit(category)} title="Edit category">
                      <Settings2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(category.id)} title="Delete category">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <AccordionContent className="pb-3 px-2">
                  {children.length > 0 ? renderChannelList(children) : <div className="text-xs text-muted-foreground/50 py-2 italic">Empty category</div>}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <Dialog open={modal.isOpen} onOpenChange={(open) => !open && setModal({ ...modal, isOpen: false })}>
        <DialogContent className="bg-card border-border/50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {modal.mode === 'create' ? 'Create Channel' : 'Edit Channel'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. general" 
                className="bg-background border-border/50"
              />
            </div>
            
            {modal.mode === 'create' && !modal.parentId && (
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="text">Text Channel</SelectItem>
                    <SelectItem value="voice">Voice Channel</SelectItem>
                    <SelectItem value="announcement">Announcement Channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {modal.mode === 'create' && modal.parentId && (
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Channel</SelectItem>
                    <SelectItem value="voice">Voice Channel</SelectItem>
                    <SelectItem value="announcement">Announcement Channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.type !== 'category' && formData.type !== 'voice' && (
              <div className="space-y-2">
                <Label>Topic (Optional)</Label>
                <Input 
                  value={formData.topic} 
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })} 
                  placeholder="What is this channel about?" 
                  className="bg-background border-border/50"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ ...modal, isOpen: false })} className="bg-transparent border-border/50 hover:bg-muted">Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>Save Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
