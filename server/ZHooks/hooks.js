macadd = MachineId.findOne();
if(macadd!=undefined){
  macadd= MachineId.findOne().idMachine;
}else{
  macadd="";
}

///////////////////////////////////////////////////////
//// ***********  Pagadoras HOOKS  ***********  ////
/////////////////////////////////////////////////////
Pagadoras.after.insert(function (userId, doc) {
  insertaSync(doc, "pagadoras", 'insert');
  return null;
});

Pagadoras.after.update(function (userId, doc) {
  insertaSync(doc, "pagadoras", 'update');
  return null;
});

Pagadoras.after.remove(function (userId, doc) {
  insertaSync(doc, "pagadoras", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********  Companies HOOKS  ***********  ////
/////////////////////////////////////////////////////
Companies.after.insert(function (userId, doc) {
  insertaSync(doc, "companies", 'insert');
  crearCompania(doc._id);
  return null;
});

Companies.after.update(function (userId, doc) {
  insertaSync(doc, "companies", 'update');
  return null;
});

Companies.after.remove(function (userId, doc) {
  insertaSync(doc, "companies", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********  USERS HOOKS  ***********  ////
/////////////////////////////////////////////////////

Meteor.users.after.insert(function (userId, doc) {
  insertaSync(doc, "Meteor.users", 'insert');
  return null;
});

Meteor.users.after.update(function (userId, doc, fieldNames, modifier, options) {
  var modify=[];
  modify=fieldNames;
  var result=_.without(modify, "heartbeat", "services");
  if(result.length>0){
    var obj = {};
    obj.clients = [];
    obj.origin = macadd;
    obj.collection = "Meteor.users";
    obj.type = "update";
    obj.doc = doc;
    obj.createdAt = new Date();
    //Sync.insert(obj);

    if(doc && doc.profile && doc.profile.idEmployee){
      var idEmployee =doc.profile.idEmployee;
      var mail=idEmployee+"@mbes.com"
      var res = Meteor.users.findOne({ "emails.address": mail});
      if(res==undefined){
          var DataPersons=Persons.findOne({"_id":idEmployee});
          if(DataPersons!=undefined){
            var name = DataPersons.employeeName;
            var idcompany = DataPersons.idcompany;
            var password = "pancholopez";
            var obj = {
                email: mail,
                emails: [{
                    address: mail,
                    verified: true
                }],
                password: password,
                profile: {
                    name: name,
                    idcompany: idcompany,
                    idEmployee: idEmployee,
                    face:true
                },
                roles: [
                    "Usuario"
                ]
            };
            userId = Accounts.createUser(obj);
            Meteor.users.update({"_id":userId}, {$set:{"roles":["Usuario"]}});
            insertaSync(doc, "Meteor.users", 'update');
            var DataDesign=Design_app.findOne({user: userId});
            if(DataDesign==undefined){
              Design_app.insert({ color: "Azul", user: userId });
            }
          }
      }else{
        var roles=[];
        roles=doc.roles;
        var up={
          "roles":roles
        };
        var DataUs = Meteor.users.find({"_id":{$ne:doc._id},"profile.idEmployee": idEmployee}).fetch();
        if(DataUs!=undefined){
          for (let index = 0; index < DataUs.length; index++) {
            var _idelement = DataUs[index]._id;
            var element = DataUs[index].roles;
            var equals=_.isEqual(roles, element)
            if(equals){}else{
              if(doc._id!=_idelement){
                Meteor.users.update({"_id":_idelement},{$set:up});
                insertaSync(doc, "Meteor.users", 'update');
              }
            }
          }
        }
      }
    }
    return null;
  }
});

Meteor.users.after.remove(function (userId, doc) {
  insertaSync(doc, "Meteor.users", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********  Design_app HOOKS  ***********  ////
/////////////////////////////////////////////////////

Design_app.after.insert(function (userId, doc) {
  insertaSync(doc, "design_app", 'insert');
  return null;
});

Design_app.after.update(function (userId, doc) {
  insertaSync(doc, "design_app", 'update');
  return null;
});
Design_app.after.remove(function (userId, doc) {
  insertaSync(doc, "design_app", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********      Days HOOKS     ***********  ////
/////////////////////////////////////////////////////

Days.after.insert(function (userId, doc) {
  insertaSync(doc, "days", 'insert');
  return null;
});

Days.after.update(function (userId, doc) {
  insertaSync(doc, "days", 'update');
  return null;
});

Days.after.remove(function (userId, doc) {
  insertaSync(doc, "days", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********     Persons HOOKS   ***********  ////
/////////////////////////////////////////////////////

Persons.after.insert(function (userId, doc) {
  insertaSync(doc, "persons", 'insert');
  CreateUpdateUser(doc._id,doc.employeeName,doc.idcompany,doc.empEmail,doc.roles);
  var design={
    "color":"Azul",
    "active":true,
  };
  design["user"]=doc._id;
  Design_app.insert(design);
  return null;
});

Persons.after.update(function (userId, doc) {
    insertaSync(doc, "persons", 'update');
    CreateUpdateUser(doc._id,doc.employeeName,doc.idcompany,doc.empEmail,doc.roles);
    return null;
});

Persons.after.remove(function (userId, doc) {
  Accesscontrol.remove({ idEmployee: doc._id }, function (err, res) {
    if (err) {log.error(err)} else {
      Accessdetails.remove({ idEmployee: doc._id });
    }});
  Meteor.users.remove({"profile.idEmployee":doc._id,function(err,res){
   if(err){
    log.error("Error al eliminar al usuario del empleado "+doc._id+" "+err);
   }
  }})
  insertaSync(doc, "persons", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********     Sanciones HOOKS   ***********  ////
/////////////////////////////////////////////////////

Sanciones.after.insert(function (userId, doc) {
  insertaSync(doc, "sanciones", 'insert');
  return null;
});

Sanciones.after.update(function (userId, doc) {
  insertaSync(doc, "sanciones", 'update');
  return null;
});

Sanciones.after.remove(function (userId, doc) {
  insertaSync(doc, "sanciones", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********Reglas_retardos HOOKS   ***********  ////
/////////////////////////////////////////////////////

Reglas_retardos.after.insert(function (userId, doc) {
  insertaSync(doc, "reglas_retardos", 'insert');
  return null;
});

Reglas_retardos.after.update(function (userId, doc) {
  insertaSync(doc, "reglas_retardos", 'update');
  return null;
});

Reglas_retardos.after.remove(function (userId, doc) {
  insertaSync(doc, "reglas_retardos", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********Reglas_alimentos HOOKS   ***********  ////
/////////////////////////////////////////////////////

Reglas_alimentos.after.insert(function (userId, doc) {
  insertaSync(doc, "reglas_alimentos", 'insert');
  return null;
});

Reglas_alimentos.after.update(function (userId, doc) {
  insertaSync(doc, "reglas_alimentos", 'update');
  return null;
});

Reglas_alimentos.after.remove(function (userId, doc) {
  insertaSync(doc, "reglas_alimentos", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********Employeestatuses HOOKS***********  ////
/////////////////////////////////////////////////////
Employeestatuses.after.insert(function (userId, doc) {
  insertaSync(doc, "employeestatuses", 'insert');
  return null;
});
Employeestatuses.after.update(function (userId, doc) {
  insertaSync(doc, "employeestatuses", 'update');
  return null;
});
Employeestatuses.after.remove(function (userId, doc) {
  insertaSync(doc, "employeestatuses", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********  Horarios HOOKS   ***********  ////
/////////////////////////////////////////////////////

Horarios.after.insert(function (userId, doc) {
  insertaSync(doc, "horarios", 'insert');
  return null;
});

Horarios.after.update(function (userId, doc) {
  insertaSync(doc, "horarios", 'update');
  return null;
});

Horarios.after.remove(function (userId, doc) {
  insertaSync(doc, "horarios", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********  Locations HOOKS   ***********  ////
/////////////////////////////////////////////////////

Locations.after.insert(function (userId, doc) {
  insertaSync(doc, "locations", 'insert');
  return null;
});

Locations.after.update(function (userId, doc) {
  insertaSync(doc, "locations", 'update');
  return null;
});

Locations.after.remove(function (userId, doc) {
  insertaSync(doc, "locations", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// ***********  Departments HOOKS   ***********  ////
/////////////////////////////////////////////////////

Departments.after.insert(function (userId, doc) {
  insertaSync(doc, "departments", 'insert');
  return null;
});
Departments.after.update(function (userId, doc) {
  insertaSync(doc, "departments", 'update');
  return null;
});
Departments.after.remove(function (userId, doc) {
  insertaSync(doc, "departments", 'remove');
  return null;
});

Direcciones.after.insert(function (userId, doc) {
  insertaSync(doc, "direcciones", 'insert');
  return null;
});
Direcciones.after.update(function (userId, doc) {
  insertaSync(doc, "direcciones", 'update');
  return null;
});
Direcciones.after.remove(function (userId, doc) {
  insertaSync(doc, "direcciones", 'remove');
  return null;
});

Areas.after.insert(function (userId, doc) {
  insertaSync(doc, "areas", 'insert');
  return null;
});
Areas.after.update(function (userId, doc) {
  insertaSync(doc, "areas", 'update');
  return null;
});
Areas.after.remove(function (userId, doc) {
  insertaSync(doc, "areas", 'remove');
  return null;
});

LocationsReg.after.insert(function (userId, doc) {
  insertaSync(doc, "locations_reg", 'insert');
  return null;
});
LocationsReg.after.remove(function (userId, doc) {
  insertaSync(doc, "locations_reg", 'remove');
  return null;
});


Proyectos.after.insert(function (userId, doc) {
  insertaSync(doc, "proyectos", 'insert');
  return null;
});
Proyectos.after.update(function (userId, doc) {
  insertaSync(doc, "proyectos", 'update');
  return null;
});
Proyectos.after.remove(function (userId, doc) {
  insertaSync(doc, "proyectos", 'remove');
  return null;
});

Jefes.after.insert(function (userId, doc) {
  insertaSync(doc, "jefes", 'insert');
  return null;
});
Jefes.after.update(function (userId, doc) {
  insertaSync(doc, "jefes", 'update');
  return null;
});
Jefes.after.remove(function (userId, doc) {
  insertaSync(doc, "jefes", 'remove');
  return null;
});

///////////////////////////////////////////
//  Employeespositions HOOKS               //
//////////////////////////////////////////
Employeespositions.after.insert(function (userId, doc) {
  insertaSync(doc, "employeespositions", 'insert');
  return null;
});
Employeespositions.after.update(function (userId, doc) {
  insertaSync(doc, "employeespositions", 'update');
  return null;
});
Employeespositions.after.remove(function (userId, doc) {
  insertaSync(doc, "employeespositions", 'remove');
  return null;
});

///////////////////////////////////////////
//  Employees HOOKS               //
//////////////////////////////////////////
Employees.after.insert(function (userId, doc) {
  insertaSync(doc, "employees", 'insert');
  return null;
});

///////////////////////////////////////////
//  Restaurants HOOKS               //
//////////////////////////////////////////
Restaurants.after.insert(function (userId, doc) {
  insertaSync(doc, "restaurants", 'insert');
  return null;
});
Restaurants.after.update(function (userId, doc) {
  insertaSync(doc, "restaurants", 'update');
  return null;
});
Restaurants.after.remove(function (userId, doc) {
  insertaSync(doc, "restaurants", 'remove');
  return null;
});

///////////////////////////////////////////
//  Devices HOOKS               //
//////////////////////////////////////////
Devices.after.insert(function (userId, doc) {
  var obj = {};
  obj.clients = [];
  obj.origin = macadd;
  obj.collection = "Devices";
  obj.type = "insert";
  obj.doc = doc;
  obj.createdAt = new Date();
  //Sync.insert(obj);
  return null;
});
Devices.after.update(function (userId, doc) {
  var obj = {};
  obj.clients = [];
  obj.origin = macadd;
  obj.collection = "Devices";
  obj.type = "update";
  obj.doc = doc;
  obj.createdAt = new Date();
  //Sync.insert(obj);
  return null;
});

///////////////////////////////////////////
///////////  Prints HOOKS             ////
//////////////////////////////////////////
Prints.after.insert(function (userId, doc) {
  var obj = {};
  obj.clients = [];
  obj.origin = macadd;
  obj.collection = "Prints";
  obj.type = "insert";
  obj.doc = doc;
  obj.createdAt = new Date();
  //Sync.insert(obj);
  return null;
});
Prints.after.update(function (userId, doc) {
  var obj = {};
  obj.clients = [];
  obj.origin = macadd;
  obj.collection = "Prints";
  obj.type = "update";
  obj.doc = doc;
  obj.createdAt = new Date();
  //Sync.insert(obj);
  return null;
});

///////////////////////////////////////////////////////
//// *********** Vacations HOOKS   ***********  ////
/////////////////////////////////////////////////////

Vacations.after.insert(function (userId, doc) {
  insertaSync(doc, "vacations", 'insert');
  return null;
});
Vacations.after.update(function (userId, doc) {
  insertaSync(doc, "vacations", 'update');
  return null;
});
Vacations.after.remove(function (userId, doc) {
  insertaSync(doc, "vacations", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// *********** Notificaciones HOOKS   ***********  ////
/////////////////////////////////////////////////////

Notificaciones.after.insert(function (userId, doc) {
  insertaSync(doc, "notificaciones", 'insert');
  return null;
});
Notificaciones.after.update(function (userId, doc) {
  insertaSync(doc, "notificaciones", 'update');
  return null;
});
Notificaciones.after.remove(function (userId, doc) {
  insertaSync(doc, "notificaciones", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// *********** Permisos HOOKS   ***********  ////
/////////////////////////////////////////////////////

Permisos.after.insert(function (userId, doc) {
  var obj = {};
  obj.clients = [];
  obj.origin = macadd;
  obj.collection = "Permisos";
  obj.type = "insert";
  obj.doc = doc;
  obj.createdAt = new Date();
  var data=Persons.findOne({"_id":doc.idEmployee});
  if(data!=undefined){
      var fecha=formatSimpleDate(doc.fechaIni)+"-"+formatSimpleDate(doc.fechaFin);
      WriteNotificaciones(data.employeeName,"Permiso","USERS",doc.idcompany,doc.idEmployee,fecha);
  }
  insertaSync(doc, "permisos", 'insert');
  return null;
});
Permisos.after.update(function (userId, doc) {
  insertaSync(doc, "permisos", 'update');
  return null;
});
Permisos.after.remove(function (userId, doc) {
  insertaSync(doc, "permisos", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// *********** Feriados HOOKS   ***********  ////
/////////////////////////////////////////////////////

Feriados.after.insert(function (userId, doc) {
  insertaSync(doc, "feriados", 'insert');
  return null;
});
Feriados.after.update(function (userId, doc) {
  insertaSync(doc, "feriados", 'update');
  return null;
});
Feriados.after.remove(function (userId, doc) {
  insertaSync(doc, "feriados", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// *********** Incidencias HOOKS   ***********  ////
/////////////////////////////////////////////////////

Incidencias.after.insert(function (userId, doc) {
  insertaSync(doc, "incidencias", 'insert');
  return null;
});
Incidencias.after.update(function (userId, doc) {
  insertaSync(doc, "incidencias", 'update');
  return null;
});
Incidencias.after.remove(function (userId, doc) {
  insertaSync(doc, "incidencias", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// *********** Justificantes HOOKS   ***********  ////
/////////////////////////////////////////////////////

Justificantes.after.insert(function (userId, doc) {
  var obj = {};
  obj.clients = [];
  obj.origin = macadd;
  obj.collection = "Justificantes";
  obj.type = "insert";
  obj.doc = doc;
  obj.createdAt = new Date();
  WriteNotificaciones(doc.idEmpName,"Justificante","ADMIN",doc.idcompany,doc.idEmployee,doc.fecha);
  insertaSync(doc, "justificantes", 'insert');
  return null;
});
Justificantes.after.update(function (userId, doc) {
  insertaSync(doc, "justificantes", 'update');
  return null;
});
Justificantes.after.remove(function (userId, doc) {
  insertaSync(doc, "justificantes", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// *********** Documents HOOKS   ***********  ////
/////////////////////////////////////////////////////

Documents.after.insert(function (userId, doc) {
  insertaSync(doc, "documents", 'insert');
  return null;
});
Documents.after.update(function (userId, doc) {
  insertaSync(doc, "documents", 'update');
  return null;
});
Documents.after.remove(function (userId, doc) {
  insertaSync(doc, "documents", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// *********** Estaciones HOOKS   ***********  ////
/////////////////////////////////////////////////////

Estaciones.after.insert(function (userId, doc) {
  insertaSync(doc, "estaciones", 'insert');
  return null;
});
Estaciones.after.update(function (userId, doc) {
  insertaSync(doc, "estaciones", 'update');
  return null;
});
Estaciones.after.remove(function (userId, doc) {
  insertaSync(doc, "estaciones", 'remove');
  return null;
});

///////////////////////////////////////////////////////
//// *********** Enrollments HOOKS   ***********  ////
/////////////////////////////////////////////////////

Enrollments.after.insert(function (userId, doc) {
  insertaSync(doc, "enrollments", 'insert');
  return null;
});
Enrollments.after.update(function (userId, doc) {
  insertaSync(doc, "enrollments", 'update');
  return null;
});
Enrollments.after.remove(function (userId, doc) {
  insertaSync(doc, "enrollments", 'remove');
  return null;
});

orionFileCollection.after.insert(function (userId, doc) {
  insertaImagen(doc)
});

orion.filesystem.collection.after.insert(function (userId, doc) {
  insertaImagen(doc)
  insertaSync(doc, 'orion.filesystem.collection', 'insert');
});

Sync.after.insert(function (userId, doc) {
  return null;
});

insertaSync=function(doc, coleccion, type) {
  if (doc) {
    var obj = {};
    obj.clients = [];
    obj.origin = macadd;
    obj.collection = coleccion;
    obj.type = type;
    obj.doc = doc;
    obj.createdAt = new Date();
    Sync.insert(obj,function(err,res){
      if(err){
        logErrores.info("Err insert Sync "+err);
      }
    });
  }
}

function insertaImagen(obj) {
  Meteor.call("insertaImagen",obj);
}

function crearCompania(idcompany){
  const desconocido="desconocido";
  Locations.direct.insert({
    locationName:desconocido,
    locationDesc:desconocido,
    idcompany:[
      idcompany
    ],
    active:true
  });
  Departments.direct.insert({
    departmentName:desconocido,
    departmentDesc:desconocido,
    idcompany:idcompany
  });

}
