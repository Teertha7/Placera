import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';
import { ApiResponse, User } from '../../types';
import { LogIn, ShieldAlert, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post<ApiResponse<{ token: string; user: User }>>('/api/auth/login', {
        email: email.trim(),
        password,
      });

      if (res.data.success && res.data.data) {
        const { token, user } = res.data.data;
        login(token, user);
        success(`Welcome back, ${user.firstName}!`);

        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoStudent = () => {
    setEmail('rohan.sharma@placera.edu');
    setPassword('StudentPass#2026!');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@placera.edu');
    setPassword('AdminPlacera#2026!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo to="/" size="lg" showTagline />
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">
          Or{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
            register as a new student
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl border border-slate-200/80 rounded-3xl">
          {isExpired && (
            <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-800 text-xs">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {/* Quick-fill Demo Helper Box */}
          <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo Testing One-Click Fill:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={fillDemoStudent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Demo Student (Rohan)
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
                Placement Officer (Admin)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
