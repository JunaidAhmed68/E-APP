// src/pages/Contact.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaGithub, FaPhoneAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const Contact = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    message: "",
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, message: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: user.username,
      email: user.email,
      message: formData.message,
    };

    try {
      const res = await axios.post("https://e-app-delta.vercel.app/contact", payload);
      toast.success("Message sent successfully!");
      setFormData({ message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      const msg = err.response?.data?.error || "Failed to send message";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
        <p className="text-center text-gray-600 mb-10">
          We'd love to hear from you! Fill out the form or reach us directly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition flex justify-center items-center"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Contact Info */}
          <div className="bg-gray-100 rounded p-6 space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Our Info</h4>
              <p className="text-gray-700">📍 Malir, Karachi</p>
              <p className="text-gray-700">📞 +92 319 0373532</p>
              <p className="text-gray-700">📧 junaidst030@gmail.com</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4 text-blue-600 text-xl">
                <a
                  href="https://www.instagram.com/_junaid9?igsh=dXl1bnA5MHB2YWF6"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.linkedin.com/in/junaid-ahmed-0081a9348/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://github.com/JunaidAhmed68"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub />
                </a>
                <a href="tel:+923190373532">
                  <FaPhoneAlt />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
