import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AccountDetails from '../../components/AccountDetails';
import DetailPageContainer from '../../components/containers/DetailPageContainer';
import { CreateAccount, GetAccountStaticData } from '../../services/AccountDataService';
import useSessionReducer from '../../hooks/useSessionReducer';
import useRecordState from '../../hooks/useRecordState';

const AccountCreatePage = () => {
    const history = useHistory();
    const location = useLocation();
    // states
    const [accountTypesDetails, setAccountTypesDetails] = useState([]);
    const [errorAccountTypeInputStatus, setErrorAccountTypeInputStatus] = useState('');
    const [creditStatuses, setCreditStatuses] = useState([]);
    const [creditTypes, setCreditTypes] = useState([]);
    const [paymentTerms, setPaymentTerms] = useState([]);
    const [accountStatuses, setAccountStatuses] = useState([]);
    const { dataIsModified, resetDataModified, routePath } = useRecordState();
    const reducer = (state, updatedValues) => ({ ...state, ...updatedValues });
    const [account, accountDispatcher, delAccount] = useSessionReducer('accountCreate', reducer, {
        laydownsWithInvoice: false,
        multipleCampaignsOneInvoice: true,
        awaitingInit: true,
        revenueCommissionRate: 4,
        requiredCreditLimit: 0
    });

    useEffect(() => {
        return () => {
            if (history.location.pathname !== '/search') {
                delAccount();
            }
        };
    }, []);

    useEffect(() => {
        GetAccountStaticData()
            .then((data) => {
                setAccountTypesDetails(data.accountTypes);
                setCreditStatuses(data.creditStatuses);
                setCreditTypes(data.creditTypes);
                setPaymentTerms(data.paymentTerms);
                setAccountStatuses(data.accountStatuses);
            })
            .catch(console.log);
    }, []);

    // handlers
    const updateAccount = (name, value) => {
        if (account[name] != value) {
            accountDispatcher({ [name]: value });
            if (!account.currentBalance) {
                accountDispatcher({ currentBalance: 0 });
            }
            dataIsModified();
        }
    };

    const handleAccountChange = (event) => {
        let { name, value } = event.target;
        if (name === 'revenueCommissionRate' && value < 0) {
            value = 0;
        }
        if (name === 'revenueCommissionRate' && value > 100) {
            value = 100;
        }

        if (name === 'commissionRate' && value < 0) {
            value = 0;
        }

        if (name === 'commissionRate' && value > 100) {
            value = 100;
        }

        if (!name) throw new Error('name attribute not defined');
        updateAccount(name, value);

        if (name === 'accountTypeId') {
            const accountType = location?.state?.accountTypes.find((x) => x.id === value);
            if (accountType) {
                updateAccount('commissionRate', accountType.commission);
            }
            setErrorAccountTypeInputStatus('');
        }

        // set 0 Days to Payment Terms if creditStatus is reject or crediType is PrePay
        if (name === 'creditStatusId' || name === 'creditTypeId') {
            const rejectCreditStatuse = creditStatuses.find((x) => x.shortRef === 'R');
            const prepayCreditType = creditTypes.find((x) => x.shortRef === 'PRP');
            const paymentTerm = paymentTerms.find((x) => x.shortRef === '0DS');
            if (rejectCreditStatuse || prepayCreditType) {
                if (value === rejectCreditStatuse.id || value === prepayCreditType.id) {
                    updateAccount('paymentTermId', paymentTerm.id);
                }
            }
        }

        // set Expired to creditStatus if Account Status is Dormant
        if (name === 'accountStatusId') {
            const dormantAccountStatus = accountStatuses.find((x) => x.shortRef === 'DOR');
            const expiredCreditStatus = creditStatuses.find((x) => x.shortRef === 'EX');
            const defaultCreditStatus = creditStatuses.find((x) => x?.isDefault);

            if (dormantAccountStatus || expiredCreditStatus) {
                if (value === dormantAccountStatus.id) {
                    updateAccount('creditStatusId', expiredCreditStatus.id);
                } else {
                    updateAccount('creditStatusId', defaultCreditStatus.id);
                }
            }
        }

        // set credittype based onc CreditStatus
        if (name === 'creditStatusId') {
            const rejectCreditStatuse = creditStatuses.find((x) => x.shortRef === 'R');
            const prepayCreditType = creditTypes.find((x) => x.shortRef === 'PRP');

            const approvedCreditStatus = creditStatuses.find((x) => x.shortRef === 'A');
            const onAccountCreditType = creditTypes.find((x) => x.shortRef === 'CRA');

            if (value === rejectCreditStatuse.id) {
                updateAccount('creditTypeId', prepayCreditType.id);
            }
            if (value === approvedCreditStatus.id) {
                updateAccount('creditTypeId', onAccountCreditType.id);
            }
        }
    };

    // event object not passed from svg onclick, so update account manually
    const handleAccountChangeByName = (name, value) => {
        updateAccount(name, value);
    };

    const handleClose = () => {
        delAccount();
        resetDataModified();
        history.push(routePath ?? '/accounts');
    };

    const handleCreate = () => {
        CreateAccount({
            ...account,
            accountStatusId: account.accountStatusId === '-1' ? window.emptyGuid : account.accountStatusId,
            paymentTermId: account.paymentTermId === '-1' ? window.emptyGuid : account.paymentTermId,
            industryId: account.industryId === '-1' ? window.emptyGuid : account.industryId,
            accountTypeId: account.accountTypeId === '-1' ? window.emptyGuid : account.accountTypeId,
            ratingId: account.ratingId === '-1' ? window.emptyGuid : account.ratingId,
            creditStatusId: account.creditStatusId === '-1' ? window.emptyGuid : account.creditStatusId,
            creditTypeId: account.creditTypeId === '-1' ? window.emptyGuid : account.creditTypeId,
            vatId: account.vatId === '-1' ? window.emptyGuid : account.vatId,
            currencyId: account.currencyId === '-1' ? window.emptyGuid : account.currencyId
        })
            .then((entity) => {
                delAccount();
                resetDataModified();
                history.push(
                    routePath ?? {
                        pathname: '/accounts/details',
                        state: {
                            accountId: entity.id,
                            readOnly: false,
                            accountTypes: location?.state?.accountTypes
                        }
                    }
                );
            })
            .catch(console.log);
    };

    return (
        <DetailPageContainer title={window.translate('New Account')} onClose={handleClose} isCreating={true}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <AccountDetails
                    account={account}
                    creating
                    onChange={handleAccountChange}
                    onChangeByName={handleAccountChangeByName}
                    onCancel={handleClose}
                    onCreate={handleCreate}
                    returnPath='/accounts/create'
                    accountTypes={accountTypesDetails}
                    accountDispatcher={accountDispatcher}
                    errorAccountTypeInputStatus={errorAccountTypeInputStatus}
                    setErrorAccountTypeInputStatus={setErrorAccountTypeInputStatus}
                />
            </div>
        </DetailPageContainer>
    );
};

export default AccountCreatePage;
