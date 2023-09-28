import {
    AsTab,
    AsTabContainer,
    RadioDropdownButton,
    AsButton,
    Flex,
    useModal,
    isAuthorised
} from '@adserve/adserve-react-components';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AccountNotesAndAttachments from '../../components/AccountNotesAndAttach/AccountNotesAndAttach';
import AccountDetails from '../../components/AccountDetails';
import AccountDeals from '../../components/AccountDeals/AccountDeals';
import DetailPageContainer from '../../components/containers/DetailPageContainer';
import useSessionReducer from '../../hooks/useSessionReducer';
import { BusinessTypes } from '../../constants/Enums';
import {
    UpdateAccount,
    GetAccountContacts,
    GetAccountCampaigns,
    GetAccount,
    DeleteAccount,
    GetAccountStaticData,
    GetAllAccountStatuses,
    LinkAccountContact,
    GetAccountSettings
} from '../../services/AccountDataService';
import ContactsGrid from '../ContactsLanding/ContactsGrid';
import useSession from '../../hooks/useSession';
import useRecordState from '../../hooks/useRecordState';
import CampaignsGrid from '../Campaigns/CampaignsGrid';
import AttachmentDropdownButton from '../../components/Attachments/AttachmentDropdownButton';
import { sessionClearAllDetailsExcept, sessionClearAllDetailsFor } from '../../services/SessionService';
import { dealManagerUrl, campaignManagerUrl } from '../../constants/Urls';
import AccountBilling from '../../components/AccountBilling/AccountBilling';
import DeleteModal from '../../components/DeleteModal';
import { check } from 'prettier';
import LinkContactsModal from './LinkContactsModal';

const tabPanelStyle = {
    boxShadow: 'unset',
    border: 'unset',
    borderRadius: 'unset',
    backgroundColor: '#f0f0f0'
};

const AccountDetailsPage = () => {
    const history = useHistory();
    const location = useLocation();
    const reducer = (state, updatedValues) => ({ ...state, ...updatedValues });

    const [currentAccount, currentAccountDispatcher] = useSessionReducer(
        'currentAccount',
        reducer,
        {}
    );
    const [currentAccountDetails, setCurrentAccountDetails] = useState([]);
    const query = new URLSearchParams(useLocation().search);
    const accountId = query.get('accountId');
    const goBack = query.get('goBack');
    const [goBackUrl, setGoBackUrl] = useState(null);
    const [selectedParentId, setSelectedParentId] = useState(0);
    const [selectedChildId, setSelectedChildId] = useState(0);
    const [readOnly, setReadOnly] = useSession('currentAccountReadOnly');
    const { isModalShowing, dataIsModified, resetDataModified, routePath } = useRecordState();
    const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false);
    const [creditStatuses, setCreditStatuses] = useState([]);
    const [creditTypes, setCreditTypes] = useState([]);
    const [paymentTerms, setPaymentTerms] = useState([]);
    const [accountTypesDetails, setAccountTypesDetails] = useState([]);
    const [accountStatuses, setAccountStatuses] = useState([]);
    const [isUpdatedRequestApprovalFields, setIsUpdatedRequestApprovalFields] = useState(false);
    const [isClickOnRequestApproval, setIsClickOnRequestApproval] = useState(false);
    const [isNullAnyMandatoryFields, setIsNullAnyMandatoryFields] = useState([]);
    const [isClickOnUpdate, setIsClickOnUpdate] = useState(false);
    const [isNullAnyMandatoryTextFields, setIsNullAnyMandatoryTextFields] = useState([]);
    const [requestApprovalButtonShowing, setRequestApprovalButtonShowing] = useState(false);
    const [errorAccountTypeInputStatus, setErrorAccountTypeInputStatus] = useState('');
    const [isShowingContactsModal, setIsShowingContactsModal] = useState(false);
    const [isSameSiteAddress, setIsSameSiteAddress] = useState(false);
    const [requireApproval, setRequireApproval] = useState(false);

    const { addMessage } = useModal();

    const [tab, setTab, delTab] = useSession(
        'accountsDetailsTab',
        location?.state?.selectedTab ? location?.state?.selectedTab : 0
    );

    useEffect(() => {
        GetAccountSettings()
            .then((data) => {
                setRequireApproval(data.requireApproval);
            })
            .catch(console.log);

        GetAccountStaticData()
            .then((data) => {
                setAccountTypesDetails(data.accountTypes);
                setCreditStatuses(data.creditStatuses);
                setCreditTypes(data.creditTypes);
                setPaymentTerms(data.paymentTerms);
                setAccountStatuses(data.accountStatuses);
            })
            .catch(console.log);

        if (accountId) {
            GetAccount(accountId)
                .then((data) => {
                    currentAccountDispatcher(data);
                    setCurrentAccountDetails(data);
                    setSelectedParentId(data.id);
                })
                .catch(console.log);

            getGoBackUrl();
        }

    }, []);

    const getGoBackUrl = () => {
        const adserveGoBackUrl = localStorage.getItem('AdserveGoBackUrl');
        if (adserveGoBackUrl) {
            localStorage.removeItem('AdserveGoBackUrl');
            setGoBackUrl(adserveGoBackUrl);
        }
    };

    useEffect(() => {
        // if data is already in session then use that rather than getting again
        // as this may overwrite unsaved values
        // if (Object.keys(currentAccount).length === 0) {
        if (location?.state?.redirectedFrom !== 'search') {
            if (selectedChildId && currentAccount.id !== selectedChildId) {
                const accountId = selectedChildId;
                GetAccount(accountId)
                    .then((data) => {
                        currentAccountDispatcher(data);
                        setCurrentAccountDetails(data);
                        setSelectedParentId(data.id);
                    })
                    .catch(console.log);
            }
            else {
                if (!accountId) {
                    let accId;
                    accId = location?.state?.accountId || currentAccount.id
                    GetAccount(accId)
                        .then((data) => {
                            currentAccountDispatcher(data);
                            setCurrentAccountDetails(data);
                            setSelectedParentId(data.id);
                        })
                        .catch(console.log);
                }
            }
        }

        if (location?.state?.selectedTab && tab !== location?.state?.selectedTab) setTab(location?.state?.selectedTab);

        switch (location?.state?.selectedTab) {
            case 2:
                handleContactsData();
                break;

            case 3:
                handleCampaignsData();
                break;

            default:
                break;
        }

        setReadOnly(location?.state?.readOnly ?? readOnly ?? true);
        sessionClearAllDetailsExcept('account');
        window.scrollTo(0, 0);
        return delTab;
    }, [location?.state, selectedChildId]);

    useEffect(() => {
        if (creditStatuses.length) {
            const ApprovedcreditStatuse = creditStatuses.find((x) => x.shortRef === 'A');
            if (currentAccountDetails.creditStatusId === ApprovedcreditStatuse.id) {
                // Check given field if it is empty string, set it to null to fix issue into update the creditStatus if any field is updated
                let checkFields = [
                    'accountName',
                    'accountTypeId',
                    'parentAccountId',
                    'companyRegistrationNo',
                    'vatNumber',
                    'siteAddressLine1',
                    'siteAddressLine2',
                    'siteCity',
                    'siteCountry',
                    'sitePostcode',
                    'siteCountry',
                    'requiredCreditLimit'
                ];

                if (!isSameSiteAddress) {
                    checkFields = [
                        ...checkFields,
                        'billingAddressLine1',
                        'billingAddressLine2',
                        'billingCity',
                        'billingCounty',
                        'billingPostcode',
                        'billingCountry'
                    ];
                }

                const billingFields = [
                    'billingAddressLine1',
                    'billingAddressLine2',
                    'billingCity',
                    'billingCounty',
                    'billingPostcode',
                    'billingCountry'
                ];

                // set creditStatus to Not Applied if any of given field is updated
                if (checkFields.includes('billingAddressLine1') || billingFields.includes('billingAddressLine1')) {
                    const creditStatuse = creditStatuses.find((x) => x.shortRef === 'NAP');

                    const hasChange =
                        (currentAccountDetails['billingAddressLine1'] ?? '') !== (currentAccount['billingAddressLine1'] ?? '') ||
                        checkFields.some((f) => f !== 'billingPostcode' && (currentAccount[f] ?? '') !== (currentAccountDetails[f] ?? ''));

                    if (hasChange) {
                        updateAccount('creditStatusId', creditStatuse.id);
                        setIsUpdatedRequestApprovalFields(true);
                    } else {
                        updateAccount('creditStatusId', currentAccountDetails.creditStatusId);
                        setIsUpdatedRequestApprovalFields(false);
                    }
                }
            }
        }
    }, [isSameSiteAddress])

    useEffect(() => {
        setTab(location?.state?.selectedTab ?? 0);
    }, [isModalShowing]);

    const handleClose = () => {
        resetDataModified();
        if (goBackUrl) {
            window.open(goBackUrl, '_self');
        } else if (goBack) {
            history.goBack();
        } else if (location?.state?.path) {
            // Sorry this is hacky but run out of time
            history.goBack();
        } else {
            history.push(routePath ?? '/accounts');
        }

    };

    const handleEditClick = () => {
        setReadOnly(false);
    };

    const handleDeleteConfirm = async () => {
        const response = await DeleteAccount(currentAccount.id);
        if (response.status === 200) {
            sessionClearAllDetailsFor('account');
            handleClose();
        }
    };

    const setAccountExpired = async () => {
        const allAccountStatuses = await GetAllAccountStatuses();
        const expiredAccountStatus = allAccountStatuses.find((x) => x.shortRef === 'EXP');

        UpdateAccount({ ...currentAccount, accountStatusId: expiredAccountStatus.id })
            .then(() => {
                resetDataModified();
                history.push(routePath ?? '/accounts');
            })
            .catch(console.log);
    };

    const handleUpdate = () => {
        UpdateAccount({
            ...currentAccount,
            name: currentAccount.accountName,
            accountStatusId: currentAccount.accountStatusId === '-1' ? window.emptyGuid : currentAccount.accountStatusId,
            paymentTermId: currentAccount.paymentTermId === '-1' ? window.emptyGuid : currentAccount.paymentTermId,
            industryId: currentAccount.industryId === '-1' ? window.emptyGuid : currentAccount.industryId,
            accountTypeId: currentAccount.accountTypeId === '-1' ? window.emptyGuid : currentAccount.accountTypeId,
            ratingId: currentAccount.ratingId === '-1' ? window.emptyGuid : currentAccount.ratingId,
            creditStatusId: currentAccount.creditStatusId === '-1' ? window.emptyGuid : currentAccount.creditStatusId,
            creditTypeId: currentAccount.creditTypeId === '-1' ? window.emptyGuid : currentAccount.creditTypeId,
            vatId: currentAccount.vatId === '-1' ? window.emptyGuid : currentAccount.vatId,
            currencyId: currentAccount.currencyId === '-1' ? window.emptyGuid : currentAccount.currencyId,
        })
            .then(() => {
                resetDataModified();
                if (!requestApprovalButtonShowing) {
                    history.push(routePath ?? '/accounts');
                }
            })
            .catch(console.log);
    };

    const updateAccount = (name, value) => {
        if (currentAccount[name] !== value) {
            currentAccountDispatcher({ [name]: value });
            if (!currentAccount.currentBalance) {
                currentAccountDispatcher({ currentBalance: 0 });
            }
            dataIsModified();
        }
    };

    const getAccountId = () => {
        // ToDo: Maybe removed/refactored later
        const accountId = location?.state?.accountId || currentAccount.id;
        return accountId;
    };

    const handleAccountChange = (event) => {
        let { name, value } = event.target;

        if (name === 'requiredCreditLimit') {
            value = parseInt(value === '' ? 0 : value);
        }

        if (name === 'revenueCommissionRate' && value < 0) {
            value = 0;
        }
        if (name === 'revenueCommissionRate' && value > 100) {
            value = 100;
        }

        if (name === 'commissionRate' && value < 0) {
            value = 0;
        }

        if (name === 'commissionRate' && value > 100) {
            value = 100;
        }

        // Check if Payment Terms and Credit Limit to select Approved Credit status’
        if (name === 'creditStatusId') {
            const ApprovedcreditStatuse = creditStatuses.find((x) => x.shortRef === 'A');
            if (ApprovedcreditStatuse.id === value) {
                if (
                    (
                        currentAccount.paymentTermId === null ||
                        currentAccount.paymentTermId === undefined ||
                        currentAccount.paymentTermId === '-1' ||
                        currentAccount.paymentTermId === window.emptyGuid
                    ) ||
                    currentAccount.creditLimit <= 0 ||
                    (
                        currentAccount.creditTypeId === null ||
                        currentAccount.creditTypeId === undefined ||
                        currentAccount.creditTypeId === '-1' ||
                        currentAccount.creditTypeId === window.emptyGuid
                    )
                ) {
                    updateAccount('creditTypeId', currentAccountDetails.id);
                    addMessage({
                        message: window.translate(
                            'Unable to approve credit status until payment terms, credit type and credit limit values have been entered'
                        ),
                        buttons: [
                            {
                                text: window.translate('Back')
                            }
                        ]
                    });
                    return;
                }
            }
        }

        if (!name) throw new Error('name attribute not defined');
        updateAccount(name, value);

        // Check Mandatory fields on Request Approval
        const mandatoryFields = [
            'accountName',
            'billingAddressLine1',
            'billingCity',
            'billingPostcode',
            'requiredCreditLimit'
        ];

        if (isClickOnRequestApproval === true) {
            if (mandatoryFields.includes(name) || name === 'companyRegistrationNo' || name === 'vatNumber') {
                if (value === '' || value === null || value === undefined || value === '0' || value === 0) {
                    isNullAnyMandatoryFields.push(name);
                } else {
                    const index = isNullAnyMandatoryFields.indexOf(name);
                    if (index !== -1) {
                        isNullAnyMandatoryFields.splice(index, 1);
                    }
                }
            }
        }

        // Check Mandatory fields on Update CTA for approval account only
        const mandatoryFieldsOnUpdate = [
            'accountName',
            'billingAddressLine1',
            'billingCity',
            'billingPostcode',
            'requiredCreditLimit',
            'companyRegistrationNo',
            'vatNumber',
            'accountTypeId',
            'paymentTermId',
            'creditLimit',
            'creditTypeId',
            'vatId',
            'currencyId',
            'accountStatusId'
        ];

        if (requireApproval && creditStatuses.length) {
            const ApprovedcreditStatuse = creditStatuses.find((x) => x.shortRef === 'A');
            if (currentAccountDetails.creditStatusId === ApprovedcreditStatuse.id) {
                if (isClickOnUpdate === true) {
                    if (mandatoryFieldsOnUpdate.includes(name)) {
                        if (value === '' || value === null || value === undefined || value === '0' || value === 0 || value <= 0 || !value) {
                            isNullAnyMandatoryTextFields.push(name);
                        } else {
                            const index = isNullAnyMandatoryTextFields.indexOf(name);
                            if (index !== -1) {
                                isNullAnyMandatoryTextFields.splice(index, 1);
                            }
                        }
                    }
                }
            }
        }

        // Set Commission Rate based on Section of account type
        if (name === 'accountTypeId') {
            const accountType = accountTypesDetails.find((x) => x.id === value);
            if (accountType) {
                updateAccount('commissionRate', accountType.commission);
            }
            setErrorAccountTypeInputStatus('');
        }

        if (requireApproval && creditStatuses.length) {
            const ApprovedcreditStatuse = creditStatuses.find((x) => x.shortRef === 'A');
            if (currentAccountDetails.creditStatusId === ApprovedcreditStatuse.id) {

                // Check given field if it is empty string, set it to null to fix issue into update the creditStatus if any field is updated
                let checkFields = [
                    'accountName',
                    'accountTypeId',
                    'parentAccountId',
                    'companyRegistrationNo',
                    'vatNumber',
                    'siteAddressLine1',
                    'siteAddressLine2',
                    'siteCity',
                    'siteCountry',
                    'sitePostcode',
                    'siteCountry',
                    'requiredCreditLimit'
                ];

                if (!isSameSiteAddress) {
                    checkFields = [
                        ...checkFields,
                        'billingAddressLine1',
                        'billingAddressLine2',
                        'billingCity',
                        'billingCounty',
                        'billingPostcode',
                        'billingCountry'
                    ];
                }

                // set creditStatus to Not Applied if any of given field is updated
                if (checkFields.includes(name)) {
                    const creditStatuse = creditStatuses.find((x) => x.shortRef === 'NAP');

                    const hasChange =
                        (currentAccountDetails[name] ?? '') !== (value ?? '') ||
                        checkFields.some((f) => f !== name && (currentAccount[f] ?? '') !== (currentAccountDetails[f] ?? ''));

                    if (hasChange) {
                        updateAccount('creditStatusId', creditStatuse.id);
                        setIsUpdatedRequestApprovalFields(true);
                    } else {
                        updateAccount('creditStatusId', currentAccountDetails.creditStatusId);
                        setIsUpdatedRequestApprovalFields(false);
                    }
                }
            }
        }

        const rejectCreditStatuse = creditStatuses.find((x) => x.shortRef === 'R');
        const prepayCreditType = creditTypes.find((x) => x.shortRef === 'PRP');

        // set 0 Days to Payment Terms if creditStatus is reject or crediType is PrePay
        if (name === 'creditStatusId' || name === 'creditTypeId') {
            const paymentTerm = paymentTerms.find((x) => x.shortRef === '0DS');
            if (rejectCreditStatuse || prepayCreditType) {
                if (value === rejectCreditStatuse.id || value === prepayCreditType.id) {
                    updateAccount('paymentTermId', paymentTerm.id);
                }
            }
        }

        // set Expired to creditStatus if Account Status is Dormant
        if (name === 'accountStatusId') {
            const dormantAccountStatus = accountStatuses.find((x) => x.shortRef === 'DOR');
            const expiredCreditStatus = creditStatuses.find((x) => x.shortRef === 'EX');
            if (dormantAccountStatus || expiredCreditStatus) {
                if (value === dormantAccountStatus.id) {
                    updateAccount('creditStatusId', expiredCreditStatus.id);
                } else {
                    const defaultCreditStatus = creditStatuses?.find((c) => c?.isDefault);
                    if (defaultCreditStatus) {
                        updateAccount('creditStatusId', defaultCreditStatus.id);
                    }
                }
            }
        }

        // set credittype based onc CreditStatus
        if (name === 'creditStatusId' && creditStatuses.length) {
            const approvedCreditStatus = creditStatuses.find((x) => x.shortRef === 'A');
            const onAccountCreditType = creditTypes.find((x) => x.shortRef === 'CRA');

            if (value === rejectCreditStatuse.id) {
                updateAccount('creditTypeId', prepayCreditType.id);
            }
            if (value === approvedCreditStatus.id) {
                updateAccount('creditTypeId', onAccountCreditType.id);
            }
        }
    };

    const handleContactsData = async (params) => {
        const accountId = location?.state?.accountId || currentAccount.id;
        const contacts = await GetAccountContacts(accountId, params);
        return contacts;
    };

    const handleCampaignsData = async (params) => {
        const accountId = location?.state?.accountId || currentAccount.id;
        const campaigns = await GetAccountCampaigns(accountId, params);
        return campaigns.data;
    };

    // Navigation handlers for passing account data to Contacts, could alternatively be generic accepting args
    const handleAddContactClick = (option) => {
        if (option === 'Create new') {
            history.push({
                pathname: '/contacts/create',
                state: {
                    account: currentAccount,
                    path: location?.pathname,
                    readOnly: false
                },
                onClose: handleHistoryClose
            });
        } else {
            setIsShowingContactsModal(true);
        }
    };

    const handleContactEditClick = (payload) => {
        history.push({
            pathname: '/contacts/details',
            state: {
                contactId: payload.id,
                path: location?.pathname,
                readOnly: false
            },
            onClose: handleHistoryClose
        });
    };

    const handleContactReadOnlyClick = (payload) => {
        history.push({
            pathname: '/contacts/details',
            state: {
                contactId: payload.id,
                path: '/accounts/details',
                readOnly: true
            },
            onClose: handleHistoryClose
        });
    };

    const handleCampaignCreateClick = (businessType) => {
        if (businessType === BusinessTypes.DIGITAL.text) {
            return;
        }

        if (businessType === BusinessTypes.SANDP.text) {
            businessType = 'SAndP';
        }

        if (businessType === BusinessTypes.OFFAIRS.text) {
            businessType = 'OffAirs';
        }

        const campaignAccount = {};
        switch (currentAccount?.accountType?.toLowerCase()) {
            case 'agency':
                campaignAccount.agencyAccountId = currentAccount.id;
                campaignAccount.agencyAccountName = currentAccount.accountName;
                campaignAccount.commissionRate = currentAccount?.commissionRate
                break;
            case 'advertiser':
                campaignAccount.advertiserAccountId = currentAccount.id;
                campaignAccount.advertiserAccountName = currentAccount.accountName;
                campaignAccount.productCategoryId = currentAccount?.productCategoryId;
                campaignAccount.productCategoryName = currentAccount?.productCategoryName;
                campaignAccount.commissionRate = currentAccount?.commissionRate
                break;
            default:
                return;
        }
        campaignAccount.goBackUrl = window.location.href;
        localStorage.setItem(
            'AdserveCampaignAccount',
            JSON.stringify(campaignAccount)
        );
        window.open(
            `${campaignManagerUrl}/campaigns/create?campaignId=${window.emptyGuid
            }&businessType=${encodeURIComponent(
                businessType
            )}&readOnly=false&goBack=true`,
            '_self'
        );
    };

    const handleDealCreateClick = () => {
        window.open(
            `${dealManagerUrl}/?accountId=${currentAccount?.id}&accountType=${currentAccount.accountType}`,
            '_self'
        );
    };

    const handleHistoryClose = () => {
        history.push({
            pathname: '/accounts/details',
            state: {
                accountId: location?.state?.accountId,
                readOnly: location?.state?.readOnly,
                selectedTab: tab
            }
        });
    };

    const handleLinkContactsSelect = (contact) => {
        LinkAccountContact(currentAccount.id, contact.id).then(() => {
            setIsShowingContactsModal(false);
        });
    };
    const financeReadOnly = !isAuthorised('CRM_FIN_CON');

    return (
        <DetailPageContainer
            title={
                currentAccount?.accountName ||
                window.translate('Existing Account')
            }
            onClose={handleClose}
            onEdit={handleEditClick}
            onDelete={() => setIsDeleteModalShowing(true)}
            deleteDisabled={!currentAccount?.allowDelete}
            readOnly={readOnly}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <AsTabContainer
                        style={{ height: 'unset' }}
                        tabPanelStyle={tabPanelStyle}
                        onTabClick={setTab}
                        initalTab={tab}
                    >
                        <AsTab title={window.translate('Detail')}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {currentAccount && (
                                    <AccountDetails
                                        readOnly={readOnly}
                                        account={currentAccount}
                                        onCancel={handleClose}
                                        onUpdate={handleUpdate}
                                        onChange={handleAccountChange}
                                        onChangeByName={updateAccount}
                                        returnPath='/accounts/details'
                                        setSelectedParentId={setSelectedParentId}
                                        selectedParentId={selectedParentId}
                                        selectedChildId={selectedChildId}
                                        setSelectedChildId={setSelectedChildId}
                                        accountTypes={accountTypesDetails}
                                        isUpdatedRequestApprovalFields={isUpdatedRequestApprovalFields}
                                        setIsUpdatedRequestApprovalFields={setIsUpdatedRequestApprovalFields}
                                        setCurrentAccountDetails={setCurrentAccountDetails}
                                        currentAccountDetails={currentAccountDetails}
                                        accountDispatcher={currentAccountDispatcher}
                                        onGetContacts={handleContactsData}
                                        isNullAnyMandatoryFields={isNullAnyMandatoryFields}
                                        setIsNullAnyMandatoryFields={setIsNullAnyMandatoryFields}
                                        setIsClickOnRequestApproval={setIsClickOnRequestApproval}
                                        setRequestApprovalButtonShowing={setRequestApprovalButtonShowing}
                                        errorAccountTypeInputStatus={errorAccountTypeInputStatus}
                                        setErrorAccountTypeInputStatus={setErrorAccountTypeInputStatus}
                                        setIsSameSiteAddress={setIsSameSiteAddress}
                                        setIsClickOnUpdate={setIsClickOnUpdate}
                                        isNullAnyMandatoryTextFields={isNullAnyMandatoryTextFields}
                                        setIsNullAnyMandatoryTextFields={setIsNullAnyMandatoryTextFields}
                                    />
                                )}
                            </div>
                        </AsTab>
                        <AsTab title='Notes & Attachments'>
                            <Flex style={{ flexDirection: 'column' }}>
                                <AttachmentDropdownButton
                                    entityId={currentAccount?.id}
                                    heading={currentAccount?.accountName}
                                    entityType='account'
                                    onClose={handleHistoryClose}
                                />
                                <AccountNotesAndAttachments
                                    entityId={getAccountId()}
                                    entityType='account'
                                    onClose={handleHistoryClose}
                                    heading={currentAccount?.accountName}
                                />
                            </Flex>
                        </AsTab>
                        <AsTab title='Contacts'>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {/* <AsButton
                                    id='accountcontact-createnew'
                                    style={{
                                        alignSelf: 'flex-end',
                                        position: 'absolute',
                                        width: 130,
                                        marginTop: -47,
                                        marginRight: 33,
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                    }}
                                    handleClick={handleContactCreateClick}
                                >
                                    {window.translate('Create New')}
                                </AsButton> */}
                                <div
                                    style={{
                                        alignSelf: 'flex-end',
                                        position: 'absolute',
                                        width: 130,
                                        marginTop: -47,
                                        marginRight: 33,
                                    }}
                                >
                                    <RadioDropdownButton
                                        id='accountcontact-createnew'
                                        panelStyle={{ zIndex: 200 }}
                                        text={window.translate('Add contact')}
                                        options={[window.translate('Create new'), window.translate('Link existing')]}
                                        createClick={handleAddContactClick}
                                    />
                                </div>
                                <ContactsGrid
                                    onGetData={handleContactsData}
                                    onEditClick={handleContactEditClick}
                                    onReadOnlyClick={handleContactReadOnlyClick}
                                    isModalShowing={isShowingContactsModal}
                                    modalResult={true}
                                />
                            </div>
                        </AsTab>
                        {/* You should be able to wrap the following in a frgment but this results in only the campaigns tab appearing and it has no title...? */}
                        {(currentAccount?.accountType?.toLowerCase() ===
                            'agency' ||
                            currentAccount?.accountType?.toLowerCase() ===
                            'advertiser') && (
                                <AsTab title='Campaigns'>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <div
                                            style={{
                                                zIndex: 210,
                                                alignSelf: 'flex-end',
                                                position: 'absolute',
                                                width: 130,
                                                marginTop: -47,
                                                marginRight: 33,
                                                fontSize: 14,
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <RadioDropdownButton
                                                id='new-campaign'
                                                text={window.translate(
                                                    'Create New'
                                                )}
                                                options={[
                                                    window.translate(
                                                        BusinessTypes.AIRTIME.text
                                                    ),
                                                    window.translate(
                                                        BusinessTypes.SANDP.text
                                                    ),
                                                    window.translate(
                                                        BusinessTypes.OFFAIRS.text
                                                    ),
                                                    window.translate(
                                                        BusinessTypes.PACKAGE.text
                                                    ),
                                                    window.translate(
                                                        BusinessTypes.DIGITAL.text
                                                    )
                                                ]}
                                                createClick={
                                                    handleCampaignCreateClick
                                                }
                                            />
                                        </div>
                                        <CampaignsGrid
                                            onGetData={handleCampaignsData}
                                        />
                                    </div>
                                </AsTab>
                            )}
                        {(currentAccount?.accountType?.toLowerCase() ===
                            'agency' ||
                            currentAccount?.accountType?.toLowerCase() ===
                            'advertiser') && (
                                <AsTab title='Deals'>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <AsButton
                                            id='accountdeals-createnew'
                                            style={{
                                                alignSelf: 'flex-end',
                                                position: 'absolute',
                                                width: 130,
                                                marginTop: -47,
                                                marginRight: 33,
                                                fontSize: 14,
                                                fontWeight: 'bold'
                                            }}
                                            handleClick={handleDealCreateClick}
                                            disabled={financeReadOnly}
                                        >
                                            {window.translate('Create New')}
                                        </AsButton>
                                        <AccountDeals accountId={getAccountId()} />
                                    </div>
                                </AsTab>
                            )}
                        {(currentAccount?.accountType?.toLowerCase() ===
                            'agency' ||
                            currentAccount?.accountType?.toLowerCase() ===
                            'advertiser') && (
                                <AsTab title='Billing'>
                                    <Flex style={{ flexDirection: 'column' }}>
                                        <AccountBilling
                                            readOnly={readOnly}
                                            account={currentAccount}
                                        />
                                    </Flex>
                                </AsTab>
                            )}
                    </AsTabContainer>
                </div>
            </div>
            <DeleteModal
                isShowing={isDeleteModalShowing}
                onClose={() => setIsDeleteModalShowing(false)}
                onSubmit={setAccountExpired}
                entityName='account'
            />
            <LinkContactsModal
                isShowing={isShowingContactsModal}
                onClose={() => setIsShowingContactsModal(false)}
                onSelect={handleLinkContactsSelect}
            />
        </DetailPageContainer>
    );
};

export default AccountDetailsPage;
