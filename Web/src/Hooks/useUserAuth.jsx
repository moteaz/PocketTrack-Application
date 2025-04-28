import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance"; // Adjust the import path as needed
import { API_PATHS } from "../Utils/apiPathes"; // Adjust the import path as needed

export const useUserAuth = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) return;

        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

                if (isMounted && response.data) {
                    updateUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                if (isMounted) {
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [user, updateUser, clearUser, navigate]);

};