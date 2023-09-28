import React, { useState, useEffect, useContext } from 'react';
import {
    Flex,
    AsText,
    Spacer,
    LabelledRadioButton,
    AsLabel,
    AsNumber,
    AsSelect
} from '@adserve/adserve-react-components';
import AutoFlex from './containers/AutoFlex';
import {
    labelStyle,
    inputStyle,
    disabledSelectStyle,
    sectionedPanelStyle
} from '../styles';
import { ReactComponent as IconLinkedIn } from '../svg/icon_Social_LinkedIn.svg';
import { ReactComponent as IconFacebook } from '../svg/icon_Social_Facebook.svg';
import { ReactComponent as IconTwitter } from '../svg/icon_Social_Twitter.svg';
import { ReactComponent as IconOther } from '../svg/icon_Social_Other.svg';
import CompactTable from './generic/CompactTable/CompactTable';
import leadOwnerCompactTableColumnDefinitions from '../pages/LeadsDetails/leadOwnerCompactTableColumnDefinitions';
import DetailsButtons from './inputs/DetailsButtons';
import { SearchUsers } from '../services/LeadsDataService';
import CrmSelect from './inputs/CrmSelect';
import AsStatus from './generic/AsStatus';
import {
    IsValidEmail,
    IsValidLandline,
    IsValidMobile,
    DefaultInputStatus,
    SuccessInputStatus,
    ErrorInputStatus
} from '../services/UtilsService';
import {
    InputStatusColors,
    InputStatusBGColors,
    BusinessTypes
} from '../constants/Enums';
import SaveConfirmModal from './SaveConfirmModal';
import useRecordState from '../hooks/useRecordState';
import { SystemSettingsContext } from '../contexts/SystemSettingsContext';
import LabelledDatePicker from '../components/AccountBilling/LabelledDatePicker';
import useLeadsConvertStates from '../hooks/useLeadsConvertStates';
import LeadConvertModal from '../pages/LeadsDetails/LeadConvertModal';
import { GetAllProductCategories, SearchCampaignOwner, SearchCategories } from '../services/CampaignsDataService';
import { GetUser } from '../services/UserDataService';
import UserCompactTableColumnDefinitions from '../pages/LeadsDetails/UserCompactTableColumnDefinitions';
import CategoryCompactTableColumnDefinitions from '../pages/LeadsDetails/CategoryCompactTableColumnDefinitions';

const LeadsDetails = ({
    lead = {},
    creating = false,
    readOnly = false,
    onCancel,
    onUpdate,
    leadDispatcher,
    salutations,
    leadSources,
    leadStatuses,
    locationStates,
    ratings,
    industries,
    leadTypes,
    demographics,
    returnPath,
    convertButtonVisible
}) => {
    const { formatCurrency } = useContext(SystemSettingsContext);
    const [firstNameStatus, setFirstNameStatus] = useState(() =>
        DefaultInputStatus()
    );
    const [lastNameStatus, setLastNameStatus] = useState(() =>
        DefaultInputStatus()
    );
    const [companyStatus, setCompanyStatus] = useState(() =>
        DefaultInputStatus()
    );
    const [emailWorkStatus, setEmailWorkStatus] = useState(() => DefaultInputStatus());
    const [emailOtherStatus, setEmailOtherStatus] = useState(() => DefaultInputStatus());
    const [mobNumStatus, setMobNumStatus] = useState(() => DefaultInputStatus());
    const [telNumStatus, setTelNumStatus] = useState(() => DefaultInputStatus());
    const [returnStates, setReturnStates] = useState({});
    const [isLeadConvertModalShowing, setIsLeadConvertModalShowing] = useState(false);

    const [categories, setCategories] = useState([]);

    const campaignTypes = [
        {
            id: 0,
            name: window.translate(BusinessTypes.AIRTIME.text)
        },
        {
            id: 1,
            name: window.translate(BusinessTypes.SANDP.text)
        },
        {
            id: 2,
            name: window.translate(BusinessTypes.OFFAIRS.text)
        }
    ];

    const minLengthToStartSearch = 3;
    const {
        isModalShowing,
        showConfirmSaveModal,
        dataIsModified,
        resetDataModified
    } = useRecordState();
    const {
        campaignOwner,
        campaignOwnerSearchTerm,
        businessType,
        startDate,
        endDate,
        setCampaignOwner,
        setCampaignOwnerSearchTerm,
        setStartDate,
        setEndDate,
        setBusinessType,
        setLeadType
    } = useLeadsConvertStates();

    useEffect(() => {
        GetAllProductCategories()
            .then((data) => setCategories(data))
            .catch(console.log);
    }, []);

    useEffect(() => {
        setReturnStates({
            campaignOwner: campaignOwner,
            campaignOwnerSearchTerm: campaignOwnerSearchTerm,
            budget: lead.budget,
            selectedTab: 0,
            startDate: startDate,
            endDate: endDate,
            businessType: businessType,
            leadTypeId: lead.leadTypeId,
            lead: lead
        });
    }, [
        campaignOwner,
        campaignOwnerSearchTerm,
        lead,
        startDate,
        endDate,
        businessType
    ]);

    /**
     * Update current lead with the given key/value pair
     * @param {string} k - key
     * @param {*} v -value
     */
    const updateLead = (k, v) => {
        if (lead[k] != v) {
            leadDispatcher({ ...lead, [k]: v });

            dataIsModified();
        }
    };

    // Styles
    const cellPadding = '16px 42px 0';
    const inputOmniProps = {
        labelStyle: labelStyle,
        disabled: readOnly
    };
    const textOmniProps = {
        ...inputOmniProps,
        autoComplete: false,
        inputStyle: inputStyle
    };
    const errorInputStyle = {
        border: `1px solid ${InputStatusColors.RED}`,
        backgroundColor: InputStatusBGColors.RED
    };
    const successInputStyle = {
        border: `1px solid ${InputStatusColors.GREEN}`,
        backgroundColor: InputStatusBGColors.GREEN
    };
    const socialMediaLabel = (title, icon) => (
        <>
            <Flex centreVertical>
                {icon}
                <Spacer width={6} />
                {title}
            </Flex>
            <Spacer height={3} />
        </>
    );

    useEffect(() => {
        resetDataModified();
    }, []);

    useEffect(() => {
        if (locationStates) {
            if (locationStates.campaignOwner)
                setCampaignOwner(locationStates.campaignOwner);
            if (locationStates.campaignOwnerSearchTerm)
                setCampaignOwnerSearchTerm(
                    locationStates.campaignOwnerSearchTerm
                );
            if (locationStates.budget)
                updateLead('budget', locationStates.budget);
            if (locationStates.startDate)
                setStartDate(locationStates.startDate);
            if (locationStates.endDate) setEndDate(locationStates.endDate);
            if (locationStates.businessType)
                setBusinessType(locationStates.businessType);
            if (locationStates.leadTypeId) {
                updateLead('leadTypeId', locationStates.leadTypeId);
            }
        }
    }, [locationStates]);

    useEffect(() => {
        if (leadTypes && lead?.leadTypeId)
            setLeadType(leadTypes?.find((t) => t.id === lead.leadTypeId)?.name);
    }, [leadTypes, lead?.leadTypeId]);

    const leadOwnerSearch = async (searchTerm, params) => {
        const response = await SearchUsers(searchTerm, params);
        return response.data;
    };

    const campaignOwnerSearch = async (searchTerm, params) => {
        return await SearchCampaignOwner(searchTerm, params);
    };

    const handleOwnerChange = (event) => {
        lead.leadOwnerName = event.target.value;
        lead.leadOwnerId = undefined;
        leadDispatcher({ ...lead });
        dataIsModified();
    };

    const handleCampaignOwnerSearchTermChange = (event) => {
        setCampaignOwnerSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event) => {
        lead.productCategoryName = event.target.value;
        lead.productCategoryId = undefined;
        leadDispatcher({ ...lead });
        dataIsModified();
    };

    const handleCampaignOwnerSelect = (searchResult) => {
        if (locationStates) {
            locationStates.campaignOwnerSearchTerm = searchResult.name;
            locationStates.campaignOwner = searchResult;
        }
        setCampaignOwnerSearchTerm(searchResult.name);
        setCampaignOwner(searchResult);
    };
    const handleBusinessTypeChange = (e) => {
        lead.businessType = e.target.value;
        setBusinessType(e.target.value);
        dataIsModified();
    };

    const onStartDateChange = (event) => {
        const date = event.target.value;
        if (date > endDate) {
            lead.endDate = date;
            setEndDate(date);
        };
        lead.startDate = date;
        setStartDate(date);
    };

    const onEndDateChange = (event) => {
        const date = event.target.value;
        lead.endDate = date;
        setEndDate(date);
    };

    const onLeadOwnerDropdownClick = ({ id, name }) => {
        lead.leadOwnerName = name;
        lead.leadOwnerId = id;
        leadDispatcher({ ...lead });
        dataIsModified();
    };

    const onCategoryDropdownClick = ({ id, name }) => {
        lead.productCategoryName = name;
        lead.productCategoryId = id;
        leadDispatcher({ ...lead });
        dataIsModified();
    };

    const onUpdateLocal = async () => {
        const isInputValid = await isValidateFormInput();
        if (isInputValid) {
            onUpdate();
        }
    };

    const isValidateFormInput = async () => {
        let retVal = true;

        if (!lead?.firstName) {
            setFirstNameStatus(
                ErrorInputStatus(window.translate('First name is required'))
            );
            retVal = false;
        }

        if (!lead?.lastName) {
            setLastNameStatus(
                ErrorInputStatus(window.translate('Last name is required'))
            );
            retVal = false;
        }

        if (!lead?.company) {
            setCompanyStatus(
                ErrorInputStatus(window.translate('Company is required'))
            );
            retVal = false;
        }

        if (lead?.emailWork && !(await emailWorkSearch(lead.emailWork, true))) {
            retVal = false;
        }

        if (
            lead?.emailOther &&
            !(await emailOtherSearch(lead.emailOther, true))
        ) {
            retVal = false;
        }

        if (
            lead?.mobileNumber &&
            !(await mobileNumSearch(lead.mobileNumber, true))
        ) {
            retVal = false;
        }

        if (
            lead?.telephoneNumber &&
            !(await telNumSearch(lead.telephoneNumber, true))
        ) {
            retVal = false;
        }

        return retVal;
    };

    useEffect(() => {
        if (!readOnly && lead?.emailWork?.length > 5) {
            emailWorkSearch(lead?.emailWork, false);
        }
    }, [lead?.emailWork]);

    const emailWorkSearch = async (searchValue, validationOnly) => {
        const retValue = true;

        if (
            (!searchValue || searchValue.length < minLengthToStartSearch) &&
            !validationOnly
        ) {
            setEmailWorkStatus(DefaultInputStatus());
            return retValue;
        }

        if (!IsValidEmail(searchValue)) {
            setEmailWorkStatus(
                ErrorInputStatus(
                    window.translate('Enter a valid Email address')
                )
            );
            return false;
        } else if (!validationOnly) {
            setEmailWorkStatus(SuccessInputStatus());
        }

        return retValue;
    };

    useEffect(() => {
        if (!readOnly && lead?.emailOther?.length > 5) {
            emailOtherSearch(lead?.emailOther, false);
        }
    }, [lead?.emailOther]);

    const emailOtherSearch = async (searchValue, validationOnly) => {
        const retValue = true;

        if (
            (!searchValue || searchValue.length < minLengthToStartSearch) &&
            !validationOnly
        ) {
            setEmailOtherStatus(DefaultInputStatus());
            return retValue;
        } else {
            setEmailOtherStatus(SuccessInputStatus());
        }

        if (!IsValidEmail(searchValue)) {
            setEmailOtherStatus(
                ErrorInputStatus('Enter a valid Email address')
            );
            return false;
        } else if (!validationOnly) {
            setEmailOtherStatus(SuccessInputStatus());
        }

        return retValue;
    };

    useEffect(() => {
        if (!readOnly && lead?.mobileNumber?.length > 5) {
            mobileNumSearch(lead?.mobileNumber, false);
        }
    }, [lead?.mobileNumber]);

    useEffect(() => {
        if (lead?.createdBy && !campaignOwner) {
            GetUser(lead?.createdBy)
                .then((data) => {
                    const leadOwner = { id: data.id, name: data.name };
                    setCampaignOwner(leadOwner);
                    setCampaignOwnerSearchTerm(data.name);
                })
                .catch(console.log);
        }
    }, [lead?.createdBy]);
    useEffect(() => {
        setBusinessType(lead.businessType);
        setStartDate(Date.parse(lead.startDate));
        setEndDate(Date.parse(lead.endDate));
    }, [lead]);

    const mobileNumSearch = async (searchValue, validationOnly) => {
        const retValue = true;

        if (
            (!searchValue || searchValue.length < minLengthToStartSearch) &&
            !validationOnly
        ) {
            setMobNumStatus(DefaultInputStatus());
            return retValue;
        } else {
            setMobNumStatus(SuccessInputStatus());
        }

        if (!IsValidMobile(searchValue)) {
            setMobNumStatus(
                ErrorInputStatus(window.translate('Invalid mobile number'))
            );
            return false;
        }

        return retValue;
    };

    useEffect(() => {
        if (!readOnly && lead?.telephoneNumber?.length > 5) {
            telNumSearch(lead?.telephoneNumber, false);
        }
    }, [lead?.telephoneNumber]);

    const telNumSearch = async (searchValue, validationOnly) => {
        const retValue = true;

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

    const handleEmailClick = (event) => {
        if (event.target.value) {
            window.location.href = 'mailto:' + event.target.value;
        }
    };

    const handleWebsiteClick = (event) => {
        const url = event.target.value.match(/^https?:/)
            ? event.target.value
            : '//' + event.target.value;
        const win = window.open(url, '_blank');
        win?.focus();
    };

    const getLeadTypeId = (name) => leadTypes?.find((t) => t.name === name)?.id;
    return (
        <>
            <Flex style={{ flexDirection: 'column' }}>
                <div style={{ ...sectionedPanelStyle, paddingBottom: 16 }}>
                    <AutoFlex id='row-0' itemPadding={cellPadding}>
                        <Flex>
                            <div style={{ width: 97 }}>
                                <CrmSelect
                                    id='leads-salutation'
                                    title={window.translate('Salutation')}
                                    disabledStyle={disabledSelectStyle}
                                    placeholder='Select...'
                                    disabled={readOnly}
                                    values={salutations}
                                    value={lead.salutationId}
                                    onChange={(e) =>
                                        updateLead(
                                            'salutationId',
                                            e.target.value
                                        )
                                    }
                                    creating={creating}
                                />
                            </div>
                            <div style={{ flex: 1, marginLeft: 20 }}>
                                <AsStatus
                                    statusMessage={
                                        firstNameStatus.statusMessage
                                    }
                                    statusColor={firstNameStatus.statusColor}
                                >
                                    <AsText
                                        id='leads-first-name'
                                        {...textOmniProps}
                                        inputStyle={{
                                            ...inputStyle,
                                            ...(firstNameStatus.statusMessage
                                                ? errorInputStyle
                                                : {})
                                        }}
                                        title={`${window.translate(
                                            'First name'
                                        )} *`}
                                        value={lead.firstName}
                                        onChange={(e) => {
                                            setFirstNameStatus(
                                                DefaultInputStatus()
                                            );
                                            updateLead(
                                                'firstName',
                                                e.target.value
                                            );
                                        }}
                                    />
                                </AsStatus>
                            </div>
                        </Flex>
                        <AsStatus
                            statusMessage={lastNameStatus.statusMessage}
                            statusColor={lastNameStatus.statusColor}
                        >
                            <AsText
                                id='leads-last-name'
                                {...textOmniProps}
                                inputStyle={{
                                    ...inputStyle,
                                    ...(lastNameStatus.statusMessage
                                        ? errorInputStyle
                                        : {})
                                }}
                                title={window.translate('Last name *')}
                                value={lead.lastName}
                                onChange={(e) => {
                                    setLastNameStatus(DefaultInputStatus());
                                    updateLead('lastName', e.target.value);
                                }}
                            />
                        </AsStatus>
                        <AsStatus
                            statusMessage={companyStatus.statusMessage}
                            statusColor={companyStatus.statusColor}
                        >
                            <AsText
                                id='leads-company'
                                {...textOmniProps}
                                inputStyle={{
                                    ...inputStyle,
                                    ...(companyStatus.statusMessage
                                        ? errorInputStyle
                                        : {})
                                }}
                                title={window.translate('Company *')}
                                value={lead.company}
                                onChange={(e) => {
                                    setCompanyStatus(DefaultInputStatus());
                                    updateLead('company', e.target.value);
                                }}
                            />
                        </AsStatus>
                        <AsText
                            id='leads-job-title'
                            {...textOmniProps}
                            title={window.translate('Job Title')}
                            value={lead.title}
                            onChange={(e) =>
                                updateLead('title', e.target.value)
                            }
                        />
                    </AutoFlex>

                    <AutoFlex id='row-1' itemPadding={cellPadding}>
                        <AsStatus
                            statusMessage={emailWorkStatus.statusMessage}
                            statusColor={emailWorkStatus.statusColor}
                        >
                            <AsText
                                id='leads-email-work'
                                {...textOmniProps}
                                inputType='submit'
                                inputStyle={{
                                    ...inputStyle,
                                    ...(emailWorkStatus.statusMessage
                                        ? errorInputStyle
                                        : emailWorkStatus.statusColor ===
                                          InputStatusColors.GREEN
                                        ? successInputStyle
                                        : {})
                                }}
                                title={window.translate('Email - Work')}
                                value={lead.emailWork}
                                onChange={(e) => {
                                    setEmailWorkStatus(DefaultInputStatus());
                                    updateLead('emailWork', e.target.value);
                                }}
                                onClick={handleEmailClick}
                            />
                        </AsStatus>
                        <AsStatus
                            statusMessage={emailOtherStatus.statusMessage}
                            statusColor={emailOtherStatus.statusColor}
                        >
                            <AsText
                                id='leads-email-other'
                                {...textOmniProps}
                                inputType='submit'
                                inputStyle={{
                                    ...inputStyle,
                                    ...(emailOtherStatus.statusMessage
                                        ? errorInputStyle
                                        : emailOtherStatus.statusColor ===
                                          InputStatusColors.GREEN
                                        ? successInputStyle
                                        : {})
                                }}
                                title={window.translate('Email - Other')}
                                value={lead.emailOther}
                                onChange={(e) => {
                                    setEmailOtherStatus(DefaultInputStatus());
                                    updateLead('emailOther', e.target.value);
                                }}
                                onClick={handleEmailClick}
                            />
                        </AsStatus>
                        <AsStatus
                            statusMessage={mobNumStatus.statusMessage}
                            statusColor={mobNumStatus.statusColor}
                        >
                            <AsText
                                id='leads-mobile'
                                {...textOmniProps}
                                inputStyle={{
                                    ...inputStyle,
                                    ...(mobNumStatus.statusMessage
                                        ? errorInputStyle
                                        : mobNumStatus.statusColor ===
                                          InputStatusColors.GREEN
                                        ? successInputStyle
                                        : {})
                                }}
                                title={window.translate('Mobile')}
                                value={lead.mobileNumber}
                                onChange={(e) => {
                                    setMobNumStatus(DefaultInputStatus());
                                    updateLead('mobileNumber', e.target.value);
                                }}
                            />
                        </AsStatus>
                        <AsStatus
                            statusMessage={telNumStatus.statusMessage}
                            statusColor={telNumStatus.statusColor}
                        >
                            <AsText
                                id='leads-landline'
                                {...textOmniProps}
                                inputStyle={{
                                    ...inputStyle,
                                    ...(telNumStatus.statusMessage
                                        ? errorInputStyle
                                        : telNumStatus.statusColor ===
                                          InputStatusColors.GREEN
                                        ? successInputStyle
                                        : {})
                                }}
                                title={window.translate('Landline')}
                                value={lead.telephoneNumber}
                                onChange={(e) => {
                                    setTelNumStatus(DefaultInputStatus());
                                    updateLead(
                                        'telephoneNumber',
                                        e.target.value
                                    );
                                }}
                            />
                        </AsStatus>
                    </AutoFlex>

                    <AutoFlex id='row-2-social-media' itemPadding={cellPadding}>
                        <AsText
                            id='leads-linked-in'
                            {...textOmniProps}
                            title={socialMediaLabel(
                                window.translate('LinkedIn'),
                                <IconLinkedIn width={20} fill='#0088c0' />
                            )}
                            inputType='submit'
                            value={lead.socialMediaLinkedIn}
                            onChange={(e) =>
                                updateLead(
                                    'socialMediaLinkedIn',
                                    e.target.value
                                )
                            }
                            onClick={handleWebsiteClick}
                        />
                        <AsText
                            id='leads-facebook'
                            {...textOmniProps}
                            title={socialMediaLabel(
                                window.translate('Facebook'),
                                <IconFacebook width={20} fill='#537dc0' />
                            )}
                            inputType='submit'
                            value={lead.socialMediaFacebook}
                            onChange={(e) =>
                                updateLead(
                                    'socialMediaFacebook',
                                    e.target.value
                                )
                            }
                            onClick={handleWebsiteClick}
                        />
                        <AsText
                            id='leads-twitter'
                            {...textOmniProps}
                            title={socialMediaLabel(
                                window.translate('Twitter'),
                                <IconTwitter width={20} fill='#19b2f5' />
                            )}
                            inputType='submit'
                            value={lead.socialMediaTwitter}
                            onChange={(e) =>
                                updateLead('socialMediaTwitter', e.target.value)
                            }
                            onClick={handleWebsiteClick}
                        />
                        <AsText
                            id='leads-other'
                            {...textOmniProps}
                            title={socialMediaLabel(
                                window.translate('Other'),
                                <IconOther width={20} fill='#414141' />
                            )}
                            inputType='submit'
                            value={lead.socialMediaOther}
                            onChange={(e) =>
                                updateLead('socialMediaOther', e.target.value)
                            }
                            onClick={handleWebsiteClick}
                        />
                    </AutoFlex>

                    <AutoFlex id='row-3' itemPadding={cellPadding}>
                        <CrmSelect
                            id='leads-lead-source'
                            title={window.translate('Source')}
                            disabledStyle={disabledSelectStyle}
                            placeholder='Select ...'
                            disabled={readOnly}
                            value={lead.leadSourceId}
                            values={leadSources}
                            onChange={(e) =>
                                updateLead('leadSourceId', e.target.value)
                            }
                            creating={creating}
                        />
                        <CrmSelect
                            id='leads-lead-status'
                            title={window.translate('Lead status')}
                            disabledStyle={disabledSelectStyle}
                            placeholder='Select ...'
                            disabled={readOnly}
                            value={lead.leadStatusId}
                            values={leadStatuses}
                            onChange={(e) =>
                                updateLead('leadStatusId', e.target.value)
                            }
                            creating={creating}
                        />
                        <CrmSelect
                            id='leads-industry'
                            title={window.translate('Industry')}
                            disabledStyle={disabledSelectStyle}
                            placeholder='Select ...'
                            disabled={readOnly}
                            value={lead.industryId}
                            values={industries}
                            onChange={(e) =>
                                updateLead('industryId', e.target.value)
                            }
                            creating={creating}
                        />
                        <CrmSelect
                            id='leads-rating'
                            title={window.translate('Rating')}
                            disabledStyle={disabledSelectStyle}
                            placeholder='Select ...'
                            disabled={readOnly}
                            value={lead.ratingId}
                            values={ratings}
                            onChange={(e) =>
                                updateLead('ratingId', e.target.value)
                            }
                            creating={creating}
                        />
                    </AutoFlex>
                    <AutoFlex id='row-4' itemPadding={cellPadding}>
                        <div>
                            <AsLabel style={{ paddingBottom: 5 }}>
                                {window.translate('Lead Owner')}
                            </AsLabel>
                            <CompactTable
                                id='lead-owner'
                                {...textOmniProps}
                                value={lead.leadOwnerName}
                                onChange={handleOwnerChange}
                                searchFunction={leadOwnerSearch}
                                onDropdownClick={onLeadOwnerDropdownClick}
                                minSearchLength={2}
                                tableColumnDefinitions={
                                    leadOwnerCompactTableColumnDefinitions
                                }
                                disabled={readOnly}
                                returnPath={returnPath}
                                returnStates={returnStates}
                            />
                        </div>
                    </AutoFlex>
                </div>

                <Spacer height={16} width={0} />

                <div
                    style={{
                        ...sectionedPanelStyle,
                        paddingTop: 16,
                        paddingBottom: 16
                    }}
                >
                    <AutoFlex
                        id='campaign-row-0'
                        itemPadding='0 42px'
                        style={{
                            color: '#414141',
                            fontSize: 18,
                            fontWeight: 500
                        }}
                    >
                        {window.translate('Campaign Information')}
                    </AutoFlex>

                    <AutoFlex id='campaign-row-1' itemPadding={cellPadding}>
                        <CrmSelect
                            id='campaign-business-type'
                            title={window.translate('Campaign type')}
                            disabledStyle={disabledSelectStyle}
                            placeholder='Select ...'
                            disabled={readOnly}
                            value={lead?.businessType?.toString()}
                            values={campaignTypes}
                            onChange={handleBusinessTypeChange}
                            creating={creating}
                        />

                        <div>
                            <AsLabel>{window.translate('Lead type')}</AsLabel>
                            <Spacer height={12} />
                            <AutoFlex id='radio-button-cell'>
                                <LabelledRadioButton
                                    id='lead-type-direct'
                                    title={window.translate('Advertiser')}
                                    disabled={readOnly}
                                    gap={8}
                                    {...(readOnly
                                        ? { disabled: readOnly }
                                        : {
                                              onClick: () => {
                                                  setLeadType('Advertiser');
                                                  updateLead(
                                                      'leadTypeId',
                                                      getLeadTypeId(
                                                          'Advertiser'
                                                      )
                                                  );
                                              }
                                          })}
                                    value={
                                        lead.leadTypeId ===
                                            getLeadTypeId('Advertiser') ||
                                        lead.leadTypeId !==
                                            getLeadTypeId('Agency')
                                    }
                                />
                                <LabelledRadioButton
                                    id='lead-type-agency'
                                    title={window.translate('Agency')}
                                    disabled={readOnly}
                                    gap={6}
                                    {...(readOnly
                                        ? { disabled: readOnly }
                                        : {
                                              onClick: () => {
                                                  setLeadType('Agency');
                                                  updateLead(
                                                      'leadTypeId',
                                                      getLeadTypeId('Agency')
                                                  );
                                              }
                                          })}
                                    value={
                                        lead.leadTypeId ===
                                        getLeadTypeId('Agency')
                                    }
                                />
                            </AutoFlex>
                        </div>

                        <div>
                            <AsNumber
                                id='lead-budget'
                                name='budget'
                                title={window.translate('Budget')}
                                labelStyle={labelStyle}
                                inputStyle={inputStyle}
                                value={lead.budget}
                                onChange={(e) => {
                                    updateLead('budget', e.target.value);
                                }}
                                disabled={readOnly}
                                allowFloat={true}
                                formatCurrency={formatCurrency}
                            />
                        </div>

                        <div>
                            <CrmSelect
                                id='leads-demographic'
                                title={window.translate('Target demographic')}
                                disabledStyle={disabledSelectStyle}
                                placeholder='Select ...'
                                disabled={readOnly}
                                value={lead.demographicId}
                                values={demographics || []}
                                onChange={(e) =>
                                    updateLead('demographicId', e.target.value)
                                }
                                creating={creating}
                            />
                        </div>
                    </AutoFlex>

                    <AutoFlex id='campaign-row-2' itemPadding={cellPadding}>
                        <div>
                            <LabelledDatePicker
                                currentDate={startDate}
                                onChange={onStartDateChange}
                                required={true}
                                disabled={readOnly}
                                inputStyle={{ width: '80%' }}
                            >
                                {window.translate('Start date')}
                            </LabelledDatePicker>
                        </div>

                        <div>
                            <LabelledDatePicker
                                currentDate={endDate}
                                onChange={onEndDateChange}
                                minDate={startDate}
                                required={true}
                                disabled={readOnly}
                                inputStyle={{ width: '80%' }}
                            >
                                {window.translate('End date')}
                            </LabelledDatePicker>
                        </div>

                        <div>
                            <AsLabel style={{ marginBottom: 5 }}>
                                {window.translate('Campaign owner')}
                            </AsLabel>
                            <CompactTable
                                id='campaign-owner'
                                {...textOmniProps}
                                value={campaignOwnerSearchTerm}
                                onChange={handleCampaignOwnerSearchTermChange}
                                searchFunction={campaignOwnerSearch}
                                onDropdownClick={handleCampaignOwnerSelect}
                                minSearchLength={2}
                                tableColumnDefinitions={
                                    UserCompactTableColumnDefinitions
                                }
                                disabled={readOnly}
                                returnPath={returnPath}
                                returnStates={returnStates}
                            />
                        </div>

                        <div>
                            <CrmSelect
                                id='product-category'
                                name='productCategoryId'
                                title={window.translate('Default Category')}
                                placeholder='Select ...'
                                disabledStyle={disabledSelectStyle}
                                values={categories}
                                value={lead.productCategoryId}
                                onChange={(e) =>
                                    updateLead('productCategoryId', e.target.value)
                                }
                                disabled={readOnly}
                                creating={creating}
                            />
                        </div>
                    </AutoFlex>
                </div>

                <Spacer height={16} width={0} />

                <div
                    style={{
                        ...sectionedPanelStyle,
                        paddingTop: 16,
                        paddingBottom: 16
                    }}
                >
                    <AutoFlex
                        id='address-row-0'
                        itemPadding='0 42px'
                        style={{
                            color: '#414141',
                            fontSize: 18,
                            fontWeight: 500
                        }}
                    >
                        {window.translate('Address Information')}
                    </AutoFlex>

                    <AutoFlex id='address-row-1' itemPadding={cellPadding}>
                        <AsText
                            id='leads-address-line-1'
                            {...textOmniProps}
                            title={window.translate('Address line 1')}
                            value={lead.addressLine1}
                            onChange={(e) =>
                                updateLead('addressLine1', e.target.value)
                            }
                        />
                        <AsText
                            id='leads-address-line-2'
                            {...textOmniProps}
                            title={window.translate('Address line 2')}
                            value={lead.addressLine2}
                            onChange={(e) =>
                                updateLead('addressLine2', e.target.value)
                            }
                        />
                    </AutoFlex>

                    <AutoFlex id='address-row-2' itemPadding={cellPadding}>
                        <AsText
                            id='leads-address-city'
                            {...textOmniProps}
                            title={window.translate('City')}
                            value={lead.city}
                            onChange={(e) => updateLead('city', e.target.value)}
                        />
                        <AsText
                            id='leads-address-county'
                            {...textOmniProps}
                            title={window.translate('State / County')}
                            value={lead.county}
                            onChange={(e) =>
                                updateLead('county', e.target.value)
                            }
                        />
                        <AsText
                            id='leads-address-postcode'
                            {...textOmniProps}
                            title={window.translate('Postcode')}
                            value={lead.postcode}
                            onChange={(e) =>
                                updateLead('postcode', e.target.value)
                            }
                        />
                        <AsText
                            id='leads-address-country'
                            {...textOmniProps}
                            title={window.translate('Country')}
                            value={lead.country}
                            onChange={(e) =>
                                updateLead('country', e.target.value)
                            }
                        />
                    </AutoFlex>
                </div>

                <Spacer height={16} width={0} />

                <div style={sectionedPanelStyle}>
                    <DetailsButtons
                        label={window.translate('Lead')}
                        creating={creating}
                        readOnly={readOnly}
                        onUpdate={onUpdateLocal}
                        onCancel={onCancel}
                        referenceId={lead.referenceId}
                        isFavourite={lead.isFavourite}
                        onFavouriteClick={() =>
                            updateLead('isFavourite', !lead.isFavourite)
                        }
                        additionalActionButtonVisible={convertButtonVisible}
                        additionalActionLabel={window.translate('Convert')}
                        onAdditionalAction={() =>
                            setIsLeadConvertModalShowing(true)
                        }
                    />
                </div>
                <SaveConfirmModal
                    isShowing={isModalShowing}
                    onClose={() => showConfirmSaveModal(false)}
                    onCancelSave={onCancel}
                    onSave={onUpdateLocal}
                    entityName='lead'
                />
                <LeadConvertModal
                    lead={lead}
                    isShowing={isLeadConvertModalShowing}
                    onClose={() => setIsLeadConvertModalShowing(false)}
                    onSave={onUpdateLocal}
                />
            </Flex>
        </>
    );
};

export default LeadsDetails;
