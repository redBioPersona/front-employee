time = function(date){
  if(date !== undefined && date !== null && date !== ""){
    var anio,mes,dia,hora,min,seg;
    //t="am";
    anio = date.getFullYear();
    mes = date.getMonth()+1;
    dia = date.getDate();
    hora = date.getHours();
    if (hora < 10) {
      hora = "0"+hora;
    }
    min = date.getMinutes();
    if (min < 10) {
      min = "0"+min;
    }
    seg = date.getSeconds();
    if (seg < 10) {
      seg = "0"+seg;
    }
    // if(hora > 12){
    //   hora = hora - 12;
    //   t = "pm";
    // }
    return {fecha:dia+"/"+mes+"/"+anio,hora:hora+":"+min+":"+seg};
  }else{
    return "Sin registro"
  }
};

Accesscontrol = new orion.collection('accesscontrol', { // Nombre de la colleccion
  singularName: 'Accesscontrol',  // Titulo de la colleccion en singular
  pluralName: 'Control de Acceso', // // Titulo de la colleccion en plural
  ShowFilter:true,
  help: 'Registros de entrada y salida (uno al día)',
  title: 'Control de Acceso', // Titulo
  parentPath: '/admin/principal',
  link: {
    title: 'Control de Acceso',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
     //pub: 'TabularAccesscontrol',
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
        messageTop: 'Control de Acceso',
        "className": 'btn-floating waves-effect waves-light blue',
          enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Control de Acceso',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Control de Acceso',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    selector:SelectorAccessControl,
    order: [[2, "asc"]],
    columns: [
    {data: "idEmp",title: "ID"},
    {data: "employeeName",title: "Nombre"},
    {
      data: "firstAccess",
      title: "Primer Acceso",
      searchable:false,
      render: function(val){
        var fech = time(val).fecha
        var hour = time(val).hora;
        if (fech === undefined && hour === undefined)  {
          return  "Sin Registro";
        }else {
          return fech+" "+hour;
        }
      }
    }, {
      data: "lastAccess",
      title: "Último Acceso",
      searchable:false,
      render: function(val){
        var fech = time(val).fecha
        var hour = time(val).hora;
        if (fech === undefined && hour === undefined)  {
          return  "Sin Registro";
        }else {
          return fech+" "+hour;
        }
      }
    },
    {
      data: "idCompany",
      title: "Compañia",
      searchable:false,
      render: function(val) {
        var datos=val;
        var result=[];
        for (let i = 0; i < datos.length; i++) {
          var _id=datos[i];
          var Data = Companies.findOne({ _id: _id });
          if (Data !== undefined) {
            result.push(Data.companyName);
          } else {
            result.push("Sin Asignar");
          }
        }
        return result;
      }
    },
  ]
}
});

createdRowFt = function(row, data) {
  var marca = false;
  if (verificaId(data.firstAccess)) {

    var tiempo = cuentaTiempo(mealStartTime(data._id,data.firstAccess),mealFinishTime(data._id,data.firstAccess));
    if (tiempo !== "Sin registro") {
      if (tiempo.horas < "01") {
        marca = false;;

      }else{
        if (tiempo.minutos == "0") {
          marca = false;;
        }else{
          if (tiempo.segundos == "0") {
            marca = false;
          }
        }
        marca = true;
      }
    }
  }
  if (marca) {
    if (Meteor.isClient) {
      $('td:nth-child(7)', row).addClass('red');
    }
  }

};

Accesscontrol.attachSchema(new SimpleSchema({
  idEmployee: {
    type: String,
    label: '_id Colaborador',
    optional: true
  },
  employeeName: {
    type: String,
    label: 'Nombre del Colaborador',
    optional: true
  },
  idEmp: {
    type: Number,
    label: 'ID del Colaborador',
    optional: true
  },
  accessStatus: {
    type: String,
    optional: true,
    label: 'Estatus de Acceso',
  },
  idCompany: {
    type: [String],
    label: 'Compañia',
    optional: true
  },
  meal: {
    type: String,
    label: 'Comida',
    optional: true
  },
  active: {
    type: Boolean,
    label: 'Activo',
    defaultValue: true
  },
  firstAccess: {
    type: Date,
    label: 'Primer Acceso',
    optional: true,
  },
  lastAccess: {
    type: Date,
    label: 'Ultimo Acceso',
    optional: true,
  },
  createdDate: {
    type: String,
    label: 'Fecha de Creación',
    optional: true,
  },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));
Accesscontrol.allow({
  insert: function() {return true;},
  // update: function() {return false;},
  remove: function() {return true;},
  // upsert: function () { return false; }
});
Meals = Accesscontrol;
