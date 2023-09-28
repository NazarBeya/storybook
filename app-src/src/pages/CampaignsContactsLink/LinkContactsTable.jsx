import {
    ScrollableArea,
    StripedTable
} from '@adserve/adserve-react-components';
import React, { useRef, useState, useEffect } from 'react';
import LinkContactsTableBody from './LinkContactsTableBody';
import LinkContactsTableHead from './LinkContactsTableHead';

const LinkContactsTable = ({
    campaignContacts,
    onUpdateContact,
    hasPrimaryContact,
    onNoPrimaryContact
}) => {
    const [scrollPx, setScrollPx] = useState(0);
    const [maxVisibleHeight, setMaxVisibleHeight] = useState(681);
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
    }, [campaignContacts]);

    return (
        <ScrollableArea
            id='link-contacts-table-container'
            ref={containerRef}
            style={{
                width: '100%',
                height: 679,
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
                id='link-contacts-striped-table'
                ref={tableRef}
                style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    tableLayout: 'none'
                }}
            >
                <LinkContactsTableHead
                    ref={tableHeadRef}
                    hasPrimaryContact={hasPrimaryContact}
                    onNoPrimaryContact={onNoPrimaryContact}
                />
                <LinkContactsTableBody
                    ref={scrollableRef}
                    campaignContacts={campaignContacts}
                    onUpdateContact={onUpdateContact}
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

export default LinkContactsTable;
