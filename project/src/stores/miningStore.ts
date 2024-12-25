import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface MiningState {
  isMining: boolean;
  coins: number;
  miningSpeed: number;
  startMining: () => void;
  stopMining: () => void;
  updateCoins: (coins: number) => Promise<void>;
  setMiningSpeed: (speed: number) => void;
}

export const useMiningStore = create<MiningState>((set, get) => ({
  isMining: false,
  coins: 0,
  miningSpeed: 1,
  startMining: () => set({ isMining: true }),
  stopMining: () => set({ isMining: false }),
  updateCoins: async (coins) => {
    set({ coins });
    const { error } = await supabase
      .from('profiles')
      .update({ coins })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);
    
    if (error) console.error('Error updating coins:', error);
  },
  setMiningSpeed: (speed) => set({ miningSpeed: speed }),
}));