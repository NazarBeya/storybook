import React, { useEffect, useState } from 'react';
import { AsButton, Flex, AsLabel } from '@adserve/adserve-react-components';
import AsTextWithStatusAndSearch from '../../components/generic/AsTextWithStatusAndSearch';
import { labelStyle, inputStyle as globalInputStyle } from '../../styles';
import { SearchAccountsByLeadCompanyNameAndLeadEmails, AccountsSearch } from '../../services/AccountDataService';
import { CreateCampaignFromLead, CampaignsLookup } from '../../services/CampaignsDataService';
import useCompactTableSearch from '../../hooks/useCompactTableSearch';
import Modal from '../../components/generic/Modal/Modal';
import { DefaultInputStatus, SuccessInputStatus, ErrorInputStatus } from '../../services/UtilsService';
import useLeadsConvertStates from '../../hooks/useLeadsConvertStates';
import { campaignManagerUrl } from '../../constants/Urls';

const inputStyle = {
    ...globalInputStyle,
    border: '1px solid #D7D7D7',
    borderRadius: '5px 0 0 5px',
    backgroundColor: '#FFFDF4',
    color: '#414141'
};

const accountDropdownStyle = {
    fontFamily: 'roboto',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    listStyleType: 'none',
    marginTop: 8
};

const accountDropdownContainerStyle = {
    border: '1px solid #CCCCCC',
    margin: 0,
    boxSizing: 'border-box',
    padding: '0px 15px 8px 15px',
    borderRadius: '0 0 15px 15px',
    position: 'absolute',
    zIndex: 99,
    background: 'white',
    width: 281,
    textAlign: 'left'
};

const cellPadding = '16px';

const LeadConvertModal = ({ lead, isShowing = false, onClose, onSave, ...props }) => {
    const [accountExpand, setAccountExpand] = useState(false);
    const [budget, setBudget] = useState(0);
    const [demographicId, setDemographicId] = useState();
    const [campaignTypeId, setCampaignTypeId] = useState();

    const {
        accounts,
        selectedAccount,
        campaignOwner,
        campaignName,
        businessType,
        startDate,
        endDate,
        leadType,
        setAccounts,
        setSelectedAccount,
        setCampaignName
    } = useLeadsConvertStates();

    const [nameStatus, setNameStatus] = useState(() => DefaultInputStatus());
    const [accountStatus, setAccountStatus] = useState(() => DefaultInputStatus());
    const [nameSearchResults, setNameSearchResults] = useState([]);
    const [accountSearchResults, setAccountSearchResults] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [userAccountName, setUserAccountName] = useState('');
    const [isUserAccountName, setIsUserAccountName] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const minLengthToStartSearch = 1;

    const handleCampaignNameChange = (event) => {
        setCampaignName(event.target.value);
        setAccountExpand(false);
    };

    const handleAccountSelect = (account) => {
        setIsUserAccountName(false);
        setUserAccountName('');
        setSelectedAccount(account);
        setAccountExpand(false);
    };

    const handleDropdownAccounts = () => {
        setAccountExpand(!accountExpand);
    };

    const handleOnAccountChange = (e) => {
        if (isUserAccountName) {
            setUserAccountName(e.target.value);
        } else {
            setIsUserAccountName(true);
            setSelectedAccount(null);
            setUserAccountName(e.target.value[e.target.value.length - 1]);
            setAccountExpand(true);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            accountSearch(userAccountName);
        }, 250);

        return () => clearTimeout(delayDebounceFn);
    }, [userAccountName]);

    const handleConvertButtonClick = () => {
        setIsLoading(true);
        const payload = {
            leadId: lead.id,
            campaignName: campaignName,
            campaignTypeId: campaignTypeId,
            accountId: selectedAccount.id,
            accountName: selectedAccount.accountName,
            campaignOwnerId: campaignOwner.id,
            demographicId: lead.demographicId,
            budget: budget || 0,
            startDate: lead.startDate,
            endDate: lead.endDate,
            leadType: leadType,
            businessType: lead.businessType,
            productCategoryId: lead.productCategoryId
        };

        CreateCampaignFromLead(payload)
            .then((data) => {
                const campaign = data.data;
                localStorage.setItem('AdserveGoBackUrl', window.location.href);
                window.open(
                    `${campaignManagerUrl}/campaigns/details?campaignId=${campaign.id}&readOnly=false&goBack=true`,
                    '_self'
                );
            })
            .catch(console.log)
            .finally(() => setIsLoading(false));
    };

    const hasAccountOnlyOption = accounts?.length === 1;
    const { getSearchResult } = useCompactTableSearch();

    useEffect(() => {
        if (isShowing) {
            const result = getSearchResult(lead.id);
            if (result && Object.keys(result).length > 0) {
                // shouldn't be empty object
                const selected = {
                    id: result.id,
                    accountName: result.name,
                    suggestion: `Add to existing: ${result.name}`
                };

                setAccounts([selected]);
                setSelectedAccount(selected);
            } else {
                SearchAccountsByLeadCompanyNameAndLeadEmails(lead.company, lead.emailWork, lead.emailOther)
                    .then((data) => {
                        setAccounts(data);

                        if (data.length === 1 && selectedAccount == null) {
                            // only option
                            setSelectedAccount(data[0]);
                        }
                    })
                    .catch(console.log);
            }

            setBudget(lead.budget);
            setCampaignTypeId(lead.campaignTypeId);
            setDemographicId(lead.demographicId);
        } else {
            setAccountExpand(false);
        }
    }, [isShowing]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            nameSearch(campaignName);
        }, 250);

        return () => clearTimeout(delayDebounceFn);
    }, [campaignName]);

    const nameSearch = async (searchValue) => {
        if (!searchValue || searchValue.length < minLengthToStartSearch) {
            setNameSearchResults([]);
            setNameStatus(DefaultInputStatus());
            return;
        }

        if (searchValue.length >= minLengthToStartSearch) {
            const results = await CampaignsLookup(searchValue, { useFirstColumnOnly: true });

            const searchData = results?.data.map((p) => p.name.trim());

            if (searchData.findIndex((data) => data.toLowerCase() === searchValue.toLowerCase().trim()) === -1) {
                setNameStatus(SuccessInputStatus());
            } else {
                setNameStatus(ErrorInputStatus('Campaign name already exists'));
            }
            setNameSearchResults(searchData);
        }
    };

    const getAccountItem = (item, index) => {
        return (
            <li key={index} style={accountDropdownStyle} onClick={() => handleAccountSelect(item)}>
                {item.suggestion}
            </li>
        );
    };

    const accountSearch = async (searchValue) => {
        if (!searchValue || searchValue.length < minLengthToStartSearch) {
            setAccountSearchResults([]);
            setAccountStatus(DefaultInputStatus());
            return;
        }

        if (searchValue.length >= minLengthToStartSearch) {
            const results = await AccountsSearch(searchValue);

            const searchData = results?.data.map((p) => p.name.trim());
            let searchResults = [];
            if (searchData.findIndex((data) => data.toLowerCase() === searchValue.toLowerCase().trim()) === -1) {
                searchResults.push({
                    id: null,
                    accountName: searchValue,
                    suggestion: `Create new account: ${searchValue}`
                });
            }

            results?.data.map((item) =>
                searchResults.push({
                    id: item.id,
                    accountName: item.name,
                    suggestion: `Add to existing: ${item.name}`
                })
            );
            setAccountSearchResults(searchResults);
            setAccountExpand(true);
        }
    };

    const isCampaignNameValid = campaignName && nameStatus.statusMessage === undefined;
    // selectedAccount.id can be null when creating a new account. Thus, it's not included in validation rule.
    const isAccountValid = selectedAccount && selectedAccount.accountName;

    useEffect(() => {
        if (isCampaignNameValid && isAccountValid && campaignOwner?.id) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [campaignName, nameStatus, selectedAccount, campaignOwner]);

    return (
        <Modal
            {...props}
            id='lead-convert-modal'
            isShowing={isShowing}
            hide={onClose}
            title={window.translate('Convert Lead')}
            modalBodyStyle={{ height: 298, width: 595 }}
        >
            <Flex style={{ flexDirection: 'column' }}>
                <Flex
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 15,
                        marginBottom: 24
                    }}
                >
                    <div style={{ width: 281, marginBottom: 22 }}>
                        <AsTextWithStatusAndSearch
                            id='campaign-name'
                            title={window.translate('Campaign name *')}
                            labelStyle={{ ...labelStyle, marginBottom: 0 }}
                            inputStyle={globalInputStyle}
                            value={campaignName}
                            onChange={handleCampaignNameChange}
                            searchStatus={nameStatus}
                            searchResults={nameSearchResults}
                            statusLabelStyle={{ position: 'inherit' }}
                            searchResultsStyle={{ textAlign: 'left' }}
                            disabled={isLoading}
                        />
                    </div>
                    <div style={{ width: 281 }}>
                        <AsLabel>{window.translate('Account name')}</AsLabel>
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <input
                                    style={inputStyle}
                                    type='text'
                                    value={
                                        (isUserAccountName
                                            ? userAccountName
                                            : hasAccountOnlyOption && !selectedAccount
                                            ? accounts[0].suggestion
                                            : selectedAccount?.suggestion) || ''
                                    }
                                    placeholder='Select...'
                                    onClick={handleDropdownAccounts}
                                    onChange={handleOnAccountChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {accountExpand && (
                                <ul style={accountDropdownContainerStyle}>
                                    {accountSearchResults?.length > 0
                                        ? accountSearchResults.map((item, index) => getAccountItem(item, index))
                                        : accounts?.map((item, index) => getAccountItem(item, index))}
                                </ul>
                            )}
                        </div>
                    </div>
                </Flex>
                <Flex
                    style={{
                        padding: cellPadding,
                        justifyContent: 'center'
                    }}
                >
                    <AsButton handleClick={onClose} useTertiaryStyle style={{ marginRight: 30 }} disabled={isLoading}>
                        {window.translate('Cancel')}
                    </AsButton>
                    <AsButton disabled={!isFormValid || isLoading} handleClick={handleConvertButtonClick}>
                        {window.translate('Convert')}
                    </AsButton>
                </Flex>
            </Flex>
        </Modal>
    );
};

export default LeadConvertModal;
