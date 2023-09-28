import axios from 'axios';
import { starter2Api, crmEndpoint } from '../constants/Endpoint';
import { adios } from '@adserve/adserve-react-components';
import {
    campaignStationsArrayToDictionary,
    campaignStationsDictionaryToArray,
    getCampaignGoalDefaults,
    formatGoal,
    generateMonthlyPoNumbers,
    sanitiseGoal
} from './UtilsService';

export const GetAll = async (ep) => {
    const result = await adios(() => axios.get(`${starter2Api}/${ep}`));
    return result?.data.data;
};

export const GetCampaignInListingFormat = async (id) => {
    const result = await adios(() =>
        axios.get(`${starter2Api}/campaigns/${id}/dto`)
    );
    return result?.data;
};

export const GetCampaign = async (id) => {
    const result = await adios(() =>
        axios.get(`${starter2Api}/campaign/${id}`)
    );
    const camp = result?.data;

    if (camp.currentPlan?.reservedUntil) {
        camp.currentPlan.reservedUntil = new Date(
            Date.parse(camp.currentPlan.reservedUntil)
        );
    }

    if (!Array.isArray(camp.campaignGoal)) {
        camp.campaignGoal = getCampaignGoalDefaults();
    }
    camp.campaignGoal = sanitiseGoal(camp.campaignGoal);
    camp.campaignGoal = formatGoal(camp.campaignGoal);

    if (!camp.poNumbersJson) {
        camp.poNumbersJson = {
            single: '',
            multiple: generateMonthlyPoNumbers(camp.startDate, camp.endDate),
            usingSingle: false
        };
    }

    camp.campaignStations = campaignStationsDictionaryToArray(
        JSON.parse(camp.campaignStations)
    );
    if (camp.advancedOptions.applicableDayParts) {
        camp.applicableDayParts = JSON.parse(
            camp.advancedOptions.applicableDayParts
        );
        camp.dayWeights = JSON.parse(camp.advancedOptions.dayWeights);
    }
    return result?.data;
};

export const GetCampaigns = async (params) => {
    const results = await adios(() =>
        axios.get(`${starter2Api}/campaigns/search`, {
            params
        })
    );
    return results?.data;
};

export const GetCampaignSettings = async () => {
    const result = await adios(() =>
        axios.get(`${starter2Api}/campaignsettings`)
    );
    return result?.data;
};

export const ToggleCampaignFavourite = async (id) => {
    await adios(() => axios.post(`${starter2Api}/favourite/campaign`, { id }));
};

export const DeleteCampaign = async (id) => {
    const result = await adios(() =>
        axios.delete(`${starter2Api}/Campaign/${id}`)
    );
    return result?.data;
};

export const DeleteCampaigns = async (ids) => {
    try {
        const response = await adios(() =>
            axios.post(`${crmEndpoint}/campaigns`, { ids: ids })
        );
        return response;
    } catch (err) {
        console.error(err);
    }
};

export const CreateCampaign = async (campaign) => {
    campaign.advancedOptions.applicableDayParts = JSON.stringify(
        campaign.applicableDayParts
    );
    campaign.advancedOptions.dayWeights = JSON.stringify(campaign.dayWeights);
    const result = await adios(() =>
        axios.post(`${starter2Api}/campaign`, {
            ...campaign,
            campaignStations: JSON.stringify(
                campaignStationsArrayToDictionary(campaign.campaignStations)
            )
        })
    );
    return result.data;
};

export const TopCampaignsLookup = async (params) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Campaigns/TopCampaigns`, {
            params: params
        })
    );

    return results?.data?.data;
};

export const StatusCampaignsLookup = async (params) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Campaigns/CampaignsByStatus`, {
            params: params
        })
    );

    return results?.data?.data;
};

export const CampaignsPerformanceLookup = async (params) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Campaigns/CampaignsPerformance`, {
            params: params
        })
    );

    return results?.data;
};

export const CampaignsLookup = async (searchTerm, params) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Campaigns/Lookup`, {
            params: {
                ...params,
                searchTerm: encodeURIComponent(searchTerm)
            }
        })
    );

    return results.data;
};

// Gets the contacts for all the accounts associated with the campaign
export const GetCampaignAccountContacts = async (id) => {
    const results = await adios(() =>
        axios.get(`${crmEndpoint}/Campaigns/${id}/AccountContacts`)
    );
    return results.data;
};

export const UpdateCampaignContacts = async (id, campaignContacts) => {
    const payload = { id, campaignContacts };
    const response = await adios(() =>
        axios.patch(`${crmEndpoint}/Campaigns/${id}/CampaignContacts`, payload)
    );
    return response;
};

export const SearchCampaignOwner = async (name, params) => {
    const response = await adios(() =>
        axios.get(`${crmEndpoint}/users/search`, {
            params: {
                ...params,
                searchTerm: encodeURIComponent(name)
            }
        })
    );

    return response?.data;
};

export const GetAllProductCategories = async () => {
    const response = await adios(() =>
        axios.get(`${starter2Api}/productcategories/selectlist`)
    );

    return response.data;
};

export const CreateCampaignFromLead = async (payload) => {
    return await adios(() =>
        axios.post(`${crmEndpoint}/campaigns/fromlead`, payload)
    );
};
