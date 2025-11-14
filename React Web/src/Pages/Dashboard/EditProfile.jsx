import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../Context/UserContext";
import DashboardLayout from "../../Components/layouts/DashboardLayout";
import ProfilePictureSelector from "../../Components/inputs/ProfilePictureSelector";
import { API_PATHS } from "../../Utils/apiPathes";
import axiosInstance from "../../Utils/axiosInstance";
import UserPic from "../../assets/images/User-avatar.svg.png";
import { useUserAuth } from "../../Hooks/useUserAuth";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle, Loader2, Camera } from "lucide-react";

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-violet-800 to-indigo-900 rounded-2xl shadow-xl p-4 text-white mb-7 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M190 100C190 149.706 149.706 190 100 190C50.2944 190 10 149.706 10 100C10 50.2944 50.2944 10 100 10C149.706 10 190 50.2944 190 100Z" stroke="white" strokeWidth="20"/>
              <path d="M66 100C66 80.67 81.67 65 101 65C120.33 65 136 80.67 136 100C136 119.33 120.33 135 101 135C81.67 135 66 119.33 66 100Z" stroke="white" strokeWidth="12"/>
              <path d="M136 146L156 166" stroke="white" strokeWidth="12" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-3">Edit Your Profile</h1>
            <p className="text-violet-100 ">Update your information and personalize your account</p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-violet-900 to-indigo-700"></div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-row items-center justify-between w-1/2 max-w-md mx-auto mb-5">
                <div className="relative mb-4 group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center">
                    {user && user.profile_pic ?(
                      <img
                        src={`http://localhost:5000${user.profile_pic}`}
                        alt="Profile"
                        className="w-30 h-30 bg-slate-400 rounded-full"
                      />
                    ) : (
                      <User size={64} className="text-indigo-300" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <label htmlFor="profile-upload" className="cursor-pointer">
                      <div className="bg-green-600 text-white p-2 rounded-full shadow-lg ">
                      </div>
                    </label>
                  </div>
                </div>
                <ProfilePictureSelector image={profilePic} setImage={setProfilePic} onChange={handleImageChange}  />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 p-3 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 p-3 focus:outline-none"
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 p-3 focus:outline-none"
                    placeholder="Enter new password (leave blank to keep current)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400 hover:text-violet-500" />
                    ) : (
                      <Eye size={16} className="text-gray-400 hover:text-violet-500" />
                    )}
                  </button>
                </div>
                {password && password.length > 0 && password.length < 8 && (
                  <p className="text-amber-500 text-xs flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    Password should be at least 8 characters long
                  </p>
                )}
              </div>

              {/* Feedback Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                  <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{successMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || !formTouched}
                  className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-white font-medium ${
                    formTouched
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
                      : "bg-gray-300 cursor-not-allowed"
                  } transition-colors duration-300`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading || !formTouched}
                  className={`flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium ${
                    formTouched && !loading
                      ? "hover:bg-gray-50"
                      : "opacity-50 cursor-not-allowed"
                  } transition-colors duration-300`}
                >
                  Cancel
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