import React, { useState, useReducer, useContext, useEffect } from 'react';
import AccountHistoryTableColumnDefinitions from './AccountHistoryTableColumnDefinitions';
import { AsGrid, mapPageInfo } from '@adserve/adserve-react-components';
import { apiParamsReducer } from '../../services/AsGridService';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';
import { GetAccountHistoryByAccountId } from '../../services/AccountDataService';

const AccountHistoryTable = ({ account, ...props }) => {
    const { dateFormat, timeFormat, locale, currency } = useContext(SystemSettingsContext);
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

    const [columnDefinitions, setColumnDefinitions] = useState(AccountHistoryTableColumnDefinitions);
    const [historyData, setHistoryData] = useState([]);

    const apiParamDefaults = {
        pageNumber: 1,
        pageSize: -1,
        sortField: 'dateTimeChanged',
        sortOrder: 'desc',
        accountId: account?.id ? account?.id : -1
    };

    const [apiParams, apiParamsDispatcher] = useReducer(apiParamsReducer, apiParamDefaults);

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

    // Handlers

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

    const loadData = () => {
        GetAccountHistoryByAccountId(apiParams)
            .then((data) => {
                setHistoryData(data.data);
                setPageInfo(mapPageInfo(data));
            })
            .catch(console.log);
    };

    // Hooks
    useEffect(() => {
        loadData();
    }, [apiParams]);

    return (
        <div>
            <div style={gridContainer}>
                <div style={{ ...gridItem, ...tableArea }}>
                    <AsGrid
                        columnDefs={columnDefinitions}
                        pageInfo={pageInfo}
                        data={historyData}
                        primaryColumn='fieldName'
                        onSortOrderChange={handleSortOrderChange}
                        onActionIconLoad={() => false} // To return whether it should be disabled. Or, implement like LeadsGrid.
                        dateFormat={dateFormat}
                        timeFormat={timeFormat}
                        locale={locale}
                        currency={currency}
                        maxVisibleRows={10}
                        showColumnFilter={false}
                        scrollableAreaStyle={{ borderLeft: '1px solid #D7D7D7' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AccountHistoryTable;
