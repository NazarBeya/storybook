import axios from 'axios';
import { crmEndpoint } from '../constants/Endpoint';
import { adios } from '@adserve/adserve-react-components';
import qs from 'qs';

// NOTE: Catch currently logs to console, if we need to keep an error log or otherwise access the error this would return e instead

// CRUD contacts
export const CreateContact = async (payload) => {
    try {
        const result = await adios(() =>
            axios.post(`${crmEndpoint}/Contact`, payload)
        );
        return result;
    } catch (e) {
        console.log(`An error occurred in the process. Details: ${e}`);
    }
};

export const GetContacts = async (params, myContacts = false) => {
    try {
        const results = await adios(() =>
            axios.get(
                `${crmEndpoint}/Contacts${myContacts ? '/created-by-me' : ''}`,
                {
                    params: params
                }
            )
        );

        return results;
    } catch (e) {
        console.log(`An error occurred in the process. Details: ${e}`);
    }
};

export const GetContactInListingFormat = async (id) => {
    try {
        const result = await adios(() =>
            axios.get(`${crmEndpoint}/Contact/${id}/dto`)
        );
        return result?.data;
    } catch (e) {
        console.log(`An error occurred in the process. Details: ${e}`);
    }
};

export const UpdateContact = async (payload) => {
    try {
        const result = await adios(() =>
            axios.patch(`${crmEndpoint}/Contact`, payload)
        );
        return result;
    } catch (e) {
        console.log(`An error occurred in the process. Details: ${e}`);
    }
};

export const DeleteContact = async (id) => {
    try {
        const result = await adios(() =>
            axios.delete(`${crmEndpoint}/Contact/${id}`)
        );
        return result;
    } catch (e) {
        console.log(`An error occurred in the process. Details: ${e}`);
    }
};

export const DeleteContacts = async (ids) => {
    try {
        const response = await adios(() =>
            axios.post(`${crmEndpoint}/contacts`, { ids: ids })
        );
        return response;
    } catch (err) {
        console.error(err);
    }
};

// CRUD contacts static data
export const GetContactStaticData = async () => {
    try {
        const results = await adios(() =>
            axios.get(`${crmEndpoint}/ContactStaticData`)
        );
        return results?.data;
    } catch (e) {
        console.log(`An error occurred in the process. Details: ${e}`);
    }
};

export const ContactsLookup = async (searchTerm, params) => {
    // Strip out any empty array items before sending
    if (params?.filter) {
        params.filter = params.filter.filter((item) => item);
    }

    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Contacts/Lookup`, {
            params: {
                ...params,
                searchTerm: encodeURIComponent(searchTerm)
            },
            paramsSerializer: (params) => {
                return qs.stringify(params);
            }
        })
    );

    return results.data;
};

// Other handlers that rely on backend processing or use backend packages e.g. axios
export const PostFavourite = async (payload) => {
    const result = await adios(() =>
        axios.post(crmEndpoint + '/favourite/contact', payload)
    );
    return result;
};

export const GetContactRoles = async () => {
    const results = await adios(() => axios.get(`${crmEndpoint}/ContactRoles`));
    return results;
};

export const GetContactCampaigns = async (id, params) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Contact/${id}/Campaigns`, {
            params: params
        })
    );
    return results;
};

export const UpdateContactCampaigns = async (id, contactCampaigns) => {
    const payload = { id, contactCampaigns };
    const response = await adios(() =>
        axios.patch(
            `${crmEndpoint}/Contact/${id}/ContactCampaigns`,
            payload
        )
    );
    return response;
};

export const GetContactHistoryByAccountId = async (params) => {
    const result = await adios(() =>
        axios.get(`${crmEndpoint}/contacthistories/search`, {
            params
        })
    );
    return result?.data;
};