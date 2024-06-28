import { FC, ReactNode, createContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AppContext = createContext<any>(null);

interface AppContextProviderProps {
    children: ReactNode;
}

const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const accessToken = window.localStorage.getItem("access_token");

        if (!accessToken) {
            navigate("/login");
        } else {
            if (location.pathname !== "/") {
                navigate(location.pathname);
            } else {
                navigate("/house-report");
            }
        }
    }, [navigate, location.pathname]);

    return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
