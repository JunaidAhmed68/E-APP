import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [reset, setReset] = useState(false);
  const [loading, setLoading]= useState(false)

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axios.post(`https://e-app-delta.vercel.app/auth/reset-password/${token}`, {
        password,
      });
      toast.success(res.data.message);
      setReset(true);

    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
      {reset ? (
        <div className="text-center mt-10 text-green-600 font-medium">
          Password has been reset successfully!
          <p>Please login with your new password , Thank you </p>
        </div>
      ) : (
        <div className="max-w-sm mx-auto mt-10">
          <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Reset Password
          </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
