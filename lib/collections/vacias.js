// Estadisticos de Asistencia
Porcentajes = new orion.collection('porcentajes', {
  singularName: 'Porcentajes',
  pluralName: 'Porcentajes',
  title: 'Porcentajes',
  parentPath: '/admin/principal',
  help: 'Porcentajes',
  link: { title: 'Porcentajes', parent: '_template' }
});

Porcentajes.attachSchema(new SimpleSchema({
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));


RemoveFingers = new orion.collection('removeFingers', {
  singularName: 'RemoveFingers',
  pluralName: 'RemoveFingers',
  title: 'RemoveFingers',
  parentPath: '/admin/principal',
  help: 'RemoveFingers',
  link: { title: 'RemoveFingers', parent: '_template' }
});

RemoveFingers.attachSchema(new SimpleSchema({
  id: { type: String, label: 'Id',  optional: true },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy', { optional: true }),
  createdAt: orion.attribute('createdAt', { optional: true }),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

Grafica_deptos = new orion.collection('grafica_deptos', {
  singularName: 'Graficas por Departamento',
  pluralName: 'Graficas por Departamento',
  title: 'Graficas por Departamento',
  parentPath: '/admin/principal',
  help: 'Graficas por Departamento',
  link: { title: 'Graficas por Departamento', parent: '_template' }
});

Grafica_deptos.attachSchema(new SimpleSchema({
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));


Mis_registros = new orion.collection('mis_registros', {
  singularName: 'Mis Registros',
  pluralName: 'Mis Registros',
  title: 'Mis Registros',
  parentPath: '/admin/principal',
  help: 'Mis Registros de asistencia',
  link: { title: 'Mis Registros', parent: '_template' }
});

Mis_registros.attachSchema(new SimpleSchema({
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

Justificantes = new orion.collection('justificantes', {
  singularName: 'Justificantes',
  pluralName: 'Justificantes',
  title: 'Justificantes',
  parentPath: '/admin/principal',
  help: 'Justificantes laborales',
  link: { title: 'Justificantes', parent: '_template' },
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
        messageTop: 'Justificantes',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Justificantes"),
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:creaTitulosDeArchivos("Justificantes"),
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          columns: [ 1,2,3,4,5,7,8,9,10,11,12,13],
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {
          doc.defaultStyle.fontSize =8;
       }
      }
    ],
    selector:Selector_Justificantes,
    columns: [
      {
        data:"active",
        title:"Comentar",
        tmpl: Meteor.isClient && Template.comentar_justificante
      },
      { data:"idEmp", title:"Id" },
      { data:"idEmpName", title:"Colaborador" },
      { data:"fecha", title:"Fecha" },
      { data: "razon_txt", title: "Razón de la Ausencia" },
      { data:"observaciones", title:"Obs. del Colaborador" },
      orion.attributeColumn('fileXP', 'documento', 'Documento'),
      { data:"estatus", title:"Estatus"},
      { data:"observaciones_admin", title:"Obs. RH",render(val){if(val){return val;}else{ return "Sin Comentarios";}}},
      {
        data:"procede",
        title:"Procede",
        render(val) {
              if (val) { return "<img src='/images/check.png' width='25px'>" }
             else { return "<img src='/images/denied.png' width='25lpx'>" }
            }
      },
      {
        data: "createdBy",
        title: "Creado por",
        render: function(val){ var Data = Meteor.users.findOne({_id:val}); if (Data !== undefined) { return Data.profile.name; }else { return "Sin Asignar"; } }
      },
      {
        data: "createdAt",
        title: "Fecha de creación",
        render: function(val){ return formatADate(val); }
      },
      {
        data: "updatedBy",
        title: "Actualizado por",
        render: function(val){ var Data = Meteor.users.findOne({_id:val}); if (Data !== undefined) { return Data.profile.name; }else { return "Sin Asignar"; } }
      },
      {
        data: "updatedAt",
        title: "Fecha de Actualización",
        render: function(val){ return formatADate(val); }
      }
    ]
  }
});


Justificantes.attachSchema(new SimpleSchema({
  "idEmployee": { type: String, optional: true },
  "estatus": { type: String, optional: true },
  "reporte": { type: String, optional: true },
  "fecha": { type: String, optional: true },
  "procede": {
    type: Boolean,
    label: 'Procede el Justificante',
    defaultValue:false,
    optional: true
  },
  "idEmp": {
    type: Number,
    optional: true
  },
  "idEmpName": {
    type: String,
    optional: true
  },
  "observaciones": {
    type: String,
    optional: false,
    label: 'Comentarios',
    autoform: { type: 'textarea' }
  },
  "observaciones_admin": {
    type: String,
    optional: true,
    label: 'Comentarios de RH',
    autoform: { type: 'textarea' }
  },
  "razon_txt":{
     type: String,
     label: "Razón de la Ausencia",
     optional: true,
     autoform: {
         type: "hidden"
     },
     autoValue: function () {
         var id = this.siblingField("razon").value;
         if (id) {
             var entity = Incidencias.findOne({ _id: id });
             var value = "";
             var fields = ["razon"];
             for (var i = 0; i < fields.length; i++) {
                 if (fields[i].endsWith("_id")) {
                     var otraCollectionFK = Incidencias.simpleSchema()._schema[fields[i]].orion.collection._name;
                     var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                         _id: entity[fields[i]]
                     }).fetch();
                     var res;
                     var theTitleField = Incidencias.simpleSchema()._schema[fields[i]].orion.titleField;
                     var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({ _id: entity[fields[i]] });
                     if (resultx) {
                         if (_.isArray(theTitleField)) {
                             res = titleField.map((field) => {
                                 return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                             }).join(" ");
                         } else {
                             res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                         }
                         value = value + " " + res;
                         if (entity.active == false) {
                             value = value + ' **';
                         }
                     }
                 } else {
                     value = value + " " + entity[fields[i]];
                     if (entity.active == false) {
                         value = value + ' **';
                     }
                 }
             }
             if (this.isInsert || this.isUpdate) {
                 return value;
             } else if (this.isUpsert) {
                 return {
                     $setOnInsert: value
                 };
             } else {
                 this.unset();
             }
         } else {
             this.unset();
         }
     },
  },
  "razon":orion.attribute("hasOne", {
      optional: false,
      label: "Razón de la Ausencia"
  }, {
      collection: Incidencias,
      titleField: ['razon'],
      customPublication:true,
      publicationName: "GetSelectOneIncidencias"
  }),
    documento:{ type: Array, optional: true, autoform: { type: 'orion.fileXP', label:'Documento de Soporte (Opcional)' }, },
    'documento.$':{ type: Object, optional: true },
    'documento.$.url': { type: String, optional: true },
    'documento.$.fileId': { type: String, optional: true },
    'documento.$.fileName': { type: String, optional: true },
  idcompany: {
    type: [String],
    label: 'Compañia',
    optional: true,
    autoform: { type: "hidden" },
    autoValue: function() {
      var ids=SelectorGetMyIdsCompanies();
      return ids;
    }
  },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));

Outreports = new orion.collection('outreports', {
  singularName: 'Reportes por Colaborador',
  pluralName: 'Reportes por Colaborador',
  title: 'Reportes por Colaborador',
  parentPath: '/admin',
  help: 'Muestra de manera detallada en el transcurso de fecha dado los registro de asistencia del Colaborador',
  link: { title: 'Reportes por Colaborador', parent: '_template' }
});

Jefecargo = new orion.collection('jefecargo', {
  singularName: 'Colaboradores a cargo',
  pluralName: 'Colaboradores a cargo',
  title: 'Colaboradores a cargo',
  parentPath: '/admin',
  help: 'Muestra el nombre de los colaboradores que se tiene a cargo',
  link: { title: 'Colaboradores a cargo', parent: '_template' }
});

Outreports.attachSchema(new SimpleSchema({
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

Grafica_extra_time = new orion.collection('grafica_extra_time', {
  singularName: 'Graficas por Tiempo Extra',
  pluralName: 'Graficas por Tiempo Extra',
  title: 'Graficas por Tiempo Extra',
  parentPath: '/admin/principal',
  help: 'Graficas por Tiempo Extra',
  link: { title: 'Graficas por Tiempo Extra', parent: '_template' }
});

Grafica_extra_time.attachSchema(new SimpleSchema({
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));

Sumados = new orion.collection('sumados', {
  singularName: 'Sumados',
  pluralName: 'Sumados',
  title: 'Sumados',
  parentPath: '/admin/principal',
  help: 'Sumados',
  link: { title: 'Sumados', parent: '_template' }
});


Horariox = new orion.collection('horariox', {
  singularName: 'horariox',
  pluralName: 'horariox',
  title: 'horariox',
  parentPath: '/admin/principal',
  help: 'Horariox',
  link: { title: 'Horariox', parent: '_template' }
});
