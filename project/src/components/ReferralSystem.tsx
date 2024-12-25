import React, { useState, useEffect } from 'react';
import { Users, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const ReferralSystem = () => {
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (profile) {
        setReferralCode(profile.referral_code);

        const { count } = await supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('referred_by', user.id);

        setReferralCount(count || 0);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <Users className="h-12 w-12 text-indigo-600" />
      </div>
      <h3 className="text-xl font-bold text-center mb-6">
        Invite Friends
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Referral Code
          </label>
          <div className="flex">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={copyReferralLink}
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Referrals</p>
          <p className="text-3xl font-bold text-indigo-600">
            {referralCount}
          </p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-md">
          <p className="text-sm text-indigo-800">
            Earn a 0.2x mining speed boost for each active referral!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;