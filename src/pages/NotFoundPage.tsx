import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Button } from "antd";

const NotFoundPage: FC = () => {
    const navigate = useNavigate();

    const checkToken = () => {
        const accessToken = window.localStorage.getItem("access_token");

        if (!accessToken) {
            navigate("/login");
        } else {
            navigate("/house-report");
        }
    };

    const handleNavigateHome = () => checkToken();

    return (
        <Box className="w-full h-screen flex items-center justify-center text-center">
            <Box>
                <h2 className="text-[100px] text-[#8863ed] font-bold leading-[100px]">404</h2>
                <p className="text-2xl text-[#b1a7d3] mb-5">Page not found</p>
                <p className="text-base text-[#b1a7d3]">
                    The page you are looking for doesn't exist or an other error occurred.
                </p>
                <Button
                    className="h-[50px] my-10 px-10 bg-dark-blue-01 text-white hover:!bg-white hover:!border-dark-blue-01 hover:!text-dark-blue-01"
                    onClick={handleNavigateHome}
                >
                    Go back to Dashboard
                </Button>
            </Box>
        </Box>
    );
};

export default NotFoundPage;
