import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://e-app-delta.vercel.app/auth/forgot-password",
        { email }
      );
      toast.success(res.data.message);
      setDisableButton(true);
      setTimeout(() => {
        setDisableButton(false);
        setEmail("");
      }, 900000); // 15 minutes in milliseconds
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <form onSubmit={handleForgot} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className={`w-full px-3 py-2 rounded transition ${
            disableButton
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          disabled={disableButton}
        >
          {disableButton ? "Wait 15 minutes " : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
