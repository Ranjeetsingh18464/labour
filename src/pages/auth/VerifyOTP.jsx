import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaPhoneAlt, FaShieldAlt, FaHammer, FaArrowLeft, FaRedo } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const RESEND_COOLDOWN = 30;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOTP, verifyOTP } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const inputRefs = useRef([]);

  const phone = location.state?.phone || '';
  const verificationId = location.state?.verificationId || '';

  useEffect(() => {
    document.title = 'Verify OTP - Labour.com';
    if (!phone) {
      navigate('/login', { replace: true });
    }
  }, [phone, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    setCanResend(true);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    try {
      setVerifying(true);
      await verifyOTP(verificationId, code);
      toast.success('Phone number verified successfully!');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!canResend) return;
    try {
      setSending(true);
      const newVerificationId = await sendOTP(phone, 'recaptcha-container');
      navigate('/verify-otp', { state: { phone, verificationId: newVerificationId }, replace: true });
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setSending(false);
    }
  }, [canResend, phone, sendOTP, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-4">
              <FaHammer className="text-blue-600 dark:text-blue-400" />
              Labour.com
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-blue-600 dark:text-blue-400 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verify OTP</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the 6-digit code sent to
            </p>
            <p className="flex items-center justify-center gap-2 mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              <FaPhoneAlt className="text-blue-600 dark:text-blue-400" size={14} />
              {phone}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                whileFocus={{ scale: 1.05 }}
                className={`
                  w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-white dark:bg-gray-900
                  text-gray-900 dark:text-gray-100 transition-all duration-150
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                  ${digit ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}
                `}
              />
            ))}
          </div>

          <Button fullWidth loading={verifying} onClick={handleVerify}>
            Verify OTP
          </Button>

          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={sending}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 disabled:opacity-50"
              >
                <FaRedo size={12} className={sending ? 'animate-spin' : ''} />
                {sending ? 'Sending...' : 'Resend OTP'}
              </button>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resend code in <span className="font-semibold text-gray-900 dark:text-white">{countdown}s</span>
              </p>
            )}
          </div>

          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center gap-2 mt-6 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 w-full"
          >
            <FaArrowLeft size={12} />
            Back to Login
          </button>
        </div>
      </motion.div>
      <div id="recaptcha-container" />
    </div>
  );
}

function Link({ to, children, className }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)} className={className}>
      {children}
    </button>
  );
}
