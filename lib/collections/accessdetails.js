Accessdetails = new orion.collection('accessdetails', {
  singularName: 'Detalles de Acceso',
  pluralName: 'Detalles de Accesos',
  ShowFilter:true,
  title: 'Detalles de Accesos',
  help:'Datos que indican la hora y el lugar en que el colaborador se ha autenticado',
  parentPath: '/admin/principal',
  link: { title: 'Detalles de Accesos', parent: '_template' },
  tabular: {
    scrollX: true,
    "processing": true,
    //pub: 'TabularAccessdetails',
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
    selector:SelectorAccessDetails,
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Detalles de Accesos',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Detalles de Accesos',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Detalles de Accesos',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    //pub: 'TabularAccessdetails',
    order: [[4, "asc"]],
    columns: [
    {data: "idEmp",title: "Id"},
    {data: "employeeName",title: "Nombre del Colaborador"},
    {
      data: "idLocation_txt",
      title: "Localidad",
      searchable:false
    },
    {
      data: "idDevice",
      searchable:false,
      title: "ID dispositivo",
      render (val){
        if(val!="Mobile" && val!="Facial"){
          return "Dactilar";
        }else{
          return val;
        }
      }
    },
    {
      data: "accessDate",
      title: "Acceso",
      searchable:false,
      render: function(val) { var fec = time(val); return fec.fecha+" "+fec.hora; }
    },
    {
      data: "fpMatchResult",
      searchable:false,
      title: "Resultado del Match"
    },
    {
      data: "accessResult",
      searchable:false,
      title: "Resultado de Acceso"
    },
  ]
}
});

Accessdetails.attachSchema(new SimpleSchema({
  idAccessCtrl: {
    type: String,
    label: 'ID de control de acceso',
    optional: true
  },
  idEmployee: {
    type: String,
    label: 'Colaborador',
    optional: true
  },
  employeeName: {
    type: String,
    label: 'Nombre del Colaborador',
    optional: true
  },
  idEmp: {
    type: Number,
    label: 'Id del Colaborador',
    optional: true
  },
  idcompany: {
    type:  [String],
    label: 'Compañia del Colaborador',
    optional: true
  },
  idLocation: { type: String, label: 'Localidad', optional: true },
  idLocation_txt:{ type: String, label: 'Localidad', optional: true },
  idDevice: { type: String, label: 'ID de Dispositivo', optional: true },
  accessDate: {
    type: Date,
    label: 'Primer Acceso',
    optional: true,
    autoform: {
      hidden: true,
      type: "pickadate",
      pickadateOptions: {
        format: 'dd/mm/yyyy',
        selectMonths: true,
        selectYears: 100
      }
    },
  },
  fpMatchResult: {
    type: String,
    label: 'Meal Result'
  },
  empPhoto: orion.attribute('image', {
    optional: true,
    label: 'Fotografía'
  }),
  accessResult: {
    type: String,
    label: 'accessResult'
  },
  active: {
    type: Boolean,
    label: 'Activo',
    defaultValue: true
  },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', {
    optional: true
  }),
  updatedAt: orion.attribute('updatedAt', {
    optional: true
  }),
}));
