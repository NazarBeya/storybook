import {
    StripedTableHead,
    StripedTableHeadCell
} from '@adserve/adserve-react-components';
import React, { forwardRef } from 'react';
import { ReactComponent as IconChevronDown } from '../../../svg/icon_chevron_down.svg';
import { ReactComponent as IconChevronUp } from '../../../svg/icon_chevron_up.svg';

const CompactTableTableHead = forwardRef(
    ({ border, definitions, onSortOrderChange, isFirstRowSelected }, ref) => {
        const sortIcon = {
            height: 12,
            width: 16,
            alignSelf: 'center',
            marginLeft: 7
        };

        const headCellStyle = {
            borderBottom: '1px solid #FD9A00'
        };

        return (
            <StripedTableHead id='compact-table-table-head' ref={ref}>
                <tr id='compact-table-table-header'>
                    {definitions.map((def, i) => (
                        <StripedTableHeadCell
                            key={`header${i}`}
                            id={`compact-table-table-header-${def.field}`}
                            border={border}
                            style={isFirstRowSelected && headCellStyle}
                            height={50}
                            onClick={
                                def.sortable
                                    ? () => onSortOrderChange(def)
                                    : null
                            }
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <span>{def.headerName}</span>
                                {(def.sortable && def.sortOrder === '') ||
                                def.sortOrder === 'asc' ? (
                                    <IconChevronDown
                                        viewBox='15 14 22 22'
                                        style={sortIcon}
                                    />
                                ) : (
                                    <IconChevronUp
                                        viewBox='15 14 22 22'
                                        style={sortIcon}
                                    />
                                )}
                            </div>
                        </StripedTableHeadCell>
                    ))}
                    <StripedTableHeadCell
                        id='compact-table-table-header-gutter-cap'
                        width={18}
                        border={border}
                    />
                </tr>
            </StripedTableHead>
        );
    }
);

export default CompactTableTableHead;
