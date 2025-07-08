import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function EmailConfirmationModal({ email, onVerified }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 min = 300s
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown for expiry
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const verifyCode = async () => {
    try {
      const res = await axios.post("https://e-app-delta.vercel.app/confirmemail/verify", {
        email,
        code,
      });
      console.log("Sending to backend:", { email, code });
      toast.success(res.data.message || "Email verified!");
      onVerified();
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      toast.error(error);
    }
  };

  const resendCode = async () => {
    try {
      await axios.post("https://e-app-delta.vercel.app/confirmemail/send", { email });
      toast.success("Verification code resent!");
      setTimeLeft(300);
      setCanResend(false);
      setResendCooldown(30); // 30 seconds cooldown
    } catch (err) {
      toast.error("Failed to resend code");
    }
  };

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
      <div className="bg-white p-6 rounded-lg w-96 space-y-3 shadow-xl">
        <h3 className="text-lg font-semibold text-center text-blue-700">Email Verification</h3>
        <p className="text-sm text-gray-600 text-center">
          A 6-digit code was sent to <strong>{email}</strong>
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Enter code"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={verifyCode}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Verify
        </button>

        <div className="text-center text-sm text-gray-500">
          Code expires in: <strong>{formatTime(timeLeft)}</strong>
        </div>

        <div className="text-center mt-2">
          <button
            onClick={resendCode}
            disabled={!canResend}
            className={`text-blue-600 font-medium hover:underline ${
              !canResend && "opacity-50 cursor-not-allowed"
            }`}
          >
            Resend Code {resendCooldown > 0 && `(${resendCooldown}s)`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmationModal;