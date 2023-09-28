import React, { useCallback, useRef, useState } from 'react';
import { campaignManagerUi } from '../../constants/Endpoint';
import { invoiceNumberTextStyle } from './BillingStyles';

const CampaignNumberCell = ({ data, field }) => {
    const ref = useRef(null);

    const [isHovering, setIsHovering] = useState(false);

    /**
     * Click event handler for the campaign number cell's content
     * @param {Event} event - event
     */
    const onClick = useCallback(
        (event) => {
            window.open(
                `${campaignManagerUi}/campaigns/details?campaignId=${data.campaignId}&readOnly=true&isEditable=true&goBack=true`,
                '_self'
            );
        },
        [data]
    );

    const onMouseOver = useCallback(() => setIsHovering(true), []);
    const onMouseOut = useCallback(() => setIsHovering(false), []);

    if (data.invoiceTypeName === 'CreditNote' && ref.current) {
        ref.current.parentElement.style.backgroundColor = '#FEEDEC';
    }

    return (
        <div
            ref={ref}
            onClick={onClick}
            style={{
                ...invoiceNumberTextStyle(
                    data.invoiceTypeName === 'CreditNote'
                ),
                textDecoration: isHovering ? 'underline' : undefined
            }}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        >
            {data[field]}
        </div>
    );
};

export default CampaignNumberCell;
