import axios from 'axios';
import { crmEndpoint } from '../constants/Endpoint';
import { adios } from '@adserve/adserve-react-components';

export const upload = (
    file,
    onUploadProgress,
    entityId,
    name,
    description,
    entityType
) => {
    try {
        // eslint-disable-next-line no-undef
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('fileName', file.name);
        formData.append('description', description);
        formData.append('type', 1);
        formData.append('entityId', entityId);
        return adios(() =>
            axios.post(`${crmEndpoint}/attachment/${entityType}`, formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress
            })
        );
    } catch (err) {
        console.error(err);
    }
};

export const download = async ({ id }, entityType) => {
    console.log('downloading:', entityType);
    try {
        adios(() =>
            axios.get(`${crmEndpoint}/attachment/${entityType}/${id}`, {
                responseType: 'blob'
            })
        ).then((response) => {
            const data = window.URL.createObjectURL(response.data);
            console.log(response.data);
            window.open(data);
        });
    } catch (err) {
        console.error(err);
    }
};

export const updateAttachment = async (attachment, entityType) => {
    try {
        const response = await adios(() =>
            axios.patch(`${crmEndpoint}/attachment/${entityType}`, attachment)
        );
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const deleteAttachment = async ({ id }, entityType) => {
    try {
        const response = await adios(() =>
            axios.delete(`${crmEndpoint}/attachment/${entityType}/${id}`)
        );
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const getAttachments = (params, entityType) => {
    try {
        return adios(() =>
            axios.get(`${crmEndpoint}/attachments/${entityType}`, {
                params: params
            })
        );
    } catch (err) {
        console.error(err);
    }
};

export default {
    upload,
    download,
    updateAttachment,
    deleteAttachment,
    getAttachments
};
