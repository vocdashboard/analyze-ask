import { UseFormReturn } from "react-hook-form";
import { VOCConfig } from "@/types/voc-config";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";
interface BrandProfileFormProps {
  form: UseFormReturn<VOCConfig>;
  onSave: () => Promise<void>;
}
export function BrandProfileForm({
  form,
  onSave
}: BrandProfileFormProps) {
  return <div className="max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-button-hover mb-2">Brand Persona</h3>
          <p className="text-sm text-muted-foreground">
            Menentukan Persona Agent AI  
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="brandProfile.brandName" render={({
          field
        }) => <FormItem>
                <FormLabel>Brand Name *</FormLabel>
                <FormControl>
                  <Input placeholder="ex: ACG77" {...field} />
                </FormControl>
                <FormDescription>Nama brand lengkap</FormDescription>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="brandProfile.shortName" render={({
          field
        }) => <FormItem>
                <FormLabel>Short Name / Nickname *</FormLabel>
                <FormControl>
                  <Input placeholder='ex: ACG, ACG7' {...field} />
                </FormControl>
                <FormDescription>Nama panggilan brand</FormDescription>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="brandProfile.slogan" render={({
          field
        }) => <FormItem className="md:col-span-2">
                <FormLabel>Slogan *</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Menang Berapapun Dibayar" {...field} />
                </FormControl>
                <FormDescription>Tagline utama brand</FormDescription>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="brandProfile.agentName" render={({
          field
        }) => <FormItem>
                <FormLabel>Agent Name *</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Danila, Sarah, Kevin" {...field} />
                </FormControl>
                <FormDescription>Nama agent AI</FormDescription>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="brandProfile.agentGender" render={({
          field
        }) => <FormItem>
                <FormLabel>Agent Gender *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih gender agent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Gender agent AI</FormDescription>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="brandProfile.toneStyle" render={({
          field
        }) => <FormItem>
                <FormLabel>Tone Style *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih gaya bicara" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gaul">Gaul</SelectItem>
                    <SelectItem value="sopan">Sopan</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="ramah">Ramah</SelectItem>
                    <SelectItem value="genz">Gen Z</SelectItem>
                    <SelectItem value="netral">Netral</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Gaya komunikasi brand</FormDescription>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="brandProfile.defaultCallToPlayer" render={({
          field
        }) => <FormItem>
                <FormLabel>Default Call-to-Player *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sapaan default" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kak">kak</SelectItem>
                    <SelectItem value="bang">bang</SelectItem>
                    <SelectItem value="bro">bro</SelectItem>
                    <SelectItem value="bos">bos</SelectItem>
                    <SelectItem value="sis">sis</SelectItem>
                    <SelectItem value="auto-detect">auto-detect</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>​Sapaan User    </FormDescription>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="brandProfile.emojiPreference" render={({
          field
        }) => <FormItem>
                <FormLabel>Emoji Preference *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kebijakan emoji" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bebas">Bebas</SelectItem>
                    <SelectItem value="terbatas">Terbatas (max 3 per pesan)</SelectItem>
                    <SelectItem value="tidak">Tidak pakai emoji</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Kebijakan penggunaan emoji</FormDescription>
                <FormMessage />
              </FormItem>} />
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button type="button" onClick={onSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Brand Persona
          </Button>
        </div>
      </Card>
    </div>;
}