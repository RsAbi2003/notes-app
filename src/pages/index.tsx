import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4">
      <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to Notes App 📝</h1>
        <p className="text-lg mb-6">Sign up or log in to start managing your notes with ease.</p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300 font-semibold"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/auth/signup')}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition duration-300 font-semibold"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
