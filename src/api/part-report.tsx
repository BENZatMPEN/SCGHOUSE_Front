import axios from "axios"
import { appConfig } from "../config/appConfig"
import { ConfigHeader, ReqSkipZone, ReqWeight } from "./api.type"


const token = localStorage.getItem('access_token');
const config: ConfigHeader = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const updateSkipUit = async (id:string, req:ReqSkipZone) => {
  try {
    const call = await axios.put(`${appConfig.apiEndpoint}/api/skip-zone/${id}`, req, config)
    return call
  } catch (error) {
    console.error('error APIs update skip unit :',error)
  }
}

export const updateWeight = async (id:string, req:ReqWeight) => {
  try {
    const call = await axios.put(`${appConfig.apiEndpoint}/api/weight/${id}`, req, config)
    return call
  } catch (error) {
    console.error('error APIs update weight :',error)
  }
}