import React from 'react';
import ChangedByCell from './ChangedByCell';

const AccountHistoryTableColumnDefinitions = [
    {
        displayOrder: 1,
        headerName: '',
        field: 'id',
        type: 'hidden',
        hideInColumnFilter: true
    },
    {
        displayOrder: 3,
        headerName: 'Field Name',
        field: 'fieldName',
        type: 'text',
        width: 'auto',
        showInList: true,
        sortable: true,
        sortOrder: ''
    },
    {
        displayOrder: 4,
        headerName: 'New Value',
        field: 'newValue',
        type: 'text',
        width: 'auto',
        showInList: true,
        sortable: false,
        sortOrder: ''
    },
    {
        displayOrder: 5,
        headerName: 'Old Value',
        field: 'oldValue',
        type: 'text',
        width: 'auto',
        showInList: true,
        sortable: false,
        sortOrder: ''
    },
    {
        displayOrder: 5,
        headerName: 'Changed By',
        field: 'changedBy',
        type: 'custom',
        customType: 'component',
        component: <ChangedByCell fieldName={'changedBy'} />,
        width: 'auto',
        showInList: true,
        sortable: false,
        sortOrder: ''
    },
    {
        displayOrder: 6,
        headerName: 'Date & Time',
        field: 'dateTimeChanged',
        type: 'datetime',
        width: 'auto',
        showInList: true,
        sortable: true,
        sortOrder: 'desc'
    }
];

export default AccountHistoryTableColumnDefinitions;
