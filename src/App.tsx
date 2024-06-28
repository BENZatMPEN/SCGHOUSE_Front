import {FC} from "react";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RedirectPage from "./pages/RedirectPage";
import HouseReport from "./pages/HouseReport";
import PartReport from "./pages/PartReport";
import WorkSchedule from "./pages/WorkSchedule";
import LogUpdatePage from "./pages/LogUpdatePage";
import LogCrossZonePage from "./pages/LogCrossZonePage";

const App: FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<RedirectPage />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/house-report" element={<HouseReport />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/part-report" element={<PartReport />} />
                <Route path="/work-schedule" element={<WorkSchedule />} />
                <Route path="/log-update" element={<LogUpdatePage />} />
                <Route path="/log-cross-zone" element={<LogCrossZonePage />} />
                {/* <Route path="/register" element={<Register />}></Route> */}
            </Routes>
        </>
    );
};

export default App;
