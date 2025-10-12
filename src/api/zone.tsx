import axios from 'axios';
import { appConfig } from '../config/appConfig';
import { ConfigHeader, ReqSkipZone } from './api.type';


const config: ConfigHeader = {
  headers: {
    Authorization: ``,
  },
};

export const getZone = async (zone:string) => {
  const token = localStorage.getItem('access_token');
  config.headers.Authorization = `Bearer ${token}`;
  if (!token) return
  try {
    const call = await axios.get(`${appConfig.apiEndpoint}/api/report/part-zone/${zone}`, config);
    return call;
  } catch (error) {
    console.error('error APIs get part zone :', error);
  }
};
