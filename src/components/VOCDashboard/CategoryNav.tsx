import { cn } from "@/lib/utils";
import { Database, BookOpen, Users, Settings, Shield, LogOut, LucideIcon, HelpCircle, ChevronDown, Ticket, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import vocLogo from "@/assets/voc-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { subCategories } from "./SubCategoryTabs";
import { ticketSubCategories } from "./TicketSubCategories";


export interface MainSection {
  key: string;
  name: string;
  icon: LucideIcon;
  children?: MainSection[];
}

export const mainSections: MainSection[] = [
  { key: "inputData", name: "Input Data", icon: Database },
  { key: "knowledgeBase", name: "Knowledge Base", icon: BookOpen },
  { key: "ticket", name: "Ticket", icon: Ticket },
  { key: "user", name: "User", icon: Users },
  { key: "adminRole", name: "Admin Role", icon: Shield },
];

interface CategoryNavProps {
  activeSection: string;
  onSectionChange: (key: string) => void;
  activeCategory: string;
  onCategoryChange: (key: string) => void;
  activeTicketCategory: string;
  onTicketCategoryChange: (key: string) => void;
}

export function CategoryNav({ activeSection, onSectionChange, activeCategory, onCategoryChange, activeTicketCategory, onTicketCategoryChange }: CategoryNavProps) {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { resolvedTheme } = useTheme();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    navigate("/");
  };

  const handleAccountClick = () => {
    onSectionChange("account");
  };

  const handleSubCategoryClick = (key: string) => {
    onSectionChange("inputData");
    onCategoryChange(key);
  };

  const handleTicketSubCategoryClick = (key: string) => {
    onSectionChange("ticket");
    onTicketCategoryChange(key);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="h-[57px] flex items-center justify-center border-b border-border">
        <div className="flex items-center justify-center">
          <img 
            src={vocLogo} 
            alt="Vault of Codex" 
            className={cn(
              "object-contain transition-all duration-300",
              "h-5 w-auto",
              "group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5",
              resolvedTheme === "dark" && "brightness-0 invert"
            )} 
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground px-2 mb-2">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainSections.map((section) => {
                const isActive = activeSection === section.key;
                const Icon = section.icon;

                // Input Data dengan sub-menu
                if (section.key === "inputData") {
                  return (
                    <Collapsible
                      key={section.key}
                      defaultOpen={activeSection === "inputData"}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isActive}
                            tooltip={section.name}
                            className={cn(
                              "w-full py-2.5",
                              isActive && "!bg-button-hover hover:!bg-button-hover"
                            )}
                            onClick={() => onSectionChange("inputData")}
                          >
                            <Icon className={cn(
                              "h-5 w-5 shrink-0 transition-colors",
                              isActive ? "text-button-hover-foreground" : "text-foreground/70"
                            )} />
                            <span className={cn(
                              "text-sm",
                              isActive && "text-button-hover-foreground"
                            )}>{section.name}</span>
                            <ChevronDown className={cn(
                              "ml-auto h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180",
                              isActive ? "text-button-hover-foreground" : ""
                            )} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="space-y-1.5 mt-2">
                            {subCategories.map((subCat) => {
                              const SubIcon = subCat.icon;
                              const isSubActive = activeSection === "inputData" && activeCategory === subCat.key;
                              
                              return (
                                <SidebarMenuSubItem key={subCat.key}>
                                  <SidebarMenuSubButton
                                    onClick={() => handleSubCategoryClick(subCat.key)}
                                    className="py-2 transition-colors duration-200 !bg-transparent hover:!bg-transparent data-[active=true]:!bg-transparent"
                                    data-active={isSubActive}
                                  >
                                    <SubIcon className={cn(
                                      "h-5 w-5 shrink-0 transition-colors",
                                      isSubActive 
                                        ? "text-button-hover" 
                                        : "text-foreground/60 hover:text-button-hover"
                                    )} />
                                    <span className={cn(
                                      "text-sm transition-colors",
                                      isSubActive 
                                        ? "text-button-hover font-bold" 
                                        : "text-foreground/80 hover:text-button-hover"
                                    )}>{subCat.name}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Ticket dengan sub-menu
                if (section.key === "ticket") {
                  return (
                    <Collapsible
                      key={section.key}
                      defaultOpen={activeSection === "ticket"}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isActive}
                            tooltip={section.name}
                            className={cn(
                              "w-full py-2.5",
                              isActive && "!bg-button-hover hover:!bg-button-hover"
                            )}
                            onClick={() => onSectionChange("ticket")}
                          >
                            <Icon className={cn(
                              "h-5 w-5 shrink-0 transition-colors",
                              isActive ? "text-button-hover-foreground" : "text-foreground/70"
                            )} />
                            <span className={cn(
                              "text-sm",
                              isActive && "text-button-hover-foreground"
                            )}>{section.name}</span>
                            <ChevronDown className={cn(
                              "ml-auto h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180",
                              isActive ? "text-button-hover-foreground" : ""
                            )} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="space-y-1.5 mt-2">
                            {ticketSubCategories.map((ticketCat) => {
                              const TicketIcon = ticketCat.icon;
                              const isTicketActive = activeSection === "ticket" && activeTicketCategory === ticketCat.key;
                              
                              return (
                                <SidebarMenuSubItem key={ticketCat.key}>
                                  <SidebarMenuSubButton
                                    onClick={() => handleTicketSubCategoryClick(ticketCat.key)}
                                    className="py-2 transition-colors duration-200 !bg-transparent hover:!bg-transparent data-[active=true]:!bg-transparent"
                                    data-active={isTicketActive}
                                  >
                                    <TicketIcon className={cn(
                                      "h-5 w-5 shrink-0 transition-colors",
                                      isTicketActive 
                                        ? "text-button-hover" 
                                        : "text-foreground/60 hover:text-button-hover"
                                    )} />
                                    <span className={cn(
                                      "text-sm transition-colors",
                                      isTicketActive 
                                        ? "text-button-hover font-bold" 
                                        : "text-foreground/80 hover:text-button-hover"
                                    )}>{ticketCat.name}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Sections lainnya (tanpa sub-menu)
                return (
                  <SidebarMenuItem key={section.key}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => onSectionChange(section.key)}
                      tooltip={section.name}
                      className="w-full py-2.5"
                    >
                      <Icon className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-button-hover-foreground" : "text-foreground/70"
                      )} />
                      <span className={cn(
                        "text-sm",
                        isActive && "text-button-hover-foreground"
                      )}>{section.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Chat Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground px-2 mb-2">Chat</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "liveChat"}
                  onClick={() => onSectionChange("liveChat")}
                  tooltip="Live Chat"
                  className="py-2.5"
                >
                  <MessageCircle className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    activeSection === "liveChat" ? "text-button-hover-foreground" : "text-foreground/70"
                  )} />
                  <span className={cn(
                    "text-sm",
                    activeSection === "liveChat" && "text-button-hover-foreground"
                  )}>Live Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground px-2 mb-2">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "support"}
                  onClick={() => onSectionChange("support")}
                  tooltip="Support"
                  className="py-2.5"
                >
                  <HelpCircle className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    activeSection === "support" ? "text-button-hover-foreground" : "text-foreground/70"
                  )} />
                  <span className={cn(
                    "text-sm",
                    activeSection === "support" && "text-button-hover-foreground"
                  )}>Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "apiData"}
                  onClick={() => onSectionChange("apiData")}
                  tooltip="API Data"
                  className="py-2.5"
                >
                  <Settings className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    activeSection === "apiData" ? "text-button-hover-foreground" : "text-foreground/70"
                  )} />
                  <span className={cn(
                    "text-sm",
                    activeSection === "apiData" && "text-button-hover-foreground"
                  )}>API Data</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleAccountClick}
              isActive={activeSection === "account"}
              tooltip="Account"
              className="p-3 h-auto"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs bg-button-hover text-sidebar-foreground font-semibold">EG</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate text-button-hover">Emilia Greene</span>
                <span className={cn(
                  "text-xs truncate",
                  activeSection === "account" ? "text-button-hover-foreground/70" : "text-muted-foreground"
                )}>emilia.greene@example.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="py-2.5 text-foreground hover:text-foreground hover:bg-muted/50"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="text-sm font-bold">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
