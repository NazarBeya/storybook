import axios from 'axios';
import { crmEndpoint } from '../constants/Endpoint';

export const GetUser = async (id) => {
    const result = await axios.get(`${crmEndpoint}/user/${id}`);
    return result?.data;
};
