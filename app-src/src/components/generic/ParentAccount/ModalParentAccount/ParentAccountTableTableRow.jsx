import React from 'react';
import {
    StripedTableCell,
    StripedTableScrollbarRow
} from '@adserve/adserve-react-components';

const ParentAccountTableTableRow = ({
    columnDefinitions,
    data,
    index,
    scrollPx,
    onScroll,
    gutterOffsetTop,
    border,
    active = false,
    scrollableLength,
    onHover,
    isHighlighted = false,
    noOfRows = 0,
    onClick
}) => {
    const cellStyle = {
        height: 25,
        padding: '0 20px',
        fontFamily: 'roboto',
        fontSize: 14,
        color: '#414141'
    };

    const activeBorder = '1px solid #FD9A00';

    return (
        <StripedTableScrollbarRow
            id={`table-compact-table-row-${index}`}
            isFirstRow={index === 1}
            scrollPx={scrollPx}
            onScroll={onScroll}
            gutterOffsetTop={gutterOffsetTop}
            border={border}
            scrollableHeight={scrollableLength}
            noOfRows={noOfRows}
        >
            {columnDefinitions.map((d, i) => {

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
                                    : border,
                            cursor: isHighlighted && i===0
                                ? 'pointer'
                                : 'default',
                                borderTop:' 1px solid #D7D7D7',
                            textAlign: i===0? 'left':'right',
                            color:i===0?'#0A04B4':'#414141',
                            width:i===0?'300px':'117px'

                        }}
                        onHover={onHover}
                        isHighlighted={isHighlighted}
                        onClick={onClick}
                    >
                        {data[d.field]}
                    </StripedTableCell>
                );


            })}
        </StripedTableScrollbarRow>
    );
};

export default ParentAccountTableTableRow;
