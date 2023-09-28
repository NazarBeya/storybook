import {
    RadioButton,
    StripedTableHead,
    StripedTableHeadCell
} from '@adserve/adserve-react-components';
import React, { forwardRef } from 'react';

// eslint-disable-next-line no-empty-pattern
const LinkContactsTableHead = forwardRef(
    ({ hasPrimaryContact, onNoPrimaryContact }, ref) => {
        const cellStyle = {
            textAlign: 'left'
        };

        const bottomRowCellStyle = {
            ...cellStyle,
            borderBottom: '1px solid #D7D7D7'
        };

        return (
            <StripedTableHead id='link-contacts-table-head' ref={ref}>
                <tr id='link-contacts-table-header'>
                    <StripedTableHeadCell
                        id='link-contacts-table-head-primary-top'
                        width={74}
                        style={cellStyle}
                    >
                        <span>Primary</span>
                    </StripedTableHeadCell>
                    <StripedTableHeadCell
                        id='link-contacts-table-head-contacts-top'
                        width={509}
                        style={{ ...cellStyle, paddingLeft: 150 }}
                    >
                        <span>Contacts</span>
                    </StripedTableHeadCell>
                    <StripedTableHeadCell
                        id='link-contacts-table-head-acc-name-top'
                        width={460}
                        style={{ ...cellStyle, paddingLeft: 124 }}
                    >
                        <span>Account Name</span>
                    </StripedTableHeadCell>
                    <StripedTableHeadCell
                        id='link-contacts-table-head-roles-top'
                        width={310}
                        style={{ ...cellStyle, paddingLeft: 121 }}
                    >
                        <span>Roles</span>
                    </StripedTableHeadCell>
                </tr>
                <tr>
                    <StripedTableHeadCell
                        id='link-contacts-table-head-primary-bottom'
                        height={43}
                        style={{ ...bottomRowCellStyle, paddingLeft: 21 }}
                    >
                        <RadioButton
                            value={!hasPrimaryContact}
                            onClick={onNoPrimaryContact}
                        />
                    </StripedTableHeadCell>
                    <StripedTableHeadCell
                        id='link-contacts-table-head-contacts-bottom'
                        style={bottomRowCellStyle}
                    >
                        <span>No Primary Contact</span>
                    </StripedTableHeadCell>
                    <StripedTableHeadCell
                        id='link-contacts-table-head-acc-name-bottom'
                        style={bottomRowCellStyle}
                    />
                    <StripedTableHeadCell
                        id='link-contacts-table-head-roles-bottom'
                        style={bottomRowCellStyle}
                    />
                    <StripedTableHeadCell
                        id='link-contacts-table-header-gutter-cap'
                        width={18}
                        style={bottomRowCellStyle}
                    />
                </tr>
            </StripedTableHead>
        );
    }
);

export default LinkContactsTableHead;
