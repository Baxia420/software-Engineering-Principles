import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  logout: () => {},
  refreshProfile: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile(userId) {
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('profile fetch timeout')), 5000)
      );
      const query = supabase.from('profiles').select('*').eq('id', userId).single();
      const { data } = await Promise.race([query, timeout]);
      if (data) {
        setProfile(data);
        localStorage.setItem('role', data.role || 'student');
      }
    } catch (err) {
      console.error('Error fetching profile in AuthProvider:', err);
    }
  }

  useEffect(() => {
    let active = true;

    // Safety timeout to prevent infinite spinner if auth hangs
    const safetyTimeout = setTimeout(() => {
      if (active && loading) {
        console.warn('Auth check timed out, resolving loading state');
        setLoading(false);
      }
    }, 4000);

    async function initializeAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          if (active) {
            setUser(session.user);
            await refreshProfile(session.user.id);
          }
        } else {
          if (active) {
            setUser(null);
            setProfile(null);
            localStorage.removeItem('role');
          }
        }
      } catch (err) {
        console.error('Failed to get session:', err);
      } finally {
        if (active) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      // INITIAL_SESSION is handled by initializeAuth — skip it here to avoid
      // a race where this handler's setLoading(false) never fires if refreshProfile stalls
      if (event === 'INITIAL_SESSION') return;
      if (session?.user) {
        setUser(session.user);
        await refreshProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('role');
      }
      setLoading(false);
    });

    return () => {
      active = false;
      clearTimeout(safetyTimeout);
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('role');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
