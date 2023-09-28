import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import DetailPageContainer from '../../components/containers/DetailPageContainer';
import ContactsDetails from '../../components/ContactsDetails';
import {
    CreateContact,
    ContactsLookup
} from '../../services/ContactsDataService';
import { AccountsLookup } from '../../services/AccountDataService';
import useSessionReducer from '../../hooks/useSessionReducer';
import useRecordState from '../../hooks/useRecordState';

const ContactsCreatePage = () => {
    const history = useHistory();
    const location = useLocation();

    const { dataIsModified, resetDataModified, routePath } = useRecordState();
    const reducer = (state, updatedValues) => ({ ...state, ...updatedValues });
    const [contactDto, contactDispatcher, delContact] = useSessionReducer(
        'contactCreate',
        reducer,
        {
            returnPath: location?.state?.path || '/contacts',
            ...(location?.state?.account?.id
                ? { accountId: location.state.account.id }
                : {}),
            ...(location?.state?.account?.accountName
                ? { accountName: location.state.account.accountName }
                : {})
        }
    );

    useEffect(() => {
        return () => {
            if (history.location.pathname !== '/search') {
                delContact();
            }
        };

        // var contact = { ...contactDto };
        // for (var key in contact) {
        //     if (contact.hasOwnProperty(key)) {
        //         switch (key) {
        //             case 'isFavourite':
        //                 break;
        //             case 'accountId':
        //                 if (location?.state?.account?.id)
        //                     contact.accountId = location.state.account.id;
        //                 break;
        //             case 'accountName':
        //                 if (location?.state?.account?.accountName)
        //                     contact.accountName =
        //                         location.state.account.accountName;
        //                 break;
        //             case 'reportsToId':
        //                 break;
        //             case 'reportsToName':
        //                 break;
        //             default:
        //                 contact[key] = '';
        //                 break;
        //         }
        //     }
        // }
        // contactDispatcher(contact);
    }, []);

    const handleFormUpdate = (key, value) => {
        if (contactDto[key] != value) {
            contactDispatcher({ [key]: value });
            dataIsModified();
        }
    };

    const handleFormMerge = (obj) => {
        contactDispatcher({ ...obj });
    };

    const handleCloseConfirm = () => {
        delContact();
        resetDataModified();
        if (routePath) {
            history.push(routePath);
        } else {
            location?.onClose
                ? location.onClose()
                : history.push(contactDto.returnPath);
        }
    };

    const handleCreateConfirm = async () => {
        const response = await CreateContact({
            ...contactDto,
            salutationId: contactDto.salutationId === '-1' ? window.emptyGuid : contactDto.salutationId
        });
        // It's assumed the only success status we should see for Create is 201, this may need changing
        if (response?.status === 201) {
            delContact();
            resetDataModified();
            if (routePath) {
                history.push(routePath);
            } else {
                location?.onClose
                    ? location.onClose()
                    : history.push({
                          pathname: '/contacts/details',
                          state: {
                              contactId: response.data.id,
                              readOnly: false
                          }
                      });
            }
        }
    };

    return (
        <DetailPageContainer
            title={window.translate('New Contact')}
            onClose={handleCloseConfirm}
            isCreating={true}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <ContactsDetails
                    contact={contactDto}
                    onContactUpdate={handleFormUpdate}
                    creating
                    onContactMerge={handleFormMerge}
                    accountSearchFunction={AccountsLookup}
                    contactSearchFunction={ContactsLookup}
                    onCreate={handleCreateConfirm}
                    onCancel={handleCloseConfirm}
                    submitTitle='Create'
                    returnPath='/contacts/create'
                    preDisabledFields={{
                        accountName:
                            contactDto.returnPath === '/accounts/details'
                    }}
                />
            </div>
        </DetailPageContainer>
    );
};

export default ContactsCreatePage;
