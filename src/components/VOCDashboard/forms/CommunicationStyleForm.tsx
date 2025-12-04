import { UseFormReturn } from "react-hook-form";
import { VOCConfig } from "@/types/voc-config";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface CommunicationStyleFormProps {
  form: UseFormReturn<VOCConfig>;
  onSave: () => Promise<void>;
}

export function CommunicationStyleForm({ form, onSave }: CommunicationStyleFormProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-button-hover mb-2">Communication Style</h3>
          <p className="text-sm text-muted-foreground">
            Mengatur gaya bicara Danila berdasarkan kepribadian brand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="communicationStyle.formalityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formality Level (1-10) *</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value || 5]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sangat Santai (1)</span>
                      <span className="font-semibold text-foreground">{field.value || 5}/10</span>
                      <span>Super Formal (10)</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>Tingkat formalitas komunikasi</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communicationStyle.warmthLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warmth Level (1-10) *</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value || 5]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Dingin (1)</span>
                      <span className="font-semibold text-foreground">{field.value || 5}/10</span>
                      <span>Hangat (10)</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>Menentukan apakah Danila terasa "hangat", "netral", atau "dingin"</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communicationStyle.humorUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Humor Usage *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih frekuensi humor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Tidak perlu humor</SelectItem>
                    <SelectItem value="rare">Jarang</SelectItem>
                    <SelectItem value="occasional">Sesekali</SelectItem>
                    <SelectItem value="frequent">Sering</SelectItem>
                    <SelectItem value="free">Bebas</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Seberapa sering Danila menggunakan humor</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communicationStyle.emojiStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji Style *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih gaya emoji" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="minimalist">Minimalis (🔥📌)</SelectItem>
                    <SelectItem value="expressive">Ekspresif (😍😂😉)</SelectItem>
                    <SelectItem value="none">Tanpa emoji</SelectItem>
                    <SelectItem value="free">Bebas</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Gaya penggunaan emoji</FormDescription>
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
            Save Communication Style
          </Button>
        </div>
      </Card>
    </div>
  );
}
