import React, { createContext, useState, useEffect } from "react";

// Create context
export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from local storage when the app is loaded or refreshed
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Parse and set the user data from localStorage
        }
    }, []);

    // Update user data and save it to local storage
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Save user data to localStorage
    };

    // Clear user data from state and local storage
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("user"); // Remove user data from localStorage
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
