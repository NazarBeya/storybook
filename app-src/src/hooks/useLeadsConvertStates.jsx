import { useContext } from 'react';
import { LeadsConvertContext } from '../pages/LeadsDetails/LeadsConvertContext';

const useLeadsConvertStates = () => {
    const {
        accounts,
        selectedAccount,
        campaignOwner,
        campaignOwnerSearchTerm,
        campaignName,
        startDate,
        endDate,
        leadType,
        businessType,
        setAccounts,
        setSelectedAccount,
        setCampaignOwner,
        setCampaignOwnerSearchTerm,
        setCampaignName,
        setStartDate,
        setEndDate,
        setLeadType,
        setBusinessType
    } = useContext(LeadsConvertContext);

    return {
        accounts,
        selectedAccount,
        campaignOwner,
        campaignOwnerSearchTerm,
        campaignName,
        startDate,
        endDate,
        leadType,
        businessType,
        setAccounts,
        setSelectedAccount,
        setCampaignOwner,
        setCampaignOwnerSearchTerm,
        setCampaignName,
        setStartDate,
        setEndDate,
        setLeadType,
        setBusinessType
    };
};

export default useLeadsConvertStates;
