import React, { createContext, useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [navKey, setNavKey] = useState(0);

  // Restore stored session on app launch
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          setUser(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error("Failed to restore session from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data.user;
      
      // Manually persist session cookie for Android/iOS
      const setCookie = response.headers["set-cookie"] || response.headers["Set-Cookie"];
      if (setCookie) {
        const cookieString = Array.isArray(setCookie) ? setCookie.join("; ") : setCookie;
        await AsyncStorage.setItem("userCookie", cookieString);
      }
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userCookie");
      setNavKey((prevKey) => prevKey + 1);
      setIsLoading(false);
    }
  };

  const refreshUserProfile = useCallback(async () => {
    if (!user) return;
    const updatedUser = { ...user, profileComplete: true };
    setUser(updatedUser);
    await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
  }, [user]);

  const registerPushToken = async (token) => {
    if (!token) return;
    try {
      await api.post("/notifications/register-token", { token });
      console.log("Token registered with backend:", token);
    } catch (error) {
      console.error("Failed to register token with backend:", error);
    }
  };

  const refreshUserVerification = useCallback(
    async (newStatus) => {
      if (!user) return;
      const updatedUser = { ...user, verificationStatus: newStatus };
      setUser(updatedUser);
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      setNavKey((prevKey) => prevKey + 1);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUserProfile,
        refreshUserVerification,
        registerPushToken,
        navKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
