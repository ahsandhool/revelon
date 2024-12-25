import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [subsResponse, withdrawalsResponse] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('*, profiles(username)')
          .eq('status', 'pending'),
        supabase
          .from('withdrawals')
          .select('*, profiles(username)')
          .eq('status', 'pending'),
      ]);

      if (subsResponse.data) setSubscriptions(subsResponse.data);
      if (withdrawalsResponse.data) setWithdrawals(withdrawalsResponse.data);
    } catch ( withdrawalsResponse.data) setWithdrawals(withdrawalsResponse.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionAction = async (id: string, status: 'active' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status,
          starts_at: status === 'active' ? new Date().toISOString() : null,
          expires_at: status === 'active' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      if (status === 'active') {
        const subscription = subscriptions.find((s: any) => s.id === id);
        const speedMultiplier = {
          basic: 2,
          pro: 5,
          elite: 10
        }[subscription.package_type] || 1;

        await supabase
          .from('profiles')
          .update({ mining_speed: speedMultiplier })
          .eq('id', subscription.user_id);
      }

      toast.success(`Subscription ${status}`);
      loadAdminData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleWithdrawalAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Withdrawal ${status}`);
      loadAdminData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Pending Subscriptions</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((sub: any) => (
                  <tr key={sub.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{sub.profiles.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{sub.package_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleSubscriptionAction(sub.id, 'active')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleSubscriptionAction(sub.id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Pending Withdrawals</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawals.map((withdrawal: any) => (
                  <tr key={withdrawal.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{withdrawal.profiles.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{withdrawal.amount} coins</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{withdrawal.payment_method}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleWithdrawalAction(withdrawal.id, 'approved')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleWithdrawalAction(withdrawal.id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;