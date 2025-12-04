import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, DollarSign, Banknote, Gift, Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { TicketDetailDialog } from "./TicketDetailDialog";
import { Ticket, TicketStatus, TicketCategory, statusLabels, categoryLabels } from "@/types/ticket";

interface TicketListProps {
  category: TicketCategory;
}

// Mock data for demonstration
const mockTickets: Ticket[] = [
  // NEW: Deposit ticket dari bukti transfer Ceptarina Pelawi
  {
    id: "7",
    ticket_number: "D202511260001",
    category: "deposit",
    status: "pending",
    user_id_player: "CEPT9836",
    user_name: "Ceptarina Pelawi",
    amount: 5000000,
    bank_destination: "Bank BRI (530601034438533) a/n CEPTARINA PELAWI",
    sender_name: "CEPTARINA PELAWI",
    assigned_to: "#ADM002",
    assigned_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    admin_note: "User deposit via BRImo. Ref: 216585189836. Transfer dari rekening sendiri 3274****537 ke 530601034438533. Keterangan: 'Aku'. Tanggal transfer: 16 Jan 2021 08:34:48 WIB.",
    attachments: [
      {
        id: "att7",
        ticket_id: "7",
        file_name: "bukti-transfer-brimo.jpg",
        file_url: "/uploads/bukti-transfer-ceptarina.jpg",
        uploaded_at: new Date().toISOString()
      }
    ]
  },
  // Deposit ticket
  {
    id: "1",
    ticket_number: "D202501010001",
    category: "deposit",
    status: "pending",
    user_id_player: "ABC123456",
    user_name: "Budi Santoso",
    amount: 5000000,
    bank_destination: "BCA Tampung 1 (0881-xxx-999)",
    sender_name: "Budi Santoso",
    assigned_to: "#ADM003",
    assigned_at: "2025-11-25T22:14:30Z",
    created_at: "2025-11-25T22:14:00Z",
    updated_at: "2025-11-25T22:14:00Z",
    attachments: [
      {
        id: "att1",
        ticket_id: "1",
        file_name: "bukti_transfer.jpg",
        file_url: "#",
        uploaded_at: "2025-11-25T22:14:00Z"
      }
    ]
  },
  // General ticket - Angry user, human takeover
  {
    id: "2",
    ticket_number: "G202501010002",
    category: "general",
    status: "pending",
    user_id_player: "XYZ789012",
    user_name: "Andi Wijaya",
    assigned_to: "#ADM001",
    assigned_at: "2025-11-25T21:45:15Z",
    created_at: "2025-11-25T21:45:00Z",
    updated_at: "2025-11-25T21:45:00Z",
    admin_note: "User menggunakan kata-kata kasar dan mengancam. AI tidak dapat menangani. Memerlukan human agent untuk de-eskalasi. User komplain akun terkunci setelah WD besar."
  },
  // Reward ticket - User claiming merchandise
  {
    id: "3",
    ticket_number: "R202501010003",
    category: "reward",
    status: "pending",
    user_id_player: "CITRA77",
    user_name: "Siti Nurhaliza",
    amount: 2500000,
    assigned_to: "#ADM002",
    assigned_at: "2025-11-25T20:30:20Z",
    created_at: "2025-11-25T20:30:00Z",
    updated_at: "2025-11-25T20:30:00Z",
    admin_note: "User claim Official Merchandise Eksklusif (T-shirt + Korek Api + Sticker). Total deposit Rp2.500.000 dalam periode 1-14 Nov. Kualifikasi: verified. Claim via WA official.",
    attachments: [
      {
        id: "att2",
        ticket_id: "3",
        file_name: "bukti_deposit_akumulasi.jpg",
        file_url: "#",
        uploaded_at: "2025-11-25T20:30:00Z"
      }
    ]
  },
  // Withdraw ticket - User won 10 million
  {
    id: "4",
    ticket_number: "W202501010004",
    category: "withdraw",
    status: "pending",
    user_id_player: "WIN999888",
    user_name: "Reza Pratama",
    amount: 10000000,
    bank_destination: "Mandiri a/n Reza Pratama (1370-xxx-777)",
    assigned_to: "#ADM003",
    assigned_at: "2025-11-25T23:05:45Z",
    created_at: "2025-11-25T23:05:30Z",
    updated_at: "2025-11-25T23:05:30Z",
    admin_note: "User menang Rp10.000.000 dari game Pragmatic Gates of Olympus. Request withdraw ke rekening Mandiri. Verifikasi kemenangan dan identitas diperlukan."
  },
  // Additional approved deposit
  {
    id: "5",
    ticket_number: "D202501010005",
    category: "deposit",
    status: "approved",
    user_id_player: "DEP555222",
    user_name: "Linda Kusuma",
    amount: 3000000,
    bank_destination: "BCA Tampung 2 (0882-xxx-111)",
    sender_name: "Linda K",
    assigned_to: "#ADM001",
    assigned_at: "2025-11-25T19:20:00Z",
    resolved_by: "#ADM001",
    resolved_at: "2025-11-25T19:25:00Z",
    created_at: "2025-11-25T19:20:00Z",
    updated_at: "2025-11-25T19:25:00Z",
    attachments: [
      {
        id: "att3",
        ticket_id: "5",
        file_name: "transfer_bca.jpg",
        file_url: "#",
        uploaded_at: "2025-11-25T19:20:00Z"
      }
    ]
  },
  // Declined withdraw
  {
    id: "6",
    ticket_number: "W202501010006",
    category: "withdraw",
    status: "declined",
    user_id_player: "FAIL123987",
    user_name: "Hendra Gunawan",
    amount: 5000000,
    bank_destination: "BRI a/n Hendra (0123-xxx-456)",
    assigned_to: "#ADM002",
    assigned_at: "2025-11-25T18:00:00Z",
    resolved_by: "#ADM002",
    resolved_at: "2025-11-25T18:15:00Z",
    decline_reason: "nama_tidak_sesuai",
    decline_note: "Nama rekening tidak sesuai dengan nama akun player. Rekening a/n Hendra Gunawan, akun terdaftar a/n Hendra Setiawan.",
    created_at: "2025-11-25T18:00:00Z",
    updated_at: "2025-11-25T18:15:00Z"
  }
];

export function TicketList({ category }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryIcon = (cat: TicketCategory) => {
    switch (cat) {
      case "general": return FileText;
      case "deposit": return DollarSign;
      case "withdraw": return Banknote;
      case "reward": return Gift;
    }
  };

  const CategoryIcon = getCategoryIcon(category);

  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setTickets(prevTickets => 
      prevTickets.map(t => t.id === updatedTicket.id ? updatedTicket : t)
    );
    setSelectedTicket(null);
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesCategory = ticket.category === category;
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesSearch = 
      ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user_id_player.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusBadgeVariant = (status: TicketStatus): "pending" | "approved" | "declined" => {
    switch (status) {
      case "pending": return "pending";
      case "approved": return "approved";
      case "declined": return "declined";
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "declined": return <XCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-button-hover mb-2">
                Ticket {categoryLabels[category]}
              </h3>
              <p className="text-sm text-muted-foreground">
                Kelola dan verifikasi ticket {categoryLabels[category].toLowerCase()}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari ticket number, User ID, atau nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as TicketStatus | "all")} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="declined">Declined</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Tidak ada ticket ditemukan</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket Number</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Nama</TableHead>
                    {(category === "deposit" || category === "withdraw" || category === "reward") && (
                      <TableHead>Nominal</TableHead>
                    )}
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-primary">
                            #{ticket.ticket_number}
                          </span>
                          {ticket.assigned_to && (
                            <Badge variant="outline" className="text-xs">
                              Assigned
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{ticket.user_id_player}</TableCell>
                      <TableCell className="text-muted-foreground">{ticket.user_name || "-"}</TableCell>
                      {(category === "deposit" || category === "withdraw" || category === "reward") && (
                        <TableCell className="font-medium">{formatCurrency(ticket.amount)}</TableCell>
                      )}
                      <TableCell className="text-muted-foreground">{formatDateTime(ticket.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          {statusLabels[ticket.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>

      {selectedTicket && (
        <TicketDetailDialog
          ticket={selectedTicket}
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleTicketUpdate}
        />
      )}
    </>
  );
}
