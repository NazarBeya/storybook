const LeadsGridColumnDefinitions = () => {
    const style = {
        height: 34
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
            displayOrder: 2,
            headerName: '',
            field: 'salutationId',
            type: 'hidden',
            hideInColumnFilter: true
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
            displayOrder: 7,
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
            displayOrder: 8,
            headerName: 'Company',
            field: 'company',
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
            headerName: 'Lead Status',
            field: 'leadStatusName',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            showInList: true,
            sortable: true,
            sortOrder: '',
            isStatus: true
        },
        {
            displayOrder: 10,
            headerName: 'Source',
            field: 'leadSourceName',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 11,
            headerName: 'Created Date',
            field: 'dateCreated',
            type: 'date',
            width: 'auto',
            style: { ...style, minWidth: 120 },
            hideInColumnFilter: false,
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 12,
            headerName: 'Lead Owner',
            field: 'leadOwnerName',
            type: 'text',
            width: 'auto',
            style: { ...style, minWidth: 150 },
            hideInColumnFilter: false,
            showInList: true,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 13,
            headerName: 'Landline',
            field: 'telephoneNumber',
            type: 'text',
            hideInColumnFilter: true
        },
        {
            displayOrder: 14,
            headerName: 'Mobile',
            field: 'mobileNumber',
            type: 'text',
            hideInColumnFilter: true
        },
        {
            displayOrder: 15,
            headerName: 'Job Title',
            field: 'title',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 16,
            headerName: 'Email - Work',
            field: 'emailWork',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 17,
            headerName: ' Email - Other',
            field: 'emailOther',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 18,
            headerName: '',
            field: 'ratingId',
            type: 'hidden',
            hideInColumnFilter: true
        },
        {
            displayOrder: 19,
            headerName: '',
            field: 'industryId',
            type: 'hidden',
            hideInColumnFilter: true
        },
        {
            displayOrder: 20,
            headerName: 'Address Line 1',
            field: 'addressLine1',
            type: 'text',
            hideInColumnFilter: true
        },
        {
            displayOrder: 21,
            headerName: 'Address Line 2',
            field: 'addressLine2',
            type: 'text',
            hideInColumnFilter: true
        },
        {
            displayOrder: 22,
            headerName: 'City',
            field: 'city',
            type: 'text',
            hideInColumnFilter: true
        },
        {
            displayOrder: 23,
            headerName: 'County / State',
            field: 'county',
            type: 'text',
            hideInColumnFilter: true
        },
        {
            displayOrder: 24,
            headerName: 'Postcode',
            field: 'postcode',
            type: 'text',
            hideInColumnFilter: true
        },
        {
            displayOrder: 25,
            headerName: 'Country',
            field: 'country',
            type: 'text',
            hideInColumnFilter: true
        },
        {
            displayOrder: 26,
            headerName: '',
            field: 'referenceId',
            type: 'hidden',
            hideInColumnFilter: true
        },
        {
            displayOrder: 27,
            headerName: '',
            field: 'lastViewed',
            type: 'hidden',
            hideInColumnFilter: true
        },
        {
            displayOrder: 28,
            headerName: 'LinkedIn',
            field: 'socialMediaLinkedIn',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 29,
            headerName: 'Facebook',
            field: 'socialMediaFacebook',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 30,
            headerName: 'Twitter',
            field: 'socialMediaTwitter',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 31,
            headerName: 'Other',
            field: 'socialMediaOther',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 32,
            headerName: 'Industry',
            field: 'industryName',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 33,
            headerName: 'Rating',
            field: 'ratingName',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        },
        {
            displayOrder: 34,
            headerName: 'Lead Type',
            field: 'leadTypeName',
            style: { ...style, minWidth: 150 },
            type: 'text',
            hideInColumnFilter: false,
            showInList: false,
            sortable: true,
            sortOrder: ''
        }
    ];
};

export default LeadsGridColumnDefinitions;
