import {
    ScrollableArea,
    StripedTable
} from '@adserve/adserve-react-components';
import React, { useEffect, useRef, useState } from 'react';
import ParentAccountTableTableBody from './ParentAccountTableTableBody';
import ParentAccountTableTableHead from './ParentAccountTableTableHead';

const ParentAccountTableTable = ({
    columnDefinitions,
    data,
    selectedRow,
    onSetSelectedRow,
    setModalShowing,
    setSelectedChildId
}) => {
    const [scrollPx, setScrollPx] = useState(0);
    const [renderHack, setRenderHack] = useState(0);

    const containerRef = useRef(null);
    const scrollableRef = useRef(null);
    const tableRef = useRef(null);
    const tableHeadRef = useRef(null);

    const border = '1px solid #D7D7D7';

    useEffect(() => {
        // This is to force a refresh to get the scrollbar behaving properly
        setRenderHack(renderHack + 1);
    }, [data]);

    return (
        <div
            style={{
                marginLeft: 40,
                width: '78%',
                boxSizing: 'border-box',
                borderTop: ' 1px solid #D7D7D7',
                height: 293,
                marginTop: 20
            }}>
            <StripedTable id='table-striped-compact-table' ref={tableRef} style={{ width: '200%' }}>
                <ParentAccountTableTableBody
                    ref={scrollableRef}
                    scrollPx={scrollPx}
                    onScroll={setScrollPx}
                    tableOffsetTop={tableRef?.current?.offsetTop}
                    maxHeight={
                        containerRef?.current?.clientHeight -
                        tableHeadRef?.current?.clientHeight
                    }
                    border={border}
                    columnDefinitions={columnDefinitions}
                    data={data}
                    selectedRow={selectedRow}
                    onSetSelectedRow={onSetSelectedRow}
                    setModalShowing={setModalShowing}
                    setSelectedChildId={setSelectedChildId}
                />
            </StripedTable>
        </div>
    );
};

export default ParentAccountTableTable;
