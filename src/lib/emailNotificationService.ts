import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface EmailNotificationPayload {
  type: 'new_review' | 'new_hanafuda' | 'new_member' | 'editorial_inquiry';
  customData?: {
    display_name?: string;
    email?: string;
    chapter_number?: number;
    chapter_title?: string;
    rating?: number;
    comment?: string;
    card_title?: string;
    kanji?: string;
    symbol?: string;
    description?: string;
    image_url?: string;
    inquiryType?: string;
    publisherName?: string;
    contactPerson?: string;
    message?: string;
  };
}

/**
 * Appelle l'Edge Function Supabase 'send-email' pour expédier une notification vers biitsumajin@gmail.com via Resend.
 */
export async function triggerEmailNotification(payload: EmailNotificationPayload) {
  if (!isSupabaseConfigured || !supabase) {
    console.log('[Notification Locale]', payload.type, payload.customData);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: payload
    });

    if (error) {
      console.warn('Erreur lors de l’invocation de l’Edge Function send-email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Exception notification e-mail:', err);
    return { success: false, error: err };
  }
}
