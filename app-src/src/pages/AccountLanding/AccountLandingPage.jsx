import React, { useState, useEffect, useReducer, useContext } from 'react';
import { AsGrid, AsSearchBar, AsButton, AsTabContainer, AsTab, mapPageInfo } from '@adserve/adserve-react-components';
import { apiParamsReducer } from '../../services/AsGridService';
import initialColumnDefinitions from './AccountsColumnDefinitions';
import { useHistory, useLocation } from 'react-router-dom';
import {
    GetAccountInListingFormat,
    GetAccounts,
    DeleteAccount,
    DeleteAccounts,
    ToggleAccountFavourite,
    GetAccountStaticData,
    GetAllAccountStatuses,
    UpdateAccount
} from '../../services/AccountDataService';
import useSession from '../../hooks/useSession';
import { sessionClearAllDetailsFor } from '../../services/SessionService';
import { gridContainerStyle } from '../../styles';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';
import DeleteModal from '../../components/DeleteModal';
import FilterOptionsList from '../../components/FilterOptionsList/FilterOptionsList';

// Styles
const gridItem = {
    textAlign: 'center',
    padding: 0
};
const tabArea = {
    gridColumn: '1 / 4',
    paddingTop: 18
};
const tableArea = {
    gridColumn: '1 / 4',
    backgroundColor: '#FFFFFF'
};
const createButton = {
    width: 130,
    height: 40,
    fontSize: 14,
    fontWeight: 'bold'
};
const centre = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
};
const optionText = {
    color: '#414141',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0,
    cursor: 'pointer'
};
const AccountLandingPage = () => {
    const { dateFormat, timeFormat, locale, currency } = useContext(SystemSettingsContext);
    const history = useHistory();
    const location = useLocation();

    // States
    const [columnDefinitions, setColumnDefinitions] = useState(initialColumnDefinitions);
    const [tab, setTab, delTab] = useSession('accountsTabIndex', 0);
    const [accountTypesDetails, setAccountTypesDetails] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        count: 3,
        hasNextPage: false,
        hasPrevPage: false,
        isFirstPage: true,
        isLastPage: true,
        pageCount: 1,
        pageNumber: 1,
        pageSize: -1,
        totalItemCount: 3,
        pageSizeOptions: [{ value: -1, text: 'All' }]
    });

    const [isModalShowing, setIsModalShowing] = useState(false);
    const [data, setData] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState({});
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [newItem, setNewItem] = useState();
    const [filterOptions, setFilterOptions] = useState(['Advertiser', 'Agency', 'Barter Agency', 'Other']);
    const accountTypes = [
        { value: 'Advertiser', text: 'Advertisers' },
        { value: 'Agency', text: 'Agencies' },
        { value: 'Barter Agency', text: 'Barter Agencies' },
        { value: 'Other', text: 'Other' }
    ];

    const apiParamDefaults = {
        sortField: 'accountName',
        sortOrder: 'asc',
        pageNumber: 1,
        pageSize: 15,
        favouritesOnly: tab === 3,
        viewedOnly: tab === 2,
        accountTypes: ['Advertiser', 'Agency', 'Barter Agency', 'Other']
    };

    const [apiParams, apiParamsDispatcher] = useReducer(apiParamsReducer, apiParamDefaults);

    // Handlers
    const handleFilterChange = (field) => {
        const columnToUpdate = columnDefinitions.find((c) => c.field === field);
        columnToUpdate.showInList = !columnToUpdate.showInList;

        const unchangedColumns = columnDefinitions.filter((c) => c.field !== columnToUpdate.field);

        setColumnDefinitions([...unchangedColumns, columnToUpdate]);
    };

    const handleSearchUpdate = (value) => {
        apiParamsDispatcher({ searchTerm: encodeURIComponent(value), pageNumber: 1 });
    };

    const handlePageSizeChange = (option) => {
        apiParamsDispatcher({ pageSize: option.value, pageNumber: 1 });
    };

    const handlePrevClick = () => {
        const newPageNumber = apiParams.pageNumber - 1;
        if (newPageNumber >= 1) {
            apiParamsDispatcher({ ...apiParams, pageNumber: newPageNumber });
        }
    };

    const handleNextClick = () => {
        const newPageNumber = apiParams.pageNumber + 1;
        if (newPageNumber <= pageInfo.pageCount) {
            apiParamsDispatcher({ ...apiParams, pageNumber: newPageNumber });
        }
    };

    const handleSortOrderChange = (column) => {
        const unchangedColumns = columnDefinitions
            .filter((c) => c.field !== column.field)
            .map((c) => ({ ...c, sortOrder: '' }));

        const sortField = column.field === 'status' ? 'statusEnumOrder' : column.field;

        setColumnDefinitions([...unchangedColumns, column]);
        apiParamsDispatcher({
            sortField: sortField,
            sortOrder: column.sortOrder
        });
    };

    const handleActionClick = (command, data) => {
        switch (command) {
            case 'edit':
                history.push({
                    pathname: '/accounts/details',
                    state: { accountId: data.id, readOnly: false }
                });
                break;
            case 'copy':
                console.log('copy clicked');
                break;
            case 'delete':
                setSelectedAccount(data);
                setIsModalShowing(true);
                break;
            default:
                break;
        }
    };

    const onModalClose = () => {
        setIsModalShowing(false);
        setSelectedAccount({});
        setSelectedAccounts([]);
    };

    const handleDeleteClick = async () => {
        if (selectedAccounts?.length > 0) {
            const ids = selectedAccounts?.map((r) => r?.id);
            DeleteAccounts(ids)
                .then(() => {
                    loadData();
                })
                .catch(console.log);
        } else {
            await DeleteAccount(selectedAccount?.id);
        }
        onModalClose();
        loadData();
    };

    const setAccountExpired = async () => {
        const allAccountStatuses = await GetAllAccountStatuses();
        const expiredAccountStatus = allAccountStatuses.find((x) => x.shortRef === 'EXP');

        if (selectedAccounts?.length > 0) {
            const ids = selectedAccounts?.map((r) => r?.id);
        } else {
            UpdateAccount({ id: selectedAccount.id, accountStatusId: expiredAccountStatus.id })
                .then(() => {
                    loadData();
                })
                .catch(console.log);
        }
        onModalClose();
        loadData();
    };

    const handleIconDisabilty = (actionType, status, account) => {
        const actionTypesToCheck = ['delete'];
        return actionTypesToCheck.includes(actionType) && !account?.allowDelete;
    };

    const handleToolTip = (actionType, account) => {
        if (actionType === 'delete' && !account?.allowDelete) {
            return {
                toolTipText: window.translate('This record can only be deleted by the person who created it'),
                width: 354
            };
        }
        return null;
    };

    const handleMultiRowDelete = (records) => {
        setSelectedAccounts(records);
        setIsModalShowing(true);
    };

    // handleFavouriteClick event returns a row data. Destruct to find any id you like to use.
    const handleFavouriteClick = ({ id }) => {
        ToggleAccountFavourite(id)
            .then(() => {
                loadData();
            })
            .catch(console.log);
    };

    const handlePrimaryColumnClick = (entity) => {
        history.push({
            pathname: '/accounts/details',
            state: {
                accountId: entity.id,
                readOnly: true,
                accountTypes: accountTypesDetails,
            }
        });
    };

    const handleCreateNewButtonClick = () => {
        history.push({
            pathname: '/accounts/create',
            state: {
                test: 123,
                accountTypes: accountTypesDetails,
            }
        });
    };
    const [lastcall, setLastCall] = useState({ json: '' });

    const loadData = () => {
        if (lastcall.json != JSON.stringify(apiParams)) {
            lastcall.json = JSON.stringify(apiParams);
            GetAccounts(apiParams, tab === 1)
                .then((data) => {
                    setData(data.data);
                    setPageInfo(mapPageInfo(data));
                })
                .catch(console.log);
            loadNewItem();
        }
    };

    const loadNewItem = () => {
        if (location?.state?.redirectedFrom !== 'create') {
            return;
        }

        GetAccountInListingFormat(location.state.id)
            .then((data) => {
                setNewItem(data);
            })
            .catch(console.log);
    };

    const handleFilterOptionUpdate = (val) => {
        const updatedFilterOptions = [...filterOptions];
        const filterIdx = filterOptions?.findIndex((f) => f === val);
        if (filterIdx !== -1) {
            updatedFilterOptions.splice(filterIdx, 1);
        } else {
            updatedFilterOptions.push(val);
        }
        setFilterOptions(updatedFilterOptions);
        apiParamsDispatcher({
            ...apiParams,
            accountTypes: updatedFilterOptions,
            pageNumber: 1
        });
    };

    const handleTabClick = (tabIndex) => {
        switch (tabIndex) {
            case 2:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    sortField: 'lastViewed',
                    sortOrder: 'desc',
                    favouritesOnly: false,
                    viewedOnly: true,
                    accountTypes: [...filterOptions],
                    tab: tabIndex
                });
                break;

            case 3:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    favouritesOnly: true,
                    viewedOnly: false,
                    accountTypes: [...filterOptions],
                    tab: tabIndex
                });
                break;
            default:
                apiParamsDispatcher({
                    ...apiParamDefaults,
                    favouritesOnly: false,
                    viewedOnly: false,
                    accountTypes: [...filterOptions],
                    tab: tabIndex
                });
                break;
        }
        setTab(tabIndex);
    };

    // Hooks
    useEffect(() => {
        sessionClearAllDetailsFor('account');

        window.scrollTo(0, 0);

        return delTab;
    }, []);

    useEffect(() => {
        loadData();
    }, [apiParams]);

    useEffect(() => {
        GetAccountStaticData()
            .then((data) => {
                setAccountTypesDetails(data.accountTypes);
            })
            .catch(console.log);
    }, []);

    return (
        <>
            <div style={{ ...gridContainerStyle, gridTemplateRows: 'max-content max-content max-content auto' }}>
                <div style={gridItem} />
                <div style={{ ...gridItem }}>
                    <AsSearchBar
                        id='accountSearch'
                        placeholder='Search Accounts...'
                        width={395}
                        height={42}
                        currentSearchTerm={apiParams.searchTerm}
                        onSearchUpdate={handleSearchUpdate}
                    />
                </div>
                <div
                    style={{
                        ...gridItem,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}
                >
                    <AsButton style={createButton} handleClick={handleCreateNewButtonClick}>
                        {window.translate('Create New')}
                    </AsButton>
                </div>
                <div
                    style={{
                        ...gridItem,
                        ...centre,
                        ...optionText,
                        gridColumn: '3 / 4',
                        marginBottom: -50,
                        zIndex: 100
                    }}
                >
                    <FilterOptionsList
                        options={accountTypes}
                        filterOptions={filterOptions}
                        optionChange={handleFilterOptionUpdate}
                    />
                </div>
                <div style={{ ...gridItem, ...tabArea, height: 39 }}>
                    <AsTabContainer tabPanelStyle={{ height: 0 }} onTabClick={handleTabClick} initalTab={tab}>
                        <AsTab title='All Accounts' />
                        <AsTab title='My Accounts' />
                        <AsTab title='Recently Viewed' />
                        <AsTab title='Favourites' />
                    </AsTabContainer>
                </div>
                <div style={{ ...gridItem, ...tableArea }}>
                    <AsGrid
                        columnDefs={columnDefinitions}
                        pageInfo={pageInfo}
                        data={data}
                        newlyCreated={newItem}
                        primaryColumn='accountName'
                        onPageSizeChange={tab === 2 ? null : handlePageSizeChange}
                        onNextClick={tab === 2 ? null : handleNextClick}
                        onPrevClick={tab === 2 ? null : handlePrevClick}
                        onSortOrderChange={tab === 2 ? null : handleSortOrderChange}
                        onActionClick={handleActionClick}
                        onFavouriteClick={handleFavouriteClick}
                        onPrimaryColumnClick={handlePrimaryColumnClick}
                        onColumnFilterChange={handleFilterChange}
                        onActionIconLoad={handleIconDisabilty}
                        onActionToolTip={handleToolTip}
                        onMultiRowDelete={handleMultiRowDelete}
                        dateFormat={dateFormat}
                        timeFormat={timeFormat}
                        locale={locale}
                        currency={currency}
                        actionIconSize={19}
                        headerRowHeight={57}
                        rowHeight={34}
                    />
                </div>
            </div>
            <DeleteModal
                isShowing={isModalShowing}
                onClose={onModalClose}
                onSubmit={setAccountExpired}
                title={Object.keys(selectedAccount)?.length > 0 ? selectedAccount?.name : ''}
                entityName='account'
                message={
                    selectedAccounts?.length > 0
                        ? `${window.translate('Are you sure you wish to delete the selected records')}?`
                        : ''
                }
            />
        </>
    );
};

export default AccountLandingPage;
