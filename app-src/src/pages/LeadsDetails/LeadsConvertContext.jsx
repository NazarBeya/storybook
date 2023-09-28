import React, { useState } from 'react';

export const LeadsConvertContext = React.createContext({
    accounts: [],
    selectedAccount: null,
    campaignOwner: null,
    campaignOwnerSearchTerm: '',
    campaignName: '',
    startDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    demographicId: window.emptyGuid,
    leadType: '',
    businessType: 0,
    setAccounts: () => {},
    setSelectedAccount: () => {},
    setCampaignOwner: () => {},
    setCampaignOwnerSearchTerm: () => {},
    setCampaignName: () => {},
    setStartDate: () => {},
    setEndDate: () => {},
    setLeadType: () => {},
    setBusinessType: () => {},
    setDemographicId: () => {}
});

export default function CompactTableSearchProvider({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [campaignOwner, setCampaignOwner] = useState(null);
    const [campaignOwnerSearchTerm, setCampaignOwnerSearchTerm] = useState('');
    const [campaignName, setCampaignName] = useState('');
    const [leadType, setLeadType] = useState('');
    const [businessType, setBusinessType] = useState(0);

    const [startDate, setStartDate] = useState(
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    );
    const [endDate, setEndDate] = useState(
        new Date(new Date().setMonth(new Date().getMonth() + 1))
    );

    const contextValue = {
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

    return (
        <LeadsConvertContext.Provider value={contextValue}>
            {children}
        </LeadsConvertContext.Provider>
    );
}
