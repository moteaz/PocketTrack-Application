import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../Context/UserContext";
import DashboardLayout from "../../Components/layouts/DashboardLayout";
import ProfilePictureSelector from "../../Components/inputs/ProfilePictureSelector";
import { API_PATHS } from "../../Utils/apiPathes";
import axiosInstance from "../../Utils/axiosInstance";
import UserPic from "../../assets/images/User-avatar.svg.png";
import { useUserAuth } from "../../Hooks/useUserAuth";
import { 
  Eye, EyeOff, User, Mail, Lock, CheckCircle, 
  AlertCircle, Loader2, Camera, X, Save
} from "lucide-react";

const EditProfile = () => {
  useUserAuth();
  const { user, updateUser } = useContext(UserContext);
  const [profilePic, setProfilePic] = useState();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    if (user) {
      setProfilePic(user.profile_pic || null);
      setFullName(user.fullname || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    // Track if form has been modified
    if (user) {
      const isModified = 
        fullName !== (user.fullname || "") || 
        email !== (user.email || "") || 
        password !== "" || 
        (profilePic !== user.profile_pic && profilePic !== null);
      
      setFormTouched(isModified);
    }
  }, [fullName, email, password, profilePic, user]);

  const handleImageChange = (file) => {
    setProfilePic(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (password && password.length < 8) {
      setError("Password should be at least 8 characters long.");
      setLoading(false);
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("fullname", fullName);
    formData.append("email", email);
    if (password.trim() !== "") {
      formData.append("password", password);
    }
    if (profilePic && profilePic !== UserPic && profilePic instanceof File) {
      formData.append("profile_pic", profilePic);
    }
    
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200) {
        updateUser(response.data.user);
        setError('');
        setSuccessMessage("Your profile has been updated successfully!");
        setPassword("");
        setFormTouched(false);
      } else if (response.status === 400) {
        setSuccessMessage("");
        setError(response.data.message || "Invalid data provided.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      if (error.response) {
        setError(error.response.data.message || "Server error occurred.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfilePic(user.profile_pic || null);
      setFullName(user.fullname || "");
      setEmail(user.email || "");
      setPassword("");
      setError("");
      setSuccessMessage("");
      setFormTouched(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Edit Profile">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M190 100C190 149.706 149.706 190 100 190C50.2944 190 10 149.706 10 100C10 50.2944 50.2944 10 100 10C149.706 10 190 50.2944 190 100Z" stroke="white" strokeWidth="20"/>
              <path d="M66 100C66 80.67 81.67 65 101 65C120.33 65 136 80.67 136 100C136 119.33 120.33 135 101 135C81.67 135 66 119.33 66 100Z" stroke="white" strokeWidth="12"/>
              <path d="M136 146L156 166" stroke="white" strokeWidth="12" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Edit Your Profile</h1>
            <p className="text-violet-100 text-lg">Update your information and personalize your account</p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-2 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
          
          <div className="p-8">
            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Profile Picture Section - Horizontal Layout */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-gray-50 p-6 rounded-xl">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center">
                    {user && user.profile_pic ? (
                      <img
                        src={`http://localhost:5000${user.profile_pic}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={72} className="text-indigo-300" />
                    )}
                  </div>
                  <div className="absolute bottom-3 right-1">
                    <label htmlFor="profile-upload" className="cursor-pointer">
                      <div className="bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-all">
                        <Camera size={18} />
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Profile Info and Selector */}
                <div className="flex flex-col justify-center md:pt-3 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{user?.fullname || "Your Name"}</h3>
                  <p className="text-gray-500 mb-4">{user?.email || "your.email@example.com"}</p>
                  
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <ProfilePictureSelector 
                      image={profilePic} 
                      setImage={setProfilePic} 
                      onChange={handleImageChange} 
                    />
                    {profilePic !== user?.profile_pic && profilePic && (
                      <button
                        type="button"
                        onClick={() => setProfilePic(user?.profile_pic || null)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <X size={14} />
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 p-3.5 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 p-3.5 transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 p-3.5 transition-all"
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400 hover:text-indigo-500" />
                      ) : (
                        <Eye size={18} className="text-gray-400 hover:text-indigo-500" />
                      )}
                    </button>
                  </div>
                  {password && password.length > 0 && password.length < 8 && (
                    <p className="text-amber-600 text-xs flex items-center mt-2">
                      <AlertCircle size={14} className="mr-1" />
                      Password should be at least 8 characters long
                    </p>
                  )}
                </div>
              </div>

              {/* Feedback Messages */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg flex items-start">
                  <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg flex items-start">
                  <CheckCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                  <p>{successMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading || !formTouched}
                  className={`flex-1 flex justify-center items-center gap-3 py-3.5 px-4 rounded-xl text-white font-medium shadow-sm ${
                    formTouched
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-md hover:from-violet-500 hover:to-indigo-500"
                      : "bg-gray-300 cursor-not-allowed"
                  } transition-all duration-300`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading || !formTouched}
                  className={`flex-1 py-3.5 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium flex justify-center items-center gap-3 ${
                    formTouched && !loading
                      ? "hover:bg-gray-50 hover:border-gray-400"
                      : "opacity-50 cursor-not-allowed"
                  } transition-all duration-300`}
                >
                  <X size={20} />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProfile;