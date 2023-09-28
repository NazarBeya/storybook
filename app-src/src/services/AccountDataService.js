import axios from 'axios';
import { crmEndpoint, endpoint } from '../constants/Endpoint';
import { adios } from '@adserve/adserve-react-components';

export const GetAccountSettings = async () => {
    const result = await adios(() => axios.get(`${endpoint}/accountsettings`));
    return result?.data;
};

export const GetAccounts = async (params, myAccounts = false) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/accounts${myAccounts ? '/created-by-me' : ''}`, {
            params: {
                ...params,
                accountTypes: JSON.stringify(params.accountTypes)
            }
        })
    );
    return results?.data;
};

export const GetAccountInListingFormat = async (id) => {
    const result = await adios(() => axios.get(`${crmEndpoint}/account/${id}/dto`));
    return result?.data;
};

export const GetAccount = async (id) => {
    const result = await adios(() => axios.get(`${crmEndpoint}/account/${id}`));
    return result?.data;
};

export const GetAllChildAccounts = async (parentAccountId) => {
    const result = await adios(() =>
        axios.get(`${crmEndpoint}/account/GetAllChildByParentId`, {
            params: {
                parentAccountId: parentAccountId
            }
        })
    );
    return result?.data;
};

export const ToggleAccountFavourite = async (id) => {
    await adios(() => axios.post(`${crmEndpoint}/favourite/account`, { id }));
};

export const GetAccountStaticData = async () => {
    const results = await adios(() => axios.get(`${crmEndpoint}/accountstaticdata`));
    return results?.data;
};

export const CreateAccount = async (account) => {
    const result = await adios(() => axios.post(`${crmEndpoint}/account`, account));
    return result.data;
};

export const UpdateAccount = async (account) => {
    await adios(() => axios.patch(`${crmEndpoint}/account`, account));
};

export const DeleteAccount = async (id) => {
    try {
        const response = await adios(() => axios.delete(`${crmEndpoint}/account/${id}`));
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const DeleteAccounts = async (ids) => {
    try {
        const response = await adios(() => axios.post(`${crmEndpoint}/accounts`, { ids: ids }));
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const SearchAccountsByNameAndType = async (searchTerm, params, type) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Accounts/NamesByNameStartsAndType`, {
            params: {
                ...params,
                name: encodeURIComponent(searchTerm),
                accountType: type
            }
        })
    );

    return results.data;
};

export const SearchAccountsByNameContains = async (searchTerm) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Accounts/NamesByNameContains`, {
            params: {
                name: encodeURIComponent(searchTerm)
            }
        })
    );

    return results?.data;
};

export const SearchAccountsByLeadCompanyNameAndLeadEmails = async (companyName, emailWork, emailOther) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Accounts/NamesForLeadConversion`, {
            params: {
                leadCompanyName: encodeURIComponent(companyName),
                leadEmailWork: encodeURIComponent(emailWork),
                leadEmailOther: encodeURIComponent(emailOther)
            }
        })
    );

    return results?.data;
};

export const AccountsLookup = async (searchTerm, params, type, accountName) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Accounts/Lookup`, {
            params: {
                ...params,
                searchTerm: encodeURIComponent(searchTerm),
                accountType: type,
                accountName: accountName
            }
        })
    );

    return results?.data;
};

export const AccountsSearch = async (startsWith) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Accounts/Lookup`, {
            params: {
                startsWith: encodeURIComponent(startsWith),
                pageSize: 5
            }
        })
    );

    return results?.data;
};

export const GetAccountContacts = async (id, params) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Account/${id}/Contacts`, {
            params: params
        })
    );
    return results;
};

export const GetAccountCampaigns = async (id, params) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Account/${id}/Campaigns`, {
            params: params
        })
    );
    return results;
};

export const GetAccountDeals = async (params) => {
    const results = await adios(() =>
        axios.get(`${endpoint}/dealversions/clientandagency`, {
            params
        })
    );
    return results?.data;
};

export const GetOffairTypes = async () => {
    const results = await adios(() => axios.get(endpoint + '/offairTypes/?pageSize=1000'));

    return results?.data?.data;
};

export const GetVatRates = async () => {
    // ToDo: To be removed
    return [
        { id: 1, name: '5%' },
        { id: 2, name: '15%' },
        { id: 3, name: '20%' }
    ];
};

export const GetVatDates = async () => {
    // ToDo: To be removed
    try {
        const results = await adios(() => axios.get(endpoint + '/vatDates'));
        const res = results?.data?.data;
        res.forEach((v) => {
            v.name = `${v.rate}%`;
        });
        return res;
    } catch (e) {
        return [];
    }
};

export const GetAllEffectiveVats = async () => {
    try {
        const results = await adios(() => axios.get(endpoint + '/Vats/AllEffectiveVats'));
        const res = results?.data;
        res.forEach((v) => {
            v.name = `${v.rate}%`;
        });
        return res;
    } catch (e) {
        return [];
    }
};

export const GetInvoice = async (id) => {
    // console.log('GetInvoice id', id);
    const result = await adios(() => axios.get(`${endpoint}/invoice/${id}`));

    // console.log('GetInvoice result?.data', result?.data);
    return result?.data;
};

export const GetAccountInvoiceHeaders = async (
    params,
    showInvoiceRuns = true,
    showIndividualInvoices = true,
    showCreditNotes = true
) => {
    // TODO: find a neater way to get flagged enums to play with
    let show = '';
    if (showInvoiceRuns) {
        show += 'InvoiceRuns,';
    }
    if (showIndividualInvoices) {
        show += 'IndividualInvoices,';
    }
    if (showCreditNotes) {
        show += 'CreditNotes,';
    }

    params = {
        ...params,
        show: show.substring(0, show.length - 1)
    };

    const results = await adios(() =>
        axios.get(`${endpoint}/invoiceHeaders/search`, {
            params
        })
    );

    return results?.data;
};

export const GetSearchAccountForwardSchedule = async (params) => {
    const results = await adios(() =>
        axios.get(`${endpoint}/forwardschedule/ForwardScheduleAccount/`, {
            params
        })
    );
    return results?.data;
};

export const GetAccountForwardSchedule = async (params) => {
    const results = await adios(() =>
        axios.get(`${endpoint}/forwardschedule/search`, {
            params
        })
    );
    return results?.data;
};

export const CreateInvoice = async (invoice) => {
    const result = await adios(() => axios.post(`${endpoint}/invoice`, invoice));
    return result.data;
};

export const UpdateInvoice = async (invoice) => {
    await adios(() => axios.patch(`${endpoint}/invoice`, invoice));
};

export const GetAccountHistoryByAccountId = async (params) => {
    const result = await adios(() =>
        axios.get(`${crmEndpoint}/accounthistories/search`, {
            params
        })
    );
    return result?.data;
};

export const GetAllAccountStatuses = async () => {
    const result = await adios(() =>
        axios.get(`${crmEndpoint}/accountstatuses`, {
            params: {
                includeInactive: true
            }
        })
    );
    return result?.data.data;
};

export const LinkAccountContact = async (accountId, contactId) => {
    try {
        await adios(() => axios.post(`${crmEndpoint}/account/${accountId}/linkcontact`, { accountId, contactId }));
    } catch (err) {
        console.error(err);
    }
};
