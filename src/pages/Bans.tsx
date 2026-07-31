const useGetBans = () => ({ data: [], isLoading: false });
const useUnbanMember = () => ({
  mutate: () => {},
});
import { useQueryClient } from "@tanstack/react-query";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Ban, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Bans() {
  const { data: bans, isLoading } = useGetBans();
  const unban = useUnbanMember();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUnban = (userId: string) => {
    unban.mutate({ data: { userId } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/moderation/bans"] });
        toast({ title: "User unbanned successfully" });
      }
    });
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Ban className="text-destructive w-8 h-8" />
          Ban List
        </h1>
        <p className="text-muted-foreground mt-1">Permanently removed members</p>
      </div>

      <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="w-[120px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bans?.map((banEntry) => (
              <TableRow key={banEntry.userId} className="border-border/50 hover:bg-muted/20">
                <TableCell className="font-medium">
                  {banEntry.username}
                  <div className="text-[10px] text-muted-foreground font-mono">{banEntry.userId}</div>
                </TableCell>
                <TableCell className="max-w-md text-muted-foreground">{banEntry.reason || "No reason provided"}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                    onClick={() => handleUnban(banEntry.userId)}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Unban
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && bans?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                  No banned users.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
