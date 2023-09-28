import { AsButton, AsSearchBar, Pagination, mapPageInfo } from '@adserve/adserve-react-components';
import React, { useState, useEffect } from 'react';
import CompactTableTable from './CompactTableTable';

const CompactTableLookupPage3 = ({
    searchFunction,
    initSearchTerm,
    minSearchLength = 3,
    tableColumnDefinitions,
    onSelect,
    id
}) => {
    const [searchTerm, setSearchTerm] = useState(initSearchTerm || '');
    const [columnDefinitions, setColumnDefinitions] = useState([]);
    const [data, setData] = useState([]);

    const [selectedRow, setSelectedRow] = useState({});

    // Pagination controls
    const [pageInfo, setPageInfo] = useState({
        count: 3,
        hasNextPage: false,
        hasPrevPage: false,
        isFirstPage: true,
        isLastPage: true,
        pageCount: 0,
        pageNumber: 0,
        pageSize: -1,
        totalItemCount: 0,
        pageSizeOptions: [{ value: -1, text: 'All' }]
    });

    const gridContainer = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '30px 57px 50px 0.5fr 84px 70px',
        gridGap: 0,
        paddingTop: 24,
        width: '100%',
        height: '97%',
        color: '#414141'
    };

    const gridItem = {
        textAlign: 'center',
        padding: 0
    };

    const titleArea = {
        gridColumn: '1 / 4',
        paddingLeft: 66,
        fontSize: 22,
        fontWeight: 500
    };

    const searchResultsArea = {
        paddingLeft: 66,
        paddingTop: 10,
        fontSize: 22,
        fontWeight: 500
    };

    const paginationArea = {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 33
    };

    const tableArea = {
        gridColumn: '1 / 4'
    };

    const buttonArea = {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 35
    };

    const [apiParams, setApiParams] = useState({
        sortOrder: 'asc',
        sortField: 'name',
        pageSize: 15,
        pageNumber: 0
    });

    const handlePageSizeChange = (option) => {
        setApiParams({ ...apiParams, pageSize: option.value });
    };

    const handlePrevClick = () => {
        if (apiParams.pageNumber >= 1) {
            setApiParams({
                ...apiParams,
                pageNumber: apiParams.pageNumber - 1
            });
        }
    };

    const handleNextClick = () => {
        if (apiParams.pageNumber <= pageInfo.pageCount) {
            setApiParams({
                ...apiParams,
                pageNumber: apiParams.pageNumber + 1
            });
        }
    };

    const handleSortOrderChange = (column) => {
        const unchangedColumns = columnDefinitions
            .filter((c) => c.field !== column.field)
            .map((c) => ({ ...c, sortOrder: '' }));

        setColumnDefinitions([...unchangedColumns, column]);
        setApiParams({
            ...apiParams,
            sortField: column.field,
            sortOrder: column.sortOrder
        });
    };

    useEffect(() => {
        if (tableColumnDefinitions) {
            const temp = tableColumnDefinitions
                .filter((c) => c.type !== 'hidden')
                .sort((a, b) => a.displayOrder - b.displayOrder);

            setColumnDefinitions(temp);
        }
    }, [tableColumnDefinitions]);

    useEffect(() => {
        document.getElementById(id + '-searchbar').focus();
    }, []);

    useEffect(() => {
        doSearch(searchTerm);
    }, [apiParams]);

    const handleSelectClick = () => {
        onSelect(selectedRow);
    };

    async function searchUpdate(e) {
        if (e !== searchTerm) {
            apiParams.pageNumber = 1;
        }

        doSearch(e);
    }

    const doSearch = async (e) => {
        setSearchTerm(e);

        const data = await searchFunction(e, apiParams);
        if (data.data) {
            setPageInfo(mapPageInfo(data));
            setData(data.data);
        } else {
            setData([]);
            setSelectedRow({});
        }
    };

    return (
        <div style={gridContainer}>
            <div style={titleArea}>
                <span>Lookup</span>
            </div>
            <div style={searchResultsArea}>
                <span>
                    {data.length > 0 &&
                        `Search Results (${pageInfo.totalItemCount})`}
                </span>
            </div>
            <div style={gridItem}>
                <AsSearchBar
                    id={`${id}-searchbar`}
                    placeholder='Search...'
                    width={395}
                    height={42}
                    minSearchLength={minSearchLength}
                    currentSearchTerm={searchTerm}
                    onSearchUpdate={searchUpdate}
                />
            </div>
            <div style={gridItem} />
            <div style={gridItem} />
            <div style={gridItem} />
            <div style={paginationArea}>
                <Pagination
                    pageInfo={pageInfo}
                    onPageSizeChange={handlePageSizeChange}
                    onPrevClick={handlePrevClick}
                    onNextClick={handleNextClick}
                />
            </div>
            <div style={{ ...gridItem, ...tableArea }}>
                <CompactTableTable
                    columnDefinitions={columnDefinitions}
                    data={data}
                    selectedRow={selectedRow}
                    onSetSelectedRow={setSelectedRow}
                    onSortOrderChange={handleSortOrderChange}
                />
            </div>
            <div style={gridItem} />
            <div style={gridItem} />
            <div style={buttonArea}>
                <AsButton
                    style={{
                        height: 34,
                        width: 130,
                        fontSize: 15,
                        fontWeight: 'bold'
                    }}
                    handleClick={handleSelectClick}
                    disabled={Object.keys(selectedRow).length === 0}
                >
                    Select
                </AsButton>
            </div>
            <div style={gridItem} />
            <div style={gridItem} />
            <div style={paginationArea}>
                <Pagination
                    pageInfo={pageInfo}
                    onPageSizeChange={handlePageSizeChange}
                    onPrevClick={handlePrevClick}
                    onNextClick={handleNextClick}
                />
            </div>
        </div>
    );
};

export default CompactTableLookupPage3;
