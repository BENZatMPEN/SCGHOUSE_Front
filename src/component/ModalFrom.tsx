import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import axios from "axios";

const { Option } = Select;
interface IModalFormProps {
    visible: boolean;
    index: number;
    onClose: () => void;
}

interface IUpdateSchedule {
    hhAfternoonEnd: number;
    hhAfternoonStart: number;
    hhMorningEnd: number;
    hhMorningStart: number;
    hhOTEnd: number;
    hhOTStart: number;
    mmAfternoonEnd: number;
    mmAfternoonStart: number;
    mmMorningEnd: number;
    mmMorningStart: number;
    mmOTEnd: number;
    mmOTStart: number;
}

const ModalForm: React.FC<IModalFormProps> = ({ visible, index, onClose }) => {
    const [form] = Form.useForm();
    const [dataDay, setDataDay] = useState<any>({});

    const fetchDataFromAPI = useCallback(async () => {
        try {
            const token = localStorage.getItem("access_token");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: { index },
            };
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api/schedule`, config);
            // console.log(response.data.data.status);
            response.data.data.status = response.data.data.status === true ? "active" : "inactive";
            response.data.data.statusOT = response.data.data.statusOT === true ? "active" : "inactive";
            form.setFieldsValue(response.data.data);
            setDataDay(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [form, index]);

    const queryUpdateSchedule = async (values: IUpdateSchedule) => {
        try {
            // console.log(values)
            const token = localStorage.getItem("access_token");
            const requestData = {
                index: index,
                data: values,
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(`${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api/schedule/edit`, requestData, config);
            await fetchDataFromAPI();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleFormSubmit = (values: IUpdateSchedule) => {
        // console.log(values);
        async function updateSchedule(values: IUpdateSchedule) {
            await queryUpdateSchedule(values);
            onClose();
        }
        updateSchedule(values);
    };

    useEffect(() => {
        if (visible) {
            fetchDataFromAPI();
        }
    }, [visible, fetchDataFromAPI]);
    console.log(form.getFieldsValue());
    return (
        <Modal title={`Day:${dataDay.day}`} open={visible} onCancel={onClose} footer={null}>
            <Form form={form} onFinish={handleFormSubmit}>
                <div className="border-b-2 my-5"></div>
                <div>
                    <Form.Item className="font-bold" name="status" label="status">
                        <Select
                            placeholder="Select a option and change input text above"
                            // onChange={onGenderChange}
                            allowClear
                        >
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                    <p className="font-bold">Morning</p>
                    <div className="flex gap-5">
                        <div>
                            <div>
                                <p className=" text-xs mt-3">Start</p>
                                <div className="flex gap-1">
                                    <Form.Item label="HH" name="hhMorningStart">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="mm" name="mmMorningStart">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <p className=" text-xs mt-3">End</p>
                                <div className="flex gap-1">
                                    <Form.Item label="HH" name="hhMorningEnd">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="mm" name="mmMorningEnd">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="font-bold">Afternoon</p>
                    <div className="flex gap-5">
                        <div>
                            <div>
                                <p className=" text-xs mt-3">Start</p>
                                <div className="flex gap-1">
                                    <Form.Item label="HH" name="hhAfternoonStart">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="mm" name="mmAfternoonStart">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <p className=" text-xs mt-3">End</p>
                                <div className="flex gap-1">
                                    <Form.Item label="HH" name="hhAfternoonEnd">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="mm" name="mmAfternoonEnd">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-b-2 my-5"></div>
                <Form.Item className=" font-bold" name="statusOT" label="statusOT">
                    <Select
                        placeholder="Select a option and change input text above"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </Form.Item>
                <div>
                    <div className="flex gap-2">
                        <p className="font-bold">Overtime</p>
                        <p className="text-red">* End สามารถกำหนดค่าสูงสุดได้ที่ 23:59</p>
                    </div>

                    <div className="flex gap-5">
                        <div>
                            <div>
                                <p className=" text-xs mt-3">Start</p>
                                <div className="flex gap-1">
                                    <Form.Item label="HH" name="hhOTStart">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="mm" name="mmOTStart">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <p className=" text-xs mt-3">End</p>
                                <div className="flex gap-1">
                                    <Form.Item label="HH" name="hhOTEnd">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                                if (parseInt(e.currentTarget.value) > 23) {
                                                    e.currentTarget.value = "23";
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="mm" name="mmOTEnd">
                                        <Input
                                            type="number"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                                if (parseInt(e.currentTarget.value) > 59) {
                                                    e.currentTarget.value = "59";
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className=" flex justify-end">
                    <Form.Item>
                        <Button className=" bg-black" type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalForm;
