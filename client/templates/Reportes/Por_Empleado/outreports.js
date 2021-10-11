  Template.orionMaterializeIndeOutReports.helpers({
    GetColorIconBack:function(){
      return GetColorIconBack();
    },
    getLiv_totales_det_vwTabular: function() {
      cols = [
        { data: "idEmployee", title: "ID",search: { isNumber: true, exact: true }},
        { data: 'employeeName', title: 'NOMBRE',search: { isNumber: false, exact: true }},
        { data: 'idLocation_txt', title: 'LOCALIDAD', searchable:false, },
        { data: 'fecha', title: 'FECHA',searchable:false },
        { data: 'inicioOficial', title: 'INICIO OFICIAL',searchable:false },
        { data: 'primerRegistro', title: 'PRIMER REG.',searchable:false },
        { data: 'salidaOficial', title: 'SALIDA OFICIAL',searchable:false },
        { data: 'ultimoRegistro', title: 'ÚLTIMO REG.',searchable:false },
        { data: 'tiempo', title: 'TIEMPO',searchable:false },
        { data: 'horas', title: 'HRS.' ,searchable:false },
        { data: 'estatus', title: 'ESTATUS' ,searchable:false },
        { data: 'sancion', title: 'SANCIÓN' ,searchable:false },
        { data: 'excepcion', title: 'EXCEPCIÓN' ,searchable:false },
        { data: 'antes',title: 'ANTICIPADO',searchable:false,render:function(val){
          var result="-";
          if(val=="false"){
            result="No"
          }else if(val=="true"){
            result="Si";
          }
          return result;
        }
        },
        { data: 'idDevice', title: 'AUTENTICADO',searchable:false},
        { data: 'idLocationChk_txt', title: 'LOCALIDAD DE REGISTRO',searchable:false},
        { data: 'idpagadora_txt', title: 'OUTSOURCING',searchable:false},
        { data: 'idDireccion_txt', title: 'DIRECTIVA',searchable:false},
        { data: 'idProyecto_txt', title: 'PROYECTO',searchable:false},
        { data: 'idEmpPosition_txt', title: 'PUESTO',searchable:false},
        { data: 'idDepartment_txt', title: 'DEPARTAMENTO',searchable:false},
        { data: 'idmanager_txt', title: 'JEFE',searchable:false},
        { data: 'idArea_txt', title: 'AREA',searchable:false},
      ];
      Reports.tabularTable.pub="TabularReportsOnePerson";
      Reports.tabularTable.options.columns = cols;
      return Reports.tabularTable;
    },
    getName:function(){
      var _id=Session.get('SearchEmployee');
      if(_id!=undefined){
        Meteor.subscribe('OnePerson', _id);
        var ex=Persons.findOne({_id:_id});
        if(ex!=undefined){
          var name=ex.employeeName;
          if(name){
            return "REGISTROS DE "+name;
          }          
        }
      }
    },
    ColorTabularIndex:function(){
      return ColorTabularIndex();
    },
    selector:function(){
      var fechaInicio=Session.get('fechaInicio');
      var fechaFin=Session.get('fechaFin');
      var _idEmployee=Session.get('SearchEmployee');

      var busqueda={
        $and:[
          {"_idEmployee":_idEmployee},
          {fechaIni:{$gte:fechaInicio,$lt:fechaFin}}
        ]
      };
      return busqueda;
    }
  });

Template.orionMaterializeIndeOutReports.events({
  "click #back": function(event, template){
     window.history.back();
  }
});

Template.orionMaterializeIndeAcargo.rendered = function () {
  var _id=Session.get('SearchEmployee');
  Meteor.call("getJefeName",_id,function(err,res){
    if(err){
      Session.set("orionMaterializeIndeAcargogetName","algo");
    }else{
      Session.set("orionMaterializeIndeAcargogetName","COLABORADORES A CARGO DE "+res.toUpperCase());
    }
  });
}

Template.orionMaterializeIndeAcargo.helpers({
  GetColorIconBack:function(){
    return GetColorIconBack();
  },
  getLiv_totales_det_vwTabular: function() {
    var cols= [
      { data: "idEmployee", title: "Id Colaborador" },
      { data: "employeeName", title: "Nombre" },
      orion.attributeColumn('image', 'face', 'Foto'),
      { data: "idEmpPosition_txt", title: "Puesto" },
      { data: "idEmpStatus_txt", title: "Estatus", searchable:false},
      {
        data: "idcompany",
        title: "Compañia",
        searchable:false,
        render: function(val) {
          var datos=val;
          var result=[];
          for (let i = 0; i < datos.length; i++) {
            var _id=datos[i];
            var Data = Companies.findOne({ _id: _id });
            if (Data !== undefined) { result.push(Data.companyName); }
            else { result.push("Sin Asignar"); }
          }
          return result;
        }
      },
      { data: "idDepartment_txt", title: "Departamento",searchable:false },
      { data: "idLocation_txt", title: "Localidad",searchable:false },
      { data: "hireDate", title: "Fecha de Contratación",searchable:false, render: function(val){ return formatJustDate(val); } },
      { data: "empPhoneNbr", title: "Teléfono fijo", searchable:false,},
      { data: "empCellNbr", title: "Teléfono celular", searchable:false,},
      { data: "empEmail", title: "Email", searchable:false,},
      { data: "idmanager_txt", title: "Jefes",searchable:false},
      { data: "roles", title: "Roles",searchable:false, },
      { data: "mealsEmp", title: "Imprimir Ticket", searchable:false,render(val){ if (val) { return "<img src='/images/check.png' width='25px'>"}else{return "<img src='/images/denied.png' width='25lpx'>"}} },
      // { data: "dismissalDate", title: "Fecha de baja definitiva",searchable:false, render: function(val){ return formatJustDate(val); } },
      { data: "idpagadora_txt", title: "Outsourcing", searchable:false},
      { data: "idDireccion_txt", title: "Directiva", searchable:false},
      { data: "idProyecto_txt", title: "Proyecto", searchable:false},
      orion.attributeColumn('createdByXP', 'createdBy', 'Inserto'),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedBy', 'updatedBy', 'Actualizo'),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}      
    ];
    Persons.tabularTable.options.columns = cols;
    return Persons.tabularTable;
  },
  getNameX:function(){
    var a=Session.get("orionMaterializeIndeAcargogetName");
    if(a){
      return a;
    }    
  },
  ColorTabularIndex:function(){
    return ColorTabularIndex();
  },
  selector:function(){
    var _idEmployee=Session.get('SearchEmployee');
    var busqueda={
      $and:[
        {"idmanager":_idEmployee},
      ]
    };
    return busqueda;
  }
});

Template.orionMaterializeIndeAcargo.events({
"click #back": function(event, template){
   window.history.back();
}
});