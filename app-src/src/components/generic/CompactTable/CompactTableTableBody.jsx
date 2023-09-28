import { StripedTableEmptyRows } from '@adserve/adserve-react-components';
import React, { forwardRef, useState } from 'react';
import CompactTableTableRow from './CompactTableTableRow';

const CompactTableTableBody = forwardRef(
    (
        {
            columnDefinitions,
            data,
            border,
            scrollPx,
            onScroll,
            tableOffsetTop,
            maxHeight,
            selectedRow,
            onSetSelectedRow
        },
        ref
    ) => {
        const [highlightedRow, setHighlightedRow] = useState(-1);

        const minRows = 15;
        const firstRowIndex = 1;
        let rowCount = firstRowIndex;

        const handleClick = (data) => {
            console.log('selectedRow', data);
            onSetSelectedRow(data);
        };

        return (
            <tbody
                id='compact-table-table-body'
                ref={ref}
                style={{ overflowY: 'hidden', borderBottom: border }}
            >
                {data?.map((d, i, array) => (
                    <CompactTableTableRow
                        key={i}
                        isHighlighted={rowCount === highlightedRow}
                        index={rowCount++}
                        scrollPx={scrollPx}
                        onScroll={onScroll}
                        gutterOffsetTop={
                            tableOffsetTop + (ref?.current?.offsetTop || 0)
                        }
                        maxHeight={maxHeight}
                        border={border}
                        scrollableLength={ref?.current?.scrollHeight}
                        onHover={setHighlightedRow}
                        noOfRows={ref?.current?.rows?.length || minRows}
                        columnDefinitions={columnDefinitions}
                        data={d}
                        active={selectedRow.id === d.id}
                        isNextRowActive={
                            array[i + 1] !== undefined &&
                            selectedRow.id === array[i + 1].id
                        }
                        onClick={() => handleClick(d)}
                    />
                ))}
                <StripedTableEmptyRows
                    scrollPx={scrollPx}
                    border={border}
                    columns={columnDefinitions.length}
                    startingIndex={rowCount}
                    endingIndex={minRows}
                    height={25}
                    firstRowIndex={firstRowIndex}
                    noOfRows={ref?.current?.rows?.length || minRows}
                />
            </tbody>
        );
    }
);

export default CompactTableTableBody;
