import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { reset_password } from "../api/auth";

function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const uid = params.get("uid");
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!uid || !token) {
      setErrorMessage("Invalid password reset link.");
      return;
    }

    if (password !== confirm) {
      setErrorMessage("Password does not match.");
      return;
    }

    try {
      setIsLoading(true);

      await reset_password(uid, token, password);

      setSuccessMessage("Password has been changed successfully!");
      setTimeout(() => navigate("/login"), 900);
      setPassword("");
      setConfirm("");

    } catch (error) {
      setErrorMessage(
        error?.data?.detail || "Password reset failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
      <div
        className="w-[420px] p-8 rounded-xl border border-gray-700 bg-[#111113] shadow-lg"
        style={{ boxShadow: "0 0 25px rgba(0,0,0,0.7)" }}
      >
        <h2 className="text-2xl font-semibold text-center mb-2">
          Reset Password
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Enter your new password to continue
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

        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className={`w-full mt-6 py-3 rounded-lg font-medium transition-all
            ${isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {isLoading ? "Processing..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
