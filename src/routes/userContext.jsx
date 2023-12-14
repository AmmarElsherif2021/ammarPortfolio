import { useContext } from "react";
import { useState } from "react";
import {createContext}from "react";
const userContext = createContext({});
export const userProvider = ({children}) =>{
    const[user]=useState(
        {
            name:'ammar',
            password: '4331077'
        }
    )
    return(
        <userContext.Provider value={user}></userContext.Provider>
    )
}
export const useUser=()=>useContext(userContext)