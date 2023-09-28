const LinkedContactsTableColumnDefinitions = [
    {
        displayOrder: 1,
        headerName: '',
        field: 'id',
        type: 'hidden'
    },
    {
        displayOrder: 2,
        headerName: 'Contact Name',
        field: 'name',
        type: 'text',
        width: 'auto',
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 3,
        headerName: 'Email Address',
        field: 'emailWork',
        type: 'text',
        width: 'auto',
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 4,
        headerName: 'Job Title',
        field: 'jobTitle',
        type: 'text',
        width: 'auto',
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 5,
        headerName: 'Account Name',
        field: 'accountName',
        type: 'text',
        width: 'auto',
        sortable: true,
        sortOrder: ''
    }
];

export default LinkedContactsTableColumnDefinitions;
