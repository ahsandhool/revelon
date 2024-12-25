import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const packages = [
  { id: 'basic', name: 'Basic', speed: 2, price: 10 },
  { id: 'pro', name: 'Pro', speed: 5, price: 25 },
  { id: 'elite', name: 'Elite', speed: 10, price: 50 },
];

const SubscriptionPackages = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (packageId: string) => {
    if (!selectedFile) {
      toast.error('Please upload payment proof');
      return;
    }

    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([
          {
            user_id: user.id,
            package_type: packageId,
            payment_proof: fileName,
          },
        ]);

      if (subscriptionError) throw subscriptionError;

      toast.success('Subscription request submitted!');
      setSelectedFile(null);
      setSelectedPackage(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex justify-center mb-4">
            <Zap className="h-12 w-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-center mb-2">
            {pkg.name}
          </h3>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold">{pkg.speed}x</p>
            <p className="text-sm text-gray-500">Mining Speed</p>
          </div>
          <p className="text-center text-2xl font-bold mb-4">
            ${pkg.price}
          </p>
          {selectedPackage === pkg.id ? (
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full"
              />
              <button
                onClick={() => handleSubscribe(pkg.id)}
                disabled={loading || !selectedFile}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Payment Proof'}
              </button>
              <button
                onClick={() => setSelectedPackage(null)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSelectedPackage(pkg.id)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Subscribe
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPackages;