import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token); // ✅ store JWT
      toast.success('Login successful!');
      router.push('/notes'); // ✅ redirect to notes page
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
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
            onClick={handleLogin}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 font-semibold"
          >
            Login
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <span
            className="text-purple-600 hover:underline cursor-pointer"
            onClick={() => router.push('/auth/signup')}
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
}
