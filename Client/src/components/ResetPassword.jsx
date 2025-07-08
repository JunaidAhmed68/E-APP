import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [reset, setReset] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://e-app-delta.vercel.app/auth/reset-password/${token}`, {
        password,
      });
      toast.success(res.data.message);
      setReset(true);
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 sec
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <>
      {reset ? (
        <div className="text-center mt-10 text-green-600 font-medium">
          Password has been reset successfully!
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
            <button className="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition">
              Reset Password
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
