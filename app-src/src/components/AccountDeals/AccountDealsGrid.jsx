import React, { useState, useEffect, useReducer, useContext } from 'react';
import { AsGrid, mapPageInfo } from '@adserve/adserve-react-components';
import { apiParamsReducer } from '../../services/AsGridService';
import initialColumnDefinitions from './AccountDealsColumnDefinitions';
import { useHistory } from 'react-router-dom';
import { GetAccountDeals } from '../../services/AccountDataService';
import { dealManagerUrl } from '../../constants/Urls';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';

// Styles
const gridContainer = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr',
    gridGap: 0,
    padding: '0px 0px 0px 0px',
    width: '100%',
    height: '97%'
};
const gridItem = {
    textAlign: 'center',
    padding: 0
};
const tableArea = {
    gridColumn: '1 / 4',
    backgroundColor: '#FFFFFF'
};

const AccountDealsGrid = ({ accountId }) => {
    const { dateFormat, timeFormat, locale, currency } = useContext(SystemSettingsContext);
    const history = useHistory();

    // States
    const [columnDefinitions, setColumnDefinitions] = useState(
        initialColumnDefinitions
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

    const apiParamDefaults = {
        pageNumber: 1,
        pageSize: 15,
        sortField: 'dealName',
        sortOrder: 'asc',
        includeExpiredDeals: true,
        AccountId: accountId
    };

    const [apiParams, apiParamsDispatcher] = useReducer(
        apiParamsReducer,
        apiParamDefaults
    );

    // Handlers
    const handleFilterChange = (field) => {
        const columnToUpdate = columnDefinitions.find((c) => c.field === field);
        columnToUpdate.showInList = !columnToUpdate.showInList;

        const unchangedColumns = columnDefinitions.filter(
            (c) => c.field !== columnToUpdate.field
        );

        setColumnDefinitions([...unchangedColumns, columnToUpdate]);
    };

    const handlePageSizeChange = (option) => {
        apiParamsDispatcher({ pageSize: option.value });
    };

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
                console.log('delete clicked');
                break;
            default:
                break;
        }
    };

    const handleFavouriteClick = ({ id }) => {
        return;
    };

    const handlePrimaryColumnClick = (entity) => {
        window.open(`${dealManagerUrl}/?id=${entity.versionId}`, '_self');
    };

    const loadData = () => {
        GetAccountDeals(apiParams)
            .then((data) => {
                setData(data.data);
                setPageInfo(mapPageInfo(data));
            })
            .catch(console.log);
    };

    // Hooks
    useEffect(() => {
        loadData();
    }, [apiParams]);

    return (
        <div style={gridContainer}>
            <div style={{ ...gridItem, ...tableArea }}>
                <AsGrid
                    columnDefs={columnDefinitions}
                    pageInfo={pageInfo}
                    data={data}
                    primaryColumn='dealName'
                    onPageSizeChange={handlePageSizeChange}
                    onNextClick={handleNextClick}
                    onPrevClick={handlePrevClick}
                    onSortOrderChange={handleSortOrderChange}
                    onActionClick={handleActionClick}
                    onFavouriteClick={handleFavouriteClick}
                    onPrimaryColumnClick={handlePrimaryColumnClick}
                    onColumnFilterChange={handleFilterChange}
                    onActionIconLoad={() => false} // To return whether it should be disabled. Or, implement like LeadsGrid.
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    locale={locale}
                    currency={currency}
                />
            </div>
        </div>
    );
};

export default AccountDealsGrid;
