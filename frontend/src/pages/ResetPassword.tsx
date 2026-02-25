import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const backendUrl = "https://backend-foarmer-app.onrender.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post(
        backendUrl + `/api/user/reset-password/${token}`,
        { password }
      );

      if (res.data.success) {
        toast.success("Password reset successful");
        navigate("/login");
      } else {
        setError(res.data.message);
      }
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message || "Invalid or expired token");
  } else {
    setError("Something went wrong");
  }
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full py-3 px-3 border rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;