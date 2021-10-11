Tickets = new orion.collection('tickets', {
  singularName: 'Tickets',
  pluralName: 'Tickets',
  title: 'Tickets',
  help:'Tickets impresos para el consumo de alimentos',
  ShowFilter:true,
  parentPath: '/admin',
  link: {
    title: 'Tickets',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    pub:'TabularTickets',
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
    selector:SelectorArrayCompany,
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Tickets',
        "className": 'btn-floating waves-effect waves-light blue',
          enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Tickets"),
        "className": 'btn-floating waves-effect waves-light red',
          enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:creaTitulosDeArchivos("Tickets"),
        "className": 'btn-floating waves-effect waves-light orange',
          enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    columns: [
      { data: "idEmployee", title: "ID" },
      { data: 'employeeName', title: 'NOMBRE' },
      { data: 'fecha', title: 'FECHA' },
      { data: 'registro', title: 'HORA' },
      { data: 'folio', title: 'FOLIO' },
      { data: 'restaurantName', title: 'NOMBRE DEL RESTAURANTE' }
    ],
    stateSave: false
  }
});

Tickets.attachSchema(new SimpleSchema({
  _idEmployee: { type: String, label:'_Id del Colaborador', optional: true },
  idEmployee: { type: Number, label:'Id', optional: true },
  employeeName: { type: String, label:'Nombre del Colaborador', optional: true },
  idcompany: { type: [String], label:'Compañia del Colaborador', optional: true },
  fecha: { type: String, label:'Fecha', optional: true },
  registro: { type: String, label:'Hora', optional: true },
  folio: { type: Number, label:'Folio', optional: true },
  _idRestaurant: { type: String, label:'_id Restaurante', optional: true },
  restaurantName: { type: String, label:'Nombre del Restaurante', optional: true },
  createdAt: { type: Date, label:'Folio', optional: true },
}));


Print_ticket = new orion.collection('print_ticket', {
  singularName: 'Print_ticket',
  pluralName: 'Print_ticket',
  title: 'Print_ticket',
  parentPath: '/admin',
  link: {
    title: 'Print_ticket',
    parent: '_template'
  }
});

Print_ticket.attachSchema(new SimpleSchema({
  idEmployee: { type: String, label:'Id del Colaborador', optional: true },
  employeeName: { type: String, label:'Nombre del Colaborador', optional: true },
  idCompany: { type: [String], label:'Compania del Colaborador', optional: true },
  active: { type: Boolean, label:'Estatus', optional: true },
  date: { type: Date, label:'Fecha', optional: true }
}));

Reports_emp = new orion.collection('reports_emp', {
  singularName: 'Reportes por Colaborador',
  pluralName: 'Reportes por Colaborador',
  title: 'Reportes por Colaborador',
  help:'Registros de asistencia por Colaborador',
  parentPath: '/admin',
  link: { title: 'Reports_emp', parent: '_template' }
});

Reports_emp.attachSchema(new SimpleSchema({
  active: { type: Boolean, label:'Estatus', optional: true }
}));
