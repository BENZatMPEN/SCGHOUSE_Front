import { CircularProgress } from "@mui/material";
import { FC } from "react";

const RedirectPage: FC = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <CircularProgress className="!w-[50px] !h-[50px]" />
        </div>
    );
};

export default RedirectPage;
