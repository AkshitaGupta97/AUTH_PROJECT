import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BASE_URL;

    axios.defaults.withCredentials = true; // for sending cookies

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data');
            data.success ? setUserData(data.userData) : toast.error(data.message);
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    const getAuthStatus = async() => {
        try {
           const {data} = await axios.get(backendUrl + '/api/auth/is-auth');
           if(data.success){
            setIsLoggedIn(true);
            getUserData(); // to get user name
           }
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getAuthStatus();
    }, [])
 
    const value = {
        backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData, getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

