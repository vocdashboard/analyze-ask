import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryNav } from "@/components/VOCDashboard/CategoryNav";
import { subCategories } from "@/components/VOCDashboard/SubCategoryTabs";
import { ticketSubCategories } from "@/components/VOCDashboard/TicketSubCategories";
import { KnowledgeBaseSection } from "@/components/VOCDashboard/KnowledgeBaseSection";
import { TicketList } from "@/components/VOCDashboard/TicketList";
import { UserSection } from "@/components/VOCDashboard/UserSection";
import { AdminRoleSection } from "@/components/VOCDashboard/AdminRoleSection";
import { ChatSection } from "@/components/VOCDashboard/ChatSection";
import { BrandProfileForm, CommunicationStyleForm, SupportEscalationForm, SafetyCrisisForm, PlayerBehaviourForm } from "@/components/VOCDashboard/forms";
import { AccountSection } from "@/components/VOCDashboard/AccountSection";
import { APIDataSection } from "@/components/VOCDashboard/APIDataSection";
import { VOCConfig } from "@/types/voc-config";
import { TicketCategory } from "@/types/ticket";
import { toast } from "sonner";
import { Save, Download, ArrowLeft, ArrowRight, Search, ChevronRight } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useVOCData } from "@/hooks/useVOCData";
const vocConfigSchema = z.object({
  brandProfile: z.object({
    brandName: z.string().min(1, "Brand name is required"),
    shortName: z.string().min(1, "Short name is required"),
    slogan: z.string().min(1, "Slogan is required"),
    agentName: z.string().min(1, "Agent name is required"),
    agentGender: z.string().min(1, "Agent gender is required"),
    toneStyle: z.string().min(1, "Tone style is required"),
    defaultCallToPlayer: z.string().min(1, "Default call-to-player is required"),
    emojiPreference: z.string().min(1, "Emoji preference is required")
  }),
  communicationStyle: z.object({
    formalityLevel: z.number().min(1).max(10),
    warmthLevel: z.number().min(1).max(10),
    humorUsage: z.string().min(1, "Humor usage is required"),
    emojiStyle: z.string().min(1, "Emoji style is required")
  }),
  supportEscalation: z.object({
    adminContactMethod: z.string().min(1, "Admin contact method is required"),
    adminContact: z.string().min(1, "Admin contact is required"),
    picActiveHours: z.string().min(1, "PIC active hours is required"),
    escalationThreshold: z.array(z.string()).min(1, "Select at least one escalation threshold"),
    sopStyle: z.string().min(1, "SOP style is required"),
    defaultEscalationMessage: z.string().min(1, "Default escalation message is required")
  }),
  safetyCrisis: z.object({
    crisisToneStyle: z.string().min(1, "Crisis tone style is required"),
    bonusPreventifAllowed: z.boolean(),
    bonusPreventifLimit: z.string().optional(),
    riskAppetite: z.number().min(1).max(100),
    forbiddenPhrases: z.string().min(1, "Forbidden phrases is required"),
    allowedSensitiveTerms: z.string().min(1, "Allowed sensitive terms is required"),
    crisisKeywords: z.string().optional(),
    crisisResponseTemplate: z.string().min(1, "Crisis response template is required")
  }),
  playerBehaviour: z.object({
    personalizationLevel: z.number().min(1).max(10),
    sentimentalMemory: z.boolean(),
    antiHunterAggressiveness: z.number().min(1).max(10),
    silentSniperStyle: z.array(z.string()).min(1, "Select at least one silent sniper style"),
    vipThreshold: z.string().min(1, "VIP threshold is required"),
    vipTone: z.array(z.string()).min(1, "Select at least one VIP tone")
  }),
  account: z.object({
    userName: z.string().optional(),
    whatsappNumber: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    position: z.string().optional()
  }),
  apiData: z.object({
    supabaseApi: z.string().optional(),
    chatGptApi: z.string().optional()
  })
});
const defaultValues: VOCConfig = {
  brandProfile: {
    brandName: "",
    shortName: "",
    slogan: "",
    agentName: "",
    agentGender: "",
    toneStyle: "",
    defaultCallToPlayer: "",
    emojiPreference: ""
  },
  communicationStyle: {
    formalityLevel: 5,
    warmthLevel: 5,
    humorUsage: "",
    emojiStyle: ""
  },
  supportEscalation: {
    adminContactMethod: "",
    adminContact: "",
    picActiveHours: "",
    escalationThreshold: [],
    sopStyle: "",
    defaultEscalationMessage: ""
  },
  safetyCrisis: {
    crisisToneStyle: "",
    bonusPreventifAllowed: false,
    bonusPreventifLimit: "",
    riskAppetite: 50,
    forbiddenPhrases: "",
    allowedSensitiveTerms: "",
    crisisKeywords: "",
    crisisResponseTemplate: ""
  },
  playerBehaviour: {
    personalizationLevel: 5,
    sentimentalMemory: false,
    antiHunterAggressiveness: 5,
    silentSniperStyle: [],
    vipThreshold: "",
    vipTone: []
  },
  account: {
    userName: "",
    whatsappNumber: "",
    email: "",
    position: ""
  },
  apiData: {
    supabaseApi: "",
    chatGptApi: ""
  }
};
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("inputData");
  const [activeCategory, setActiveCategory] = useState("brandProfile");
  const [activeTicketCategory, setActiveTicketCategory] = useState<TicketCategory>("general");
  const [completedCategories, setCompletedCategories] = useState<Set<string>>(new Set());
  
  const vocData = useVOCData();
  
  const form = useForm<VOCConfig>({
    resolver: zodResolver(vocConfigSchema),
    defaultValues,
    mode: "onChange"
  });

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      if (!vocData.userId) return;
      
      const data = await vocData.loadVOCData();
      if (data) {
        // Merge loaded data with defaults
        form.reset({
          ...defaultValues,
          ...data,
        });
      }
    };
    
    if (!vocData.loading) {
      loadData();
    }
  }, [vocData.loading, vocData.userId]);
  
  const onSubmit = (data: VOCConfig) => {
    console.log("Form data:", data);
    toast.success("Configuration saved successfully!");
  };
  const handleExport = () => {
    const data = form.getValues();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voc-config-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Configuration exported!");
  };
  const currentIndex = subCategories.findIndex(cat => cat.key === activeCategory);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < subCategories.length - 1;
  const previousCategory = canGoPrevious ? subCategories[currentIndex - 1] : null;
  const nextCategory = canGoNext ? subCategories[currentIndex + 1] : null;
  
  const goToPrevious = () => {
    if (canGoPrevious) {
      setActiveCategory(subCategories[currentIndex - 1].key);
    }
  };
  const goToNext = () => {
    if (canGoNext) {
      setActiveCategory(subCategories[currentIndex + 1].key);
    }
  };
  
  const getSectionName = (key: string) => {
    const sectionNames: Record<string, string> = {
      inputData: "Input Data",
      knowledgeBase: "Knowledge Base",
      ticket: "Ticket",
      user: "User",
      adminRole: "Admin Role",
      liveChat: "Live Chat",
      account: "Account",
      apiData: "API Data",
      support: "Support"
    };
    return sectionNames[key] || key;
  };
  
  const getCategoryName = (key: string) => {
    if (activeSection === "inputData") {
      const category = subCategories.find(cat => cat.key === key);
      return category?.name || key;
    }
    if (activeSection === "ticket") {
      const category = ticketSubCategories.find(cat => cat.key === key);
      return category?.name || key;
    }
    return key;
  };
  const renderContent = () => {
    if (activeSection === "knowledgeBase") {
      return <KnowledgeBaseSection />;
    }
    if (activeSection === "ticket") {
      return <TicketList category={activeTicketCategory} />;
    }
    if (activeSection === "user") {
      return <UserSection />;
    }
    if (activeSection === "adminRole") {
      return <AdminRoleSection />;
    }
    if (activeSection === "liveChat") {
      return <ChatSection />;
    }
    if (activeSection === "account") {
      return <AccountSection form={form} onSave={() => vocData.saveAccount(form.getValues().account)} />;
    }
    if (activeSection === "apiData") {
      return <APIDataSection form={form} onSave={() => vocData.saveAPIData(form.getValues().apiData)} />;
    }

    // Input Data section - show forms
    switch (activeCategory) {
      case "brandProfile":
        return <BrandProfileForm form={form} onSave={() => vocData.saveBrandProfile(form.getValues().brandProfile)} />;
      case "communicationStyle":
        return <CommunicationStyleForm form={form} onSave={() => vocData.saveCommunicationStyle(form.getValues().communicationStyle)} />;
      case "supportEscalation":
        return <SupportEscalationForm form={form} onSave={() => vocData.saveSupportEscalation(form.getValues().supportEscalation)} />;
      case "safetyCrisis":
        return <SafetyCrisisForm form={form} onSave={() => vocData.saveSafetyCrisis(form.getValues().safetyCrisis)} />;
      case "playerBehaviour":
        return <PlayerBehaviourForm form={form} onSave={() => vocData.savePlayerBehaviour(form.getValues().playerBehaviour)} />;
      default:
        return <BrandProfileForm form={form} onSave={() => vocData.saveBrandProfile(form.getValues().brandProfile)} />;
    }
  };
  return <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CategoryNav 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeTicketCategory={activeTicketCategory}
          onTicketCategoryChange={(key) => setActiveTicketCategory(key as TicketCategory)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">

          <header className="h-[57px] bg-card border-b border-border px-6 flex items-center">
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink className="cursor-pointer">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {(activeSection === "inputData" || activeSection === "ticket") ? (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink className="cursor-pointer">{getSectionName(activeSection)}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage className="text-button-hover font-bold">
                            {activeSection === "inputData" ? getCategoryName(activeCategory) : getCategoryName(activeTicketCategory)}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-button-hover font-bold">{getSectionName(activeSection)}</BreadcrumbPage>
                      </BreadcrumbItem>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 h-9 bg-secondary/30 dark:bg-secondary/50 border-border" />
                </div>
                <Button 
                  onClick={() => {
                    toast.success("Configuration published successfully!");
                  }} 
                  className="bg-button-hover text-button-hover-foreground hover:bg-button-hover/90 h-9 shadow-md hover:shadow-lg transition-all"
                >
                  Publish
                </Button>
              </div>
            </div>
          </header>

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <Form {...form}>
            <div className="w-full">
              {activeSection === "inputData" || activeSection === "account" || activeSection === "apiData" ? (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {renderContent()}
                </form>
              ) : (
                renderContent()
              )}
            </div>
          </Form>
        </main>

        {activeSection === "inputData" && <footer className="bg-card border-t border-border px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <Button 
                variant="outline" 
                onClick={goToPrevious} 
                disabled={!canGoPrevious}
                className="min-w-[160px] justify-between"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="truncate">
                  {previousCategory ? previousCategory.name : "Previous"}
                </span>
              </Button>
              <div className="text-sm text-muted-foreground text-center px-4">
                {currentIndex + 1} of {subCategories.length}
              </div>
              <Button 
                onClick={goToNext} 
                disabled={!canGoNext}
                className="min-w-[160px] justify-between"
              >
                <span className="truncate">
                  {nextCategory ? nextCategory.name : "Next"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </footer>}
        </div>
      </div>
    </SidebarProvider>;
};
export default Dashboard;