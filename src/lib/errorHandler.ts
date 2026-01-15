import { supabase } from '@/db/supabase';

/**
 * Global error handler for API calls
 * Detects if a user's account has been deleted and handles it appropriately
 */
export const handleApiError = async (error: any): Promise<void> => {
  // Check if error is related to missing user/profile
  if (error?.message?.includes('JWT') || 
      error?.message?.includes('not found') ||
      error?.code === 'PGRST116' || // PostgREST error for no rows returned
      error?.code === '42501') { // PostgreSQL insufficient privilege error
    
    // Check if user is logged in but profile doesn't exist
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // User has a session, check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();
      
      // If profile doesn't exist, account was deleted
      if (!profile || profileError) {
        // Sign out and redirect
        await supabase.auth.signOut();
        localStorage.removeItem('remembered_username');
        sessionStorage.setItem('account_deleted', 'true');
        
        // Redirect to login with message
        window.location.href = '/login?deleted=true';
      }
    }
  }
};

/**
 * Wrapper for API calls that automatically handles deleted user errors
 */
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    await handleApiError(error);
    throw error;
  }
};
