import React, { useState } from 'react';
import { useLocation } from 'react-router';
import PageContainer from '../containers/PageContainer';
import TransactionItemDetails from './TransactionItemDetails';

const CreditNoteDetailsPage = () => {
    const location = useLocation();
    // Not sure these should have a setter so it may be removed
    const [accountName, setAccountName] = useState(location?.state?.sourceName);
    const [creditNote, setCreditNote] = useState(location?.state?.payload);
    return (
        <PageContainer>
            <TransactionItemDetails
                item={creditNote}
                sourceName={accountName}
                title='Credit Note'
                refField='invoiceNo'
            />
        </PageContainer>
    );
};

export default CreditNoteDetailsPage;
