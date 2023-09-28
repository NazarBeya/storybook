import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import DetailPageContainer from '../../components/containers/DetailPageContainer';
import ContactsDetails from '../../components/ContactsDetails';
import {
    AsTabContainer,
    AsTab,
    AsButton,
    Flex
} from '@adserve/adserve-react-components';
import {
    UpdateContact,
    DeleteContact,
    GetContactCampaigns,
    ContactsLookup,
    GetContactInListingFormat
} from '../../services/ContactsDataService';
import { AccountsLookup } from '../../services/AccountDataService';
import CampaignsGrid from '../Campaigns/CampaignsGrid';
import { CampaignsGridColumnDefinitions } from '../Campaigns/GridColumnDefinitions';
import useSession from '../../hooks/useSession';
import useRecordState from '../../hooks/useRecordState';
import ContactNotesAndAttachments from '../../components/generic/ContactNotesAndAttachments/ContactNotesAndAttachments';
import useSessionReducer from '../../hooks/useSessionReducer';
import AttachmentDropdownButton from '../../components/Attachments/AttachmentDropdownButton';
import { sessionClearAllDetailsExcept, sessionClearAllDetailsFor } from '../../services/SessionService';
import DeleteModal from '../../components/DeleteModal';
import { campaignManagerUi } from '../../constants/Endpoint';

const ContactsDetailsPage = () => {
    const history = useHistory();
    const location = useLocation();
    const reducer = (state, updatedValues) => ({ ...state, ...updatedValues });
    const [contactDto, contactDispatcher, delContact] = useSessionReducer(
        'currentContact',
        reducer,
        {}
    );
    const [contactCampaigns, setContactCampaigns] = useState({});
    const [readOnly, setReadOnly] = useSession('currentContactReadOnly');
    const { dataIsModified, resetDataModified, routePath } = useRecordState();
    const [isModalShowing, setIsModalShowing] = useState(false);
    const [tab, setTab, delTab] = useSession(
        'contactsDetailsTab',
        location?.state?.selectedTab ? location?.state?.selectedTab : 0
    );
    const [returnPath, setReturnPath] = useState('/contacts');
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    const query = useQuery();
    const [paramContactId] = useState(query.get('contactId'));
    const [paramReadOnly] = useState(query.get('readonly'));
    const [paramSource] = useState(query.get('source'));
    const [campaignId] = useState(query.get('campaignId'));

    const fetchData = async () => {
        if (paramContactId) {
            GetContactInListingFormat(paramContactId)
                .then((data) => {
                    contactDispatcher(data);
                })
                .catch(console.log);
        }

        if (paramReadOnly !== undefined) {
            setReadOnly(paramReadOnly === 'true');
        }
    };

    useEffect(() => {
        try {
            fetchData();
        } catch (e) {
            console.log('error', e);
        }
    }, []);

    useEffect(() => {
        if (location?.state?.redirectedFrom !== 'search') {
            const contactId = location?.state?.contactId || contactDto.id;
            GetContactInListingFormat(contactId)
                .then((data) => {
                    contactDispatcher(data);
                })
                .catch(console.log);
        }
        if (
            location?.state?.selectedTab &&
            tab !== location?.state?.selectedTab
        )
            setTab(location?.state?.selectedTab);

        if (location?.state?.selectedTab === 2) handleCampaignsData();

        setReadOnly(location?.state?.readOnly ?? readOnly ?? true);
        setReturnPath(location?.state?.path || '/contacts');
        sessionClearAllDetailsExcept('contact');
        window.scrollTo(0, 0);

        return delTab;
    }, [location?.state]);

    const getGridColumns = () => {
        const columns = CampaignsGridColumnDefinitions().map((c) => {
            if (c.field === 'campaignOwnerName') {
                c.showInList = false;
                return c;
            } else return c;
        });
        columns.push({
            displayOrder: 11,
            headerName: window.translate
                ? window.translate('Contact Role')
                : '',
            field: 'contactRoleName',
            type: 'text',
            width: 'auto',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style: CampaignsGridColumnDefinitions().style
        });
        return columns;
    };

    const tabPanelStyle = {
        boxShadow: 'unset',
        border: 'unset',
        borderRadius: 'unset',
        backgroundColor: '#f0f0f0'
    };

    const handleFormUpdate = (key, value) => {
        if (contactDto[key] !== value) {
            contactDispatcher({ [key]: value });
            dataIsModified();
        }
    };

    const handleFormMerge = (obj) => {
        contactDispatcher({ ...obj });
        dataIsModified();
    };

    const handleClose = () => {
        resetDataModified();
        history.push(routePath ?? '/contacts');
    };

    const handleCloseConfirm = () => {
        delContact();
        resetDataModified();
        if (paramSource === 'campaign-manager') {
            window.open(
                `${campaignManagerUi}/campaigns/details?campaignId=${campaignId}&source=crm`,
                '_self'
            );
        } else if (routePath) {
            history.push(routePath);
        } else {
            location?.onClose ? location.onClose() : history.push(returnPath);
        }
    };

    const handleEditConfirm = () => {
        setReadOnly(false);
    };

    const handleDeleteConfirm = async () => {
        const response = await DeleteContact(contactDto.id);
        if (response.status === 200) {
            sessionClearAllDetailsFor('lead');
            handleClose();
        }
    };

    const handleUpdateConfirm = async () => {
        const response = await UpdateContact({
            ...contactDto,
            salutationId: contactDto.salutationId === '-1' ? window.emptyGuid : contactDto.salutationId
        });
        // Like the Create it probably needs to check against more Statuses and take advantage of useModal
        if (response?.status === 200) {
            handleCloseConfirm();
        }
    };

    const handleLinkClick = () => {
        history.push({
            pathname: '/contacts/campaignslink',
            state: {
                contact: contactDto,
                campaigns: contactCampaigns,
                path: returnPath
            },
            onClose: handleHistoryClose
        });
    };

    const handleCampaignsData = async (params) => {
        const contactId = location?.state?.contactId || contactDto.id;
        const campaigns = await GetContactCampaigns(contactId, params);

        setContactCampaigns(campaigns.data.data);
        return campaigns.data;
    };

    const handleHistoryClose = () => {
        history.push({
            pathname: '/contacts/details',
            state: {
                contactId: location?.state?.contactId,
                readOnly: location?.state?.readOnly,
                selectedTab: tab
            }
        });
    };

    return (
        <DetailPageContainer
            title={contactDto?.fullName || window.translate('Existing Contact')}
            onClose={handleCloseConfirm}
            onEdit={handleEditConfirm}
            onDelete={() => setIsModalShowing(true)}
            deleteDisabled={!contactDto?.allowDelete}
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
                        <AsTab title={window.translate('Details')}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <ContactsDetails
                                    contact={contactDto}
                                    onContactUpdate={handleFormUpdate}
                                    onContactMerge={handleFormMerge}
                                    accountSearchFunction={AccountsLookup}
                                    contactSearchFunction={ContactsLookup}
                                    onUpdate={handleUpdateConfirm}
                                    onCancel={handleCloseConfirm}
                                    submitTitle={window.translate('Update')}
                                    readOnly={readOnly}
                                    returnPath='/contacts/details'
                                />
                            </div>
                        </AsTab>
                        <AsTab title={window.translate('Notes & Attachments')}>
                            <Flex style={{ flexDirection: 'column' }}>
                                <AttachmentDropdownButton
                                    entityId={contactDto?.id}
                                    heading={contactDto?.fullName}
                                    entityType='contact'
                                    onClose={handleHistoryClose}
                                />
                                <ContactNotesAndAttachments
                                    entityId={contactDto?.id}
                                    entityType='contact'
                                    onClose={handleHistoryClose}
                                    heading={contactDto?.fullName}
                                />
                            </Flex>
                        </AsTab>
                        <AsTab title={window.translate('Campaigns')}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <AsButton
                                    id='contact-campaign-link'
                                    style={{
                                        alignSelf: 'flex-end',
                                        position: 'absolute',
                                        width: 130,
                                        marginTop: -47,
                                        marginRight: 33,
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                    }}
                                    handleClick={handleLinkClick}
                                >
                                    {window.translate('Link')}
                                </AsButton>

                                <CampaignsGrid
                                    onGetData={handleCampaignsData}
                                    gridColumnDefinitions={getGridColumns()}
                                />
                            </div>
                        </AsTab>
                    </AsTabContainer>
                </div>
            </div>
            <DeleteModal
                isShowing={isModalShowing}
                onClose={() => setIsModalShowing(false)}
                onSubmit={handleDeleteConfirm}
                entityName='contact'
            />
        </DetailPageContainer>
    );
};

export default ContactsDetailsPage;
