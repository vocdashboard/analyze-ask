-- AI Config Tables (formerly in 'ai' schema)
CREATE TABLE public.ai_brand_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  brand_name text,
  short_name text,
  slogan text,
  agent_name text,
  agent_gender text,
  tone_style text,
  default_call_to_player text,
  emoji_preference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.ai_communication_style (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  formality_level integer DEFAULT 5,
  warmth_level integer DEFAULT 5,
  humor_usage text,
  emoji_style text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.ai_support_escalation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  admin_contact_method text,
  admin_contact text,
  pic_active_hours text,
  escalation_threshold text[],
  sop_style text,
  default_escalation_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.ai_safety_crisis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  crisis_tone_style text,
  bonus_preventif_allowed boolean DEFAULT false,
  bonus_preventif_limit text,
  risk_appetite integer DEFAULT 50,
  forbidden_phrases text,
  allowed_sensitive_terms text,
  crisis_keywords text,
  crisis_response_template text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.ai_player_behaviour (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  personalization_level integer DEFAULT 5,
  sentimental_memory boolean DEFAULT false,
  anti_hunter_aggressiveness integer DEFAULT 5,
  silent_sniper_style text[],
  vip_threshold text,
  vip_tone text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Client Tables (formerly in 'client' schema)
CREATE TABLE public.client_account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_name text,
  whatsapp_number text,
  email text,
  position text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.client_api_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  supabase_api text,
  chat_gpt_api text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.ai_brand_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_communication_style ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_support_escalation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_safety_crisis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_player_behaviour ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_api_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_brand_profile
CREATE POLICY "Users can view own brand profile" ON public.ai_brand_profile FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brand profile" ON public.ai_brand_profile FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brand profile" ON public.ai_brand_profile FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_communication_style
CREATE POLICY "Users can view own communication style" ON public.ai_communication_style FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own communication style" ON public.ai_communication_style FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own communication style" ON public.ai_communication_style FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_support_escalation
CREATE POLICY "Users can view own support escalation" ON public.ai_support_escalation FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own support escalation" ON public.ai_support_escalation FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own support escalation" ON public.ai_support_escalation FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_safety_crisis
CREATE POLICY "Users can view own safety crisis" ON public.ai_safety_crisis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own safety crisis" ON public.ai_safety_crisis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own safety crisis" ON public.ai_safety_crisis FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_player_behaviour
CREATE POLICY "Users can view own player behaviour" ON public.ai_player_behaviour FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own player behaviour" ON public.ai_player_behaviour FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own player behaviour" ON public.ai_player_behaviour FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for client_account
CREATE POLICY "Users can view own account" ON public.client_account FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own account" ON public.client_account FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own account" ON public.client_account FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for client_api_data
CREATE POLICY "Users can view own api data" ON public.client_api_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api data" ON public.client_api_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api data" ON public.client_api_data FOR UPDATE USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_ai_brand_profile_updated_at BEFORE UPDATE ON public.ai_brand_profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_communication_style_updated_at BEFORE UPDATE ON public.ai_communication_style FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_support_escalation_updated_at BEFORE UPDATE ON public.ai_support_escalation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_safety_crisis_updated_at BEFORE UPDATE ON public.ai_safety_crisis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_player_behaviour_updated_at BEFORE UPDATE ON public.ai_player_behaviour FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_account_updated_at BEFORE UPDATE ON public.client_account FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_api_data_updated_at BEFORE UPDATE ON public.client_api_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();