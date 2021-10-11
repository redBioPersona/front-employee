if(Meteor.isServer){

  Meteor.publish('GetSelectOnePersons', function () {
    var res = Meteor.users.findOne({ "_id": Meteor.userId() });
    if (res && res.profile && res.profile.idcompany) {
      var _idCompany=[];
      _idCompany = res.profile.idcompany;
      var empS=Employeestatuses.findOne({"empStatusName" : "BAJADEF"})._id;
      return Persons.find({
        $and:[
          {"idcompany": {$in: _idCompany}},
          {"active":true},
          {"idEmpStatus":{$ne:empS}},
        ]
       },
       { fields: { idEmployee:1,employeeName: 1 },sort:{employeeName:1}});
    }
  });

  Meteor.publish('GetSelectOneJefe', function () {
    var res = Meteor.users.findOne({ "_id": Meteor.userId() });
    if (res && res.profile && res.profile.idcompany) {
      var _idCompany=[];
      _idCompany = res.profile.idcompany;
      return Jefes.find({
        $and:[
          {"idcompany": {$in: _idCompany}},
          {"active":true},
        ]
       },
       { fields: {employeeName: 1 },sort:{employeeName:1}});
    }
  });


  Meteor.publish('GetSelectOneDirecciones', function () {
    var res = Meteor.users.findOne({ "_id": Meteor.userId() });
    if (res && res.profile && res.profile.idcompany) {
      var _idCompany=[];
      _idCompany = res.profile.idcompany;
      return Direcciones.find({
        $and:[
          {"idcompany": {$in: _idCompany}},
          {"active":true},
        ]
       },
       { fields: {direccionName: 1 },sort:{direccionName:1}});
    }
  });

  Meteor.publish('GetSelectOneReglasRetardos', function () {
     if (Roles.userHasRole(Meteor.userId(), "admin") == true) {
      return Reglas_retardos.find({ "active":true },
      { fields: { clave:1,etiqueta: 1 },sort:{clave:1}});
    }else{
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Reglas_retardos.find({
          $and:[
            {"idcompany": {$in: _idCompany}},
            {"active":true}
          ]
        },
        { fields: { clave:1,etiqueta: 1 },sort:{clave:1}});
      }
    }    
  });

  
  Meteor.publish('GetSelectOneDepartments', function () {
     if (Roles.userHasRole(Meteor.userId(), "admin") == true) {
      return Departments.find({ "active":true });
    }else{
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Departments.find({
          $and:[
            {"idcompany": {$in: _idCompany}},
            {"active":true}
          ]
        });
      }
    }    
  });

  Meteor.publish('GetSelectOneCompanies', function () {
    if (Roles.userHasRole(Meteor.userId(), "admin") == true) {
      return Companies.find({"active":true},
       { fields: { companyName:1},sort:{companyName:1}});
    }else{
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Companies.find({
          $and:[
            {"_id": {$in: _idCompany}},
            {"active":true}
          ]
         },
         { fields: { companyName:1},sort:{companyName:1}});
      }
    }
  });

  Meteor.publish('GetSelectOneLocationsReg', function () {
      return LocationsReg.find({ "active":true});
  });

  Meteor.publish('GetSelectOneSanciones', function () {
    if (Roles.userHasRole(Meteor.userId(), "admin") == true) {
      return Sanciones.find({ "active":true },
      { fields: { clave:1,etiqueta: 1 },sort:{clave:1}});
    }else{
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Sanciones.find({
          $and:[
            {"idcompany": {$in: _idCompany}},
            {"active":true}
          ]
        },
        { fields: { clave:1,etiqueta: 1 },sort:{clave:1}});
      }
    }    
  });

  Meteor.publish('GetSelectOneIncidencias', function () {
    if (Roles.userHasRole(Meteor.userId(), "admin") == true) {
      return Incidencias.find({ "active":true },
       { fields: { razon:1},sort:{razon:1}});
    }else{
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Incidencias.find({
          $and:[
            {"idcompany": {$in: _idCompany}},
            {"active":true}
          ]
         },
         { fields: { razon:1},sort:{razon:1}});
      }
    }
  });

  Meteor.publish('GetSelectOneReglasAlimentos', function () {
    if (Roles.userHasRole(Meteor.userId(), "admin") == true) {
      return Reglas_alimentos.find({ "active":true },
       { fields: { clave:1,etiqueta: 1 },sort:{clave:1}});
    }else{
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Reglas_alimentos.find({
          $and:[
            {"idcompany": {$in: _idCompany}},
            {"active":true}
          ]
         },
         { fields: { clave:1,etiqueta: 1 },sort:{clave:1}});
      }
    }
  });

  Meteor.publish('GetSelectOneHorarios', function () {
    if (Roles.userHasRole(Meteor.userId(), "admin") == true) {
      return Horarios.find({ "active":true },
      { fields: { clave:1},sort:{clave:1}});
    }else{
      var res = Meteor.users.findOne({ "_id": Meteor.userId()});
      if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
          var _idCompany = res.profile.idcompany;
          return Horarios.find({
            $and:[
              {"idcompany": {$in: _idCompany}},
              {"active":true}
            ]
          },
          { fields: { clave:1},sort:{clave:1}});
      }
    }    
  });

  Meteor.publish('GetSelectOneLocations', function () {
    if (Roles.userHasRole(Meteor.userId(), "admin") == true) {
      return Locations.find({"active":true},
       { fields: { locationName:1},sort:{locationName:1}});
    }else{
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Locations.find({
          $and:[
            {"idcompany": {$in: _idCompany}},
            {"active":true}
          ]
         },
         { fields: { locationName:1},sort:{locationName:1}});
      }
    }    
  });

}
