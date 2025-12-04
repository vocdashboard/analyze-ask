import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  DollarSign, 
  Banknote, 
  Gift, 
  Paperclip, 
  CheckCircle2, 
  XCircle,
  ChevronDown,
  Clock
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Ticket, DeclineReason, declineReasonLabels, statusLabels, categoryLabels } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";

interface TicketDetailDialogProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedTicket: Ticket) => void;
}

export function TicketDetailDialog({ ticket, open, onClose, onUpdate }: TicketDetailDialogProps) {
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState<DeclineReason | "">("");
  const [declineNote, setDeclineNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getCategoryIcon = () => {
    switch (ticket.category) {
      case "general": return FileText;
      case "deposit": return DollarSign;
      case "withdraw": return Banknote;
      case "reward": return Gift;
    }
  };

  const CategoryIcon = getCategoryIcon();

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
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement approve API call
      // await supabase.from('tickets').update({ status: 'approved', ... })
      
      const updatedTicket: Ticket = {
        ...ticket,
        status: 'approved',
        resolved_by: ticket.assigned_to,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      toast({
        title: "Ticket Approved",
        description: `Ticket #${ticket.ticket_number} berhasil disetujui`,
      });
      
      onUpdate(updatedTicket);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal approve ticket",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!declineReason) {
      toast({
        title: "Error",
        description: "Pilih alasan penolakan",
        variant: "destructive"
      });
      return;
    }

    if (declineReason === "lainnya" && !declineNote.trim()) {
      toast({
        title: "Error",
        description: "Catatan wajib diisi untuk alasan 'Lainnya'",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement decline API call
      // await supabase.from('tickets').update({ status: 'declined', decline_reason, decline_note, ... })
      
      const updatedTicket: Ticket = {
        ...ticket,
        status: 'declined',
        decline_reason: declineReason,
        decline_note: declineNote || undefined,
        resolved_by: ticket.assigned_to,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      toast({
        title: "Ticket Declined",
        description: `Ticket #${ticket.ticket_number} ditolak`,
      });
      
      onUpdate(updatedTicket);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal decline ticket",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = ticket.status === "pending";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-8">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-button-hover flex items-center justify-center">
                <CategoryIcon className="h-5 w-5 text-black" />
              </div>
              <div>
                <DialogTitle>
                  Ticket #{ticket.ticket_number}
                </DialogTitle>
                <DialogDescription>
                  {categoryLabels[ticket.category]} - {formatDateTime(ticket.created_at)}
                </DialogDescription>
              </div>
            </div>
            <Badge variant={ticket.status === "pending" ? "pending" : ticket.status === "approved" ? "approved" : "declined"}>
              {ticket.status === "pending" && <Clock className="h-4 w-4" />}
              {statusLabels[ticket.status]}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* User Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Informasi User
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-medium">{ticket.user_id_player}</p>
                </div>
                {ticket.user_name && (
                  <div>
                    <Label className="text-muted-foreground">Nama User</Label>
                    <p className="font-medium">{ticket.user_name}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Admin Notes from AI */}
            {ticket.admin_note && (
              <>
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Catatan dari AI Agent
                  </h3>
                  <p className="text-sm leading-relaxed">{ticket.admin_note}</p>
                </div>
                <Separator />
              </>
            )}

            {/* Transaction Details */}
            {(ticket.amount || ticket.sender_name || ticket.bank_destination) && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Detail Transaksi
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {ticket.sender_name && (
                      <div>
                        <Label className="text-muted-foreground">Nama Pengirim</Label>
                        <p className="font-medium">{ticket.sender_name}</p>
                      </div>
                    )}
                    {ticket.amount && (
                      <div>
                        <Label className="text-muted-foreground">Nominal</Label>
                        <p className="font-medium text-primary">{formatCurrency(ticket.amount)}</p>
                      </div>
                    )}
                    {ticket.bank_destination && (
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Bank Tujuan</Label>
                        <p className="font-medium">{ticket.bank_destination}</p>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Bukti Transfer
                  </h3>
                  <div className="space-y-2">
                    {ticket.attachments.map((att) => (
                      <Button
                        key={att.id}
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href={att.file_url} target="_blank" rel="noopener noreferrer">
                          <Paperclip className="h-4 w-4 mr-2" />
                          {att.file_name}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Assignment Info */}
            {ticket.assigned_to && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Assignment
                  </h3>
                  <div>
                    <Label className="text-muted-foreground">Auto-assigned to</Label>
                    <p className="font-medium">{ticket.assigned_to}</p>
                    {ticket.assigned_at && (
                      <p className="text-sm text-muted-foreground">{formatDateTime(ticket.assigned_at)}</p>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Action Buttons for Pending Tickets */}
            {isPending && (
              <div className="space-y-4 pt-2 relative">
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold" 
                    onClick={handleApprove}
                    disabled={isSubmitting}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    APPROVE
                  </Button>
                  
                  <Collapsible open={isDeclineOpen} onOpenChange={setIsDeclineOpen}>
                    <CollapsibleTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-500 text-white font-semibold">
                        DECLINE
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4 absolute left-1/2 -translate-x-1/2 w-full max-w-md z-10">
                      <div className="space-y-3 p-4 border rounded-lg bg-card">
                        <Label className="font-semibold">Alasan Penolakan (wajib pilih 1):</Label>
                        <RadioGroup value={declineReason} onValueChange={(v) => setDeclineReason(v as DeclineReason)}>
                          {Object.entries(declineReasonLabels).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <RadioGroupItem value={key} id={key} />
                              <Label htmlFor={key} className="font-normal cursor-pointer">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>

                        <div className="space-y-2">
                          <Label htmlFor="decline-note">
                            Catatan tambahan {declineReason === "lainnya" && "(wajib)"}:
                          </Label>
                          <Textarea
                            id="decline-note"
                            placeholder="Masukkan catatan..."
                            value={declineNote}
                            onChange={(e) => setDeclineNote(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>

                        <Button 
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
                          onClick={handleDecline}
                          disabled={isSubmitting || !declineReason}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Kirim Penolakan & Tutup Ticket
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            )}

            {/* Resolution Info for Resolved Tickets */}
            {!isPending && (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold text-sm uppercase tracking-wide">
                  Status Resolusi
                </h3>
                {ticket.status === "declined" && ticket.decline_reason && (
                  <div>
                    <Label className="text-muted-foreground">Alasan Penolakan</Label>
                    <p className="font-medium">{declineReasonLabels[ticket.decline_reason]}</p>
                    {ticket.decline_note && (
                      <p className="text-sm mt-1">{ticket.decline_note}</p>
                    )}
                  </div>
                )}
                {ticket.resolved_at && (
                  <div>
                    <Label className="text-muted-foreground">Resolved at</Label>
                    <p className="text-sm">{formatDateTime(ticket.resolved_at)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
