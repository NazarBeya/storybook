import React, { useContext } from 'react';
import { SystemSettingsContext } from '../../contexts/SystemSettingsContext';
import { overviewHeadingStyle, overviewTextStyle } from './BillingStyles';

const FinancialSummary = ({
    lifetimeBilling = 0,
    yearBilling = 0,
    totalScheduled = 0,
    width = 450
}) => {
    const { formatCurrency } = useContext(SystemSettingsContext);

    return (
        <div style={{ width: width }}>
            <div style={{ height: 20 }}>
                <div style={{ float: 'left' }}>
                    <span style={overviewHeadingStyle}>
                        Total Lifetime Billing
                    </span>
                </div>
                <div style={{ float: 'right' }}>
                    <span style={overviewTextStyle}>
                        {formatCurrency(lifetimeBilling)}
                    </span>
                </div>
            </div>

            <div style={{ marginTop: 16, height: 20 }}>
                <div style={{ float: 'left' }}>
                    <span style={overviewHeadingStyle}>
                        Total Bill Last 12 Months
                    </span>
                </div>
                <div style={{ float: 'right' }}>
                    <span style={overviewTextStyle}>
                        {formatCurrency(yearBilling)}
                    </span>
                </div>
            </div>

            <div style={{ marginTop: 12 }}>
                <div style={{ float: 'left' }}>
                    <span style={overviewHeadingStyle}>Total Scheduled</span>
                </div>
                <div style={{ float: 'right' }}>
                    <span style={overviewTextStyle}>
                        {formatCurrency(totalScheduled)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FinancialSummary;
