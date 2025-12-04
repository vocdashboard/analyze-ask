import { UseFormReturn } from "react-hook-form";
import { VOCConfig } from "@/types/voc-config";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface SafetyCrisisFormProps {
  form: UseFormReturn<VOCConfig>;
  onSave: () => Promise<void>;
}

export function SafetyCrisisForm({ form, onSave }: SafetyCrisisFormProps) {
  const bonusAllowed = form.watch("safetyCrisis.bonusPreventifAllowed");

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-button-hover mb-2">Safety & Crisis Settings</h3>
          <p className="text-sm text-muted-foreground">
            Mengatur batas aman Danila & cara merespons masalah sensitif
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="safetyCrisis.crisisToneStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crisis Tone Style *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih gaya saat krisis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high-empathy">High empathy</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="defensive">Defensif</SelectItem>
                    <SelectItem value="neutral">Netral</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Cara Danila merespons situasi krisis</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyCrisis.bonusPreventifAllowed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Bonus Preventif Allowed? *</FormLabel>
                  <FormDescription>
                    Bolehkah Danila memberikan bonus preventif?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {bonusAllowed && (
            <FormField
              control={form.control}
              name="safetyCrisis.bonusPreventifLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batas Nominal Bonus</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 50.000" {...field} />
                  </FormControl>
                  <FormDescription>Batas maksimal bonus yang bisa diberikan</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="safetyCrisis.riskAppetite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Appetite (1-100) *</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      value={[field.value || 50]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sangat Hati-hati (20)</span>
                      <span className="font-semibold text-foreground">{field.value || 50}/100</span>
                      <span>Gaspol Persuasi (100)</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>Tingkat risiko dalam persuasi</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyCrisis.forbiddenPhrases"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forbidden Phrases *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder='ex: "dijamin menang", "pasti cuan"'
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Frasa yang tidak boleh digunakan (pisahkan dengan koma)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyCrisis.allowedSensitiveTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allowed Sensitive Terms *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder='ex: "balik modal", "tipis-tipis dulu bang"'
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Istilah sensitif yang diperbolehkan (pisahkan dengan koma)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyCrisis.crisisKeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crisis Keywords (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder='ex: viral, scam, polisikan, screenshot'
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Kata kunci yang menandakan situasi krisis</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyCrisis.crisisResponseTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crisis Response Template *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder='ex: "Kak, aku bantu dulu sebentar ya. Kita selesaikan bareng pelan-pelan."'
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Template respons untuk situasi krisis</FormDescription>
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
            Save Safety & Crisis Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
