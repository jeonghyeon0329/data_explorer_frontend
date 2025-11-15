import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");

  const goMain = () => navigate("/main", { replace: true });

  const handleLogin = () => {
    console.log("login", username, password);
    // navigate("/main", { replace: true });
    alert("login success")
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
          onClick={handleLogin}
          className="
            w-full py-3 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-white text-sm font-semibold
            transition
          "
        >
          Log In
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
