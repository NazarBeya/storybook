import React, { useState, useEffect } from 'react';
import { AsButton, AsSearchBar, AsTab, AsTabContainer } from '@adserve/adserve-react-components';
import { useHistory, useLocation } from 'react-router-dom';
import ContactsGrid from './ContactsGrid';
import { gridContainerStyle, gridItemStyle, tabAreaStyle, tableAreaStyle } from '../../styles';
import { createContainerStyle } from './ContactsLandingStyles';
import {
    GetContactInListingFormat,
    GetContacts,
    DeleteContact,
    DeleteContacts
} from '../../services/ContactsDataService';
import useSession from '../../hooks/useSession';
import { sessionClearAllDetailsFor } from '../../services/SessionService';
import DeleteModal from '../../components/DeleteModal';

const ContactsLandingPage = () => {
    const history = useHistory();
    const location = useLocation();
    const [recentlyViewedOnly, setRecentlyViewedOnly] = useState(false);
    const [newItem, setNewItem] = useState(null);
    const [tab, setTab, delTab] = useSession('contactsTabIndex', 0);

    const [isModalShowing, setIsModalShowing] = useState(false);
    const [selectedContact, setSelectedContact] = useState({});
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [modalResult, showModalResult] = useState(false);

    const [apiParams, setApiParams] = useState({
        pageNumber: 1,
        pageSize: 15,
        sortField: 'fullName',
        sortOrder: 'asc',
        searchTerm: '',
        favouritesOnly: tab === 3,
        viewedOnly: tab === 2
    });

    const createButtonStyle = {
        width: 130,
        height: 40,
        fontSize: 14,
        fontWeight: 'bold'
    };

    const loadNewItem = () => {
        if (location?.state?.redirectedFrom !== 'create') return;

        GetContactInListingFormat(location.state.id)
            .then((data) => {
                setNewItem(data);
            })
            .catch(console.log);
    };

    useEffect(() => {
        sessionClearAllDetailsFor('contact');

        window.scrollTo(0, 0);

        return delTab;
    }, []);

    const handleCreateClick = () => {
        history.push('/contacts/create');
    };

    const handleEditClick = (payload) => {
        history.push({
            pathname: '/contacts/details',
            state: { contactId: payload.id, readOnly: false }
        });
    };

    const handleReadOnlyClick = (payload) => {
        history.push({
            pathname: '/contacts/details',
            state: { contactId: payload.id, readOnly: true }
        });
    };

    const handleGetData = async (params) => {
        loadNewItem();

        const searchParams = {
            ...params,
            searchTerm: encodeURIComponent(params?.searchTerm)
        };
        const results = await GetContacts(searchParams, tab === 1);
        setSelectedContact({});
        setSelectedContacts([]);
        showModalResult(false);
        return results;
    };

    const handleSearchUpdate = (value) => {
        setApiParams({ ...apiParams, searchTerm: value, pageNumber: 1 });
    };

    const handleTabClick = (index) => {
        setTab(index);
        console.log('index is ', index);
        switch (index) {
            case 0:
                setApiParams({
                    ...apiParams,
                    pageNumber: 1,
                    sortField: 'fullName',
                    sortOrder: 'asc',
                    tab: 0,

                    viewedOnly: false,
                    favouritesOnly: false
                });
                setRecentlyViewedOnly(false);
                break;
            case 1:
                setApiParams({
                    ...apiParams,
                    pageNumber: 1,
                    sortField: 'fullName',
                    sortOrder: 'asc',
                    viewedOnly: false,
                    favouritesOnly: false,
                    tab: 1
                });
                setRecentlyViewedOnly(false);
                break;
            case 2:
                setApiParams({
                    ...apiParams,
                    pageNumber: 1,
                    pageSize: 15,
                    sortField: 'lastViewed',
                    viewedOnly: true,
                    tab: 2,
                    sortOrder: 'Desc',
                    favouritesOnly: false
                });
                setRecentlyViewedOnly(true);
                break;
            case 3:
                setApiParams({
                    ...apiParams,
                    pageNumber: 1,
                    sortField: 'fullName',
                    sortOrder: 'Asc',
                    viewedOnly: false,
                    tab: 3,
                    favouritesOnly: true
                });
                setRecentlyViewedOnly(false);
                break;
            default:
                break;
        }
    };

    const onModalClose = () => {
        setIsModalShowing(false);
    };

    const handleDeleteClick = async () => {
        if (selectedContacts?.length > 0) {
            const ids = selectedContacts?.map((r) => r?.id);
            DeleteContacts(ids)
                .then(() => {
                    onModalClose();
                })
                .catch(console.log);
        } else {
            await DeleteContact(selectedContact?.id);
            onModalClose();
        }
        showModalResult(true);
    };
    const handleMultiRowDelete = (records) => {
        setSelectedContacts(records);
        setIsModalShowing(true);
    };

    const handleOpenDeleteDialog = (contact) => {
        setSelectedContact(contact);
        setIsModalShowing(true);
    };

    return (
        <>
            <div style={gridContainerStyle}>
                <div style={gridItemStyle} />
                <div style={gridItemStyle}>
                    <AsSearchBar
                        id='contactsSearch'
                        placeholder='Search Contacts...'
                        width={395}
                        height={42}
                        currentSearchTerm={apiParams?.searchTerm}
                        onSearchUpdate={handleSearchUpdate}
                    />
                </div>
                <div style={createContainerStyle}>
                    <AsButton style={createButtonStyle} handleClick={handleCreateClick}>
                        {window.translate('Create New')}
                    </AsButton>
                </div>
                <div style={{ ...gridItemStyle, ...tabAreaStyle }}>
                    <AsTabContainer onTabClick={handleTabClick} tabPanelStyle={{ height: 0 }} initalTab={tab}>
                        <AsTab title='All Contacts' />
                        <AsTab title='My Contacts' />
                        <AsTab title='Recently Viewed' />
                        <AsTab title='Favourites' />
                    </AsTabContainer>
                </div>
                <div style={{ ...gridItemStyle, ...tableAreaStyle }}>
                    <ContactsGrid
                        onGetData={handleGetData}
                        apiParams={apiParams}
                        onParamsChange={setApiParams}
                        recentlyViewedOnly={recentlyViewedOnly}
                        onEditClick={handleEditClick}
                        onReadOnlyClick={handleReadOnlyClick}
                        openDeleteDialog={handleOpenDeleteDialog}
                        newlyCreated={newItem}
                        selectedTab={tab}
                        isModalShowing={isModalShowing}
                        onMultiRowDelete={handleMultiRowDelete}
                        modalResult={modalResult}
                    />
                </div>
            </div>
            <DeleteModal
                isShowing={isModalShowing}
                onClose={onModalClose}
                onSubmit={handleDeleteClick}
                title={Object.keys(selectedContact)?.length > 0 ? selectedContact?.fullName : ''}
                entityName='contact'
                message={
                    selectedContacts?.length > 0
                        ? `${window.translate('Are you sure you wish to delete the selected records')}?`
                        : ''
                }
            />
        </>
    );
};

export default ContactsLandingPage;
