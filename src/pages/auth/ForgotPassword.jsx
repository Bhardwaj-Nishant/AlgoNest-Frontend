import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/auth/InputField';
import PasswordField from '../../components/auth/PasswordField';
import LoadingButton from '../../components/auth/LoadingButton';
import Footer from '../../components/Footer';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP.');
      }

      setEmailSent(true);
    } catch (err) {
      setEmailError(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP.');
      }

      setOtpVerified(true);
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetSuccess(false);

    if (newPassword !== confirmPassword) {
      setOtpError('Passwords do not match.');
      setResetLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setResetSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 No illustration – only the form area */}
      <AuthLayout>
        <AuthHeader
          badge="FORGOT PASSWORD"
          title="Reset your password"
          description={
            !emailSent
              ? 'Enter your email to receive an OTP'
              : !otpVerified
              ? `We sent a 6-digit code to ${email}`
              : 'Create a new password'
          }
        />

        {/* Error / Success messages */}
        {(emailError || otpError) && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {emailError || otpError}
          </div>
        )}
        {resetSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle size={18} />
            Password reset successfully! Redirecting to login...
          </div>
        )}

        {/* Step 1: Email */}
        {!emailSent && (
          <form onSubmit={handleSendOtp}>
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} />}
              required
            />
            <LoadingButton loading={emailLoading} loadingText="Sending OTP...">
              Send OTP
            </LoadingButton>
          </form>
        )}

        {/* Step 2: OTP */}
        {emailSent && !otpVerified && (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700">OTP Code</label>
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
                Verify OTP
              </LoadingButton>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-sm text-[#485E73] hover:underline"
                disabled={emailLoading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {otpVerified && (
          <form onSubmit={handleResetPassword}>
            <PasswordField
              label="New Password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <LoadingButton loading={resetLoading} loadingText="Resetting...">
              Reset Password
            </LoadingButton>
          </form>
        )}

        <p className="mt-8 text-center text-slate-600">
          <Link to="/login" className="font-semibold text-[#485E73] hover:underline">
            Back to Login
          </Link>
        </p>
      </AuthLayout>
      <Footer />
    </>
  );
}

export default ForgotPassword;