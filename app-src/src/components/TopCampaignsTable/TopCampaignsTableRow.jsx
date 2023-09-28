import React, { useContext } from 'react';
import {
    StripedTableRow,
    StripedTableCell
} from '@adserve/adserve-react-components';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';
import { campaignManagerUrl } from '../../constants/Urls';

const TopCampaignsTableRow = ({
    id,
    index,
    campaign,
    border,
    rowProps
}) => {
    const { formatCurrency, currencySybmol } = useContext(SystemSettingsContext);

    const nameCellStyle = {
        height: 29,
        width: 442,
        paddingTop: 1,
        paddingLeft: 66,
        fontFamily: 'roboto',
        fontSize: 15,
        fontWeight: 500,
        color: '#0D0192',
        cursor: 'pointer',
        borderLeft: border,
        borderTop: index === 0 ? border : 'none',
        ...rowProps?.nameCellStyle
    };

    const spendCellStyle = {
        height: 29,
        width: 149,
        paddingTop: 1,
        paddingRight: 10,
        fontFamily: 'roboto',
        fontSize: 15,
        fontWeight: 500,
        color: '#414141',
        borderTop: index === 0 ? border : 'none',
        ...rowProps?.spendCellStyle
    };

    const handleEditClick = () => {
        window.open(
          `${campaignManagerUrl}/campaigns/details?campaignId=${campaign.id}&readOnly=true&goBack=true`,
          '_self'
      );
    };

    return (
        <StripedTableRow border={border} id={id}>
            <StripedTableCell
                id={id}
                index={index}
                style={nameCellStyle}
                border={border}
                align='left'
                onClick={handleEditClick}
            >
                {campaign?.name || ''}
            </StripedTableCell>
            <StripedTableCell
                id={id}
                index={index}
                style={spendCellStyle}
                border={border}
                align='right'
            >
                {formatCurrency(campaign?.spend) || `${currencySybmol}0.00`}
            </StripedTableCell>
        </StripedTableRow>
    );
};

export default TopCampaignsTableRow;
