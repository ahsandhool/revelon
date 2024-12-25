import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Users, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Revelon Mining
          </h1>
          <p className="text-xl mb-12 text-indigo-200">
            Start mining coins today and earn rewards with our innovative platform
          </p>
          <Link
            to="/signup"
            className="bg-yellow-500 text-black px-8 py-4 rounded-lg text-xl font-semibold hover:bg-yellow-400 transition-colors"
          >
            Start Mining Now
          </Link>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-indigo-800 p-8 rounded-xl">
            <Coins className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mine Coins</h3>
            <p className="text-indigo-200">
              Start mining coins instantly with our easy-to-use platform
            </p>
          </div>
          <div className="bg-indigo-800 p-8 rounded-xl">
            <Zap className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Boost Mining Speed</h3>
            <p className="text-indigo-200">
              Upgrade your mining speed with our subscription packages
            </p>
          </div>
          <div className="bg-indigo-800 p-8 rounded-xl">
            <Users className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Refer Friends</h3>
            <p className="text-indigo-200">
              Earn bonus coins by inviting friends to join Revelon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;