import { createContext,useState,useContext } from "react";
// Create a context object with a default value
export const userContext = createContext({});




// Create a context provider component that uses the custom hook
export const UserProvider=({ children })=> {
  // Use the custom hook to get the user state and the login function
  const [logged, setLogged] = useState(false)
  // Return the context provider component with the context value
  return (
    <userContext.Provider value={{ logged, setLogged }}>
      {children}
    </userContext.Provider>
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