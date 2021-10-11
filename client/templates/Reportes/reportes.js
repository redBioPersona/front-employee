if(Meteor.isClient){
  Template.orionMaterializeCollectionsIndex_Reports.events({

  });

  function ActivateKeyBoard(){
    var isStation=Config_application.findOne({"active":true});
    if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false&& isStation.showKeyboard==true){

        $("input[type='search']").keyboard({
          layout: 'qwerty',
          change:function(event,keyboard,el){

          },
          beforeClose: function(ev, keyboard, el){
            // var busqueda=keyboard.$preview.val();
            // Session.set("SearchingReports",busqueda);
            // $("input[type='search']").val(busqueda);
          },
          accepted : function(event, keyboard, el) {
            var contenido=el.value;
            //console.log('The content "' + el.value + '" was accepted!');
            Session.set("SearchingReports", contenido);
            setTimeout(function () {
              $("input[type='search']").val(contenido);
            }, 10);
          }
        });

        //var caca=$("input[type='search']").getkeyboard();

    }
  }

  Template.orionMaterializeCollectionsIndex_Reports.onCreated(function(){
    $('.select-dropdown').addClass('hide');
    Meteor.subscribe('get_Config_application', {
      onError: function (error) {console.log("error "+error);},
      onReady: function () {
        ActivateKeyBoard();
      }
    });
  });

  Template.orionMaterializeCollectionsIndex_Reports.rendered = function() {
    $('.select-dropdown').addClass('hide');
    Session.set("SearchingReports",undefined);
    setTimeout(() => {
      ActivateKeyBoard();
    }, 1000);
  };

  Template.orionMaterializeCollectionsIndex_Reports.helpers({
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
        //Reports.tabularTable.selector="SelectorReports";
        // Reports.tabularTable.options.processing=true;
        // Reports.tabularTable.options.language.processing='<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>';
        Reports.tabularTable.options.columns = cols;
        // Reports.tabularTable.options.search.onEnterOnly=true;
        // Reports.tabularTable.options.search.smart=false;
        return Reports.tabularTable;
    },
    selector_reports:function(){
      var fechaInicio="";
      var fechaFin="";

      if(Session.get('fechaInicioReporte')==undefined || Session.get('fechaFinReporte')==undefined){
        fechaInicio= moment().subtract(1, 'months').hour(0).minutes(0).seconds(0).toDate();
        fechaFin= moment().hour(23).minutes(0).seconds(0).toDate();
      }else{
        var fini=Session.get('fechaInicioReporte');
        var ffin=Session.get('fechaFinReporte');
        fechaInicio=moment(fini).hour(0).minutes(0).seconds(0).toDate();
        fechaFin=moment(ffin).hour(23).minutes(0).seconds(0).toDate();
      }

      // var fechaInicio=Session.get('fechaInicioReporte');
      // var fechaFin=Session.get('fechaFinReporte');
       var busqueda={};
       var estatus_reports=Session.get('estatus_reports');
       var idLocation=Session.get("location_report");
       var department_report=Session.get("department_report");
       var company_report=Session.get("company_report");
       var radio_excepcion=Session.get("radio_excepcion");
       var radio_salida_anticipada=Session.get("radio_salida_anticipada");
       var radio_todos=Session.get("radio_todos");

        if (radio_excepcion=="Si") {
          var SearchingReports=Session.get("SearchingReports");
          if (SearchingReports!=undefined && SearchingReports!="") {
            var numero = parseInt(SearchingReports);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"employeeName":{ $regex: SearchingReports, $options: '-i' }},
                  {"excepcion":"Si"},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idEmployee":{$eq: numero}},
                  {"excepcion":"Si"},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }
          }else{
            busqueda={
              $and:[
                {"excepcion":"Si"},
                {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
              ]
            };
          }
        }else if (radio_salida_anticipada==true) {
          var SearchingReports=Session.get("SearchingReports");
          if (SearchingReports!=undefined && SearchingReports!="") {
            var numero = parseInt(SearchingReports);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"employeeName":{ $regex: SearchingReports, $options: '-i' }},
                  {"antes":"true"},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idEmployee":{$eq: numero}},
                  {"antes":"true"},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }
          }else{
            busqueda={
              $and:[
                {"antes":"true"},
                {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
              ]
            };
          }
        }else if (radio_todos==true) {
          var SearchingReports=Session.get("SearchingReports");
          if (SearchingReports!=undefined && SearchingReports!="") {
            var numero = parseInt(SearchingReports);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"employeeName":{ $regex: SearchingReports, $options: '-i' }},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idEmployee":{$eq: numero}},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }
          }else{
            busqueda={
              $and:[
                {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
              ]
            };
          }
        }else if (estatus_reports=="Falta") {
          var SearchingReports=Session.get("SearchingReports");
          if (SearchingReports!=undefined && SearchingReports!="") {
            var numero = parseInt(SearchingReports);
            if (isNaN(numero)) {
              busqueda={
                $and:[
                  {"employeeName":{ $regex: SearchingReports, $options: '-i' }},
                  {"estatus":"Falta"},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }else{
              busqueda={
                $and:[
                  {"idEmployee":{$eq: numero}},
                  {"estatus":"Falta"},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }
          }else{
            busqueda={
              $and:[
                {"estatus":"Falta"},
                {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
              ]
            };
          }
        }
        else if (estatus_reports=="Normal") {
          var SearchingReports=Session.get("SearchingReports");
          if (SearchingReports!=undefined && SearchingReports!="") {
            var numero = parseInt(SearchingReports);
            if (isNaN(numero)) {
              busqueda={
                $or:[
                   {estatus:"Normal"},
                   {estatus:"Tolerancia"}
                 ],
                $and:[
                  {"employeeName":{ $regex: SearchingReports, $options: '-i' }},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }else{
              busqueda={
                $or:[
                   {estatus:"Normal"},
                   {estatus:"Tolerancia"}
                 ],
                $and:[
                  {"idEmployee":{$eq: numero}},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }
          }else{
            busqueda={
              $or:[
                 {estatus:"Normal"},
                 {estatus:"Tolerancia"}
               ],
              $and:[
                {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
              ]
            };
          }
        }else if (idLocation==undefined) {
          var SearchingReports=Session.get("SearchingReports");
          if (SearchingReports!=undefined && SearchingReports!="") {
            var numero = parseInt(SearchingReports);
            if (isNaN(numero)) {
              busqueda={
      					$or:[
        					 {estatus:"Retardo Menor"},
        					 {estatus:"Retardo Normal"},
        					 {estatus:"Retardo Mayor"},
        					 {estatus:"Tolerancia"}
      				   ],
                $and:[
                  {"employeeName":{ $regex: SearchingReports, $options: '-i' }},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }else{
              busqueda={
      				  $or:[
      					 {estatus:"Retardo Menor"},
      					 {estatus:"Retardo Normal"},
      					 {estatus:"Retardo Mayor"},
      					 {estatus:"Tolerancia"}
      				   ],
                $and:[
                  {"idEmployee":{$eq: numero}},
                  {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
                ]
              };
            }
          }else{
            busqueda={
      				$or:[
      				 {estatus:"Retardo Menor"},
      				 {estatus:"Retardo Normal"},
      				 {estatus:"Retardo Mayor"},
      				 // {estatus:"Tolerancia"}
      			   ],
              $and:[
                {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}}
              ]
            };
          }
       }

       if($('#LocationSelectX').val()){
         var _idLocation=$('#LocationSelectX').val();
         var LocationObj={
           idLocation:_idLocation
         };
         if(busqueda.$and!=undefined){
           busqueda["$and"].push(LocationObj)
         }
         //console.log(JSON.stringify(bus));
         //busqueda.$and.push(LocationObj);
       }else{
         var arreglo=busqueda.$and;
         if(arreglo!=undefined){
           for (var i = 0; i < arreglo.length; i++) {
             var obj=arreglo[i];
             if(obj.hasOwnProperty('idLocation')){
               console.log("Eliminando la Localidad..");
               delete busqueda.$and[i];
             }
           }
         }
       }

       if($('#CompanySelectX').val()){
         // var _idCompany=[];
         //  _idCompany.push($('#CompanySelectX').val());
         // var BusquedaObj={
         //   idcompany:{$in:_idCompany}
         // };
         // var abc= busqueda.$and;
         // abc.push(BusquedaObj);



         var arreglo=busqueda.$and;
         if(arreglo!=undefined){
           for (var i = 0; i < arreglo.length; i++) {
             var obj=arreglo[i];
             //console.log("OBJS "+JSON.stringify(obj));
             if(obj.hasOwnProperty('idcompany')){
               var objCompany=obj.idcompany.$in;
               //console.log("objCompany "+JSON.stringify(objCompany));
             }
           }
         }

       }else{
         var arreglo=busqueda.$and;
         if(arreglo!=undefined){
           for (var i = 0; i < arreglo.length; i++) {
             var obj=arreglo[i];
             if(obj.hasOwnProperty('idcompany')){
               console.log("Eliminando idcompany..");
               delete arreglo[i];
             }
           }
         }
       }

       if($('#DepartmentSelectX').val()){
         var _idDepto=$('#DepartmentSelectX').val();
         var BusquedaObj={
           "idDepartment":_idDepto
         };
         if(busqueda.$and!=undefined){
           busqueda["$and"].push(BusquedaObj)
         }

       }else{
         var arreglo=busqueda.$and;
         if(arreglo!=undefined){
           for (var i = 0; i < arreglo.length; i++) {
             var obj=arreglo[i];
             if(obj.hasOwnProperty('idDepartment')){
               console.log("Eliminando idDepartment..");
               delete arreglo[i];
             }
           }
         }
       }

       var SuperArray=busqueda.$and;
       if(SuperArray!=undefined){
         var res = Meteor.users.findOne({ "_id": Meteor.userId() });
         if (res && res.profile && res.profile.idcompany) {
           var _idCompany=[];
           var _idCompany = res.profile.idcompany;
           var flag=false;
           for (var i = 0; i < SuperArray.length; i++) {
             var obj=SuperArray[i];
             if(obj.hasOwnProperty('idcompany')){
               flag=true;
             }
           }
           if(!flag){
             var BusquedaObj={
               idcompany:{$in:_idCompany}
             };
             SuperArray.push(BusquedaObj);
           }

         };
       }else{
         var res = Meteor.users.findOne({ "_id": Meteor.userId() });
         if (res && res.profile && res.profile.idcompany) {
           var _idCompany=[];
           var _idCompany = res.profile.idcompany;
           busqueda={
             $or:[
                 {estatus:"Retardo Menor"},
                 {estatus:"Retardo Normal"},
                 {estatus:"Retardo Mayor"}
               ],
             $and:[
              {"fechaIni":{$gte:fechaInicio,$lt:fechaFin}},
              {"idcompany":{ $in: _idCompany }}
             ]
           };

           if($('#LocationSelectX').val()){
             var _idLocation=$('#LocationSelectX').val();
             var LocationObj={
               idLocation:_idLocation
             };
             if(busqueda.$and!=undefined){
               busqueda["$and"].push(LocationObj)
             }
           }




         };
       }

       if($('#DepartmentSelectX').val()){
         var _idDepto=$('#DepartmentSelectX').val();
         var BusquedaObj={
           "idDepartment":_idDepto
         };
         if(busqueda.$and!=undefined){
           busqueda["$and"].push(BusquedaObj)
         }

       }else{
         var arreglo=busqueda.$and;
         if(arreglo!=undefined){
           for (var i = 0; i < arreglo.length; i++) {
             var obj=arreglo[i];
             if(obj.hasOwnProperty('idDepartment')){
               console.log("Eliminando idDepartment..");
               delete arreglo[i];
             }
           }
         }
       }


       console.log("busqueda "+JSON.stringify(busqueda));
       return busqueda;
    },
    GetColorIconBack:function(){
      return GetColorIconBack();
    },
    ColorTabularIndex:function(){
      return ColorTabularIndex();
    }
  });



}
