import React, { useState, useEffect, useReducer } from 'react';
import LeadsGrid from './LeadsGrid';
import { AsSearchBar, AsButton, Flex, AsTabContainer, AsTab } from '@adserve/adserve-react-components';
import { useHistory, useLocation } from 'react-router-dom';
import {
    gridItemStyle,
    gridContainerStyle,
    tabAreaStyle,
    tableAreaStyle,
    gridViewCreateButtonStyle
} from '../../styles';
import { GetLeads, GetLeadInListingFormat, DeleteLead, DeleteLeads } from '../../services/LeadsDataService';
import { apiParamsReducer } from '../../services/AsGridService';
import useSession from '../../hooks/useSession';
import { sessionClearAllDetailsFor } from '../../services/SessionService';
import DeleteModal from '../../components/DeleteModal';

const LeadLandingPage = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [tab, setTab, delTab] = useSession('leadsTabIndex', 0);
    const [newItem, setNewItem] = useState(null);
    const [isModalShowing, setIsModalShowing] = useState(false);
    const [selectedLead, setSelectedLead] = useState({});
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [modalResult, showModalResult] = useState(false);

    const apiParamDefaults = {
        sortField: 'fullName',
        sortOrder: 'asc',
        searchTerm: searchTerm || '',
        pageNumber: 1,
        pageSize: 15,
        favouritesOnly: tab === 3,
        viewedOnly: tab === 2
    };
    const [apiParams, apiParamsDispatcher] = useReducer(apiParamsReducer, apiParamDefaults);

    useEffect(() => {
        sessionClearAllDetailsFor('lead');

        window.scrollTo(0, 0);

        return delTab;
    }, []);

    const history = useHistory();

    const loadNewItem = (id) => {
        if (location?.state?.redirectedFrom !== 'create') return;

        GetLeadInListingFormat(location.state.id)
            .then((data) => {
                setNewItem(data);
            })
            .catch(console.log);
    };

    const handleGetData = async (params) => {
        loadNewItem();

        const searchParams = {
            ...params,
            searchTerm: encodeURIComponent(params?.searchTerm)
        };
        const results = await GetLeads(searchParams, tab === 1);
        setSelectedLead({});
        setSelectedLeads([]);
        showModalResult(false);
        return results;
    };

    const handleCreateClick = () => {
        history.push({
            pathname: '/leads/create',
            state: { leadId: window.emptyGuid, readOnly: false }
        });
    };

    const handleEditClick = (lead) => {
        history.push({
            pathname: '/leads/details',
            state: { leadId: lead.id, readOnly: false }
        });
    };

    const handleReadOnlyClick = (lead) => {
        history.push({
            pathname: '/leads/details',
            state: { leadId: lead.id, readOnly: true }
        });
    };

    const handleTabClick = (tabIndex) => {
        console.log('tabindex', tabIndex);
        switch (tabIndex) {
            case 2:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    sortField: 'lastViewed',
                    viewedOnly: true,
                    sortOrder: 'desc',
                    favouritesOnly: false,
                    tab: 2
                });
                break;

            case 3:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    viewedOnly: false,
                    favouritesOnly: true,
                    tab: 3
                });
                break;

            default:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    viewedOnly: false,
                    favouritesOnly: false,
                    tab: tabIndex
                });
                break;
        }
        setTab(tabIndex);
    };

    const onModalClose = () => {
        setIsModalShowing(false);
    };

    const handleDeleteClick = async () => {
        if (selectedLeads?.length > 0) {
            const ids = selectedLeads?.map((r) => r?.id);
            DeleteLeads(ids)
                .then(() => {
                    onModalClose();
                })
                .catch(console.log);
        } else {
            await DeleteLead(selectedLead?.id);
            onModalClose();
        }
        showModalResult(true);
    };
    const handleMultiRowDelete = (records) => {
        setSelectedLeads(records);
        setIsModalShowing(true);
    };

    const handleOpenDeleteDialog = (lead) => {
        setSelectedLead(lead);
        setIsModalShowing(true);
    };

    return (
        <>
            <div id='leads-container' style={gridContainerStyle}>
                <div style={gridItemStyle} />
                <div style={gridItemStyle}>
                    <AsSearchBar
                        id='leadsSearch'
                        placeholder='Search Leads...'
                        width={395}
                        height={42}
                        currentSearchTerm={searchTerm}
                        onSearchUpdate={setSearchTerm}
                    />
                </div>
                <Flex
                    style={{
                        ...gridItemStyle,
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}
                >
                    <AsButton style={gridViewCreateButtonStyle} handleClick={handleCreateClick}>
                        {window.translate('Create New')}
                    </AsButton>
                </Flex>
                <div style={{ ...gridItemStyle, ...tabAreaStyle }}>
                    <AsTabContainer tabPanelStyle={{ height: 0 }} onTabClick={handleTabClick} initalTab={tab}>
                        <AsTab title='All Leads' />
                        <AsTab title='My Leads' />
                        <AsTab title='Recently Viewed' />
                        <AsTab title='Favourites' />
                    </AsTabContainer>
                </div>
                <div
                    style={{
                        ...gridItemStyle,
                        ...tableAreaStyle,
                        width: '100%',
                        overflowX: 'hidden'
                    }}
                >
                    <LeadsGrid
                        onEditClick={handleEditClick}
                        onGetData={handleGetData}
                        searchTerm={searchTerm}
                        onReadOnlyClick={handleReadOnlyClick}
                        apiParams={apiParams}
                        apiParamsDispatcher={apiParamsDispatcher}
                        newlyCreated={newItem}
                        selectedTab={tab}
                        openDeleteDialog={handleOpenDeleteDialog}
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
                title={
                    Object.keys(selectedLead)?.length > 0 ? `${selectedLead?.firstName} ${selectedLead?.lastName}` : ''
                }
                entityName='laed'
                message={
                    selectedLeads?.length > 0
                        ? `${window.translate('Are you sure you wish to delete the selected records')}?`
                        : ''
                }
            />
        </>
    );
};

export default LeadLandingPage;
