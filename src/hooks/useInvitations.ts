import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Invitation {
  id: string;
  tenant_id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  invited_by: string | null;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expires_at: string;
  accepted_at: string | null;
  accepted_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useInvitations = (tenantId: string | null) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    fetchInvitations();
  }, [tenantId]);

  const fetchInvitations = async () => {
    if (!tenantId) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('invitations' as any)
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInvitations((data || []) as unknown as Invitation[]);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInvitation = async (email: string, role: 'admin' | 'teacher' | 'student') => {
    if (!tenantId) throw new Error('No tenant selected');

    // Generate token using crypto.randomUUID as fallback
    const token = crypto.randomUUID().replace(/-/g, '').substring(0, 32);

    const { data, error: createError } = await supabase
      .from('invitations' as any)
      .insert({
        tenant_id: tenantId,
        email: email.toLowerCase().trim(),
        role,
        token,
      } as any)
      .select()
      .single();

    if (createError) throw createError;
    await fetchInvitations();
    return data as unknown as Invitation;
  };

  const cancelInvitation = async (invitationId: string) => {
    const { error: updateError } = await supabase
      .from('invitations' as any)
      .update({ status: 'cancelled' } as any)
      .eq('id', invitationId);

    if (updateError) throw updateError;
    await fetchInvitations();
  };

  const deleteInvitation = async (invitationId: string) => {
    const { error: deleteError } = await supabase
      .from('invitations' as any)
      .delete()
      .eq('id', invitationId);

    if (deleteError) throw deleteError;
    await fetchInvitations();
  };

  const resendInvitation = async (invitationId: string) => {
    // Get the invitation
    const invitation = invitations.find(i => i.id === invitationId);
    if (!invitation) throw new Error('Invitation not found');

    // Cancel old invitation
    await cancelInvitation(invitationId);

    // Create new invitation
    return await createInvitation(invitation.email, invitation.role);
  };

  return {
    invitations,
    loading,
    error,
    fetchInvitations,
    createInvitation,
    cancelInvitation,
    deleteInvitation,
    resendInvitation,
  };
};

export const useInvitationAcceptance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getInvitationByToken = async (token: string): Promise<Invitation | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('invitations' as any)
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') return null; // Not found
        throw fetchError;
      }
      return data as unknown as Invitation;
    } catch (err: any) {
      console.error('Error fetching invitation:', err);
      return null;
    }
  };

  const acceptInvitation = async (token: string, userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: acceptError } = await supabase
        .rpc('accept_invitation' as any, {
          _token: token,
          _user_id: userId,
        } as any);

      if (acceptError) throw acceptError;
      return data === true;
    } catch (err: any) {
      setError(err);
      console.error('Error accepting invitation:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getInvitationByToken,
    acceptInvitation,
  };
};

