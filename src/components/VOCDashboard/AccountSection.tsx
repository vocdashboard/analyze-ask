import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface AccountSectionProps {
  form: UseFormReturn<any>;
  onSave: () => Promise<void>;
}

export function AccountSection({ form, onSave }: AccountSectionProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-button-hover mb-2">Account Settings</h3>
          <p className="text-sm text-muted-foreground">
            Kelola informasi akun Anda
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="account.userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama User</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama user" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account.whatsappNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No Whatsapp User</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: +62812345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account.position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jabatan User</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Manager, Admin, CS" {...field} />
                </FormControl>
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
            Save Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
