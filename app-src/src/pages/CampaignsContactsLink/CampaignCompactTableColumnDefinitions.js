const CampaignCompactTableColumnDefinitions = [
    {
        displayOrder: 1,
        headerName: '',
        field: 'id',
        type: 'hidden'
    },
    {
        displayOrder: 2,
        headerName: 'Campaign Name',
        field: 'name',
        type: 'text',
        width: 'auto',
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 3,
        headerName: 'Account Name',
        field: 'accountName',
        type: 'text',
        width: 'auto',
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 3,
        headerName: 'Status',
        field: 'statusName',
        type: 'text',
        width: 'auto',
        sortable: true,
        sortOrder: ''
    }
];

export default CampaignCompactTableColumnDefinitions;
