const useGetSettings = () => ({ data: null });
const useUpdateSettings = () => ({ mutate: () => {} });
const useGetChannels = () => ({ data: [] });
const useGetRoles = () => ({ data: [] });
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Settings, Save, Bot, ShieldCheck, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/page-loader";

export function BotSettings() {
  const { data: settings } = useGetSettings();
  const { data: channels } = useGetChannels();
  const { data: roles } = useGetRoles();
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    prefix: "!",
    welcomeChannelId: "none",
    welcomeMessage: "",
    logChannelId: "none",
    autoModEnabled: false,
    autoModBadWords: "",
    mutedRoleId: "none",
    ticketCategoryId: "none"
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        prefix: settings.prefix || "!",
        welcomeChannelId: settings.welcomeChannelId || "none",
        welcomeMessage: settings.welcomeMessage || "",
        logChannelId: settings.logChannelId || "none",
        autoModEnabled: settings.autoModEnabled,
        autoModBadWords: settings.autoModBadWords || "",
        mutedRoleId: settings.mutedRoleId || "none",
        ticketCategoryId: settings.ticketCategoryId || "none"
      });
    }
  }, [settings]);

  const textChannels = channels?.filter(c => c.type === 'text') || [];
  const categories = channels?.filter(c => c.type === 'category') || [];

  const handleSave = () => {
    const payload: any = { ...formData };
    if (payload.welcomeChannelId === "none") payload.welcomeChannelId = null;
    if (payload.logChannelId === "none") payload.logChannelId = null;
    if (payload.mutedRoleId === "none") payload.mutedRoleId = null;
    if (payload.ticketCategoryId === "none") payload.ticketCategoryId = null;

    updateSettings.mutate({ data: payload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({ title: "Settings saved successfully" });
      }
    });
  };

  if (!settings) return <PageLoader />;

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Settings className="text-primary w-8 h-8" />
            Bot Configuration
          </h1>
          <p className="text-muted-foreground mt-1">Manage core Nexus bot behaviors and automations</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          <Save className="w-4 h-4 mr-2" />
          {updateSettings.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card/40 border-border/50 shadow-sm backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" /> General
            </CardTitle>
            <CardDescription>Basic bot configuration and welcome system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Command Prefix</Label>
              <Input 
                value={formData.prefix} 
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })} 
                className="bg-background border-border/50 font-mono w-24 text-center"
                maxLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Welcome Channel</Label>
              <Select value={formData.welcomeChannelId} onValueChange={(val) => setFormData({ ...formData, welcomeChannelId: val })}>
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Disabled" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Disabled</SelectItem>
                  {textChannels.map(c => <SelectItem key={c.id} value={c.id}># {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Welcome Message Template</Label>
              <Textarea 
                value={formData.welcomeMessage} 
                onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })} 
                placeholder="Welcome {user} to the server! You are member #{memberCount}." 
                className="bg-background border-border/50 font-mono text-sm min-h-[100px]"
              />
              <p className="text-[10px] text-muted-foreground">Available tags: {`{user}, {server}, {memberCount}`}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 shadow-sm backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Moderation & Logging
            </CardTitle>
            <CardDescription>Automated security and audit logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Audit Log Channel</Label>
              <Select value={formData.logChannelId} onValueChange={(val) => setFormData({ ...formData, logChannelId: val })}>
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Disabled" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Disabled</SelectItem>
                  {textChannels.map(c => <SelectItem key={c.id} value={c.id}># {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Muted Role (Used for Timeouts)</Label>
              <Select value={formData.mutedRoleId} onValueChange={(val) => setFormData({ ...formData, mutedRoleId: val })}>
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not set</SelectItem>
                  {roles?.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 border border-border/50 rounded-lg bg-background/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Moderation Filter</Label>
                  <p className="text-xs text-muted-foreground">Automatically delete messages with bad words</p>
                </div>
                <Switch 
                  checked={formData.autoModEnabled} 
                  onCheckedChange={(val) => setFormData({ ...formData, autoModEnabled: val })}
                />
              </div>
              
              {formData.autoModEnabled && (
                <div className="space-y-2 pt-2 border-t border-border/30">
                  <Label>Filtered Words (comma separated)</Label>
                  <Textarea 
                    value={formData.autoModBadWords} 
                    onChange={(e) => setFormData({ ...formData, autoModBadWords: e.target.value })} 
                    placeholder="word1, word2, bad phrase" 
                    className="bg-background border-border/50 font-mono text-sm"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 shadow-sm backdrop-blur-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Ticket className="w-5 h-5 text-violet-500" /> Ticket System
            </CardTitle>
            <CardDescription>Configure where user support tickets open</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md space-y-2">
              <Label>Ticket Category</Label>
              <Select value={formData.ticketCategoryId} onValueChange={(val) => setFormData({ ...formData, ticketCategoryId: val })}>
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not set</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">New tickets will be created as channels under this category.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
