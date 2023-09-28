import React from 'react';
import TransactionDataTable from './TransactionDataTable';
import TransactionSourceHeader from './TransactionSourceHeader';
import { AsButton, isAuthorised } from '@adserve/adserve-react-components';
import { useHistory } from 'react-router-dom';

const TransactionItemDetails = ({ item, sourceName, title, refField, closeParams = {} }) => {
    const history = useHistory();

    const handleCreditInvoiceClick = () => {
        if (item && item?.id !== window.emptyGuid && item?.ledgerId !== window.emptyGuid) {
            window.open(
                `${window.origin}/billing/creditnote?requestFrom=invoice&requestAction=creditinvoice&id=${item?.id}&ledgerId=${item?.ledgerId}`,
                '_self'
            );
        }
    };
    const financeReadOnly = !isAuthorised('CRM_FIN_CON');

    return (
        <div
            style={{
                boxSizing: 'border-box',
                width: 1585,
                marginTop: 22,
                marginLeft: 43,
                marginRight: 43,
                border: '1px solid #D7D7D7',
                borderRadius: 8,
                backgroundColor: '#FFFFFF'
            }}
        >
            <div style={{ width: '100%', marginTop: 21 }}>
                <TransactionSourceHeader
                    item={item}
                    sourceName={sourceName}
                    title={title}
                    refField={refField}
                    closeParams={closeParams}
                />
            </div>

            <div style={{ marginLeft: 11, width: '98.7%', marginTop: 9 }}>
                <TransactionDataTable item={item} />
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: 25,
                    marginTop: -15,
                    marginLeft: 10,
                    marginRight: 10
                }}
            >
                <div>
                    <AsButton
                        id='creditInvoiceBtn'
                        style={{
                            height: 40,
                            width: 120,
                            fontSize: 15
                        }}
                        handleClick={handleCreditInvoiceClick}
                        useSecondaryStyle
                        disabled={financeReadOnly}
                    >
                        {window.translate('Credit Invoice')}
                    </AsButton>
                </div>
                <div>
                    <AsButton
                        handleClick={history.goBack}
                        style={{
                            height: 40,
                            width: 100,
                            fontSize: 15
                        }}
                    >
                        Back
                    </AsButton>
                </div>
            </div>
        </div>
    );
};

export default TransactionItemDetails;
