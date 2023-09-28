import axios from 'axios';
import { crmEndpoint } from '../constants/Endpoint';
import { adios } from '@adserve/adserve-react-components';

export const createNote = async (note, entityType) => {
    try {
        return await adios(() =>
            axios.post(`${crmEndpoint}/note/${entityType}`, note)
        );
    } catch (err) {
        console.error(err);
    }
};

export const updateNote = async (note, entityType) => {
    try {
        return await adios(() =>
            axios.patch(`${crmEndpoint}/note/${entityType}`, note)
        );
    } catch (err) {
        console.error(err);
    }
};

export const getNote = async (id, entityType) => {
    try {
        return await adios(() =>
            axios.get(`${crmEndpoint}/note/${entityType}/${id}`)
        );
    } catch (err) {
        console.error(err);
    }
};

export const deleteNote = async (id, entityType) => {
    try {
        return await adios(() =>
            axios.delete(`${crmEndpoint}/note/${entityType}/${id}`)
        );
    } catch (err) {
        console.error(err);
    }
};

export default {
    createNote,
    updateNote,
    getNote,
    deleteNote
};
