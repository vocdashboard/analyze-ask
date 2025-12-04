export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_brand_profile: {
        Row: {
          agent_gender: string | null
          agent_name: string | null
          brand_name: string | null
          created_at: string | null
          default_call_to_player: string | null
          emoji_preference: string | null
          id: string
          short_name: string | null
          slogan: string | null
          tone_style: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_gender?: string | null
          agent_name?: string | null
          brand_name?: string | null
          created_at?: string | null
          default_call_to_player?: string | null
          emoji_preference?: string | null
          id?: string
          short_name?: string | null
          slogan?: string | null
          tone_style?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_gender?: string | null
          agent_name?: string | null
          brand_name?: string | null
          created_at?: string | null
          default_call_to_player?: string | null
          emoji_preference?: string | null
          id?: string
          short_name?: string | null
          slogan?: string | null
          tone_style?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_communication_style: {
        Row: {
          created_at: string | null
          emoji_style: string | null
          formality_level: number | null
          humor_usage: string | null
          id: string
          updated_at: string | null
          user_id: string
          warmth_level: number | null
        }
        Insert: {
          created_at?: string | null
          emoji_style?: string | null
          formality_level?: number | null
          humor_usage?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          warmth_level?: number | null
        }
        Update: {
          created_at?: string | null
          emoji_style?: string | null
          formality_level?: number | null
          humor_usage?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          warmth_level?: number | null
        }
        Relationships: []
      }
      ai_player_behaviour: {
        Row: {
          anti_hunter_aggressiveness: number | null
          created_at: string | null
          id: string
          personalization_level: number | null
          sentimental_memory: boolean | null
          silent_sniper_style: string[] | null
          updated_at: string | null
          user_id: string
          vip_threshold: string | null
          vip_tone: string[] | null
        }
        Insert: {
          anti_hunter_aggressiveness?: number | null
          created_at?: string | null
          id?: string
          personalization_level?: number | null
          sentimental_memory?: boolean | null
          silent_sniper_style?: string[] | null
          updated_at?: string | null
          user_id: string
          vip_threshold?: string | null
          vip_tone?: string[] | null
        }
        Update: {
          anti_hunter_aggressiveness?: number | null
          created_at?: string | null
          id?: string
          personalization_level?: number | null
          sentimental_memory?: boolean | null
          silent_sniper_style?: string[] | null
          updated_at?: string | null
          user_id?: string
          vip_threshold?: string | null
          vip_tone?: string[] | null
        }
        Relationships: []
      }
      ai_safety_crisis: {
        Row: {
          allowed_sensitive_terms: string | null
          bonus_preventif_allowed: boolean | null
          bonus_preventif_limit: string | null
          created_at: string | null
          crisis_keywords: string | null
          crisis_response_template: string | null
          crisis_tone_style: string | null
          forbidden_phrases: string | null
          id: string
          risk_appetite: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allowed_sensitive_terms?: string | null
          bonus_preventif_allowed?: boolean | null
          bonus_preventif_limit?: string | null
          created_at?: string | null
          crisis_keywords?: string | null
          crisis_response_template?: string | null
          crisis_tone_style?: string | null
          forbidden_phrases?: string | null
          id?: string
          risk_appetite?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allowed_sensitive_terms?: string | null
          bonus_preventif_allowed?: boolean | null
          bonus_preventif_limit?: string | null
          created_at?: string | null
          crisis_keywords?: string | null
          crisis_response_template?: string | null
          crisis_tone_style?: string | null
          forbidden_phrases?: string | null
          id?: string
          risk_appetite?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_support_escalation: {
        Row: {
          admin_contact: string | null
          admin_contact_method: string | null
          created_at: string | null
          default_escalation_message: string | null
          escalation_threshold: string[] | null
          id: string
          pic_active_hours: string | null
          sop_style: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_contact?: string | null
          admin_contact_method?: string | null
          created_at?: string | null
          default_escalation_message?: string | null
          escalation_threshold?: string[] | null
          id?: string
          pic_active_hours?: string | null
          sop_style?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_contact?: string | null
          admin_contact_method?: string | null
          created_at?: string | null
          default_escalation_message?: string | null
          escalation_threshold?: string[] | null
          id?: string
          pic_active_hours?: string | null
          sop_style?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      client_account: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          position: string | null
          updated_at: string | null
          user_id: string
          user_name: string | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          position?: string | null
          updated_at?: string | null
          user_id: string
          user_name?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          position?: string | null
          updated_at?: string | null
          user_id?: string
          user_name?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      client_api_data: {
        Row: {
          chat_gpt_api: string | null
          created_at: string | null
          id: string
          supabase_api: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chat_gpt_api?: string | null
          created_at?: string | null
          id?: string
          supabase_api?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chat_gpt_api?: string | null
          created_at?: string | null
          id?: string
          supabase_api?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      livechat_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          sender: string
          sender_name: string | null
          session_id: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          id: string
          is_read?: boolean | null
          message: string
          sender: string
          sender_name?: string | null
          session_id: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          sender?: string
          sender_name?: string | null
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "livechat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "livechat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      livechat_sessions: {
        Row: {
          browser: string | null
          chat_duration: string | null
          created_at: string
          device: string | null
          groups: string[] | null
          id: string
          is_first_visit: boolean | null
          last_message: string | null
          local_time: string | null
          location: string | null
          source: string | null
          status: string
          tags: string[] | null
          timestamp: string
          unread_count: number | null
          updated_at: string
          user_email: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          browser?: string | null
          chat_duration?: string | null
          created_at?: string
          device?: string | null
          groups?: string[] | null
          id: string
          is_first_visit?: boolean | null
          last_message?: string | null
          local_time?: string | null
          location?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          timestamp?: string
          unread_count?: number | null
          updated_at?: string
          user_email?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          browser?: string | null
          chat_duration?: string | null
          created_at?: string
          device?: string | null
          groups?: string[] | null
          id?: string
          is_first_visit?: boolean | null
          last_message?: string | null
          local_time?: string | null
          location?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          timestamp?: string
          unread_count?: number | null
          updated_at?: string
          user_email?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
