import axios from 'axios';
import { crmEndpoint } from '../constants/Endpoint';
import { adios } from '@adserve/adserve-react-components';

export const GetRecentUserActivities = async (userId) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/useractivities`, {
            params: { userId }
        })
    );
    return results?.data || [];
};

export const GetAccounts = async (params) => {
    if (params.searchTerm) {
        params.searchTerm = encodeURIComponent(params.searchTerm);
    }
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/accounts`, {
            params
        })
    );
    return results?.data;
};
