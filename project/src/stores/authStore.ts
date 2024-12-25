import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any | null;
  setUser: (user: any) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  setUser: (user) => set({ 
    isAuthenticated: !!user, 
    user,
    isAdmin: user?.email === 'sniperdhool@gmail.com'
  }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null, isAdmin: false });
  },
}));