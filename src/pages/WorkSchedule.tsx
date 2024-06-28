import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Table, Tag} from "antd";
import type {ColumnsType} from "antd/es/table";
import {EditOutlined} from "@ant-design/icons";
import ModalForm from "../component/ModalFrom";
import LayoutComp from "../component/Layout";
import "../styles/global.css";

interface DataType {
    key: number;
    day: String;
    status: boolean;
    hhMorningStart: Number;
    mmMorningStart: Number;
    hhMorningEnd: Number;
    mmMorningEnd: Number;
    hhAfternoonStart: Number;
    mmAfternoonStart: Number;
    hhAfternoonEnd: Number;
    mmAfternoonEnd: Number;
    hhOTStart: Number;
    mmOTStart: Number;
    hhOTEnd: Number;
    mmOTEnd: Number;
}

let columns: ColumnsType<DataType>;

const WorkSchedule: React.FC = () => {
    columns = [
        {
            title: "Day",
            dataIndex: "day",
            key: "day",
            width: 50,
            fixed: "left",
            align: "center",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 30,
            align: "center",
            // render: (_, record) => (
            //     <Space size="middle">
            //         <a>Invite {record.status}</a>
            //         <a>Delete</a>
            //     </Space>
            // ),
            render: (text) =>
                text === true ? (
                    <Tag color={"green"}>Active</Tag>
                ) : (
                    // <div className='text-green-600'>{text}</div>
                    <Tag color={"red"}>Inactive</Tag>
                ),
        },
        {
            title: "Morning",
            children: [
                {
                    title: "Start",
                    children: [
                        {
                            title: "HH",
                            dataIndex: "hhMorningStart",
                            key: "hhMorningStart",
                            width: 20,
                            align: "center",
                        },
                        {
                            title: "MM",
                            dataIndex: "mmMorningStart",
                            key: "mmMorningStart",
                            width: 20,
                            align: "center",
                        },
                    ],
                },
                {
                    title: "End",
                    children: [
                        {
                            title: "HH",
                            dataIndex: "hhMorningEnd",
                            key: "hhMorningEnd",
                            width: 20,
                            align: "center",
                        },
                        {
                            title: "MM",
                            dataIndex: "mmMorningEnd",
                            key: "mmMorningEnd",
                            width: 20,
                            align: "center",
                        },
                    ],
                },
            ],
        },
        {
            title: "Afternoon",
            children: [
                {
                    title: "Start",
                    children: [
                        {
                            title: "HH",
                            dataIndex: "hhAfternoonStart",
                            key: "hhAfternoonStart",
                            width: 20,
                            align: "center",
                        },
                        {
                            title: "MM",
                            dataIndex: "mmAfternoonStart",
                            key: "mmAfternoonStart",
                            width: 20,
                            align: "center",
                        },
                    ],
                },
                {
                    title: "End",
                    children: [
                        {
                            title: "HH",
                            dataIndex: "hhAfternoonEnd",
                            key: "hhAfternoonEnd",
                            width: 20,
                            align: "center",
                        },
                        {
                            title: "MM",
                            dataIndex: "mmAfternoonEnd",
                            key: "mmAfternoonEnd",
                            width: 20,
                            align: "center",
                        },
                    ],
                },
            ],
        },
        {
            title: "OT",
            children: [
                {
                    title: "statusOT",
                    dataIndex: "statusOT",
                    key: "statusOT",
                    width: 30,
                    align: "center",
                    render: (text) =>
                        text === true ? (
                            <Tag color={"green"}>Active</Tag>
                        ) : (
                            // <div className='text-green-600'>{text}</div>
                            <Tag color={"red"}>Inactive</Tag>
                        ),
                },
                {
                    title: "Start",
                    children: [
                        {
                            title: "HH",
                            dataIndex: "hhOTStart",
                            key: "hhOTStart",
                            width: 20,
                            align: "center",
                        },
                        {
                            title: "MM",
                            dataIndex: "mmOTStart",
                            key: "mmOTStart",
                            width: 20,
                            align: "center",
                        },
                    ],
                },
                {
                    title: "End",
                    children: [
                        {
                            title: "HH",
                            dataIndex: "hhOTEnd",
                            key: "hhOTEnd",
                            width: 20,
                            align: "center",
                        },
                        {
                            title: "MM",
                            dataIndex: "mmOTEnd",
                            key: "mmOTEnd",
                            width: 20,
                            align: "center",
                        },
                    ],
                },
            ],
        },
        {
            title: "Edit",
            dataIndex: "edit",
            key: "edit",
            width: 30,
            align: "center",
            fixed: "right",
            render: (text, record) => (
                <div className="cursor-pointer" onClick={() => handleOpenModal(record)}>
                    <EditOutlined />
                </div>
            ),
        },
    ];

    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedKey, setSelectedKey] = useState(0);

    const navigate = useNavigate();

    const fetchDataFromAPI = useCallback(async () => {
        const token = localStorage.getItem("access_token");
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        axios
            .get(`${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api/schedules`, config)
            .then((response) => setData(response.data.data))
            .catch((error) => {
                console.error("Error fetching data:", error);
                navigate("/login");
            });
    }, []);

    const handleOpenModal = (record: DataType) => {
        setSelectedKey(record.key);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        fetchDataFromAPI();
        setModalVisible(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (token) {
            fetchDataFromAPI();
        } else {
            navigate("/login");
        }
    }, [navigate, fetchDataFromAPI]);

    return (
        <LayoutComp>
            <div className="h-screen">
            <h2 className="text-2xl text-dark-01 font-bold">Work Schedule</h2>
                <div className="my-5">
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered
                        pagination={false}
                        size="middle"
                        scroll={{ x: "calc(700px + 50%)" }}
                    />
                </div>
                <ModalForm visible={modalVisible} index={selectedKey} onClose={handleCloseModal} />
            </div>
        </LayoutComp>
    );
};

export default WorkSchedule;
