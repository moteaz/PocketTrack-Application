import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../Context/UserContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import DashboardLayout from "../../Components/layouts/DashboardLayout";
import ProfilePictureSelector from "../../Components/inputs/ProfilePictureSelector";
import { API_PATHS } from "../../Utils/apiPathes";
import axiosInstance from "../../Utils/axiosInstance";
import UserPic from "../../assets/images/User-avatar.svg.png";
import InputField from "../../Components/inputs/InputsFiled";
import { useUserAuth } from "../../Hooks/useUserAuth";

const EditProfile = () => {
  useUserAuth();
  const { user,updateUser } = useContext(UserContext);
  const [profilePic, setProfilePic] = useState();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user) {
      setFullName(user.fullname || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleImageChange = (file) => {
    setProfilePic(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (password&&password.length < 8) {
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
        setSuccessMessage("User updated successfully!");
      } else if (response.status === 400) {
        setSuccessMessage("");
        setError(response.data.message || "Invalid data.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      if (error.response) {
        setError(error.response.data.message || "Server error.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Edit Profile">
      <div className="bg-white p-6 mt-5 rounded-2xl shadow-md border border-gray-200/50 md:w-[90%] lg:w-[80%] mx-auto">
        <div className="my-5 grid grid-cols-1 gap-6">
          <div className="lg:w-[70%] mx-auto">
            <h3 className="text-lg">Edit Your Profile</h3>
            <p className="text-xs text-gray-400">Update your information below</p>

            <form onSubmit={handleUpdate} className="flex flex-col gap-6 mt-4">
              {/* Profile Picture Selector */}
              <ProfilePictureSelector
                image={profilePic}
                setImage={setProfilePic}
                onChange={handleImageChange}
              />

              {/* Full Name */}
              <InputField
                id="fullName"
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              {/* Email */}
              <InputField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password */}
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="New Password"
                  className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-transparent"
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-[-10px] text-xs text-violet-500 bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-violet-500"
                >
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-violet-500"
                >
                  {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                </button>
              </div>

              {/* Feedback Messages */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-400 hover:text-violet-700 transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};



export default EditProfile;