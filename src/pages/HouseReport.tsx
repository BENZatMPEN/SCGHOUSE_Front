import {SearchOutlined} from "@ant-design/icons";
import React, {useCallback, useEffect, useRef, useState} from "react";
import Highlighter from "react-highlight-words";
import type {InputRef} from "antd";
import {Button, DatePicker, Input, Space, Table} from "antd";
import type {ColumnsType, ColumnType} from "antd/es/table";
import type {FilterConfirmProps} from "antd/es/table/interface";
import axios from "axios";
import "react-moment";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import LayoutComp from "../component/Layout";
import "../styles/global.css";
import { useNavigate } from 'react-router-dom';

interface DataType {
    key: string;
    recordDateTime: string;
    houseName: string;
    houseCode: string;
    totalUnit: string;
    mjDate: string;
    mjDateTime: string;
    installationDate: string;
    allPartFinish: string;
    duration: string;
}

interface Config {
    headers: {
        Authorization: string;
    };
    params?: {
        startDate?: string | null;
        endDate?: string | null;
    };
}

type DataIndex = keyof DataType;

const HouseReport: React.FC = () => {
    const navigate = useNavigate();
    const dateFormat = "YYYY/MM/DDTHH:mm:ss";
    const searchInput = useRef<InputRef>(null);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs().endOf('month'));
    const [disableSearch, setDisableSearch] = useState(false);
    const [disableExport, setDisableExport] = useState(true);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<DataType> = [
        {
            title: "Record Date/Time",
            dataIndex: "recordDateTime",
            key: "recordDateTime",
            width: 200,
            ...getColumnSearchProps("recordDateTime"),
        },
        {
            title: "House Name",
            dataIndex: "houseName",
            key: "houseName",
            ...getColumnSearchProps("houseName"),
            width: 200,
        },
        {
            title: "House Code",
            dataIndex: "houseCode",
            key: "houseCode",
            ...getColumnSearchProps("houseCode"),
        },
        {
            title: "Total Unit",
            dataIndex: "totalUnit",
            key: "totalUnit",
            ...getColumnSearchProps("totalUnit"),
        },
        {
            title: "MJ Date",
            dataIndex: "mjDate",
            key: "mjDate",
            ...getColumnSearchProps("mjDate"),
            width: 200,
            // render: (text) => {
            //     const date = new Date(text);
            //     return <span>{date.toLocaleDateString('en-GB')}</span>;
            // },
        },
        // {
        //     title: "MJ Date/Time",
        //     dataIndex: "mjDateTime",
        //     key: "mjDateTime",
        //     ...getColumnSearchProps("mjDateTime"),
        //     width: 200,
        // },
        {
            title: "Installation Date",
            dataIndex: "installationDate",
            key: "installationDate",
            width: 200,
            ...getColumnSearchProps("installationDate"),
            // render: (text) => {
            //     const formattedDate = text.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
            //     return <span>{formattedDate}</span>;
            // },
        },
        {
            title: "All Part Finish Date/Time",
            dataIndex: "allPartFinish",
            key: "allPartFinish",
            width: 250,
            ...getColumnSearchProps("allPartFinish"),
            render: (text) => {
                if (text === "Invalid date") {
                    return <span>{""}</span>;
                }
                return <span>{text}</span>;
            }
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            ...getColumnSearchProps("duration"),
        },
    ];

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
        axios.get(`${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api/report/house`, config)
            .then((response) => {
                setData(response.data.data);

                if (response.data?.data?.length > 0) {
                    setDisableExport(false);
                } else {
                    setDisableExport(true);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                navigate('/login');
            });
    }, [startDate, endDate]);

    const exportExcel = () => exportToExcel(data);

    const exportToExcel = (data: any[]) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "data.xlsx");
    };

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

    // useEffect(() => {
    //     const firstDayOfMonth = dayjs().startOf('month');
    //     const lastDayOfMonth = dayjs().endOf('month');
    //     setStartDate(firstDayOfMonth);
    //     setEndDate(lastDayOfMonth);
    //     setDisableSearch(false);
    // }, []);

    return (
        <LayoutComp>
            <div className="h-screen">
                <h2 className="text-2xl text-dark-01 font-bold">House Report</h2>
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
                    <div>
                        <Button
                            className="h-[45px]  min-w-[100px] text-white bg-red-01"
                            disabled={disableExport}
                            onClick={exportExcel}
                        >
                            Exports
                        </Button>
                    </div>
                </div>
                <Table className="global-table" columns={columns} dataSource={data} scroll={{ x: 1500, y: 400 }} />
            </div>
        </LayoutComp>
    );
};

export default HouseReport;
