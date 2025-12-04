import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Download, 
  Upload, 
  FileText, 
  X, 
  FileUp, 
  ClipboardList, 
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  ChevronDown,
  ChevronUp,
  Layers,
  Settings2,
  Target,
  Gift,
  Zap,
  Trophy,
  Crown,
  Clock,
  FileCheck,
  Sparkles,
  Save,
  Pencil
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type ViewMode = "selection" | "manual-upload" | "fill-form";
type RewardMode = "fixed" | "tier" | "formula";
type LPCalculationMethod = "turnover" | "spin" | "winloss" | "manual" | "custom";
type PromoPointUnit = "LP" | "EXP" | "hybrid";
type RewardValueType = "fixed" | "percentage";
type ExpMode = "level_up" | "exp_store" | "both";

interface TierRow {
  id: string;
  min_point: string;
  reward: string;
  type: string;
  reward_value_type: RewardValueType;
}

interface FastEXPMission {
  id: string;
  activity: string;
  bonus_exp: string;
}

interface LevelUpReward {
  id: string;
  tier: string;
  min_exp: string;
  reward: string;
  reward_value_type: RewardValueType;
  reward_type: string;
}

interface VIPMultiplier {
  silver: string;
  gold: string;
  platinum: string;
  diamond: string;
}

interface PromoKnowledgeBase {
  client_id: string;
  promo_name: string;
  promo_type: string;
  intent_category: string;
  target_segment: string;
  trigger_event: string;
  reward_mode: RewardMode;
  reward_type: string;
  reward_amount: string;
  min_requirement: string;
  max_claim: string;
  turnover_rule: string;
  claim_frequency: string;
  reward_tiers: string;
  conversion_formula: string;
  platform_access: string;
  game_restriction: string;
  valid_from: string;
  valid_until: string;
  status: string;
  require_apk: boolean;
  geo_restriction: string;
  time_restriction: string;
  response_template_offer: string;
  response_template_requirement: string;
  response_template_instruction: string;
  ai_guidelines: string;
  default_behavior: string;
  completion_steps: string;
}

const defaultEntry: PromoKnowledgeBase = {
  client_id: "",
  promo_name: "",
  promo_type: "",
  intent_category: "",
  target_segment: "",
  trigger_event: "",
  reward_mode: "fixed",
  reward_type: "",
  reward_amount: "",
  min_requirement: "",
  max_claim: "",
  turnover_rule: "",
  claim_frequency: "",
  reward_tiers: "",
  conversion_formula: "",
  platform_access: "",
  game_restriction: "",
  valid_from: "",
  valid_until: "",
  status: "draft",
  require_apk: false,
  geo_restriction: "",
  time_restriction: "",
  response_template_offer: "",
  response_template_requirement: "",
  response_template_instruction: "",
  ai_guidelines: "",
  default_behavior: "",
  completion_steps: "",
};

// Updated Dropdown options
const DROPDOWN_OPTIONS = {
  promo_type: ["Loyalty Points", "EXP / Leveling", "Freechip", "Bonus Deposit", "Cashback", "Mission"],
  intent_category: ["Acquisition", "Retention", "Reactivation", "VIP"],
  target_segment: ["User Baru", "Existing", "VIP", "Dormant", "Semua"],
  trigger_event: ["First Deposit", "Daily Login", "Loss Streak", "APK Download", "TO", "Mission Completed"],
  reward_type: ["LP", "EXP", "Freechip", "Credit Game", "Persentase %", "Cashback", "Custom"],
  turnover_rule: ["0x", "1x", "5x", "8x", "Custom"],
  claim_frequency: ["Sekali", "Harian", "Mingguan", "Unlimited"],
  platform_access: ["Web", "APK", "Mobile", "Semua"],
  game_restriction: ["Semua", "Slots", "Live Casino", "Sports"],
  status: ["Active", "Paused", "Draft", "Expired"],
  geo_restriction: ["Indonesia", "Jakarta", "Global"],
  tier_reward_type: ["Credit Game", "Freechip", "Loyalty Points", "Cashback", "Bonus"],
};

const LP_CALCULATION_METHODS = [
  { value: "turnover", label: "Turnover (TO)" },
  { value: "spin", label: "Jumlah Spin" },
  { value: "winloss", label: "Jumlah Win/Loss" },
  { value: "manual", label: "Manual" },
  { value: "custom", label: "Custom" },
];

const LP_REWARD_TYPES = [
  "Credit Game",
  "Freechip",
  "Cashback",
  "Bonus",
  "Custom",
];

const REWARD_DISTRIBUTION_OPTIONS = [
  { value: "instant", label: "Instant (langsung diberikan)" },
  { value: "after_requirement", label: "After Requirement (setelah syarat terpenuhi)" },
  { value: "split", label: "Split (sebagian depan, sebagian belakang)" },
  { value: "per_step", label: "Per Step (untuk mission)" },
  { value: "custom", label: "Custom" },
];

const PROMO_POINT_UNIT_OPTIONS = [
  { value: "LP", label: "LP" },
  { value: "EXP", label: "EXP" },
  { value: "hybrid", label: "LP + EXP (Hybrid)" },
];

const EXP_MODE_OPTIONS = [
  { value: "level_up", label: "Level-Up Only", desc: "Naik level = dapat hadiah" },
  { value: "exp_store", label: "EXP Store", desc: "Tukar EXP langsung ke hadiah" },
  { value: "both", label: "Keduanya", desc: "Level-Up + Store" },
];

const DEFAULT_LEVEL_TIERS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"] as const;
const VIP_TIERS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"] as const;

// Collapsible Block Component
const CollapsibleBlock = ({
  title,
  icon: Icon,
  description,
  children,
  defaultOpen = true,
  badge,
}: {
  title: string;
  icon?: React.ElementType;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-t-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5 text-button-hover" />}
            <div>
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-semibold text-foreground">{title}</h5>
                {badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-button-hover/20 text-button-hover">
                    {badge}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 border border-t-0 border-border rounded-b-lg bg-background/50 space-y-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export function KnowledgeBaseSection() {
  const [viewMode, setViewMode] = useState<ViewMode>("selection");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PromoKnowledgeBase>(defaultEntry);
  const [showAdvancedAI, setShowAdvancedAI] = useState(false);
  const totalSteps = 5;

  const [customOptions, setCustomOptions] = useState<Record<string, string[]>>({
    promo_type: [],
    intent_category: [],
    target_segment: [],
    trigger_event: [],
    reward_type: [],
    turnover_rule: [],
    claim_frequency: [],
    platform_access: [],
    game_restriction: [],
    status: [],
    geo_restriction: [],
  });
  const [addingNewTo, setAddingNewTo] = useState<string | null>(null);
  const [newOptionValue, setNewOptionValue] = useState("");

  // Tier LP state
  const [lpCalculationMethod, setLpCalculationMethod] = useState<LPCalculationMethod>("turnover");
  const [lpFormulaInput, setLpFormulaInput] = useState("");
  const [lpFormulaOutput, setLpFormulaOutput] = useState("");
  const [customLpFormula, setCustomLpFormula] = useState("");
  const [lpConversionValue, setLpConversionValue] = useState("");
  const [lpConversionType, setLpConversionType] = useState("");
  const [rewardDistribution, setRewardDistribution] = useState("");
  const [tierRows, setTierRows] = useState<TierRow[]>([
    { id: crypto.randomUUID(), min_point: "", reward: "", type: "", reward_value_type: "fixed" }
  ]);
  
  const [promoPointUnit, setPromoPointUnit] = useState<PromoPointUnit>("LP");
  const [expMode, setExpMode] = useState<ExpMode>("level_up");
  const [lpFormulaInputLP, setLpFormulaInputLP] = useState("");
  const [lpFormulaOutputLP, setLpFormulaOutputLP] = useState("");
  const [expFormulaInput, setExpFormulaInput] = useState("");
  const [expFormulaOutput, setExpFormulaOutput] = useState("");
  
  const [vipMultiplierEnabled, setVipMultiplierEnabled] = useState(false);
  const [vipMultiplier, setVipMultiplier] = useState<VIPMultiplier>({
    silver: "",
    gold: "",
    platinum: "",
    diamond: "",
  });
  const [vipMinDailyTO, setVipMinDailyTO] = useState("");
  
  const [fastExpMissions, setFastExpMissions] = useState<FastEXPMission[]>([]);
  
  const [levelUpRewardsEnabled, setLevelUpRewardsEnabled] = useState(false);
  const [levelUpRewards, setLevelUpRewards] = useState<LevelUpReward[]>(
    DEFAULT_LEVEL_TIERS.map(tier => ({
      id: crypto.randomUUID(),
      tier,
      min_exp: "",
      reward: "",
      reward_value_type: "fixed" as RewardValueType,
      reward_type: "",
    }))
  );
  
  const [customTerms, setCustomTerms] = useState("");
  
  const getPointUnitLabel = () => {
    return "Poin"; // Neutral label
  };
  
  // Visibility rules based on Unit + Mode
  const showExpFeatures = promoPointUnit === "EXP" || promoPointUnit === "hybrid";
  const showLpFeatures = promoPointUnit === "LP" || promoPointUnit === "hybrid";
  
  // C2: Penukaran LP → Hadiah (hanya jika LP aktif)
  const showC2 = showLpFeatures;
  
  // C3: Tier Reward / Store (LP Store atau EXP Store)
  const showC3 = promoPointUnit === "LP" || 
    (showExpFeatures && (expMode === "exp_store" || expMode === "both"));
  
  // C4: Fast EXP Missions (jika EXP aktif)
  const showC4 = showExpFeatures;
  
  // C5: Level-Up Rewards (jika EXP + mode Level-Up atau Both)
  const showC5 = showExpFeatures && (expMode === "level_up" || expMode === "both");

  const updateTierRow = (id: string, field: keyof TierRow, value: string) => {
    setTierRows(prev => {
      const updated = prev.map(row => row.id === id ? { ...row, [field]: value } : row);
      const validTiers = updated.filter(row => row.min_point && row.reward && row.type);
      if (validTiers.length > 0) {
        const json = JSON.stringify(
          validTiers.map(row => ({
            minimal_point: parseInt(row.min_point) || 0,
            reward: parseInt(row.reward) || 0,
            type: row.type.toLowerCase().replace(/ /g, "-")
          }))
        );
        updateField("reward_tiers", json);
      }
      return updated;
    });
  };

  const addTierRow = () => {
    setTierRows(prev => [...prev, { id: crypto.randomUUID(), min_point: "", reward: "", type: "", reward_value_type: "fixed" }]);
  };

  const removeTierRow = (id: string) => {
    setTierRows(prev => {
      const filtered = prev.filter(row => row.id !== id);
      const validTiers = filtered.filter(row => row.min_point && row.reward && row.type);
      if (validTiers.length > 0) {
        const json = JSON.stringify(
          validTiers.map(row => ({
            minimal_point: parseInt(row.min_point) || 0,
            reward: row.reward_value_type === "percentage" ? `${row.reward}%` : (parseInt(row.reward) || 0),
            type: row.type.toLowerCase().replace(/ /g, "-"),
            reward_value_type: row.reward_value_type
          }))
        );
        updateField("reward_tiers", json);
      } else {
        updateField("reward_tiers", "");
      }
      return filtered.length > 0 ? filtered : [{ id: crypto.randomUUID(), min_point: "", reward: "", type: "", reward_value_type: "fixed" }];
    });
  };

  const addFastExpMission = () => {
    setFastExpMissions(prev => [...prev, { id: crypto.randomUUID(), activity: "", bonus_exp: "" }]);
  };

  const updateFastExpMission = (id: string, field: keyof FastEXPMission, value: string) => {
    setFastExpMissions(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeFastExpMission = (id: string) => {
    setFastExpMissions(prev => prev.filter(m => m.id !== id));
  };

  const updateLevelUpReward = (id: string, field: keyof LevelUpReward, value: string) => {
    setLevelUpRewards(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const getLpFormulaLabel = () => {
    switch (lpCalculationMethod) {
      case "turnover": return "TO";
      case "spin": return "Spin";
      case "winloss": return "Win/Loss";
      case "manual": return "Manual";
      case "custom": return "";
      default: return "";
    }
  };

  /**
   * ============================================================================
   * KNOWLEDGE BASE JSON OUTPUT DOCUMENTATION
   * ============================================================================
   * 
   * ⚠️ PENTING: JSON Output adalah PROCESSED OUTPUT yang dihasilkan otomatis
   * oleh sistem. Nama JSON Key TIDAK SAMA dengan nama Form Field di UI.
   * Data ini sudah disusun ulang untuk kompatibilitas dengan Supabase/AI.
   * 
   * ============================================================================
   * FIELD MAPPING (Form Field → JSON Key)
   * ============================================================================
   * 
   * | Form Field (UI)              | JSON Key                     | Catatan                          |
   * |------------------------------|------------------------------|----------------------------------|
   * | promoPointUnit               | promo_unit                   | LP | EXP | hybrid                |
   * | expMode                      | exp_mode                     | level_up | exp_store | both      |
   * | lpCalculationMethod          | lp_calc_method               | turnover/spin/winloss/manual/custom |
   * | lpFormulaInputLP + Output    | lp_formula                   | FORMATTED: "1000 TO = 1 LP"      |
   * | expFormulaInput + Output     | exp_formula                  | FORMATTED: "1000 TO = 1 EXP"     |
   * | lpConversionValue + Type     | lp_value                     | FORMATTED: "1 LP = 5000 credit"  |
   * | rewardDistribution           | reward_distribution          | Label dari dropdown              |
   * | tierRows[].min_point         | tiers[].minimal_point        | UI: "Minimal Poin"               |
   * | tierRows[].reward            | tiers[].reward               | Angka atau "50%"                 |
   * | tierRows[].type              | tiers[].type                 | lowercase, underscore            |
   * | tierRows[].reward_value_type | tiers[].reward_type          | fixed | percentage               |
   * | fastExpMissions[]            | fast_exp_missions[]          | Array aktivitas bonus            |
   * | levelUpRewards[].reward_type | level_up_rewards[].type      | credit_game, freechip, etc.      |
   * | levelUpRewards[].reward_value_type | level_up_rewards[].reward_type | fixed | percentage        |
   * | vipMultiplierEnabled         | vip_multiplier.enabled       | true/false                       |
   * | vipMinDailyTO                | vip_multiplier.min_daily_to  | Minimal TO harian                |
   * | customTerms                  | custom_terms                 | Free text S&K                    |
   * 
   * ============================================================================
   * FORMATTED OUTPUT FIELDS (Auto-generated, bukan input manual)
   * ============================================================================
   * 
   * - lp_formula  : Dihasilkan dari lpFormulaInput + lpFormulaOutput + method
   *                 Contoh: "1000 TO = 1 LP"
   * 
   * - exp_formula : Dihasilkan dari expFormulaInput + expFormulaOutput + method
   *                 Contoh: "1000 TO = 1 EXP"
   * 
   * - lp_value    : Dihasilkan dari lpConversionValue + lpConversionType
   *                 Contoh: "1 LP = 5000 credit_game"
   * 
   * ============================================================================
   * VISIBILITY RULES (C0) - Blok mana yang muncul berdasarkan Unit + Mode
   * ============================================================================
   * 
   * Semua blok C2/C3/C4/C5 mengikuti tabel visibility rules berikut.
   * Jika mode/unit tidak sesuai → blok otomatis disembunyikan dari UI.
   * 
   * | Blok | Unit=LP | Unit=EXP (Level-Up) | Unit=EXP (Store) | Unit=EXP (Both) | Hybrid |
   * |------|---------|---------------------|------------------|-----------------|--------|
   * | C2   | ✅      | ❌                  | ❌               | ❌              | ✅     |
   * | C3   | ✅      | ❌                  | ✅               | ✅              | ✅     |
   * | C4   | ❌      | ✅                  | ✅               | ✅              | ✅     |
   * | C5   | ❌      | ✅                  | ❌               | ✅              | ✅     |
   * 
   * Penjelasan:
   * - C2 (LP Conversion): Hanya aktif jika Unit = LP atau Hybrid
   * - C3 (Tier Store)   : Untuk tukar poin → hadiah (LP Store / EXP Store)
   * - C4 (Fast EXP)     : Mission bonus EXP, aktif jika EXP digunakan
   * - C5 (Level-Up)     : Hadiah otomatis naik level, aktif jika expMode = level_up/both
   * 
   * ============================================================================
   * UI LABEL STANDARDS
   * ============================================================================
   * 
   * - Kolom tier menggunakan label "Minimal Poin" (BUKAN "Minimal LP" / "Minimal EXP")
   * - JSON key menggunakan "minimal_point" (snake_case, singular)
   * - Ini memastikan satu tabel bisa dipakai untuk LP, EXP, atau Hybrid
   * 
   * ============================================================================
   */
  const generateFullLpJson = () => {
    const validTiers = tierRows.filter(row => row.min_point && row.reward && row.type);
    
    let lpFormula = "";
    if (showLpFeatures) {
      if (lpCalculationMethod === "custom") {
        lpFormula = customLpFormula || "Custom";
      } else if (lpFormulaInput && lpFormulaOutput) {
        lpFormula = `${lpFormulaInput} ${getLpFormulaLabel()} = ${lpFormulaOutput} LP`;
      }
      if (promoPointUnit === "hybrid" && lpFormulaInputLP && lpFormulaOutputLP) {
        lpFormula = `${lpFormulaInputLP} ${getLpFormulaLabel()} = ${lpFormulaOutputLP} LP`;
      }
    }

    let expFormula = "";
    if (showExpFeatures && expFormulaInput && expFormulaOutput) {
      expFormula = `${expFormulaInput} ${getLpFormulaLabel()} = ${expFormulaOutput} EXP`;
    }

    const lpConversion = showLpFeatures && lpConversionValue && lpConversionType 
      ? `1 LP = ${lpConversionValue} ${lpConversionType.toLowerCase().replace(/ /g, "_")}`
      : "";

    const distributionLabel = REWARD_DISTRIBUTION_OPTIONS.find(opt => opt.value === rewardDistribution)?.label || rewardDistribution;

    const result: Record<string, unknown> = {
      promo_unit: promoPointUnit,
    };

    // Add exp_mode only if EXP is active
    if (showExpFeatures) {
      result.exp_mode = expMode;
    }

    // Add lp_calc_method if LP features are active
    if (showLpFeatures) {
      result.lp_calc_method = lpCalculationMethod;
    }

    if (lpFormula) result.lp_formula = lpFormula;
    if (expFormula) result.exp_formula = expFormula;
    if (lpConversion) result.lp_value = lpConversion;
    if (distributionLabel) result.reward_distribution = distributionLabel;

    if (validTiers.length > 0) {
      result.tiers = validTiers.map(row => ({
        minimal_point: parseInt(row.min_point) || 0,
        reward: row.reward_value_type === "percentage" ? `${row.reward}%` : (parseInt(row.reward) || 0),
        type: row.type.toLowerCase().replace(/ /g, "_"),
        reward_type: row.reward_value_type
      }));
    }

    const validMissions = fastExpMissions.filter(m => m.activity && m.bonus_exp);
    if (validMissions.length > 0) {
      result.fast_exp_missions = validMissions.map(m => ({
        activity: m.activity,
        bonus_exp: parseInt(m.bonus_exp) || 0
      }));
    }

    if (levelUpRewardsEnabled && showC5) {
      const validLevelRewards = levelUpRewards.filter(r => r.min_exp && r.reward && r.reward_type);
      if (validLevelRewards.length > 0) {
        result.level_up_rewards = validLevelRewards.map(r => ({
          tier: r.tier,
          min_exp: parseInt(r.min_exp) || 0,
          reward: r.reward_value_type === "percentage" ? `${r.reward}%` : (parseInt(r.reward) || 0),
          reward_type: r.reward_value_type,  // fixed | percentage
          type: r.reward_type.toLowerCase().replace(/ /g, "_")  // credit_game, freechip, etc.
        }));
      }
    }

    if (vipMultiplierEnabled) {
      result.vip_multiplier = {
        enabled: true,
        min_daily_to: parseInt(vipMinDailyTO) || 0,
        silver: parseInt(vipMultiplier.silver) || 0,
        gold: parseInt(vipMultiplier.gold) || 0,
        platinum: parseInt(vipMultiplier.platinum) || 0,
        diamond: parseInt(vipMultiplier.diamond) || 0,
      };
    }

    if (customTerms.trim()) {
      result.custom_terms = customTerms.trim();
    }

    return JSON.stringify(result, null, 2);
  };

  const handleAddCustomOption = (fieldKey: string) => {
    if (newOptionValue.trim()) {
      setCustomOptions(prev => ({
        ...prev,
        [fieldKey]: [...(prev[fieldKey] || []), newOptionValue.trim()]
      }));
      updateField(fieldKey as keyof PromoKnowledgeBase, newOptionValue.trim());
      setNewOptionValue("");
      setAddingNewTo(null);
      toast.success(`"${newOptionValue.trim()}" ditambahkan`);
    }
  };

  const getOptionsWithCustom = (fieldKey: keyof typeof DROPDOWN_OPTIONS) => {
    const baseOptions = DROPDOWN_OPTIONS[fieldKey] || [];
    const custom = customOptions[fieldKey] || [];
    return [...baseOptions, ...custom];
  };

  const renderSelectWithAddNew = (
    fieldKey: keyof typeof DROPDOWN_OPTIONS,
    formKey: keyof PromoKnowledgeBase,
    placeholder: string,
    description: string,
    label: string
  ) => {
    const allOptions = getOptionsWithCustom(fieldKey);
    const isAddingNew = addingNewTo === fieldKey;

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        {isAddingNew ? (
          <div className="flex gap-2">
            <Input
              value={newOptionValue}
              onChange={(e) => setNewOptionValue(e.target.value)}
              placeholder="Masukkan opsi baru..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCustomOption(fieldKey);
                if (e.key === 'Escape') { setAddingNewTo(null); setNewOptionValue(""); }
              }}
            />
            <Button 
              type="button"
              onClick={() => handleAddCustomOption(fieldKey)}
              className="rounded-full bg-button-hover hover:bg-muted-foreground text-black"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => { setAddingNewTo(null); setNewOptionValue(""); }}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Select value={formData[formKey] as string} onValueChange={(v) => {
            if (v === "__add_new__") {
              setAddingNewTo(fieldKey);
            } else {
              updateField(formKey, v);
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {allOptions.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
              <SelectItem value="__add_new__" className="text-button-hover font-medium border-t border-border mt-2 pt-2">
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Opsi Baru
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    );
  };

  const handleDownloadTemplate = () => {
    const csvContent = `client_id,promo_name,promo_type,intent_category,target_segment,trigger_event,reward_mode,reward_type,reward_amount,min_requirement,max_claim,turnover_rule,claim_frequency,reward_tiers,conversion_formula,platform_access,game_restriction,valid_from,valid_until,status,require_apk,geo_restriction,time_restriction,response_template_offer,response_template_requirement,ai_guidelines,default_behavior,completion_steps
WG77,Welcome Bonus 100%,Bonus Deposit,Acquisition,User Baru,First Deposit,fixed,Persentase %,100,50000,1000000,8x,Sekali,,,"Semua","Semua",2024-01-01,2024-12-31,Active,false,Indonesia,,"Bonus 100% untuk deposit pertama!","Min deposit 50rb, TO 8x","Gunakan nada ramah","check_deposit_first",""`;
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voc-promo-builder-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template berhasil didownload!");
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Hanya file CSV yang diperbolehkan");
      return;
    }
    setUploadedFile(file);
    toast.success(`File "${file.name}" berhasil diupload!`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    toast.info("File dihapus");
  };

  const handleBack = () => {
    setViewMode("selection");
    setCurrentStep(1);
    setUploadedFile(null);
    setFormData(defaultEntry);
  };

  const updateField = (field: keyof PromoKnowledgeBase, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmitForm = () => {
    const requiredFields: (keyof PromoKnowledgeBase)[] = [
      "client_id", "promo_name", "promo_type", "intent_category", 
      "target_segment", "trigger_event", "platform_access",
      "game_restriction", "valid_from", "response_template_offer"
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Mohon isi field wajib yang masih kosong`);
      return;
    }
    
    toast.success("Promo berhasil disimpan ke Knowledge Base!");
    setViewMode("selection");
    setCurrentStep(1);
    setFormData(defaultEntry);
  };

  const handleSaveDraft = () => {
    setFormData(prev => ({ ...prev, status: "Draft" }));
    toast.success("Draft berhasil disimpan! Anda bisa melanjutkan nanti.");
  };

  // Selection View
  if (viewMode === "selection") {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-button-hover mb-2">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Pilih metode untuk menambahkan data promo ke knowledge base
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="p-6 cursor-pointer hover:border-button-hover transition-all group"
            onClick={() => setViewMode("manual-upload")}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-button-hover/10 flex items-center justify-center group-hover:bg-button-hover/20 transition-colors">
                <FileUp className="h-8 w-8 text-button-hover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Manual Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Download template CSV, isi offline, dan upload file yang sudah diisi.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Download template lengkap
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Isi dengan spreadsheet app
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Upload file CSV
                  </li>
                </ul>
              </div>
              <Button className="w-full rounded-full bg-button-hover hover:bg-muted-foreground text-black">
                Pilih Manual Upload
              </Button>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:border-button-hover transition-all group"
            onClick={() => setViewMode("fill-form")}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-button-hover/10 flex items-center justify-center group-hover:bg-button-hover/20 transition-colors">
                <ClipboardList className="h-8 w-8 text-button-hover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Fill Form</h3>
                <p className="text-sm text-muted-foreground">
                  Isi form step-by-step dengan panduan untuk setiap field.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    5 langkah mudah
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Dropdown + tambah opsi baru
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Preview sebelum simpan
                  </li>
                </ul>
              </div>
              <Button className="w-full rounded-full bg-button-hover hover:bg-muted-foreground text-black">
                Pilih Fill Form
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Manual Upload View
  if (viewMode === "manual-upload") {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="secondary" onClick={handleBack} className="mb-4 bg-secondary/50 hover:bg-button-hover hover:text-button-hover-foreground rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-button-hover mb-2">Step 1: Download Template</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download template CSV untuk diisi dengan data promo.
            </p>
          </div>
          <Button onClick={handleDownloadTemplate} variant="secondary" className="rounded-full bg-secondary/50 hover:bg-button-hover hover:text-button-hover-foreground">
            <Download className="h-4 w-4 mr-2" />
            Download Template (CSV)
          </Button>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-button-hover mb-2">Step 2: Upload File yang Sudah Diisi</h3>
            <p className="text-sm text-muted-foreground">
              Upload file CSV yang sudah diisi dengan data promo.
            </p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-8 transition-all duration-200
              ${isDragging 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-accent/5"
              }
            `}
          >
            {uploadedFile ? (
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="hover:bg-destructive/10 hover:text-destructive rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-2">
                  Drag and drop file CSV, atau klik untuk browse
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  CSV files only
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="secondary" asChild className="rounded-full bg-secondary/50 hover:bg-button-hover hover:text-button-hover-foreground">
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Pilih File
                    </span>
                  </Button>
                </label>
              </div>
            )}
          </div>

          {uploadedFile && (
            <div className="flex justify-end mt-4">
              <Button className="rounded-full bg-button-hover hover:bg-muted-foreground text-black">
                Proses Knowledge Base
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Fill Form View
  if (viewMode === "fill-form") {
    const stepTitles = [
      "Identitas Promo",
      "Konfigurasi Reward",
      "Batasan & Akses",
      "Template Pesan (AI)",
      "Review & Simpan"
    ];

    return (
      <>
      <div className="max-w-7xl mx-auto space-y-6 pb-24">
        <Button variant="secondary" onClick={handleBack} className="mb-4 bg-secondary/50 hover:bg-button-hover hover:text-button-hover-foreground rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        {/* Progress */}
        <Card className="p-6">
          <div className="space-y-4">
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" showSlider />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step 1</span>
              <span className="font-semibold text-foreground">{currentStep}/{totalSteps}</span>
              <span>Step {totalSteps}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              {stepTitles.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx + 1)}
                  className={`text-xs transition-colors ${
                    currentStep === idx + 1 
                      ? "text-button-hover font-semibold" 
                      : currentStep > idx + 1
                      ? "text-button-hover/70"
                      : "text-muted-foreground"
                  } hover:text-button-hover`}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ==================== STEP 1: IDENTITAS PROMO ==================== */}
        {currentStep === 1 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-button-hover/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-button-hover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-button-hover">Step 1 — Identitas Promo</h3>
                  <p className="text-sm text-muted-foreground">Informasi dasar tentang promosi</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setFormData(defaultEntry);
                  setCurrentStep(1);
                  toast.success("Form direset untuk promo baru");
                }}
                className="rounded-full bg-button-hover hover:bg-muted-foreground text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Promo Baru
              </Button>
            </div>

            <CollapsibleBlock
              title="Basic Info"
              icon={Layers}
              description="Informasi identitas dan kategori promo"
              defaultOpen={true}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nama Website *</Label>
                  <Input
                    value={formData.client_id}
                    onChange={(e) => updateField("client_id", e.target.value)}
                    placeholder="misal: WG77, CITRA77"
                  />
                  <p className="text-xs text-muted-foreground">Website pemilik promo</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nama Promo *</Label>
                  <Input
                    value={formData.promo_name}
                    onChange={(e) => updateField("promo_name", e.target.value)}
                    placeholder="misal: Welcome Bonus 100%"
                  />
                  <p className="text-xs text-muted-foreground">Nama promo yang unik</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {renderSelectWithAddNew("promo_type", "promo_type", "Pilih tipe promo", "Kategori promo (LP, EXP, freechip, bonus deposit, cashback, mission)", "Tipe Promo *")}
                {renderSelectWithAddNew("intent_category", "intent_category", "Pilih tujuan", "Tujuan promo (acquisition, retention, reactivation, VIP)", "Tujuan Promo *")}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {renderSelectWithAddNew("target_segment", "target_segment", "Pilih target user", "Siapa yang dapat promo ini", "Target User *")}
                {renderSelectWithAddNew("trigger_event", "trigger_event", "Pilih trigger", "Event yang memicu promo aktif", "Trigger Promo *")}
              </div>
            </CollapsibleBlock>
          </Card>
        )}

        {/* ==================== STEP 2: KONFIGURASI REWARD ==================== */}
        {currentStep === 2 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-button-hover/20 flex items-center justify-center">
                <Gift className="h-5 w-5 text-button-hover" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-button-hover">Step 2 — Konfigurasi Reward</h3>
                <p className="text-sm text-muted-foreground">Atur jenis dan cara pemberian reward</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* ========== BLOK A — Mode Reward ========== */}
              <CollapsibleBlock
                title="BLOK A — Mode Reward"
                icon={Settings2}
                description="Pilih cara menghitung dan memberikan reward"
                defaultOpen={true}
                badge="Wajib"
              >
                <div className="flex gap-4">
                  {[
                    { value: "fixed", label: "Fixed", desc: "Reward tetap" },
                    { value: "tier", label: "Tier", desc: "Berjenjang (LP/EXP)" },
                    { value: "formula", label: "Formula", desc: "Rumus custom" },
                  ].map((mode) => (
                    <label
                      key={mode.value}
                      className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.reward_mode === mode.value
                          ? "border-button-hover bg-button-hover/10"
                          : "border-border hover:border-button-hover/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reward_mode"
                        value={mode.value}
                        checked={formData.reward_mode === mode.value}
                        onChange={(e) => updateField("reward_mode", e.target.value as RewardMode)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <p className="font-semibold text-foreground">{mode.label}</p>
                        <p className="text-xs text-muted-foreground">{mode.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </CollapsibleBlock>

              {/* ========== BLOK B — Mode Fixed ========== */}
              {formData.reward_mode === "fixed" && (
                <CollapsibleBlock
                  title="BLOK B — Konfigurasi Fixed Reward"
                  icon={Gift}
                  description="Atur reward dengan nilai tetap"
                  defaultOpen={true}
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    {renderSelectWithAddNew("reward_type", "reward_type", "Pilih jenis reward", "Jenis hadiah (LP, EXP, freechip, credit game, persentase, cashback)", "Jenis Reward *")}
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Jumlah Reward *</Label>
                      <Input
                        type="number"
                        value={formData.reward_amount}
                        onChange={(e) => updateField("reward_amount", e.target.value)}
                        placeholder="misal: 100"
                      />
                      <p className="text-xs text-muted-foreground">Jumlah hadiah tetap</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Syarat Minimum *</Label>
                      <Input
                        type="number"
                        value={formData.min_requirement}
                        onChange={(e) => updateField("min_requirement", e.target.value)}
                        placeholder="misal: 50000"
                      />
                      <p className="text-xs text-muted-foreground">Minimal deposit/credit/TO</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Maksimal Klaim *</Label>
                      <Input
                        type="number"
                        value={formData.max_claim}
                        onChange={(e) => updateField("max_claim", e.target.value)}
                        placeholder="misal: 1000000"
                      />
                      <p className="text-xs text-muted-foreground">Batas maksimal reward</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {renderSelectWithAddNew("turnover_rule", "turnover_rule", "Pilih aturan TO", "Syarat turnover yang harus dipenuhi", "Aturan Turnover *")}
                    {renderSelectWithAddNew("claim_frequency", "claim_frequency", "Pilih frekuensi", "Seberapa sering promo bisa diklaim", "Frekuensi Klaim *")}
                  </div>
                </CollapsibleBlock>
              )}

              {/* ========== BLOK C — Mode Tier (LP/EXP/Hybrid) ========== */}
              {formData.reward_mode === "tier" && (
                <>
                  {/* Unit Poin Reward */}
                  <CollapsibleBlock
                    title="Unit Poin Reward"
                    icon={Sparkles}
                    description="Pilih jenis poin yang diperhitungkan di promo ini"
                    defaultOpen={true}
                    badge="Wajib"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Satuan Poin *</Label>
                        <Select value={promoPointUnit} onValueChange={(v: PromoPointUnit) => setPromoPointUnit(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih unit poin" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROMO_POINT_UNIT_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {promoPointUnit === "LP" && "Loyalty Points - poin yang bisa ditukar ke hadiah"}
                          {promoPointUnit === "EXP" && "Experience Points - untuk leveling/ranking"}
                          {promoPointUnit === "hybrid" && "Kombinasi LP + EXP dalam satu promo"}
                        </p>
                      </div>

                      {/* Mode Penggunaan EXP - only show if EXP is active */}
                      {showExpFeatures && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Mode Penggunaan EXP *</Label>
                          <Select value={expMode} onValueChange={(v: ExpMode) => setExpMode(v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih mode EXP" />
                            </SelectTrigger>
                            <SelectContent>
                              {EXP_MODE_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex flex-col">
                                    <span>{opt.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {expMode === "level_up" && "EXP hanya untuk naik level → dapat hadiah otomatis saat naik tier"}
                            {expMode === "exp_store" && "EXP bisa ditukar langsung ke hadiah (EXP Store)"}
                            {expMode === "both" && "Kombinasi: naik level dapat hadiah + bisa tukar EXP di Store"}
                          </p>
                        </div>
                      )}
                    </div>
                  </CollapsibleBlock>

                  {/* C1 — Rumus Perhitungan LP/EXP */}
                  <CollapsibleBlock
                    title={`C1 — Rumus Perhitungan ${promoPointUnit === "hybrid" ? "LP/EXP" : promoPointUnit}`}
                    icon={Settings2}
                    description="Bagaimana poin dihitung dari aktivitas user"
                    defaultOpen={true}
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Metode Perhitungan *</Label>
                        <Select value={lpCalculationMethod} onValueChange={(v: LPCalculationMethod) => setLpCalculationMethod(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih metode" />
                          </SelectTrigger>
                          <SelectContent>
                            {LP_CALCULATION_METHODS.map(method => (
                              <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* LP Formula */}
                      {showLpFeatures && lpCalculationMethod !== "custom" && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Rumus LP *</Label>
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                            <Input
                              type="number"
                              value={promoPointUnit === "hybrid" ? lpFormulaInputLP : lpFormulaInput}
                              onChange={(e) => promoPointUnit === "hybrid" ? setLpFormulaInputLP(e.target.value) : setLpFormulaInput(e.target.value)}
                              placeholder="1000"
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground font-medium">{getLpFormulaLabel()}</span>
                            <span className="text-lg">=</span>
                            <Input
                              type="number"
                              value={promoPointUnit === "hybrid" ? lpFormulaOutputLP : lpFormulaOutput}
                              onChange={(e) => promoPointUnit === "hybrid" ? setLpFormulaOutputLP(e.target.value) : setLpFormulaOutput(e.target.value)}
                              placeholder="1"
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground font-medium">LP</span>
                          </div>
                        </div>
                      )}

                      {/* EXP Formula */}
                      {showExpFeatures && lpCalculationMethod !== "custom" && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Rumus EXP *</Label>
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                            <Input
                              type="number"
                              value={expFormulaInput}
                              onChange={(e) => setExpFormulaInput(e.target.value)}
                              placeholder="500"
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground font-medium">{getLpFormulaLabel()}</span>
                            <span className="text-lg">=</span>
                            <Input
                              type="number"
                              value={expFormulaOutput}
                              onChange={(e) => setExpFormulaOutput(e.target.value)}
                              placeholder="1"
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground font-medium">EXP</span>
                          </div>
                        </div>
                      )}

                      {/* Custom Formula */}
                      {lpCalculationMethod === "custom" && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Rumus Custom *</Label>
                          <Textarea
                            value={customLpFormula}
                            onChange={(e) => setCustomLpFormula(e.target.value)}
                            placeholder="Masukkan rumus custom (misal: deposit * 0.001)"
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </CollapsibleBlock>

                  {/* C2 — Nilai Penukaran LP → Hadiah (LP only) */}
                  {showC2 && (
                    <CollapsibleBlock
                      title="C2 — Nilai Penukaran LP → Hadiah"
                      icon={Gift}
                      description={promoPointUnit === "hybrid" ? "Hanya LP yang bisa ditukar. EXP tidak ditukar langsung." : "Nilai dasar 1 LP saat ditukar jadi hadiah"}
                      defaultOpen={true}
                    >
                      <div className="p-3 mb-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs text-blue-400">
                          ℹ️ Blok ini hanya aktif jika Unit = LP atau Hybrid. Tentukan berapa nilai 1 LP saat ditukar ke hadiah.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Nilai Penukaran *</Label>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                          <span className="text-sm text-muted-foreground font-medium">1 LP</span>
                          <span className="text-lg">=</span>
                          <Input
                            type="number"
                            value={lpConversionValue}
                            onChange={(e) => setLpConversionValue(e.target.value)}
                            placeholder="5000"
                            className="w-24"
                          />
                          <Select value={lpConversionType} onValueChange={setLpConversionType}>
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Jenis Hadiah" />
                            </SelectTrigger>
                            <SelectContent>
                              {LP_REWARD_TYPES.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Contoh: 1 LP = 5000 Credit Game
                        </p>
                      </div>
                    </CollapsibleBlock>
                  )}

                  {/* C3 — Tabel Tier Reward (LP Store / EXP Store) */}
                  {showC3 && (
                    <CollapsibleBlock
                      title="C3 — Tabel Tier Reward (Store)"
                      icon={Layers}
                      description="Daftar tier penukaran poin ke hadiah"
                      defaultOpen={true}
                    >
                      <div className="p-3 mb-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-xs text-green-400">
                          ℹ️ Blok ini untuk menukar poin langsung ke hadiah (LP Store / EXP Store). User mengumpulkan poin lalu tukar ke hadiah sesuai tier.
                        </p>
                      </div>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 border-b border-border">
                          <span className="text-sm font-medium text-foreground">Minimal {getPointUnitLabel()}</span>
                          <span className="text-sm font-medium text-foreground">Hadiah</span>
                          <span className="text-sm font-medium text-foreground">Tipe Hadiah</span>
                          <span className="text-sm font-medium text-foreground">Jenis Hadiah</span>
                          <span className="text-sm font-medium text-foreground text-center">Aksi</span>
                        </div>
                        
                        {tierRows.map((row) => (
                          <div key={row.id} className="grid grid-cols-5 gap-2 p-3 border-b border-border last:border-b-0">
                            <Input
                              type="number"
                              value={row.min_point}
                              onChange={(e) => updateTierRow(row.id, "min_point", e.target.value)}
                              placeholder="250"
                            />
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={row.reward}
                                onChange={(e) => updateTierRow(row.id, "reward", e.target.value)}
                                placeholder={row.reward_value_type === "percentage" ? "50" : "5000"}
                              />
                              {row.reward_value_type === "percentage" && (
                                <span className="text-sm text-muted-foreground">%</span>
                              )}
                            </div>
                            <Select value={row.reward_value_type} onValueChange={(v: RewardValueType) => updateTierRow(row.id, "reward_value_type", v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Tipe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed</SelectItem>
                                <SelectItem value="percentage">Persentase (%)</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select value={row.type} onValueChange={(v) => updateTierRow(row.id, "type", v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih" />
                              </SelectTrigger>
                              <SelectContent>
                                {LP_REWARD_TYPES.map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex justify-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTierRow(row.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                                disabled={tierRows.length === 1}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addTierRow}
                        className="w-full rounded-full bg-secondary/50 hover:bg-button-hover hover:text-button-hover-foreground"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Tier Baru
                      </Button>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        Jumlah poin minimum yang dibutuhkan agar bisa ditukar ke hadiah di tier tersebut.
                      </p>
                    </CollapsibleBlock>
                  )}

                  {/* C4 — Fast EXP Missions (EXP/Hybrid only) */}
                  {showC4 && (
                    <CollapsibleBlock
                      title="C4 — Fast EXP Missions"
                      icon={Zap}
                      description="Aktivitas bonus untuk mendapat EXP tambahan"
                      defaultOpen={false}
                      badge="Opsional"
                    >
                      <div className="p-3 mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-xs text-yellow-400">
                          ℹ️ Blok ini untuk mission/aktivitas bonus yang memberikan EXP tambahan di luar formula utama.
                        </p>
                      </div>
                      {fastExpMissions.length > 0 && (
                        <div className="border border-border rounded-lg overflow-hidden mb-4">
                          <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 border-b border-border">
                            <span className="text-sm font-medium text-foreground">Aktivitas</span>
                            <span className="text-sm font-medium text-foreground">Bonus EXP</span>
                            <span className="text-sm font-medium text-foreground text-center">Aksi</span>
                          </div>
                          
                          {fastExpMissions.map((mission) => (
                            <div key={mission.id} className="grid grid-cols-3 gap-2 p-3 border-b border-border last:border-b-0">
                              <Input
                                value={mission.activity}
                                onChange={(e) => updateFastExpMission(mission.id, "activity", e.target.value)}
                                placeholder="Login harian"
                              />
                              <Input
                                type="number"
                                value={mission.bonus_exp}
                                onChange={(e) => updateFastExpMission(mission.id, "bonus_exp", e.target.value)}
                                placeholder="50"
                              />
                              <div className="flex justify-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFastExpMission(mission.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addFastExpMission}
                        className="w-full rounded-full bg-secondary/50 hover:bg-button-hover hover:text-button-hover-foreground"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Aktivitas Baru
                      </Button>
                    </CollapsibleBlock>
                  )}

                  {/* C5 — Reward Naik Level (Level-Up Rewards) */}
                  {showC5 && (
                    <CollapsibleBlock
                      title="C5 — Reward Naik Level (Level-Up Rewards)"
                      icon={Trophy}
                      description="Hadiah otomatis saat user naik level/tier berdasarkan EXP"
                      defaultOpen={false}
                      badge="Opsional"
                    >
                      <div className="p-3 mb-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <p className="text-xs text-purple-400">
                          ℹ️ Blok ini untuk hadiah otomatis saat naik level (EXP Level-Up System). Berbeda dengan C3 yang butuh user tukar manual, ini otomatis diberikan.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                        <Switch
                          checked={levelUpRewardsEnabled}
                          onCheckedChange={setLevelUpRewardsEnabled}
                        />
                        <div>
                          <Label className="text-sm font-medium">Aktifkan Leveling Reward</Label>
                          <p className="text-xs text-muted-foreground">Berikan hadiah saat user naik level</p>
                        </div>
                      </div>

                      {levelUpRewardsEnabled && (
                        <div className="border border-border rounded-lg overflow-hidden">
                          <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 border-b border-border">
                            <span className="text-sm font-medium text-foreground">Tier</span>
                            <span className="text-sm font-medium text-foreground">Minimal EXP</span>
                            <span className="text-sm font-medium text-foreground">Hadiah</span>
                            <span className="text-sm font-medium text-foreground">Tipe Hadiah</span>
                            <span className="text-sm font-medium text-foreground">Jenis Hadiah</span>
                            <span className="text-sm font-medium text-foreground text-center">Aksi</span>
                          </div>
                          
                          {levelUpRewards.map((reward) => (
                            <div key={reward.id} className="grid grid-cols-6 gap-2 p-3 border-b border-border last:border-b-0">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-foreground">{reward.tier}</span>
                              </div>
                              <Input
                                type="number"
                                value={reward.min_exp}
                                onChange={(e) => updateLevelUpReward(reward.id, "min_exp", e.target.value)}
                                placeholder="0"
                              />
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={reward.reward}
                                  onChange={(e) => updateLevelUpReward(reward.id, "reward", e.target.value)}
                                  placeholder={reward.reward_value_type === "percentage" ? "10" : "5000"}
                                />
                                {reward.reward_value_type === "percentage" && (
                                  <span className="text-sm text-muted-foreground">%</span>
                                )}
                              </div>
                              <Select value={reward.reward_value_type} onValueChange={(v: RewardValueType) => updateLevelUpReward(reward.id, "reward_value_type", v)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                  <SelectItem value="percentage">%</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select value={reward.reward_type} onValueChange={(v) => updateLevelUpReward(reward.id, "reward_type", v)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                  {LP_REWARD_TYPES.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex justify-center items-center">
                                <span className="text-xs text-muted-foreground">—</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CollapsibleBlock>
                  )}

                  {/* C6 — Bonus VIP / Ekstra LP */}
                  <CollapsibleBlock
                    title="C6 — Bonus VIP / Ekstra LP"
                    icon={Crown}
                    description="Bonus tambahan untuk member VIP"
                    defaultOpen={false}
                    badge="Opsional"
                  >
                    <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                      <Switch
                        checked={vipMultiplierEnabled}
                        onCheckedChange={setVipMultiplierEnabled}
                      />
                      <div>
                        <Label className="text-sm font-medium">Aktifkan Bonus VIP</Label>
                        <p className="text-xs text-muted-foreground">Berikan bonus ekstra untuk VIP member</p>
                      </div>
                    </div>

                    {vipMultiplierEnabled && (
                      <>
                        <div className="space-y-2 mb-4">
                          <Label className="text-sm font-medium">Minimum TO Harian Agar Bonus Aktif</Label>
                          <Input
                            type="number"
                            value={vipMinDailyTO}
                            onChange={(e) => setVipMinDailyTO(e.target.value)}
                            placeholder="500000"
                          />
                          <p className="text-xs text-muted-foreground">
                            Minimal TO harian yang harus dipenuhi agar bonus VIP aktif
                          </p>
                        </div>

                        <div className="border border-border rounded-lg overflow-hidden">
                          <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 border-b border-border">
                            <span className="text-sm font-medium text-foreground">Tier</span>
                            <span className="text-sm font-medium text-foreground">Bonus Tambahan (%)</span>
                          </div>
                          
                          {VIP_TIERS.map((tier) => (
                            <div key={tier} className="grid grid-cols-2 gap-2 p-3 border-b border-border last:border-b-0">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-foreground">{tier}</span>
                              </div>
                              {tier === "Bronze" ? (
                                <div className="flex items-center">
                                  <span className="text-sm text-muted-foreground">0% (locked)</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    value={vipMultiplier[tier.toLowerCase() as keyof VIPMultiplier]}
                                    onChange={(e) => setVipMultiplier(prev => ({
                                      ...prev,
                                      [tier.toLowerCase()]: e.target.value
                                    }))}
                                    placeholder="10"
                                  />
                                  <span className="text-sm text-muted-foreground">%</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CollapsibleBlock>

                  {/* BLOK D — Waktu Pembagian Reward */}
                  <CollapsibleBlock
                    title="BLOK D — Waktu Pembagian Reward"
                    icon={Clock}
                    description="Kapan hadiah diberikan kepada pemain"
                    defaultOpen={true}
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Pembagian Reward *</Label>
                      <Select value={rewardDistribution} onValueChange={setRewardDistribution}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih waktu pembagian" />
                        </SelectTrigger>
                        <SelectContent>
                          {REWARD_DISTRIBUTION_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CollapsibleBlock>

                  {/* BLOK E — Syarat & Ketentuan Khusus */}
                  <CollapsibleBlock
                    title="BLOK E — Syarat & Ketentuan Khusus"
                    icon={FileCheck}
                    description="Manual rule tambahan untuk promo ini"
                    defaultOpen={false}
                    badge="Opsional"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Syarat Khusus Promo</Label>
                      <Textarea
                        value={customTerms}
                        onChange={(e) => setCustomTerms(e.target.value)}
                        placeholder={`Contoh:\n• Untuk claim reward level, wajib TO 500.000 dalam 1 hari.\n• Double EXP harian menggandakan EXP tetapi tidak menggandakan LP.\n• Level reward hanya bisa diklaim 1x.`}
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Data ini akan langsung dikirim ke AI sebagai guideline tambahan.
                      </p>
                    </div>
                  </CollapsibleBlock>

                  {/* Preview JSON */}
                  {(tierRows.some(row => row.min_point && row.reward && row.type) || lpConversionValue || fastExpMissions.length > 0 || levelUpRewardsEnabled || customTerms) && (
                    <CollapsibleBlock
                      title="Preview JSON (Auto-generated)"
                      icon={FileText}
                      description="Output JSON yang akan disimpan"
                      defaultOpen={false}
                    >
                      <pre className="p-3 bg-muted/30 rounded-lg border border-border text-xs text-muted-foreground overflow-x-auto max-h-[300px]">
                        {generateFullLpJson()}
                      </pre>
                    </CollapsibleBlock>
                  )}
                </>
              )}

              {/* ========== Mode Formula ========== */}
              {formData.reward_mode === "formula" && (
                <CollapsibleBlock
                  title="BLOK B — Konfigurasi Formula Reward"
                  icon={Settings2}
                  description="Atur reward dengan rumus custom"
                  defaultOpen={true}
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Formula Reward *</Label>
                    <Input
                      value={formData.conversion_formula}
                      onChange={(e) => updateField("conversion_formula", e.target.value)}
                      placeholder="misal: deposit * 0.3"
                    />
                    <p className="text-xs text-muted-foreground">Masukkan rumus perhitungan (misal: deposit * 0.3)</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Maksimal Klaim *</Label>
                      <Input
                        type="number"
                        value={formData.max_claim}
                        onChange={(e) => updateField("max_claim", e.target.value)}
                        placeholder="misal: 1000000"
                      />
                      <p className="text-xs text-muted-foreground">Batas atas reward</p>
                    </div>

                    {renderSelectWithAddNew("claim_frequency", "claim_frequency", "Pilih frekuensi", "Seberapa sering promo bisa diklaim", "Frekuensi Klaim *")}
                  </div>
                </CollapsibleBlock>
              )}
            </div>
          </Card>
        )}

        {/* ==================== STEP 3: BATASAN & AKSES ==================== */}
        {currentStep === 3 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-button-hover/20 flex items-center justify-center">
                <Settings2 className="h-5 w-5 text-button-hover" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-button-hover">Step 3 — Batasan & Akses</h3>
                <p className="text-sm text-muted-foreground">Pengaturan platform, game, waktu, dan status promo</p>
              </div>
            </div>

            <div className="space-y-4">
              <CollapsibleBlock
                title="Platform & Game"
                icon={Layers}
                description="Atur di mana promo ini berlaku"
                defaultOpen={true}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {renderSelectWithAddNew("platform_access", "platform_access", "Pilih platform", "Promo berlaku untuk platform apa", "Akses Platform *")}
                  {renderSelectWithAddNew("game_restriction", "game_restriction", "Pilih jenis game", "Game apa yang boleh mengikuti promo", "Jenis Game *")}
                </div>
              </CollapsibleBlock>

              <CollapsibleBlock
                title="Periode & Status"
                icon={Clock}
                description="Atur kapan promo aktif"
                defaultOpen={true}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tanggal Mulai *</Label>
                    <Input
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => updateField("valid_from", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tanggal Berakhir</Label>
                    <Input
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => updateField("valid_until", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Kosongkan jika tidak ada batas</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {renderSelectWithAddNew("status", "status", "Pilih status", "Status promo saat ini", "Status Promo *")}
                  {renderSelectWithAddNew("geo_restriction", "geo_restriction", "Pilih wilayah", "Promo berlaku untuk wilayah tertentu", "Wilayah Promo")}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Batasan Waktu</Label>
                  <Input
                    value={formData.time_restriction}
                    onChange={(e) => updateField("time_restriction", e.target.value)}
                    placeholder="misal: harian 09:00-24:00, weekend-only"
                  />
                  <p className="text-xs text-muted-foreground">Jam atau hari tertentu promo aktif</p>
                </div>
              </CollapsibleBlock>

              <CollapsibleBlock
                title="Syarat Khusus"
                icon={FileCheck}
                description="Syarat tambahan untuk mengikuti promo"
                defaultOpen={true}
              >
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <Switch
                    checked={formData.require_apk}
                    onCheckedChange={(v) => updateField("require_apk", v)}
                  />
                  <div>
                    <Label className="text-sm font-medium">Wajib APK</Label>
                    <p className="text-xs text-muted-foreground">Promo hanya bisa diklaim user APK</p>
                  </div>
                </div>
              </CollapsibleBlock>
            </div>
          </Card>
        )}

        {/* ==================== STEP 4: TEMPLATE PESAN (AI) ==================== */}
        {currentStep === 4 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-button-hover/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-button-hover" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-button-hover">Step 4 — Template Pesan (AI)</h3>
                <p className="text-sm text-muted-foreground">Template pesan yang akan disampaikan AI kepada user</p>
              </div>
            </div>

            <div className="space-y-4">
              <CollapsibleBlock
                title="Teks Utama"
                icon={FileText}
                description="Pesan utama yang dibaca user"
                defaultOpen={true}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Offer Text *</Label>
                    <Textarea
                      value={formData.response_template_offer}
                      onChange={(e) => updateField("response_template_offer", e.target.value)}
                      placeholder="misal: Bonus 100% untuk deposit pertama kamu!"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Kalimat promo utama yang dibaca user</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Requirement Text</Label>
                    <Textarea
                      value={formData.response_template_requirement}
                      onChange={(e) => updateField("response_template_requirement", e.target.value)}
                      placeholder="misal: Minimal deposit 50rb, syarat TO 8x"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Informasi S&K yang harus disampaikan AI</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Instruction Text</Label>
                    <Textarea
                      value={formData.response_template_instruction}
                      onChange={(e) => updateField("response_template_instruction", e.target.value)}
                      placeholder="misal: Untuk klaim, hubungi CS dengan format BONUS100#ID"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Instruksi cara klaim promo</p>
                  </div>
                </div>
              </CollapsibleBlock>

              <Collapsible open={showAdvancedAI} onOpenChange={setShowAdvancedAI}>
                <CollapsibleTrigger asChild>
                  <Button variant="secondary" className="w-full justify-between bg-secondary/50 hover:bg-button-hover hover:text-button-hover-foreground">
                    <span className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      Opsi AI Lanjutan (Opsional)
                    </span>
                    {showAdvancedAI ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">AI Guidelines</Label>
                    <Textarea
                      value={formData.ai_guidelines}
                      onChange={(e) => updateField("ai_guidelines", e.target.value)}
                      placeholder="misal: Gunakan nada VIP. Jelaskan benefit tier secara singkat."
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">Pengaturan behavior AI</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Default Behavior</Label>
                    <Input
                      value={formData.default_behavior}
                      onChange={(e) => updateField("default_behavior", e.target.value)}
                      placeholder="misal: cek_tier_user_dulu, tekankan_max_klaim"
                    />
                    <p className="text-xs text-muted-foreground">Langkah default yang dilakukan AI</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Completion Steps (JSON)</Label>
                    <Textarea
                      value={formData.completion_steps}
                      onChange={(e) => updateField("completion_steps", e.target.value)}
                      placeholder='[{"step":1,"action":"daftar"},{"step":2,"action":"deposit"}]'
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">Langkah-langkah yang harus dilakukan user</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </Card>
        )}

        {/* ==================== STEP 5: REVIEW & SIMPAN ==================== */}
        {currentStep === 5 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-button-hover/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-button-hover" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-button-hover">Step 5 — Review & Simpan</h3>
                <p className="text-sm text-muted-foreground">Tinjau semua data sebelum simpan</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h4 className="font-medium text-button-hover">Identitas Promo</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(1)}
                      className="h-6 px-2 text-xs hover:bg-button-hover hover:text-black"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Website:</span> {formData.client_id || "-"}</p>
                    <p><span className="text-muted-foreground">Nama Promo:</span> {formData.promo_name || "-"}</p>
                    <p><span className="text-muted-foreground">Tipe Promo:</span> {formData.promo_type || "-"}</p>
                    <p><span className="text-muted-foreground">Tujuan:</span> {formData.intent_category || "-"}</p>
                    <p><span className="text-muted-foreground">Target User:</span> {formData.target_segment || "-"}</p>
                    <p><span className="text-muted-foreground">Trigger:</span> {formData.trigger_event || "-"}</p>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h4 className="font-medium text-button-hover">Konfigurasi Reward</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(2)}
                      className="h-6 px-2 text-xs hover:bg-button-hover hover:text-black"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Mode:</span> {formData.reward_mode.toUpperCase()}</p>
                    {formData.reward_mode === "fixed" && (
                      <>
                        <p><span className="text-muted-foreground">Jenis Reward:</span> {formData.reward_type || "-"}</p>
                        <p><span className="text-muted-foreground">Jumlah:</span> {formData.reward_amount || "-"}</p>
                        <p><span className="text-muted-foreground">Syarat Min:</span> {formData.min_requirement || "-"}</p>
                        <p><span className="text-muted-foreground">Max Klaim:</span> {formData.max_claim || "-"}</p>
                        <p><span className="text-muted-foreground">Aturan TO:</span> {formData.turnover_rule || "-"}</p>
                        <p><span className="text-muted-foreground">Frekuensi:</span> {formData.claim_frequency || "-"}</p>
                      </>
                    )}
                    {formData.reward_mode === "tier" && (
                      <>
                        <p><span className="text-muted-foreground">Unit Poin:</span> {promoPointUnit}</p>
                        <p><span className="text-muted-foreground">Tier:</span> {formData.reward_tiers ? "Configured" : "-"}</p>
                      </>
                    )}
                    {formData.reward_mode === "formula" && (
                      <>
                        <p><span className="text-muted-foreground">Formula:</span> {formData.conversion_formula || "-"}</p>
                        <p><span className="text-muted-foreground">Max Klaim:</span> {formData.max_claim || "-"}</p>
                        <p><span className="text-muted-foreground">Frekuensi:</span> {formData.claim_frequency || "-"}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h4 className="font-medium text-button-hover">Batasan & Akses</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(3)}
                      className="h-6 px-2 text-xs hover:bg-button-hover hover:text-black"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Platform:</span> {formData.platform_access || "-"}</p>
                    <p><span className="text-muted-foreground">Jenis Game:</span> {formData.game_restriction || "-"}</p>
                    <p><span className="text-muted-foreground">Mulai:</span> {formData.valid_from || "-"}</p>
                    <p><span className="text-muted-foreground">Berakhir:</span> {formData.valid_until || "Tidak terbatas"}</p>
                    <p><span className="text-muted-foreground">Status:</span> {formData.status || "-"}</p>
                    <p><span className="text-muted-foreground">Wajib APK:</span> {formData.require_apk ? "Ya" : "Tidak"}</p>
                    <p><span className="text-muted-foreground">Wilayah:</span> {formData.geo_restriction || "Semua"}</p>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h4 className="font-medium text-button-hover">Template Pesan</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(4)}
                      className="h-6 px-2 text-xs hover:bg-button-hover hover:text-black"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Offer Text:</span> {formData.response_template_offer || "-"}</p>
                    <p><span className="text-muted-foreground">Requirement Text:</span> {formData.response_template_requirement || "-"}</p>
                    <p><span className="text-muted-foreground">Instruction Text:</span> {formData.response_template_instruction || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <Button 
                  onClick={handleSubmitForm}
                  className="w-full rounded-full bg-button-hover hover:bg-muted-foreground text-black py-6 text-lg font-semibold"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Publish Promo
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">Simpan dan aktifkan promo</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-64 right-0 bg-background border-t border-border p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="rounded-full bg-secondary/50 hover:bg-button-hover hover:text-button-hover-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sebelumnya
          </Button>

          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={handleSaveDraft}
              className="rounded-full bg-secondary/50 hover:bg-button-hover hover:text-button-hover-foreground"
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan Draft
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} / {totalSteps}
            </span>
          </div>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNextStep}
              className="rounded-full bg-button-hover hover:bg-muted-foreground text-black"
            >
              Selanjutnya
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitForm}
              className="rounded-full bg-button-hover hover:bg-muted-foreground text-black"
            >
              <Check className="h-4 w-4 mr-2" />
              Publish Promo
            </Button>
          )}
        </div>
      </div>
      </>
    );
  }

  return null;
}
