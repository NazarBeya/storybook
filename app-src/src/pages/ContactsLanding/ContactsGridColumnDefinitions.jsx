import React from 'react';

const ContactsGridColumnDefinitions = () => {
    const style = {
        height: 34
    };
    const SetIsBillingContactValue = ({ data }) => {
        return <>{data.isBillingContact === true ? `${window.translate('Yes')}` : `${window.translate('No')}`}</>;
    };

    return [
        {
            displayOrder: 1,
            headerName: '',
            field: 'id',
            type: 'hidden',
            hideInColumnFilter: true,
            isSticky: true
        },
        {
            displayOrder: 3,
            headerName: 'Actions',
            field: 'edit',
            type: 'action',
            width: 50,
            hideInColumnFilter: true,
            showInList: true,
            sortable: false,
            isSticky: true,
            style
        },
        {
            displayOrder: 4,
            headerName: '',
            field: 'delete',
            type: 'action',
            width: 50,
            hideInColumnFilter: true,
            showInList: true,
            sortable: false,
            isSticky: true,
            style
        },
        {
            displayOrder: 5,
            headerName: '',
            field: 'favourite',
            type: 'favourite',
            width: 50,
            hideInColumnFilter: true,
            showInList: true,
            sortable: true,
            sortOrder: '',
            isSticky: true,
            style
        },
        {
            displayOrder: 6,
            headerName: 'Contact Name',
            field: 'fullName',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: true,
            showInList: true,
            sortable: true,
            sortOrder: '',
            isSticky: true
        },
        {
            displayOrder: 7,
            headerName: 'Job Title',
            field: 'jobTitle',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 8,
            headerName: 'Account Name',
            field: 'accountName',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 9,
            headerName: 'Email - Work',
            field: 'emailWork',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 10,
            headerName: 'Landline',
            field: 'telephoneNumber',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 11,
            headerName: 'Mobile',
            field: 'mobileNumber',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 12,
            headerName: 'Billing Contact',
            field: 'isBillingContact',
            type: 'custom',
            customType: 'component',
            component: <SetIsBillingContactValue />,
            hideInColumnFilter: true,
            showInList: true,
            sortable: true,
            isSticky: true,
            style: {
                ...style,
                width: 150
            }
        },
        {
            displayOrder: 13,
            headerName: 'City',
            field: 'city',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 14,
            headerName: 'Reports To',
            field: 'reportsToName',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 15,
            headerName: 'Email - Other',
            field: 'emailOther',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 16,
            headerName: 'LinkedIn',
            field: 'emailLinkedIn',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 17,
            headerName: 'Facebook',
            field: 'emailFacebook',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 18,
            headerName: 'Twitter',
            field: 'emailTwitter',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 19,
            headerName: 'Social Media - Other',
            field: 'emailOtherSocialMedia',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            sortable: true,
            sortOrder: ''
        }
    ];
};
export default ContactsGridColumnDefinitions;
