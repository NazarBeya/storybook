import {
    ScrollableArea,
    StripedTable
} from '@adserve/adserve-react-components';
import React, { useRef, useState } from 'react';
import CompactTableTableBody from './CompactTableTableBody';
import CompactTableTableHead from './CompactTableTableHead';

const CompactTableTable = ({
    columnDefinitions,
    data,
    selectedRow,
    onSetSelectedRow,
    onSortOrderChange
}) => {
    const [scrollPx, setScrollPx] = useState(0);

    const containerRef = useRef(null);
    const scrollableRef = useRef(null);
    const tableRef = useRef(null);
    const tableHeadRef = useRef(null);

    const border = '1px solid #D7D7D7';

    const columnDefsToDisplayInOrder = () =>
        columnDefinitions
            .filter((c) => c.type !== 'hidden')
            .sort((a, b) => a.displayOrder - b.displayOrder);

    const handleSortOrderChange = (column) => {
        switch (column.sortOrder) {
            case 'asc':
                column.sortOrder = 'desc';
                break;
            default:
                column.sortOrder = 'asc';
                break;
        }

        onSortOrderChange(column);
    };

    return (
        <ScrollableArea
            id='compact-table-table-container'
            ref={containerRef}
            style={{ width: '100%' }}
            scrollSpeed={8}
            scrollPx={scrollPx}
            onScroll={setScrollPx}
            scrollableLength={scrollableRef?.current?.scrollHeight}
            maxVisibleLength={containerRef?.current?.clientHeight}
        >
            <StripedTable
                id='table-striped-compact-table'
                ref={tableRef}
                style={{ width: '100%' }}
            >
                <CompactTableTableHead
                    ref={tableHeadRef}
                    border={border}
                    definitions={columnDefsToDisplayInOrder()}
                    isFirstRowSelected={
                        data[0] !== undefined && selectedRow?.id === data[0].id
                    }
                    onSortOrderChange={handleSortOrderChange}
                />
                <CompactTableTableBody
                    ref={scrollableRef}
                    scrollPx={scrollPx}
                    onScroll={setScrollPx}
                    tableOffsetTop={tableRef?.current?.offsetTop}
                    maxHeight={
                        containerRef?.current?.clientHeight -
                        tableHeadRef?.current?.clientHeight
                    }
                    border={border}
                    columnDefinitions={columnDefsToDisplayInOrder()}
                    data={data}
                    selectedRow={selectedRow}
                    onSetSelectedRow={onSetSelectedRow}
                />
            </StripedTable>
        </ScrollableArea>
    );
};

export default CompactTableTable;
