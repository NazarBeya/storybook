import { adios } from '@adserve/adserve-react-components';
import axios from 'axios';
import { starter2Api } from '../constants/Endpoint';

export const GetSystemSettings = async () => {
    const results = await adios(() =>
        axios.get(`${starter2Api}/SystemSettings`, { params: { pageSize: -1 } })
    );

    return results?.data;
};
