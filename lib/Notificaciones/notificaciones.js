WriteNotificaciones=function(EmployeeName,tipo,rol,company,_idEmployee,mensaje){
    var not_tipo="",colormsj="#08053d",not_mensaje="",not_url="",roles=[],Company=[],forUser=false,sendMail=false;
    var dataP=Persons.findOne({"_id":_idEmployee},{fields:{empEmail:1}});
    if(typeof company=="string"){
      Company.push(company);
    }else{
      Company=company;
    }

    if(rol=="USERS"){
        forUser=true;
        roles.push("Usuario");
    }else if(rol=="ALL"){
        forUser=true;
        roles.push("Usuario");
        roles.push("Supervisor");
        roles.push("Usuario Administrador");
    }else if(rol=="ADMIN"){
        roles.push("Supervisor");
        roles.push("Usuario Administrador");
    }

    if(tipo=="SIN_HOR"){
        not_tipo="Falta de horario";
        not_mensaje="Aun no se le asigna horario al empleado <b>"+EmployeeName+"</b>";
        not_url="/admin/persons/"+_idEmployee;
    }else if(tipo=="CUMPLE"){
        not_tipo="Cumpleaños";
        not_mensaje="Cumpleaños del empleado <b>"+EmployeeName+"</b>";
        not_url="/admin/persons/"+_idEmployee;
        sendMail=true;
    }else if(tipo=="MANYFALTAS"){
        not_tipo="Faltas";
        not_mensaje="El empleado <b>"+EmployeeName+"</b> cuenta con <b>"+mensaje+"</b>";
        not_url="/admin/persons/"+_idEmployee;
    }else if(tipo=="ANI"){
        not_tipo="Aniversario";
        not_mensaje="Hoy el empleado <b>"+EmployeeName+"</b> cumple un año mas de laborar para la empresa";
        not_url="/admin/persons/"+_idEmployee;
    }else if(tipo=="ERR_HOR"){
        not_tipo="Error en el Horario";
        not_mensaje="El horario del empleado <b>"+EmployeeName+"</b> no se encuentra en el formato deseado";
        not_url="/admin/persons/"+_idEmployee;
    }else if(tipo=="Justificante"){
      if(rol=="USERS"){
        not_tipo="Justificante modificado";
        not_mensaje="<b>"+EmployeeName+"</b> Tu justificante ha sido modificado";
        sendMail=true;
      }else if(rol=="ALL" || rol=="ADMIN"){
        not_tipo="Justificante creado";
        not_mensaje="El empleado <b>"+EmployeeName+"</b> ha creado un justificante, con fecha <b>"+mensaje+"</b>";
        not_url="/admin/justificantes";
        sendMail=true;
      }
    }else if(tipo=="Permiso"){
        not_tipo="Permiso creado";
        not_mensaje="<b>"+EmployeeName+"</b> se le ha creado un permiso de inasistencia, con fecha <b>"+mensaje+"</b>";
        sendMail=true;
        colormsj="#303030";
    }

    var notificacionesList=Notificaciones.find({"not_mensaje":not_mensaje,"not_url":not_url}).fetch();
    if (notificacionesList.length>0) {
      Notificaciones.update({_id: notificacionesList[0]._id}, {$set: {"not_status": "No Leído","date":new Date()}});
    }else{
        var obj={
            "not_mensaje":not_mensaje,
            "not_status": "No Leído",
            "active": true,
            "no_tipo":not_tipo,
            "date":new Date(),
            "not_company":company,
            "not_rol_destino":roles,
            "not_url":not_url,
            "not_userId":_idEmployee
        };

        if(not_tipo=="Justificante creado"){
          var obj2={
            "not_mensaje":"<b>"+EmployeeName+"</b> has creado un justificante, con fecha <b>"+mensaje+"</b>",
            "not_status": "No Leído",
            "active": true,
            "no_tipo":"Justificante creado",
            "date":new Date(),
            "not_company":company,
            "not_rol_destino":["Usuario"],
            //"not_url":not_url,
            "not_userId":_idEmployee
          };
          Notificaciones.insert(obj2);
        }


        if(sendMail){
          if(dataP){
            var correoEmpleado=dataP.empEmail;
            if(correoEmpleado){
              Meteor.call("sendEmail", correoEmpleado,undefined,not_tipo,not_mensaje,colormsj, function(error, result){ });
            }
          }
        }
        Notificaciones.insert(obj);
    }

}
