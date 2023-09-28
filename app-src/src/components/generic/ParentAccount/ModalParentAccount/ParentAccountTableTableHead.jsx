import {
    StripedTableHead,
    StripedTableHeadCell
} from '@adserve/adserve-react-components';
import React, { forwardRef } from 'react';

const ParentAccountTableTableHead = forwardRef(
    ({ border, definitions }, ref) => {

        return (
            <StripedTableHead id='compact-table-table-head' ref={ref}>
                <tr id='compact-table-table-header'>
                    {definitions.map((def, i) => (
                        <StripedTableHeadCell
                            key={`header${i}`}
                            id={`compact-table-table-header-${def.field}`}
                            border={border}
                            style={{width:i===0?'300px':'117px'}}
                            height={50}
                        >
                            <span>{def.headerName}</span>
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

ParentAccountTableTableHead.displayName = 'ParentAccountTableTableHead';

export default ParentAccountTableTableHead;
