import React, { useState } from "react";
import AuthLayout from "../../Components/layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../Utils/Helper";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import UserPic from "../../assets/images/User-avatar.svg.png";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPathes";
import ProfilePictureSelector from "../../Components/inputs/ProfilePictureSelector";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    if (password.length < 8) {
      setError("Password should be at least 8 characters long.");
      return;
    }

    setError(""); // Clear any previous errors
    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("fullname", fullName);
    formData.append("email", email);
    formData.append("password", password);

    // If the profile picture exists, append it to the FormData
    if (profilePic && profilePic !== UserPic) {
      formData.append("profile_pic", profilePic);
    }

    try {
      // Send request to the server
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: (status) => status < 500, // Allow all status < 500 as valid
      });
      // Handle response based on status code
      if (response.status === 201) {
        setError('');
        setSuccessMessage('User created successfully!');
        setFullName('');
        setEmail('');
        setPassword('');
        setProfilePic(null);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else if (response.status === 400) {
        setSuccessMessage(""); // Clear success message in case of error
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    
      // Handle different error cases
      if (error.response) {
        console.log("Error Response:", error.response);
        setError(error.response.data.message || "Something went wrong");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from the server. Please try again.");
      } else {
        console.error("Unexpected error:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    
      setSuccessMessage(""); // Clear success message in case of error
    }
    
    setLoading(false); // Reset loading state
  };

  const handleImageChange = (newImage) => {
    setProfilePic(newImage); // Update the profile picture state
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) {
      setError(""); // Clear error when user starts typing
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create An Account</h3>
        <p className="text-xs text-slate-700 mt-1 mb-6">Please enter your details to sign up</p>

        {/* SignUp Form */}
        <form onSubmit={handleSignUp} className="flex flex-col gap-6">
          {/* Profile Picture */}
          <ProfilePictureSelector image={profilePic} setImage={setProfilePic} onChange={handleImageChange} />

          {/* Full Name Input with Floating Label */}
          <div className="relative">
            <input
              value={fullName}
              onChange={handleChange(setFullName)}
              type="text"
              id="fullName"
              className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-transparent"
              placeholder="Full Name"
            />
            <label
              htmlFor="fullName"
              className={`absolute left-3 top-[-10px] text-xs text-violet-500 bg-white px-1 transition-all
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base
              peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-violet-500`}
            >
              Full Name
            </label>
          </div>

          {/* Email Input with Floating Label */}
          <div className="relative">
            <input
              value={email}
              onChange={handleChange(setEmail)}
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

          {/* Password Input with Floating Label */}
          <div className="relative">
            <input
              value={password}
              onChange={handleChange(setPassword)}
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
            >
              {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-400 hover:text-violet-700 transition cursor-pointer"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-sm text-gray-900">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
