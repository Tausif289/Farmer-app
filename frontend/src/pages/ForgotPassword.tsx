import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const backendUrl = "https://backend-foarmer-app.onrender.com";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            const res = await axios.post(
                backendUrl + "/api/user/forgot-password",
                { email }
            );

            if (res.data.success) {
                toast.success("Reset link sent to your email");
                navigate("/login");
            } else {
                setError(res.data.message);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Something went wrong");
            } else {
                setError("Something went wrong");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Forgot Password
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-4">
                        <Mail className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-3 py-3 border rounded-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 mb-3">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg"
                    >
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;