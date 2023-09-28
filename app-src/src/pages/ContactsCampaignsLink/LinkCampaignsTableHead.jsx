import {
    StripedTableHead,
    StripedTableHeadCell
} from '@adserve/adserve-react-components';
import React, { forwardRef } from 'react';

// eslint-disable-next-line no-empty-pattern
const LinkCampaignsTableHead = forwardRef(({}, ref) => {
    const cellStyle = {
        textAlign: 'left'
    };

    const bottomRowCellStyle = {
        ...cellStyle,
        borderBottom: '1px solid #D7D7D7'
    };

    return (
        <StripedTableHead id='link-campaigns-table-head' ref={ref}>
            <tr id='link-campaigns-table-header'>
                <StripedTableHeadCell width={74} />
                <StripedTableHeadCell
                    id='link-campaigns-table-head-contacts-top'
                    width={509}
                    style={{ ...cellStyle, paddingLeft: 113 }}
                >
                    <span>Campaign Name</span>
                </StripedTableHeadCell>
                <StripedTableHeadCell
                    id='link-campaigns-table-head-acc-name-top'
                    width={230}
                    style={{ ...cellStyle, paddingLeft: 55 }}
                >
                    <span>Advertiser</span>
                </StripedTableHeadCell>
                <StripedTableHeadCell
                    id='link-campaigns-table-head-acc-name-top'
                    width={230}
                    style={{ ...cellStyle, paddingLeft: 55 }}
                >
                    <span>Agency</span>
                </StripedTableHeadCell>
                <StripedTableHeadCell
                    id='link-campaigns-table-head-roles-top'
                    width={310}
                    style={{ ...cellStyle, paddingLeft: 119 }}
                >
                    <span>Role</span>
                </StripedTableHeadCell>
            </tr>
            <tr>
                <StripedTableHeadCell height={33} style={bottomRowCellStyle} />
                <StripedTableHeadCell style={bottomRowCellStyle} />
                <StripedTableHeadCell style={bottomRowCellStyle} />
                <StripedTableHeadCell style={bottomRowCellStyle} />
                <StripedTableHeadCell
                    id='link-campaigns-table-header-gutter-cap'
                    width={18}
                    style={bottomRowCellStyle}
                />
            </tr>
        </StripedTableHead>
    );
});

export default LinkCampaignsTableHead;
