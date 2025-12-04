import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface APIDataSectionProps {
  form: UseFormReturn<any>;
  onSave: () => Promise<void>;
}

export function APIDataSection({ form, onSave }: APIDataSectionProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-button-hover mb-2">API Data</h3>
          <p className="text-sm text-muted-foreground">
            Kelola API keys untuk integrasi
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="apiData.supabaseApi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Supabase</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Masukkan API key Supabase" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  API key untuk koneksi ke Supabase database
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiData.chatGptApi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Chat GPT</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Masukkan API key Chat GPT" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  API key untuk integrasi dengan Chat GPT
                </FormDescription>
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
            Save API Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
