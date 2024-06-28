import {Box, Typography} from "@mui/material";
import {Layout} from "antd";
import {FC, ReactNode, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const { Header, Sider, Content } = Layout;

interface LayoutCompProps {
    children: ReactNode;
}

const contentStyle: React.CSSProperties = {
    padding: "1rem 2rem",
    backgroundColor: "#f7f7f7",
};

const siderStyle: React.CSSProperties = {
    color: "#fff",
    background: "linear-gradient(225deg, #8863ed, #b1a7d3, #5cbcf4)",
};

const items = [
    {
        key: "house-report",
        label: "House Report",
        url: "/house-report",
    },
    {
        key: "part-report",
        label: "Part Report",
        url: "/part-report",
    },
    {
        key: "work-schedule",
        label: "Work Schedule",
        url: "/work-schedule",
    },
    {
        key: "log-update",
        label: "Log Update",
        url: "/log-update",
    },
    {
        key: "log-cross-zone",
        label: "Log Cross Zone",
        url: "/log-cross-zone",
    },
];

const LayoutComp: FC<LayoutCompProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeKey, setActiveKey] = useState("house-report");

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    useEffect(() => {
        if (location.pathname.includes("/house-report")) {
            setActiveKey("house-report");
        } else if (location.pathname.includes("/part-report")) {
            setActiveKey("part-report");
        } else if (location.pathname.includes("/work-schedule")) {
            setActiveKey("work-schedule");
        } else if (location.pathname.includes("/log-update")) {
            setActiveKey("log-update");
        } else if (location.pathname.includes("/log-cross-zone")) {
            setActiveKey("log-cross-zone");
        }
        else {
            setActiveKey("house-report");
        }
    }, [location]);

    return (
        <Layout>
            <Sider style={siderStyle} width={220}>
                <Box className="py-5 px-10">
                    <Typography className="text-white text-xl font-bold uppercase">Dashboard</Typography>
                </Box>
                <Box component="ul" className="flex flex-col">
                    {items.map((item) => (
                        <Box
                            key={item.key}
                            component="li"
                            className={`text-white text-base text-left font-medium py-3 px-10 cursor-pointer hover:bg-white hover:text-dark-01 ${
                                item.key === activeKey && "bg-white !text-dark-01"
                            }`}
                            onClick={() => navigate(item.url)}
                        >
                            {item.label}
                        </Box>
                    ))}
                </Box>
            </Sider>
            <Layout>
                <Header className="w-full h-[60px] !px-10 flex items-center justify-end bg-white shadow-2xl">
                    <Box className="cursor-pointer" onClick={handleLogout}>
                        <Typography className="text-dark-01 font-bold">Logout</Typography>
                    </Box>
                </Header>

                <Content style={contentStyle}>{children}</Content>
            </Layout>
        </Layout>
    );
};

export default LayoutComp;
