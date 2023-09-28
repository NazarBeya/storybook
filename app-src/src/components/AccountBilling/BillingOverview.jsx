import React from 'react';
import {
    borderPaneStyle,
    financialSummaryStyle,
    statusCtaStyle
} from './BillingStyles';
import FinancialSummary from './FinancialSummary';
import StatusSummary from './StatusSummary';
import AsSearchBarWithDateRange from './AsSearchBarWithDateRange';

const BillingOverview = ({
    account,
    onSearchUpdate,
    lifetimeBilling,
    yearBilling,
    totalScheduled,
    readOnly = false
}) => {
    return (
        <div
            style={{
                height: 165,
                width: '100%',
                backgroundColor: '#FFFFFF',
                display: 'flex'
            }}
        >
            <div style={{ marginTop: 7, marginLeft: 8 }}>
                <div style={financialSummaryStyle}>
                    <FinancialSummary
                        width={430}
                        lifetimeBilling={lifetimeBilling}
                        yearBilling={yearBilling}
                        totalScheduled={totalScheduled}
                    />
                </div>
            </div>

            <div style={{ marginTop: 7, marginLeft: 20 }}>
                <div style={borderPaneStyle()}>
                    <div
                        style={{ marginLeft: 21, marginTop: 18, width: '92%' }}
                    >
                        <AsSearchBarWithDateRange
                            onSearchUpdate={onSearchUpdate}
                        />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 7, marginLeft: 18 }}>
                <div style={statusCtaStyle}>
                    <div style={{ paddingLeft: 20, paddingTop: 30 }}>
                        <StatusSummary account={account} width={430} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingOverview;
