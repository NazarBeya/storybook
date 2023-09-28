import React, { useContext } from 'react';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';
import { transactionMainCellStyle } from './BillingStyles';

const TransactionTotalsFooterCell = ({
    tableBodyRef,
    tableFootRef,
    viewPortHeight,
    style,
    end = false,
    children,
    ...props
}) => {
    const { formatCurrency } = useContext(SystemSettingsContext);

    return (
        <td
            {...props}
            align='right'
            style={{
                ...transactionMainCellStyle,
                backgroundColor: '#ffffff',
                border: '1px solid #d7d7d7',
                position: 'relative',
                fontWeight: 500,
                zIndex: 9999,
                ...style,
                height: 31,
                paddingRight: end ? 29 : 11,
                fontSize: 15
            }}
        >
            {typeof children === 'number' ? formatCurrency(children) : children}
        </td>
    );
};

export default TransactionTotalsFooterCell;
