import {
    ScrollableArea,
    StripedTable
} from '@adserve/adserve-react-components';
import React, { useEffect, useRef, useState } from 'react';
import LinkCampaignsTableBody from './LinkCampaignsTableBody';
import LinkCampaignsTableHead from './LinkCampaignsTableHead';

const LinkCampaignsTable = ({
    contactCampaigns,
    onUpdateCampaign
}) => {
    const [scrollPx, setScrollPx] = useState(0);
    const [maxVisibleHeight, setMaxVisibleHeight] = useState(671);
    const [scrollableLength, setScrollableLength] = useState(0);

    const containerRef = useRef(null);
    const scrollableRef = useRef(null);
    const tableRef = useRef(null);
    const tableHeadRef = useRef(null);

    useEffect(() => {
        setMaxVisibleHeight(
            containerRef?.current?.clientHeight -
                tableHeadRef?.current?.clientHeight -
                2
        );

        setScrollableLength(scrollableRef?.current?.scrollHeight - 3);
    }, [contactCampaigns]);

    return (
        <ScrollableArea
            id='link-campaigns-table-container'
            ref={containerRef}
            style={{
                width: '100%',
                height: 669,
                borderBottom: '1px solid #D7D7D7',
                borderCollapse: 'separate',
                boxSizing: 'border-box'
            }}
            scrollSpeed={24}
            scrollPx={scrollPx}
            onScroll={setScrollPx}
            scrollableLength={scrollableLength}
            maxVisibleLength={maxVisibleHeight}
        >
            <StripedTable
                id='link-campaigns-striped-table'
                ref={tableRef}
                style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    tableLayout: 'none'
                }}
            >
                <LinkCampaignsTableHead ref={tableHeadRef} />
                <LinkCampaignsTableBody
                    ref={scrollableRef}
                    contactCampaigns={contactCampaigns}
                    onUpdateCampaign={onUpdateCampaign}
                    scrollPx={scrollPx}
                    onScroll={setScrollPx}
                    tableOffsetTop={tableRef?.current?.offsetTop}
                    maxHeight={maxVisibleHeight}
                    scrollableHeight={scrollableLength}
                />
            </StripedTable>
        </ScrollableArea>
    );
};

export default LinkCampaignsTable;
