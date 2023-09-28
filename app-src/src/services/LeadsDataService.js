import axios from 'axios';
import { crmEndpoint } from '../constants/Endpoint';
import { adios } from '@adserve/adserve-react-components';

export const CreateLead = async (lead) => {
    try {
        const response = await adios(() =>
            axios.post(`${crmEndpoint}/lead`, lead)
        );
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const GetLeads = async (params, myLeads = false) => {
    try {
        const response = await adios(() =>
            axios.get(
                `${crmEndpoint}/leads${myLeads ? '/created-by-me' : ''}`,
                {
                    params: params
                }
            )
        );
        return response?.data;
    } catch (err) {
        console.error(err);
    }
};

export const GetLeadInListingFormat = async (id) => {
    try {
        const response = await adios(() =>
            axios.get(`${crmEndpoint}/lead/${id}/dto`)
        );
       
        return response?.data;
    } catch (e) {
        console.log(`An error occurred in the process. Details: ${e}`);
    }
};
export const GetLead = async (id) => {
    try {
        const response = await adios(() =>
            axios.get(`${crmEndpoint}/lead/${id}`)
        );
       
        return response?.data;
    } catch (e) {
        console.log(`An error occurred in the process. Details: ${e}`);
    }
};
export const UpdateLead = async (lead) => {
    try {
        const response = await adios(() =>
            axios.patch(`${crmEndpoint}/lead`, lead)
        );
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const DeleteLead = async (id) => {
    try {
        const response = await adios(() =>
            axios.delete(`${crmEndpoint}/lead/${id}`)
        );
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const DeleteLeads = async (ids) => {
    try {
        const response = await adios(() =>
            axios.post(`${crmEndpoint}/leads`, { ids: ids })
        );
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const GetLeadStaticData = async () => {
    try {
        const results = await adios(() =>
            axios.get(`${crmEndpoint}/leadStaticData`)
        );
        return results?.data;
    } catch (err) {
        console.error(err);
    }
};

export const MakeLeadFavourite = async ({ id }) => {
    try {
        const payload = { id };
        const response = await adios(() =>
            axios.post(`${crmEndpoint}/favourite/lead`, payload)
        );
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const SearchUsers = async (searchTerm, params) => {
    try {
        return await adios(() =>
            axios.get(`${crmEndpoint}/Users/Search`, {
                params: {
                    ...params,
                    searchTerm: encodeURIComponent(searchTerm)
                }
            })
        );
    } catch (err) {
        console.error(err);
    }
};
