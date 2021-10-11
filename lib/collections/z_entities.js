//Config Aplication


Enrollments_temp = new orion.collection('enrollments_temp', {
  singularName: 'Enrolamiento Temporal',
  pluralName: 'Enrolamientos Temporales',
  title: 'Enrolamientos Temporal',
  parentPath: '/admin',
  help: 'Temporal',
  link: {
    title: 'Enrolamientos Temporales',
    parent: '_template'
  }
});
/// SCHEMA legislarequisito:
Enrollments_temp.attachSchema(new SimpleSchema({
  finger_left: { type: String, label: "Dedo", optional: true},
  finger_left_normal: { type: String, label: "normal", optional: true },
  finger_left_binaria: { type: String, label: "binaria", optional: true },
  finger_left_template: { type: String, label: "template", optional: true },
  finger_left_estatus: { type: String, label: "estatus", optional: true },
  finger_left_calidad: { type: String, label: "calidad", optional: true },
  finger_left_proceso: { type: String, label: "proceso", optional: true },

  finger_right: { type: String, label: "Dedo", optional: true},
  finger_right_normal: { type: String, label: "normal", optional: true },
  finger_right_binaria: { type: String, label: "binaria", optional: true },
  finger_right_template: { type: String, label: "template", optional: true },
  finger_right_estatus: { type: String, label: "estatus", optional: true },
  finger_right_calidad: { type: String, label: "calidad", optional: true },
  finger_right_proceso: { type: String, label: "proceso", optional: true },

  face: { type: String, label: "face", optional: true},
  facing: { type: String, label: "face", optional: true},
  face_image: { type: String, label: "face_image", optional: true},
  face_template: { type: String, label: "face_template", optional: true},
  face_url: { type: String, label: "face_url", optional: true},
  face_binaria: { type: String, label: "face_binaria", optional: true},
  face_estatus: { type: String, label: "face_estatus", optional: true},
  face_proceso: { type: String, label: "face_proceso", optional: true},

  signing: { type: String, label: "firma", optional: true},
  sign: orion.attribute('image', {
    label: 'Firma',
    optional: true
  }),
  accion: { type: String, label: "accion", optional: true},
  campo_accion: { type: String, label: "campo accion", optional: true},

  docs: { type: String, label: "Documentos", optional: true},

  empleado: { type: String, label: "empleado", optional: true },
  idEnrol:{ type: String, label: "Id Enrolamiento", optional: true },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

Enrollments_uptemp = new orion.collection('enrollments_uptemp', {
  singularName: 'Enrolamiento Temporal',
  pluralName: 'Enrolamientos Temporales',
  title: 'Enrolamientos Temporal',
  parentPath: '/admin',
  help: 'Temporal',
  link: {
    title: 'Enrolamientos Temporales',
    parent: '_template'
  }
});
/// SCHEMA legislarequisito:
Enrollments_uptemp.attachSchema(new SimpleSchema({
  finger_left: { type: String, label: "Dedo", optional: true},
  finger_left_normal: { type: String, label: "normal", optional: true },
  finger_left_binaria: { type: String, label: "binaria", optional: true },
  finger_left_template: { type: String, label: "template", optional: true },
  finger_left_estatus: { type: String, label: "estatus", optional: true },
  finger_left_calidad: { type: String, label: "calidad", optional: true },
  finger_left_proceso: { type: String, label: "proceso", optional: true },

  finger_right: { type: String, label: "Dedo", optional: true},
  finger_right_normal: { type: String, label: "normal", optional: true },
  finger_right_binaria: { type: String, label: "binaria", optional: true },
  finger_right_template: { type: String, label: "template", optional: true },
  finger_right_estatus: { type: String, label: "estatus", optional: true },
  finger_right_calidad: { type: String, label: "calidad", optional: true },
  finger_right_proceso: { type: String, label: "proceso", optional: true },

  face: { type: String, label: "face", optional: true},
  facing: { type: String, label: "face", optional: true},
  face_image: { type: String, label: "face_image", optional: true},
  face_template: { type: String, label: "face_template", optional: true},
  face_url: { type: String, label: "face_url", optional: true},
  face_binaria: { type: String, label: "face_binaria", optional: true},
  face_estatus: { type: String, label: "face_estatus", optional: true},
  face_proceso: { type: String, label: "face_proceso", optional: true},

  signing: { type: String, label: "firma", optional: true},
  sign: orion.attribute('image', {
    label: 'Firma',
    optional: true
  }),
  accion: { type: String, label: "accion", optional: true},
  campo_accion: { type: String, label: "campo accion", optional: true},

  docs: { type: String, label: "Documentos", optional: true},

  empleado: { type: String, label: "empleado", optional: true },
  idEnrol:{ type: String, label: "Id Enrolamiento", optional: true },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

//Create Enrollment
Create_enroll = new orion.collection('create_enroll', {
  singularName: 'Crear Enrolamiento',
  pluralName: 'Crear Enrolamientos',
  title: 'Crear Enrolamientos',
  parentPath: '/admin/principal',
  help: 'Dar de alta a un colaborador, requiriendo su información personal y datos biométricos',
  link: { title: 'Crear Enrolamientos', parent: '_template' }
});

Create_enroll.attachSchema(new SimpleSchema({
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));


//Create Documentos Temporales
Documents_temp = new orion.collection('documents_temp', {
  singularName: 'Documento Temporal',
  pluralName: 'Documentos Temporales',
  title: 'Documentos Temporales',
  parentPath: '/admin',
  // help: 'Documentos Temporales',
  link: {
    title: 'Documentos Temporales',
    parent: '_template'
  }
});

Documents_temp.attachSchema(new SimpleSchema({
  documents: {
    type: Array,
    label: "Documentos del Colaborador",
    optional: true
  },
  "documents.$": {
    optional: true,
    type: Object
  },
  "documents.$.name":orion.attribute("hasOne", {
    optional: true,
    label: "Nombre del documento"
  }, {
    collection: Documents,
    titleField: ["name"],
    publicationName: "doc_original_temp",
    validateOnServer :false,
    filter: function(userId) {
      if (userId) {
        var user = Meteor.users.findOne(userId);
        if (Roles.userHasRole(userId,"admin")) {
          return { idcompany: {$ne: ""}};
        }else {
          return { idcompany: {$in:user.profile.idcompany} };
        }
      }
    }
  }),
  "documents.$.file":orion.attribute("file", {
    optional: true,
    label: "Documento"
  }),
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));


VerificationFace_temp = new orion.collection('verificationface_temp', {
  singularName: 'Verificacion Facial Temporal',
  pluralName: 'Verificacion Facial Temporales',
  title: 'Verificacion Facial Temporal',
  parentPath: '/admin',
  help: 'Verificacion Facial',
  link: {
    title: 'Verificacion Facial',
    parent: '_template'
  }
});

VerificationFace_temp.attachSchema(new SimpleSchema({
  face: { type: String, label: "face", optional: true},
  facing: { type: String, label: "face", optional: true},
  face_image: { type: String, label: "face_image", optional: true},
  face_template: { type: String, label: "face_template", optional: true},
  face_url: { type: String, label: "face_url", optional: true},
  face_binaria: { type: String, label: "face_binaria", optional: true},
  face_estatus: { type: String, label: "face_estatus", optional: true},
  face_proceso: { type: String, label: "face_proceso", optional: true},
  empleado: { type: String, label: "empleado", optional: true },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));




//Create Documentos
EmployeeDocument = new orion.collection('employeeDocument', {
  singularName: 'Documento del Colaborador',
  pluralName: 'Documentos del Colaborador',
  title: 'Documentos del Colaborador',
  parentPath: '/admin',
  help: 'Documentos del Colaborador',
  link: {
    title: 'Documentos del Colaborador' ,
    parent: '_template'
  },
  tabular: {
    dom: '<<"row"<"col s10"f><"col s2"l>>brtipRC<T>>',
    tableTools: { "sRowSelect": "os", "aButtons": ["copy", { "sExtends": "csv", "sFileName": "Legislación VS Requisito *.csv", "sCharSet": "utf16le", }, { "sExtends": "pdf", "sTitle": "Legislación VS Requisito" }], "sSwfPath": "/swf/copy_csv_xls_pdf.swf" },
    scrollX: true,
    columns: []
  }
});

EmployeeDocument.attachSchema(new SimpleSchema({
  documents: {
    type: Array,
    optional: true
  },
  "documents.$": {
    optional: true,
    type: Object
  },
  "documents.$.name":orion.attribute("hasOne", {
    optional: true,
    label: "Nombre del documento"
  }, {
    collection: Documents,
    titleField: ["name"],
    publicationName: "employee_document",
    validateOnServer :false,
    filter: function(userId) {
      if (userId) {
        var user = Meteor.users.findOne(userId);{
        return { idcompany: {$in:user.profile.idcompany} };
      }
    }
  }
  }),
  "documents.$.file":orion.attribute("file", {
    optional: true,
    label: "Documento"
  }),
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

//*****************************************
//Create Access_temp
//*****************************************

Access_temp = new orion.collection('access_temp', {
  singularName: 'Acceso Temporal',
  pluralName: 'Acceso Temporal',
  title: 'Acceso Temporal',
  parentPath: '/admin',
  help: 'Acceso Temporal',
  link: { title: 'Acceso Temporal',parent:'_template'},
  tabular: {
    dom: '<<"row"<"col s10"f><"col s2"l>>brtipRC<T>>',
    tableTools: { "sRowSelect": "os", "aButtons": ["copy", { "sExtends": "csv", "sFileName": "Legislación VS Requisito *.csv", "sCharSet": "utf16le", }, { "sExtends": "pdf", "sTitle": "Legislación VS Requisito" }], "sSwfPath": "/swf/copy_csv_xls_pdf.swf" },
    scrollX: true,
    columns: []
  }
});

Access_temp.attachSchema(new SimpleSchema({
  id: { type: String, label:'Id del Colaborador que ingreso', optional: true },
  date: { type: Date, label:'Id del Colaborador que ingreso', optional: true },
  url: {type: String,label:'url',optional: true},
  employeeName: {type: String,label:'employeeName',optional: true},
  empEmail: {type: String,label:'empEmail',optional: true},
  empPhoneNbr: {type: String,label:'empPhoneNbr',optional: true},
  empCellNbr: {type: String,label:'empCellNbr',optional: true},
  companyName: {type: String,label:'companyName',optional: true},
  empPosName: {type: String,label:'empPosName',optional: true},
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

//*****************************************
//Create temp_messages
//*****************************************

Temp_messages = new orion.collection('temp_messages', {
  singularName: 'Mensaje Temporal',
  pluralName: 'Mensaje Temporal',
  title: 'Mensaje Temporal',
  parentPath: '/admin',
  help: 'Mensaje Temporal',
  link: {
    title: 'Mensaje Temporal',
    parent: '_template'
  },
  tabular: {
    dom: '<<"row"<"col s10"f><"col s2"l>>brtipRC<T>>',
    tableTools: { "sRowSelect": "os", "aButtons": ["copy", { "sExtends": "csv", "sFileName": "Legislación VS Requisito *.csv", "sCharSet": "utf16le", }, { "sExtends": "pdf", "sTitle": "Legislación VS Requisito" }], "sSwfPath": "/swf/copy_csv_xls_pdf.swf" },
    scrollX: true,
    columns: []
  }
});

Temp_messages.attachSchema(new SimpleSchema({
  status_verification: { type: String, label:'Estatus de la verificacion', optional: true },
  new_device: { type: Boolean, label:'Nuevo Dispositivo', optional: true },
  device: { type: String, label:'Id nuevo Dispositivo', optional: true },
  finished: { type: Boolean, label:'finished', optional: true },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

Temp_messages.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

//Create Accesos
Accesos = new orion.collection('accesos', {
  singularName: 'Accesos',
  pluralName: 'Accesos',
  title: 'Accesos',
  parentPath: '/admin/principal',
  help: 'Accesos',
  link: { title: 'Accesos', parent: '_template' }
});

Accesos.attachSchema(new SimpleSchema({
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));



//Create Enrollments
Enrollments = new orion.collection('enrollments', {
  singularName: 'Enrolamientos',
  pluralName: 'Enrolamientos',
  title: 'Enrolamientos',
  parentPath: '/admin/principal',
  help: 'Muestra información de los enrolamientos generados',
  link: { title: 'Enrolamientos', parent: '_template' },
  tabular: {
    scrollX: true,
    "processing": true,
    pub:"TabularEnrollments",
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
    search: {
      caseInsensitive: true,
      smart: true,
      onEnterOnly: false,
    },
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Enrolamientos',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: creaTitulosDeArchivos("Enrolamientos"),
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:creaTitulosDeArchivos("Enrolamientos"),
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        //orientation: 'landscape',
        //pageSize: 'LEGAL',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
   selector:SelectorEnrollments,
    order: [[3, "desc"]],
    columns: [
    { data: "employeeName", title: "Colaborador" },
    { data:"IDENROLTYPE", title:"Tipo de Enrolamiento" },
    { data:"IDENROLSTATE", title:"Estatus del Enrolamiento" },
    { data:"ENROLDATE", title:"Fecha de Enrolamiento", render: function(val){ return formatADate(val); } },
    // { data:"STATIONENROL_TXT", title:"Estación de Enrolamiento", },
    orion.attributeColumn('createdByXP', 'CREATEDBY', 'Enrolado Por'),
    { data:"IDENROLSEQUENCE", title:"Sucesión de Enrolamiento" }
  ]
}
});

Enrollments.attachSchema(new SimpleSchema({
  PERSON: { type: String, label:'Colaborador', optional: true },
  employeeName: { type: String, label:'Nombre del Colaborador', optional: true },
  idcompany: { type: [String], label:'Compañia del Colaborador', optional: true },
  IDENROLTYPE: { type: String, label:'Tipo de Enrolamiento', optional: true },
  IDENROLSTATE: { type: String, label:'Status de Enrolamiento', optional: true },
  STATIONENROL: { type: Object, label:'Estación de Enrolamiento', optional: true },
  STATIONENROL_TXT: { type: String, label:'Estación de Enrolamiento', optional: true },
  ENROLDATE: { type: Date, label:'Fecha de Enrolamiento', optional: true },
  IDENROLLMENTMODE: { type: String, label:'Modo de Enrolamiento', optional: true },
  IDENROLSEQUENCE: { type: Number, label:'Sucesion de Enrolamiento', optional: true },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  CREATEDBY: orion.attribute('createdBy'),
  CREATEDBY_TXT: { type: String, label:'Enrolado por', optional: true },
  CREATEDON: orion.attribute('createdAt'),
  UPDATEDBY: orion.attribute('updatedBy', { optional: true }),
  UPDATEDON: orion.attribute('updatedAt', { optional: true }),
}));

if (Meteor.isServer) {

};
if (Meteor.isClient) {

};


// Estadisticos de Asistencia
Design_app= new orion.collection('design_app', {
  singularName: 'Diseño de la Aplicación',
  pluralName: 'Diseño de la Aplicación',
  title: 'Diseño de la Aplicación',
  parentPath: '/admin/principal',
  help: 'Diseño de la Aplicación',
  link: { title: 'Diseño de la Aplicación', parent: '_template' },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      //lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'frtip',
    selector:Selector_DesingApp,
    columns: [
      {data:'color',title:'Color de la Aplicación'}
    ]
  }
});



Design_app.attachSchema(new SimpleSchema({
  color:{
    type:String,
    label:'Color de la Aplicación',
    allowedValues:[
      'Azul',
      'Blanco',
      'Blanco Light',
      'Obscuro',
      'Papel Light'
    ],
    autoform:{firstOption:false}},
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  user:{
    type:"String",
    label:'Usuario',
    optional:true,
    autoform: {
      type: "hidden"
    }
  },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));


// Estaciones
Estaciones= new orion.collection('estaciones', {
  singularName: 'Estacion',
  pluralName: 'Estaciones',
  title: 'Estaciones',
  parentPath: '/admin/principal',
  help: 'Estaciones de enrolamiento/ verificación',
  link: { title: 'Estaciones', parent: '_template' },
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
        extend: 'copy',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Estaciones',
        "className": 'btn-floating waves-effect waves-light blue', enabled:EnableButtonsExport(),
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Estaciones"),
        "className": 'btn-floating waves-effect waves-light red', enabled:EnableButtonsExport(),
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Estaciones',
        filename:creaTitulosDeArchivos("Estaciones"),
        "className": 'btn-floating waves-effect waves-light orange', enabled:EnableButtonsExport(),
        enabled:EnableButtonsExport(),
        orientation: 'landscape',        
        exportOptions: {
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {
          doc.defaultStyle.fontSize =8;
       }
      }
    ],
    columns: [
      {data:'nombre',title:'Nombre de la PC'},
      {data:'user',title:'Usuario'},
      {data:'os',title:'Sistema Operativo'},
      {data:'arch',title:'Arquitectura'},
      {data:'ip',title:'Ip'},
      {data:'mac',title:'Mac Address'},
      {data: 'devices_connected', title: 'Dispositivos Conectados' },
      {data:'createdAt',title:'Fecha de alta',render: function(val){ return formatADate(val); }},
      {data:'updatedAt',title:'Fecha de Último Acceso',render: function(val){ return formatADate(val); }}
    ]
  }
});

Estaciones.attachSchema(new SimpleSchema({
  devices_connected:{ type:String, label: 'Activo', optional: true},
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));


Warnings= new orion.collection('warnings', {
  singularName: 'Warning',
  pluralName: 'Warnings',
  title: 'Warnings',
  parentPath: '/admin/principal',
  help: 'Warnings',
  link: { title: 'Warnings', parent: '_template' },
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
        extend: 'copy',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Warnings',
        "className": 'btn-floating waves-effect waves-light blue', enabled:EnableButtonsExport(),
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Warnings',
        "className": 'btn-floating waves-effect waves-light red', enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Warnings',
        "className": 'btn-floating waves-effect waves-light orange', enabled:EnableButtonsExport(),
        exportOptions: { modifier: { page: 'current' } }
      }
    ],
    columns: [
      {data:'nombre',title:'Nombre de la PC'},
      {data:'user',title:'Usuario'},
      {data:'os',title:'Sistema Operativo'},
      {data:'arch',title:'Arquitectura'},
      {data:'ip',title:'Ip'},
      {data:'mac',title:'Mac Address'},
      {data: 'devices_connected', title: 'Dispositivos Conectados' },
      {data:'createdAt',title:'Fecha de alta',render: function(val){ return formatADate(val); }},
      {data:'updatedAt',title:'Fecha de Último Acceso',render: function(val){ return formatADate(val); }}
    ]
  }
});

Warnings.attachSchema(new SimpleSchema({
  devices_connected:{ type:String, label: 'Activo', optional: true},
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

BiometricOperations = new orion.collection('biometricoperations', {
  singularName: 'BiometricOperations',
  pluralName: 'BiometricOperations',
  title: 'BiometricOperations',
  parentPath: '/admin',
  link: { title: 'BiometricOperations',parent:'_template'}
});

BiometricOperations.attachSchema(new SimpleSchema({
  "Client": { type: String, label:'Cliente que realiza la operacion', optional: true },
  "User": {type: String,label:'Usuario que realiza la operacion',optional: true},
  "Action": {type: String,label:'Accion realizada',optional: true},
  "Id": { type: String, label:'Id de la operacion', optional: true },
  "MyFileName": { type: String, label:'Nombre del archivo', optional: true },
  "IdBiometricPerson": {type: String,label:'IdBiometricPerson',optional: true},
  "RmBiometricId": {type: String,label:'RmBiometricId',optional: true},
  "VerifySamples": {type: String,label:'VerifySamples',optional: true},
  "SaveIntoServRest": {type: String,label:'SaveIntoServRest',optional: true},
  "AvoidDuplicates": {type: String,label:'AvoidDuplicates',optional: true},
  "Resultado": {type: String,label:'Resultado la operacion',optional: true},
  "Extra": { type: String, label:'Información extra', optional: true },
  "Detalle.$": {type: [Object],label:'Detalle de la operacion',optional: true},
  "Detalle.$.PersonIdSample": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.estatus": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.PersonId": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.PersonScoreFound": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Token face background uniformity score": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.LookingAway": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.FaceDarkness": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Blink": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Mustache": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Token face quality score": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Token face sharpness score": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.RedEye": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Gender": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Create token status": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Dark glassess": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Mouth open": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Glassess": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Found face(s)": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Pixelation": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.PersonIdSample": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.estatus": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.PersonId": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Expression": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Hat": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Token face grayscale density score": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.Age": {type: String,label:'Detalle de la operacion',optional: true},
  "Detalle.$.NFIQQuality": {type: String,label:'NFIQ',optional: true},
  "Detalle.$.Quality": {type: String,label:'Quality',optional: true},
  "createdAt": {type: Date,label:'createdAt',optional: true},
  "updatedAt": {type: Date,label:'updatedAt',optional: true},
}));
