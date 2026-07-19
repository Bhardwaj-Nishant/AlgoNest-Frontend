import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../components/auth/AuthLayout';
import LoginIllustration from '../../components/auth/LoginIllustration';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/auth/InputField';
import PasswordField from '../../components/auth/PasswordField';
import LoadingButton from '../../components/auth/LoadingButton';
import GoogleButton from '../../components/auth/GoogleButton';
import Divider from '../../components/auth/Divider';
import Footer from '../../components/Footer';

// Import Supabase client
import { supabase } from '../../lib/supabase';

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user types
    if (error) setError('');
  };

  // ----- Email/Password Login -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Note: Supabase SDK automatically stores the session in localStorage
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw new Error(signInError.message);

      // Success – user is logged in, session is stored
      // The JWT is available via supabase.auth.getSession()
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
      setLoading(false);
    }
    // If successful, the component unmounts before setLoading(false) matters,
    // but we keep it for safety.
    setLoading(false);
  };

  // ----- Google OAuth Login -----
  const handleGoogleSignin = async () => {
    setError('');
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${import.meta.env.VITE_FRONTEND_URL}/dashboard`,
        },
      });
      if (oauthError) throw new Error(oauthError.message);
      // The page will redirect to Google, then back to /dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <AuthLayout leftContent={<LoginIllustration />} reverseOnLarge>
        <AuthHeader
          badge="WELCOME BACK"
          title="Sign in to AlgoNest"
          description="Log in to continue building your coding habits and tracking your progress."
        />

        {/* Error Display */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail size={20} />}
            required
          />

          <PasswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2 text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="h-4 w-4 rounded border-slate-300 text-[#485E73] focus:ring-[#485E73]"
              />
              Remember me
            </label>

            <Link
              to="/signup"
              className="font-semibold text-[#485E73] hover:underline"
            >
              Create an account
            </Link>
          </div>

          <LoadingButton
            loading={loading}
            loadingText="Signing in..."
          >
            Sign In
          </LoadingButton>

          <Link
            to="/forgot-password"
            className="mt-4 block text-center text-sm font-semibold text-[#485E73] hover:underline"
          >
            Forgot your password?
          </Link>
        </form>

        <Divider text="Continue with" />

        <GoogleButton onClick={handleGoogleSignin} text="Sign in with Google" />

        <p className="mt-8 text-center text-slate-600">
          New to AlgoNest?{' '}
          <Link
            to="/signup"
            className="font-semibold text-[#485E73] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </AuthLayout>
      <Footer />
    </>
  );
}

export default Login;
