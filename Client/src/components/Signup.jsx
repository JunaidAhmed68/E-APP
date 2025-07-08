import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import EmailConfirmationModal from "./EmailConfirmationModal.jsx";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Min 3 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .required("Age is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Signup() {
  const [showModal, setShowModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/auth/signup", data);
      toast.success("User registered successfully");

      setRegisteredEmail(data.email);
      await axios.post("http://localhost:3000/confirmemail/send", {
        email: data.email,
      });

      setShowModal(true); // show modal for verification
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[40%] bg-white p-8 shadow-2xl rounded-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <input
              {...register("username")}
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <input
              {...register("age")}
              type="number"
              placeholder="Age"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <NavLink to="/login">
          <span className="flex justify-center mt-2 text-blue-400 hover:text-blue-700">
            Already have an account? Login
          </span>
        </NavLink>
      </div>
      {showModal && (
        <EmailConfirmationModal
          email={registeredEmail}
          onVerified={() => {
            setShowModal(false);
            navigate("/login");
          }}
        />
      )}
    </div>
  );
}
