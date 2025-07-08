import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Cookies from "js-cookie";
import MessageBar from "./messageBar.jsx";
import EmailConfirmationModal from "./EmailConfirmationModal";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgContent, setMsgContent] = useState("");
  const [msgSeverity, setMsgSeverity] = useState("error");
  const [showModal, setShowModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const schema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitButton = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        formData
      );
      
      const { user, token } = response.data;
      
      console.log("Login response:", user.isEmailVerified, token);
      
      if (!token || !user.isEmailVerified) {
        await axios.post("http://localhost:3000/confirmemail/send", {
          email: formData.email,
        });
        setPendingEmail(formData.email);
        setShowModal(true);
        return;
      }
      
      Cookies.set("token", token);
      toast.success("Login successful!");
      setUser(user);
      setLoading(true);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 403) {
        toast.info("Please verify your email first. We've resent the code.");
        await axios.post("http://localhost:3000/confirmemail/send", {
          email: formData.email,
        });
        setPendingEmail(formData.email);
        setShowModal(true);
      } else {
        console.error("Login error:", error);
        const msg = error.response?.data?.message || "Login failed";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[40%] bg-white p-8 shadow-xl rounded-xl border border-gray-100">
        {/* MessageBar */}
        <MessageBar
          message={msgContent}
          severity={msgSeverity}
          open={msgOpen}
          setOpen={setMsgOpen}
        />
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit(submitButton)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
          <Link  to="/forgotpassword"  > <p className="flex justify-center mt-2 mb-2 text-blue-400 hover:text-blue-700">Forgot Password?</p></Link>
          <span className="flex justify-center">OR</span>
          {/* <GoogleLoginBtn label="Continue with Google" /> */}
        </form>

        <NavLink to={"/signup"}>
          <span className="flex justify-center mt-2 text-blue-400 hover:text-blue-700">
            Don't have an account? Signup
          </span>
        </NavLink>
      </div>

      {showModal && (
        <EmailConfirmationModal
          email={pendingEmail}
          onVerified={() => {
            setShowModal(false);
            toast.success("Email verified! You can now log in.");
          }}
        />
      )}
    </div>
  );
}
