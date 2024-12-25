import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useMiningStore } from '../stores/miningStore';
import MiningInterface from '../components/MiningInterface';
import SubscriptionPackages from '../components/SubscriptionPackages';
import WithdrawalForm from '../components/WithdrawalForm';
import ReferralSystem from '../components/ReferralSystem';

const Dashboard = () => {
  const { coins, setMiningSpeed } = useMiningStore();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('coins, mining_speed')
        .eq('id', user.id)
        .single();

      if (profile) {
        useMiningStore.setState({ coins: profile.coins });
        setMiningSpeed(profile.mining_speed);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-8">
        <MiningInterface />
        <div>
          <h2 className="text-2xl font-bold mb-4">Upgrade Mining Speed</h2>
          <SubscriptionPackages />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Withdraw Coins</h2>
            <WithdrawalForm />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Referral Program</h2>
            <ReferralSystem />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;