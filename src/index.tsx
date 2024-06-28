import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material";
// import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import AppContextProvider from "./contexts/AppContext";
import "./assets/css/global.css";

const defaultTheme = createTheme();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    // <BrowserRouter>
    //   <Routes>
    //       <Route path='*' element={<NotFound />} />
    //     <Route path="/" element={<Login/>}></Route>
    //     <Route path="/dashboard" element={<Dashboard/>}></Route>
    //     <Route path="/login" element={<Login/>}></Route>

    //     {/*<Route path="/register" element={<Register/>}></Route>*/}
    //     {/*<Route path="/house-report" element={<HouseReport/>}></Route>*/}
    //     {/*<Route path="/part-report" element={<PartReport/>}></Route>*/}
    //     {/*<Route path="/work-schedule" element={<WorkSchedule/>}></Route>*/}
    //   </Routes>
    // </BrowserRouter>,

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
