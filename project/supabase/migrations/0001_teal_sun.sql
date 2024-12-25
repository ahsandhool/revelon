/*
  # Initial Schema Setup for Revelon Mining Platform

  1. New Tables
    - profiles
      - id (uuid, primary key)
      - username (text)
      - email (text)
      - coins (numeric)
      - mining_speed (numeric)
      - referral_code (text)
      - referred_by (uuid)
      - created_at (timestamp)
      
    - subscriptions
      - id (uuid, primary key)
      - user_id (uuid)
      - package_type (text)
      - status (text)
      - payment_proof (text)
      - starts_at (timestamp)
      - expires_at (timestamp)
      - created_at (timestamp)
      
    - withdrawals
      - id (uuid, primary key)
      - user_id (uuid)
      - amount (numeric)
      - payment_method (text)
      - status (text)
      - payment_details (jsonb)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  coins numeric DEFAULT 0,
  mining_speed numeric DEFAULT 1,
  referral_code text UNIQUE,
  referred_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  package_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_proof text,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'expired', 'rejected'))
);

-- Create withdrawals table
CREATE TABLE withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  amount numeric NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can read their own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Withdrawals policies
CREATE POLICY "Users can read their own withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own withdrawals"
  ON withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create admin role
CREATE ROLE admin;

-- Admin policies
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Admins can read all subscriptions"
  ON subscriptions FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Admins can update all subscriptions"
  ON subscriptions FOR UPDATE
  TO admin
  USING (true);

CREATE POLICY "Admins can read all withdrawals"
  ON withdrawals FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Admins can update all withdrawals"
  ON withdrawals FOR UPDATE
  TO admin
  USING (true);