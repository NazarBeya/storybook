import {
    AsButton,
    AsSearchBar,
    Pagination,
    mapPageInfo
} from '@adserve/adserve-react-components';
import React, { useState, useEffect, useReducer } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useCompactTableSearch from '../../../hooks/useCompactTableSearch';
import { apiParamsReducer } from '../../../services/AsGridService';
import PageContainer from '../../containers/PageContainer';
import CompactTableTable from './CompactTableTable';

const CompactTableLookupPage = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState(
        location.state?.searchTerm || ''
    );
    const [columnDefinitions, setColumnDefinitions] = useState([]);
    const [data, setData] = useState([]);
    const history = useHistory();
    const { searchFunction, addSearchResult } = useCompactTableSearch();
    const [selectedRow, setSelectedRow] = useState({});
    const [returnPath, setReturnPath] = useState(null);
    const [returnStates, setReturnStates] = useState(null);
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

    const apiParamDefaults = {
        sortField: 'name',
        sortOrder: 'asc',
        filter: location.state?.searchFilter || []
    };

    const [apiParams, apiParamsDispatcher] = useReducer(
        apiParamsReducer,
        apiParamDefaults
    );

    const handlePageSizeChange = (option) => {
        apiParamsDispatcher({ ...apiParams, pageSize: option.value });
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

        setColumnDefinitions([...unchangedColumns, column]);
        apiParamsDispatcher({
            sortField: column.field,
            sortOrder: column.sortOrder
        });
    };

    useEffect(() => {
        const temp = location.state?.tableColumnDefinitions
            .filter((c) => c.type !== 'hidden')
            .sort((a, b) => a.displayOrder - b.displayOrder);

        setColumnDefinitions(temp);
        apiParamsDispatcher({ sortField: temp[0].field });
        setReturnPath(location.state?.path);
        setReturnStates(location.state?.returnStates);
    }, []);

    const getData = async () => {
        try {
            const results = await searchFunction(searchTerm, apiParams);
            setData(results.data);
            if (
                results.data.filter((p) => p.id === selectedRow?.id)?.length ===
                0
            )
                setSelectedRow({});
            setPageInfo(mapPageInfo(results));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            getData();
        } else {
            setData([]);
            setSelectedRow({});
        }
    }, [searchTerm, apiParams]);

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

    const handleClose = () => {
        history.push({
            pathname: returnPath,
            state: {
                redirectedFrom: 'search',
                id: location?.state?.id,
                states: returnStates
            }
        });
    };

    const handleSelectClick = () => {
        addSearchResult(selectedRow);
        handleClose();
    };

    return (
        <PageContainer onClose={handleClose}>
            <div style={gridContainer}>
                <div style={titleArea}>
                    <span>Lookup</span>
                </div>
                <div style={searchResultsArea}>
                    <span>
                        {data.length > 0 && `Search Results (${data.length})`}
                    </span>
                </div>
                <div style={gridItem}>
                    <AsSearchBar
                        id='compactTableSearch'
                        placeholder='Search...'
                        width={395}
                        height={42}
                        minSearchLength={location?.state?.minSearchLength || 3}
                        currentSearchTerm={searchTerm}
                        onSearchUpdate={setSearchTerm}
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
        </PageContainer>
    );
};

export default CompactTableLookupPage;
