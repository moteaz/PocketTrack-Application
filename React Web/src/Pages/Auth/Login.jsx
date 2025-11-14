import React, { useState } from "react";
import AuthLayout from "../../Components/layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { validateEmail } from "../../Utils/Helper";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPathes";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const handleLogin = async () => {
    // Prevent default browser behavior
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true); // Set loading to true while the request is in progress

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
      },{
        validateStatus: (status) => status < 500, // Treat status < 500 as success (even 400, 401, etc.)
      });

      setLoading(false); // Stop loading when the API request completes

      if (response.status === 200) {
        const { token } = response.data; // The Problem Is HERE user is undefined
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else{
        setError(response.data.message)
      }
    }  catch (error) {
      setLoading(false);
      // Extract API error message
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Ensures loading stops even if an error occurs
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[80%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-1 mb-6">
          Please enter your details to log in
        </p>

        {/* Form */}
        <div className="flex flex-col gap-4"> 
          <div className="relative">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-transparent"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className={`absolute left-3 top-[-10px] text-xs text-violet-500 bg-white px-1 transition-all
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base
              peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-violet-500`}
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              id="password"
              className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-transparent"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className={`absolute left-3 top-[-10px] text-xs text-violet-500 bg-white px-1 transition-all
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base
              peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-violet-500`}
            >
              Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-violet-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="button" // Prevent form submission behavior
            onClick={handleLogin} // Directly trigger login function
            className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-400 hover:text-violet-700 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <p className="text-sm text-gray-900">
            Don't have an account?{" "}
            <Link to="/signup" className="text-violet-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
