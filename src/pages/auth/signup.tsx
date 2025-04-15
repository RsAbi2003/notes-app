import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await axios.post('/api/auth/signup', { email, password });
      toast.success('Signup successful! Redirecting to login...');
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Signup</h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleSignup}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 font-semibold"
          >
            Signup
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <span
            className="text-purple-600 hover:underline cursor-pointer"
            onClick={() => router.push('/auth/login')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
