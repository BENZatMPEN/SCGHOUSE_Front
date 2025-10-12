import { SearchOutlined } from '@mui/icons-material';
import { Button, Input, InputRef, Select, Space, Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

type Props = {
  isData : any[]
};
export interface DataType {
  key: React.Key;
  record_date_time: string;
  house_name: string;
  skip_unit: string;
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
}

type DataIndex = keyof DataType;

const TableZone = ({isData}: Props) => {
  const [data, setData] = useState<DataType[]>(isData);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false });
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
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
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
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
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
      title: 'Part Order',
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
      title: 'Area for B',
      dataIndex: 'area_for_b',
      key: 'area_for_b',
      width: 100,
    },
    {
      title: 'Type Stair for R',
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

  useEffect(() => {
    setData(isData)
  }, [isData])
  
  return <Table className='global-table' dataSource={data} columns={columns} scroll={{ x: 1500, y: 400 }} />;
};

export default TableZone;
