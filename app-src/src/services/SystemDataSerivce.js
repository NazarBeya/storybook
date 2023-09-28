import { adios } from '@adserve/adserve-react-components';
import axios from 'axios';
import { endpoint } from '../constants/Endpoint';

export const GetModules = async () => {
    try {
        const results = await adios(() =>
            axios.get(`${endpoint}/modules`, {
                params: { pageSize: -1, includeUserMenuItems: true }
            })
        );

        const modules = results?.data?.data;

        for (let index = 0; index < modules.length; index++) {
            const module = modules[index];
            module.url = `${window.origin}/${module.homePage}`;
        }

        return modules;
    } catch (error) {
        console.log(error);
    }

    return [];
};
