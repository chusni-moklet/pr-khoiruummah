'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Users, UserCheck } from 'lucide-react';
import Link from 'next/link';

type LoginType = 'teacher' | 'admin';

export default function SignInPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<LoginType>('teacher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();

    const result = await signIn(loginType, {
      email: loginType === 'teacher' ? email : undefined,
      username: loginType === 'admin' ? username : undefined,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    if (result?.ok) {
      router.push(loginType === 'admin' ? '/admin/dashboard' : '/teacher/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <GraduationCap className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-600 mt-2">Masuk ke sistem PR SD Online</p>
          </div>

          {/* Switcher */}
          <div className="flex space-x-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginType('teacher');
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                loginType === 'teacher'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Guru
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginType('admin');
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <UserCheck className="w-5 h-5 inline mr-2" />
              Admin
            </button>
          </div>

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {loginType === 'teacher' ? (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="guru@sd.com"
                />
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="admin"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 ${
                  loginType === 'teacher'
                    ? 'focus:ring-blue-500'
                    : 'focus:ring-purple-500'
                }`}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                loginType === 'teacher'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {loginType === 'teacher'
              ? 'Login sebagai guru untuk mengelola tugas dan penilaian'
              : 'Login sebagai admin untuk mengelola sistem'}
          </div>

          <Link
            href="/"
            className="block text-center mt-6 text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
