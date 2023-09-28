import React from 'react';
import TopCampaignsTableRow from './TopCampaignsTableRow';
import { StripedTableEmptyRows } from '@adserve/adserve-react-components';
import { useState } from 'react';
import { useEffect } from 'react';

const TopCampaignsTableBody = ({
    id,
    campaigns,
    border,
    tableBodyProps
}) => {
    const [emptyStart, setEmptyStart] = useState(0);
    const emptyEnd = 9;

    useEffect(() => {
        setEmptyStart(campaigns?.length);
    }, [campaigns]);

    return (
        <tbody>
            {campaigns?.map((campaign, i) => (
                <TopCampaignsTableRow
                    id={`table-top-campaigns-row-${i}`}
                    key={i}
                    index={i}
                    campaign={campaign}
                    border={border}
                    rowProps={tableBodyProps}
                />
            ))}
            <StripedTableEmptyRows
                columns={2}
                startingIndex={emptyStart}
                endingIndex={emptyEnd}
                height={29}
                id={id}
            />
        </tbody>
    );
};

export default TopCampaignsTableBody;
