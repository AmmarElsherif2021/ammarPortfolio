import { createContext,useState,useContext } from "react";
// Create a context object with a default value
const UserContext = createContext({});

// Create a custom hook that manages the user state
export const useUserContext=()=> {
  // Use useState to store the user data
  const [user, setUser] = useState(null);
  // Define a function to authenticate the user and update the user state
  const login = (username, password) => {
    // Call your authentication API here and get the user data
    // For simplicity, we use a mock user data
    const userData = {
      id: 1,
      name: username,
      role: "admin",
    };
    // Update the user state with the user data
    setUser(userData);
  };
  // Return an array of the user and the login function
  return [user, login];
}

// Create a context provider component that uses the custom hook
export const userProvider=({ children })=> {
  // Use the custom hook to get the user state and the login function
  const [user, login] = useUserContext();
  // Return the context provider component with the context value
  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
}
/*
// In authContext.js
// Import React and createContext
import React, { createContext } from "react";

// Create and export AuthContext
export const AuthContext = createContext();

// Export AuthContextProvider as default
export default function AuthContextProvider(props) {
  // Your code here
}

// In RegisterRoutes.js
// Import React, useContext and AuthContext
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";

// Use AuthContext with useContext
const { isAuthenticated, setAuth } = useContext(AuthContext);
*/