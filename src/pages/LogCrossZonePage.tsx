import {Button, DatePicker, Table} from "antd";
import LayoutComp from "../component/Layout";
import "../styles/global.css";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";


interface Config {
    headers: {
        Authorization: string;
    };
    params?: {
        startDate?: string | null;
        endDate?: string | null;
    };
}

const LogCrossZonePage: React.FC = () => {
    const navigate = useNavigate();
    const dateFormat = "YYYY/MM/DDTHH:mm:ss";
    const [data, setData] = useState<any>([]);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs().endOf('month'));
    const [disableSearch, setDisableSearch] = useState(false);
    const fetchDataFromAPI = useCallback(async () => {
        const token = localStorage.getItem("access_token");
        const config: Config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        config.params = {
            startDate: startDate?.format(dateFormat),
            endDate: endDate?.format(dateFormat),
        };

        axios
            .get(`${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api/cross-zone`, config)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                navigate('/login');
            });
    }, [ startDate, endDate]);

    const handleStartDateChange = (date: dayjs.Dayjs | null) => {
        setStartDate(date);
        if (date !== null && endDate !== null) {
            setDisableSearch(false);
        } else {
            setDisableSearch(true);
        }
    };

    const handleEndDateChange = (date: dayjs.Dayjs | null) => {
        setEndDate(date);
        if (startDate !== null && date !== null) {
            setDisableSearch(false);
        } else {
            setDisableSearch(true);
        }
    };

    const disabledEndDate = (current: dayjs.Dayjs | null) => {
        if (startDate !== null) {
            return current !== null && current.isBefore(startDate);
        }
        return false;
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) fetchDataFromAPI();
    }, [fetchDataFromAPI]);

    const columns = [
        {
            title: 'Date Time',
            dataIndex: 'created_date',
            key: 'created_date',
        },
        {
            title: 'House Code',
            dataIndex: 'house_code',
            key: 'house_code',
        },
        {
            title: 'House Name',
            dataIndex: 'house_name',
            key: 'house_name',
        },
        {
            title: 'Unit Number',
            dataIndex: 'unit_number',
            key: 'unit_number',
        },
        {
            title: 'From Zone',
            dataIndex: 'from_zone',
            key: 'from_zone',
        },
        {
            title: 'To Zone',
            dataIndex: 'to_zone',
            key: 'to_zone',
        },
    ];


    return (
        <LayoutComp>
            <div className="h-screen">
                <h2 className="text-2xl text-dark-01 font-bold">Log Cross Zone</h2>
                <div className="my-8 flex gap-2 items-end">
                    <div>
                        <label htmlFor="startDate" className="block text-sm text-dark-01 mb-2">
                            Start date
                        </label>
                        <DatePicker
                            id="startDate"
                            name="startDate"
                            className="h-[45px]"
                            showTime={{ format: "HH:mm" }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={handleStartDateChange}
                            onOk={handleStartDateChange}
                            value={startDate}
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm text-dark-01 mb-2">
                            End date
                        </label>
                        <DatePicker
                            id="endDate"
                            name="endDate"
                            className="h-[45px]"
                            showTime={{ format: "HH:mm" }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={handleEndDateChange}
                            onOk={handleEndDateChange}
                            disabledDate={disabledEndDate}
                            value={endDate}
                        />
                    </div>
                    <div>
                        <Button
                            className="h-[45px] min-w-[100px] text-white bg-dark-blue-01"
                            disabled={disableSearch}
                            onClick={fetchDataFromAPI}
                        >
                            Search
                        </Button>
                    </div>
                </div>
                <Table className="global-table" columns={columns} dataSource={data} scroll={{ x: 1500, y: 400 }} />
            </div>
        </LayoutComp>
    )

}
export default LogCrossZonePage;
