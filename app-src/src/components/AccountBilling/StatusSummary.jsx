import React from 'react';
import { overviewHeadingStyle, overviewTextStyle } from './BillingStyles';

const StatusSummary = ({ account, width = 450 }) => {
    return (
        <div style={{ width: width }}>
            <div style={{ height: 20 }}>
                <div style={{ float: 'left' }}>
                    <span style={overviewHeadingStyle}>
                        {window.translate('Rating')}
                    </span>
                </div>
                <div style={{ float: 'right' }}>
                    <span style={overviewTextStyle}>
                        {account?.accountRating}
                    </span>
                </div>
            </div>

            <div style={{ marginTop: 16, height: 20 }}>
                <div style={{ float: 'left' }}>
                    <span style={overviewHeadingStyle}>
                        {window.translate('Credit Status')}
                    </span>
                </div>
                <div style={{ float: 'right' }}>
                    <span style={overviewTextStyle}>
                        {account?.creditStatus}
                    </span>
                </div>
            </div>

            <div style={{ marginTop: 12 }}>
                <div style={{ float: 'left' }}>
                    <span style={overviewHeadingStyle}>
                        {window.translate('Account Status')}
                    </span>
                </div>
                <div style={{ float: 'right' }}>
                    <span style={overviewTextStyle}>
                        {account?.accountStatus}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatusSummary;
