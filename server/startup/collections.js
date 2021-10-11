if (Meteor.isServer) {

  Meteor.startup(function() {
    var userId;
    if (Meteor.users.find({}).count() == 0) {
      userId = Accounts.createUser({
        email: "admin@mbes.com",
        emails: [{
          address: "admin@mbes.com",
          verified: true
        }],
        password: "pancholopez",
        profile: {
          name: "administrador"
        },
        roles: ["admin"]
      });
      log.info("creando usuario "+userId);
      Roles.addUserToRoles(userId, "admin");
      Meteor.users.update({"_id":userId}, {$set:{"roles":["admin"]}});
      Design_app.insert({color:"Azul",user:userId});
    };

    if(Sensors.find().count()===0){
      var obj = {
        "FingerService" : false,
        "updatedAt" : new Date(),
        "DeviceFingerConnect" : false,
        "FaceService" : false,
        "ProcessingFinger" : false,
        "PrintService" : false,
        "SyncService" : false,
        "ShowFingerService":true,
        "ShowDeviceFingerConnect":true,
        "ShowFaceService":true,
        "ShowPrintService":true,
        "ShowSyncService":true
      }
      Sensors.direct.insert(obj);
    }

    if (Config_application.find().count() === 0) {
      var obj = {
           "isServer" : false,
           "AccessWithFace":true,
           "enroll_docs" : true,
           "enroll_sign" : true,
           "enroll_face" : true,
           "motorBiometricOperations":"Online",
           "active" : true,
           "WebSocketFace":"wss://asistencias-xp-websockets.servicios.vangentmexico.com.mx",
           "WebSocketClientName":"AsistenciasPrueba",
           "WebSocketFinger":"ws://127.0.0.1:3060",
           "printTickets":true
      }
      Config_application.direct.insert(obj);
    };

    if (Employeestatuses.find().count() === 0) {
      var obj = [{
        _id: "7NAGoQFpPiaCz7hW6",
        empStatusName: "ACTIVO",
        empStatusDesc: "PENDIENTE POR ASIGNAR"
      },
      {
        _id: "3eRz4SNtFFWbtmYBf",
        empStatusName: "INACTIVO",
        empStatusDesc: "EMPLEADO NO ACTIVO"
      },
      {
        _id: "EYcCr39xnmoiKfMJm",
        empStatusName: "VACACIONES",
        empStatusDesc: "EMPLEADO EN VACACIONES"
      },
      {
        _id: "bbqMEZnMD4mmBT7F5",
        empStatusName: "BAJATMP",
        empStatusDesc: "EMPLEADO CON BAJA TEMPORAL"
      },
      {
        _id: "gz76JMkmN6pjS6fqF",
        empStatusName: "BAJADEF",
        empStatusDesc: "EMPLEADO CON BAJA DEFINITIVA"
      },
      {
        _id: "xZZ57wy7q74Pkbv7x",
        empStatusName: "ACTIVO-ADMIN",
        empStatusDesc: "ACTIVO-ADMIN"
      },
      {
        _id: "69Z57wy7q74Pkbavo",
        empStatusName: "VARIANTE",
        empStatusDesc: "SE QUITAN FALTAS Y RETARDOS"
      }
    ];
    for (var i = 0; i < obj.length; i++) {
      Employeestatuses.direct.insert(obj[i], function(err, res) {
        if (err) {
          logErrores.info("Err Create Employeestatuses "+err);
        }
      });
    }
  };

  if (LocationsReg.find().count()===0) {
    var obj = {
      "_id":"xZZ57wy7q74Pkbv7x",
      "name" : "desconocido",
      "desc":"desconocido",
      "active": true
    }
    LocationsReg.direct.insert(obj);
  };

  if (Config_station.find().count()===0) {
    var obj = {
      "status" : "offline",
      "status_device":"",
      "license" : "error",
      "devices_connected" : "no",
      "mongo_app":true,
      "server_ip":"159.182.151.39",
      "ip_license_finger":"159.182.151.38",
      "port_license_finger":"5000",
      "ip_license_face":"159.182.151.39",
      "port_license_face":"5000",
      "port_face_socket":52276,
      "ip_port_socket":"127.0.0.1",
      "port_socket":52275,
      "time_show_data":5,
      "active": true,
      "width_resolution":1280,
      "height_resolution":720,
      "port_print_socket":52277,
      "idLocation":"xZZ57wy7q74Pkbv7x",
      "ruta_qr":"https://asistencias-xp.servicios.vangentmexico.com.mx/"
    }
    Config_station.direct.insert(obj);
  };

  if (Temp_messages.find().count()===0) {
    var obj = {
      "status_verification" : "",
      "finished":false,
      "active": true
    }
    Temp_messages.direct.insert(obj);
  };

  if(Companies.find().count()===0){
    var obj = {
      _id:"s4sn7hZ9n49WEZrdq",
      companyName:"desconocido",
      companyDesc:"desconocido"
    }
    Companies.direct.insert(obj);
  }

  
  if(Employeespositions.find().count()===0){
    var obj = {
      _id:"s4sn7hZ9n49WEZrdq",
      empPosName:"desconocido",
      empPosDesc:"desconocido",
      idcompany:"s4sn7hZ9n49WEZrdq"
    }
    Employeespositions.direct.insert(obj);
  }

  if(Locations.find().count()===0){
    var obj = {
      _id:"s4sn7hZ9n49WEZrdq",
      locationName:"desconocido",
      locationDesc:"desconocido",
      idcompany:[
        "s4sn7hZ9n49WEZrdq"
      ],
    }
    Locations.direct.insert(obj);
  }

  if (Departments.find().count()===0) {
    var obj = {
      _id:"s4sn7hZ9n49WEZrdq",
      departmentName:"desconocido",
      idLocation:"s4sn7hZ9n49WEZrdq",
      idcompany:"s4sn7hZ9n49WEZrdq",
    }
    Departments.direct.insert(obj);
  }

  if (Employees.find().count()===0) {
    var obj = {
      _id:"s4sn7hZ9n49WEZrdq",
      idEmployee:1,
      employeeName:"administrador",
      idEmpPosition:"s4sn7hZ9n49WEZrdq",
      idEmpStatus:"7NAGoQFpPiaCz7hW6",
      idcompany:["s4sn7hZ9n49WEZrdq"],
      idDepartment:"s4sn7hZ9n49WEZrdq",
      idLocation:"s4sn7hZ9n49WEZrdq",
      roles:["Usuario Administrador"]

    }
    Employees.direct.insert(obj);
  }

});
}
