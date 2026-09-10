import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserProfile, UserRole } from '../types';
import { triggerEmailNotification } from '../lib/emailNotificationService';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  session: any | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any | null }>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { display_name?: string; avatar_url?: string }) => Promise<{ error: any | null }>;
  toggleBookmarkChapter: (chapterNum: number) => Promise<void>;
  toggleSaveStation: (stationId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_GUEST_KEY = 'tokaido_local_guest_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch profile from Supabase public.profiles
  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      if (!isSupabaseConfigured) {
        loadGuestFallback(userId, userEmail);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Error fetching profile from Supabase:', error.message);
        // If profile row doesn't exist yet, derive initial profile
        const isSuperAdmin = userEmail?.toLowerCase() === 'biitsumajin@gmail.com';
        const fallbackProfile: UserProfile = {
          id: userId,
          display_name: userEmail?.split('@')[0] || 'Voyageur du Tōkaidō',
          role: isSuperAdmin ? 'admin' : 'reader',
          saved_stations: [],
          bookmarked_chapters: [1],
        };
        setProfile(fallbackProfile);
      } else if (data) {
        // Enforce admin display for biitsumajin@gmail.com
        const isSuperAdmin = userEmail?.toLowerCase() === 'biitsumajin@gmail.com';
        setProfile({
          ...data,
          role: isSuperAdmin ? 'admin' : data.role,
        });
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
    }
  };

  const loadGuestFallback = (userId?: string, userEmail?: string) => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_GUEST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
      } else if (userId && userEmail) {
        const isSuperAdmin = userEmail.toLowerCase() === 'biitsumajin@gmail.com';
        const newGuest: UserProfile = {
          id: userId,
          display_name: userEmail.split('@')[0] || 'Lecteur Wabi-Sabi',
          role: isSuperAdmin ? 'admin' : 'reader',
          saved_stations: ['nihonbashi', 'odawara'],
          bookmarked_chapters: [1, 5],
        };
        localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify(newGuest));
        setProfile(newGuest);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          // Check local stored session for preview demo
          const localGuest = localStorage.getItem(LOCAL_STORAGE_GUEST_KEY);
          if (localGuest) {
            const parsed = JSON.parse(localGuest);
            setUser({ id: parsed.id || 'demo-user', email: parsed.email || 'biitsumajin@gmail.com' });
            setProfile(parsed);
          }
          setLoading(false);
          return;
        }

        // Get active session
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(activeSession);
          setUser(activeSession?.user ?? null);
          if (activeSession?.user) {
            await fetchProfile(activeSession.user.id, activeSession.user.email);
          }
          setLoading(false);
        }

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (!mounted) return;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id, currentSession.user.email);
          } else {
            setProfile(null);
          }
          setLoading(false);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Supabase Auth init error:', err);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Sign In with email & password
  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Local demo login
      const isSuperAdmin = email.toLowerCase() === 'biitsumajin@gmail.com';
      const demoUser = { id: 'user-' + Date.now(), email };
      const demoProfile: UserProfile = {
        id: demoUser.id,
        display_name: email.split('@')[0],
        role: isSuperAdmin ? 'admin' : 'reader',
        saved_stations: ['nihonbashi'],
        bookmarked_chapters: [1],
      };
      setUser(demoUser);
      setProfile(demoProfile);
      localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify({ ...demoProfile, email }));
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Sign Up with email, password & display_name
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!isSupabaseConfigured) {
      // Local demo signup
      const isSuperAdmin = email.toLowerCase() === 'biitsumajin@gmail.com';
      const demoUser = { id: 'user-' + Date.now(), email };
      const demoProfile: UserProfile = {
        id: demoUser.id,
        display_name: displayName.trim() || email.split('@')[0],
        role: isSuperAdmin ? 'admin' : 'reader',
        saved_stations: ['nihonbashi'],
        bookmarked_chapters: [1],
      };
      setUser(demoUser);
      setProfile(demoProfile);
      localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify({ ...demoProfile, email }));
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName.trim() || email.split('@')[0],
          },
        },
      });

      if (error) return { error };

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email);

        // Déclencher la notification d'inscription de membre
        triggerEmailNotification({
          type: 'new_member',
          customData: {
            display_name: displayName.trim() || email.split('@')[0],
            email: email
          }
        }).catch(e => console.warn('Notification inscription background:', e));
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Sign Out
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem(LOCAL_STORAGE_GUEST_KEY);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // Update profile
  const updateProfile = async (updates: { display_name?: string; avatar_url?: string }) => {
    if (!profile) return { error: new Error('Non connecté') };

    if (!isSupabaseConfigured) {
      const updated: UserProfile = { ...profile, ...updates };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify({ ...updated, email: user?.email }));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) return { error };

      setProfile(prev => prev ? ({ ...prev, ...updates }) : null);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Toggle chapter bookmark
  const toggleBookmarkChapter = async (chapterNum: number) => {
    if (!profile) return;
    const currentBookmarks = profile.bookmarked_chapters || [];
    const updated = currentBookmarks.includes(chapterNum)
      ? currentBookmarks.filter(c => c !== chapterNum)
      : [...currentBookmarks, chapterNum].sort((a, b) => a - b);

    setProfile({ ...profile, bookmarked_chapters: updated });

    if (isSupabaseConfigured) {
      await supabase
        .from('profiles')
        .update({ bookmarked_chapters: updated })
        .eq('id', profile.id);
    } else {
      localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify({ ...profile, bookmarked_chapters: updated }));
    }
  };

  // Toggle saved station
  const toggleSaveStation = async (stationId: string) => {
    if (!profile) return;
    const currentStations = profile.saved_stations || [];
    const updated = currentStations.includes(stationId)
      ? currentStations.filter(s => s !== stationId)
      : [...currentStations, stationId];

    setProfile({ ...profile, saved_stations: updated });

    if (isSupabaseConfigured) {
      await supabase
        .from('profiles')
        .update({ saved_stations: updated })
        .eq('id', profile.id);
    } else {
      localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify({ ...profile, saved_stations: updated }));
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateProfile,
        toggleBookmarkChapter,
        toggleSaveStation,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
