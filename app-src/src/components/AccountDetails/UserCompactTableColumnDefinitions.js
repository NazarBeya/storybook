const UserCompactTableColumnDefinitions = [
    {
        displayOrder: 1,
        headerName: '',
        field: 'id',
        type: 'hidden'
    },
    {
        displayOrder: 2,
        headerName: window.translate('User Name'),
        field: 'name',
        type: 'text',
        width: 'auto',
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 3,
        headerName: window.translate('Email Address'),
        field: 'emailWork',
        type: 'text',
        width: 'auto',
        sortable: true,
        sortOrder: ''
    }
];

export default UserCompactTableColumnDefinitions;
