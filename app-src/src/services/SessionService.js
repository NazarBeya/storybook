/* eslint-disable no-undef */

export const sessionClearAllDetailsFor = (entityType) => {
    switch (entityType) {
        case 0:
        case 'account':
            sessionStorage.removeItem('currentAccount');
            sessionStorage.removeItem('currentAccountReadOnly');
            sessionStorage.removeItem('accountsDetailsTab');
            break;

        case 1:
        case 'contact':
            sessionStorage.removeItem('currentContact');
            sessionStorage.removeItem('currentContactReadOnly');
            sessionStorage.removeItem('contactsDetailsTab');
            break;

        case 2:
        case 'lead':
            sessionStorage.removeItem('currentLead');
            sessionStorage.removeItem('currentLeadReadOnly');
            sessionStorage.removeItem('leadsDetailsTab');
            break;

        case 3:
        case 'campaign':
            sessionStorage.removeItem('currentCampaign');
            sessionStorage.removeItem('currentCampaignReadOnly');
            break;
    }
};

export const sessionClearAllDetailsExcept = (entityType) => {
    switch (entityType) {
        case 0:
        case 'account':
            sessionClearAllDetailsFor(1);
            sessionClearAllDetailsFor(2);
            sessionClearAllDetailsFor(3);
            break;

        case 1:
        case 'contact':
            sessionClearAllDetailsFor(0);
            sessionClearAllDetailsFor(2);
            sessionClearAllDetailsFor(3);
            break;

        case 2:
        case 'lead':
            sessionClearAllDetailsFor(0);
            sessionClearAllDetailsFor(1);
            sessionClearAllDetailsFor(3);
            break;

        case 3:
        case 'campaign':
            sessionClearAllDetailsFor(0);
            sessionClearAllDetailsFor(1);
            break;
    }
};
