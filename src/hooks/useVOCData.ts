import { useState, useEffect } from 'react';
import { supabaseExternal } from '@/lib/supabase';
import { toast } from 'sonner';
import type { VOCConfig } from '@/types/voc-config';

export const useVOCData = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabaseExternal.auth.getUser();
      setUserId(user?.id || null);
      setLoading(false);
    };
    getUser();
  }, []);

  const loadVOCData = async (): Promise<Partial<VOCConfig> | null> => {
    if (!userId) return null;

    try {
      const [
        brandProfileRes,
        communicationStyleRes,
        supportEscalationRes,
        safetyCrisisRes,
        playerBehaviourRes,
        accountRes,
        apiDataRes
      ] = await Promise.all([
        (supabaseExternal as any).schema('ai').from('brand_profile').select('*').eq('user_id', userId).maybeSingle(),
        (supabaseExternal as any).schema('ai').from('communication_style').select('*').eq('user_id', userId).maybeSingle(),
        (supabaseExternal as any).schema('ai').from('support_escalation').select('*').eq('user_id', userId).maybeSingle(),
        (supabaseExternal as any).schema('ai').from('safety_crisis').select('*').eq('user_id', userId).maybeSingle(),
        (supabaseExternal as any).schema('ai').from('player_behaviour').select('*').eq('user_id', userId).maybeSingle(),
        (supabaseExternal as any).schema('client').from('account').select('*').eq('user_id', userId).maybeSingle(),
        (supabaseExternal as any).schema('client').from('api_data').select('*').eq('user_id', userId).maybeSingle()
      ]);

      const brandProfile = brandProfileRes.data as any;
      const communicationStyle = communicationStyleRes.data as any;
      const supportEscalation = supportEscalationRes.data as any;
      const safetyCrisis = safetyCrisisRes.data as any;
      const playerBehaviour = playerBehaviourRes.data as any;
      const account = accountRes.data as any;
      const apiData = apiDataRes.data as any;

      return {
        brandProfile: brandProfile ? {
          brandName: brandProfile.brand_name || '',
          shortName: brandProfile.short_name || '',
          slogan: brandProfile.slogan || '',
          agentName: brandProfile.agent_name || '',
          agentGender: brandProfile.agent_gender || '',
          toneStyle: brandProfile.tone_style || '',
          defaultCallToPlayer: brandProfile.default_call_to_player || '',
          emojiPreference: brandProfile.emoji_preference || '',
        } : undefined,
        communicationStyle: communicationStyle ? {
          formalityLevel: communicationStyle.formality_level || 5,
          warmthLevel: communicationStyle.warmth_level || 5,
          humorUsage: communicationStyle.humor_usage || '',
          emojiStyle: communicationStyle.emoji_style || '',
        } : undefined,
        supportEscalation: supportEscalation ? {
          adminContactMethod: supportEscalation.admin_contact_method || '',
          adminContact: supportEscalation.admin_contact || '',
          picActiveHours: supportEscalation.pic_active_hours || '',
          escalationThreshold: supportEscalation.escalation_threshold || [],
          sopStyle: supportEscalation.sop_style || '',
          defaultEscalationMessage: supportEscalation.default_escalation_message || '',
        } : undefined,
        safetyCrisis: safetyCrisis ? {
          crisisToneStyle: safetyCrisis.crisis_tone_style || '',
          bonusPreventifAllowed: safetyCrisis.bonus_preventif_allowed || false,
          bonusPreventifLimit: safetyCrisis.bonus_preventif_limit || '',
          riskAppetite: safetyCrisis.risk_appetite || 50,
          forbiddenPhrases: safetyCrisis.forbidden_phrases || '',
          allowedSensitiveTerms: safetyCrisis.allowed_sensitive_terms || '',
          crisisKeywords: safetyCrisis.crisis_keywords || '',
          crisisResponseTemplate: safetyCrisis.crisis_response_template || '',
        } : undefined,
        playerBehaviour: playerBehaviour ? {
          personalizationLevel: playerBehaviour.personalization_level || 5,
          sentimentalMemory: playerBehaviour.sentimental_memory || false,
          antiHunterAggressiveness: playerBehaviour.anti_hunter_aggressiveness || 5,
          silentSniperStyle: playerBehaviour.silent_sniper_style || [],
          vipThreshold: playerBehaviour.vip_threshold || '',
          vipTone: playerBehaviour.vip_tone || [],
        } : undefined,
        account: account ? {
          userName: account.user_name || '',
          whatsappNumber: account.whatsapp_number || '',
          email: account.email || '',
          position: account.position || '',
        } : undefined,
        apiData: apiData ? {
          supabaseApi: apiData.supabase_api || '',
          chatGptApi: apiData.chat_gpt_api || '',
        } : undefined,
      };
    } catch (error) {
      console.error('Error loading VOC data:', error);
      toast.error('Failed to load configuration data');
      return null;
    }
  };

  const saveBrandProfile = async (data: VOCConfig['brandProfile']) => {
    if (!userId) return;

    const payload = {
      user_id: userId,
      brand_name: data.brandName,
      short_name: data.shortName,
      slogan: data.slogan,
      agent_name: data.agentName,
      agent_gender: data.agentGender,
      tone_style: data.toneStyle,
      default_call_to_player: data.defaultCallToPlayer,
      emoji_preference: data.emojiPreference,
    };

    const { error } = await (supabaseExternal as any)
      .schema('ai')
      .from('brand_profile')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save Brand Profile');
      throw error;
    }
    toast.success('Brand Profile saved successfully');
  };

  const saveCommunicationStyle = async (data: VOCConfig['communicationStyle']) => {
    if (!userId) return;

    const payload = {
      user_id: userId,
      formality_level: data.formalityLevel,
      warmth_level: data.warmthLevel,
      humor_usage: data.humorUsage,
      emoji_style: data.emojiStyle,
    };

    const { error } = await (supabaseExternal as any)
      .schema('ai')
      .from('communication_style')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save Communication Style');
      throw error;
    }
    toast.success('Communication Style saved successfully');
  };

  const saveSupportEscalation = async (data: VOCConfig['supportEscalation']) => {
    if (!userId) return;

    const payload = {
      user_id: userId,
      admin_contact_method: data.adminContactMethod,
      admin_contact: data.adminContact,
      pic_active_hours: data.picActiveHours,
      escalation_threshold: data.escalationThreshold,
      sop_style: data.sopStyle,
      default_escalation_message: data.defaultEscalationMessage,
    };

    const { error } = await (supabaseExternal as any)
      .schema('ai')
      .from('support_escalation')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save Support Escalation');
      throw error;
    }
    toast.success('Support Escalation saved successfully');
  };

  const saveSafetyCrisis = async (data: VOCConfig['safetyCrisis']) => {
    if (!userId) return;

    const payload = {
      user_id: userId,
      crisis_tone_style: data.crisisToneStyle,
      bonus_preventif_allowed: data.bonusPreventifAllowed,
      bonus_preventif_limit: data.bonusPreventifLimit,
      risk_appetite: data.riskAppetite,
      forbidden_phrases: data.forbiddenPhrases,
      allowed_sensitive_terms: data.allowedSensitiveTerms,
      crisis_keywords: data.crisisKeywords,
      crisis_response_template: data.crisisResponseTemplate,
    };

    const { error } = await (supabaseExternal as any)
      .schema('ai')
      .from('safety_crisis')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save Safety & Crisis Settings');
      throw error;
    }
    toast.success('Safety & Crisis Settings saved successfully');
  };

  const savePlayerBehaviour = async (data: VOCConfig['playerBehaviour']) => {
    if (!userId) return;

    const payload = {
      user_id: userId,
      personalization_level: data.personalizationLevel,
      sentimental_memory: data.sentimentalMemory,
      anti_hunter_aggressiveness: data.antiHunterAggressiveness,
      silent_sniper_style: data.silentSniperStyle,
      vip_threshold: data.vipThreshold,
      vip_tone: data.vipTone,
    };

    const { error } = await (supabaseExternal as any)
      .schema('ai')
      .from('player_behaviour')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save Player Behaviour');
      throw error;
    }
    toast.success('Player Behaviour saved successfully');
  };

  const saveAccount = async (data: VOCConfig['account']) => {
    if (!userId) return;

    const payload = {
      user_id: userId,
      user_name: data.userName,
      whatsapp_number: data.whatsappNumber,
      email: data.email,
      position: data.position,
    };

    const { error } = await (supabaseExternal as any)
      .schema('client')
      .from('account')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save Account');
      throw error;
    }
    toast.success('Account saved successfully');
  };

  const saveAPIData = async (data: VOCConfig['apiData']) => {
    if (!userId) return;

    const payload = {
      user_id: userId,
      supabase_api: data.supabaseApi,
      chat_gpt_api: data.chatGptApi,
    };

    const { error } = await (supabaseExternal as any)
      .schema('client')
      .from('api_data')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save API Data');
      throw error;
    }
    toast.success('API Data saved successfully');
  };

  return {
    loading,
    userId,
    loadVOCData,
    saveBrandProfile,
    saveCommunicationStyle,
    saveSupportEscalation,
    saveSafetyCrisis,
    savePlayerBehaviour,
    saveAccount,
    saveAPIData,
  };
};
