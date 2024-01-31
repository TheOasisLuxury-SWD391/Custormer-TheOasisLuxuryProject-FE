'use client'

import { createContext, useContext, useState } from "react";

const AuthContext1 = createContext({});

export const useAuth = () => {
    return useContext(AuthContext1);
}

export const AuthProvider1 = ({ children }) => {
    const [user, setUser] = useState(() => {
        const user = window.localStorage.getItem("user");
        // return user ? JSON.parse(user) : null;
    });
    const login = async (user_name, password) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/v1/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_name, password }),
                }
            );
            console.log(response)
            if (response.ok) {
                const user = await response.json();
                setUser(user);
                window.localStorage.setItem("user", JSON.stringify(user));
            } else {

                console.log("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.log(error);

        }
    };

    const logout = () => {
        window.localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext1.Provider value={{ login, logout, user }}>
            {children}
        </AuthContext1.Provider>
    );
};