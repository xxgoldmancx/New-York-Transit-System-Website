const useGetRoles = () => ({ data: [], isLoading: false });
const useAssignRole = () => ({ mutate: () => {} });
const useRemoveRole = () => ({ mutate: () => {} });
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, UserPlus, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function intToHex(color: number) {
  if (color === 0) return null;
  return `#${color.toString(16).padStart(6, '0')}`;
}

export function Roles() {
  const { data: roles, isLoading } = useGetRoles();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [modal, setModal] = useState<{ isOpen: boolean, type: 'assign' | 'remove', roleId: string | null, roleName: string }>({
    isOpen: false, type: 'assign', roleId: null, roleName: ""
  });
  const [userId, setUserId] = useState("");

  const handleAction = () => {
    if (!modal.roleId || !userId.trim()) return;

    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guild/roles"] });
      toast({ title: `Successfully ${modal.type === 'assign' ? 'assigned' : 'removed'} role` });
      setModal({ ...modal, isOpen: false });
      setUserId("");
    };

    if (modal.type === 'assign') {
      assignRole.mutate({ data: { roleId: modal.roleId, userId } }, { onSuccess });
    } else {
      removeRole.mutate({ data: { roleId: modal.roleId, userId } }, { onSuccess });
    }
  };

  // Sort roles by position descending
  const sortedRoles = roles ? [...roles].sort((a, b) => b.position - a.position) : [];

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Shield className="text-primary w-8 h-8" />
          Guild Roles
        </h1>
        <p className="text-muted-foreground mt-1">Hierarchy and role management</p>
      </div>

      <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Role Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="w-[180px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRoles.map((role) => {
              const colorHex = intToHex(role.color);
              return (
                <TableRow key={role.id} className="border-border/50 hover:bg-muted/20">
                  <TableCell>
                    <div 
                      className="w-4 h-4 rounded-full shadow-inner border border-black/10" 
                      style={{ backgroundColor: colorHex || 'hsl(var(--muted-foreground))' }}
                    />
                  </TableCell>
                  <TableCell className="font-medium font-display" style={{ color: colorHex || 'inherit' }}>
                    {role.name}
                    {role.hoist && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Hoisted</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{role.memberCount}</TableCell>
                  <TableCell className="text-muted-foreground font-mono">{role.position}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10"
                        title="Assign to User"
                        onClick={() => setModal({ isOpen: true, type: 'assign', roleId: role.id, roleName: role.name })}
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Remove from User"
                        onClick={() => setModal({ isOpen: true, type: 'remove', roleId: role.id, roleName: role.name })}
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {!isLoading && roles?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No roles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modal.isOpen} onOpenChange={(open) => !open && setModal({ ...modal, isOpen: false })}>
        <DialogContent className="bg-card border-border/50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display capitalize text-xl">
              {modal.type} Role
            </DialogTitle>
            <DialogDescription>
              {modal.type === 'assign' ? 'Give' : 'Take'} the <span className="font-semibold text-foreground">{modal.roleName}</span> role {modal.type === 'assign' ? 'to' : 'from'} a user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
                placeholder="123456789012345678" 
                className="bg-background border-border/50 font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ ...modal, isOpen: false })} className="bg-transparent border-border/50 hover:bg-muted">Cancel</Button>
            <Button 
              variant={modal.type === 'remove' ? 'destructive' : 'default'} 
              onClick={handleAction}
              disabled={!userId.trim()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
