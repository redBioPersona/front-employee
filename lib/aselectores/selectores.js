SelectorAccessControl= function() {
    if (SelectorIsAdmin()) {
        var data=SelectorGetMyIdsCompanies();
        return { "idCompany":{$in:data} };
    } else {
      var data=SelectorGetMyIdsCompanies();
      if (SelectorIsAdministrator()) {
        return{
          $and:[
            {
              'idCompany': { $in:data }
            }
          ]
        };
      }else{
        if (SelectorWithUserCompany) {
          return {
            $and:[
              { 'idCompany': { $in:data } },
              { 'active': true }
            ]
          };
        }
      }
    }
}

SelectorArrayCompany= function() {
    if (SelectorIsAdmin()) {
        return { };
    } else {
      var data=SelectorGetMyIdsCompanies();
      if (SelectorIsAdministrator()) {
        return {
          'idcompany': { $in:data }
        }
      }else{
        if (SelectorWithUserCompany) {
          return {
              active: true,
              idcompany: { $in:data }
          }
        }
      }
    }
}

SelectorAccessDetails=function(){
  var res = Meteor.users.findOne({ "_id": Meteor.userId() });
  if (res && res.profile && res.profile.idcompany) {
    var _idCompany=[];
    var _idCompany = res.profile.idcompany;
    return { "idcompany":{$in:_idCompany} };
  };
}

SelectorEnrollments=function(){
  var res = Meteor.users.findOne({ "_id": Meteor.userId() });
  if (res && res.profile && res.profile.idcompany) {
    var _idCompany=[];
    var _idCompany = res.profile.idcompany;
    return { "idcompany":{$in:_idCompany} };
  };
}

SelectorJustCompany=function(){
  var res = Meteor.users.findOne({ "_id": Meteor.userId() });
  if (res && res.profile && res.profile.idcompany) {
    var _idCompany=[];
    var _idCompany = res.profile.idcompany;
    return { "idcompany":{$in:_idCompany} };
  };
}

SelectorReports=function(){
  var res = Meteor.users.findOne({ "_id": Meteor.userId() });
  if (res && res.profile && res.profile.idcompany) {
    var _idCompany=[];
    var _idCompany = res.profile.idcompany;
    return { "idcompany":{$in:_idCompany} };
  };
}

GetData=function(){
  var _userId=Meteor.userId();
  var arr=GetSearchingdate();
  if (Roles.userHasRole(_userId, "admin") == true) {
    return {
      "fechaIni":{$gte:arr[2],$lt:arr[3]}
    }
  }else {
    var res = Meteor.users.findOne({ "_id": _userId });
    if (res && res.profile && res.profile.idcompany) {
      var _idCompany = res.profile.idcompany;
      return {
        $and:[
          {
            "fechaIni":{$gte:arr[2],$lt:arr[3]}
          },
          {
            'idcompany': { $in:_idCompany }
          }
        ]
      };
    }
  }
}

Selector_DesingApp=function(){
  var _userId=Meteor.userId();
  return {
    user: _userId
  }
}

Selector_Justificantes=function(){
  var _userId=Meteor.userId();
  if (Roles.userHasRole(_userId, "Usuario Administrador") == true ||
      Roles.userHasRole(_userId, "Supervisor") == true) {
      var res = Meteor.users.findOne({ "_id":_userId });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany = res.profile.idcompany;
        return{
          "idcompany": { $in:_idCompany }
        };
      };
  }else if(  Roles.userHasRole(_userId, "Usuario") == true){
    var res = Meteor.users.findOne({ "_id": _userId });
    if (res && res.profile.idEmployee) {
        var _idEmp = res.profile.idEmployee;
        return {
            "idEmployee":_idEmp
        };
    }
  }
}

Selector_MyRecords=function(){
  var _userId=Meteor.userId();
  if (Roles.userHasRole(_userId, "Usuario Administrador") == true ||
      Roles.userHasRole(_userId, "Supervisor") == true) {
      var res = Meteor.users.findOne({ "_id":_userId });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        var arrayUsuario=["Usuario Administrador"];
        var _idCompany = res.profile.idcompany;
        return{
          idcompany: { $in:_idCompany }
        };
      };
  }else if(  Roles.userHasRole(_userId, "Usuario") == true){
    var res = Meteor.users.findOne({ "_id": _userId });
    if (res && res.profile.idEmployee) {
        var _idEmp = res.profile.idEmployee;
        var arrayUsuario=["Usuario"];
        return {
            idEmployee:_idEmp
        };
    }
  }
}

SelectorIsAdmin=function(){
  var _userId=Meteor.userId();
  var result;
  if (Roles.userHasRole(_userId, "admin") == true) {
    result=true;
  }else{
    result=false;
  }
  return result;
}

SelectorIsAdministrator=function(){
  var _userId=Meteor.userId();
  var result;
  if (Roles.userHasRole(_userId, "Usuario Administrador") == true) {
    result=true;
  }else{
    result=false;
  }
  return result;
}

SelectorWithUserCompany=function(){
  var _userId=Meteor.userId();
  var result;
  var res = Meteor.users.findOne({ "_id": _userId });
  if (res && res.profile.idcompany&&res.profile.idEmployee) {
    var _idCompany = res.profile.idcompany[0];
    var _idEmp = res.profile.idEmployee;
    var Data=Companies.findOne({_id:_idCompany,active:true});
    var Data2=Persons.findOne({_id:_idEmp,active:true});
    if (Data==undefined||Data2==undefined) {
      result=false;
    }else {
      result=true;
    }
  }else{
    result=false;
  }
  return result;
}

SelectorMealTime= function() {
  var res = Meteor.users.findOne({ "_id": Meteor.userId() });
  if (res && res.profile && res.profile.idcompany) {
    var _idCompany=[];
    var _idCompany = res.profile.idcompany;
    return { "idcompany":{$in:_idCompany} };
  };
}

SelectorNotificaciones=function(){
  var _userId=Meteor.userId();
  if (Roles.userHasRole(_userId, "Usuario Administrador") == true ||
      Roles.userHasRole(_userId, "Supervisor") == true) {
      var res = Meteor.users.findOne({ "_id":_userId });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        var arrayUsuario=["Usuario Administrador"];
        var _idCompany = res.profile.idcompany;
        return{
          $and:[
            { 'not_company': { $in:_idCompany } },
            {'not_rol_destino':{$in:arrayUsuario}}
          ]
        };
      };
  }else if(  Roles.userHasRole(_userId, "Usuario") == true){
    var res = Meteor.users.findOne({ "_id": _userId });
    if (res && res.profile.idEmployee) {
        var _idEmp = res.profile.idEmployee;
        var arrayUsuario=["Usuario"];
        return {
          $and:[
            { 'not_userId':_idEmp },
            {'not_rol_destino':{$in:arrayUsuario}}
          ]
        };
    }
  }
}

SelectorOnlyByCompany= function() {
  var _userId=Meteor.userId();
  var result;
  if (Roles.userHasRole(_userId, "admin") == true) {
    result={};
  }else if (Roles.userHasRole(_userId, "Usuario Administrador") == true) {
    var res = Meteor.users.findOne({ "_id": _userId });
    if(res!=undefined&&res.profile.idcompany[0]!=undefined){
      var _idCompany = res.profile.idcompany;
      result={
        idcompany: {$in:_idCompany}
      };
    }
  }else if (Roles.userHasRole(_userId, "Supervisor") == true) {
    var res = Meteor.users.findOne({ "_id": _userId });
    if(res!=undefined&&res.profile.idcompany[0]!=undefined){
      var _idCompany = res.profile.idcompany;
      result={
        active: true,
        idcompany: {$in:_idCompany}
      };
    }
  }else if (Roles.userHasRole(_userId, "Usuario") == true) {
    var res = Meteor.users.findOne({ "_id": _userId });
    if(res!=undefined&&res.profile.idcompany[0]!=undefined){
      var _idCompany = res.profile.idcompany;
      result={
        active: true,
        idcompany: {$in:_idCompany}
      };
    }
  }
  return result;
}

SelectorGetMyCompany=function(){
  var _userId=Meteor.userId();
  var result;
  var res = Meteor.users.findOne({ "_id": _userId });
  if(res!=undefined&&res.profile.idcompany[0]!=undefined){
    var _idCompany = res.profile.idcompany[0];
    var Data=Companies.findOne({_id:_idCompany,active:true});
    if (Data!=undefined) {
      result=Data;
    }else {
      result=undefined;
    }
  }
  return result;
}

SelectorGetMyEmployee=function(){
  var _userId=Meteor.userId();
  var result;
  var res = Meteor.users.findOne({ "_id": _userId });
  var _idCompany = res.profile.idEmployee;
  var Data=Persons.findOne({_id:_idCompany,active:true});
  if (Data!=undefined) {
    result=Data;
  }else {
    result=undefined;
  }
  return result;
}

SelectorGetMyIdsCompanies=function(){
  var _userId=Meteor.userId();
  var result=[];
  if (Roles.userHasRole(_userId, "admin") == true) {
    var Data=Companies.find().fetch();
    for (let i = 0; i < Data.length; i++) {
      result.push(Data[i]._id);
    }
  }else{
    var res = Meteor.users.findOne({ "_id": _userId });
    if(res!=undefined&&res.profile!=undefined){
      var _idCompany = res.profile.idcompany;
      if(_idCompany!=undefined){
        for (let i = 0; i < _idCompany.length; i++) {
          var _idC=_idCompany[i];
          var Data=Companies.findOne({_id:_idC},{fields:{"_id":1}});
          if(Data!=undefined)
          result.push(Data._id);
        }
      }
    }
  }
  return result;
}


Selector_Ican=function(){
  var _userId=Meteor.userId();
  var result;
  if (Roles.userHasRole(_userId, "admin") == true) {
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
  }else if (Roles.userHasRole(_userId, "Usuario") == true) {
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
    return "";
  }
}
