import React, { useState, useReducer, useEffect, useContext } from 'react';
import initialColumnDefinitions from './AttachmentGridColumnDefinitions';
import {
    getAttachments,
    deleteAttachment,
    download
} from '../../services/AttachmentService';
import { AsGrid, mapPageInfo } from '@adserve/adserve-react-components';
import { useHistory } from 'react-router-dom';
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

const AttachmentList = ({ entityId, entityType, onClose, heading }) => {
    const { dateFormat, timeFormat, locale, currency } = useContext(
        SystemSettingsContext
    );
    const history = useHistory();

    const [columnDefinitions, setColumnDefinitions] = useState(
        initialColumnDefinitions
    );
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
    const [attachments, setAttachments] = useState([]);

    const reducer = (state, updatedValues) => ({
        ...state,
        pageNumber: 1,
        ...updatedValues
    });

    const [apiParams, apiParamsDispatcher] = useReducer(reducer, {
        pageNumber: 1,
        pageSize: 15,
        sortField: 'dateCreated',
        sortOrder: 'asc',
        entityId: entityId
    });

    const getData = async () => {
        const response = await getAttachments(apiParams, entityType);
        setAttachments(response.data.data);
        setPageInfo(mapPageInfo(response.data));
    };

    useEffect(() => {
        getData();
        // Clean up async functions if tab changes before async is complete
        return () => setAttachments([]);
    }, [apiParams]);

    useEffect(() => {
      if(apiParams.entityId !== entityId)
        apiParamsDispatcher({ ...apiParams, entityId: entityId });
    }, [entityId]);

    /**
     * Event handler for column sorting
     * @param {object} column - the column desired column to sort the table by
     */
    const handleSortOrderChange = (column) => {
        const unchangedColumns = columnDefinitions
            .filter((c) => c.field !== column.field)
            .map((c) => ({ ...c, sortOrder: '' }));

        const sortField =
            column.field === 'status' ? 'statusEnumOrder' : column.field;

        setColumnDefinitions([...unchangedColumns, column]);
        apiParamsDispatcher({
            sortField: sortField,
            sortOrder: column.sortOrder,
            pageNumber: 1
        });
    };

    const editNote = async (data) => {
        const NoteService = require('../../services/NoteService');
        const note = await NoteService.getNote(data.id, entityType);
        history.push({
            pathname: '/attachments/create',
            state: {
                entityId: entityId,
                isEditing: true,
                isNote: true,
                noteValue: JSON.parse(note.data.slateValue),
                name: data.name,
                description: data.description,
                id: data.id,
                heading: heading,
                entityType: entityType
            },
            onClose: onClose
        });
    };

    /**
     * Event handler for action buttons
     * @param {string} command - edit, copy, or delete
     * @param {object} data - the note or attachment from the selected row
     */
    const handleActionClick = async (command, data) => {
        switch (command) {
            case 'edit':
                if (data.type === 'Note') {
                    editNote(data);
                } else {
                    history.push({
                        pathname: '/attachments/create',
                        state: {
                            entityId: entityId,
                            isEditing: true,
                            isNote: false,
                            name: data.name,
                            description: data.description,
                            id: data.id,
                            heading: heading,
                            entityType: entityType
                        },
                        onClose: onClose
                    });
                }
                break;

            case 'delete':
                if (data.type === 'Note') {
                    const NoteService = require('../../services/NoteService');
                    await NoteService.deleteNote(data.id, entityType);
                } else {
                    await deleteAttachment(data, entityType);
                }
                getData();
                break;

            default:
                break;
        }
    };

    const handlePrimaryColumnClick = async (data) => {
        switch (data.type) {
            case 'Note':
                editNote(data);
                break;

            default:
                await download(data, entityType);
                break;
        }
    };

    /**
     * Event handler for paginator next button
     */
    const handleNextClick = () => {
        const newPageNumber = apiParams.pageNumber + 1;
        if (newPageNumber <= pageInfo.pageCount) {
            apiParamsDispatcher({ ...apiParams, pageNumber: newPageNumber });
        }
    };

    /**
     * Event handler for paginator prev button
     */
    const handlePrevClick = () => {
        const newPageNumber = apiParams.pageNumber - 1;
        if (newPageNumber >= 1) {
            apiParamsDispatcher({ ...apiParams, pageNumber: newPageNumber });
        }
    };

    return (
        <div style={gridContainer}>
            <div style={{ ...gridItem, ...tableArea }}>
                <AsGrid
                    columnDefs={columnDefinitions}
                    pageInfo={pageInfo}
                    data={attachments || []}
                    primaryColumn='name'
                    showColumnFilter={false}
                    onPageSizeChange={(o) =>
                        apiParamsDispatcher({ pageSize: o.value })
                    }
                    onPrimaryColumnClick={handlePrimaryColumnClick}
                    onActionClick={handleActionClick}
                    onNextClick={handleNextClick}
                    onPrevClick={handlePrevClick}
                    onSortOrderChange={handleSortOrderChange}
                    onActionIconLoad={() => false} // To return whether it should be disabled. Or, implement like LeadsGrid.
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    locale={locale}
                    currency={currency}
                    actionIconSize={19}
                    rowHeight={34}
                />
            </div>
        </div>
    );
};

export default AttachmentList;
