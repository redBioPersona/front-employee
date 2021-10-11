Incidencias = new orion.collection('incidencias', {
  singularName: 'Incidencias',
  pluralName: 'Incidencias',
  title: 'Incidencias',
  help:'Incidencias / razones de ausencia laboral',
  CanAdd:true,
  parentPath: '/admin',
  link: { title: 'Incidencias', parent: '_template' },
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
    buttons: [{
      extend: 'copyHtml5',
      text: '<i class="large material-icons">content_copy</i>',
      messageTop: 'Incidencias',
      enabled:EnableButtonsExport(),
      "className": 'btn-floating waves-effect waves-light blue'
    },
    {
      extend: 'csvHtml5',
      charset:'utf-8',
      bom: true,
      text: '<i class="large material-icons">cloud_download</i>',
      title:creaTitulosDeArchivos("Incidencias"),
      enabled:EnableButtonsExport(),
      "className": 'btn-floating waves-effect waves-light red'
    },
    {
      extend: 'pdfHtml5',
      text: '<i class="large material-icons">picture_as_pdf</i>',
      title:creaTitulosDeArchivos("Incidencias"),
      enabled:EnableButtonsExport(),
      "className": 'btn-floating waves-effect waves-light orange',
      exportOptions: { modifier: { page: 'current' } }
    }
  ],
  selector:SelectorArrayCompany,
  columns: [
    { data: "razon", title: "Razón de la Ausencia" },
    { data: "observaciones", title: "Observaciones" },
    { data: "active", title: "Estatus", render(val) { if (!val) {return "<img src='/images/denied.png' width='25lpx'>"} else {return "<img src='/images/check.png' width='25px'>"} } },
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


Incidencias.attachSchema(new SimpleSchema({
  razon: {
    type: String,
    label: 'Razón de la ausencia',
    help:"Razón de la ausencia",
    example:"Enfermedad",
    optional:false,
    autoValue: function() {
      var locationName = this.field("razon");
      if (locationName.isSet) {
        return locationName.value.toUpperCase();
      } else {
        this.unset();
      }
    }
  },
  observaciones: {
    type:String,
    help:"Observaciones de la incidencia",
    example:"---",
    label:'Observaciones',
    optional:true
  },
  active: {
    type: Boolean,
    label: 'Activo',
    optional:true,
    help:"Registro activo",
    example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    defaultValue: true
  },
  idcompany_txt: {
    type: String,
    label: 'Compañia',
    optional: true,
    autoform: { type: "hidden" },
    autoValue: function() {
      var id = this.siblingField("idcompany").value;
      if (id) {
        var entity = Companies.findOne({ _id: id });
        var value = "";
        var fields = ["companyName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            value = value + " " + entity[fields[i]];
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
  idcompany: orion.attribute('hasOne', {
    label: 'Nombre de la Compañia',
    optional:false,
    help:"Nombre de la Compañia",
    example:"Mi Compañia",
  }, {
    validateOnServer :false,
    collection: Companies,
    titleField: ['companyName'],
    publicationName: 'Companies_localidadx',
    validateOnServer :false,
    filter: function(userId) {
      if (userId) {
        var user = Meteor.users.findOne(userId);
        if (Roles.userHasRole(userId,"admin")) {
          return { _id: {$ne: ""}};
        }else {
          return { _id: {$in:user.profile.idcompany} };
        }
      }
    }
  }),
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));


////////////////////////////////
////permisos
////////////////////////////////
Permisos = new orion.collection('permisos', {
  singularName: 'Permisos',
  pluralName: 'Permisos',
  CanAdd:true,
  title: 'Permisos',
  parentPath: '/admin',
  help:'Permisos para ausentarse a laborar',
  link: {
    title: 'Permisos',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    pub:'TabularPermisos',
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
        messageTop: 'Permisos',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Permisos"),
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:"Permisos",
        filename:creaTitulosDeArchivos("Permisos"),
        "className": 'btn-floating waves-effect waves-light orange',
        orientation: 'landscape',
        enabled:EnableButtonsExport(),
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
    selector:Selector_MyRecords,
    columns: [{
      data: "idEmployee",
      title: "Id Colaborador",
      render: function(val) {
        var employeeName = Persons.findOne({ _id: val });
        if (employeeName !== undefined) {
          return employeeName.idEmployee;
        } else {
          return "Sin Asignar";
        }
      }
    },
    { data: "employeeName", title: "Nombre del Colaborador" },
    {
      data: "fechaIni",
      title: "Inicio del permiso",
      render: function(val){ return formatJustDate(val); }
    },
    {
      data: "fechaFin",
      title: "Fin de permiso",
      render: function(val){ return formatJustDate(val); }
    },
    {
      data: "days_vacations",
      title: "Días",
      optional:true,
      autoform: {
        type: "hidden"
      },
      autoValue: function() {
        var id = this.siblingField("fechaIni").value;
        var id2 = this.siblingField("fechaFin").value;
        if (id&&id2) {
          var value = "";
          var dia=id.getDay();
          var dia2=id2.getDay();
          var values=dia2-dia;
          value=values+1;
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
      }
    },
    {
      data: "razon",
      title: "Razón",
      render: function(val) {
        var Data = Incidencias.findOne({ _id: val });
        if (Data !== undefined) { return Data.razon; }
        else { return "Sin Asignar"; }
      }
    },
    { data:"observaciones", title:"Comentarios" },
    orion.attributeColumn('fileXP', 'documento', 'Documento'),
    orion.attributeColumn('createdByXP', 'createdBy', "Inserto"),
    {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
    orion.attributeColumn('updatedByXP', 'updatedBy', "Actualizo"),
    {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
}
});


Permisos.attachSchema(new SimpleSchema({
  idEmployee: orion.attribute('hasOne', {
    label: 'Colaborador',
    help:"Colaborador a quien se le asignara el permiso",
    example:"Omar Barrera",
  }, {
    collection: Persons,
    titleField: ['employeeName'],
    customPublication:true,
    publicationName: 'GetSelectOnePersons'
  }),
  employeeName: {
    type: String,
    label: "Colaborador",
    help:"Colaborador a quien se le asignara el permiso",
    example:"Omar Barrera",
    optional: true,
    autoform: { type: "hidden" },
    autoValue: function () {
      var id = this.siblingField("idEmployee").value;
      if (id) {
        var entity = Persons.findOne({_id: id});
        var value = "";
        var fields = ["employeeName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Persons.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({_id: entity[fields[i]]}).fetch();
            var res;
            var theTitleField = Persons.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({_id: entity[fields[i]]});
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
  fechaIni: {
    type: Date,
    label: 'Fecha Inicial  del Permiso',
    help:"Fecha inicial del permiso",
    example:moment().format("DD/MM/YYYY"),
    optional: false,
    autoform: {
      type: "pickadate",
      pickadateOptions: {
        format: 'dd/mm/yyyy',
        selectMonths: true,
        selectYears: 100
      }
    },
  },
  fechaFin: {
    type: Date,
    label: 'Fecha final del permiso',
    help:"Fecha final del permiso",
    example:moment().add(2,'days').format("DD/MM/YYYY").toString(),
    optional: false,
    autoform: {
      type: "pickadate",
      pickadateOptions: {
        format: 'dd/mm/yyyy',
        selectMonths: true,
        selectYears: 100
      }
    },
  },
  days_vacations:{
    type:Number,
    label:'Días con permiso',
    help:"Cantidad de días laborables",
    example:"2",
    optional:false,
    // autoform: {
    //   type: "hidden"
    // },
    // autoValue: function() {
    //   var id = this.siblingField("fechaIni").value;
    //   var id2 = this.siblingField("fechaFin").value;
    //   if (id&&id2) {
    //     var value = "";
    //     var dia=id.getDay();
    //     var dia2=id2.getDay();
    //     var values=dia2-dia;
    //     value=values+1;
    //     if (this.isInsert || this.isUpdate) {
    //       return value;
    //     } else if (this.isUpsert) {
    //       return { $setOnInsert: value };
    //     } else { this.unset(); }
    //   }
    //   else { this.unset(); }
    // }
  },
  "observaciones": {
    type: String,
    optional: true,
    label: 'Comentarios',
    help:"Observaciones del permiso",
    example:"---",
    autoform: { type: 'textarea' }
  },
  "razon":orion.attribute("hasOne", {
    optional: false,
    label: "Razón de la Ausencia",
    help:"Razón de la Ausencia",
    example:"---",
  }, {
    collection: Incidencias,
    titleField: ['razon'],
    customPublication:true,
    publicationName: "GetSelectOneIncidencias"
  }),
  documento:{ type: Array, optional: true, autoform: {
    type: 'orion.fileXP',
    label:'Documento de Soporte (Opcional)',
    help:"Documento(s) de Soporte",
    example:"---",
  }, },
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
  active: {
    type: Boolean,
    label: 'Activo',
    defaultValue: true,
    help:"Registro activo",
    example:"Cuadro Seleccionado (con palomita)=Registro Activo",
  },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));
