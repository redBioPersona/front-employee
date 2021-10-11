Sanciones = new orion.collection('sanciones', {
  singularName: 'Sanción',
  pluralName: 'Sanciones',
  help:'Sanciones',
  title: 'Sanciones',
  CanAdd:true,
  parentPath: '/admin',
  link: { title: 'Sanciones' , parent: '_template' },
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
      messageTop: 'Sanciones',
      "className": 'btn-floating waves-effect waves-light blue',
      enabled:EnableButtonsExport()
    },
    {
      extend: 'csvHtml5',
      charset:'utf-8',
      bom: true,
      text: '<i class="large material-icons">cloud_download</i>',
      title:creaTitulosDeArchivos("Sanciones"),
      "className": 'btn-floating waves-effect waves-light red',
      enabled:EnableButtonsExport()
    },
    {
      extend: 'pdfHtml5',
      text: '<i class="large material-icons">picture_as_pdf</i>',
      title:creaTitulosDeArchivos("Sanciones"),
      "className": 'btn-floating waves-effect waves-light orange',
      enabled:EnableButtonsExport(),
      orientation: 'landscape',
      exportOptions: { modifier: { page: 'current' } },
      customize: function(doc) {
        doc.defaultStyle.fontSize =8;
     }
    }
  ],
  selector:SelectorArrayCompany,
  columns: [
    { data: "clave", title: "Clave" },
    { data: 'etiqueta', title: 'Etiqueta' },
    { data: 'descripcion', title: 'Descripción' },
    { data: 'descuento', title: 'Descuento' },
    { data: "active", title: "Activo", render(val){ if (val) { return "<img src='/images/check.png' width='25px'>"}else{return "<img src='/images/denied.png' width='25lpx'>"}} },
    orion.attributeColumn('createdByXP', 'createdBy', 'Inserto'),
  {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
  orion.attributeColumn('updatedByXP', 'updatedBy', 'Actualizo'),
  {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ],
  stateSave: false
}
});

Sanciones.attachSchema(new SimpleSchema({
  clave: { type: String, label:'Clave de la Sanción', optional: false,help:"Identificador de la sanción",example:"Sancion-123" },
  etiqueta: {
    type: String,
    label:'Etiqueta de la Sanción',
    optional: false,
    help:"Nombre característico de la sanción",
    example:"Sanción para los retardos",
  },
  descripcion: { type: String, label:'Descripción de la Sanción', optional: false,
  help:"Descripción de la Sanción",
  example:"--",
 },
  descuento: {
    type: String,
    label: 'Descuento',
    help:"Descuento que se aplicara si se cumple la sanción",
    example:"--",
    optional: false,
    allowedValues: ['Sin Descuento', 'Medio dia', 'Un dia'],
    autoform: {
      firstOption: false
    }
  },
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
  active: { type: Boolean, label: 'Activo', defaultValue: true,help:"Registro activo", example:"Cuadro Seleccionado (con palomita)=Registro Activo"},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));

Reglas_retardos = new orion.collection('reglas_retardos', {
  singularName: 'Regla Retardos',
  pluralName: 'Reglas Retardos',
  CanAdd:true,
  title: 'Reglas Retardos',
  help:'Reglas para los retardos de asistencia',
  parentPath: '/admin',
  link: { title: 'Reglas Retardos' , parent: '_template' },
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
      messageTop: 'Reglas Retardos',
      "className": 'btn-floating waves-effect waves-light blue',enabled:EnableButtonsExport()
    },
    {
      extend: 'csvHtml5',
      charset:'utf-8',
      bom: true,
      text: '<i class="large material-icons">cloud_download</i>',
      title:creaTitulosDeArchivos("Reglas Retardos"),
      "className": 'btn-floating waves-effect waves-light red',
      enabled:EnableButtonsExport()
    },
    {
      extend: 'pdfHtml5',
      text: '<i class="large material-icons">picture_as_pdf</i>',
      title:creaTitulosDeArchivos("Reglas Retardos"),
      filename:creaTitulosDeArchivos("Reglas Retardos"),
      "className": 'btn-floating waves-effect waves-light orange',
      enabled:EnableButtonsExport(),
      orientation: 'landscape',
      exportOptions: { modifier: { page: 'current' } },
      customize: function(doc) {
        doc.defaultStyle.fontSize =8;
     }
    }
  ],
  selector:SelectorArrayCompany,
  columns: [
    { data: "clave", title: "Clave" },
    { data: 'etiqueta', title: 'Etiqueta' },
    { data: 'descripcion', title: 'Descripción' },
    { data: 'permitidos', title: 'Retardos permitidos por Mes'},
    { data: 'tolerancia', title: 'Información' ,  render: function(val){return render_tolerancia(val);} },
    {
      data: "active",
      title: "Activo",
      render(val) {
        if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
        else {return "<img src='/images/check.png' width='25px'>"}
      }
    },
    orion.attributeColumn('createdByXP', 'createdBy', 'Inserto'),
  {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
  orion.attributeColumn('updatedByXP', 'updatedBy', 'Actualizo'),
  {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ],
  stateSave: false
}
});

Reglas_retardos.attachSchema(new SimpleSchema({
  clave: { type: String, label:'Clave', optional:false,
  help:"Identificador del retardo",
  example:"Retardo-123",
    },
  etiqueta: { type: String, label:'Etiqueta', optional:false,
  help:"Nombre característico del retardo",
  example:"Retardo-123",
},
  descripcion: { type: String, label:'Descripción', optional:false,
  help:"descripción del retardo",
  example:"Retardo de asistencia",},
  permitidos: { type: Number, label:'Retardos permitidos por Mes', optional:false,
  help:"Número de retardos permitidos por mes",
  example:"6",
},
  tolerancia: {
    type: Array,
    optional: true
  },
  "tolerancia.$": {
    optional: true,
    type: Object
  },
  "tolerancia.$.status": {
    type: String,
    optional: true,
    label: "Estatus",
    allowedValues:['Tolerancia','Retardo Normal','Retardo Menor','Retardo Mayor'],
    autoform:{firstOption:false}
  },
  "tolerancia.$.tiempo": {
    type: Number,
    optional: true,
    min:0,
    label: "Tiempo en Minutos"
  },
  "tolerancia.$.sancion":orion.attribute("hasOne", {
    optional: true,
    label: "Sanción",
  }, {
    collection: Sanciones,
    titleField: ["clave", "etiqueta"],
    customPublication:true,
    publicationName: "GetSelectOneSanciones"
  }),
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
  active: { type: Boolean, label: 'Activo', defaultValue: true,help:"Registro activo",
    example:"Cuadro Seleccionado (con palomita)=Registro Activo", },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));


Reglas_alimentos = new orion.collection('reglas_alimentos', {
  singularName: 'Regla Alimentos',
  pluralName: 'Reglas Alimentos',
  title: 'Reglas Alimentos',
  parentPath: '/admin',
  CanAdd:true,
  help:'Reglas para el tiempo de consumo de alimentos',
  link: { title: 'Reglas Alimentos' , parent: '_template' },
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
      messageTop: 'Reglas Alimentos',
      "className": 'btn-floating waves-effect waves-light blue',
      enabled:EnableButtonsExport()
    },
    {
      extend: 'csvHtml5',
      charset:'utf-8',
      bom: true,
      text: '<i class="large material-icons">cloud_download</i>',
      title:creaTitulosDeArchivos("Reglas Alimentos"),
      "className": 'btn-floating waves-effect waves-light red',
      enabled:EnableButtonsExport()
    },
    {
      extend: 'pdfHtml5',
      text: '<i class="large material-icons">picture_as_pdf</i>',
      title:creaTitulosDeArchivos("Reglas Alimentos"),
      filename:creaTitulosDeArchivos("Reglas Alimentos"),
      "className": 'btn-floating waves-effect waves-light orange',
      enabled:EnableButtonsExport(),
      orientation: 'landscape',
      exportOptions: { modifier: { page: 'current' } },
      customize: function(doc) {
        doc.defaultStyle.fontSize =8;
     }
    }
  ],
  selector:SelectorArrayCompany,
  columns: [
    { data: "clave", title: "Clave" },
    { data: 'etiqueta', title: 'Etiqueta' },
    { data: 'descripcion', title: 'Descripcion' },
    { data: 'tiempo_consumo', title: 'Min. para consumo' },
    { data: 'tolerancia', title: 'Información' ,  render: function(val){return render_tolerancia(val);} },
    { data: "active", title: "Activo", render(val) { if (!val) {return "<img src='/images/denied.png' width='25lpx'>"} else {return "<img src='/images/check.png' width='25px'>"} } },
    orion.attributeColumn('createdByXP', 'createdBy', 'Inserto'),
  {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
  orion.attributeColumn('updatedByXP', 'updatedBy', 'Actualizo'),
  {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ],
  stateSave: false
}
});

Reglas_alimentos.attachSchema(new SimpleSchema({
  clave: { type: String, label:'Clave', optional:false,
  help:"Identificador de la regla de alimentos",
  example:"Alimentos-123",},
  etiqueta: { type: String, label:'Etiqueta', optional:false,
  help:"Nombre característico de la regla de alimentos",
  example:"AlimentosComida"},
  descripcion: { type: String, label:'Descripción', optional:false,
  help:"Descripción de la regla de alimentos",
  example:"---"},
  tiempo_consumo: { type: Number, label:'Tiempo en min. para el consumo de alimentos', optional:false,
  help:"Minutos permitidos para el consumo de alimentos",
  example:"60"},
  tolerancia: {
    type: Array,
    optional: true
  },
  "tolerancia.$": {
    optional: true,
    type: Object
  },
  "tolerancia.$.status": {
    type: String,
    optional: true,
    label: "Estatus",
    allowedValues:['Tolerancia','Retardo Normal','Retardo Menor','Retardo Mayor'],
    autoform:{firstOption:false}
  },
  "tolerancia.$.tiempo": {
    type: Number,
    optional: true,
    min:0,
    label: "Tiempo en Minutos"
  },
  "tolerancia.$.sancion":orion.attribute("hasOne", {
    optional: true,
    label: "Sanción",
  }, {
    collection: Sanciones,
    titleField: ["clave", "etiqueta"],
    customPublication:true,
    publicationName: "GetSelectOneSanciones"
  }),
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
  active: { type: Boolean, label: 'Activo', defaultValue: true,
  help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));


Horarios = new orion.collection('horarios', {
  singularName: 'Horario',
  pluralName: 'Horarios',
  CanAdd:true,
  title: 'Jornadas Laborales',
  help: 'Administre las distintas Jornadas Laborales',
  parentPath: '/admin',
  link: { title: 'Horarios' , parent: '_template' },
  tabular: {
    scrollX: true,
    "processing": true,
    pub:'TabularHorarios',
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
      messageTop: 'Horarios',
      "className": 'btn-floating waves-effect waves-light blue',enabled:EnableButtonsExport(),
      enabled:EnableButtonsExport()
    },
    {
      extend: 'csvHtml5',
      charset:'utf-8',
      bom: true,
      text: '<i class="large material-icons">cloud_download</i>',
      title:creaTitulosDeArchivos("Horarios"),
      "className": 'btn-floating waves-effect waves-light red',enabled:EnableButtonsExport(),
      enabled:EnableButtonsExport()
    },
    {
      extend: 'pdfHtml5',
      text: '<i class="large material-icons">picture_as_pdf</i>',
      title:'Horarios',
      filename:creaTitulosDeArchivos("Horarios"),
      "className": 'btn-floating waves-effect waves-light orange',enabled:EnableButtonsExport(),
      enabled:EnableButtonsExport(),
      orientation: 'landscape',
      exportOptions: {
        columns: [ 0,1,2,3,4,5,7,8,9,10,11],
        modifier: { page: 'current' } },
      customize: function(doc) {
        doc.defaultStyle.fontSize =8;
     }
    }
  ],
  selector:SelectorArrayCompany,
  columns: [
    { data: "clave", title: "Clave" },
    { data: 'etiqueta', title: 'Etiqueta' },
    { data: 'descripcion', title: 'Descripcion' },
    { data: 'lunes', title: 'Lunes',  render: function(val){return horarios(val);} },
    { data: 'martes', title: 'Martes',  render: function(val){return horarios(val);} },
    { data: 'miercoles', title: 'Miercoles' ,  render: function(val){return horarios(val);} },
    { data: 'jueves', title: 'Jueves' ,  render: function(val){return horarios(val);} },
    { data: 'viernes', title: 'Viernes' ,  render: function(val){return horarios(val);} },
    { data: 'sabado', title: 'Sabado' ,  render: function(val){return horarios(val);} },
    { data: 'domingo', title: 'Domingo' ,  render: function(val){return horarios(val);} },
    { data: 'retardos', title: 'Retardos Asistencia',render:function(val){
      var data=Reglas_retardos.findOne({_id:val});
      var result;
      if (data!=undefined) { result=data.clave+" "+data.etiqueta; }
      else{ result="Sin Asignar"; }
      return result;
    }},
    { data: 'comidas', title: 'Retardos Comidas',render:function(val){
      var data=Reglas_alimentos.findOne({_id:val});
      var result;
      if (data!=undefined) { result=data.clave+" "+data.etiqueta; }
      else{ result="Sin Asignar"; }
      return result;
    }},
    {
      data: "active",
      title: "Activo",
      render(val) {
        if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
        else {return "<img src='/images/check.png' width='25px'>"}
      }
    },
    orion.attributeColumn('createdByXP', 'createdBy', 'Inserto'),
    {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
    orion.attributeColumn('updatedByXP', 'updatedBy', 'Actualizo'),
    {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ],
  stateSave: false
}
});

Jornada = new SimpleSchema({
  Entrada: {
    type: String,
    min: 5,
    optional: true,
    autoform: {
      type: "text",
      placeholder: "08:00",
      maxLength: "5"
    }
  },
  Salida: {
    type: String,
    min: 5,
    optional: true,
    autoform: {
      type: "text",
      placeholder: "18:00",
      maxLength: "5"
    },
  },
  ComidaInicio: {
    type: String,
    min: 5,
    optional: true,
    autoform: {
      type: "text",
      placeholder: "13:00",
      maxLength: "5"
    },
  },
  ComidaFin: {
    type: String,
    min: 5,
    optional: true,
    autoform: {
      type: "text",
      placeholder: "14:00",
      maxLength: "5"
    },
  }
});
Horarios.attachSchema(new SimpleSchema({
  clave: { 
    type: String,
    label:'Clave del Horario',
    optional:false,
    autoValue: function() {
      var departmentName = this.field("clave");
      if (departmentName.isSet) {
        if (departmentName && departmentName.value) {
          return departmentName.value.toUpperCase();
        }
      } else {
        this.unset();
      }
    },
  help:"Identificador del horario/ jornada laboral",
  example:"H-123"},
  etiqueta: { type: String, label:'Etiqueta', optional:false,
  help:"Nombre característico del horario/ jornada laboral",
  example:"H-123"},
  descripcion: { type: String, label:'Descripción', optional:false,
  help:"Descripción del horario/ jornada laboral",
  example:"Horario L-V"},
  lunes: { type: Jornada, optional: true },
  martes: { type: Jornada, optional: true },
  miercoles: { type: Jornada, optional: true },
  jueves: { type: Jornada, optional: true },
  viernes: { type: Jornada, optional: true },
  sabado: { type: Jornada, optional: true },
  domingo: { type: Jornada, optional: true },
  retardos: orion.attribute('hasOne', {
    label: 'Retardos Asistencia',
    help:"Regla(s) de retardo por aplicarse",
    example:"---"
  },{
    collection: Reglas_retardos,
    titleField: ['clave','etiqueta'],
    customPublication:true,
    publicationName: 'GetSelectOneReglasRetardos'
  }),
  comidas: orion.attribute('hasOne', {
    label: 'Retardos Comidas',
    help:"Regla(s) de alimentos por aplicarse",
    example:"---"
  },{
    collection: Reglas_alimentos,
    titleField: ['clave','etiqueta'],
    customPublication:true,
    publicationName: 'GetSelectOneReglasAlimentos'
  }),
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
  active: { type: Boolean, label: 'Activo', defaultValue: true,
  help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",},
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));
