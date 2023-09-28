import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import TransactionItemDetails from './TransactionItemDetails';
import { GetInvoice } from '../../services/AccountDataService';

const InvoiceDetailsPage = () => {
    const location = useLocation();

    const accountName = location?.state?.sourceName;
    const invoiceHeader = location?.state?.payload;
    const [invoice, setInvoice] = useState({});

    const loadData = () => {
        GetInvoice(invoiceHeader?.id).then((data) => {
            setInvoice(data);
        });
    };

    useEffect(() => {
        loadData();
    }, [invoiceHeader]);

    return (
        <div>
            <TransactionItemDetails
                item={invoice}
                sourceName={accountName}
                title='Invoice'
                refField='invoiceNo'
                closeParams={{ selectedTab: 5 }}
            />
        </div>
    );
};

export default InvoiceDetailsPage;
