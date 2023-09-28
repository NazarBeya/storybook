import axios from 'axios';
import { endpoint } from '../constants/Endpoint';
import { adios } from '@adserve/adserve-react-components';

export const CreateAccountRequest = async (workflowId, accountId) => {
    const json = JSON.stringify({
        workflowType: 0,
        objectId: accountId,
        uri: `${window.location.origin}/crm/accounts/action`
    });
    const result = await adios(() =>
        axios.post(`${endpoint}/workflow/request`, {
            workflowId: workflowId,
            jsonData: json,
            objectId: accountId,
            workflowType: 0
        })
    );
    return result.data;
};

export const GetActiveDiscountWorkflowRequest = async (workflowId, accountId) => {
    const result = await adios(() => axios.get(`${endpoint}/workflowRequest/${workflowId}/${accountId}`));
    return result?.data;
};

export const ActionWorkflow = async (requestId, transitionId, actionId) => {
    await adios(() =>
        axios.post(`${endpoint}/workflow/actionRequest`, {
            requestId,
            transitionId,
            actionId
        })
    );
};
