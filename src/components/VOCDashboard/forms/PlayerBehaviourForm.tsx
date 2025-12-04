import { UseFormReturn } from "react-hook-form";
import { VOCConfig } from "@/types/voc-config";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface PlayerBehaviourFormProps {
  form: UseFormReturn<VOCConfig>;
  onSave: () => Promise<void>;
}

export function PlayerBehaviourForm({ form, onSave }: PlayerBehaviourFormProps) {
  const silentSniperOptions = [
    { id: "formal", label: "Formal dingin" },
    { id: "fake-empathy", label: "Empati palsu" },
    { id: "delay", label: "Delay 3–5 menit" },
    { id: "redirect", label: "Redirect ke admin" },
  ];

  const vipToneOptions = [
    { id: "warm", label: "Lebih hangat" },
    { id: "caring", label: "Lebih manja" },
    { id: "quick", label: "Lebih cepat" },
    { id: "respectful", label: "Lebih hormat" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-button-hover mb-2">Player Behaviour Controls</h3>
          <p className="text-sm text-muted-foreground">
            Menentukan bagaimana Danila memperlakukan tipe pemain (VIP, normal, marah, hunter)
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="playerBehaviour.personalizationLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personalization Level (1-10) *</FormLabel>
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
                      <span>Minim (1)</span>
                      <span className="font-semibold text-foreground">{field.value || 5}/10</span>
                      <span>Sangat Personal (10)</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>Tingkat personalisasi (nama, jam main, game favorit)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="playerBehaviour.sentimentalMemory"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Sentimental Memory *</FormLabel>
                  <FormDescription>
                    Danila ingat hal-hal kecil (ex: "kak sempet main jam 2 pagi ya?")
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

          <FormField
            control={form.control}
            name="playerBehaviour.antiHunterAggressiveness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anti-Hunter Aggressiveness (1-10) *</FormLabel>
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
                      <span>Lembut (1)</span>
                      <span className="font-semibold text-foreground">{field.value || 5}/10</span>
                      <span>Dingin/Formal (10)</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>Sikap terhadap bonus hunter</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="playerBehaviour.silentSniperStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Silent Sniper Style *</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {silentSniperOptions.map((option) => (
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
                <FormDescription>Gaya menangani pemain bermasalah (bisa pilih lebih dari satu)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="playerBehaviour.vipThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIP Threshold *</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Deposits ≥ 50 juta/bulan" {...field} />
                </FormControl>
                <FormDescription>Kriteria pemain VIP</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="playerBehaviour.vipTone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIP Tone *</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {vipToneOptions.map((option) => (
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
                <FormDescription>Cara memperlakukan VIP (bisa pilih lebih dari satu)</FormDescription>
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
            Save Player Behaviour
          </Button>
        </div>
      </Card>
    </div>
  );
}
