Prints = new orion.collection('prints', {
  singularName: 'Impresora',
  pluralName: 'Impresoras',
  title: 'Impresoras',
  parentPath: '/admin',
  link: {
    title: 'Impresoras',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Impresoras',
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light blue'
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Impresoras',
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light red'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Impresoras',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: { modifier: { page: 'current' } }
      }
    ],
    columns: [
      { data: "printName", title: "Nombre de la Impresora" },
      { data: 'estatus', title: 'Estatus' },
      { data: 'trabajos', title: 'Trabajo' },
      { data: 'color', title: 'Color' },
      { data: 'folio', title: 'Folio' },
      {data:'createdBy',title:'Creado por'},
      {data:'createdAt',title:'Creado en'},
      {data:'updatedBy',title:'Actualizado por'},
      {data:'updatedAt',title:'Actualizado en '}
    ],
    stateSave: false
  }
});

Prints.attachSchema(new SimpleSchema({
  printName: { type: String, label:'Nombre de la Impresora', optional: true },
  estatus: { type: String, label:'Estatus', optional: true },
  trabajos: { type: Number, label:'Trabajo', optional: true },
  color: { type: String, label:'Color', optional: true },
  folio: { type: String, label:'Folio', optional: true },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));
