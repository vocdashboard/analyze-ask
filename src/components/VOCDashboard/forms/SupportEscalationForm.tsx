import { UseFormReturn } from "react-hook-form";
import { VOCConfig } from "@/types/voc-config";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface SupportEscalationFormProps {
  form: UseFormReturn<VOCConfig>;
  onSave: () => Promise<void>;
}

export function SupportEscalationForm({ form, onSave }: SupportEscalationFormProps) {
  const escalationOptions = [
    { id: "angry8", label: "Jika marah level 8+" },
    { id: "wd10min", label: "Jika WD pending > 10 menit" },
    { id: "accountLock", label: "Jika akun lock" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-button-hover mb-2">Support & Escalation</h3>
          <p className="text-sm text-muted-foreground">
            Menentukan SOP bantuan & eskalasi ke manusia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="supportEscalation.adminContactMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin/PIC Contact Method *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih metode kontak" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="wa">WhatsApp</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="ticket">Ticket internal</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Cara menghubungi admin/PIC</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportEscalation.adminContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Contact *</FormLabel>
                <FormControl>
                  <Input placeholder="ex: +62xxxxxx" {...field} />
                </FormControl>
                <FormDescription>Nomor atau username kontak admin</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportEscalation.picActiveHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIC Active Hours *</FormLabel>
                <FormControl>
                  <Input placeholder="ex: 08:00–02:00 WIB" {...field} />
                </FormControl>
                <FormDescription>Jam aktif PIC</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportEscalation.sopStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SOP Style *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih gaya SOP" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="quick">Cepat & pendek</SelectItem>
                    <SelectItem value="detailed">Penjelasan lengkap</SelectItem>
                    <SelectItem value="neutral">Netral & formal</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Gaya penjelasan dalam SOP</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportEscalation.escalationThreshold"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Escalation Threshold *</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {escalationOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            const updated = checked
                              ? [...current, option.id]
                              : current.filter((val) => val !== option.id);
                            field.onChange(updated);
                          }}
                        />
                        <label className="text-sm text-foreground cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>Kondisi untuk eskalasi ke manusia (bisa pilih lebih dari satu)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportEscalation.defaultEscalationMessage"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Default Escalation Message *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder='ex: "Sebentar kak, aku hubungkan ke tim senior ya."'
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Pesan default saat eskalasi ke manusia</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button 
            type="button"
            onClick={onSave}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Support & Escalation
          </Button>
        </div>
      </Card>
    </div>
  );
}
