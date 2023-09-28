const CategoryCompactTableColumnDefinitions = [
  {
      displayOrder: 1,
      headerName: '',
      field: 'id',
      type: 'hidden'
  },
  {
      displayOrder: 2,
      headerName: window.translate('Category Name'),
      field: 'name',
      type: 'text',
      width: 'auto',
      sortable: true,
      sortOrder: ''
  },
  {
      displayOrder: 3,
      headerName: window.translate('Reference'),
      field: 'shortRef',
      type: 'text',
      width: 'auto',
      sortable: true,
      sortOrder: ''
  }
];

export default CategoryCompactTableColumnDefinitions;
