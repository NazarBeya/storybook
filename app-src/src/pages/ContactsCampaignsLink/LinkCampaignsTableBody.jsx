import React, { forwardRef, useState, useEffect } from 'react';
import LinkCampaignsTableRow from './LinkCampaignsTableRow';
import { GetContactRoles } from '../../services/ContactsDataService';

const LinkCampaignsTableBody = forwardRef(
    (
        {
            contactCampaigns,
            onUpdateCampaign,
            scrollPx,
            onScroll,
            tableOffsetTop,
            maxHeight,
            scrollableHeight
        },
        ref
    ) => {
        const [contactRoles, setContactRoles] = useState([]);

        const tableBorder = '1px solid #D7D7D7';
        const minRows = 11;
        const firstRowIndex = 1;
        let rowCount = firstRowIndex;

        const loadStaticData = async () => {
            try {
                const response = await GetContactRoles();
                setContactRoles(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        useEffect(() => {
            loadStaticData();
        }, []);

        const padWithEmptyRows = (startingIndex) => {
            const rows = [];

            for (let i = startingIndex; i <= minRows + 1; i++) {
                rows.push(
                    <LinkCampaignsTableRow
                        key={i}
                        index={i}
                        campaign={{ campaignId: i, new: true }}
                        contactRoles={contactRoles}
                        onUpdateCampaign={onUpdateCampaign}
                        scrollPx={scrollPx}
                        onScroll={onScroll}
                        gutterOffsetTop={
                            tableOffsetTop + (ref?.current?.offsetTop || 0)
                        } // Grabber position
                        maxHeight={maxHeight} // Where the scrollbar ends
                        scrollableLength={scrollableHeight}
                        noOfRows={ref?.current?.rows?.length || minRows}
                    />
                );
            }
            return rows;
        };

        return (
            <tbody
                id='link-contacts-table-body'
                ref={ref}
                style={{ borderBottom: tableBorder }}
            >
                {contactCampaigns.map((contactCampaign, i) => (
                    <LinkCampaignsTableRow
                        key={i}
                        index={rowCount++}
                        campaign={contactCampaign}
                        contactRoles={contactRoles}
                        onUpdateCampaign={onUpdateCampaign}
                        scrollPx={scrollPx}
                        onScroll={onScroll}
                        gutterOffsetTop={
                            tableOffsetTop + (ref?.current?.offsetTop || 0)
                        } // Grabber position
                        maxHeight={maxHeight} // Where the scrollbar ends
                        scrollableLength={scrollableHeight}
                        noOfRows={ref?.current?.rows?.length || minRows}
                    />
                ))}

                {padWithEmptyRows(rowCount)}
            </tbody>
        );
    }
);

export default LinkCampaignsTableBody;
