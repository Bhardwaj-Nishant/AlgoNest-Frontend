import React, { useState } from 'react';
import { User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthIllustration from '../../components/auth/AuthIllustration';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/auth/InputField';
import PasswordField from '../../components/auth/PasswordField';
import LoadingButton from '../../components/auth/LoadingButton';
import GoogleButton from '../../components/auth/GoogleButton';
import Divider from '../../components/auth/Divider';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(password);
  };

  const getPasswordRules = (password) => ({
    minLength: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  // Step 1: Signup -> Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long, include one uppercase letter, one number, and one special character.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // ✅ NEW: Check if email already exists (409 Conflict)
      if (response.status === 409) {
        setError('This email is already registered. Please login.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP.');
      }

      setShowOtp(true);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let userMessage = data.message || 'Verification failed. Please try again.';
        if (userMessage.toLowerCase().includes('expired')) {
          userMessage = 'The OTP has expired. Please request a new one.';
        } else if (userMessage.toLowerCase().includes('invalid')) {
          userMessage = 'Incorrect OTP. Please check the code and try again.';
        }
        throw new Error(userMessage);
      }

      // ✅ Account created successfully – now auto-login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        // If auto-login fails, still show success and redirect to login manually
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        return;
      }

      // Auto-login succeeded – go to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/dashboard' },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <AuthLayout leftContent={<AuthIllustration />}>
        <AuthHeader
          badge={showOtp ? 'VERIFY YOUR EMAIL' : 'WELCOME 👋'}
          title={showOtp ? 'Enter the OTP' : 'Create your account'}
          description={
            showOtp
              ? `We sent a 6-digit code to ${formData.email}`
              : 'Join AlgoNest and start tracking your coding journey.'
          }
        />

        {success && !error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle size={18} />
            {showOtp ? 'Otp Sent! Enter to Verify...' : 'OTP sent successfully!'}
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {!showOtp ? (
          <form onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              icon={<User size={20} />}
              required
            />
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
            <div className="relative mb-4">
              <PasswordField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
              />

              {/* Rules box: absolute below the password field to avoid shifting layout */}
              {(() => {
                const rules = getPasswordRules(formData.password);
                const allSatisfied = Object.values(rules).every(Boolean);
                const showBox = passwordFocused || (formData.password.length > 0 && !allSatisfied);

                return showBox ? (
                  <div
                    className="absolute left-0 top-full z-10 mt-2 w-full rounded-md border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 ease-out"
                    role="status"
                    aria-live="polite"
                  >
                    <p className="mb-2 text-sm font-medium text-slate-700">Password must contain:</p>
                    <ul className="space-y-1 text-sm">
                      <li className={rules.minLength ? 'text-green-600' : 'text-red-500'}>
                        {rules.minLength ? '✓' : '•'} At least 6 characters
                      </li>
                      <li className={rules.uppercase ? 'text-green-600' : 'text-red-500'}>
                        {rules.uppercase ? '✓' : '•'} At least one uppercase letter
                      </li>
                      <li className={rules.number ? 'text-green-600' : 'text-red-500'}>
                        {rules.number ? '✓' : '•'} At least one number
                      </li>
                      <li className={rules.special ? 'text-green-600' : 'text-red-500'}>
                        {rules.special ? '✓' : '•'} At least one special character
                      </li>
                    </ul>
                  </div>
                ) : null;
              })()}
            </div>
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <LoadingButton loading={loading} loadingText="Sending OTP...">
              Create Account
            </LoadingButton>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700">
                OTP Code
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="_ _ _ _ _ _"
                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 text-lg text-center tracking-widest shadow-sm focus:border-[#485E73] focus:ring-[#485E73] focus:outline-none"
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                Enter the 6-digit code sent to your email. It expires in 5 minutes.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <LoadingButton loading={otpLoading} loadingText="Verifying...">
                Verify & Create Account
              </LoadingButton>
              <button
                type="button"
                onClick={handleSubmit}
                className="text-sm text-[#485E73] hover:underline"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {!showOtp && (
          <>
            <Divider text="Continue with" />
            <GoogleButton onClick={handleGoogleSignup} text="Sign up with Google" />
          </>
        )}

        <p className="mt-8 text-center text-slate-600">
          {showOtp ? (
            <>
              Changed your mind?{' '}
              <button
                type="button"
                onClick={() => {
                  setShowOtp(false);
                  setSuccess(false);
                  setError('');
                  setOtp('');
                }}
                className="font-semibold text-[#485E73] hover:underline"
              >
                Go back
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#485E73] hover:underline">
                Sign In
              </Link>
            </>
          )}
        </p>
      </AuthLayout>
      <Footer />
    </>
  );
}

export default Signup;