export const CampaignsGridColumnDefinitions = () => {
    const style = {
        height: 34,
        whiteSpace: 'nowrap'
    };

    return [
        {
            displayOrder: 1,
            headerName: '',
            field: 'id',
            type: 'hidden',
            hideInColumnFilter: true
        },
        {
            displayOrder: 3,
            headerName: window.translate ? window.translate('Actions') : '',
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
            field: 'copy',
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
            displayOrder: 6,
            headerName: '',
            field: 'isFavourite',
            type: 'favourite',
            width: 50,
            hideInColumnFilter: true,
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            isSticky: true,
            style
        },
        {
            displayOrder: 7,
            headerName: window.translate ? window.translate('Campaign Name') : '',
            field: 'name',
            type: 'text',
            width: 'auto',
            hideInColumnFilter: true,
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        },
        {
            displayOrder: 8,
            headerName: window.translate ? window.translate('Description') : '',
            field: 'description',
            type: 'text',
            width: 'auto',
            showInList: false,
            sortable: true,
            sortOrder: '',
            style
        },
        {
            displayOrder: 9,
            headerName: window.translate ? window.translate('Campaign Type') : '',
            field: 'campaignTypeName',
            type: 'text',
            width: 190,
            showInList: false,
            sortable: true,
            sortOrder: '',
            style
        },
        {
            displayOrder: 10,
            headerName: window.translate ? window.translate('Version') : '',
            field: 'versionName',
            type: 'text',
            width: 'auto',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        },
        {
            displayOrder: 11,
            headerName: window.translate ? window.translate('Campaign Owner') : '',
            field: 'campaignOwnerName',
            type: 'text',
            width: 'auto',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        },
        {
            displayOrder: 12,
            headerName: window.translate('Advertiser'),
            field: 'advertiserAccountName',
            type: 'text',
            width: 'auto',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        },
        {
            displayOrder: 13,
            headerName: window.translate('Agency'),
            field: 'agencyAccountName',
            type: 'text',
            width: 'auto',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        },
        {
            displayOrder: 14,
            headerName: window.translate('Start Date'),
            field: 'startDate',
            width: 115,
            type: 'date',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        },
        {
            displayOrder: 15,
            headerName: window.translate('End Date'),
            field: 'endDate',
            width: 115,
            type: 'date',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        },
        {
            displayOrder: 16,
            headerName: window.translate('Budget'),
            field: 'budget',
            type: 'currency',
            width: 'auto',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        },

        {
            displayOrder: 17,
            headerName: window.translate('Spend'),
            field: 'spend',
            type: 'currency',
            width: 'auto',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        },
        {
            displayOrder: 18,
            headerName: window.translate('Status'),
            field: 'campaignStatusName',
            type: 'text',
            width: 'auto',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            isStatus: true,
            style
        },
        {
            displayOrder: 19,
            headerName: window.translate('Revenue Type'),
            field: 'revenueType',
            type: 'text',
            width: 'auto',
            showInList: true,
            sortable: true,
            sortOrder: 'asc',
            style
        }
    ];
};

export const apiParamDefaults = {
    sortField: 'name',
    sortOrder: 'asc',
    pageNumber: 1,
    pageSize: 15,
    favouritesOnly: false,
    myCampaigns: false
};

export const gridItem = {
    textAlign: 'center',
    padding: 0
};
