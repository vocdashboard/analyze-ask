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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, CheckCircle2, Circle, Plus } from "lucide-react";
import { toast } from "sonner";

interface Admin {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  position: string;
  assignedChats: number;
  status: "Standby" | "Break";
}

const POSITION_OPTIONS = ["Leader", "Customer Services", "Captain", "Joker"] as const;

// Sample data
const sampleAdmins: Admin[] = [
  {
    id: "#ADM001",
    name: "Ahmad Yusuf",
    whatsapp: "+62 812 3456 7890",
    email: "ahmad.yusuf@company.com",
    position: "Leader",
    assignedChats: 15,
    status: "Standby",
  },
  {
    id: "#ADM002",
    name: "Siti Nurhaliza",
    whatsapp: "+62 813 4567 8901",
    email: "siti.nur@company.com",
    position: "Customer Services",
    assignedChats: 8,
    status: "Break",
  },
  {
    id: "#ADM003",
    name: "Budi Santoso",
    whatsapp: "+62 814 5678 9012",
    email: "budi.santoso@company.com",
    position: "Captain",
    assignedChats: 12,
    status: "Standby",
  },
];

export function AdminRoleSection() {
  const [admins, setAdmins] = useState<Admin[]>(sampleAdmins);
  const [selectedAdmins, setSelectedAdmins] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    position: "",
  });

  const toggleAdminSelection = (adminId: string) => {
    const newSelection = new Set(selectedAdmins);
    if (newSelection.has(adminId)) {
      newSelection.delete(adminId);
    } else {
      newSelection.add(adminId);
    }
    setSelectedAdmins(newSelection);
  };

  const toggleAllAdmins = () => {
    if (selectedAdmins.size === admins.length) {
      setSelectedAdmins(new Set());
    } else {
      setSelectedAdmins(new Set(admins.map(a => a.id)));
    }
  };

  const toggleStatus = (adminId: string) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === "Standby" ? "Break" : "Standby" }
        : admin
    ));
    toast.success("Status updated");
  };

  const handleAddAdmin = () => {
    if (!formData.name || !formData.whatsapp || !formData.email || !formData.position) {
      toast.error("Please fill all fields");
      return;
    }

    const newAdmin: Admin = {
      id: `#ADM${String(admins.length + 1).padStart(3, "0")}`,
      name: formData.name,
      whatsapp: formData.whatsapp,
      email: formData.email,
      position: formData.position,
      assignedChats: 0,
      status: "Standby",
    };

    setAdmins([...admins, newAdmin]);
    setFormData({ name: "", whatsapp: "", email: "", position: "" });
    setDialogOpen(false);
    toast.success("Admin added successfully!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-button-hover mb-2">Admin Role Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage admins responsible for handling live chat
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
            <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new admin. All fields are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter admin name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    placeholder="+62 xxx xxxx xxxx"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                  >
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITION_OPTIONS.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin}>Add Admin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedAdmins.size === admins.length}
                    onCheckedChange={toggleAllAdmins}
                  />
                </TableHead>
                <TableHead>Admin ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Assigned Chats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedAdmins.has(admin.id)}
                      onCheckedChange={() => toggleAdminSelection(admin.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{admin.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(admin.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{admin.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{admin.whatsapp}</TableCell>
                  <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                  <TableCell className="text-muted-foreground">{admin.position}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{admin.assignedChats} chats</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={admin.status === "Standby" ? "default" : "secondary"}
                      className={
                        admin.status === "Standby"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                          : "bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20"
                      }
                    >
                      {admin.status === "Standby" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <Circle className="h-3 w-3 mr-1" />
                      )}
                      {admin.status}
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
                        <DropdownMenuItem onClick={() => toggleStatus(admin.id)}>
                          Mark as {admin.status === "Standby" ? "Break" : "Standby"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Viewing ${admin.name}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Editing ${admin.name}`)}>
                          Edit Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => {
                            setAdmins(admins.filter(a => a.id !== admin.id));
                            toast.success("Admin removed");
                          }}
                        >
                          Remove Admin
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
    </div>
  );
}