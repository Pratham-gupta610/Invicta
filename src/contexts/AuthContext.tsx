import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile, UserCategory, ParticipationType } from '@/types/types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
  return data;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string, 
    password: string, 
    fullName: string, 
    userCategory: UserCategory, 
    participationType?: ParticipationType
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleAccountDeleted = async () => {
    // Clear all user data
    setUser(null);
    setProfile(null);
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear any stored data
    localStorage.removeItem('remembered_username');
    
    // Set flag to show toast on login page
    sessionStorage.setItem('account_deleted', 'true');
    
    // Redirect to login page with deleted parameter
    window.location.href = '/login?deleted=true';
  };

  const checkProfileExists = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking profile:', error);
        return false;
      }

      return data !== null;
    } catch (error) {
      console.error('Error checking profile:', error);
      return false;
    }
  };

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await getProfile(user.id);
    
    // If profile doesn't exist but user is logged in, account was deleted
    if (!profileData) {
      await handleAccountDeleted();
      return;
    }
    
    setProfile(profileData);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id).then((profileData) => {
          if (!profileData) {
            // Profile doesn't exist, account was deleted
            handleAccountDeleted();
          } else {
            setProfile(profileData);
          }
        });
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        // Clear interval when signed out
        if (profileCheckIntervalRef.current) {
          clearInterval(profileCheckIntervalRef.current);
          profileCheckIntervalRef.current = null;
        }
      } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        if (session?.user) {
          getProfile(session.user.id).then((profileData) => {
            if (!profileData) {
              // Profile doesn't exist, account was deleted
              handleAccountDeleted();
            } else {
              setProfile(profileData);
            }
          });
        }
      } else if (session?.user) {
        getProfile(session.user.id).then((profileData) => {
          if (!profileData) {
            handleAccountDeleted();
          } else {
            setProfile(profileData);
          }
        });
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Periodic profile check to detect if account was deleted
  useEffect(() => {
    // Clear any existing interval
    if (profileCheckIntervalRef.current) {
      clearInterval(profileCheckIntervalRef.current);
    }

    // Only set up interval if user is logged in
    if (user) {
      // Check every 10 seconds if the profile still exists
      profileCheckIntervalRef.current = setInterval(async () => {
        const exists = await checkProfileExists(user.id);
        if (!exists) {
          // Profile was deleted, handle it
          if (profileCheckIntervalRef.current) {
            clearInterval(profileCheckIntervalRef.current);
            profileCheckIntervalRef.current = null;
          }
          await handleAccountDeleted();
        }
      }, 10000); // Check every 10 seconds
    }

    return () => {
      if (profileCheckIntervalRef.current) {
        clearInterval(profileCheckIntervalRef.current);
        profileCheckIntervalRef.current = null;
      }
    };
  }, [user]);

  const signInWithUsername = async (username: string, password: string, rememberMe: boolean = false) => {
    try {
      // Construct email from username by appending @iiitg.ac.in
      const email = `${username}@iiitg.ac.in`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Store username in localStorage if rememberMe is enabled
      if (rememberMe) {
        localStorage.setItem('remembered_username', username);
      } else {
        localStorage.removeItem('remembered_username');
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithEmail = async (
    email: string, 
    password: string, 
    fullName: string, 
    userCategory: UserCategory, 
    participationType?: ParticipationType
  ) => {
    try {
      // Validate that email ends with @iiitg.ac.in
      if (!email.endsWith('@iiitg.ac.in')) {
        throw new Error('Please use your official IIIT Guwahati email ID (@iiitg.ac.in) to create an account.');
      }

      // Extract username from email (part before @)
      const username = email.split('@')[0];

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            email,
            user_category: userCategory,
            participation_type: participationType || null,
          },
        },
      });

      if (error) throw error;

      // Profile will be automatically created by the handle_new_user() trigger
      // No need to manually insert/update the profile here

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    // Clear remembered username on sign out
    localStorage.removeItem('remembered_username');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithUsername, signUpWithEmail, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
