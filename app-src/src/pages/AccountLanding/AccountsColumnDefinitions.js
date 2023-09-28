const initialColumnDefinitions = () => {
    const style = {
        height: 34
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
            headerName: 'Account Name',
            field: 'accountName',
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
            headerName: 'Account Number',
            field: 'referenceNumber',
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
            displayOrder: 8,
            headerName: 'Account Type',
            field: 'accountType',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 9,
            headerName: 'City',
            field: 'siteCity',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 10,
            headerName: 'Account Status',
            field: 'accountStatus',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 11,
            headerName: 'Parent Account',
            field: 'parentAccount',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 12,
            headerName: 'Account Owner',
            field: 'accountOwnerName',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 13,
            headerName: 'Account Rating',
            field: 'accountRating',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 14,
            headerName: 'Industry',
            field: 'industry',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 15,
            headerName: 'Sentiment',
            field: 'sentiment',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 16,
            headerName: 'Segmentation',
            field: 'segmentation',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 17,
            headerName: 'Credit Status',
            field: 'creditStatus',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 18,
            headerName: 'Committed Spend',
            field: 'committedSpend',
            type: 'number',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            showInList: false,
            sortable: true,
            sortOrder: ''
        }
    ];
};

export default initialColumnDefinitions;
