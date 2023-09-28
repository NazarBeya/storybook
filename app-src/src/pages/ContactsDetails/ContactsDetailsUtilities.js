import { GetAccount } from '../../services/AccountDataService';

export const UseSiteAccountAddress = async (id) => {
    const result = await GetAccount(id);
    return {
        addressLine1: result?.siteAddressLine1 ? result.siteAddressLine1 : '',
        addressLine2: result?.siteAddressLine2 ? result.siteAddressLine2 : '',
        city: result?.siteCity ? result.siteCity : '',
        country: result?.siteCountry ? result.siteCountry : '',
        county: result?.siteCounty ? result.siteCounty : '',
        postcode: result?.sitePostcode ? result.sitePostcode : ''
    };
};

export const EmptyAddress = () => {
    return {
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        county: '',
        postcode: ''
    };
};
