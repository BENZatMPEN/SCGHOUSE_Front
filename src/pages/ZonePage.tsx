import React, { useEffect, useState } from 'react';
import LayoutComp from '../component/Layout';
import { Select } from 'antd';
import { ZONE_OPTION } from '../constants/constant';
import TableZone from '../component/zone/TableZone';
import { getZone } from '../api/zone';
import { HttpStatusCode } from 'axios';

type Props = {};

const ZonePage = (props: Props) => {
  const [selectedZone, setSelectedZOne] = useState('2');
  const [zoneDataResponse, setZoneDataResponse] = useState([]);
  const handleChange = (val: string) => {
    setSelectedZOne(val);
  };
  const getAPIsZone = async (zoneSelected: string) => {
    const getPartZone = await getZone(zoneSelected);
    if (getPartZone) {
      setZoneDataResponse(getPartZone?.data.data);
    } else {
      console.log('APIs error zone!');
    }
  };
  useEffect(() => {
    if (selectedZone) {
      getAPIsZone(selectedZone);
    }
  }, [selectedZone]);

  return (
    <LayoutComp>
      <div className='h-screen'>
        <h2 className='text-2xl text-dark-01 font-bold mb-2'>Zone</h2>
        <div className='grid gap-y-2'>
          <div className='grid grid-cols-1 sm:grid-cols-2'>
            <Select
              value={selectedZone}
              style={{ width: '50%' }}
              onChange={(value) => handleChange(value)}
              options={ZONE_OPTION}
              placeholder='Select zone'
            />
          </div>
          <div className='grid grid-cols-1'>
            <TableZone isData={zoneDataResponse} />
          </div>
        </div>
      </div>
    </LayoutComp>
  );
};

export default ZonePage;
