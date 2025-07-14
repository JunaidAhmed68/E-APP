import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import EmailConfirmationModal from "./EmailConfirmationModal";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  username: yup.string().required("Username is required").min(3),
  email: yup.string().email("Invalid email").required("Email is required"),
  age: yup.number().positive().integer().required("Age is required"),
  password: yup.string().min(6).required("Password is required"),
});

export default function Signup() {
  const [showModal, setShowModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [pendingUserData, setPendingUserData] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      // Send verification code
      await axios.post("https://e-app-delta.vercel.app/confirmemail/send", {
        email: data.email,
      });

      setRegisteredEmail(data.email);
      setPendingUserData(data);
      setShowModal(true); // open modal to enter code
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      const res = await axios.post("https://e-app-delta.vercel.app/auth/signup", pendingUserData);
      toast.success("Account created successfully!");
      setShowModal(false);
      navigate("/login");
    } catch (err) {
      toast.error("Account creation failed after verification");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[40%] bg-white p-8 shadow-2xl rounded-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input {...register("username")} placeholder="Username" className="input" />
            {errors.username && <p className="error">{errors.username.message}</p>}
          </div>
          <div>
            <input {...register("email")} type="email" placeholder="Email" className="input" />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div>
            <input {...register("age")} type="number" placeholder="Age" className="input" />
            {errors.age && <p className="error">{errors.age.message}</p>}
          </div>
          <div>
            <input {...register("password")} type="password" placeholder="Password" className="input" />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300">
            Sign Up
          </button>
        </form>
        <NavLink to="/login">
          <span className="flex justify-center mt-2 text-blue-400 hover:text-blue-700">
            Already have an account? Login
          </span>
        </NavLink>
      </div>

      {/* Email confirmation modal */}
      {showModal && (
        <EmailConfirmationModal
          email={registeredEmail}
          onVerified={handleVerificationSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
