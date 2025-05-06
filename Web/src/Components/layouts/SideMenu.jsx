import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import { SIDE_MENU_DATA } from "../../Utils/Data";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import UserAvatar from "../../assets/images/User-avatar.svg.png"; // Add a default avatar

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === "/logout") {
            handleLogout();
            return;
        }
        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                {/* Check if user exists */}
                {user ? (
                    <>
                        {user.profile_pic ? (
                            <img
                                src={`http://localhost:5000${user.profile_pic}`}
                                alt="Profile"
                                className="w-20 h-20 bg-slate-400 rounded-full"
                            />
                        ) : (
                            <CharAvatar 
                                fullname={user.fullname} 
                                width="w-20"
                                height="h-20"
                                style="text-xl"
                            />
                        )}
                        <h5 className="text-gray-950 font-medium leading-6">
                            {user.fullname || ""}
                        </h5>
                    </>
                ) : (
                    <div>
                        <img
                            src={UserAvatar} // Default avatar if no user
                            alt="Default Avatar"
                            className="w-20 h-20 bg-slate-400 rounded-full "
                        />
                        <h5 className="text-gray-950 font-medium leading-6">Guest</h5>
                    </div>
                )}
            </div>

            {SIDE_MENU_DATA.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] ${
                        activeMenu === item.label ? "text-white bg-purple-500" : "text-gray-700 hover:bg-gray-100"
                    } py-3 px-6 rounded-lg mb-3 transition-colors duration-200`}
                    onClick={() => handleClick(item.path)}
                >
                    <item.icon className="text-xl" />
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default SideMenu;
