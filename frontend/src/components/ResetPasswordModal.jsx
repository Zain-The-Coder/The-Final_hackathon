import React, { useState } from 'react';
import { Mail, KeyRound, ArrowRight, Loader2, X } from 'lucide-react';
import api from '../api/axios';

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/send-reset-otp', { email });
      if (data.success) {
        setStep(2);
        setMessage('OTP sent to your email.');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
      if (data.success) {
        setMessage('Password reset successfully! You can now log in.');
        setTimeout(() => {
          onClose();
          setStep(1);
          setEmail('');
          setOtp('');
          setNewPassword('');
          setMessage('');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-charcoal/20 hover:text-charcoal transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-10 space-y-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-display font-bold tracking-tight">
              {step === 1 ? 'Reset Password' : 'Verify Identity'}
            </h3>
            <p className="text-muted text-[14px] font-medium leading-relaxed">
              {step === 1 
                ? 'Enter your email address and we will send you an OTP to reset your password.' 
                : 'Enter the 6-digit code sent to your email and choose a new secure password.'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {message && (
            <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-xs font-bold animate-in slide-in-from-top-2">
              {message}
            </div>
          )}

          <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@helplytics.ai"
                    className="w-full bg-[#fbf9f5] border border-charcoal/5 focus:border-secondary/40 rounded-2xl p-4 pl-12 outline-none font-medium placeholder:text-charcoal/30"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted px-1">OTP (6 Digits)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                    <input 
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-[#fbf9f5] border border-charcoal/5 focus:border-secondary/40 rounded-2xl p-4 pl-12 outline-none font-medium tracking-widest"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted px-1">New Password</label>
                  <div className="relative">
                    <input 
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#fbf9f5] border border-charcoal/5 focus:border-secondary/40 rounded-2xl p-4 outline-none font-medium tracking-widest"
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-charcoal text-white py-4 rounded-full font-bold text-[14px] hover:bg-charcoal/90 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  {step === 1 ? 'Send Reset OTP' : 'Reset Password'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
