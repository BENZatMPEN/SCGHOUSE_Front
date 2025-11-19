import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import type {InputRef} from 'antd';
import {Button, DatePicker, Divider, Form, Input, Select, Space, Table, Typography} from 'antd';
import type {ColumnsType, ColumnType} from 'antd/es/table';
import dayjs from 'dayjs';
import {EditOutlined, SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {FilterConfirmProps} from 'antd/es/table/interface';
import * as XLSX from 'xlsx';
import LayoutComp from '../component/Layout';
import '../styles/global.css';
import {SKIP_UNIT_OPTION} from '../constants/constant';
import {ModalFormWeight} from '../component/part-report/ModalWeight';
import {updateSkipUit, updateWeight} from '../api/part-report';

export interface DataType {
    key: React.Key;
    record_date_time: string;
    house_name: string;
    current_zone: string;
    id_production_data: string;
    house_code: string;
    part_order: string;
    type: string;
    total_unit: string;
    mj_date: string;
    mj_date_time: string;
    installation_date: string;
    part_finish_date_time: string;
    weight: string;
    ct_mj: string;
    ct_buffer: string;
    ct_bypass1: string;
    ct_ew: string;
    ct_ee_in: string;
    ct_iwpt: string;
    ct_bypass2: string;
    ct_door: string;
    ct_windows: string;
    ct_scaffold: string;
    ct_loading: string;
    ct_weight: string;
    is_edit_weight: boolean;
}

type DataIndex = keyof DataType;

interface Config {
    headers: {
        Authorization: string;
    };
    params?: {
        startDate?: string | null;
        endDate?: string | null;
    };
}

const PartReport: React.FC = () => {
    const dateFormat = 'YYYY/MM/DD HH:mm:ss';
    const navigate = useNavigate();
    const [data, setData] = useState<DataType[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs().endOf('month'));
    const [disableSearch, setDisableSearch] = useState(false);
    const [disableExport, setDisableExport] = useState(true);
    const [selectedValue, setSelectedValue] = useState<DataType[]>([]);
    const [openWeight, setOpenWeight] = useState<boolean>(false);
    const [selectedKey, setSelectedKey] = useState<DataType | null>(null);
    const [form] = Form.useForm();

    const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const handleChange = async (value: string, recordKey: string) => {
        const body = {target_zone: Number(value)};
        const updateAPIs = await updateSkipUit(recordKey, body);

        if (updateAPIs?.data.code === 'SUCCESS') {
            fetchDataFromAPI();
        }
    };
    const onOpenWeight = (val: string, record: DataType) => {
        setSelectedKey(record);
        setOpenWeight(true);
    };

    const onSaveWeight = async () => {
        const values = form.getFieldsValue();
        const body = {weight: Number(values.weight)};

        if (selectedKey?.key) {
            const updateAPIs = await updateWeight(selectedKey?.key.toString(), body);

            if (updateAPIs?.data.status === 'success') {
                fetchDataFromAPI();
            }
        }

        setOpenWeight(false);
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size='small'
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{width: 90}}>
                        Reset
                    </Button>
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            confirm({closeDropdown: false});
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>,
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
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<DataType> = [
        {
            title: 'Record Date/Time',
            width: 180,
            dataIndex: 'record_date_time',
            key: 'record_date_time',
            // fixed: "left",
            ...getColumnSearchProps('record_date_time'),
        },
        {
            title: 'Skip Unit',
            dataIndex: 'skip_unit',
            key: 'skipUnit',
            width: 150,
            render: (_, record) => (
                <Space size='middle'>
                    <Select
                        value={record.current_zone?.toString() || ''}
                        style={{width: 120}}
                        onChange={(value) => handleChange(value, record.id_production_data.toString())}
                        options={SKIP_UNIT_OPTION.map((item) => {
                            return {
                                label: item.label,
                                value: item.value,
                                disabled: Boolean(record.current_zone > item.value)
                            };
                        })}
                    />
                    {/* <Option value="active">Active</Option> */}
                </Space>
            ),
        },
        {
            title: 'House Name',
            width: 200,
            dataIndex: 'house_name',
            key: 'house_name',
            ...getColumnSearchProps('house_name'),
        },
        {
            title: 'House Code',
            dataIndex: 'house_code',
            key: 'house_code',
            width: 150,
            ...getColumnSearchProps('house_code'),
        },
        {
            title: 'Unit No.',
            dataIndex: 'part_order',
            key: 'part_order',
            width: 120,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 100,
        },
        {
            title: 'Type Unit',
            dataIndex: 'type_unit',
            key: 'type_unit',
            width: 100,
        },
        {
            title: 'Unit Size',
            dataIndex: 'unit_size',
            key: 'unit_size',
            width: 100,
        },
        {
            title: 'Type Stair',
            dataIndex: 'area_for_b',
            key: 'area_for_b',
            width: 100,
        },
        {
            title: 'Bathroom Area (m2)',
            dataIndex: 'type_stair_for_r',
            key: 'type_stair_for_r',
            width: 150,
        },
        {
            title: 'House Type',
            dataIndex: 'house_type',
            key: 'house_type',
            width: 150,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 100,
        },
        {
            title: 'Total Unit',
            dataIndex: 'total_unit',
            key: 'total_unit',
            width: 120,
        },
        {
            title: 'MJ Date',
            dataIndex: 'mj_date',
            key: 'mj_date',
            width: 200,
        },
        {
            title: 'Installation Date',
            dataIndex: 'installation_date',
            key: 'installation_date',
            width: 150,
        },
        {
            title: 'Part Finish Date/Time',
            dataIndex: 'part_finish_date_time',
            key: 'part_finish_date_time',
            width: 200,
        },
        {
            title: 'weight (kg)',
            dataIndex: 'weight',
            key: 'weight',
            width: 150,
            render: (value, record) => (
                // <Space size='middle' split={<Divider type='vertical' />} align='baseline'>
                <div className='flex justify-between'>
                    <Typography>
                        {record?.weight?.toLocaleString()}
                        {record?.is_edit_weight && <span style={{ color: 'red' }}> *</span>}
                    </Typography>
                    {record.weight !== null && record.weight !== undefined && (
                        <Button
                            size='small'
                            type='default'
                            style={{alignItems: 'center'}}
                            onClick={() => {
                                onOpenWeight(value, record);
                            }}
                        >
                            <EditOutlined/>
                        </Button>
                    )}
                </div>
                // </Space>
            ),
        },
        {
            title: 'CT(Min) @MJ',
            dataIndex: 'ct_mj',
            key: 'ct_mj',
            width: 150,
        },
        {
            title: 'CT(Min) @Buffer',
            dataIndex: 'ct_buffer',
            key: 'ct_buffer',
            width: 150,
        },
        {
            title: 'CT(Min) @BYPASS1',
            dataIndex: 'ct_bypass1',
            key: 'ct_bypass1',
            width: 150,
        },
        {
            title: 'CT(Min) @EW',
            dataIndex: 'ct_ew',
            key: 'ct_ew',
            width: 150,
        },
        {
            title: 'CT(Min) @EE in',
            dataIndex: 'ct_ee_in',
            key: 'ct_ee_in',
            width: 150,
        },
        {
            title: 'CT(Min) @IWPT',
            dataIndex: 'ct_iwpt',
            key: 'ct_iwpt',
            width: 150,
        },
        {
            title: 'CT(Min) @BYPASS2',
            dataIndex: 'ct_bypass2',
            key: 'ct_bypass2',
            width: 150,
        },
        {
            title: 'CT(Min) @Door',
            dataIndex: 'ct_door',
            key: 'ct_door',
            width: 150,
        },
        {
            title: 'CT(Min) @Window',
            dataIndex: 'ct_windows',
            key: 'ct_windows',
            width: 150,
        },
        {
            title: 'CT(Min) @Scaffold',
            dataIndex: 'ct_scaffold',
            key: 'ct_scaffold',
            width: 150,
        },
        {
            title: 'CT(Min) @Loading',
            dataIndex: 'ct_loading',
            key: 'ct_loading',
            width: 150,
        },
        {
            title: 'CT(Min) @weight',
            dataIndex: 'ct_weight',
            key: 'ct_weight',
            width: 150,
        },
        {
            title: 'CT(Day) Sum',
            dataIndex: 'ct_sum',
            key: 'ct_sum',
            width: 150,
        },
    ];

    const fetchDataFromAPI = useCallback(async () => {
        const token = localStorage.getItem('access_token');
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
            .get(`${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api/report/part`, config)
            .then((response) => {
                setData(response.data.data);
                setSelectedValue(response.data.data);
                if (response.data?.data?.length > 0) {
                    setDisableExport(false);
                }
            })
            .catch((error) => {
                // Log error ที่เกิดขึ้น
                if (error.response) {
                    // ฝั่ง backend ตอบกลับ
                    console.error('Fetch Report Error:', error.response.data);
                } else {
                    // ไม่มี response (network error หรือ error อื่นๆ)
                    console.error('Fetch Report Error:', error.message);
                }
                navigate('/login');
            });
    }, [startDate, endDate]);

    const exportExcel = () => exportToExcel(data);

    const exportToExcel = (data: any[]) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'data.xlsx');
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

    const formControl = {
        form,
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            fetchDataFromAPI();
        } else {
            navigate('/login');
        }
    }, [navigate, fetchDataFromAPI]);

    return (
        <LayoutComp>
            <div className='h-screen'>
                <h2 className="text-2xl text-dark-01 font-bold">Unit report</h2>
                <div className='my-8 flex gap-2 items-end'>
                    <div>
                        <label htmlFor='startDate' className='block text-sm text-dark-01 mb-2'>
                            Start date
                        </label>
                        <DatePicker
                            className='h-[45px]'
                            showTime={{ format: 'HH:mm:ss' }}
                            format='YYYY/MM/DD HH:mm:ss'
                            onChange={handleStartDateChange}
                            onOk={handleStartDateChange}
                            value={startDate}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate' className='block text-sm text-dark-01 mb-2'>
                            End date
                        </label>
                        <DatePicker
                            className='h-[45px]'
                            showTime={{ format: 'HH:mm:ss' }}
                            format='YYYY/MM/DD HH:mm:ss'
                            onChange={handleEndDateChange}
                            onOk={handleEndDateChange}
                            disabledDate={disabledEndDate}
                            value={endDate}
                        />
                    </div>
                    <div>
                        <Button className='h-[45px] min-w-[100px] text-white bg-dark-blue-01' disabled={disableSearch}
                                onClick={fetchDataFromAPI}>
                            Search
                        </Button>
                    </div>
                    <div>
                        <Button className='h-[45px]  min-w-[100px] text-white bg-red-01' disabled={disableExport}
                                onClick={exportExcel}>
                            Exports
                        </Button>
                    </div>
                </div>
                <Table className='global-table' columns={columns} dataSource={data} scroll={{x: 1500, y: 400}}/>
            </div>
            <ModalFormWeight
                isOpen={openWeight}
                dataEdit={selectedKey}
                onClose={() => setOpenWeight(false)}
                formControl={formControl}
                onSave={onSaveWeight}
            />
        </LayoutComp>
    );
};

export default PartReport;
