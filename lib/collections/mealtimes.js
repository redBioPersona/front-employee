Meal_times = new orion.collection('meal_times', {
  singularName: 'Tiempos de Alimentos',
  pluralName: 'Tiempos de Alimentos',
  title: 'Tiempos de Alimentos',
  ShowFilter:true,
  help:'Registros que indican el tiempo de consumo de alimentos',
  parentPath: '/admin',
  link: { title: 'Tiempos de Alimentos', parent: '_template' },
  tabular: {
    scrollX: true,
    "processing": true,
     pub: 'TabularMeal_times',
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
        messageTop: 'Tiempo de Alimentos',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Tiempo de Alimentos',
        "className": 'btn-floating waves-effect waves-light red',
          enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Tiempo de Alimentos',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        pageSize: 'A4'
      }
    ],
    selector:SelectorMealTime,
    columns: [
      {data: "idEmployee", title: "ID" },
      { data: 'employeeName', title: 'NOMBRE' },
      { data: 'fecha', title: 'FECHA' },
      { data: 'inicioOficial', title: 'INICIO OFICIAL' },
      { data: 'primerRegistro', title: 'PRIMER REG.', },
      { data: 'salidaOficial', title: 'REGRESO OFICIAL' },
      { data: 'ultimoRegistro', title: 'ULTIMO REG.' },
      { data: 'estatus', title: 'ESTATUS' },
      { data: 'excepcion', title: 'EXCEPCIÓN' },
      { data: 'minutos_permitidos', title: 'MIN. PERM.' },
      { data: 'horas', title: 'HRS.' },
      { data: 'minutos', title: 'MIN.' },
      { data: 'sancion', title: 'SANCIÓN' }
    ],
    stateSave: false
  }
});

Meal_times.attachSchema(new SimpleSchema({
  _idEmployee: { type: String, label:'_Id', optional: true },
  idEmployee: { type: Number, label:'Id del Colaborador', optional: true },
  employeeName: { type: String, label:'Nombre del Colaborador', optional: true },
  fecha: { type: String, label:'Fecha', optional: true },
  inicioOficial: { type: String, label:'Inicio Oficial', optional: true },
  primerRegistro: { type: String, label:'Primer Registro', optional: true },
  fechaIni: { type: Date, label:'Fecha Ini Mongo', optional: true },
  salidaOficial: { type: String, label:'Regreso Oficial', optional: true },
  ultimoRegistro: { type: String, label:'Ultimo Registro', optional: true },
  fechaFin: { type: Date, label:'Fecha Fin Mongo', optional: true },
  estatus: { type: String, label:'Estatus', optional: true },
  excepcion: { type: String, label:'Excepcion', optional: true },
  horas: { type: String, label:'Horas', optional: true },
  minutos: { type: String, label:'Minutos', optional: true },
  minutos_permitidos: { type: Number, label:'Min. Permitidos', optional: true },
  sancion:{type:String,label:'Sanción',optional:true},
  idcompany:{type:[String],label:'Id Compañia',optional:true}
}));
