import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    accountNameStyle,
    transactionPeriodStyle,
    transactionTitleStyle
} from './BillingStyles';
import { IconClose } from '@adserve/adserve-react-components';

const TransactionSourceHeader = ({
    item,
    sourceName,
    title,
    refField,
    closeParams = {}
}) => {
    const history = useHistory();

    const handleClose = () => {
        history.push({
            pathname: '/accounts/details',
            state: closeParams
        })

    };

    return (
        <div>
            <div>
                <IconClose
                    id='close'
                    style={{
                        width: 19,
                        height: 19,
                        marginTop:-10,
                        marginLeft:1543,
                    }}
                    cursor='pointer'
                    onClick={handleClose}
                />
            </div>
            <div>
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginLeft: 13,
                        paddingTop: 5
                    }}
                >
                    <span style={accountNameStyle}>{sourceName}</span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        marginRight: 11
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            paddingTop: 20,
                            height: 1
                        }}
                    >
                        <span style={transactionPeriodStyle}>
                            Invoice Period:{' '}
                            {new Date(item?.periodStartDate)
                                ?.toDateString()
                                ?.substring(4)}{' '}
                            -{' '}
                            {new Date(item?.periodEndDate)
                                ?.toDateString()
                                ?.substring(4)}
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginLeft: 13,
                        paddingTop: 5
                    }}
                >
                    <span style={transactionTitleStyle}>
                        {title} Number: {item[refField]}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TransactionSourceHeader;
