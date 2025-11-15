import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

function SignupPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateUsername = (v) => {
    if (v.length < 4) return "Username must be at least 4 characters.";
    if (!/^[A-Za-z0-9_]+$/.test(v))
      return "Only letters, numbers, and underscores (_) are allowed.";
    return "";
  };

  const validateEmail = (v) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (v) => {
    if (v.length < 8) return "Password must be at least 8 characters.";
    if (/^\d+$/.test(v)) return "Password cannot be numbers only.";
    return "";
  };

  const handleSignup = async (e) => {

    e.preventDefault();
    e.stopPropagation();

    const uErr = validateUsername(username);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    if (uErr || eErr || pErr) {
      if (uErr) setErrorMessage(uErr);
      else if (eErr) setErrorMessage(eErr);
      else if (pErr) setErrorMessage(pErr);

      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await signup(username, name, email, password);

      setSuccessMessage("Account created successfully!");
      setTimeout(() => navigate("/login"), 900);

      setUsername("");
      setName("");
      setEmail("");
      setPassword("");
      
    } catch (error) {
      setErrorMessage(
        error?.data?.detail || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        w-screen h-screen flex flex-col items-center justify-center
        bg-[#0f0f11] text-gray-200 px-4
        animate-[fadeIn_0.4s_ease-out]
      "
    >
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2 tracking-wide">Create Account</h1>
      <p className="text-gray-400 mb-10 text-sm">Join our service</p>

      {/* Error or Success Message */}
      {errorMessage && (
        <div
          className="mb-4 text-red-400 text-sm text-center animate-[fadeIn_0.3s_ease]"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          className="mb-4 text-green-400 text-sm text-center animate-[fadeIn_0.3s_ease]"
        >
          {successMessage}
        </div>
      )}

      {/* Form Card */}
      <div
        className="
          backdrop-blur-md 
          bg-[#1b1b1d]/70 
          border border-gray-700/40 
          rounded-3xl 
          p-8 w-full max-w-md
          shadow-2xl
          transition
        "
      >
        {/* Username */}
        <div className="mb-5">
          <label className="text-sm text-gray-400">Account ID</label>
          <input
            type="text"
            placeholder="4–30 characters, letters/numbers only"
            className="
              w-full mt-2 px-4 py-2 rounded-lg
              bg-[#0f0f11] border border-gray-700
              focus:border-blue-600 outline-none 
              text-gray-200 placeholder-gray-500
              transition
            "
            value={username}
            onChange={(e) => {
                setUsername(e.target.value)
                setErrorMessage(validateUsername(e.target.value));
              }
            }
          />
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="text-sm text-gray-400">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="
              w-full mt-2 px-4 py-2 rounded-lg
              bg-[#0f0f11] border border-gray-700
              focus:border-blue-600 outline-none 
              text-gray-200
              transition
            "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="text-sm text-gray-400">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="
              w-full mt-2 px-4 py-2 rounded-lg
              bg-[#0f0f11] border border-gray-700
              focus:border-blue-600 outline-none 
              text-gray-200
              transition
            "
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage(validateEmail(e.target.value));
            }}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-400">Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
            className="
              w-full mt-2 px-4 py-2 rounded-lg
              bg-[#0f0f11] border border-gray-700
              focus:border-blue-600 outline-none 
              text-gray-200 placeholder-gray-500
              transition
            "
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage(validatePassword(e.target.value));
            }}
          />
        </div>

        {/* Signup button */}
        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="
            w-full py-3 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-white text-sm font-semibold
            transition disabled:opacity-50
          "
        >
          {isLoading ? "Processing..." : "Sign Up"}
        </button>

        {/* Already have an account */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
