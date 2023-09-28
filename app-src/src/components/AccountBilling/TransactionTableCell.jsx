import { StripedTableCell } from '@adserve/adserve-react-components';
import React, { useContext } from 'react';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';
import { transactionMainCellStyle } from './BillingStyles';

const TransactionTableCell = ({
    children,
    index,
    highlighted,
    onHover,
    scrollPx,
    style,
    end = false,
    ...props
}) => {
    const { formatCurrency } = useContext(SystemSettingsContext);

    const i = index + 1;

    return (
        <StripedTableCell
            {...props}
            align='right'
            index={i}
            onHover={onHover}
            isHighlighted={i === highlighted}
            scrollPx={scrollPx}
            style={{
                ...transactionMainCellStyle,
                ...style,
                height: 31,
                paddingRight: end ? 29 : 11,
                fontSize: 14,
                fontWeight: 400,
                border: '1px solid #D7D7D7'
            }}
        >
            {typeof children === 'number'
                ? formatCurrency(children)
                : children || ''}
        </StripedTableCell>
    );
};

export default TransactionTableCell;
