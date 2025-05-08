import { AuthContext } from "./index";
import { useState } from "react";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState();

    const updateUserInfo = () => {
        if (token)
            fetch(import.meta.env.VITE_BACKENDURL + '/users/me', {
                method: "GET",
                headers: { 'X-Auth-Token': token }
            })
            .then(res => res.json())
            .then(res => setUser(res));
        else setUser();
    }

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        updateUserInfo();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, updateUserInfo, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
