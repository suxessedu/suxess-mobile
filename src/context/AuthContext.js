import React, { createContext, useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [navKey, setNavKey] = useState(0);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data.user;
      setUser(userData);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
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
      setNavKey((prevKey) => prevKey + 1);
      setIsLoading(false);
    }
  };

  const refreshUserProfile = useCallback(async () => {
    const updatedUser = { ...user, profileComplete: true };
    setUser(updatedUser);
    await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
    setNavKey((prevKey) => prevKey + 1);
  }, [user]);

  const refreshUserVerification = useCallback(
    async (newStatus) => {
      const updatedUser = { ...user, verificationStatus: newStatus };
      setUser(updatedUser);
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      // THE DEFINITIVE FIX: Trigger the navigation reset for ALL roles.
      setNavKey((prevKey) => prevKey + 1);
    },
    [user]
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUserProfile,
        refreshUserVerification,
        navKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
