import { AsGrid, mapPageInfo } from '@adserve/adserve-react-components';
import React, { useContext, useEffect, useState } from 'react';
import ContactsGridColumnDefinitions from './ContactsGridColumnDefinitions';
import { PostFavourite } from '../../services/ContactsDataService';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';

const ContactsGrid = ({
    onGetData,
    apiParams,
    onParamsChange,
    recentlyViewedOnly,
    onEditClick,
    onReadOnlyClick,
    openDeleteDialog,
    newlyCreated,
    gridColumnDefinitions = ContactsGridColumnDefinitions,
    selectedTab,
    isModalShowing,
    onMultiRowDelete,
    modalResult
}) => {
    const { dateFormat, timeFormat, locale, currency } = useContext(SystemSettingsContext);
    const [columnDefinitions, setColumnDefinitions] = useState(gridColumnDefinitions);

    const [pageInfo, setPageInfo] = useState({
        count: 10,
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

    const handleFilterChange = (field) => {
        const columnToUpdate = columnDefinitions.find((c) => c.field === field);
        columnToUpdate.showInList = !columnToUpdate.showInList;

        const unchangedColumns = columnDefinitions.filter((c) => c.field !== columnToUpdate.field);

        setColumnDefinitions([...unchangedColumns, columnToUpdate]);
    };

    // TODO: Clarify if the recently viewed should allow pagination and if must show 10 records max
    const handlePageSizeChange = (option) => {
        if (typeof onParamsChange === 'function' && !recentlyViewedOnly)
            onParamsChange({
                ...apiParams,
                pageSize: option.value,
                pageNumber: 1
            });
    };

    const handlePrevClick = () => {
        const newPageNumber = apiParams.pageNumber - 1;
        if (newPageNumber >= 1) {
            if (typeof onParamsChange === 'function') onParamsChange({ ...apiParams, pageNumber: newPageNumber });
        }
    };

    const handleNextClick = () => {
        const newPageNumber = apiParams.pageNumber + 1;
        if (newPageNumber <= pageInfo.pageCount) {
            if (typeof onParamsChange === 'function') onParamsChange({ ...apiParams, pageNumber: newPageNumber });
        }
    };

    const handleSortOrderChange = (column) => {
        const unchangedColumns = columnDefinitions
            .filter((c) => c.field !== column.field)
            .map((c) => ({ ...c, sortOrder: '' }));

        const sortField = column.field;

        setColumnDefinitions([...unchangedColumns, column]);
        if (typeof onParamsChange === 'function') {
            onParamsChange({
                ...apiParams,
                sortField: sortField,
                sortOrder: column.sortOrder,
                pageNumber: 1
            });
        }
    };

    const handleActionClick = (command, data) => {
        switch (command) {
            case 'edit':
                onEditClick(data);
                break;
            case 'copy':
                console.log('copy clicked');
                break;
            case 'delete':
                openDeleteDialog(data);
                break;
            default:
                break;
        }
    };

    const handleIconDisabilty = (actionType, status, contact) => {
        const actionTypesToCheck = ['delete'];
        return actionTypesToCheck.includes(actionType) && !contact?.allowDelete;
    };

    const handleToolTip = (actionType, contact) => {
        if (actionType === 'delete' && !contact?.allowDelete) {
            return {
                toolTipText: window.translate('This record can only be deleted by the person who created it'),
                width: 354
            };
        }
        return null;
    };

    const handleFavouriteClick = ({ id }) => {
        const payload = { id };
        PostFavourite(payload).then((r) => {
            getData();
        });
    };

    const getData = async () => {
        if (typeof onGetData === 'function') {
            try {
                const results = await onGetData(apiParams);
                setData(results?.data.data);
                setPageInfo(mapPageInfo(results?.data));
            } catch (error) {
                console.log(`An error occurred when requesting data from the backend. Details: ${error}`);
            }
        }
    };

    const handlePrimaryColumnClick = (entity) => {
        onReadOnlyClick(entity);
    };

    const [lastcall, setLastCall] = useState({ json: '' });
    useEffect(() => {
        console.log(apiParams);
        if (lastcall.json != JSON.stringify(apiParams)) {
            lastcall.json = JSON.stringify(apiParams);

            getData();
        }
    }, [apiParams]);

    useEffect(() => {
        if (!isModalShowing && modalResult) getData();
    }, [isModalShowing, modalResult]);

    return (
        <AsGrid
            columnDefs={columnDefinitions}
            pageInfo={pageInfo}
            data={data || []}
            primaryColumn='fullName'
            onPageSizeChange={selectedTab === 2 ? null : handlePageSizeChange}
            onNextClick={selectedTab === 2 ? null : handleNextClick}
            onPrevClick={selectedTab === 2 ? null : handlePrevClick}
            onSortOrderChange={selectedTab === 2 ? null : handleSortOrderChange}
            onActionClick={handleActionClick}
            onFavouriteClick={handleFavouriteClick}
            onPrimaryColumnClick={handlePrimaryColumnClick}
            onColumnFilterChange={handleFilterChange}
            onActionIconLoad={handleIconDisabilty}
            onActionToolTip={handleToolTip}
            onMultiRowDelete={onMultiRowDelete}
            newlyCreated={newlyCreated}
            headerRowHeight={57}
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            locale={locale}
            currency={currency}
            actionIconSize={19}
            rowHeight={34}
        />
    );
};

export default ContactsGrid;
