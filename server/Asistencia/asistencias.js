if (Meteor.isServer) {
  const Fibers = require('fibers');
  FindPerson=function(id,MetodoAcceso){
    logAccesos.info("**************");
    logAccesos.info("Iniciando verificación "+id+" x "+MetodoAcceso);
    var existsPrint=Print_ticket.findOne();
    if(existsPrint!=undefined){
      try { SendToVerificationWindow('{"estatus":"Imprimir"}');} catch (e) { }
      logAccesos.info("Ya existe una impresión en curso..");
    }else{
    if(id !=undefined && id !=""){
      var busqueda={
        $or: [
          {"PersonIdBiometric": id},
          {"_id": id}
        ]};
      var PersonFound=Persons.findOne(busqueda);
      if(PersonFound!=undefined){
        logAccesos.info("persona encontrada :"+PersonFound.employeeName);
        var _id=PersonFound._id;
        var getLastAccessControl=LastAccessControl(_id);        
        var insertar=false;
        var nihablar=false;
        if(getLastAccessControl!=undefined){          
          var MomentAhora=moment();
          var MomentUltimoReg=moment(getLastAccessControl);
          var minnn=MomentAhora.diff(MomentUltimoReg,'seconds');
          logAccesos.info("Segundos de diferencia :"+minnn+" entre "+moment(MomentUltimoReg).format('DD/MM/YYYY hh:mm:ss a')+" y "+moment(MomentAhora).format('DD/MM/YYYY hh:mm:ss a'));
          if(Math.abs(minnn)>=30){
            insertar=true;
          }else if(Math.abs(minnn)<=10){
            nihablar=true;
          }else{
            nihablar=true;
          }
        }else{
          logAccesos.info("getLastAccessControl undefined");
        }

        if(insertar){
          var url="images/no-photo.png";
          var employeeName=PersonFound.employeeName;
          var empEmail=PersonFound.empEmail;
          var empPhoneNbr="";
          var empCellNbr="";
          var companyName=GetcompanyName(PersonFound.idcompany[0]);
          var empPosName=GetempPosName(PersonFound.idEmpPosition);
          var tiempo=5;
          var StationCanPrint = true;
          var personCanPrintMeal=false;

          if(PersonFound.face!=undefined && PersonFound.face.url!=undefined){
            url=PersonFound.face.url;
          }

          var obj={
            id:_id,
            date:new Date(),
            url:url,
            employeeName:employeeName,
            empEmail:empEmail,
            empPhoneNbr:empPhoneNbr,
            empCellNbr:empCellNbr,
            companyName:companyName,
            empPosName:empPosName
          };
          Access_temp.insert(obj);
          obj["estatus"]="found";
          try { SendToVerificationWindow(JSON.stringify(obj)); } catch (e) { }

          FunctionAccessControl(_id,MetodoAcceso,false);

          //ZONA DE GUARDADO DE TIEMPO DE ALIMENTOS Y TICKETS
          if(PersonFound.mealsEmp!=undefined){
            personCanPrintMeal=PersonFound.mealsEmp;
            logAccesos.info("El empleado puede imprimir tickets");
          }else{
            logAccesos.info("El empleado no puede imprimir tickets");
          }

          var DataConfig=Config_application.findOne();
          if(DataConfig!=undefined){
            StationCanPrint=DataConfig.printTickets;
            if(StationCanPrint==true){
              logAccesos.info("La estacion puede imprimir tickets");
            }else{
              logAccesos.info("La estacion no puede imprimir tickets");
            }            
          }

          var MealsForCompany=isCompanymeal(PersonFound.idcompany);
          var Companymeal =MealsForCompany[0];
          if(Companymeal==true){
            logAccesos.info("La compañia evalua alimentos");
          }else{
            logAccesos.info("La compañia no evalua alimentos");
          }

          var CompanymealTicket = MealsForCompany[1];
          if(CompanymealTicket==true){
            logAccesos.info("La compañia puede imprimir tickets");
          }else{
            logAccesos.info("La compañia no puede imprimir tickets");
          }
          
          var flag = false;
          if (CompanymealTicket && personCanPrintMeal && StationCanPrint) {
            flag = true;
          }
          
          if (Companymeal) {
            insertMealTime(_id, flag, PersonFound,false);
            // insertMealTime(_id, flag, PersonFound.idcompany,employeeName,false);
          }

          var tiempo=Config_station.findOne().time_show_data;
          var time = tiempo * 500;
          var fiber = Fibers.current;
          Fibers(function () {
            Meteor.setTimeout(function(){
              Access_temp.remove({});
            }, time);
          }).run();
        }else{
          if(nihablar==true){
            logAccesos.info("Registro recien insertado");
            var obj={
              "estatus":"RegInserted"+PersonFound.employeeName
            }
            try { SendToVerificationWindow(JSON.stringify(obj)); } catch (e) { }
            var dataTemp=Temp_messages.findOne({});
            Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "RegInserted"+PersonFound.employeeName }});
            Meteor.setTimeout(function(){
              Temp_messages.update({"_id":dataTemp._id}, {$unset:{ "status_verification": "" }});
            }, 3000);
          }
        }
      }else{
        logAccesos.info("Id "+id+" no encontrado");
        var obj={"estatus":"PersonNotFound"}
        try { SendToVerificationWindow(JSON.stringify(obj)); } catch (e) { }

        var obj={"estatus":"NotProcessing"}
        try { SendToVerificationWindow(JSON.stringify(obj)); } catch (e) { }

        var dataSensors=Sensors.findOne({});
        Sensors.update({"_id":dataSensors._id}, {$set:{ "ProcessingFinger": false,"ProcessingFace": false }});

        var dataTemp=Temp_messages.findOne({});
        Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "PersonNotFound" }});
        Meteor.setTimeout(function(){
          Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "" }});
        }, 3000);
      }
    }else {
      logAccesos.info("El id es undefined");
      
      var obj={"estatus":"PersonNotFound"}
      try { SendToVerificationWindow(JSON.stringify(obj)); } catch (e) { }

      var obj={"estatus":"NotProcessing"}
      try { SendToVerificationWindow(JSON.stringify(obj)); } catch (e) { }

      var dataSensors=Sensors.findOne({});
      Sensors.update({"_id":dataSensors._id}, {$set:{ "ProcessingFinger": false,"ProcessingFace": false }});
      
      var dataTemp=Temp_messages.findOne({});
      Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "PersonNotFound" }});
      Meteor.setTimeout(function(){
        Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "" }});
      }, 3000);
    }
  }
  }
}
