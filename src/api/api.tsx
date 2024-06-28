import axios from "axios";

export const fetchToken = async (): Promise<boolean> => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        if (accessToken) {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api/auth`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                data: { refresh_token: refreshToken },
            });

            if (response.data.message.access_token) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return false;
    }
};
