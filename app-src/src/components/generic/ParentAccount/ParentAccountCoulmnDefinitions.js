const ParentAccountCoulmnDefinitions = () => {
    const style = {
        height: 34
    };

    return [
        {
            displayOrder: 1,
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
        }
    ];
};

export default ParentAccountCoulmnDefinitions;
