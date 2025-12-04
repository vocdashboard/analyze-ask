import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, CheckCircle2, Circle, Edit } from "lucide-react";
import { toast } from "sonner";

interface ChatUser {
  id: string;
  name: string;
  contact: string;
  date: string;
  message: string;
  status: "Done" | "Undone";
}

// Sample data
const sampleUsers: ChatUser[] = [
  {
    id: "#10248",
    name: "Shakil Ahmed",
    contact: "+62 812 3456 7890",
    date: "21 Jan 2026",
    message: "Saya mau deposit tapi...",
    status: "Done",
  },
  {
    id: "#10246",
    name: "Arafat Hossain",
    contact: "+62 813 4567 8901",
    date: "21 Jan 2026",
    message: "Kapan bonus saya cair?",
    status: "Undone",
  },
  {
    id: "#10247",
    name: "Nusrat Jahan",
    contact: "+62 814 5678 9012",
    date: "22 Jan 2026",
    message: "Terima kasih sudah help",
    status: "Done",
  },
  {
    id: "#10245",
    name: "Tania Akter",
    contact: "+62 815 6789 0123",
    date: "22 Jan 2026",
    message: "Akun saya kok di lock?",
    status: "Undone",
  },
];

export function UserSection() {
  const [users, setUsers] = useState<ChatUser[]>(sampleUsers);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ChatUser | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    contact: "",
    message: "",
  });

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const toggleAllUsers = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const toggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Done" ? "Undone" : "Done" }
        : user
    ));
    toast.success("Status updated");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const openEditDialog = (user: ChatUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      contact: user.contact,
      message: user.message,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    setUsers(users.map(user =>
      user.id === editingUser.id
        ? { ...user, ...editForm }
        : user
    ));
    
    setEditDialogOpen(false);
    setEditingUser(null);
    toast.success("User data updated successfully");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-button-hover mb-2">Live Chat Users</h3>
          <p className="text-sm text-muted-foreground">
            List of users who have chatted with the AI assistant
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedUsers.size === users.length}
                    onCheckedChange={toggleAllUsers}
                  />
                </TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.contact}</TableCell>
                  <TableCell className="text-muted-foreground">{user.date}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {user.message}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Done" ? "default" : "secondary"}
                      className={
                        user.status === "Done"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                          : "bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20"
                      }
                    >
                      {user.status === "Done" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <Circle className="h-3 w-3 mr-1" />
                      )}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(user.id)}>
                          Mark as {user.status === "Done" ? "Undone" : "Done"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Viewing ${user.name}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Opening chat with ${user.name}`)}>
                          Open Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-button-hover">
              Edit User Data
            </DialogTitle>
            <DialogDescription>
              Make changes to the user information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">User Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter user name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-contact">Contact</Label>
              <Input
                id="edit-contact"
                value={editForm.contact}
                onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                placeholder="Enter contact number"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-message">Last Message</Label>
              <Textarea
                id="edit-message"
                value={editForm.message}
                onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                placeholder="Enter last message"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="rounded-full bg-button-hover hover:bg-muted text-black"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}