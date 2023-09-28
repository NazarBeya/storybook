import React, { useCallback, useRef, useState } from 'react';
import { campaignManagerUi } from '../../constants/Endpoint';
import { invoiceNumberTextStyle } from './BillingStyles';

const CampaignNumberForwardScheduleCell = ({ data, field }) => {
    const ref = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const nullCampaign =
    data.campaignId === null || data.campaignId === window.emptyGuid;
    /**
     * Click event handler for the campaign number cell's content
     * @param {Event} event - event
     */
    const onClick = useCallback(
        (event) => {
            window.open(
                `${campaignManagerUi}/campaigns/details?campaignId=${data.camapignId}&readOnly=true&isEditable=true&goBack=true`,
                '_self'
            );
        },
        [data]
    );

    const onMouseOver = () => setIsHovering(true);
    const onMouseOut = () => setIsHovering(false);

    return (
        <div
            ref={ref}
            onClick={onClick}
            style={{
                ...invoiceNumberTextStyle(false),
                textDecoration:
                !nullCampaign && isHovering ? 'underline' : undefined,
            cursor: !nullCampaign ? 'pointer' : 'default',
            color: !nullCampaign ? '#1101B0' : '#414141'}}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        >
            {data[field]}
        </div>
    );
};

export default CampaignNumberForwardScheduleCell;
