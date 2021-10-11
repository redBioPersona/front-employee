
Reports = new orion.collection('reports', {
  singularName: 'Reporte',
  pluralName: 'Reportes',
  title: 'Reportes',
  parentPath: '/admin',
  help: 'Reportes de Asistencia',
  link: {
    title: 'Reportes',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    // autoWidth:false,
    // responsive:true,
    // limit:5,
    //pub:'TabularReports',
    processing: true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    //dom: 'Bfrtip',
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
      ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
		buttons: [{
				extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Reportes',
        "className": 'btn-floating waves-effect waves-light blue',
          enabled:EnableButtonsExport()
			},
			{
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Reportes',
        "className": 'btn-floating waves-effect waves-light red',
          enabled:EnableButtonsExport()
			},
			{
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Reportes',
        "className": 'btn-floating waves-effect waves-light orange',
          enabled:EnableButtonsExport(),
        orientation: 'landscape',
        pageSize: 'A4'
			}
		],
    createdRow: function(row, data) { createdRowPagos(row, data) },
    changeSelector(selector, userId) {
      var agregado=selector["$and"];
      if(agregado!=undefined){
        var otro=agregado[1];
        if(otro!=undefined){
          var bus=otro["$or"];
          if(bus!=undefined){
            if(bus[0]!=undefined && bus[0]["idEmployee"]!=undefined){
              var dato=bus[0]["idEmployee"]["$regex"];
              if(!isNaN(dato)){
                var numero=dato;
                var longNumero=numero.toString();
                if(longNumero.length>1){
                  selector["$and"][1]["$or"].splice(1,1);
                  selector["$and"][1]["$or"].splice(2,1);
                  selector["$and"][1]["$or"].splice(1,1);
                  selector["$and"][1]["$or"][0]["idEmployee"]=parseInt(numero);
                }else{
                  selector["$and"].splice(1,1);
                }
              }else{
                var cadena=dato.toString();
                if(cadena.length >3){
                  selector["$and"][1]["$or"].splice(0,1);
                }else{
                  selector["$and"].splice(1,1);
                }
              }
            }
          }
        }
      }
      return selector;
    },
    selector:SelectorReports,
    columns:[
      { data: "idEmployee", title: "ID",search: { isNumber: true, exact: true } },
      { data: 'employeeName', title: 'NOMBRE',search: { isNumber:false, exact: true } },
      { data: 'idDepartment_txt', title: 'DPTO.', searchable:false, },
      { data: 'idArea_txt', title: 'AREA.', searchable:false, },
      { data: 'idProyecto_txt', title: 'PROYECTO.', searchable:false, },
      { data: 'idDireccion_txt', title: 'DIRECTIVA.', searchable:false, },
      { data: 'idLocation_txt', title: 'LOCALIDAD', searchable:false, },
      {
        data: "idcompany",
        title: "COMPAÑIA",
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
      { data: 'idmanager_txt', title: 'JEFE INMEDIATO', searchable:false, },
      { data: 'fecha', title: 'FECHA' },
      { data: 'inicioOficial', title: 'INICIO OFICIAL',searchable:false },
      { data: 'primerRegistro', title: 'PRIMER REG.', searchable:false},
      { data: 'salidaOficial', title: 'SALIDA OFICIAL' ,searchable:false},
      { data: 'ultimoRegistro', title: 'ÚLTIMO REG.',searchable:false },
      { data: 'tiempo', title: 'TIEMPO',searchable:false },
      { data: 'horas', title: 'HRS.',searchable:false},
      { data: 'estatus', title: 'ESTATUS',searchable:false },
      {data: 'sancion', title: 'SANCIÓN',searchable:false},
      { data: 'excepcion', title: 'EXCEPCIÓN',searchable:false},
      { data: 'antes', title: 'ANTICIPADO',searchable:false,render:function(val){
          return GetAnticipado(val);
        }
      },
      { data: 'idDevice', title: 'AUTENTICADO',searchable:false},
      { data: 'idLocationChk_txt', title: 'LOCALIDAD DE REGISTRO',searchable:false},
  ],
  //pageLength: 500,
  //stateSave: false
}
});

Reports.attachSchema(new SimpleSchema({
  _idEmployee: { type: String,optional: true, label: 'Colaborador'},
  idEmployee: { type: Number,    optional: true, label: 'Id Colaborador'},
  employeeName: { type: String,     optional: true,label: 'Nombre del Colaborador'},
  idLocation: { type: String,     optional: true,label: 'Nombre de la Localidad'},
  idLocation_txt: { type: String,     optional: true,label: 'Nombre de la Localidad'},
  idDepartment: { type: String,    optional: true, label: 'Departamento'},
  idDepartment_txt: { type: String,    optional: true, label: 'Departamento'},
  idcompany: { type: [String],     optional: true,label: 'Localidad'},
  idmanager: { type: String,     optional: true,label: 'Id Empleado'},
  idmanager_txt: { type: String,     optional: true,label: 'Id Colaborador'},
  inicioOficial: { type: String,    optional: true, label: 'Id Empleado'},
  salidaOficial: { type: String,    optional: true, label: 'Id Empleado'},
  estatus: { type: String,     optional: true,label: 'Id Empleado'},
  fecha: { type: String,    optional: true, label: 'Id Empleado'},
  primerRegistro: { type: String,    optional: true, label: 'Id Empleado'},
  ultimoRegistro: { type: String,    optional: true, label: 'Id Empleado'},
  fechaIni: {type: Date,optional: true, label: 'Id Empleado'},
  fechaFin: {type: Date,optional: true, label: 'Id Empleado'},
  excepcion: { type: String,    optional: true, label: 'Id Empleado'},
  tiempo: { type: String,    optional: true, label: 'Id Empleado'},
  horas: { type: String,    optional: true, label: 'Id Empleado'},
  sancion: { type: String,    optional: true, label: 'Id Empleado'},
  antes: { type: String,    optional: true, label: 'Id Empleado'},
  idDevice: { type: String,    optional: true, label: 'Dispositivo'},
  idLocationChk: { type: String,     optional: true,label: 'Nombre de la Localidad Registro'},
  idLocationChk_txt: { type: String,     optional: true,label: 'Nombre de la Localidad Registro'},
  idpagadora: { type: String,     optional: true,label: 'Nombre del outsourcing'},
  idpagadora_txt: { type: String,     optional: true,label: 'Nombre del outsourcing'},
  idDireccion: { type: String,     optional: true,label: 'Nombre de la directiva'},
  idDireccion_txt: { type: String,     optional: true,label: 'Nombre de la directiva'},
  idProyecto: { type: String,     optional: true,label: 'Nombre de la directiva'},
  idProyecto_txt: { type: String,     optional: true,label: 'Nombre de la directiva'},
  idArea: { type: String,     optional: true,label: 'Nombre del area'},
  idArea_txt: { type: String,     optional: true,label: 'Nombre del area'},
  idEmpPosition: { type: String,     optional: true,label: 'Nombre del area'},
  idEmpPosition_txt: { type: String,     optional: true,label: 'Nombre del area'},
}));


ReportsConcentrados = new orion.collection('reportsconcentrados', {
  singularName: 'Reporte',
  pluralName: 'Reportes',
  ShowFilter:true,
  title: 'Reportes concentrados',
  parentPath: '/admin',
  help: 'Reportes de Asistencia Concentrados, oculta a los empleados dados de baja',
  link: {
    title: 'Reportes',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    processing: true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_',
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
        messageTop: 'Reportes concentrados',
        "className": 'btn-floating waves-effect waves-light blue',
          enabled:EnableButtonsExport()
			},
			{
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Reportes concentrados',
        "className": 'btn-floating waves-effect waves-light red',
          enabled:EnableButtonsExport()
			},
			{
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Reportes concentrados',
        "className": 'btn-floating waves-effect waves-light orange',
          enabled:EnableButtonsExport(),
        orientation: 'landscape',
        pageSize: 'A4'
			}
		],
    selector:SelectorReports,
    columns:[
      { data: "idEmployee", title: "ID",search: { isNumber: true, exact: true } },
      { data: 'employeeName', title: 'NOMBRE',search: { isNumber:false, exact: true } },
      { data: 'idEmpPosition_txt', title: 'PUESTO', searchable:false, },
      { data: 'idEmpStatus_txt', title: 'ESTATUS', searchable:false, },
      { data: 'idDepartment_txt', title: 'DEPARTAMENTO', searchable:false, },
      { data: 'idLocation_txt', title: 'LOCALIDAD', searchable:false, },
      { data: 'idmanager_txt', title: 'JEFE INMEDIATO', searchable:false, },
      { data: 'idpagadora_txt',title:'OUTSOURCING', searchable:false, },      
      { data: 'idDireccion_txt', title: 'DIRECTIVA', searchable:false, },
      { data: 'idProyecto_txt', title: 'PROYECTO', searchable:false, },
      { data: 'idArea_txt', title: 'AREA', searchable:false, },
      { data: 'fechaIni_txt', title: 'INICIO', searchable:false, },
      { data: 'fechaFin_txt', title: 'FIN', searchable:false, },
      { data: 'faltas', title: 'FALTAS', searchable:false, },
      { data: 'retardos', title: 'RETARDOS', searchable:false, },
      { data: 'registros', title: 'REGISTROS', searchable:false, },
      { data: 'excepciones', title: 'EXCEPCIONES', searchable:false, },
      { data: 'anticipadas', title: 'ANTICIPADAS', searchable:false, },
      { data: 'vacaciones', title: 'VACACIONES', searchable:false, },
      { data: 'permisos', title: 'PERMISOS', searchable:false, },
      { data: 'justificantes', title: 'JUSTIFICANTES', searchable:false, },
      { data: 'tickets', title: 'TICKETS', searchable:false, },
      { data: 'extra_reg', title: 'REG. TIEMPO EXTRA', searchable:false, },
      { data: 'extra_time', title: 'TIEMPO EXTRA', searchable:false, },
      orion.attributeColumn('updatedBy', 'updatedBy', "ACTUALIZADO POR"),
      orion.attributeColumn('updatedAt', 'updatedAt', "ACTUALIZADO"),
  ],
}
});

ReportsConcentrados.attachSchema(new SimpleSchema({
  _idEmployee: { type: String,optional: true, label: 'Colaborador'},
  idEmployee: { type: Number,    optional: true, label: 'Id Colaborador'},
  employeeName: { type: String,     optional: true,label: 'Nombre del Colaborador'},
  idEmpPosition: { type: String,     optional: true,label: 'Nombre del Puesto'},
  idEmpPosition_txt: { type: String,     optional: true,label: 'Nombre del Puesto'},
  idEmpStatus: { type: String,     optional: true,label: 'Estatus'},
  idEmpStatus_txt: { type: String,     optional: true,label: 'Estatus'},
  idcompany: { type: [String],     optional: true,label: 'Compañia'},
  idcompany_txt: { type: String,     optional: true,label: 'Compañia'},
  idDepartment: { type: String,    optional: true, label: 'Departamento'},
  idDepartment_txt: { type: String,    optional: true, label: 'Departamento'},
  idLocation: { type: String,     optional: true,label: 'Nombre de la Localidad'},
  idLocation_txt: { type: String,     optional: true,label: 'Nombre de la Localidad'},  
  idmanager: { type: String,     optional: true,label: 'Jefe'},
  idmanager_txt: { type: String,     optional: true,label: 'Jefe'},  
  idpagadora: { type: String,     optional: true,label: 'Nombre del outsourcing'},
  idpagadora_txt: { type: String,     optional: true,label: 'Nombre del outsourcing'},
  idDireccion: { type: String,     optional: true,label: 'Nombre de la directiva'},
  idDireccion_txt: { type: String,     optional: true,label: 'Nombre de la directiva'},
  idProyecto: { type: String,     optional: true,label: 'Nombre de la Proyecto'},
  idProyecto_txt: { type: String,     optional: true,label: 'Nombre de la Proyecto'},
  idArea: { type: String,     optional: true,label: 'Nombre del area'},
  idArea_txt: { type: String,     optional: true,label: 'Nombre del area'},
  fechaIni: {type: Date,optional: true, label: 'Fecha Inicial de la busqueda'},
  fechaFin: {type: Date,optional: true, label: 'Fecha final de la busqueda'},
  fechaIni_txt: {type: String,optional: true, label: 'Fecha Inicial de la busqueda'},
  fechaFin_txt: {type: String,optional: true, label: 'Fecha final de la busqueda'},
  faltas: { type: Number,    defaultValue:0, label: 'Faltas'},
  retardos: { type: Number,    defaultValue:0, label: 'Retardos'},
  registros: { type: Number,    defaultValue:0, label: 'Registros'},
  excepciones: { type: Number,    defaultValue:0, label: 'Excepciones'},
  anticipadas: { type: Number,    defaultValue:0, label: 'Salidas anticipadas'},
  vacaciones: { type: Number,    defaultValue:0, label: 'Vacaciones'},
  permisos: { type: Number,    defaultValue:0, label: 'Permisos'},
  justificantes: { type: Number,    defaultValue:0, label: 'Justificantes'},
  tickets: { type: Number,    defaultValue:0, label: 'Tickets'},
  extra_reg: { type: Number,    defaultValue:0, label: 'Tiempo extra'},
  extra_time:{ type: String,    optional: true, label: 'Tiempo extra'},
  createdBy: orion.attribute('createdBy', { optional: true }),
  createdAt: orion.attribute('createdAt', { optional: true }),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));

createdRowPagos = function(row, data) {
  if (data.estatus=="Falta") {
    var name=data.employeeName;
    var fecha=data.fecha;
    var idEmployee= parseInt(data.idEmployee);
    var DataEmp=Persons.findOne({"idEmployee" : idEmployee});
    if(DataEmp!=undefined){
      var getVacations=Vacations.find({idEmployee:DataEmp._id}).fetch();
      for (let i = 0; i < getVacations.length; i++) {
        var id=getVacations[i].idEmployee;
        var today=getVacations[i].fechaIni;
        var dia = today.getDate();
        var mes = today.getMonth() + 1;
        var anio = today.getFullYear();
        dia = setDateZero(dia);
        mes = setDateZero(mes);
        var fech = dia + "/" + mes + "/" + anio;
        if (idEmployee==id&&fech==fecha) {
          if (Meteor.isClient) {
            $('td', row).addClass('blue lighten-3');
          }
        }
      }
    }
  }
};

//******************************************************************
Days = new orion.collection('days', {
  singularName: 'asignación de horario',
  pluralName: 'Horarios de semana',
  CanAdd:true,
  title: 'Horario',
  help:'Módulo de asignación de jornada / horario laboral ',
  parentPath: '/admin',
  link: { title: 'Días', parent: '_template' },
  tabular: {
    scrollX: true,
    "processing": true,
    pub:'TabularDays',
    // search: {
    //     regex: true,
    //     caseInsensitive: true,
    //     smart: false,
    //     onEnterOnly: false,
    //   },
    //   changeSelector: function(selector, userId) {
    //
    //     var data=selector["$or"];
    //     console.log("data "+JSON.stringify(data));
    //
    //     return selector;
    // },
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
        messageTop: 'Horario de los Colaboradores',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Horario de los Colaboradores"),
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light red'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:creaTitulosDeArchivos("Horario de los Colaboradores"),
        filename:creaTitulosDeArchivos("Horario de los Colaboradores"),
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light orange',
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
    selector:SelectorJustCompany,
    columns: [
      { data: "idEmp", title: "Id", search: {isNumber: true, exact: true}},
      { data: "employeeName", title: "Colaborador",search: { isNumber:false,smart:false, exact: true,caseInsensitive: true}},
      { data:"idHorario", title: 'Lunes',searchable:false, render: function(val){return render_getHorarioLunes(val);} },
      { data:"idHorario", title: 'Martes', searchable:false,render: function(val){return render_getHorarioMartes(val);} },
      { data:"idHorario", title: 'Miercoles',searchable:false, render: function(val){return render_getHorarioMiercoles(val);} },
      { data:"idHorario", title: 'Jueves', searchable:false,render: function(val){return render_getHorarioJueves(val);} },
      { data:"idHorario", title: 'Viernes', searchable:false,render: function(val){return render_getHorarioViernes(val);} },
      { data:"idHorario", title: 'Sabado',searchable:false, render: function(val){return render_getHorarioSabado(val);} },
      { data:"idHorario", title: 'Domingo', searchable:false,render: function(val){return render_getHorarioDomingo(val);} },
      orion.attributeColumn('createdByXP', 'createdBy', 'Creado por'),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedByXP', 'updatedBy', 'Actualizo'),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
    ]
  }
});
valida = function(val){
  if (val) {
    if (val==undefined) { return "Sin Asignar"; }
    else { return val; }
  }
  else { return "Sin Asignar"; }
}
horarios = function(obj){
  if (obj) {
    var horario = '';
    horario +=
    "Entrada: "+valida(obj.Entrada)+"\n"+
    "Salida: "+valida(obj.Salida)+"\n"+
    "Comida Inicio: "+valida(obj.ComidaInicio)+"\n"+
    "Comida Fin: "+valida(obj.ComidaFin);
    return horario;
  }else {
    return "Sin asignar"
  }
}
render_getHorarioLunes = function(val){
  var result;
  if (val) {
    var data=Horarios.findOne({_id:val});
    if (data!=undefined) {
      if (data.lunes!=undefined) {
        result="Entrada: "+valida(data.lunes.Entrada)+"\n"+
        "Salida: "+valida(data.lunes.Salida)+"\n"+
        "Comida Inicio: "+valida(data.lunes.ComidaInicio)+"\n"+
        "Comida Fin: "+valida(data.lunes.ComidaFin);
      }else{ result="Sin asignar"; }
    }else { result="Sin asignar"; }
  }else { result="Sin asignar"; }
  return result;
};

render_getHorarioMartes = function(val){
  var result;
  if (val) {
    var data=Horarios.findOne({_id:val});
    if (data!=undefined) {
      if (data.martes!=undefined) {
        result="Entrada: "+valida(data.martes.Entrada)+"\n"+
        "Salida: "+valida(data.martes.Salida)+"\n"+
        "Comida Inicio: "+valida(data.martes.ComidaInicio)+"\n"+
        "Comida Fin: "+valida(data.martes.ComidaFin);
      }else{ result="Sin asignar"; }
    }else{ result="Sin asignar"; }
  }else { result="Sin asignar"; }
  return result;
};

render_getHorarioMiercoles = function(val){
  var result;
  if (val) {
    var data=Horarios.findOne({_id:val});
    if (data!=undefined) {
      if (data.miercoles!=undefined) {
        result="Entrada: "+valida(data.miercoles.Entrada)+"\n"+
        "Salida: "+valida(data.miercoles.Salida)+"\n"+
        "Comida Inicio: "+valida(data.miercoles.ComidaInicio)+"\n"+
        "Comida Fin: "+valida(data.miercoles.ComidaFin);
      }else{ result="Sin asignar"; }
    }else{ result="Sin asignar"; }
  }else { result="Sin asignar"; }
  return result;
};

render_getHorarioJueves = function(val){
  var result;
  if (val) {
    var data=Horarios.findOne({_id:val});
    if (data!=undefined) {
      if (data.jueves!=undefined) {
        result="Entrada: "+valida(data.jueves.Entrada)+"\n"+
        "Salida: "+valida(data.jueves.Salida)+"\n"+
        "Comida Inicio: "+valida(data.jueves.ComidaInicio)+"\n"+
        "Comida Fin: "+valida(data.jueves.ComidaFin);
      }else{ result="Sin asignar"; }
    }else{ result="Sin asignar"; }
  }else { result="Sin asignar"; }
  return result;
};

render_getHorarioViernes= function(val){
  var result;
  if (val) {
    var data=Horarios.findOne({_id:val});
    if (data!=undefined) {
      if (data.viernes!=undefined) {
        result="Entrada: "+valida(data.viernes.Entrada)+"\n"+
        "Salida: "+valida(data.viernes.Salida)+"\n"+
        "Comida Inicio: "+valida(data.viernes.ComidaInicio)+"\n"+
        "Comida Fin: "+valida(data.viernes.ComidaFin);
      }else{ result="Sin asignar"; }
    }else{ result="Sin asignar"; }
  }else { result="Sin asignar"; }
  return result;
};

render_getHorarioSabado = function(val){
  var result;
  if (val) {
    var data=Horarios.findOne({_id:val});
    if (data!=undefined) {
      if (data.sabado!=undefined) {
        result="Entrada: "+valida(data.sabado.Entrada)+"\n"+
        "Salida: "+valida(data.sabado.Salida)+"\n"+
        "Comida Inicio: "+valida(data.sabado.ComidaInicio)+"\n"+
        "Comida Fin: "+valida(data.sabado.ComidaFin);
      }else { result="Sin asignar"; }
    }else{ result="Sin asignar"; }
  }else { result="Sin asignar"; }
  return result;
};

render_getHorarioDomingo = function(val){
  var result;
  if (val) {
    var data=Horarios.findOne({_id:val});
    if (data!=undefined) {
      if (data.domingo!=undefined) {
        result="Entrada: "+valida(data.domingo.Entrada)+"\n"+
        "Salida: "+valida(data.domingo.Salida)+"\n"+
        "Comida Inicio: "+valida(data.domingo.ComidaInicio)+"\n"+
        "Comida Fin: "+valida(data.domingo.ComidaFin);
      }else { result="Sin asignar"; }
    }else{ result="Sin asignar"; }
  }else { result="Sin asignar"; }
  return result;
};

render_tolerancia=function(obj){
  var result;
  if (obj) {
    for (let i = 0; i < obj.length; i++) {
      var status=obj[i].status;
      var tiempo=obj[i].tiempo;
      var sancion=obj[i].sancion;
      var sancion_desc="";
      var sancionesData=Sanciones.findOne({_id:sancion});
      if (sancionesData!=undefined) {
        var sancion_cve=sancionesData.clave;
        var sancion_eti=sancionesData.etiqueta;
        var sancion_titulo=sancion_cve+" "+sancion_eti;
        sancion_desc=sancionesData.descuento;
      }
      result+=status+" "+tiempo+" min, "+sancion_desc+"\n";
    }
  }else{
    result="Sin asignar";
  }
  result = result.replace("undefined", "");
  return result;
}

Days.attachSchema(new SimpleSchema({
  idEmployee: {
    type: String,
    label: 'Empleado',
    help:"Nombre del colaborador al cual se le asignara horario",
    example:"---",
    autoform: {
      type: "hidden"
    }
  },
  idEmp: {
    type: Number,
    label: 'Empleado',
    optional: true,
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      var id = this.siblingField("idEmployee").value;
      if (id) {
        var entity = Persons.findOne({
          _id: id
        });
        var value = "";
        var fields = ["idEmployee"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Persons.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Persons.simpleSchema()._schema[fields[i]].orion.titleField;
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
          return parseInt(value);
        } else if (this.isUpsert) {
          return {
            $setOnInsert: parseInt(value)
          };
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    },
  },
  employeeName: {
    type: String,
    label: 'Colaborador',
    help:"Nombre del colaborador al cual se le asignara horario",
    example:"---",
    optional: true,
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      var id = this.siblingField("idEmployee").value;
      if (id) {
        var entity = Persons.findOne({
          _id: id
        });
        var value = "";
        var fields = ["employeeName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Persons.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Persons.simpleSchema()._schema[fields[i]].orion.titleField;
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
  idEmployee: orion.attribute('hasOne', {
    label: 'Colaborador',
    help:"Nombre del colaborador al cual se le asignara horario",
    example:"---",
  }, {
    collection: Persons,
    titleField: ['employeeName'],
    customPublication:true,
    publicationName: 'GetSelectOnePersons'
  }),
  idHorario: {
    type: String,
    label: 'Horario',
    autoform: {
      type: "hidden"
    }
  },
  idHorario: orion.attribute('hasOne', {
    label: 'Horario',
    help:"Horario / Jornada Laboral por aplicarse",
    example:"---",
  }, {
    collection: Horarios,
    titleField: ['clave'],
    customPublication:true,
    publicationName: 'GetSelectOneHorarios'
  }),
  idcompany: orion.attribute('hasMany', {
    label: 'Compañia',
    help:"Nombre de la compañia",
    example:"---",
    optional:false
  }, {
    collection: Companies,
    titleField: ['companyName'],
    publicationName: 'Departments_Compañia',
    validateOnServer: false,
    filter: function(userId) {
      if (userId) {
        var user = Meteor.users.findOne(userId);
        if (Roles.userHasRole(userId,"admin")) {
          return { _id: {$ne: ""}};
        }else {
          return { _id:{$in: user.profile.idcompany }};
        }
      }
    }
  }),
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));

Vacations = new orion.collection('vacations', {
  singularName: 'Vacaciones',
  pluralName: 'Vacaciones',
  title: 'Vacaciones',
  help:'Vacaciones de los Colaboradores',
  CanAdd:true,
  parentPath: '/admin',
  link: { title: 'Vacaciones', parent: '_template' },
  tabular: {
    scrollX: true,
    "processing": true,
     pub: 'TabularVacations',
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
        messageTop: 'Vacaciones',
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light blue'
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Permisos"),
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light red'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:creaTitulosDeArchivos("Vacaciones"),
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light orange',
        exportOptions: { modifier: { page: 'current' } }
      }
    ],
    selector:Selector_MyRecords,
    order: [[2, "desc"]],
    columns: [
    { data: "idEmp", title: "Id Colaborador", },
    { data: "employeeName", title: "Nombre del Colaborador", },
    { data: "fechaIni", title: "Inicio de vacaciones", render: function(val){ return formatJustDate(val); } },
    { data: "fechaFin", title: "Fin de vacaciones", render: function(val){ return formatJustDate(val); } },
    { data: "days_vacations", title: "Días de vacaciones" },
    orion.attributeColumn('createdByXP', 'createdBy', "Inserto"),
    {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
    orion.attributeColumn('updatedByXP', 'updatedBy', "Actualizo"),
    {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
}
});


Vacations.attachSchema(new SimpleSchema({
  idEmployee: orion.attribute('hasOne', {
    label: 'Colaborador',
    help:"Nombre del colaborador que disfrutara de las vacaciones",
    example:"---",
  }, {
    collection: Persons,
    titleField: ['employeeName'],
    customPublication:true,
    publicationName: 'GetSelectOnePersons',
  }),
  employeeName: {
    type: String,
    label: 'employeeName',      
    autoform: { type: "hidden" },
    autoValue: function() {
      var id = this.siblingField("idEmployee").value;
      if (id) {
        var entity = Persons.findOne({ _id: id });
        var valor = "";
        var fields = ["employeeName"];
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
              valor = valor + " " + res;
            }
          } else {
            valor = valor + " " + entity[fields[i]];
          }
        }
        
        if (this.isInsert && (this.value == null || !this.value.length)) {
          return valor;
        }
        if (this.isUpdate && this.isSet && this.operator === '$unset') {
          return { $set: valor};
        }
        if (this.isUpdate) {
          return valor;
        }
        if (this.isUpsert) {
          return valor;
        }
      } else {
        return "";
      }
    },
    optional: true,
  },
  idEmp: {
    type: Number,
    label: 'Colaborador',
    optional: true,
    autoform: { type: "hidden" },
    autoValue: function() {
      var id = this.siblingField("idEmployee").value;
      if (id) {
        var entity = Persons.findOne({ _id: id });
        var value;
        var fields = ["idEmployee"];
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
              value = res;
            }
          } else {
            value = entity[fields[i]];
          }
        }
        if (this.isInsert || this.isUpdate) {
          return parseInt(value);
        } else if (this.isUpsert) {
          return {
            $setOnInsert: parseInt(value)
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
    label: 'Fecha Inicial',
    help:"Fecha inicial de las vacaciones",
    example:moment().format("DD/MM/YYYY").toString(),
    optional: false,
    autoform: {
      type: "pickadate",
      pickadateOptions: {
        format: 'dd/mm/yyyy',
        selectMonths: true,
        selectYears: 5,
        max:45
      }
    },
  },
  fechaFin: {
    type: Date,
    label: 'Fecha final',
    help:"Fecha final de las vacaciones",
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
    label:'Días de vacaciones',
    optional:false,
    help:"Cantidad de días de vacaciones a disfrutar",
    example:"2",
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
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));


Feriados = new orion.collection('feriados', {
  singularName: 'Feriados',
  pluralName: 'Feriados',
  CanAdd:true,
  title: 'Feriados',
  parentPath: '/admin',
  help:'Días feriados no laborables',
  link: { title: 'Feriados', parent: '_template' },
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
        messageTop: 'Días Feriados',
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light blue'
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Dias Feriados"),
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light red'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:creaTitulosDeArchivos("Dias Feriados"),
        enabled:EnableButtonsExport(),
        "className": 'btn-floating waves-effect waves-light orange',
        exportOptions: { modifier: { page: 'current' } }
      }
    ],
      selector:SelectorArrayCompany,
      order: [[0, "desc"]],
  columns: [
    {
      data: "fecha",
      title: "Fecha",
      render: function(val){ return formatJustDate(val); }
    },
    {
      data: "comentarios",
      title: "Comentarios"
    },
    orion.attributeColumn('createdByXP', 'createdBy', "Inserto"),
    {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
    orion.attributeColumn('updatedByXP', 'updatedBy', "Actualizo"),
    {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
}
});


Feriados.attachSchema(new SimpleSchema({
  fecha: {
    type: Date,
    label: 'Fecha',
    help:"Fecha no laborable, los registros con faltas serán eliminados",
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
  fecha_txt: {
    type: String,
    label: 'Fecha Txt',
    optional: true,
    autoform: {type: "hidden"},
    autoValue: function() {
			var id = this.siblingField("fecha").value;
			if (id) {
				var fecha = new Date(id);
				var mes2 = fecha.getMonth() + 1;
				var mes = setDateZero(mes2);
				var anio = fecha.getFullYear();
				var dia2 = fecha.getDate();
				var dia = setDateZero(dia2);
				var fechaFormateada = dia + '/' + mes + '/' + anio;
				if (this.isInsert || this.isUpdate) {
					return fechaFormateada;
				} else if (this.isUpsert) {
					return {
						$setOnInsert: fechaFormateada
					};
				} else {
					this.unset();
				}
			}
		}
  },
  comentarios: {
    type: String,
    label: 'Comentarios',
    optional:false,
    help:"Comentarios, datos de la fecha a celebrar",
    example:"1 de Mayo día del trabajo",
    autoform: {
      type: "textarea"
    }
  },
  active: {
    type: Boolean,
    label: 'Activo',
    help:"Registro activo",
    example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    defaultValue: true
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
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));

Extra_time = new orion.collection('extra_time', {
  singularName: 'Tiempo Extra',
  pluralName: 'Tiempo Extra',
  title: 'Tiempo Extra',
  help:'Registros que indican el tiempo extra laborado',
  parentPath: '/admin',
  ShowFilter:true,
  CanAdd:false,
  link: { title: 'Tiempo Extra', parent: '_template' },
  tabular: {
    scrollX: true,
    autoWidth:false,
    responsive:true,
    pub:'TabularExtra_time',
    // limit:5,
    processing: true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {
        first: 'Primero',
        previous: 'Anterior',
        next: 'Siguiente',
        last: 'Último',
      }
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ], buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Tiempo Extra',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Tiempo Extra"),
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:creaTitulosDeArchivos("Tiempo Extra"),
        filename:creaTitulosDeArchivos("Tiempo Extra"),
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        "className": 'btn-floating waves-effect waves-light orange',
        exportOptions: { modifier: { page: 'current' } },
        customize: function(doc) {doc.defaultStyle.fontSize =7;}
      }
    ],
    selector:SelectorJustCompany,
    columns:[
      { data: "idEmployee", title: "ID" },
      { data: 'employeeName', title: 'NOMBRE' },
      {
        data: "idcompany",
        title: "COMPAÑIA",
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
      {
        data: 'idDepartment_txt',
        title: 'DEPARTAMENTO',
        searchable:false,
        // render: function(val) {
        //   var Data = Departments.findOne({
        //     _id: val
        //   });
        //   if (Data !== undefined) {
        //     return Data.departmentName;
        //   } else {
        //     return "Sin Asignar";
        //   }
        // }
      },
      {
        data: 'idLocation_txt',
        title: 'LOCALIDAD',
        searchable:false,
        // render: function(val) {
        //   var Data = Locations.findOne({ _id: val });
        //   if (Data !== undefined) {
        //     return Data.locationName;
        //   } else {
        //     return "Sin Asignar";
        //   }
        // }
      },
      { data: 'fecha', title: 'FECHA' },
      { data: 'inicioOficial', title: 'INICIO OFICIAL',searchable:false},
      { data: 'inicioLaborado', title: 'PRIMER REGISTRO', searchable:false},
      { data: 'salidaOficial', title: 'SALIDA OFICIAL',searchable:false },
      { data: 'salidaLaborado', title: 'ÚLTIMO REGISTRO',searchable:false },
      { data: 'tiempoOficial', title: 'TIEMPO OFICIAL',searchable:false},
      { data: 'tiempoLaborado', title: 'TIEMPO LABORADO',searchable:false}
    ],
    stateSave: false
  }
});


UserProfileSchema = new SimpleSchema({
  idcompany: orion.attribute('hasMany', {
    label: 'Nombre de la compañia',
    defaultValue: "D2fAsYyrBhQXP6uuC"
  }, {
    collection: Companies,
    titleField: ['companyName'],
    publicationName: 'Empleados_compania_user',
    validateOnServer: false,
    filter: function(userId) {
      if (userId) {
        var user = Meteor.users.findOne(userId);
        if (Roles.userHasRole(userId,"admin")) {
          return { _id: {$ne: ""}};
        }else if(Roles.userHasRole(userId, "Usuario Administrador") == true){
          return { _id:{$in:user.profile.idcompany} };
        }else if( Roles.userHasRole(userId, "Usuario")==true||
        Roles.userHasRole(userId, "Supervisor") == true){
        }
      }
    }
  }),
  idEmployee: {
    type: String,
    label: 'Empleado',
    optional: true,
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      var id = this.siblingField("idEmployee").value;
      if (id) {
        var entity = Persons.findOne({ _id: id });
        var value = "";
        var fields = ["employeeName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Persons.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Persons.simpleSchema()._schema[fields[i]].orion.titleField;
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
  idEmployee: orion.attribute('hasOne', {
    label: 'Empleado',
    optional:true,
  }, {
    collection: Persons,
    titleField: ['employeeName'],
    customPublication:true,
    publicationName: 'GetSelectOnePersons',
  })
});

orion.accounts.profileSchema = new SimpleSchema({
  profile: {
    type: UserProfileSchema
  }
});
