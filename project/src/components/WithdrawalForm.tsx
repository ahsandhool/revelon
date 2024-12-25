import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useMiningStore } from '../stores/miningStore';
import toast from 'react-hot-toast';

const WithdrawalForm = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const { coins, updateCoins } = useMiningStore();

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount < 10) {
      toast.error('Minimum withdrawal amount is 10 coins');
      return;
    }

    if (withdrawAmount > coins) {
      toast.error('Insufficient coins');
      return;
    }

    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('withdrawals').insert([
        {
          user_id: user.id,
          amount: withdrawAmount,
          payment_method: paymentMethod,
          payment_details: { address: paymentDetails },
        },
      ]);

      if (error) throw error;

      await updateCoins(coins - withdrawAmount);
      toast.success('Withdrawal request submitted!');
      setAmount('');
      setPaymentMethod('');
      setPaymentDetails('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <DollarSign className="h-12 w-12 text-indigo-600" />
      </div>
      <h3 className="text-xl font-bold text-center mb-6">
        Withdraw Coins
      </h3>
      <form onSubmit={handleWithdraw} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (min. 10 coins)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select payment method</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Details
          </label>
          <input
            type="text"
            value={paymentDetails}
            onChange={(e) => setPaymentDetails(e.target.value)}
            placeholder="Enter your wallet address or PayPal email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit Withdrawal'}
        </button>
      </form>
    </div>
  );
};

export default WithdrawalForm;