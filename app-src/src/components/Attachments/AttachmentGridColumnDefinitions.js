const AttachmentGridColumnDefinitions = [
    {
        displayOrder: 1,
        headerName: '',
        field: 'id',
        type: 'hidden',
        hideInColumnFilter: true
    },
    {
        displayOrder: 2,
        headerName: 'Actions',
        field: 'edit',
        width: 100,
        type: 'action',
        hideInColumnFilter: true,
        showInList: true,
        sortable: false,
        style: {
            boxSizing: 'border-box'
        }
    },
    {
        displayOrder: 3,
        headerName: '',
        field: 'delete',
        type: 'action',
        hideInColumnFilter: true,
        showInList: true,
        sortable: false,
        style: {
            boxSizing: 'border-box'
        }
    },

    {
        displayOrder: 4,
        headerName: 'Name',
        field: 'name',
        type: 'text',
        hideInColumnFilter: true,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 5,
        headerName: 'Description',
        field: 'description',
        type: 'text',
        hideInColumnFilter: true,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 6,
        headerName: 'Created Date',
        field: 'dateCreated',
        type: 'date',
        width: '200',
        hideInColumnFilter: true,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 7,
        headerName: 'Type',
        field: 'shortType',
        type: 'text',
        width: '200',
        hideInColumnFilter: true,
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 8,
        headerName: 'Attachment Owner',
        field: 'attachmentOwner',
        type: 'text',
        width: '85',
        hideInColumnFilter: true,
        showInList: true,
        sortable: true,
        sortOrder: ''
    }
];

export default AttachmentGridColumnDefinitions;
