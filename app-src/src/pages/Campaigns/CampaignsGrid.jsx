import {
    AsGrid,
    useModal,
    mapPageInfo
} from '@adserve/adserve-react-components';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { campaignManagerUrl } from '../../constants/Urls';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';
import { apiParamsReducer } from '../../services/AsGridService';
import {
    CreateCampaign,
    DeleteCampaign,
    DeleteCampaigns,
    GetCampaign,
    GetCampaignInListingFormat,
    GetCampaignSettings,
    ToggleCampaignFavourite
} from '../../services/CampaignsDataService';
import {
    apiParamDefaults,
    CampaignsGridColumnDefinitions,
    gridItem
} from './GridColumnDefinitions';

const CampaignsGrid = ({
    onGetData,
    searchTerm,
    gridColumnDefinitions = CampaignsGridColumnDefinitions,
    selectedTab,
    defaultApiParams
}) => {
    const [language] = useState(window.language);

    const location = useLocation();
    const { dateFormat, timeFormat, locale, currency } = useContext(
        SystemSettingsContext
    );

    const defaultPageInfo = {
        count: 0,
        hasNextPage: false,
        hasPrevPage: false,
        isFirstPage: true,
        isLastPage: true,
        pageCount: 1,
        pageNumber: 1,
        pageSize: -1,
        totalItemCount: 0,
        pageSizeOptions: [{ value: -1, text: 'All' }]
    };

    // Styles
    const whiteButtonStyle = {
        border: '2px solid #CCCCCC',
        backgroundColor: '#FFFFFF',
        cursor: 'pointer'
    };
    const tableArea = {
        gridColumn: '1 / 4',
        backgroundColor: '#FFFFFF'
    };

    // States
    const [columnDefinitions, setColumnDefinitions] = useState(
        gridColumnDefinitions
    );
    const [scrolling, setScrolling] = useState(false);
    const { addMessage } = useModal();
    const [apiParams, apiParamsDispatcher] = useReducer(
        apiParamsReducer,
        defaultApiParams ?? apiParamDefaults
    );

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

    const [data, setData] = useState([]);
    const [newItem, setNewItem] = useState();

    // Hooks
    useEffect(() => {
        loadData();
    }, [apiParams]);

    useEffect(() => {
        apiParamsDispatcher({ ...defaultApiParams });
    }, [defaultApiParams]);

    useEffect(() => {
        handleSearchUpdate(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        GetCampaignSettings().catch(console.log);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setColumnDefinitions(gridColumnDefinitions);
    }, [language, selectedTab, window.translationStrings]);

    // Handlers
    const handleFilterChange = (field) => {
        const columnToUpdate = columnDefinitions.find((c) => c.field === field);
        columnToUpdate.showInList = !columnToUpdate.showInList;

        const unchangedColumns = columnDefinitions.filter(
            (c) => c.field !== columnToUpdate.field
        );

        setColumnDefinitions([...unchangedColumns, columnToUpdate]);
    };

    const handleScroll = () => {
        if (!scrolling) setScrolling(true);
    };

    const handleIconDisabilty = (actionType, status, campaign) => {
        const disableDelete = ['Draft', 'Reserved', '', 'Booked'];
        const deleteActionIcons = ['delete'];

        const disableEdit = ['Qualified Out'];
        const editActionIcons = ['edit'];

        return (
            (deleteActionIcons.includes(actionType) &&
                (!disableDelete.includes(status) ||
                    campaign?.isRunningCampaign ||
                    !campaign?.isMyCampaign)) ||
            (editActionIcons.includes(actionType) &&
                disableEdit.includes(status))
        );
    };

    const handleToolTip = (actionType, campaign) => {
        if (actionType === 'delete') {
            if (campaign?.isRunningCampaign) {
                return {
                    toolTipText: window.translate(
                        'Cannot delete a running campaign'
                    ),
                    width: 210
                };
            } else if (!campaign?.isMyCampaign) {
                return {
                    toolTipText: window.translate(
                        'This record can only be deleted by the person who created it'
                    ),
                    width: 354
                };
            }
        }
        return null;
    };

    const handleSearchUpdate = (value) =>
        apiParamsDispatcher({ searchTerm: value, pageNumber: 1 });

    const handlePageSizeChange = (option) =>
        apiParamsDispatcher({ pageSize: option.value, pageNumber: 1 });

    const handlePrevClick = () => {
        const newPageNumber = apiParams.pageNumber - 1;
        if (newPageNumber >= 1) {
            apiParamsDispatcher({ pageNumber: newPageNumber });
        }
    };

    const handleNextClick = () => {
        const newPageNumber = apiParams.pageNumber + 1;
        if (newPageNumber <= pageInfo.pageCount) {
            apiParamsDispatcher({ pageNumber: newPageNumber });
        }
    };

    const handleSortOrderChange = (column) => {
        const unchangedColumns = columnDefinitions
            .filter((c) => c.field !== column.field)
            .map((c) => ({ ...c, sortOrder: '' }));

        const sortField =
            column.field === 'status' ? 'statusEnumOrder' : column.field;

        setColumnDefinitions([...unchangedColumns, column]);
        apiParamsDispatcher({
            ...apiParams,
            sortField: sortField,
            sortOrder: column.sortOrder,
            pageNumber: 1
        });
    };

    const handleActionClick = (command, data) => {
        switch (command) {
            case 'edit':
                window.open(
                    `${campaignManagerUrl}/campaigns/details?campaignId=${data.id}&readOnly=${data?.campaignStatusName === 'Draft' ? false : true}&goBack=true`,
                    '_self'
                );
                break;
            case 'copy':
                addMessage({
                    message: window.translate(
                        `Are you sure you want to copy ${data.name}?`
                    ),
                    buttons: [
                        {
                            text: window.translate('No'),
                            style: { ...whiteButtonStyle, width: 87 },
                            callback: null
                        },
                        {
                            text: window.translate('Yes'),
                            style: { cursor: 'pointer' },
                            callback: () => copyCampaign(data)
                        }
                    ]
                });
                break;
            case 'delete':
                addMessage({
                    message: window.translate(
                        `Are you sure you want to delete ${data.name}?`
                    ),
                    buttons: [
                        {
                            text: window.translate('No'),
                            style: { ...whiteButtonStyle, width: 87 },
                            callback: null
                        },
                        {
                            text: window.translate('Yes'),
                            style: { cursor: 'pointer' },
                            callback: () => deleteCampaign(data)
                        }
                    ]
                });
                break;
            default:
                break;
        }
    };

    // handleFavouriteClick event returns a row data. Destruct to find any id you like to use.
    const handleFavouriteClick = async ({ id }) => {
        ToggleCampaignFavourite(id)
            .then(() => {
                loadData();
            })
            // eslint-disable-next-line no-console
            .catch(console.log);
    };

    const handlePrimaryColumnClick = (entity) => {
        window.open(
            `${campaignManagerUrl}/campaigns/details?campaignId=${entity.id}&readOnly=true&goBack=true`,
            '_self'
        );
    };

    // functions
    const loadData = () => {
        let dataFound = false;
        onGetData(apiParams)
            .then((data) => {
                setData(data.data);
                setPageInfo(mapPageInfo(data));
                dataFound = true;
            })
            // eslint-disable-next-line no-console
            .catch(console.log);

        loadNewItem();
        if (!dataFound) {
            setData([]);
            setPageInfo(defaultPageInfo);
        }
    };

    const copyCampaign = async (campaign) => {
        await GetCampaign(campaign.id)
            .then((c) => {
                delete c.id;
                delete c.algorithmId;

                c.name = `${c.name} (copy)`;
                c?.spotTypes.forEach((st) => {
                    delete st.id;
                });
                c?.scriptFactors.forEach((sf) => {
                    delete sf.id;
                });
                c?.copyTypes.forEach((ct) => {
                    delete ct.id;
                });

                CreateCampaign(c)
                    .then((entity) => {
                        window.open(
                            `${campaignManagerUrl}/campaigns/details?campaignId=${entity.id}&readOnly=false&goBack=true`,
                            '_self'
                        );
                    })
                    // eslint-disable-next-line no-console
                    .catch(console.log);
                // e
            })
            // eslint-disable-next-line no-console
            .catch(console.log);
    };

    const deleteCampaign = async (campaign) => {
        await DeleteCampaign(campaign.id)
            .then(() => {
                loadData();
            })
            // eslint-disable-next-line no-console
            .catch(console.log);
    };

    const loadNewItem = () => {
        if (location?.state?.redirectedFrom !== 'create') {
            return;
        }

        GetCampaignInListingFormat(location.state.id)
            .then((data) => {
                setNewItem(data);
            })
            // eslint-disable-next-line no-console
            .catch(console.log);
    };

    const handleDeleteClick = async (records) => {
        if (records?.length > 0) {
            const ids = records?.map((r) => r?.id);
            DeleteCampaigns(ids)
                .then(() => {
                    loadData();
                })
                .catch(console.log);
        }
    };

    const handleMultiRowDelete = (records) => {
        addMessage({
            message: window.translate(
                `Are you sure you wish to delete the selected records?`
            ),
            buttons: [
                {
                    text: window.translate('No'),
                    style: { ...whiteButtonStyle, width: 87 },
                    callback: null
                },
                {
                    text: window.translate('Yes'),
                    style: { cursor: 'pointer' },
                    callback: () => handleDeleteClick(records)
                }
            ]
        });
    };

    return (
        <div language={language} style={{ ...gridItem, ...tableArea }}>
            <AsGrid
                columnDefs={columnDefinitions}
                pageInfo={pageInfo}
                data={data || []}
                newlyCreated={newItem}
                primaryColumn='name'
                onPageSizeChange={
                    selectedTab === 2 ? null : handlePageSizeChange
                }
                onNextClick={selectedTab === 2 ? null : handleNextClick}
                onPrevClick={selectedTab === 2 ? null : handlePrevClick}
                onSortOrderChange={
                    selectedTab === 2 ? null : handleSortOrderChange
                }
                onActionClick={handleActionClick}
                onFavouriteClick={handleFavouriteClick}
                onPrimaryColumnClick={handlePrimaryColumnClick}
                onColumnFilterChange={handleFilterChange}
                onActionIconLoad={handleIconDisabilty ?? false}
                onActionToolTip={handleToolTip}
                onMultiRowDelete={handleMultiRowDelete}
                showColumnFilter={true}
                onScroll={handleScroll}
                dateFormat={dateFormat}
                timeFormat={timeFormat}
                locale={locale}
                currency={currency}
                actionIconSize={19}
                rowHeight={34}
            />
        </div>
    );
};

export default CampaignsGrid;
