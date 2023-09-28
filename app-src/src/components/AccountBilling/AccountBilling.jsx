import { Spacer } from '@adserve/adserve-react-components';
import React, { useEffect, useState } from 'react';
import {
    GetAccountForwardSchedule,
    GetAccountInvoiceHeaders,
    GetSearchAccountForwardSchedule
} from '../../services/AccountDataService';
import BillingForwardSchedule from './BillingForwardSchedule';
import BillingInvoicesIssued from './BillingInvoicesIssued';
import BillingOverview from './BillingOverview';

const AccountBilling = ({ account, readOnly = false, ...props }) => {
    // TODO: Need a way to handle if we can potentially display all entries on one page e.g. increase pageSize by 100 each time the scrollbar hits the bottom
    const [apiParams, setApiParams] = useState({
        startDate:
            account?.startDate ||
            new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: account?.endDate || new Date(),
        accountId: account?.id,
        pageNumber: 1,
        pageSize: -1,
        sortField: 'invoicenumber',
        sortOrder: 'desc'
    });
    const [invoiceHeaderData, setInvoiceHeaderData] = useState([]);
    const [forwardScheduleData, setForwardScheduleData] = useState([]);
    const [showInvoices, setShowInvoices] = useState(true);
    const [showCreditNotes, setShowCreditNotes] = useState(true);
    const [lifetimeBilling, setLifetimeBilling] = useState(0);
    const [yearBilling, setYearBilling] = useState(0);
    const [totalScheduled, setTotalScheduled] = useState(0);
    const [invoicesAirtime, setInvoicesAirtime] = useState(0);
    const [invoicesOffairs, setInvoicesOffairs] = useState(0);
    const [invoicesCommission, setInvoicesCommission] = useState(0);
    const [invoicesVat, setInvoicesVat] = useState(0);
    const [invoicesTotal, setInvoicesTotal] = useState(0);
    const [scheduledAirtime, setScheduledAirtime] = useState(0);
    const [scheduledOffairs, setScheduledOffairs] = useState(0);
    const [scheduledCommission, setScheduledCommission] = useState(0);
    const [scheduledVat, setScheduledVat] = useState(0);
    const [scheduledTotal, setScheduledTotal] = useState(0);

    const onSearchUpdate = (params) => {
        setApiParams({ ...apiParams, ...params });
    };

    const loadData = async () => {
        await GetAccountInvoiceHeaders(
            apiParams,
            showInvoices,
            showInvoices,
            showCreditNotes
        )
            .then((data) => {
                console.log('data: ', data.data);
                setInvoiceHeaderData(data.data);
            })
            .catch(console.log);
        GetSearchAccountForwardSchedule({ ...apiParams })
        .then((data) => {
                console.log('fs data ', data.data);
            setForwardScheduleData(data);
            console.log('forward data ', forwardScheduleData);

        })
        .catch(console.log);
    };

    useEffect(() => {
        loadData();
    }, [showInvoices, showCreditNotes, apiParams]);

    const updateOrderNumber = (idx, val) => {
        console.log(val);
        const updatedForwardScheduleData = forwardScheduleData;
        updatedForwardScheduleData[idx].orderNumber = val;
        setForwardScheduleData([].concat(updatedForwardScheduleData));
    };

    const toggleShowInvoices = () => {
        setShowInvoices(!showInvoices);
    };

    const toggleShowCreditNotes = () => {
        setShowCreditNotes(!showCreditNotes);
    };

    useEffect(() => {
        let updatedLifetimeBilling = 0;
        let updatedYearBilling = 0;
        let updatedTotalScheduled = 0;
        let updatedInvoicesAirtime = 0;
        let updatedInvoicesOffairs = 0;
        let updatedInvoicesCommission = 0;
        let updatedInvoicesVat = 0;
        let updatedInvoicesTotal = 0;
        let updatedScheduledAirtime = 0;
        let updatedScheduledOffairs = 0;
        let updatedScheduledCommission = 0;
        let updatedScheduledVat = 0;
        let updatedScheduledTotal = 0;

        invoiceHeaderData.forEach((invoice, i) => {
            updatedLifetimeBilling = updatedLifetimeBilling + invoice?.total;
            updatedYearBilling = updatedYearBilling + invoice?.total;
            updatedInvoicesAirtime =
                updatedInvoicesAirtime + invoice?.netAirtimeValue;
            updatedInvoicesOffairs =
                updatedInvoicesOffairs + invoice?.netOffAirsValue;
            updatedInvoicesCommission =
                updatedInvoicesCommission + invoice?.commission;
            updatedInvoicesVat = updatedInvoicesVat + invoice?.totalVat;
            updatedInvoicesTotal = updatedInvoicesTotal + invoice?.total;
        });

        setLifetimeBilling(updatedLifetimeBilling);
        setYearBilling(updatedYearBilling);
        setInvoicesAirtime(updatedInvoicesAirtime);
        setInvoicesOffairs(updatedInvoicesOffairs);
        setInvoicesCommission(updatedInvoicesCommission);
        setInvoicesVat(updatedInvoicesVat);
        setInvoicesTotal(updatedInvoicesTotal);

        forwardScheduleData.forEach((fs, i) => {
            updatedTotalScheduled = updatedTotalScheduled + fs?.total;
            updatedScheduledAirtime =
                updatedScheduledAirtime + fs?.airtimeValue;
            updatedScheduledOffairs = updatedScheduledOffairs + fs?.offAirValue;
            updatedScheduledCommission =
                updatedScheduledCommission + fs?.comission;
            updatedScheduledVat = updatedScheduledVat + fs?.totalVat;
            updatedScheduledTotal = updatedScheduledTotal + fs?.total;
        });
        setScheduledAirtime(updatedScheduledAirtime);
        setScheduledOffairs(updatedScheduledOffairs);
        setScheduledCommission(updatedScheduledCommission);
        setScheduledVat(updatedScheduledVat);
        setScheduledTotal(updatedScheduledTotal);
        setTotalScheduled(updatedTotalScheduled);
    }, [invoiceHeaderData?.length]);

    return (
        <div style={{ backgroundColor: '#F0F0F0', width: 1575 }}>
            <BillingOverview
                account={account}
                readOnly={readOnly}
                onSearchUpdate={onSearchUpdate}
                lifetimeBilling={lifetimeBilling}
                yearBilling={yearBilling}
                totalScheduled={totalScheduled}
            />
            <Spacer height={19} width={0} />
            <BillingInvoicesIssued
                accountName={account?.accountName}
                tableData={invoiceHeaderData}
                showInvoices={showInvoices}
                showCreditNotes={showCreditNotes}
                toggleShowInvoices={toggleShowInvoices}
                toggleShowCreditNotes={toggleShowCreditNotes}
                invoicesAirtime={invoicesAirtime}
                invoicesOffairs={invoicesOffairs}
                invoicesCommission={invoicesCommission}
                invoicesVat={invoicesVat}
                invoicesTotal={invoicesTotal}
            />
            <Spacer height={11} width={0} />
            <BillingForwardSchedule
                tableData={forwardScheduleData}
                scheduledAirtime={scheduledAirtime}
                scheduledOffairs={scheduledOffairs}
                scheduledCommission={scheduledCommission}
                scheduledVat={scheduledVat}
                updateOrderNumber={updateOrderNumber}
                scheduledTotal={scheduledTotal}
                setScheduledAirtime={setScheduledAirtime}
                setScheduledOffairs={setScheduledOffairs}
                setScheduledCommission={setScheduledCommission}
                setScheduledVat={setScheduledVat}
                setScheduledTotal={setScheduledTotal}
            />
        </div>
    );
};

export default AccountBilling;
