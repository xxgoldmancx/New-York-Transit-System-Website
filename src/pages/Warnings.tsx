const useGetWarnings = () => ({ data: [], isLoading: false });
const useDeleteWarning = () => ({
  mutate: () => {},
});
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Warnings() {
  const { data: warnings, isLoading } = useGetWarnings();
  const deleteWarn = useDeleteWarning();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    deleteWarn.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/moderation/warnings"] });
        toast({ title: "Warning deleted successfully" });
      }
    });
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <ShieldAlert className="text-yellow-500 w-8 h-8" />
          Warning Log
        </h1>
        <p className="text-muted-foreground mt-1">History of all active member warnings</p>
      </div>

      <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Moderator</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warnings?.map((warning) => (
              <TableRow key={warning.id} className="border-border/50 hover:bg-muted/20">
                <TableCell className="font-medium">
                  {warning.username}
                  <div className="text-[10px] text-muted-foreground font-mono">{warning.userId}</div>
                </TableCell>
                <TableCell className="max-w-md truncate">{warning.reason}</TableCell>
                <TableCell className="text-muted-foreground">{warning.moderatorName}</TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {format(new Date(warning.createdAt), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(warning.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && warnings?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No active warnings.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
