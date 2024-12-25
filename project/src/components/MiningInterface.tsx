import React, { useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { useMiningStore } from '../stores/miningStore';

const MiningInterface = () => {
  const { isMining, coins, miningSpeed, startMining, stopMining, updateCoins } = useMiningStore();
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isMining) {
      intervalRef.current = window.setInterval(() => {
        updateCoins(coins + 0.1 * miningSpeed);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isMining, coins, miningSpeed]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Mining Station</h2>
        <p className="text-4xl font-bold text-indigo-600">
          {coins.toFixed(2)} Coins
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Mining Speed: {miningSpeed}x
        </p>
      </div>
      <button
        onClick={() => isMining ? stopMining() : startMining()}
        className={`w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 ${
          isMining
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-500 hover:bg-green-600'
        } text-white transition-colors`}
      >
        {isMining ? (
          <>
            <Pause className="h-5 w-5" />
            <span>Stop Mining</span>
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            <span>Start Mining</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MiningInterface;