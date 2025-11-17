import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const goMain = () => navigate("/main", { replace: true });

  const validateUsername = (v) => {
    if (!v.trim())
      return "Please enter a AccountID.";
  };

  const validatePassword = (v) => {
    if (!v.trim())
      return "Please enter a Password.";
  };

  const handleLogin = async (e) => {
    

    e.preventDefault();
    e.stopPropagation();

    const uErr = validateUsername(username);
    const pErr = validatePassword(password);

    if (uErr || pErr) {
      if (uErr) setErrorMessage(uErr);
      else if (pErr) setErrorMessage(pErr);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await login(username, password);

      setSuccessMessage("Hello! Login successfully!!");
      setTimeout(() => navigate("/main"), 900);
      setusername("");
      setPassword("");

    } catch (error) {
      setErrorMessage(
        error?.data?.detail || "Login fail."
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

      {/* Title - 클릭하면 main으로 이동 */}
      <h1
        onClick={goMain}
        className="
          text-3xl font-bold mb-2 tracking-wide
          cursor-pointer
          hover:text-gray-300
          transition
        "
      >
        Welcome Back
      </h1>

      <p className="text-gray-400 mb-10 text-sm">
        Log in to continue
      </p>

      {/* Error or Success */}
      {errorMessage && (
        <div className="mb-4 text-red-400 text-sm text-center">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 text-green-400 text-sm text-center">
          {successMessage}
        </div>
      )}

      {/* Form */}
      <div className="
        bg-[#18181b] border border-gray-800 
        rounded-2xl p-8 w-full max-w-md shadow-xl
      ">

        {/* username */}
        <div className="mb-5">
          <label className="text-sm text-gray-400">AccountID</label>
          <input
            type="email"
            placeholder="Enter your Account ID"
            className="
              w-full mt-2 px-4 py-2 rounded-lg
              bg-[#0f0f11] border border-gray-700
              focus:border-blue-600 outline-none
              text-gray-200
              transition
            "
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-400">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="
              w-full mt-2 px-4 py-2 rounded-lg
              bg-[#0f0f11] border border-gray-700
              focus:border-blue-600 outline-none
              text-gray-200
              transition
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          disabled={isLoading}
          onClick={handleLogin}
          className={`
            w-full py-3 rounded-xl font-semibold text-sm text-white transition
            ${isLoading 
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {isLoading ? "Processing..." : "Log In"}
        </button>

        {/* Sub links */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <button
            onClick={() => navigate("/forgot-password")}
            className="hover:underline hover:text-gray-300"
          >
            Forgot Password?
          </button>
        </div>

        <div className="mt-2 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
