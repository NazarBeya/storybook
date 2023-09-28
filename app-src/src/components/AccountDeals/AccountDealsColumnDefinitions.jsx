const initialColumnDefinitions = [
    {
        displayOrder: 1,
        headerName: '',
        field: 'versionId',
        type: 'hidden',
        hideInColumnFilter: true
    },
    {
        displayOrder: 2,
        headerName: '',
        field: 'dealId',
        type: 'hidden',
        hideInColumnFilter: true
    },
    {
        displayOrder: 3,
        headerName: '',
        field: 'favourite',
        type: 'favourite',
        width: 50,
        hideInColumnFilter: true,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 4,
        headerName: 'Deal Name',
        field: 'dealName',
        type: 'text',
        width: 200, //'auto',
        hideInColumnFilter: true,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 5,
        headerName: 'Reference Number',
        field: 'dealReferenceNumber',
        type: 'number',
        width: 100,
        showInList: false,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 6,
        headerName: 'Deal Version',
        field: 'versionNumber',
        type: 'text',
        width: 100,
        hideInColumnFilter: true,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 7,
        headerName: 'Description',
        field: 'description',
        type: 'text',
        width: 200,
        hideInColumnFilter: true,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 8,
        headerName: 'Account',
        field: 'account',
        type: 'text',
        width: 100,
        showInList: false,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 9,
        headerName: 'Account Type',
        field: 'accountType',
        type: 'text',
        width: 100,
        showInList: false,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 10,
        headerName: 'Start Date',
        field: 'startDate',
        type: 'date',
        width: 100,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 11,
        headerName: 'End Date',
        field: 'endDate',
        type: 'date',
        width: 100,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 12,
        headerName: 'Stations',
        field: 'stations',
        type: 'number',
        width: 70,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 13,
        headerName: 'Status',
        field: 'status',
        type: 'text',
        width: 100,
        showInList: true,
        sortable: true,
        sortOrder: ''
    }
];

export default initialColumnDefinitions;
