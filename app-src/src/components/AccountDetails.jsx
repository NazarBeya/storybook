import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AutoFlex from './containers/AutoFlex';
import {
    labelStyle,
    inputStyle,
    disabledSelectStyle,
    sectionedPanelStyle,
    iconPlusMinimiseStyle,
    historyPanelStyle
} from '../styles';
import AsTextWithStatusAndSearch from './generic/AsTextWithStatusAndSearch';
import {
    AsText,
    LabelledTickbox,
    AsLabel,
    AsButton,
    useModal,
    Spacer,
    AsNumber,
    Tickbox,
    isAuthorised
} from '@adserve/adserve-react-components';
import { ReactComponent as IconParent } from '../svg/Icon_Parent.svg';
import {
    GetAccountStaticData,
    SearchAccountsByNameAndType,
    AccountsLookup,
    GetAccountSettings,
    GetAllChildAccounts,
    UpdateAccount
} from '../services/AccountDataService';
import CompactTable from './generic/CompactTable/CompactTable';
import AdvertiserCompactTableColumnDefinitions from '../pages/Campaigns/AdvertiserCompactTableColumnDefinitions';
import DetailsButtons from './inputs/DetailsButtons';
import CrmSelect from './inputs/CrmSelect';
import {
    IsValidContactNumber,
    DefaultInputStatus,
    SuccessInputStatus,
    ErrorInputStatus
} from '../services/UtilsService';
import SaveConfirmModal from './SaveConfirmModal';
import useRecordState from '../hooks/useRecordState';
import { GetAllProductCategories, SearchCampaignOwner } from '../services/CampaignsDataService';
import { CreateAccountRequest, GetActiveDiscountWorkflowRequest } from '../services/WorkflowService';
import ParentAccountTableColumnDefinitions from './generic/ParentAccount/ModalParentAccount/ParentAccountColumnDefinitions';
import ParentAccountTableModal from './generic/ParentAccount/ModalParentAccount/ParentAccountTableModal';
import { SystemSettingsContext } from '../contexts/SystemSettingsContext';
import moment from 'moment';
import AccountHistory from './AccountDetails/AccountHistory';
import { ReactComponent as IconPlus } from '../svg/Icon_Plus.svg';
import { ReactComponent as IconMinimise } from '../svg/Icon_Minus.svg';
import { EmptyAddress } from '../pages/ContactsDetails/ContactsDetailsUtilities';
import UserCompactTableColumnDefinitions from './AccountDetails/UserCompactTableColumnDefinitions';

const containerStyle = {
    display: 'flex',
    flexDirection: 'column'
};
// const cellPadding = '17px 42px 0px 116px';
export const cellPadding = '8px 42px 0px 42px';

const requiredBriefDetailLineStyle = {
    display: 'flex',
    width: '100%'
};

const requiredBriefDetailComponentStyle = {
    padding: cellPadding,
    width: '25%'
};

const iconStyle = {
    width: 32,
    height: 31,
    marginLeft: -8,
    fill: '#414141',
    paddingLeft: 5
};

export const cancelMessageButtonStyle = {
    width: 87,
    border: '2px solid #CCCCCC',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer'
};

export const okMessageButtonStyle = {
    height: 36,
    width: 130,
    border: '2px solid #FD9A00',
    backgroundColor: '#FAA800',
    cursor: 'pointer'
};

const modalStyle = {
    whiteSpace: 'pre-line'
};

const errorStyle = {
    borderColor: '#C40606',
    backgroundColor: '#FFF3F3'
};

const statusLabelStyle = {
    position: 'absolute',
    color: '#C40606',
    fontSize: 12,
    marginTop: 0
};

const mandatoryFieldsStyle = {
    fontSize: 12
};

const AccountDetails = ({
    account,
    readOnly = false,
    creating = false,
    onChange,
    onChangeByName,
    onCreate,
    onUpdate,
    onCancel,
    returnPath,
    selectedParentId,
    setSelectedChildId,
    accountTypes,
    isUpdatedRequestApprovalFields,
    setIsUpdatedRequestApprovalFields,
    accountDispatcher,
    currentAccountDetails,
    onGetContacts,
    isNullAnyMandatoryFields,
    setIsNullAnyMandatoryFields,
    setIsClickOnRequestApproval,
    setRequestApprovalButtonShowing,
    errorAccountTypeInputStatus,
    setErrorAccountTypeInputStatus,
    setIsSameSiteAddress,
    setIsClickOnUpdate,
    isNullAnyMandatoryTextFields,
    setIsNullAnyMandatoryTextFields
}) => {
    const { formatNumber, formatCurrency } = useContext(SystemSettingsContext);
    const history = useHistory();
    const { addMessage } = useModal();
    // states
    const [approvalEnabled, setApprovalEnabled] = useState(true);
    const [data, setData] = useState([]);
    const [isAnyChild, setIsAnyChild] = useState(false);
    const [modalShowing, setModalShowing] = useState(false);
    const [accountStatuses, setAccountStatuses] = useState([]);
    const [sentiments, setSentiments] = useState([]);
    const [creditTypes, setCreditTypes] = useState([]);
    const [paymentTerms, setPaymentTerms] = useState([]);
    const [vatCodes, setVatCodes] = useState([]);
    const [creditStatuses, setCreditStatuses] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [nameStatus, setNameStatus] = useState(() => DefaultInputStatus());
    const [nameSearchResults, setNameSearchResults] = useState([]);
    const [telNumStatus, setTelNumStatus] = useState(() => DefaultInputStatus());
    const [useSameAddress, setUseSameAddress] = useState(false);
    const minLengthToStartSearch = 3;
    const [requireApproval, setRequireApproval] = useState(false);
    const [approvalWorkflowId, setApprovalWorkflowId] = useState();
    const [activeRequest, setActiveRequest] = useState();
    const [addressPanelOpen, setAddressPanelOpen] = useState(!readOnly);
    const { isModalShowing, showConfirmSaveModal, resetDataModified } = useRecordState();
    const [closeSearch, setCloseSearch] = useState(false);
    const [validationInput, setValidationInput] = useState(true);
    const [mandatoryErrorMessage, setMandatoryErrorMessage] = useState('');

    useEffect(() => {
        GetAccountSettings()
            .then((data) => {
                setRequireApproval(data.requireApproval);
                setApprovalWorkflowId(data.approvalWorkflowId);
            })
            .catch(console.log);

        GetAccountStaticData()
            .then((data) => {
                setAccountStatuses(data.accountStatuses);
                setSentiments(data.sentiments);
                setCreditTypes(data.creditTypes);
                setPaymentTerms(data.paymentTerms);
                setVatCodes(data.vats);
                setCreditStatuses(data.creditStatuses);
                setCurrencies(data.currencies);
                setPaymentMethods(data.paymentMethods);
                setIndustries(data.industries);
                setRatings(data.ratings);
            })
            .catch(console.log);

        GetAllProductCategories()
            .then((data) => setCategories(data))
            .catch(console.log);
    }, []);

    useEffect(() => {
        if (account?.id !== undefined) {
            setIsSameSiteAddress(useSameAddress);
        }
    }, [useSameAddress]);

    const checkSameAddress = () => {
        if (
            account.siteAddressLine1 ||
            account.siteAddressLine2 ||
            account.siteCity ||
            account.siteCounty ||
            account.sitePostcode ||
            account.siteCountry
        ) {
            const addressState =
                account.billingAddressLine1 === account.siteAddressLine1 &&
                account.billingAddressLine2 === account.siteAddressLine2 &&
                account.billingCity === account.siteCity &&
                account.billingCounty === account.siteCounty &&
                account.billingPostcode === account.sitePostcode &&
                account.billingCountry === account.siteCountry;
            setUseSameAddress(addressState);
        }
    };

    const copyAddress = (checked) => {
        if (checked) {
            onChangeByName('billingAddressLine1', account.siteAddressLine1);
            onChangeByName('billingAddressLine2', account.siteAddressLine2);
            onChangeByName('billingCity', account.siteCity);
            onChangeByName('billingCounty', account.siteCounty);
            onChangeByName('billingPostcode', account.sitePostcode);
            onChangeByName('billingCountry', account.siteCountry);
        } else {
            onChangeByName('billingAddressLine1', '');
            onChangeByName('billingAddressLine2', '');
            onChangeByName('billingCity', '');
            onChangeByName('billingCounty', '');
            onChangeByName('billingPostcode', '');
            onChangeByName('billingCountry', '');
        }
    };

    useEffect(() => {
        if (!readOnly) {
            nameSearch(account.name, false);
        }
    }, [account.name]);

    useEffect(() => {
        checkSameAddress();
    }, [
        account.billingAddressLine1,
        account.billingAddressLine2,
        account.billingCity,
        account.billingCounty,
        account.billingPostcode,
        account.billingCountry
    ]);

    const nameSearch = async (searchValue, validationOnly) => {
        let retValue = true;

        if ((!searchValue || searchValue.length < minLengthToStartSearch) && !validationOnly) {
            setNameSearchResults([]);
            setNameStatus(DefaultInputStatus());
            return retValue;
        }

        if (validationOnly && !searchValue) {
            setNameStatus(ErrorInputStatus('Account name is required'));
            return false;
        }

        const results = await SearchAccountsByNameAndType(searchValue);

        const searchData = results?.data.filter((p) => p.id !== account.id).map((p) => p.name.trim());

        if (searchData.findIndex((data) => data.toLowerCase() === searchValue.toLowerCase().trim()) === -1) {
            if (!validationOnly) {
                setNameStatus(SuccessInputStatus());
            }
        } else {
            setNameStatus(ErrorInputStatus('Account name already exists'));
            retValue = false;
        }

        if (!validationOnly) {
            setNameSearchResults(searchData);
        }

        return retValue;
    };

    const isAccountTypeScriptValid = (accountTypeId) => {
        accountTypeId = accountTypeId ?? account.accountTypeId;
        if (!accountTypeId || accountTypeId <= 0) {
            setErrorAccountTypeInputStatus(window.translate('Account type is required'));
            return false;
        } else {
            setErrorAccountTypeInputStatus('');
            return true;
        }
    };

    const handleTelephoneChange = (event) => {
        onChange(event);
        const telnum = event.target.value;
        if (!readOnly && telnum?.length > 5) {
            telNumSearch(telnum, false);
        }
    };

    const telNumSearch = async (searchValue, validationOnly) => {
        const retValue = true;

        if ((!searchValue || searchValue.length < minLengthToStartSearch) && !validationOnly) {
            setTelNumStatus(DefaultInputStatus());
            return retValue;
        }

        if (!IsValidContactNumber(searchValue)) {
            setTelNumStatus(ErrorInputStatus('Invalid telephone number'));
            return false;
        } else {
            setTelNumStatus(SuccessInputStatus());
        }

        return retValue;
    };

    const onCreateLocal = async () => {
        const isInputValid = await isValidateFormInput(false);
        const isTypeScriptValid = isAccountTypeScriptValid();
        if (isInputValid && isTypeScriptValid) {
            onCreate();
        }
    };

    const onUpdateLocal = async () => {
        if (requireApproval && creditStatuses.length) {
            const ApprovedcreditStatuse = creditStatuses.find((x) => x.shortRef === 'A');
            if (currentAccountDetails.creditStatusId === ApprovedcreditStatuse.id) {
                if (!mandatoryTextFieldsApprovalCheck()) {
                    return;
                }
            }
        }
        const isInputValid = await isValidateFormInput(true);
        const isTypeScriptValid = isAccountTypeScriptValid();
        if (isInputValid && isTypeScriptValid) {
            onUpdate();
        } else {
            showConfirmSaveModal(false);
        }
    };

    const isValidateFormInput = async (isUpdate) => {
        let retVal = true;
        if (!isUpdate) {
            retVal = await nameSearch(account[accountName], true);
        }

        if (account?.telephoneNumber && !(await telNumSearch(account.telephoneNumber, true))) {
            retVal = false;
        }

        return retVal;
    };

    const handleParentAccountClick = () => {
        if (account.parentAccountId) {
            history.push({
                pathname: '/accounts/details',
                state: { accountId: account.parentAccountId, readOnly: true }
            });
        }
    };

    const getAllChild = (parentId) => {
        if (parentId) {
            GetAllChildAccounts(parentId)
                .then((result) => {
                    setData(result);
                    if (result.length > 0) {
                        setIsAnyChild(true);
                    } else {
                        setIsAnyChild(false);
                    }
                })
                .catch((error) => {
                    setData([]);
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        if (creditStatuses?.length && vatCodes?.length && account?.awaitingInit && accountDispatcher) {
            // set default CreditStatus
            const defaultCreditStatus = creditStatuses?.find((c) => c?.isDefault);
            account.creditStatusId = defaultCreditStatus?.id;

            // set default vatCode
            const defaultVatCode = vatCodes?.find((c) => c?.isDefault);
            account.vatId = defaultVatCode?.id;

            // set default crediType
            const creditType = creditTypes?.find((c) => c?.isDefault);
            account.creditTypeId = creditType?.id;

            // set default AccountStatus
            const accountStatus = accountStatuses?.find((c) => c?.isDefault);
            account.accountStatusId = accountStatus?.id;

            // set default accountType and Commission Rate
            const defaultAccountType = accountTypes?.find((c) => c?.isDefault);
            if (defaultAccountType) {
                account.accountTypeId = defaultAccountType.id;
                account.commissionRate = defaultAccountType.commission;
            }

            // set default Currency
            const defaultCurrency = currencies?.find((c) => c?.isDefault);
            account.currencyId = defaultCurrency?.id;

            // set 0 Days to Payment Terms if creditStatus is reject or crediType is PrePay
            const rejectCreditStatus = creditStatuses.find((x) => x.shortRef === 'R');
            const prepayCreditType = creditTypes.find((x) => x.shortRef === 'PRP');
            const paymentTerm = paymentTerms.find((x) => x.shortRef === '0DS');

            if (account.creditStatusId === rejectCreditStatus.id || account.creditTypeId === prepayCreditType.id) {
                account.paymentTermId = paymentTerm.id;
            }

            // set Expired to creditStatus if Account Status is Dormant
            const dormantAccountStatus = accountStatuses.find((x) => x.shortRef === 'DOR');
            const expiredCreditStatus = creditStatuses.find((x) => x.shortRef === 'EX');
            if (account?.id) {
                if (account.accountStatusId === dormantAccountStatus.id) {
                    account.creditStatusId = expiredCreditStatus.id;
                } else {
                    if (currentAccountDetails.creditStatusId === expiredCreditStatus.id) {
                        account.creditStatusId = defaultCreditStatus.id;
                    } else {
                        account.creditStatusId = currentAccountDetails.creditStatusId;
                    }
                }
            } else {
                if (account.accountStatusId === dormantAccountStatus.id) {
                    account.creditStatusId = expiredCreditStatus.id;
                } else {
                    account.creditStatusId = defaultCreditStatus?.id;
                }
            }

            // set credittype based onc CreditStatus
            const approvedCreditStatus = creditStatuses.find((x) => x.shortRef === 'A');
            const onAccountCreditType = creditTypes.find((x) => x.shortRef === 'CRA');

            if (account.creditStatusId === rejectCreditStatus.id) {
                account.creditTypeId = prepayCreditType.id;
            }
            if (account.creditStatusId === approvedCreditStatus.id) {
                account.creditTypeId = onAccountCreditType.id;
            }

            accountDispatcher({ ...account });
        }
    }, [
        creditStatuses?.length,
        vatCodes?.length,
        account?.awaitingInit,
        accountTypes?.length,
        creditTypes?.length,
        accountDispatcher,
        accountStatuses?.length,
        paymentTerms?.length
    ]);

    useEffect(() => {
        if (selectedParentId) {
            getAllChild(selectedParentId);
        }
    }, [selectedParentId]);

    useEffect(() => {
        if (approvalWorkflowId && account.id) {
            GetDiscountWorkflowRequest();
        }
    }, [approvalWorkflowId, account.id]);

    useEffect(() => {
        setAddressPanelOpen(!readOnly);
    }, [readOnly]);

    const handleParentAccountChange = (event) => {
        onChangeByName('parentAccount', event.target.value);
        onChangeByName('parentAccountId', null);

        if (currentAccountDetails !== undefined) {
            if (requireApproval && creditStatuses.length) {
                const ApprovedcreditStatuse = creditStatuses.find((x) => x.shortRef === 'A');
                if (currentAccountDetails.creditStatusId === ApprovedcreditStatuse.id) {
                    let value = event.target.value;
                    if (value === '') {
                        value = null;
                    }

                    const checkFields = [
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
                        'billingAddressLine1',
                        'billingAddressLine2',
                        'billingCity',
                        'billingCounty',
                        'billingPostcode',
                        'billingCountry',
                        'requiredCreditLimit'
                    ];

                    for (const field of checkFields) {
                        if (account[field] === '' && currentAccountDetails[field] === null) {
                            account[field] = null;
                        }
                    }
                    // set creditStatus to Not Applied if any of given field is updated
                    const name = 'parentAccount';
                    let hasDifference = false;

                    for (const field of checkFields) {
                        const currentAccountValue = currentAccountDetails[field];
                        const accountValue = field === name ? value : account[field];
                        hasDifference |= Boolean((currentAccountValue ?? '') !== (accountValue ?? ''));
                    }

                    if (hasDifference) {
                        const creditStatuse = creditStatuses.find((x) => x.shortRef === 'NAP');
                        account.creditStatusId = creditStatuse.id;
                        setIsUpdatedRequestApprovalFields(true);
                    } else {
                        account.creditStatusId = currentAccountDetails.creditStatusId;
                        setIsUpdatedRequestApprovalFields(false);
                    }

                    // Update ParentAccount Details
                    accountDispatcher({ ...account, parentAccount: value, parentAccountId: null });
                }
            }
        }
    };

    const handleParentAccountDropdownClick = ({ id, name }) => {
        onChangeByName('parentAccount', name);
        onChangeByName('parentAccountId', id);

        //Check Credit status if it is approved then go for Re-approve process
        if (currentAccountDetails !== undefined) {
            if (requireApproval && creditStatuses.length) {
                const ApprovedcreditStatuse = creditStatuses.find((x) => x.shortRef === 'A');
                if (currentAccountDetails.creditStatusId === ApprovedcreditStatuse.id) {
                    const checkFields = [
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
                        'billingAddressLine1',
                        'billingAddressLine2',
                        'billingCity',
                        'billingCounty',
                        'billingPostcode',
                        'billingCountry',
                        'requiredCreditLimit'
                    ];

                    // set creditStatus to Not Applied if any of given field is updated
                    const parentName = 'parentAccountId';
                    let hasDifference = false;

                    for (const field of checkFields) {
                        const currentAccountValue = currentAccountDetails[field];
                        const accountValue = field === parentName ? id : account[field];
                        hasDifference |= Boolean((currentAccountValue ?? '') !== (accountValue ?? ''));
                    }

                    if (hasDifference) {
                        const creditStatuse = creditStatuses.find((x) => x.shortRef === 'NAP');
                        account.creditStatusId = creditStatuse.id;
                        setIsUpdatedRequestApprovalFields(true);
                    } else {
                        account.creditStatusId = currentAccountDetails.creditStatusId;
                        setIsUpdatedRequestApprovalFields(false);
                    }
                    // Update ParentAccount Details
                    accountDispatcher({ ...account, parentAccount: name, parentAccountId: id });
                }
            }
        }
    };

    const handleParentAccountRemoveClick = () => {
        onChangeByName('parentAccount', '');
        onChangeByName('parentAccountId', null);
        // accountDispatcher({ ...account, parentAccount: '', parentAccountId: null });
        if (currentAccountDetails !== undefined) {
            if (requireApproval && creditStatuses.length) {
                const ApprovedcreditStatuse = creditStatuses.find((x) => x.shortRef === 'A');
                if (currentAccountDetails.creditStatusId === ApprovedcreditStatuse.id) {
                    let value = null;

                    const checkFields = [
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
                        'billingAddressLine1',
                        'billingAddressLine2',
                        'billingCity',
                        'billingCounty',
                        'billingPostcode',
                        'billingCountry',
                        'requiredCreditLimit'
                    ];

                    for (const field of checkFields) {
                        if (account[field] === '' && currentAccountDetails[field] === null) {
                            account[field] = null;
                        }
                    }
                    // set creditStatus to Not Applied if any of given field is updated
                    const name = 'parentAccountId';
                    let hasDifference = false;

                    for (const field of checkFields) {
                        const currentAccountValue = currentAccountDetails[field];
                        const accountValue = field === name ? value : account[field];
                        hasDifference |= Boolean((currentAccountValue ?? '') !== (accountValue ?? ''));
                    }

                    if (hasDifference) {
                        const creditStatuse = creditStatuses.find((x) => x.shortRef === 'NAP');
                        account.creditStatusId = creditStatuse.id;
                        setIsUpdatedRequestApprovalFields(true);
                    } else {
                        account.creditStatusId = currentAccountDetails.creditStatusId;
                        setIsUpdatedRequestApprovalFields(false);
                    }

                    // Update ParentAccount Details
                    accountDispatcher({ ...account, parentAccount: value, parentAccountId: null });
                }
            }
        }
    };

    const onAccountOwnerDropdownClick = ({ id, name }) => {
        onChangeByName('accountOwnerName', name);
        onChangeByName('accountOwnerId', id);
    };

    const handleAccountOwnerChange = (event) => {
        onChangeByName('accountOwnerName', event.target.value);
        onChangeByName('accountOwnerId', null);
    };

    const accountOwnerSearch = async (searchTerm, params) => {
        return await SearchCampaignOwner(searchTerm, params);
    };

    const handleSameAddressClick = (checked) => {
        copyAddress(checked);
        setUseSameAddress(checked);
    };

    const handleAddressUpdate = (event) => {
        const capturedEvent = event.target;
        onChange(event);
        if (useSameAddress) {
            const billingEvent = {
                target: {
                    name: capturedEvent.name.replace('site', 'billing'),
                    value: capturedEvent.value
                }
            };
            onChange(billingEvent);
        }
    };

    const handleWebsiteClick = (event) => {
        const url = event.target.value.match(/^https?:/) ? event.target.value : '//' + event.target.value;
        const win = window.open(url, '_blank');
        win?.focus();
    };

    const handleClose = () => {
        setModalShowing(false);
    };

    const handleOpen = () => {
        setModalShowing(true);
    };

    const renderApprovalButton = () => {
        const creditStatus = creditStatuses.find((x) => x.id === account.creditStatusId);

        let approved = false;

        if (creditStatus) {
            approved = creditStatus.shortRef === 'A';
        }

        if (requireApproval && !approved && !creating) {
            if (setRequestApprovalButtonShowing) setRequestApprovalButtonShowing(true);
            return (
                <AsButton
                    id='request-approval'
                    style={{
                        fontSize: 15,
                        height: 36,
                        marginTop: 20,
                        width: 136
                    }}
                    handleClick={handleRequestApprovalClick}
                    disabled={
                        readOnly || (activeRequest && activeRequest.id && !activeRequest.isComplete) || !approvalEnabled
                    }
                >
                    {(activeRequest && activeRequest.id && !activeRequest.isComplete) || !approvalEnabled
                        ? window.translate('Awaiting Approval')
                        : window.translate('Request Approval')}
                </AsButton>
            );
        } else if (setRequestApprovalButtonShowing) {
            setRequestApprovalButtonShowing(false);
        }
    };

    const GetDiscountWorkflowRequest = async () => {
        GetActiveDiscountWorkflowRequest(approvalWorkflowId, account.id).then((res) => {
            setActiveRequest(res);
        });
    };

    const sendApprovalRequest = async () => {
        setApprovalEnabled(false);
        const results = await onGetContacts(account.id);
        const isBilling = results.data.data.filter((b) => b.isBillingContact === true);
        if (isBilling.length > 0) {
            if (approvalWorkflowId) {
                CreateAccountRequest(approvalWorkflowId, account.id)
                    .then((result) => {
                        if (result.id) {
                            addMessage({
                                message: window.translate('Request submitted successfully'),
                                buttons: [
                                    {
                                        text: window.translate('Ok')
                                    }
                                ]
                            });
                            setApprovalEnabled(false);
                            setActiveRequest(result);
                        }
                    })
                    .catch((error) => {
                        addMessage({
                            message: `${window.translate('Failed to submit request.  Error:')} ${error.response.data}`,
                            buttons: [
                                {
                                    text: window.translate('Ok')
                                }
                            ]
                        });
                    });
            } else {
                setApprovalEnabled(true);
            }
        } else {
            addMessage({
                message: `${window.translate('Cannot request approval as no billing contact was created')}`,
                buttons: [
                    {
                        text: window.translate('Ok')
                    }
                ]
            });
            setApprovalEnabled(true);
        }
    };

    const updateAccountDetails = async () => {
        try {
            await UpdateAccount({ ...account, name: account.accountName });
            resetDataModified();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const mandatoryFieldApprovalCheck = () => {
        const mandatoryFields = [
            { fieldName: 'accountName', text: window.translate('Account Name') },
            { fieldName: 'billingAddressLine1', text: window.translate('Billing address - line 1') },
            { fieldName: 'billingCity', text: window.translate('Billing address - City') },
            { fieldName: 'billingPostcode', text: window.translate('Billing address - Post code / Zip') },
            { fieldName: 'requiredCreditLimit', text: window.translate('Required Credit Limit(£)') }
        ];

        let result = [];
        setMandatoryErrorMessage(window.translate('Mandatory fields required * *'));
        for (const field of mandatoryFields) {
            if (
                account[field.fieldName] === '' ||
                account[field.fieldName] === null ||
                account[field.fieldName] === undefined ||
                account[field.fieldName] === '0' ||
                account[field.fieldName] === 0
            ) {
                result.push(field.fieldName);
                setIsClickOnRequestApproval(true);
            }
        }

        if (!account.governmentAccount) {
            if (
                account.companyRegistrationNo === '' ||
                account.companyRegistrationNo === null ||
                account.companyRegistrationNo === undefined ||
                account.vatNumber === '' ||
                account.vatNumber === null ||
                account.vatNumber === undefined
            ) {
                result.push('companyRegistrationNo');
                result.push('vatNumber');
                setIsClickOnRequestApproval(true);
                setMandatoryErrorMessage(window.translate('Mandatory fields required * *'));
            }
        }

        setIsNullAnyMandatoryFields(result);
        return result.length === 0;
    };

    const mandatoryTextFieldsApprovalCheck = () => {
        const mandatoryFields = [
            { fieldName: 'accountName', text: window.translate('Account Name') },
            { fieldName: 'billingAddressLine1', text: window.translate('Billing address - line 1') },
            { fieldName: 'billingCity', text: window.translate('Billing address - City') },
            { fieldName: 'billingPostcode', text: window.translate('Billing address - Post code / Zip') },
            { fieldName: 'requiredCreditLimit', text: window.translate('Required Credit Limit(£)') },
            { fieldName: 'companyRegistrationNo', text: window.translate('Company Registration No') },
            { fieldName: 'vatNumber', text: window.translate('Vat Number') },
            { fieldName: 'accountTypeId', text: window.translate('Account Type Id') },
            { fieldName: 'paymentTermId', text: window.translate('PaymentTerm Id') },
            { fieldName: 'creditLimit', text: window.translate('Credit Limit') },
            { fieldName: 'creditTypeId', text: window.translate('CreditType Id') },
            { fieldName: 'vatId', text: window.translate('Vat Id') },
            { fieldName: 'currencyId', text: window.translate('Currency Id') },
            { fieldName: 'accountStatusId', text: window.translate('AccountStatus Id') }
        ];

        let result = [];
        for (const field of mandatoryFields) {
            if (
                account[field.fieldName] === '' ||
                account[field.fieldName] === null ||
                account[field.fieldName] === undefined ||
                account[field.fieldName] === '0' ||
                account[field.fieldName] === 0 ||
                account[field.fieldName] <= 0 ||
                !account[field.fieldName]
            ) {
                result.push(field.fieldName);
                setIsClickOnUpdate(true);
            }
        }

        setIsNullAnyMandatoryTextFields(result);
        return result.length === 0;
    };

    const handleRequestApprovalClick = async () => {
        setValidationInput(false);
        if (!mandatoryFieldApprovalCheck()) {
            return;
        }

        if (!isUpdatedRequestApprovalFields) {
            sendApprovalRequest();
            return;
        }

        addMessage({
            message: window.translate(
                'You have unsaved changes.  These need to be saved before requesting approval. Do you wish to save your changes now?'
            ),
            buttons: [
                {
                    text: window.translate('No'),
                    style: { ...cancelMessageButtonStyle, width: 132 }
                },
                {
                    text: window.translate('Yes'),
                    style: okMessageButtonStyle,
                    callback: async () => {
                        const result = await updateAccountDetails();

                        if (result) {
                            sendApprovalRequest();
                        }
                    }
                }
            ]
        });
    };

    const handleGovernmentAccountClick = () => {
        onChangeByName('governmentAccount', !account.governmentAccount);
    };

    const handleSuppressInvoiceClick = () => {
        onChangeByName('suppressInvoice', !account.suppressInvoice);
    };

    const accountName = creating ? 'name' : 'accountName';
    readOnly = readOnly || (!isAuthorised('CRM_APP_ACC') && account?.creditStatus?.toLowerCase() === 'approved');
    const financeReadOnly = !isAuthorised('CRM_FIN_CON');

    return (
        <div style={containerStyle}>
            <div style={sectionedPanelStyle}>
                <AutoFlex itemPadding='16px 42px 0 42px' style={{ color: '#141414', fontSize: 15 }}>
                    <span>{window.translate('Account Details')}</span>
                    <div style={{ display: 'flex', justifyContent: 'end', marginRight: -85, marginTop: -10 }}>
                        <span style={mandatoryFieldsStyle}>{window.translate('Mandatory Value *')}</span>
                        <span style={{ ...mandatoryFieldsStyle, marginLeft: 20 }}>{window.translate('Mandatory')}</span>
                        <span style={mandatoryFieldsStyle}>&nbsp;&#39;</span>
                        <span style={mandatoryFieldsStyle}>{window.translate('Request Approval')}</span>
                        <span style={mandatoryFieldsStyle}> &#39;&nbsp;</span>
                        <span style={mandatoryFieldsStyle}>{window.translate('* *')}</span>
                    </div>
                </AutoFlex>
                <div style={{ ...requiredBriefDetailLineStyle, marginBottom: 5 }}>
                    <div style={requiredBriefDetailComponentStyle}>
                        <AsTextWithStatusAndSearch
                            id='account-name'
                            name={accountName}
                            title={`${window.translate('Account name')} *`}
                            labelStyle={labelStyle}
                            inputStyle={{
                                ...inputStyle,
                                marginBottom: 5,
                                ...(account.id !== undefined
                                    ? isNullAnyMandatoryTextFields.includes('accountName')
                                        ? errorStyle
                                        : { borderColor: '#D7D7D7' }
                                    : { borderColor: '#D7D7D7' })
                            }}
                            value={account[accountName]}
                            disabled={readOnly}
                            onChange={onChange}
                            searchStatus={nameStatus}
                            searchResults={nameSearchResults}
                            numResultsInDropdown={0}
                        />
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <AsText
                            id='known-as-name'
                            name='knownAsName'
                            title={window.translate('Known as name')}
                            labelStyle={labelStyle}
                            inputStyle={inputStyle}
                            value={account.knownAsName}
                            disabled={readOnly}
                            onChange={onChange}
                        />
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <CrmSelect
                            id='account-type'
                            name='accountTypeId'
                            title={`${window.translate('Account type')} *`}
                            placeholder='Select ...'
                            disabledStyle={disabledSelectStyle}
                            values={accountTypes}
                            value={account.accountTypeId || 0}
                            onChange={onChange}
                            disabled={readOnly}
                            creating={creating}
                            inputStyle={{
                                ...inputStyle,
                                marginBottom: 5,
                                ...(account.id !== undefined
                                    ? isNullAnyMandatoryTextFields.includes('accountTypeId') ||
                                      errorAccountTypeInputStatus !== ''
                                        ? errorStyle
                                        : { borderColor: '#D7D7D7' }
                                    : {
                                          ...inputStyle,
                                          ...(errorAccountTypeInputStatus !== ''
                                              ? errorStyle
                                              : { borderColor: '#D7D7D7' })
                                      })
                            }}
                        />
                        {errorAccountTypeInputStatus !== '' && (
                            <label style={statusLabelStyle}>{errorAccountTypeInputStatus}</label>
                        )}
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <CrmSelect
                            id='account-rating'
                            name='ratingId'
                            title={window.translate('Account Rating')}
                            placeholder='Select ...'
                            disabledStyle={disabledSelectStyle}
                            values={ratings}
                            value={account.ratingId}
                            onChange={onChange}
                            disabled={readOnly}
                            creating={creating}
                        />
                    </div>
                </div>
                <div style={requiredBriefDetailLineStyle}>
                    <div style={requiredBriefDetailComponentStyle}>
                        <AsTextWithStatusAndSearch
                            id='main-telephone'
                            name='telephoneNumber'
                            title={window.translate('Main telephone')}
                            labelStyle={labelStyle}
                            inputStyle={{ ...inputStyle, marginBottom: 5 }}
                            maxLength={20}
                            value={account.telephoneNumber}
                            disabled={readOnly}
                            onChange={handleTelephoneChange}
                            searchStatus={telNumStatus}
                            searchResults={null}
                            numResultsInDropdown={0}
                        />
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <AsText
                            id='company-website'
                            name='companyWebsite'
                            inputType='submit'
                            title={window.translate('Company website')}
                            labelStyle={labelStyle}
                            inputStyle={{ ...inputStyle, marginBottom: 5 }}
                            value={account.companyWebsite}
                            disabled={readOnly}
                            onChange={onChange}
                            onClick={handleWebsiteClick}
                        />
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <CrmSelect
                            id='industry'
                            name='industryId'
                            title={window.translate('Industry')}
                            placeholder='Select ...'
                            disabledStyle={disabledSelectStyle}
                            values={industries}
                            value={account.industryId}
                            onChange={onChange}
                            disabled={readOnly}
                            creating={creating}
                        />
                    </div>
                    <div
                        style={{
                            ...requiredBriefDetailComponentStyle,
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: 20
                        }}
                    >
                        <div style={{ width: '100%' }}>
                            <AsLabel style={{ ...labelStyle }}>{window.translate('Parent account')}</AsLabel>
                            <CompactTable
                                id='parent-account'
                                inputStyle={{ ...inputStyle, maxWidth: readOnly ? 162 : '100%' }}
                                inputType='submit'
                                value={account.parentAccount}
                                valueId={account.parentAccountId}
                                statusMessage={window.translate('This account doesn’t exist')}
                                onChange={handleParentAccountChange}
                                searchFunction={(searchTerm, params) =>
                                    AccountsLookup(searchTerm, params, '', account[accountName])
                                }
                                onDropdownClick={handleParentAccountDropdownClick}
                                onInputClick={handleParentAccountClick}
                                inputLinkDisabled={account?.parentAccountDiscardedStatus > 0}
                                tableColumnDefinitions={AdvertiserCompactTableColumnDefinitions}
                                disabled={readOnly}
                                returnPath={returnPath}
                                errorName='Account'
                                showClearButton={!!account.parentAccount && !readOnly}
                                onRemoveClick={handleParentAccountRemoveClick}
                            />
                        </div>
                        <div>
                            {modalShowing ? (
                                <ParentAccountTableModal
                                    onClose={handleClose}
                                    onSelect={() => {
                                        setModalShowing(false);
                                    }}
                                    tableColumnDefinitions={ParentAccountTableColumnDefinitions}
                                    selectedParentId={selectedParentId}
                                    setModalShowing={setModalShowing}
                                    setSelectedChildId={setSelectedChildId}
                                />
                            ) : null}
                            <button
                                onClick={handleOpen}
                                disabled={readOnly || !isAnyChild}
                                style={{
                                    width: 40,
                                    border: readOnly || !isAnyChild ? '2px solid #CCCCCC' : '2px solid #FD9A00',
                                    borderRadius: 5,
                                    backgroundColor: readOnly || !isAnyChild ? '#CCCCCC' : '#FAA800',
                                    cursor: readOnly || !isAnyChild ? 'default' : 'pointer'
                                }}
                            >
                                <IconParent style={iconStyle} />
                            </button>
                        </div>
                    </div>
                </div>
                <AutoFlex itemPadding={cellPadding}>
                    <AsText
                        id='company-Registration-No'
                        name='companyRegistrationNo'
                        title={window.translate('Company Registration Number * *')}
                        labelStyle={labelStyle}
                        inputStyle={{
                            ...inputStyle,
                            marginBottom: 5,
                            ...(account.id !== undefined
                                ? (isNullAnyMandatoryFields.includes('companyRegistrationNo') &&
                                      !account.governmentAccount) ||
                                  isNullAnyMandatoryTextFields.includes('companyRegistrationNo')
                                    ? errorStyle
                                    : { borderColor: '#D7D7D7' }
                                : { borderColor: '#D7D7D7' })
                        }}
                        value={account.companyRegistrationNo}
                        onChange={onChange}
                        disabled={readOnly}
                    />
                    <AsText
                        id='VAT-number'
                        name='vatNumber'
                        title={window.translate('VAT Number * *')}
                        labelStyle={labelStyle}
                        inputStyle={{
                            ...inputStyle,
                            marginBottom: 5,
                            ...(account.id !== undefined
                                ? (isNullAnyMandatoryFields.includes('vatNumber') && !account.governmentAccount) ||
                                  isNullAnyMandatoryTextFields.includes('vatNumber')
                                    ? errorStyle
                                    : { borderColor: '#D7D7D7' }
                                : { borderColor: '#D7D7D7' })
                        }}
                        value={account.vatNumber}
                        onChange={onChange}
                        disabled={readOnly}
                    />
                        
                        <div>
                        <CrmSelect
                            id='product-category'
                            name='productCategoryId'
                            title={window.translate('Default Category')}
                            placeholder='Select ...'
                            disabledStyle={disabledSelectStyle}
                            values={categories}
                            value={account.productCategoryId}
                            onChange={onChange}
                            disabled={readOnly}
                            creating={creating}
                        />
                     </div>

                    <div>
                        <AsLabel style={{ marginBottom: 5 }}>{window.translate('Account owner')}</AsLabel>
                        <CompactTable
                            id='account-owner'
                            inputStyle={{ ...inputStyle, width: '80%' }}
                            name='accountOwnerId'
                            minSearchLength={0}
                            value={account.accountOwnerName}
                            valueId={account.accountOwnerId}
                            onChange={handleAccountOwnerChange}
                            searchFunction={accountOwnerSearch}
                            tableColumnDefinitions={UserCompactTableColumnDefinitions}
                            onDropdownClick={onAccountOwnerDropdownClick}
                            disabled={readOnly}
                            returnPath={returnPath}
                        />
                    </div>
                </AutoFlex>
                <div style={{ ...requiredBriefDetailLineStyle, justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ ...requiredBriefDetailComponentStyle, display: 'flex', width: '25%' }}>
                        <Tickbox
                            id='government-account'
                            style={{ width: 18, height: 18 }}
                            value={account.governmentAccount}
                            onClick={handleGovernmentAccountClick}
                            disabled={readOnly}
                        />
                        <label
                            style={{
                                ...labelStyle,
                                marginLeft: 6,
                                paddingTop: 3,
                                marginBottom: 0
                            }}
                        >
                            {window.translate('Government Account')}
                        </label>
                    </div>
                    <div style={{ ...requiredBriefDetailComponentStyle, width: '25%' }}></div>
                    <div style={{ ...requiredBriefDetailComponentStyle, width: '25%' }}></div>
                    <div style={{ ...requiredBriefDetailComponentStyle, width: '25%' }}>
                        <AsNumber
                            id='required-credit-limit'
                            name='requiredCreditLimit'
                            title={window.translate('Required Credit Limit(£) * *')}
                            labelStyle={{ ...labelStyle }}
                            inputStyle={{
                                ...inputStyle,
                                width: '100%',
                                marginBottom: 5,
                                ...(account.id !== undefined
                                    ? isNullAnyMandatoryFields.includes('requiredCreditLimit') ||
                                      isNullAnyMandatoryTextFields.includes('requiredCreditLimit')
                                        ? errorStyle
                                        : { borderColor: '#D7D7D7' }
                                    : { borderColor: '#D7D7D7' })
                            }}
                            value={account.requiredCreditLimit || 0}
                            onChange={onChange}
                            disabled={readOnly}
                            allowFloat={true}
                            formatCurrency={formatCurrency}
                        />
                    </div>
                </div>
            </div>
            <Spacer height={16} width={0} />
            <div style={sectionedPanelStyle}>
                <AutoFlex itemPadding='16px 42px 0 42px' style={{ color: '#141414', fontSize: 15 }}>
                    {window.translate('Financial Controls')}
                </AutoFlex>
                <div style={requiredBriefDetailLineStyle}>
                    <div style={requiredBriefDetailComponentStyle}>
                        <CrmSelect
                            id='credit-status'
                            name='creditStatusId'
                            title={window.translate('Credit status')}
                            disabledStyle={disabledSelectStyle}
                            values={creditStatuses}
                            value={account.creditStatusId}
                            onChange={onChange}
                            disabled={readOnly || financeReadOnly}
                            creating={creating}
                        />
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <CrmSelect
                            id='payment-term'
                            name='paymentTermId'
                            title={window.translate('Payment Terms')}
                            disabledStyle={disabledSelectStyle}
                            inputStyle={{
                                ...inputStyle,
                                marginBottom: 5,
                                ...(account.id !== undefined
                                    ? isNullAnyMandatoryTextFields.includes('paymentTermId')
                                        ? errorStyle
                                        : { borderColor: '#D7D7D7' }
                                    : { borderColor: '#D7D7D7' })
                            }}
                            values={paymentTerms}
                            value={account.paymentTermId}
                            onChange={onChange}
                            disabled={readOnly || financeReadOnly}
                            creating={creating}
                        />
                    </div>
                    <div
                        style={{
                            ...requiredBriefDetailComponentStyle,
                            display: 'block'
                        }}
                    >
                        <AsNumber
                            id='commission-rate'
                            name='commissionRate'
                            title={window.translate('Commission %')}
                            labelStyle={{ ...labelStyle }}
                            inputStyle={{ ...inputStyle, marginBottom: 5 }}
                            value={account.commissionRate}
                            onChange={onChange}
                            disabled={readOnly || financeReadOnly}
                            allowFloat={true}
                            formatCurrency={formatNumber}
                        />
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <div style={{ width: '100%', display: 'flex', gap: 15 }}>
                            <div style={{ width: '50%' }}>
                                <AsNumber
                                    id='credit-limit'
                                    name='creditLimit'
                                    title={window.translate('Credit Limit(£)')}
                                    labelStyle={{ ...labelStyle }}
                                    inputStyle={{
                                        ...inputStyle,
                                        marginBottom: 5,
                                        width: '100%',
                                        ...(account.id !== undefined
                                            ? isNullAnyMandatoryTextFields.includes('creditLimit')
                                                ? errorStyle
                                                : { borderColor: '#D7D7D7' }
                                            : { borderColor: '#D7D7D7' })
                                    }}
                                    value={account.creditLimit}
                                    onChange={onChange}
                                    disabled={readOnly || financeReadOnly}
                                    creating={creating}
                                    allowFloat={true}
                                    formatCurrency={formatCurrency}
                                />
                            </div>
                            <div style={{ width: '50%' }}>
                                <AsNumber
                                    id='current-balance'
                                    name='currentBalance'
                                    title={window.translate('Current Balance ')}
                                    labelStyle={{ ...labelStyle }}
                                    inputStyle={{ ...inputStyle, width: '100%' }}
                                    value={account.currentBalance}
                                    onChange={onChange}
                                    disabled={true}
                                    allowFloat={true}
                                    formatCurrency={formatNumber}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={requiredBriefDetailLineStyle}>
                    <div style={requiredBriefDetailComponentStyle}>
                        <CrmSelect
                            id='credit-type'
                            name='creditTypeId'
                            title={window.translate('Credit Type')}
                            disabledStyle={disabledSelectStyle}
                            values={creditTypes}
                            inputStyle={{
                                ...inputStyle,
                                marginBottom: 5,
                                ...(account.id !== undefined
                                    ? isNullAnyMandatoryTextFields.includes('creditTypeId')
                                        ? errorStyle
                                        : { borderColor: '#D7D7D7' }
                                    : { borderColor: '#D7D7D7' })
                            }}
                            value={account.creditTypeId}
                            onChange={onChange}
                            disabled={readOnly || financeReadOnly}
                            creating={creating}
                        />
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <CrmSelect
                            id='vat-code'
                            name='vatId'
                            title={window.translate('VAT code')}
                            disabledStyle={disabledSelectStyle}
                            values={vatCodes}
                            inputStyle={{
                                ...inputStyle,
                                marginBottom: 5,
                                ...(account.id !== undefined
                                    ? isNullAnyMandatoryTextFields.includes('vatId')
                                        ? errorStyle
                                        : { borderColor: '#D7D7D7' }
                                    : { borderColor: '#D7D7D7' })
                            }}
                            value={account.vatId}
                            onChange={onChange}
                            disabled={readOnly || financeReadOnly}
                            creating={creating}
                        />
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <CrmSelect
                            id='currency-id'
                            name='currencyId'
                            title={window.translate('Billing currency')}
                            disabledStyle={disabledSelectStyle}
                            values={currencies}
                            inputStyle={{
                                ...inputStyle,
                                marginBottom: 5,
                                ...(account.id !== undefined
                                    ? isNullAnyMandatoryTextFields.includes('currencyId')
                                        ? errorStyle
                                        : { borderColor: '#D7D7D7' }
                                    : { borderColor: '#D7D7D7' })
                            }}
                            value={account.currencyId}
                            onChange={onChange}
                            disabled={readOnly || financeReadOnly}
                            creating={creating}
                        />
                    </div>
                    <div style={requiredBriefDetailComponentStyle}>
                        <CrmSelect
                            id='account-status'
                            name='accountStatusId'
                            title={window.translate('Account status')}
                            disabledStyle={disabledSelectStyle}
                            values={accountStatuses}
                            inputStyle={{
                                ...inputStyle,
                                marginBottom: 5,
                                ...(account.id !== undefined
                                    ? isNullAnyMandatoryTextFields.includes('accountStatusId')
                                        ? errorStyle
                                        : { borderColor: '#D7D7D7' }
                                    : { borderColor: '#D7D7D7' })
                            }}
                            value={account.accountStatusId}
                            onChange={onChange}
                            disabled={readOnly || financeReadOnly}
                            creating={creating}
                        />
                    </div>
                </div>
                <div style={{ ...requiredBriefDetailLineStyle, paddingTop: 6 }}>
                    <div
                        style={{
                            ...requiredBriefDetailComponentStyle,
                            display: 'flex',
                            width: '25%',
                            alignItems: 'center'
                        }}
                    >
                        <Tickbox
                            id='suppress-invoice'
                            style={{ width: 18, height: 18 }}
                            value={account.suppressInvoice}
                            onClick={handleSuppressInvoiceClick}
                            disabled={readOnly || financeReadOnly}
                        />
                        <label
                            style={{
                                ...labelStyle,
                                marginLeft: 6,
                                paddingTop: 3,
                                marginBottom: 0
                            }}
                        >
                            {window.translate('Suppress Invoice')}
                        </label>
                    </div>
                    <div style={requiredBriefDetailComponentStyle}></div>
                    <div style={requiredBriefDetailComponentStyle}></div>
                    <div style={{ ...requiredBriefDetailComponentStyle, display: 'flex', justifyContent: 'end' }}>
                        {account.id !== undefined ? (
                            isNullAnyMandatoryFields.length > 0 ? (
                                <label style={statusLabelStyle}>{mandatoryErrorMessage}</label>
                            ) : null
                        ) : null}
                        {renderApprovalButton()}
                    </div>
                </div>

                {/* Keep code into comment if James needs it
                <div style={requiredBriefDetailLineStyle}>
                    <div style={{ ...requiredBriefDetailComponentStyle, display: 'flex', width: '24%' }}>
                        <Tickbox
                            id='purchaseOrder-BookCampaigns'
                            style={{ width: 18, height: 18 }}
                            value={account.purchaseOrderToBookCampaigns}
                            onClick={() =>
                                onChangeByName('purchaseOrderToBookCampaigns', !account.purchaseOrderToBookCampaigns)
                            }
                            disabled={readOnly || financeReadOnly}
                        />
                        <label
                            style={{
                                ...labelStyle,
                                marginLeft: 6,
                                paddingTop: 3,
                                marginBottom: 0
                            }}
                        >
                            {window.translate('Purchase Order required to book campaigns')}
                        </label>
                    </div>
                    <div
                        style={{
                            ...requiredBriefDetailComponentStyle,
                            display: 'flex',
                            width: '26%',
                            marginLeft: -73
                        }}
                    >
                        <Tickbox
                            id='multiple-campaigns'
                            style={{ width: 18, height: 18 }}
                            value={account.multipleCampaignsOneInvoice}
                            onClick={() =>
                                onChangeByName('multipleCampaignsOneInvoice', !account.multipleCampaignsOneInvoice)
                            }
                            disabled={readOnly || financeReadOnly}
                        />
                        <label
                            style={{
                                ...labelStyle,
                                marginLeft: 6,
                                paddingTop: 3,
                                marginBottom: 0
                            }}
                        >
                            {window.translate('Combine multiple campaigns on one invoice')}
                        </label>
                    </div>
                    <div
                        style={{
                            ...requiredBriefDetailComponentStyle,
                            display: 'flex',
                            width: '21%',
                            marginLeft: -94
                        }}
                    >
                        <Tickbox
                            id='provide-laydown'
                            style={{ width: 18, height: 18 }}
                            value={account.laydownsWithInvoice}
                            onClick={() => onChangeByName('laydownsWithInvoice', !account.laydownsWithInvoice)}
                            disabled={readOnly || financeReadOnly}
                        />
                        <label
                            style={{
                                ...labelStyle,
                                marginLeft: 6,
                                paddingTop: 3,
                                marginBottom: 0
                            }}
                        >
                            {window.translate('Provide TX times with invoice')}
                        </label>
                    </div>
                </div> */}
            </div>
            <Spacer height={16} width={0} />
            <div style={sectionedPanelStyle}>
                <div
                    style={{
                        ...historyPanelStyle,
                        paddingRight: 19,
                        paddingBottom: 8
                    }}
                >
                    <AutoFlex style={{ color: '#141414', fontSize: 15 }}>{window.translate('Addresses')}</AutoFlex>
                    <span>
                        {addressPanelOpen ? (
                            <>
                                <IconMinimise
                                    height={19}
                                    width={19}
                                    style={iconPlusMinimiseStyle}
                                    onClick={() => setAddressPanelOpen(!addressPanelOpen)}
                                />
                            </>
                        ) : (
                            <>
                                <IconPlus
                                    height={19}
                                    width={19}
                                    style={iconPlusMinimiseStyle}
                                    onClick={() => setAddressPanelOpen(!addressPanelOpen)}
                                />
                            </>
                        )}
                    </span>
                </div>
                {addressPanelOpen && (
                    <>
                        <div style={{ display: 'flex', width: '100%', marginTop: 15 }}>
                            <div style={{ padding: cellPadding, width: '50%' }}>
                                <div style={{ paddingBottom: 10, marginTop: 10 }}>
                                    <AsText
                                        id='site-address-line1'
                                        name='siteAddressLine1'
                                        title={window.translate('Site address - line 1')}
                                        labelStyle={labelStyle}
                                        inputStyle={inputStyle}
                                        value={account.siteAddressLine1}
                                        onChange={handleAddressUpdate}
                                        disabled={readOnly}
                                    />
                                </div>
                                <div style={{ paddingBottom: 10 }}>
                                    <AsText
                                        id='site-address-line2'
                                        name='siteAddressLine2'
                                        title={window.translate('Site address - line 2')}
                                        labelStyle={labelStyle}
                                        inputStyle={inputStyle}
                                        value={account.siteAddressLine2}
                                        onChange={handleAddressUpdate}
                                        disabled={readOnly}
                                    />
                                </div>
                                <div style={{ display: 'flex', width: '100%', gap: 100 }}>
                                    <div style={{ paddingBottom: 10, width: '50%' }}>
                                        <AsText
                                            id='site-address-city'
                                            name='siteCity'
                                            title={window.translate('Site address - City')}
                                            labelStyle={labelStyle}
                                            inputStyle={inputStyle}
                                            value={account.siteCity}
                                            onChange={handleAddressUpdate}
                                            disabled={readOnly}
                                        />
                                    </div>
                                    <div style={{ paddingBottom: 10, width: '50%' }}>
                                        <AsText
                                            id='site-address-county'
                                            name='siteCounty'
                                            title={window.translate('Site address - State / County')}
                                            labelStyle={labelStyle}
                                            inputStyle={inputStyle}
                                            value={account.siteCounty}
                                            onChange={handleAddressUpdate}
                                            disabled={readOnly}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', width: '100%', gap: 100 }}>
                                    <div style={{ paddingBottom: 10, width: '50%' }}>
                                        <AsText
                                            id='site-address-postcode'
                                            name='sitePostcode'
                                            title={window.translate('Site address - Post code / Zip')}
                                            labelStyle={labelStyle}
                                            inputStyle={inputStyle}
                                            value={account.sitePostcode}
                                            onChange={handleAddressUpdate}
                                            disabled={readOnly}
                                        />
                                    </div>
                                    <div style={{ paddingBottom: 10, width: '50%' }}>
                                        <AsText
                                            id='site-address-country'
                                            name='siteCountry'
                                            title={window.translate('Site address - Country')}
                                            labelStyle={labelStyle}
                                            inputStyle={inputStyle}
                                            value={account.siteCountry}
                                            onChange={handleAddressUpdate}
                                            disabled={readOnly}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: cellPadding, width: '50%' }}>
                                <div style={{ marginTop: -18 }}>
                                    <LabelledTickbox
                                        id='same-address'
                                        title={window.translate('Billing address same as Site address')}
                                        style={{ width: 30, height: 18 }}
                                        gap={13}
                                        value={useSameAddress}
                                        onClick={() => handleSameAddressClick(!useSameAddress)}
                                        disabled={readOnly}
                                    />
                                </div>
                                <div style={{ paddingBottom: 5, marginTop: 10 }}>
                                    <AsText
                                        id='billing-address-line1'
                                        name='billingAddressLine1'
                                        title={window.translate('Billing address - line 1  * *')}
                                        labelStyle={labelStyle}
                                        inputStyle={{
                                            ...inputStyle,
                                            marginBottom: 5,
                                            ...(account.id !== undefined
                                                ? isNullAnyMandatoryFields.includes('billingAddressLine1') ||
                                                  isNullAnyMandatoryTextFields.includes('billingAddressLine1')
                                                    ? errorStyle
                                                    : { borderColor: '#D7D7D7' }
                                                : { borderColor: '#D7D7D7' })
                                        }}
                                        value={useSameAddress ? account.siteAddressLine1 : account.billingAddressLine1}
                                        onChange={onChange}
                                        disabled={useSameAddress || readOnly}
                                    />
                                </div>
                                <div style={{ paddingBottom: 10 }}>
                                    <AsText
                                        id='billing-address-line2'
                                        name='billingAddressLine2'
                                        title={window.translate('Billing address - line 2')}
                                        labelStyle={labelStyle}
                                        inputStyle={inputStyle}
                                        value={useSameAddress ? account.siteAddressLine2 : account.billingAddressLine2}
                                        onChange={onChange}
                                        disabled={useSameAddress || readOnly}
                                    />
                                </div>
                                <div style={{ display: 'flex', width: '100%', gap: 100 }}>
                                    <div style={{ paddingBottom: 5, width: '50%' }}>
                                        <AsText
                                            id='billing-address-city'
                                            name='billingCity'
                                            title={window.translate('Billing address - City * *')}
                                            labelStyle={labelStyle}
                                            inputStyle={{
                                                ...inputStyle,
                                                marginBottom: 5,
                                                ...(account.id !== undefined
                                                    ? isNullAnyMandatoryFields.includes('billingCity') ||
                                                      isNullAnyMandatoryTextFields.includes('billingCity')
                                                        ? errorStyle
                                                        : { borderColor: '#D7D7D7' }
                                                    : { borderColor: '#D7D7D7' })
                                            }}
                                            value={account.billingCity}
                                            onChange={onChange}
                                            disabled={useSameAddress || readOnly}
                                        />
                                    </div>
                                    <div style={{ paddingBottom: 5, width: '50%' }}>
                                        <AsText
                                            id='billing-address-county'
                                            name='billingCounty'
                                            title={window.translate('Biling address - State / County')}
                                            labelStyle={labelStyle}
                                            inputStyle={{ ...inputStyle, marginBottom: 5 }}
                                            value={account.billingCounty}
                                            onChange={onChange}
                                            disabled={useSameAddress || readOnly}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', width: '100%', gap: 100 }}>
                                    <div style={{ paddingBottom: 10, width: '50%' }}>
                                        <AsText
                                            id='billing-address-postcode'
                                            name='billingPostcode'
                                            title={window.translate('Billing address - Post code / Zip * *')}
                                            labelStyle={labelStyle}
                                            inputStyle={{
                                                ...inputStyle,
                                                marginBottom: 5,
                                                ...(account.id !== undefined
                                                    ? isNullAnyMandatoryFields.includes('billingPostcode') ||
                                                      isNullAnyMandatoryTextFields.includes('billingPostcode')
                                                        ? errorStyle
                                                        : { borderColor: '#D7D7D7' }
                                                    : { borderColor: '#D7D7D7' })
                                            }}
                                            value={account.billingPostcode}
                                            onChange={onChange}
                                            disabled={useSameAddress || readOnly}
                                        />
                                    </div>
                                    <div style={{ paddingBottom: 10, width: '50%' }}>
                                        <AsText
                                            id='billing-address-country'
                                            name='billingCountry'
                                            title={window.translate('Billing address - Country')}
                                            labelStyle={labelStyle}
                                            inputStyle={{ ...inputStyle, marginBottom: 5 }}
                                            value={account.billingCountry}
                                            onChange={onChange}
                                            disabled={useSameAddress || readOnly}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Spacer height={16} width={0} />
            <AccountHistory account={account} />
            <Spacer height={16} width={0} />
            <div style={sectionedPanelStyle}>
                <DetailsButtons
                    label={window.translate('Account')}
                    isFavourite={account.isFavourite}
                    onCancel={onCancel}
                    onUpdate={creating ? onCreateLocal : onUpdateLocal}
                    readOnly={readOnly}
                    creating={creating}
                    onFavouriteClick={() => onChangeByName('isFavourite', !account.isFavourite)}
                    referenceId={account.referenceId}
                    externaleReference={account.externalReference ?? ' '}
                />
            </div>
            <SaveConfirmModal
                isShowing={isModalShowing}
                onClose={() => showConfirmSaveModal(false)}
                onCancelSave={onCancel}
                onSave={creating ? onCreateLocal : onUpdateLocal}
                entityName='account'
            />
        </div>
    );
};

export default AccountDetails;
