import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AsButton,
    AsSelect,
    AsText,
    Flex,
    LabelledTickbox,
    Spacer,
    Tickbox,
    useModal
} from '@adserve/adserve-react-components';
import AsTextWithStatusAndSearch from './generic/AsTextWithStatusAndSearch';
import AutoFlex from './containers/AutoFlex';
import {
    labelStyle,
    disabledSelectStyle,
    sectionedPanelStyle,
    cellStyle
} from '../styles';
import {
    containerStyle,
    salutationStyle,
    mobileLandlineStyle,
    siteSectionContainerStyle,
    subheadingStyle,
    cellPadding,
    fieldInputStyle,
    firstCellPadding
} from '../pages/ContactsDetails/ContactsDetailsStyles';
import { ReactComponent as IconLinkedIn } from '../svg/icon_Social_LinkedIn.svg';
import { ReactComponent as IconFacebook } from '../svg/icon_Social_Facebook.svg';
import { ReactComponent as IconTwitter } from '../svg/icon_Social_Twitter.svg';
import { ReactComponent as IconOther } from '../svg/icon_Social_Other.svg';
import SvgLabel from '../components/generic/SvgLabel';
import { ContactsLookup, GetContactStaticData } from '../services/ContactsDataService';
import CompactTable from './generic/CompactTable/CompactTable';
import ReportsToCompactTableColumnDefinitions from '../pages/ContactsDetails/ReportsToCompactTableColumnDefinitions';
import AccountNameCompactTableColumnDefinitions from '../pages/ContactsDetails/AccountNameCompactTableColumnDefinitions';
import {
    UseSiteAccountAddress,
    EmptyAddress
} from '../pages/ContactsDetails/ContactsDetailsUtilities';
import { CampaignsLookup } from '../services/CampaignsDataService';
import {
    IsValidEmail,
    IsValidLandline,
    IsValidMobile,
    DefaultInputStatus,
    SuccessInputStatus,
    ErrorInputStatus
} from '../services/UtilsService';
import CrmSelect from './inputs/CrmSelect';
import DetailsButtons from './inputs/DetailsButtons';
import SaveConfirmModal from './SaveConfirmModal';
import useRecordState from '../hooks/useRecordState';
import ContactHistory from './ContactDetails/ContactHistory';

const ContactsDetails = ({
    contact,
    onContactUpdate,
    onContactMerge,
    accountSearchFunction,
    contactSearchFunction,
    onCancel,
    onCreate,
    onUpdate,
    creating = false,
    readOnly = false,
    returnPath,
    preDisabledFields
}) => {
    const history = useHistory();
    const { addMessage } = useModal();

    const formInputStyle = readOnly
        ? fieldInputStyle
        : { ...fieldInputStyle, backgroundColor: '#FFFDF4' };
    const disabledStyle = { backgroundColor: '#F4F4F4' };
    const [staticData, setStaticData] = useState();
    const [selectedLinkedAccount, setSelectedLinkedAccount] = useState();
    const [useAccountAddress, setUseAccountAddress] = useState(false);
    const [emailWorkStatus, setEmailWorkStatus] = useState(() =>
        DefaultInputStatus()
    );
    const [emailWorkSearchResults, setEmailWorkSearchResults] = useState([]);
    const [emailOtherStatus, setEmailOtherStatus] = useState(() =>
        DefaultInputStatus()
    );
    const [emailOtherSearchResults, setEmailOtherSearchResults] = useState([]);
    const [firstNameStatus, setFirstNameStatus] = useState(() =>
        DefaultInputStatus()
    );
    const [lastNameStatus, setLastNameStatus] = useState(() =>
        DefaultInputStatus()
    );
    const [telNumStatus, setTelNumStatus] = useState(() =>
        DefaultInputStatus()
    );
    const [mobNumStatus, setMobNumStatus] = useState(() =>
        DefaultInputStatus()
    );
    const minLengthToStartSearch = 3;
    const {
        isModalShowing,
        showConfirmSaveModal,
        resetDataModified
    } = useRecordState();

    const handleAccountClick = () => {
        if (contact.accountId) {
            history.push({
                pathname: '/accounts/details',
                state: { accountId: contact.accountId, readOnly: true }
            });
        }
    };

    const handleReportsToNameClick = () => {
        if (contact.reportsToId) {
            history.push({
                pathname: '/contacts/details',
                state: { contactId: contact.reportsToId, readOnly: true }
            });
        }
    };

    const handleAccountDropdownClick = (searchResult) => {
        onContactUpdate('accountId', searchResult.id);
        onContactUpdate('accountName', searchResult.name);
        if (useAccountAddress) handleUseAccountAddress(searchResult.id);
    };

    const handleContactDropdownClick = (searchResult) => {
        onContactUpdate('reportsToId', searchResult.id);
        onContactUpdate('reportsToName', searchResult.name);
    };

    const handleEmailClick = (event) => {
        if (event.target.value) {
            window.location.href = 'mailto:' + event.target.value;
        }
    };

    const getStaticData = async () => {
        const results = await GetContactStaticData();
        setStaticData(results);
    };

    const checkSameAddress = async (accountId) => {
        if (
            contact.addressLine1 ||
            contact.addressLine2 ||
            contact.city ||
            contact.county ||
            contact.postcode ||
            contact.country
        ) {
            const currentAccountAddress = accountId
                ? await UseSiteAccountAddress(accountId)
                : EmptyAddress();
            const addressState =
                contact.addressLine1 === currentAccountAddress.addressLine1 &&
                contact.addressLine2 === currentAccountAddress.addressLine2 &&
                contact.city === currentAccountAddress.city &&
                contact.county === currentAccountAddress.county &&
                contact.postcode === currentAccountAddress.postcode &&
                contact.country === currentAccountAddress.country;
            setUseAccountAddress(addressState);
        }
    };

    useEffect(() => {
        checkSameAddress(contact?.accountId);
    }, [contact?.accountId]);

    useEffect(() => {
        resetDataModified();
    }, []);

    const handleUseAccountAddress = async (accountId = '') => {
        const currentAccountAddress = accountId
            ? await UseSiteAccountAddress(accountId)
            : EmptyAddress();
        onContactMerge(currentAccountAddress);
    };

    const handleAccountAddressClick = (checked) => {
        checked
            ? handleUseAccountAddress(contact?.accountId)
            : handleUseAccountAddress();
        setUseAccountAddress(checked);
    };

    const onFirstnameChange = (event) => {
        setFirstNameStatus(DefaultInputStatus());
        onContactUpdate('firstName', event.target.value);
    };

    const onLastnameChange = (event) => {
        setLastNameStatus(DefaultInputStatus());
        onContactUpdate('lastName', event.target.value);
    };

    const onCreateLocal = async () => {
        const isInputValid = await isValidateFormInput();
        if (isInputValid) {
            onCreate();
        }
    };

    const onUpdateLocal = async () => {
        const isInputValid = await isValidateFormInput();
        if (isInputValid) {
            onUpdate();
        }
    };

    const isValidateFormInput = async () => {
        let retVal = true;

        if (!contact?.firstName) {
            setFirstNameStatus(ErrorInputStatus('First name is required'));
            retVal = false;
        }

        if (!contact?.lastName) {
            setLastNameStatus(ErrorInputStatus('Last name is required'));
            retVal = false;
        }

        if (contact?.isBillingContact && (!contact?.emailWork && !contact?.emailOther)) {
            setEmailWorkStatus(ErrorInputStatus(''));
            setEmailOtherStatus(ErrorInputStatus(''));
            retVal = false;
        } else {
            setEmailWorkStatus(SuccessInputStatus(''));
            setEmailOtherStatus(SuccessInputStatus(''));
        }

        if (contact?.isBillingContact && (!contact?.mobileNumber && !contact?.telephoneNumber)) {
            setMobNumStatus(ErrorInputStatus(''));
            setTelNumStatus(ErrorInputStatus(''));
            retVal = false;
        } else {
            setMobNumStatus(SuccessInputStatus(''));
            setTelNumStatus(SuccessInputStatus(''));
        }

        if (
            contact?.isBillingContact &&
            (!contact?.emailWork ||
                !contact?.emailOther) &&
            (!contact?.mobileNumber &&
                !contact?.telephoneNumber)
        ) {
            addMessage({
                message: `${window.translate(
                    'Billing Contact cannot be saved without one email address and one telephone number'
                )}`,
                buttons: [
                    {
                        text: window.translate('Ok')
                    }
                ]
            });
            retVal = false;
        }

        if (
            contact?.emailWork &&
            !(await emailWorkSearch(contact.emailWork, true))
        ) {
            retVal = false;
        }

        if (
            contact?.emailOther &&
            !(await emailOtherSearch(contact.emailOther, true))
        ) {
            retVal = false;
        }

        if (
            contact?.mobileNumber &&
            !(await mobileNumSearch(contact.mobileNumber, true))
        ) {
            retVal = false;
        }

        if (
            contact?.telephoneNumber &&
            !(await telNumSearch(contact.telephoneNumber, true))
        ) {
            retVal = false;
        }

        return retVal;
    };

    useEffect(() => {
        getStaticData();
    }, []);

    const emailWorkSearch = async (searchValue, validationOnly) => {
        let retValue = true;
        setEmailOtherStatus(DefaultInputStatus());
        if (
            (!searchValue || searchValue.length < minLengthToStartSearch) &&
            !validationOnly
        ) {
            setEmailWorkSearchResults([]);
            setEmailWorkStatus(DefaultInputStatus());
            return retValue;
        }

        if (!IsValidEmail(searchValue)) {
            setEmailWorkStatus(ErrorInputStatus('Enter a valid Email address'));
            return false;
        }

        const results = await ContactsLookup(searchValue);

        const searchData = results?.data
            .filter((p) => p.id !== contact.id)
            .map((p) => p.emailWork.trim()); // ToDo: p.name -> p.emailWork

        if (
            searchData.findIndex(
                (data) =>
                    data.toLowerCase() === searchValue.toLowerCase().trim()
            ) === -1
        ) {
            if (!validationOnly) {
                setEmailWorkStatus(SuccessInputStatus());
            }
        } else {
            setEmailWorkStatus(
                ErrorInputStatus('Email address already exists')
            );
            retValue = false;
        }

        if (!validationOnly) {
            setEmailWorkSearchResults(searchData);
        }

        return retValue;
    };

    const onHandleEmailWorkChange = (fieldname, value) => {
        onContactUpdate(fieldname, value);
        if (!readOnly && value?.length > 5) {
            emailWorkSearch(value, false);
        }
    };

    const onHandleEmailOtherChange = (fieldname, value) => {
        onContactUpdate(fieldname, value);
        if (!readOnly && value?.length > 5) {
            emailOtherSearch(value, false);
        }
    };

    const emailOtherSearch = async (searchValue, validationOnly) => {
        let retValue = true;
        setEmailWorkStatus(DefaultInputStatus());
        if (
            (!searchValue || searchValue.length < minLengthToStartSearch) &&
            !validationOnly
        ) {
            setEmailOtherSearchResults([]);
            setEmailOtherStatus(DefaultInputStatus());
            return retValue;
        }

        if (!IsValidEmail(searchValue)) {
            setEmailOtherStatus(
                ErrorInputStatus('Enter a valid Email address')
            );
            return false;
        }

        const results = await CampaignsLookup(searchValue);

        const searchData = results?.data
            .filter((p) => p.id !== contact.id)
            .map((p) => p.name.trim()); // ToDo: p.name -> p.emailWork

        if (
            searchData.findIndex(
                (data) =>
                    data.toLowerCase() === searchValue.toLowerCase().trim()
            ) === -1
        ) {
            if (!validationOnly) {
                setEmailOtherStatus(SuccessInputStatus());
            }
        } else {
            setEmailOtherStatus(
                ErrorInputStatus('Email address already exists')
            );
            retValue = false;
        }

        if (!validationOnly) {
            setEmailOtherSearchResults(searchData);
        }

        return retValue;
    };

    const mobileNumSearch = async (searchValue, validationOnly) => {
        const retValue = true;
        setTelNumStatus(DefaultInputStatus());
        if (
            (!searchValue || searchValue.length < minLengthToStartSearch) &&
            !validationOnly
        ) {
            setMobNumStatus(DefaultInputStatus());
            return retValue;
        }

        if (!IsValidMobile(searchValue)) {
            setMobNumStatus(ErrorInputStatus('Invalid mobile number'));
            return false;
        } else {
            setMobNumStatus(SuccessInputStatus());
        }

        return retValue;
    };

    const onHandleTelephoneNumberChange = (fieldname, value) => {
        onContactUpdate(fieldname, value);
        if (!readOnly && value?.length > 5) {
            telNumSearch(value, false);
        }
    };

    const onHandleMobileNumberChange = (fieldname, value) => {
        onContactUpdate(fieldname, value);
        if (!readOnly && value?.length > 5) {
            mobileNumSearch(value, false);
        }
    };

    const telNumSearch = async (searchValue, validationOnly) => {
        const retValue = true;
        setMobNumStatus(DefaultInputStatus());
        if (
            (!searchValue || searchValue.length < minLengthToStartSearch) &&
            !validationOnly
        ) {
            setTelNumStatus(DefaultInputStatus());
            return retValue;
        } else {
            setTelNumStatus(SuccessInputStatus());
        }

        if (!IsValidLandline(searchValue)) {
            setTelNumStatus(ErrorInputStatus('Invalid landline number'));
            return false;
        }

        return retValue;
    };

    const handleWebsiteClick = (event) => {
        const url = event.target.value.match(/^https?:/)
            ? event.target.value
            : '//' + event.target.value;
        const win = window.open(url, '_blank');
        win?.focus();
    };

    const handleSelectedLinkedAccount = (event) => {
        setSelectedLinkedAccount(event.target.value);
    };

    const handleLinkedAccountsGo = () => {
        if (selectedLinkedAccount) {
            history.push({
                pathname: '/accounts/details',
                state: {
                    accountId: selectedLinkedAccount,
                    path: '/contacts/details',
                    readOnly: true
                }
            });
        }
    };

    return (
        <div style={containerStyle}>
            <div style={sectionedPanelStyle}>
                <div style={{ display: 'inlineflex' }}>
                    <AutoFlex itemPadding={firstCellPadding}>
                        <Flex>
                            <div style={{ width: 100 }}>
                                <CrmSelect
                                    id='contact-salutation'
                                    title={window.translate('Salutation')}
                                    labelStyle={labelStyle}
                                    placeholder='Select...'
                                    style={{ fontSize: 15 }}
                                    disabledStyle={disabledSelectStyle}
                                    selectStyle={{
                                        ...salutationStyle,
                                        ...(readOnly ? disabledStyle : {})
                                    }}
                                    value={contact?.salutationId}
                                    values={staticData?.salutations || []}
                                    onChange={(e) =>
                                        onContactUpdate(
                                            'salutationId',
                                            e.target.value
                                        )
                                    }
                                    disabled={readOnly}
                                />
                            </div>
                            <div style={{ flex: 1, marginLeft: 20 }}>
                                <AsTextWithStatusAndSearch
                                    id='contact-firstname'
                                    title={`${window.translate(
                                        'First name'
                                    )} *`}
                                    labelStyle={labelStyle}
                                    inputStyle={formInputStyle}
                                    value={contact?.firstName || ''}
                                    onChange={onFirstnameChange}
                                    disabled={readOnly}
                                    searchStatus={firstNameStatus}
                                    searchResults={null}
                                    numResultsInDropdown={0}
                                />
                            </div>
                        </Flex>

                        <AsTextWithStatusAndSearch
                            id='contact-lastname'
                            title={`${window.translate('Last name')} *`}
                            labelStyle={labelStyle}
                            inputStyle={formInputStyle}
                            value={contact?.lastName || ''}
                            onChange={onLastnameChange}
                            disabled={readOnly}
                            searchStatus={lastNameStatus}
                            searchResults={null}
                            numResultsInDropdown={0}
                        />
                        <div>
                            <label style={labelStyle}>
                                {window.translate('Account name')}
                            </label>
                            <CompactTable
                                id='contact-accountname'
                                inputType='submit'
                                inputStyle={{ ...formInputStyle, width: '80%' }}
                                value={contact?.accountName || ''}
                                valueId={contact?.accountId}
                                statusMessage={window.translate(
                                    'This account doesn’t exist'
                                )}
                                onChange={(e) =>
                                    onContactUpdate(
                                        'accountName',
                                        e.target.value
                                    )
                                }
                                searchFunction={accountSearchFunction}
                                tableColumnDefinitions={
                                    AccountNameCompactTableColumnDefinitions
                                }
                                onDropdownClick={handleAccountDropdownClick}
                                onInputClick={handleAccountClick}
                                inputLinkDisabled={
                                    contact?.accountDiscardedStatus > 0
                                }
                                disabled={
                                    readOnly || preDisabledFields?.accountName
                                }
                                returnPath={returnPath}
                            />
                        </div>
                        <AsText
                            id='contact-jobtitle'
                            title={window.translate('Job title')}
                            labelStyle={labelStyle}
                            inputStyle={formInputStyle}
                            value={contact?.jobTitle || ''}
                            onChange={(e) =>
                                onContactUpdate('jobTitle', e.target.value)
                            }
                            disabled={readOnly}
                        />
                    </AutoFlex>
                </div>

                <AutoFlex itemPadding={cellPadding}>
                    <AsTextWithStatusAndSearch
                        id='contact-emailwork'
                        inputType='submit'
                        title={window.translate('Email - Work')}
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.emailWork || ''}
                        onChange={(e) =>
                            onHandleEmailWorkChange('emailWork', e.target.value)
                        }
                        onClick={handleEmailClick}
                        disabled={readOnly}
                        searchStatus={emailWorkStatus}
                        searchResults={emailWorkSearchResults}
                        numResultsInDropdown={0}
                    />
                    <AsTextWithStatusAndSearch
                        id='contact-emailOther'
                        inputType='submit'
                        title={window.translate('Email - Other')}
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.emailOther || ''}
                        onChange={(e) =>
                            onHandleEmailOtherChange(
                                'emailOther',
                                e.target.value
                            )
                        }
                        onClick={handleEmailClick}
                        disabled={readOnly}
                        searchStatus={emailOtherStatus}
                        searchResults={emailOtherSearchResults}
                        numResultsInDropdown={0}
                    />
                    <div>
                        <label style={labelStyle}>Reports to</label>
                        <CompactTable
                            id='contact-reportsto'
                            inputType='submit'
                            inputStyle={{ ...formInputStyle, width: '80%' }}
                            value={contact?.reportsToName || ''}
                            valueId={contact?.reportsToId}
                            statusMessage={window.translate(
                                'This contact doesn’t exists'
                            )}
                            onChange={(e) =>
                                onContactUpdate('reportsToName', e.target.value)
                            }
                            searchFunction={contactSearchFunction}
                            searchFilter={[contact?.accountId]}
                            tableColumnDefinitions={
                                ReportsToCompactTableColumnDefinitions
                            }
                            onDropdownClick={handleContactDropdownClick}
                            onInputClick={handleReportsToNameClick}
                            inputLinkDisabled={
                                contact?.reportsToDiscardedStatus > 0
                            }
                            disabled={readOnly}
                            returnPath={returnPath}
                        />
                    </div>
                    <AsText
                        id='contact-knownasname'
                        title={window.translate('Known as name')}
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.knownAsName || ''}
                        onChange={(e) =>
                            onContactUpdate('knownAsName', e.target.value)
                        }
                        disabled={readOnly}
                    />
                </AutoFlex>
                <div style={{ width: '100%', display: 'flex' }}>
                    <div style={{ width: '25%', padding: cellPadding }}>

                        <AsTextWithStatusAndSearch
                            id='contact-mobile'
                            title={window.translate('Mobile')}
                            labelStyle={labelStyle}
                            inputStyle={{
                                ...mobileLandlineStyle,
                                ...(readOnly ? disabledStyle : {})
                            }}
                            value={contact?.mobileNumber || ''}
                            onChange={(e) =>
                                onHandleMobileNumberChange(
                                    'mobileNumber',
                                    e.target.value
                                )
                            }
                            maxLength={20}
                            disabled={readOnly}
                            searchStatus={mobNumStatus}
                            searchResults={null}
                            numResultsInDropdown={0}
                        />
                    </div>
                    <div style={{ width: '25%', padding: cellPadding }}>
                        <AsTextWithStatusAndSearch
                            id='contact-landline'
                            name='telephoneNumber'
                            title={window.translate('Landline')}
                            labelStyle={labelStyle}
                            inputStyle={{
                                ...mobileLandlineStyle,
                                ...(readOnly ? disabledStyle : {})
                            }}
                            value={contact?.telephoneNumber || ''}
                            onChange={(e) =>
                                onHandleTelephoneNumberChange(
                                    'telephoneNumber',
                                    e.target.value
                                )
                            }
                            maxLength={20}
                            disabled={readOnly}
                            searchStatus={telNumStatus}
                            searchResults={null}
                            numResultsInDropdown={0}
                        />
                    </div>
                    <div style={{ width: '25%', display: 'flex', alignItems: 'flex-end', padding: cellPadding }}>
                        <CrmSelect
                            id='linked-accounts'
                            title={window.translate('Linked Accounts')}
                            labelStyle={labelStyle}
                            placeholder='Select...'
                            style={{ fontSize: 15 }}
                            disabledStyle={disabledSelectStyle}
                            selectStyle={{
                                ...salutationStyle,
                                ...(readOnly ? disabledStyle : {})
                            }}
                            containerStyle={{ width: '80%' }}
                            value={selectedLinkedAccount}
                            values={contact?.linkedAccounts || []}
                            onChange={handleSelectedLinkedAccount}
                            disabled={readOnly}
                        />
                        <AsButton
                            id='linked-accounts-go'
                            style={{ width: '20%' }}
                            disabled={readOnly}
                            handleClick={handleLinkedAccountsGo}
                        >
                            {window.translate('Go')}
                        </AsButton>
                    </div>
                    <div style={{ width: '25%', padding: cellPadding }}>
                        <div
                            style={{
                                ...cellStyle(40, 252),
                                paddingLeft: 8,
                                paddingTop: 10,
                                marginTop: 20,
                                backgroundColor: '#FFFFFF'
                            }}
                        >
                            <div style={{ display: 'flex' }}>
                                <Tickbox
                                    id='billing-Contact'
                                    style={{ width: 18, height: 18, marginTop: 1 }}
                                    value={contact.isBillingContact}
                                    onClick={() => onContactUpdate('isBillingContact', !contact.isBillingContact)}
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
                                    {window.translate('Billing Contact')}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <AutoFlex itemPadding={cellPadding}>
                    <AsText
                        id='contact-emaillinkedIn'
                        title={
                            <SvgLabel
                                title='LinkedIn'
                                icon={
                                    <IconLinkedIn width={20} fill='#0088c0' />
                                }
                            />
                        }
                        inputType='submit'
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.emailLinkedIn || ''}
                        onChange={(e) =>
                            onContactUpdate('emailLinkedIn', e.target.value)
                        }
                        onClick={handleWebsiteClick}
                        disabled={readOnly}
                    />
                    <AsText
                        id='contact-emailfacebook'
                        title={
                            <SvgLabel
                                title='Facebook'
                                icon={
                                    <IconFacebook width={20} fill='#537dc0' />
                                }
                            />
                        }
                        inputType='submit'
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.emailFacebook || ''}
                        onChange={(e) =>
                            onContactUpdate('emailFacebook', e.target.value)
                        }
                        onClick={handleWebsiteClick}
                        disabled={readOnly}
                    />
                    <AsText
                        id='contact-emailtwitter'
                        title={
                            <SvgLabel
                                title='Twitter'
                                icon={<IconTwitter width={20} fill='#19b2f5' />}
                            />
                        }
                        inputType='submit'
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.emailTwitter || ''}
                        onChange={(e) =>
                            onContactUpdate('emailTwitter', e.target.value)
                        }
                        onClick={handleWebsiteClick}
                        disabled={readOnly}
                    />
                    <AsText
                        id='contact-emailothersocialmedia'
                        title={
                            <SvgLabel
                                title={window.translate('Other')}
                                icon={<IconOther width={20} fill='#414141' />}
                            />
                        }
                        inputType='submit'
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.emailOtherSocialMedia || ''}
                        onChange={(e) =>
                            onContactUpdate(
                                'emailOtherSocialMedia',
                                e.target.value
                            )
                        }
                        onClick={handleWebsiteClick}
                        disabled={readOnly}
                    />
                </AutoFlex>
            </div>

            <Spacer height={16} width={0} />
            <div style={sectionedPanelStyle}>
                <div style={siteSectionContainerStyle}>
                    <span
                        id='contact-siteaddressheading'
                        style={subheadingStyle}
                    >
                        {window.translate('Site address')}
                    </span>
                </div>

                <div style={siteSectionContainerStyle}>
                    <LabelledTickbox
                        id='same-site-address'
                        title={window.translate('Same as Site account address')}
                        gap={13}
                        value={useAccountAddress}
                        onClick={() =>
                            handleAccountAddressClick(!useAccountAddress)
                        }
                        disabled={readOnly}
                    />
                </div>

                <AutoFlex itemPadding={cellPadding}>
                    <AsText
                        id='contact-siteaddressline1'
                        title={window.translate('Site address line 1')}
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.addressLine1 || ''}
                        onChange={(e) =>
                            onContactUpdate('addressLine1', e.target.value)
                        }
                        disabled={readOnly || useAccountAddress}
                    />
                    <AsText
                        id='contact-siteaddressline2'
                        title={window.translate('Site address line 2')}
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.addressLine2 || ''}
                        onChange={(e) =>
                            onContactUpdate('addressLine2', e.target.value)
                        }
                        disabled={readOnly || useAccountAddress}
                    />
                </AutoFlex>

                <AutoFlex itemPadding={cellPadding}>
                    <AsText
                        id='contact-city'
                        title={window.translate('City')}
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.city || ''}
                        onChange={(e) =>
                            onContactUpdate('city', e.target.value)
                        }
                        disabled={readOnly || useAccountAddress}
                    />
                    <AsText
                        id='contact-statecounty'
                        title={window.translate('State / County')}
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.county || ''}
                        onChange={(e) =>
                            onContactUpdate('county', e.target.value)
                        }
                        disabled={readOnly || useAccountAddress}
                    />
                    <AsText
                        id='contact-postcode'
                        title={window.translate('Postcode')}
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.postcode || ''}
                        onChange={(e) =>
                            onContactUpdate('postcode', e.target.value)
                        }
                        disabled={readOnly || useAccountAddress}
                    />
                    <AsText
                        id='contact-country'
                        title={window.translate('Country')}
                        labelStyle={labelStyle}
                        inputStyle={formInputStyle}
                        value={contact?.country || ''}
                        onChange={(e) =>
                            onContactUpdate('country', e.target.value)
                        }
                        disabled={readOnly || useAccountAddress}
                    />
                </AutoFlex>
            </div>
            {/* Needs back when Jim wants this UI
             <div style={sectionedPanelStyle}>
                <div>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ padding: cellPadding, width: '50%' }}>

                            <div style={{ marginTop: 6 }}>

                                <span
                                    id='contact-siteaddressheading'
                                    style={subheadingStyle}
                                >
                                    {window.translate('Site address')}
                                </span>
                            </div>

                            <div style={{ marginTop: 6, paddingBottom:10 }}>

                                <LabelledTickbox
                                    id='same-site-address'
                                    title={window.translate('Same as Site account address')}
                                    gap={13}
                                    value={useAccountAddress}
                                    onClick={() =>
                                        handleAccountAddressClick(!useAccountAddress)
                                    }
                                    disabled={readOnly}
                                />
                            </div>
                            <div style={{ paddingBottom: 10 }}>
                                <AsText
                                    id='contact-siteaddressline1'
                                    title={window.translate('Site address line 1')}
                                    labelStyle={labelStyle}
                                    inputStyle={formInputStyle}
                                    value={contact?.addressLine1 || ''}
                                    onChange={(e) =>
                                        onContactUpdate('addressLine1', e.target.value)
                                    }
                                    disabled={readOnly || useAccountAddress}
                                />
                            </div>
                            <div style={{ paddingBottom: 10 }}>
                                <AsText
                                    id='contact-siteaddressline2'
                                    title={window.translate('Site address line 2')}
                                    labelStyle={labelStyle}
                                    inputStyle={formInputStyle}
                                    value={contact?.addressLine2 || ''}
                                    onChange={(e) =>
                                        onContactUpdate('addressLine2', e.target.value)
                                    }
                                    disabled={readOnly || useAccountAddress}
                                />
                            </div>
                            <div style={{ display: 'flex', width: '100%', gap: 100 }}>
                                <div style={{ paddingBottom: 10, width: '50%' }}>
                                    <AsText
                                        id='contact-city'
                                        title={window.translate('City')}
                                        labelStyle={labelStyle}
                                        inputStyle={formInputStyle}
                                        value={contact?.city || ''}
                                        onChange={(e) =>
                                            onContactUpdate('city', e.target.value)
                                        }
                                        disabled={readOnly || useAccountAddress}
                                    />
                                </div>
                                <div style={{ paddingBottom: 10, width: '50%' }}>
                                    <AsText
                                        id='contact-statecounty'
                                        title={window.translate('State / County')}
                                        labelStyle={labelStyle}
                                        inputStyle={formInputStyle}
                                        value={contact?.county || ''}
                                        onChange={(e) =>
                                            onContactUpdate('county', e.target.value)
                                        }
                                        disabled={readOnly || useAccountAddress}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', width: '100%', gap: 100 }}>
                                <div style={{ paddingBottom: 10, width: '50%' }}>
                                    <AsText
                                        id='contact-postcode'
                                        title={window.translate('Postcode')}
                                        labelStyle={labelStyle}
                                        inputStyle={formInputStyle}
                                        value={contact?.postcode || ''}
                                        onChange={(e) =>
                                            onContactUpdate('postcode', e.target.value)
                                        }
                                        disabled={readOnly || useAccountAddress}
                                    />
                                </div>
                                <div style={{ paddingBottom: 10, width: '50%' }}>
                                    <AsText
                                        id='contact-country'
                                        title={window.translate('Country')}
                                        labelStyle={labelStyle}
                                        inputStyle={formInputStyle}
                                        value={contact?.country || ''}
                                        onChange={(e) =>
                                            onContactUpdate('country', e.target.value)
                                        }
                                        disabled={readOnly || useAccountAddress}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: cellPadding, width: '50%' }}>
                            Google Map Area

                        </div>
                    </div>
                </div>
            </div> */}
            <Spacer height={16} width={0} />
            <ContactHistory contact={contact} />
            <Spacer height={16} width={0} />

            <div style={sectionedPanelStyle}>
                <DetailsButtons
                    label={window.translate('Contact')}
                    isFavourite={contact.isFavourite}
                    onCancel={onCancel}
                    onUpdate={creating ? onCreateLocal : onUpdateLocal}
                    readOnly={readOnly}
                    creating={creating}
                    onFavouriteClick={() =>
                        onContactUpdate('isFavourite', !contact.isFavourite)
                    }
                    referenceId={contact.referenceId}
                    externaleReference={contact.externaleReference ?? ' '}
                />
            </div>
            <SaveConfirmModal
                isShowing={isModalShowing}
                onClose={() => showConfirmSaveModal(false)}
                onCancelSave={onCancel}
                onSave={creating ? onCreateLocal : onUpdateLocal}
                entityName='contact'
            />
        </div>
    );
};

export default ContactsDetails;
