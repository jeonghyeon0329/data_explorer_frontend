import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgot_password } from "../api/auth";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (v) => {
    if (!v.trim())
      return "Please enter a valid email address.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "Please enter a valid email address.";
    return "";
  };

  const handleReset = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const eErr = validateEmail(email);

    if (eErr) {
      if (eErr) setErrorMessage(eErr);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await forgot_password(email);
      setSuccessMessage("Check your email for a password reset link.");
      setTimeout(() => navigate("/login"), 900);
      setEmail("");

    } catch (error) {
      setErrorMessage(
        error?.data?.detail || "Password-reset failed. Please try again."
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="
      w-screen h-screen flex flex-col items-center justify-center
      bg-[#0f0f11] text-gray-200 px-4
      animate-[fadeIn_0.4s_ease-out]
    ">

      <h1 className="text-3xl font-bold mb-2 tracking-wide">Reset Password</h1>
      <p className="text-gray-400 mb-10 text-sm">Enter your email</p>

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

      <div className="
        bg-[#18181b] border border-gray-800 
        rounded-2xl p-8 w-full max-w-md shadow-xl
      ">

        <label className="text-sm text-gray-400">Email</label>
        <input
          type="email"
          className="
            w-full mt-2 px-4 py-2 rounded-lg
            bg-[#0f0f11] border border-gray-700
            focus:border-blue-600 outline-none text-gray-200
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={isLoading}
          className="
            w-full py-3 rounded-xl mt-6
            bg-blue-600 hover:bg-blue-700
            text-white text-sm font-semibold
            transition
          "
        >
          {isLoading ? "Processing..." : "Send Reset Email"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
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

export default ForgotPasswordPage;
