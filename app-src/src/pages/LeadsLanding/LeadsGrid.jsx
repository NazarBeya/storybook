import React, { useState, useEffect, useContext } from 'react';
import { AsGrid, mapPageInfo } from '@adserve/adserve-react-components';
import initialColumnDefinitions from './LeadsGridColumnDefinitions';
import { MakeLeadFavourite } from '../../services/LeadsDataService';
import { LeadConverted } from '../../constants/Status';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';

const LeadsGrid = ({
    onGetData,
    onEditClick,
    searchTerm,
    onReadOnlyClick,
    apiParams,
    apiParamsDispatcher,
    newlyCreated,
    selectedTab,
    openDeleteDialog,
    isModalShowing,
    onMultiRowDelete,
    modalResult
}) => {
    const { dateFormat, timeFormat, locale, currency } = useContext(SystemSettingsContext);
    // States
    const [columnDefinitions, setColumnDefinitions] = useState(initialColumnDefinitions);

    const [leads, setLeads] = useState([]);

    const [pageInfo, setPageInfo] = useState({
        count: 3,
        hasNextPage: false,
        hasPrevPage: false,
        isFirstPage: true,
        islastPage: true,
        pageCount: 1,
        pageNumber: 1,
        pageSize: -1,
        totalItemcount: 3,
        pageSizeOptions: [{ value: -1, text: 'All' }]
    });

    const getData = async () => {
        if (typeof onGetData !== 'function') return;
        try {
            const results = await onGetData(apiParams);
            setLeads(results.data);
            setPageInfo(mapPageInfo(results));
        } catch (err) {
            console.error(err);
        }
    };
    const [lastcall, setLastCall] = useState({ json: '' });
    useEffect(() => {
        if (lastcall.json != JSON.stringify(apiParams)) {
            lastcall.json = JSON.stringify(apiParams);
            console.log('getfromparams', apiParams);
            getData();
        }
    }, [apiParams]);

    useEffect(() => {
        console.log('getfrp,os,pd');
        if (!isModalShowing && modalResult) getData();
    }, [isModalShowing, modalResult]);

    useEffect(() => {
        console.log('searchtermfire');
        apiParamsDispatcher({ searchTerm: searchTerm, pageNumber: 1 });
    }, [searchTerm]);

    /**
     * Event handler for action buttons
     * @param {string} command - edit, copy, or delete
     * @param {object} lead - the lead from the selected row
     */
    const handleActionClick = async (command, data) => {
        switch (command) {
            case 'edit':
                onEditClick(data);
                break;

            case 'delete':
                openDeleteDialog(data);
                break;

            default:
                break;
        }
    };

    /**
     * Event handler for column sorting
     * @param {object} column - the column desired column to sort the table by
     */
    const handleSortOrderChange = (column) => {
        const unchangedColumns = columnDefinitions
            .filter((c) => c.field !== column.field)
            .map((c) => ({ ...c, sortOrder: '' }));

        const sortField = column.field === 'status' ? 'statusEnumOrder' : column.field;

        setColumnDefinitions([...unchangedColumns, column]);
        apiParamsDispatcher({
            sortField: sortField,
            sortOrder: column.sortOrder,
            pageNumber: 1
        });
    };

    const handleFavouriteClick = async (lead) => {
        const response = await MakeLeadFavourite(lead);
        if (response?.status === 200) getData();
    };

    const handleNextClick = () => {
        const newPageNumber = apiParams.pageNumber + 1;
        if (newPageNumber <= pageInfo.pageCount) {
            apiParamsDispatcher({ ...apiParams, pageNumber: newPageNumber });
        }
    };

    const handlePrevClick = () => {
        const newPageNumber = apiParams.pageNumber - 1;
        if (newPageNumber >= 1) {
            apiParamsDispatcher({ ...apiParams, pageNumber: newPageNumber });
        }
    };

    const handleFilterChange = (field) => {
        const columnToUpdate = columnDefinitions.find((c) => c.field === field);
        columnToUpdate.showInList = !columnToUpdate.showInList;

        const unchangedColumns = columnDefinitions.filter((c) => c.field !== columnToUpdate.field);

        setColumnDefinitions([...unchangedColumns, columnToUpdate]);
    };

    const handleIconDisabilty = (actionType, status, lead) => {
        const statusToDisable = [LeadConverted];
        const actionTypesToCheck = ['edit'];

        return (
            (actionTypesToCheck.includes(actionType) && statusToDisable.includes(status)) ||
            (actionType === 'delete' && !lead?.allowDelete)
        );
    };

    const handleToolTip = (actionType, lead) => {
        if (actionType === 'delete' && !lead?.allowDelete) {
            return {
                toolTipText: window.translate('This record can only be deleted by the person who created it'),
                width: 354
            };
        }
        return null;
    };

    const handlePageSizeChange = (option) => {
        apiParamsDispatcher({ pageSize: option.value, pageNumber: 1 });
    };

    return (
        <AsGrid
            columnDefs={columnDefinitions}
            pageInfo={pageInfo}
            data={leads || []}
            primaryColumn='fullName'
            onPageSizeChange={selectedTab === 2 ? null : handlePageSizeChange}
            onNextClick={selectedTab === 2 ? null : handleNextClick}
            onPrevClick={selectedTab === 2 ? null : handlePrevClick}
            onSortOrderChange={selectedTab === 2 ? null : handleSortOrderChange}
            onActionClick={handleActionClick}
            onFavouriteClick={handleFavouriteClick}
            onPrimaryColumnClick={onReadOnlyClick}
            onColumnFilterChange={handleFilterChange}
            onActionIconLoad={handleIconDisabilty}
            onActionToolTip={handleToolTip}
            onMultiRowDelete={onMultiRowDelete}
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            newlyCreated={newlyCreated}
            locale={locale}
            currency={currency}
            actionIconSize={19}
            headerRowHeight={57}
            rowHeight={34}
        />
    );
};

export default LeadsGrid;
