import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import AppContextProvider from "./contexts/AppContext";
import "./assets/css/global.css";

const defaultTheme = createTheme();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={defaultTheme}>
                <StyledEngineProvider injectFirst>
                    <AppContextProvider>
                        <App />
                    </AppContextProvider>
                </StyledEngineProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
