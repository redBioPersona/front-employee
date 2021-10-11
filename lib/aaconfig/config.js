Config_application = new orion.collection('config_application', {
  singularName: 'Configuración de la Aplicación',
  pluralName: 'Configuraciónes de la Aplicación',
  title: 'Configuración de la Aplicación',
  parentPath: '/admin/principal',
  help: 'Configuración Inicial de la Aplicación',
  link: { title: 'Configuración de la Aplicación', parent: '_template' },
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
        messageTop: 'Configuracion de la Aplicacion',
        "className": 'btn-floating waves-effect waves-light blue'
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:"Configuracion de la Aplicacion",
        "className": 'btn-floating waves-effect waves-light red'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:"Configuracion de la Aplicacion",
        "className": 'btn-floating waves-effect waves-light orange',
        exportOptions: { modifier: { page: 'current' } }
      }
    ],
    columns: [{
        data: "isServer",
        title: "¿Es Servidor?",
        render(val) {
          if (!val) {
            return "<img src='/images/denied.png' width='25lpx'>"
          } else {
            return "<img src='/images/check.png' width='25px'>"
          }
        }
      },
      {
        data: "license",
        title: "Estatus de la Licencia",
        render(val) {
          if (val == "error") {
            return "<img src='/images/denied.png' width='25lpx'>"
          } else {
            return "<img src='/images/check.png' width='25px'>"
          }
        }
      },
      {
        data: "enroll_docs",
        title: "Enrolamiento de Documentos",
        render(val) {
          if (!val) {
            return "<img src='/images/denied.png' width='25lpx'>"
          } else {
            return "<img src='/images/check.png' width='25px'>"
          }
        }
      },
      {
        data: "enroll_face",
        title: "Enrolamiento Facial",
        render(val) {
          if (!val) {
            return "<img src='/images/denied.png' width='25lpx'>"
          } else {
            return "<img src='/images/check.png' width='25px'>"
          }
        }
      },
      {
        data: "enroll_sign",
        title: "Enrolamiento de Firma",
        render(val) {
          if (!val) {
            return "<img src='/images/denied.png' width='25lpx'>"
          } else {
            return "<img src='/images/check.png' width='25px'>"
          }
        }
      },
      {
        data: "serversync",
        title: "Sincronizar con el servidor",
        render(val) {
          if (!val) {
            return "<img src='/images/denied.png' width='25lpx'>"
          } else {
            return "<img src='/images/check.png' width='25px'>"
          }
        }
      }
    ]
  }
});
/// SCHEMA legislarequisito:
Config_application.attachSchema(new SimpleSchema({
  isServer: { type: Boolean, label: 'La estación es Servidor', defaultValue: false},
  AccessWithFace: { type: Boolean, label: 'Ingresar con verificación facial', defaultValue: true},
  enroll_docs: { type: Boolean, label: 'Enrolamiento de Documentos', defaultValue: true},
  enroll_sign: { type: Boolean, label: 'Enrolamiento por Firma', defaultValue: true},
  enroll_face: { type: Boolean, label: 'Enrolamiento Facial', defaultValue: true},
  showKeyboard: { type: Boolean, label: 'Activo', defaultValue: true},
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
  serversync: { type: Boolean, label: 'Sincronizar con el servidor', defaultValue: false},
  printTickets: { type: Boolean,optional: true, label: 'Imprime Tickets', defaultValue: false},
  motorBiometricOperations: { type: String, optional: true, label: 'Operaciones con el motor Biometrico', allowedValues: ['Online','Offline']},
  rutalogombes: { type: String,optional: true, label: 'Ruta logo MBES'},
  WebSocketFace: { type: String,optional: false, label: 'Ruta Server WebSocketFace'},
  WebSocketClientName: { type: String,optional: false, label: 'Nombre del Cliente WebSocket'},
  WebSocketFinger: { type: String,optional: false, label: 'Ruta Server WebSocketFinger'},
  rutaUser: { type: String,optional: true, label: 'Ruta Usuario'}
}));

LocationsReg = new orion.collection('locations_reg', {
  singularName: 'Localidad de registro',
  pluralName: 'Localidades de registro',
  title: 'Localidades de registro',
  parentPath: '/admin',
  CanAdd:true,
  help: 'Localidades de registro "Check"',
  link: { title: 'Localidades de registro', parent: '_template' },
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
        messageTop: 'Localidades de registro',
        "className": 'btn-floating waves-effect waves-light blue'
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: "Localidades de registro",
        "className": 'btn-floating waves-effect waves-light red'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:"Localidades de registro",
        "className": 'btn-floating waves-effect waves-light orange',
        exportOptions: { modifier: { page: 'current' } }
      }
    ],
    columns: [
      { data: "name", title: "Nombre" },
      { data: "desc", title: "Descripción" },
      {
      data:"active",
      title:"Activo",
      render(val) {
          if (val==false) {
              return "<img src='/images/denied.png' width='25lpx'>"
          } else {
            return "<img src='/images/check.png' width='25px'>"
          }
        }
      },
      orion.attributeColumn('createdBy', 'createdBy', "Inserto"),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedBy', 'updatedBy', "Actualizo"),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
    ]
  }
});

LocationsReg.attachSchema(new SimpleSchema({
  name: { type: String, label: "Nombre", optional: true },
  desc: { type: String, label: "Descripción", optional: true },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

Config_station = new orion.collection('config_station', {
  singularName: 'Configuración de la Estación',
  pluralName: 'Configuraciónes de la Estación',
  title: 'Configuración de la Estación',
  parentPath: '/admin/principal',
  help: 'Temporal',
  link: { title: 'Configuración de la Estación', parent: '_template' },
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
        messageTop: 'Configuracion de la Estacion',
        "className": 'btn-floating waves-effect waves-light blue'
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: "Configuracion de la Estacion",
        "className": 'btn-floating waves-effect waves-light red'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:"Configuracion de la Estacion",
        "className": 'btn-floating waves-effect waves-light orange',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    columns: [
      {
        data: "status",
        title: "Estatus Servicio",
        render(val) {
          if (!val) {
            return "<img src='/images/denied.png' width='25lpx'>"
          } else {
            return "<img src='/images/check.png' width='25px'>"
          }
        }
      },
      {
      data:"license",
      title:"Estatus de la Licencia",
      render(val) {
          if (val=="error") {
              return "<img src='/images/denied.png' width='25lpx'>"
          } else {
            return "<img src='/images/check.png' width='25px'>"
          }
        }
      },
      { data:"server_ip", title:"Ip del Servidor" },
      { data:"ip_license_finger", title:"Ip Servidor licencia Dactilar" } ,
      { data:"port_license_finger", title:"Puerto Servidor licencia Dactilar" },
      { data:"ip_license_face", title:"Ip Servidor licencia Facial" } ,
      { data:"port_license_face", title:"Puerto Servidor licencia Facial" },
      { data:"ip_port_socket", title:"Ip Servidor Socket"},
      { data:"port_socket", title:"Puerto Socket" },
      { data:"port_face_socket", title:"Puerto Facial Socket" },
      { data:"port_print_socket", title:"Puerto Impresion Socket" },
      { data:"time_show_data", title:"Segundos para Mostrar los datos del Colaborador"},
      { data:"ruta_qr", title:"QR"},
      { data:"width_resolution", title:"Ancho resolucion"},
      { data:"height_resolution", title:"Alto resolucion"},
      { data: "idLocation", title: "Localidad de la Estacion" }
    ]
  }
});
/// SCHEMA legislarequisito:
Config_station.attachSchema(new SimpleSchema({
  status: { type: String, label: "status", optional: true },
  status_device: { type: String, label: "status", optional: true },
  license: { type: String, label: "license", optional: true },
  devices_connected: { type: String, label: "license", optional: true },
  server_ip: { type: String, label: "Ip del Servidor", optional: true },
  server_port: { type: String, label: "Puerto del Servidor", optional: true },
  ip_license_finger: { type:String, label: "Ip del Servidor de licencia Dactilar",optional:true},
  port_license_finger: { type:String, label: "Puerto del Servidor de licencia Dactilar",optional:true},
  ip_license_face: { type:String, label: "Ip del Servidor de licencia Facial",optional:true},
  port_license_face: { type:String, label: "Puerto del Servidor de licencia Facial",optional:true},
  ip_port_socket: { type:String, label: "Ip del Servidor Socket",optional:false},
  port_socket: { type: Number, label: "Puerto Socket",optional:false},
  port_face_socket: { type: Number, label: "Puerto Facial Socket",optional:false},
  port_print_socket: { type: Number, label: "Puerto Impresion Socket",optional:false},
  ruta_qr: { type: String, label: "Ruta QR",optional:false},
  time_show_data:{ type: Number, label: "Segundos para Mostrar los datos del Colaborador"},
  mongo_app: { type: Boolean, label: "Estatus de la aplicación Mongo",optional: true },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  finished: { type: Boolean, label: 'Terminado', defaultValue: false},
  idLocation: orion.attribute('hasOne', {
    label: 'Localidad de registro',
    optional:false,
    help:"Nombre de la Compañia",
    example:"---",
  }, {
    collection: LocationsReg,
    titleField: ['name'],
    customPublication:true,
    publicationName: 'GetSelectOneLocationsReg'
  }),
  width_resolution: { type: Number, label: "Ancho Resolucion",optional:false},
  height_resolution: { type: Number, label: "Alto Resolucion",optional:false},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

EnableButtonsExport=function(){  
  return true;
}
