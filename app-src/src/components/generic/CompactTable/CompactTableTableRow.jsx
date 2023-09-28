import {
    StripedTableCell,
    StripedTableScrollbarRow
} from '@adserve/adserve-react-components';
import React from 'react';

const CompactTableTableRow = ({
    columnDefinitions,
    data,
    index,
    scrollPx,
    onScroll,
    gutterOffsetTop,
    maxHeight,
    border,
    active = false,
    scrollableLength,
    onHover,
    isHighlighted = false,
    isNextRowActive,
    noOfRows = 0,
    onClick
}) => {
    const cellStyle = {
        height: 25,
        padding: '0 8px',
        fontFamily: 'roboto',
        fontSize: 14,
        color: 'rgb(65,65,65)'
    };

    const activeBorder = '1px solid #FD9A00';

    return (
        <StripedTableScrollbarRow
            id={`table-compact-table-row-${index}`}
            isFirstRow={index === 1}
            scrollPx={scrollPx}
            onScroll={onScroll}
            gutterOffsetTop={gutterOffsetTop}
            maxHeight={maxHeight}
            border={border}
            scrollableHeight={scrollableLength}
            noOfRows={noOfRows}
        >
            {columnDefinitions.map((d, i, array) => {
                switch (d.type) {
                    case 'text':
                        return (
                            <StripedTableCell
                                border={border}
                                index={index}
                                key={`cell${i}`}
                                style={{
                                    ...cellStyle,
                                    borderLeft:
                                        i === 0
                                            ? active
                                                ? activeBorder
                                                : border
                                            : '',
                                    borderRight:
                                        active && i === array.length - 1
                                            ? activeBorder
                                            : border,
                                    borderBottom:
                                        active || isNextRowActive
                                            ? activeBorder
                                            : border,
                                    cursor: isHighlighted
                                        ? 'pointer'
                                        : 'default'
                                }}
                                scrollPx={scrollPx}
                                onHover={onHover}
                                isHighlighted={isHighlighted}
                                onClick={onClick}
                            >
                                {data[d.field]}
                            </StripedTableCell>
                        );

                    default:
                        break;
                }
            })}
        </StripedTableScrollbarRow>
    );
};

export default CompactTableTableRow;
