if (Meteor.isClient) {
  Template.registerHelper("navWidget", function(path, parentPath) {
    Session.set('parentPath', parentPath);
    return path;
  });

  Template.registerHelper("getParentPath", function() {
    return Session.get('parentPath');
  });

  Template.registerHelper('showField', function(table, field) {
    if (Roles.userHasRole(Meteor.userId(), 'admin')) {
      return true;
    } else if (field == 'active') {
      return true;
    } else if (table == 'Documentos' && field == 'doc_status') {
      return false;
    } else {
      return true;
    }
  });

  Template.orionMaterializeCollectionsSelectIndex_XP.helpers({
    myCollection: function() {
      return Empleados;
    }
  });

  function ActivateKeyBoardSearch(){
    var isStation=Config_application.findOne({"active":true});
    if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false&& isStation.showKeyboard==true){
        $("input[type='search']").keyboard({
          layout: 'qwerty',
          change:function(event,keyboard,el){
            Session.set("ValSearch",keyboard.$preview.val());
          }
        });
    }
  }

  function disabledEventPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }

  Template.orionMaterializeCollectionsSelectIndex_XP.events({
    "click tr": function(event) {
      console.log("click");
      disabledEventPropagation(event);
      if (!$(event.target).is("td")) {
        return;
      }
      var dataTable = $(event.target).closest("table").DataTable();
      var rowData = dataTable.row(event.currentTarget).data();

      if (rowData) {
        console.log("id:" + rowData._id);
        Session.set("selectedData", rowData);
        $("#myModal").closeModal();
      }
    },
    "click .mio": function(event) {

      console.log("modalll data");

      Session.set("myModalIsShowed", true);
      $("#myModal").openModal();

    }
  });

  Template.orionMaterializeCollectionsCreate_XP.events({
    'click .create-btn': function() {
      var get_url = window.location.toString();
      var url = get_url.split("/");
      var coleccion = url[url.length - 2];
      switch(coleccion){
        case "days":
          var valor = $("[name='idEmployee']").val();
          var result=Days.findOne({"idEmployee":valor});
          if (result){
            sAlert.error('Al empleado ya se le ha asignado un horario');
          }else{
            $('#orionMaterializeCollectionsCreateForm_XP').submit();
          }
        break;

        case "jefes":
            var valor = $("[name='idEmployee']").val();
            Meteor.call("EsJefe",valor,function(err,res){
              if(err){
                sAlert.error('Error '+String(err));
              }else{
                if(res==true){
                  sAlert.error('Este empleado ya ha sido asignado como jefe');
                }else{
                  $('#orionMaterializeCollectionsCreateForm_XP').submit();
                }
              }
            });
          break;

        case "vacations":
          var fechaIni = $("[name='fechaIni']").val();
          var fechaFin = $("[name='fechaFin']").val();
          if(!!fechaIni && !!fechaFin){
           var resInicial = fechaIni.split("/");
           var resFinal = fechaFin.split("/");
           var isSame=moment(resInicial[0]+"-"+resInicial[1]+"-"+resInicial[2]).isSame(resFinal[0]+"-"+resFinal[1]+"-"+resFinal[2]);
           var insertar=false;
           if(isSame){
             insertar=true;
           }else{
             var isBefore=moment(resInicial[0]+"-"+resInicial[1]+"-"+resInicial[2]).isBefore(resFinal[0]+"-"+resFinal[1]+"-"+resFinal[2]);
             if(isBefore)
               insertar=true;
           }
           if(insertar){
             $('#orionMaterializeCollectionsCreateForm_XP').submit();
           }else{
             sAlert.error('La fecha inicial debe ser menor o igual a la final');
           }
         }else{
           sAlert.error('Es necesario llenar todos los campos');
         }
        break;

        case "permisos":
          var fechaIni = $("[name='fechaIni']").val();
          var fechaFin = $("[name='fechaFin']").val();
          if(!!fechaIni && !!fechaFin){
           var resInicial = fechaIni.split("/");
           var resFinal = fechaFin.split("/");
           var isSame=moment(resInicial[0]+"-"+resInicial[1]+"-"+resInicial[2]).isSame(resFinal[0]+"-"+resFinal[1]+"-"+resFinal[2]);
           var insertar=false;
           if(isSame){
             insertar=true;
           }else{
             var isBefore=moment(resInicial[0]+"-"+resInicial[1]+"-"+resInicial[2]).isBefore(resFinal[0]+"-"+resFinal[1]+"-"+resFinal[2]);
             if(isBefore)
               insertar=true;
           }
           if(insertar){
             $('#orionMaterializeCollectionsCreateForm_XP').submit();
           }else{
             sAlert.error('La fecha inicial debe ser menor o igual a la final');
           }
         }else{
           sAlert.error('Es necesario llenar todos los campos');
         }
        break;

        case "feriados":
            sAlert.info('Al crear un registro feriado todos los registros en reportes seran eliminados con la fecha a celebrar');
           $('#orionMaterializeCollectionsCreateForm_XP').submit();
        break;
        default:
          $('#orionMaterializeCollectionsCreateForm_XP').submit();
        break;
      }
    }
  });


  AutoForm.addHooks('orionMaterializeCollectionsCreateForm_XP', {
    onSuccess: function() {
      RouterLayer.go(this.collection.indexPath());
    }
  });

  Template.orionMaterializeCollectionsCreate_XP.helpers({
    getValueToUse: function() {
    },
    GetColorIconBack:function(){
      return GetColorIconBack();
    },
    ColorTabularIndex:function(){
      return ColorTabularIndex();
    }
  });

  Template.orionMaterializeCollectionsCreate_XP.rendered= function () {
    ActivateCreateKeyboard();
  }


  Template.orionMaterializeCollectionsIndex_XP.events({
    'click tr': function(event) {
      if (!$(event.target).is('td'))
      return;
      var dataTable = $(event.target).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
      if (rowData) {
        var collection = rowData._collection();
        if (rowData.canShowUpdate()) {
          var path = collection.updatePath(rowData);
          RouterLayer.go(path);
        }
      }
    }
  });


  Template.orionMaterializeCollectionsIndex_XP.onRendered(function() {
    this.autorun(function() {
      RouterLayer.isActiveRoute('');
      Session.set('orionMaterializeCollectionsIndex_XP_showTable', false);
      Meteor.defer(function() {
        Session.set('orionMaterializeCollectionsIndex_XP_showTable', true);
      });
    });
  });

  Template.orionMaterializeCollectionsIndex_XP.onCreated(function () {
    Meteor.subscribe('get_Config_application', {
    onError: function (error) {console.log("error "+error);},
    onReady: function () {
      ActivateKeyBoardSearch();
    }
    });
	});

  Template.orionMaterializeCollectionsCreate_XP.onCreated(function () {
    var get_url = window.location.toString();
    var url = get_url.split("/");
    var coleccion = url[url.length - 1];
    if(coleccion=="days"){
      Meteor.subscribe('getDays',Meteor.userId());
    }
  });


  Template.orionMaterializeCollectionsIndex_XP.rendered = function() {
    Session.set("ValSearch",undefined);
    setTimeout(() => {
      ActivateKeyBoardSearch();
    }, 1000);
  };


  Template.orionMaterializeCollectionsIndex_XP.helpers({
    filtroAvanzado: function (squema) {
      Session.set("FiltroTabular", {
        schema: squema.tabular,
        collection: squema.name,
        label: 'Seleccione para filtrar sus datos',
        and_label: "y",
        or_label: "ó",
        design:"material",
        input_value_placeholder: "Escriba el dato"
      });
    },
    showTable: function() {
      return Session.get('orionMaterializeCollectionsIndex_XP_showTable');
    },
    esNotificaciones: function(collectionName) {
      return (collectionName == 'notificaciones');
    },
    justificantes:function(collectionName){
      return (collectionName == 'justificantes');
    },
    persons:function(collectionName){
      return (collectionName == 'persons');
    },
    personsTabular:function(){
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
    selector:function(){
      var get_url = window.location.toString();
      var url = get_url.split("/");
      var coleccion = url[url.length - 1];
      var res = Meteor.users.findOne({"_id": Meteor.userId()});
      if (res && res.profile.idcompany) {
        var idcompany=[];
        idcompany = res.profile.idcompany;
        switch (coleccion.toString()) {
          case "locations":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda=
            {
              $and:[
                {"idcompany":{$in:idcompany}},
                {"locationName":{$regex: ValSearch,$options: '-i'}}
              ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "notificaciones":
          var ValSearch=Session.get("ValSearch");
          var busqueda={};
          if (ValSearch!=undefined && ValSearch!="") {
              busqueda={
                "not_company":{$in:idcompany},
                $or: [
                  {"not_mensaje":{$regex: ValSearch,$options: '-i'}},
                  {"no_tipo":{$regex: ValSearch,$options: '-i'}}
              ]};
          }else{
            busqueda={
              $and:[
                {"not_company":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "employeespositions":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              "idcompany":{$in:idcompany},
              $or: [
                {"empPosName":{$regex: ValSearch,$options: '-i'}},
                {"empPosDesc":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "pagadoras":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              "idcompany":{$in:idcompany},
              $or: [
                {"pagadoraName":{$regex: ValSearch,$options: '-i'}},
                {"pagadoraDesc":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "direcciones":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              "idcompany":{$in:idcompany},
              $or: [
                {"direccionName":{$regex: ValSearch,$options: '-i'}},
                {"direccionDesc":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "reportsconcentrados":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              "idcompany":{$in:idcompany},
              $or: [
                {"employeeName":{$regex: ValSearch,$options: '-i'}},
                {"idEmployee":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "areas":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              "idcompany":{$in:idcompany},
              $or: [
                {"areaName":{$regex: ValSearch,$options: '-i'}},
                {"areaDesc":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "proyectos":
            var ValSearch=Session.get("ValSearch");
            if (ValSearch!=undefined && ValSearch!="") {
              var busqueda={
                "idcompany":{$in:idcompany},
                $or: [
                  {"proyectoName":{$regex: ValSearch,$options: '-i'}},
                  {"proyectoDesc":{$regex: ValSearch,$options: '-i'}}
              ]};
            }else{
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}}
                ]};
            }
            return busqueda;
            break;

            case "jefes":
            var ValSearch=Session.get("ValSearch");
            if (ValSearch!=undefined && ValSearch!="") {
              var busqueda={
                "idcompany":{$in:idcompany},
                $or: [
                  {"employeeName":{$regex: ValSearch,$options: '-i'}},
                  {"idEmp":{$regex: ValSearch,$options: '-i'}}
              ]};
            }else{
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}}
                ]};
            }
            return busqueda;
            break;

          case "cargamasiva":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              "Company":{$in:idcompany},
              $or: [
                {"causa":{$regex: ValSearch,$options: '-i'}},
                {"descripcion":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"Company":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "feriados":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              $and: [
                {"idcompany":{$in:idcompany}},
                {"comentarios":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "incidencias":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              $and: [
                {"idcompany":{$in:idcompany}},
                {"razon":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "justificantes":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              $and: [
                {"idcompany":{$in:idcompany}},
                {"idEmpName":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "permisos":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              $and: [
                {"employeeName":{$regex: ValSearch,$options: '-i'}},
                {"idcompany":{$in:idcompany}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "vacations":
          var busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          return busqueda;
          break;

          case "restaurants":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              "idcompany":{$in:idcompany},
              $or: [
                {"restaurantName":{$regex: ValSearch,$options: '-i'}},
                {"restaurantDesc":{$regex: ValSearch,$options: '-i'}}
            ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "departments":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={
              $and:[
                {"idcompany":{$in:idcompany}},
                {"departmentName":{$regex: ValSearch,$options: '-i'}}
              ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "enrollments":
          var busqueda={};
          if (Roles.userHasRole(Meteor.userId(), "admin") == true) {

          }else{
            var ValSearch=Session.get("ValSearch");
            if (ValSearch!=undefined && ValSearch!="") {
              busqueda={
                $and:[
                  {"employeeName":{$regex: ValSearch,$options: '-i'}},
                  {"idcompany":{$in:idcompany}}
                ]};
            }else{
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}}
                ]};
            }
          }          
          return busqueda;
          break;

          case "sanciones":
          var busqueda={};
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            busqueda={
              $and:[
                {"clave":{$regex: ValSearch,$options: '-i'}},
                {"idcompany":{$in:idcompany}}
              ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "reglas_retardos":
          var busqueda={};
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            busqueda={
              $and:[
                {"clave":{$regex: ValSearch,$options: '-i'}},
                {"idcompany":{$in:idcompany}}
              ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "reglas_alimentos":
          var busqueda={};
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            busqueda={
              $and:[
                {"clave":{$regex: ValSearch,$options: '-i'}},
                {"idcompany":{$in:idcompany}}
              ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "horarios":
          var busqueda={};
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            busqueda={
              $and:[
                {"clave":{$regex: ValSearch,$options: '-i'}},
                {"idcompany":{$in:idcompany}}
              ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "documents":
          var busqueda={};
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            busqueda={
              $and:[
                {"name":{$regex: ValSearch,$options: '-i'}},
                {"idcompany":{$in:idcompany}}
              ]};
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "days":
          var busqueda={};
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var numero = parseInt(ValSearch);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"employeeName":{ $regex: ValSearch, $options: '-i' }  },
                  {"idcompany":{$in:idcompany}}
                ]};
            }else{
              busqueda={
                $and:[
                  {"idEmp":{ $eq: numero}  },
                  {"idcompany":{$in:idcompany}}
                ]};
            }
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]
            };
          }
          return busqueda;
          break;

          case "persons":
          var ValSearch=Session.get("ValSearch");
          if (ValSearch!=undefined && ValSearch!="") {
            var busqueda={};
            var numero = parseInt(ValSearch);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}},
                  {"employeeName":{ $regex: ValSearch, $options: '-i' }}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}},
                  {"idEmployee":{ $eq: numero}}
                ]};
          }
        }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}}
              ]};
          }
          return busqueda;
          break;

          case "companies":
            if (Roles.userHasRole(Meteor.userId(), "admin") == true) {
              var busqueda={};
              return busqueda;
            }else{
              var busqueda={
                $and:[
                  {"_id":{$in:idcompany}}
                ]};
              return busqueda;
            }            
          break;

          case "accesscontrol":
          var ValSearch=Session.get("ValSearch");
          var busqueda={};
          if (ValSearch!=undefined && ValSearch!="") {
            var numero = parseInt(ValSearch);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"idCompany":{$in:idcompany}},
                  {"employeeName":{ $regex: ValSearch, $options: '-i' }},
                  {"firstAccess":{$gte:Session.get("fechaInicioaccesscontrol"),$lt:Session.get("fechaFinaccesscontrol")}}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idEmp":{$eq: numero}},
                  {"idCompany":{$in:idcompany}},
                  {"firstAccess":{$gte:Session.get("fechaInicioaccesscontrol"),$lt:Session.get("fechaFinaccesscontrol")}}
                ]
              };
            }
          }else{
            busqueda={
              $and:[
                {"firstAccess":{$gte:Session.get("fechaInicioaccesscontrol"),$lt:Session.get("fechaFinaccesscontrol")}},
                {"idCompany":{$in:idcompany}},
              ]
            };
          }
          console.log("busqueda accesscontrol "+JSON.stringify(busqueda));
          return busqueda;
          break;

          case "accessdetails":
          var ValSearch=Session.get("ValSearch");
          var busqueda={};
          if (ValSearch!=undefined && ValSearch!="") {
            var numero = parseInt(ValSearch);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"employeeName":{ $regex: ValSearch, $options: '-i' }},
                  {"idcompany":{$in:idcompany}},
                  {"createdAt":{$gte:Session.get("fechaInicioaccessdetails"),$lte:Session.get("fechaFinaccessdetails")}}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idEmp":{$eq: numero}},
                  {"idcompany":{$in:idcompany}},
                  {"createdAt":{$gte:Session.get("fechaInicioaccessdetails"),$lte:Session.get("fechaFinaccessdetails")}}
                ]
              };
            }
          }else{
            if(Session.get("fechaInicioaccessdetails") && Session.get("fechaFinaccessdetails")){
              var fecha1 = moment(Session.get("fechaInicioaccessdetails"));
              var fecha2 = moment(Session.get("fechaFinaccessdetails"));
              var cantD=fecha2.diff(fecha1, 'days');
              if(Math.abs(cantD)>8){
                sAlert.error('Para este módulo el intervalo de tiempo debe ser menor a una semana');
              }else{
                busqueda={
                  $and:[
                    {"createdAt":{$gte:Session.get("fechaInicioaccessdetails"),$lte:Session.get("fechaFinaccessdetails")}},
                    {"idcompany":{$in:idcompany}}
                  ]
                };
              }              
            }          
          }
          console.log("busqueda accessdetails "+JSON.stringify(busqueda));
          return busqueda;
          break;

          case "meal_times":
          var ValSearch=Session.get("ValSearch");
          var busqueda={};
          if (ValSearch!=undefined && ValSearch!="") {
            var numero = parseInt(ValSearch);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}},
                  {"employeeName":{ $regex: ValSearch, $options: '-i' }},
                  {"fechaIni":{$gte:Session.get("fechaIniciomeal_times"),$lt:Session.get("fechaFinmeal_times")}}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idEmployee":{$eq: numero}},
                  {"idcompany":{$in:idcompany}},
                  {"fechaIni":{$gte:Session.get("fechaIniciomeal_times"),$lt:Session.get("fechaFinmeal_times")}}
                ]
              };
            }
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}},
                {"fechaIni":{$gte:Session.get("fechaIniciomeal_times"),$lt:Session.get("fechaFinmeal_times")}}
              ]
            };
          }
          console.log("busqueda meal_times "+JSON.stringify(busqueda));
          return busqueda;
          break;

          case "tickets":
          var ValSearch=Session.get("ValSearch");
          var busqueda={};
          if (ValSearch!=undefined && ValSearch!="") {
            var numero = parseInt(ValSearch);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}},
                  {"employeeName":{ $regex: ValSearch, $options: '-i' }},
                  {"createdAt":{$gte:Session.get("fechaIniciotickets"),$lt:Session.get("fechaFintickets")}}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}},
                  {"idEmployee":{$eq: numero}},
                  {"createdAt":{$gte:Session.get("fechaIniciotickets"),$lt:Session.get("fechaFintickets")}}
                ]
              };
            }
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}},
                {"createdAt":{$gte:Session.get("fechaIniciotickets"),$lt:Session.get("fechaFintickets")}}
              ]
            };
          }
          return busqueda;
          break;

          case "design_app":
          var busqueda={
            "user":Meteor.userId()
          };
          return busqueda;
          break;

          case "extra_time":
          var ValSearch=Session.get("ValSearch");
          var busqueda={};
          if (ValSearch!=undefined && ValSearch!="") {
            var numero = parseInt(ValSearch);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}},
                  {"employeeName":{ $regex: ValSearch, $options: '-i' }},
                  {"createdAt":{$gte:Session.get("fechaInicioextra_time"),$lt:Session.get("fechaFinextra_time")}}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idcompany":{$in:idcompany}},
                  {"idEmployee":{$eq: numero}},
                  {"createdAt":{$gte:Session.get("fechaInicioextra_time"),$lt:Session.get("fechaFinextra_time")}}
                ]
              };
            }
          }else{
            busqueda={
              $and:[
                {"idcompany":{$in:idcompany}},
                {"createdAt":{$gte:Session.get("fechaInicioextra_time"),$lt:Session.get("fechaFinextra_time")}}
              ]
            };
          }
          return busqueda;
          break;
        }
      }
    },
    Selector_MyRecordsX:function(){
      var _userId=Meteor.userId();
      if (Roles.userHasRole(_userId, "Usuario") == true) {
        var res = Meteor.users.findOne({ "_id": _userId });
        if (res && res.emails[0]) {
          var _Mail = res.emails[0].address;
          var Data=Persons.findOne({empEmail:_Mail});
          if (Data!=undefined) {
            var _id=Data._id;
            return {
              idEmployee:_id
            }
          }
        }
      }else {
        return {}
      }
    },
    Comentar:function(){
      var _userId=Meteor.userId();
      var result=true;
      if (Roles.userHasRole(_userId, "Usuario Administrador") == true) {
        result=false;
      }
      return result;
    },
    IconColorIndex:function(){
      return GetColorIconBack();
    },
    IconColorCreate:function(){
      return GetColorIconCreate();
    },
    ColorTabularIndex:function(){
      return ColorTabularIndex();
    }
  });

  Template.orionMaterializeCollectionsUpdate_XP.events({
    'click .save-btn': function() {
      var get_url = window.location.toString();
      var url = get_url.split("/");
      var coleccion = url[url.length - 2];
      var _id = url[url.length - 1];
      switch (coleccion) {
        case "auditoriasext":
        var data = Auditoriasext.findOne({
          "_id": _id
        }).aue_cve;
        var valor = $("[name='aue_cve']").val();
        if (data == valor) {
          $('#orionMaterializeCollectionsUpdateForm_XP').submit();
        } else {
          var cn = Auditoriasext.find({
            "aue_cve": valor
          }).count();
          if (cn > 0) {
            sAlert.error('Un registro ya ha sido creado con la misma clave, utilize una clave distinta');
            var s = new buzz.sound('/sounds/warn.mp3');
            s.play();
            $("[name='aue_cve']").focus();
          } else {
            $('#orionMaterializeCollectionsUpdateForm_XP').submit();
          }
        }
        break;

        case "auditoriasint":
        var data = Auditoriasint.findOne({
          "_id": _id
        }).aui_cve;
        var valor = $("[name='aui_cve']").val();
        if (data == valor) {
          $('#orionMaterializeCollectionsUpdateForm_XP').submit();
        } else {
          var cn = Auditoriasint.find({
            "aui_cve": valor
          }).count();
          if (cn > 0) {
            sAlert.error('Un registro ya ha sido creado con la misma clave, utilize una clave distinta');
            var s = new buzz.sound('/sounds/warn.mp3');
            s.play();
            $("[name='aui_cve']").focus();
          } else {
            $('#orionMaterializeCollectionsUpdateForm_XP').submit();
          }
        }
        break;

        case "documentos":
        var data = Documentos.findOne({
          "_id": _id
        }).doc_cve;
        var valor = $("[name='doc_cve']").val();
        if (data == valor) {
          $('#orionMaterializeCollectionsUpdateForm_XP').submit();
        } else {
          var cn = Documentos.find({
            "doc_cve": valor
          }).count();
          var cn_ofic = Documentosoficiales.find({
            "doc_cve": valor
          }).count();
          if (cn > 0 || cn_ofic > 0) {
            sAlert.error('Un documento ya ha sido creado con la misma clave, utilize una clave distinta');
            var s = new buzz.sound('/sounds/warn.mp3');
            s.play();
            $("[name='doc_cve']").focus();
          } else {
            $('#orionMaterializeCollectionsUpdateForm_XP').submit();
          }
        }
        break;

        case "prospectos":
        var data = Prospectos.findOne({
          "_id": _id
        }).pct_clave;
        var valor = $("[name='pct_clave']").val();
        if (data == valor) {
          $('#orionMaterializeCollectionsUpdateForm_XP').submit();
        } else {
          var cn = Prospectos.find({
            "pct_clave": valor
          }).count();
          if (cn > 0) {
            sAlert.error('Un Prospecto ya ha sido creado con la misma clave, utilize una clave distinta');
            var s = new buzz.sound('/sounds/warn.mp3');
            s.play();
            $("[name='pct_clave']").focus();
          } else {
            $('#orionMaterializeCollectionsUpdateForm_XP').submit();
          }
        }
        break;

        case "proyectos":
        var data = Proyectos.findOne({
          "_id": _id
        }).pry_clave;
        var valor = $("[name='pry_clave']").val();
        if (data == valor) {
          $('#orionMaterializeCollectionsUpdateForm_XP').submit();
        } else {
          var cn = Proyectos.find({
            "pry_clave": valor
          }).count();
          if (cn > 0) {
            sAlert.error('Un proyecto ya ha sido creado con la misma clave, utilize una clave distinta');
            var s = new buzz.sound('/sounds/warn.mp3');
            s.play();
            $("[name='pry_clave']").focus();
          } else {
            $('#orionMaterializeCollectionsUpdateForm_XP').submit();
          }
        }
        break;

        case "quejassugerencias":
        var data = Quejassugerencias.findOne({
          "_id": _id
        }).qes_folio;
        var valor = $("[name='qes_folio']").val();
        if (data == valor) {
          $('#orionMaterializeCollectionsUpdateForm_XP').submit();
        } else {
          var cn = Quejassugerencias.find({
            "qes_folio": valor
          }).count();
          if (cn > 0) {
            sAlert.error('Un registro ya ha sido creado con la misma clave, utilize una clave distinta');
            var s = new buzz.sound('/sounds/warn.mp3');
            s.play();
            $("[name='qes_folio']").focus();
          } else {
            $('#orionMaterializeCollectionsUpdateForm_XP').submit();
          }
        }
        break;

        default:
        $('#orionMaterializeCollectionsUpdateForm_XP').submit();
      }
    },
    'change [name="prp_estatus"]': function(event) {
      var val = event.target.value;
      // console.log("valor del campo "+val);
      var valor = getStatus_auto(val);
      // console.log("valor "+valor);
      $("[name='prp_modificacion']").val(valor);
      $("[name='prp_fecha_envio']").focus();
    },

  });

  AutoForm.addHooks('orionMaterializeCollectionsUpdateForm_XP', {
    onSuccess: function() {
      RouterLayer.go(this.collection.indexPath());
    }
  });
  Template.orionMaterializeCollectionsUpdate_XP.rendered= function () {
    setTimeout(() => {
      var isStation=Config_application.findOne({"active":true});
			if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false&& isStation.showKeyboard==true){
          var inp = document.getElementsByTagName('input');
          for(var i in inp){
              if(inp[i].type == "text"||inp[i].type == "number"){
                var elemento=inp[i].name;
                if(elemento){
                  try {
                    $("[name='"+elemento+"']").keyboard({ layout: 'qwerty' });
                  } catch (e) { }
                }
              }
          }
      }
    }, 1000);
  }

  Template.orionMaterializeCollectionsUpdate_XP.helpers({
    getValueToUse: function() {
      /*
      if (Session.get("valueToUse") != undefined) {
      var res = Session.get("valueToUse");
      if (res != '') {
      console.log('res:'+JSON.stringify(res));
      console.log('$("[name=\'" + res.name + "\']")[0].selectize.setValue(res._id);');
      $("[name='" + res.name + "']")[0].selectize.setValue(res._id);
    }
    Session.set("valueToUse", undefined);
  }
  */
},
GetColorIconBack:function(){
  return GetColorIconBack();
},
ColorTabularIndex:function(){
  return ColorTabularIndex();
},
});

Template.orionMaterializeCollectionsDelete_XP.helpers({
  getCollection: function() {
    return this.collection;
    //   RouterLayer.go(this.collection.indexPath());

  },
  ColorTabularIndex:function(){
    return ColorTabularIndex();
  }
});

Template.orionMaterializeCollectionsDelete_XP.events({
  'click .confirm-mydelete': function(event, template) {
    disabledEventPropagation(event);
    //      console.log("deleting");
    var objectId = RouterLayer.getParam('_id');
    //    console.log("this.self:"+ simpleStringifyxy(RouterLayer));

    template.view.template.__helpers[" collection"]().update(objectId, {
      $set: {
        active: false
      }
    }, function(error, result) {
      if (error) {
        console.warn('Error al borrar:', objectId, 'en la collection', ':', error);
      }
      // Only go back to index in case the deletion has been properly achieved
      if (result === 1) {
        RouterLayer.go(template.view.template.__helpers[" collection"]().indexPath());
      }
    });

  }
});


  function ActivateCreateKeyboard(){
    var isStation=Config_application.findOne({"active":true});
      if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false&& isStation.showKeyboard==true){
          var inp = document.getElementsByTagName('input');
          var inp2 = document.getElementsByTagName('textarea');
          for(var i in inp){
              if(inp[i].type == "text"||inp[i].type == "number"){
                var elemento=inp[i].name;
                if(elemento=="comentarios"|| elemento=="observaciones"|| elemento=="observaciones_admin"){
                  try {
                    $("[name='"+elemento+"']").keyboard({ layout: 'qwerty' });
                  } catch (error) {}
                }else{
                  if(elemento){
                    try {
                      $("[name='"+elemento+"']").keyboard({ layout: 'qwerty' });
                    } catch (e) {
                    }
                  }
                }              
              }
        }

        for(var i in inp2){
            if(inp2[i].type == "text"||inp2[i].type == "number"||inp2[i].type == "textarea"){
              var elemento=inp2[i].name;
              if(elemento=="comentarios"|| elemento=="observaciones" || elemento=="observaciones_admin"){
                try {
                  $("[name='"+elemento+"']").keyboard({ layout: 'qwerty' });
                } catch (error) {}
              }else{
                if(elemento){
                  try {
                    $("[name='"+elemento+"']").keyboard({ layout: 'qwerty' });
                  } catch (e) {
                  }
                }
              }              
            }
      }

      }
  }
}
