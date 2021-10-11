if (Meteor.isServer) {
  const Fibers = require('fibers');

  getLastEmployeeId=function(numero,_id,userId){
    ++numero;
    var res = Meteor.users.findOne({ "_id": userId });
    if (res && res.profile && res.profile.idcompany) {
      var _idCompany = res.profile.idcompany;
      var dataP=Persons.findOne({
        $and:[
        {"idEmployee" :parseInt(numero)},
        {"idcompany":{$in:_idCompany}}
      ]});
      if(dataP!=undefined){
        return getLastEmployeeId(numero,_id,userId);
      }else{
        return numero;
      }
    }else{
      return undefined
    }
  }
  
  getMailFromRestaurantName=function(restaurantName){
    var result=undefined;
    var data=Restaurants.findOne({"restaurantName":restaurantName},{fields:{"restEmail":1}});
    if(data!=undefined && data.restEmail!=undefined){
      result=data.restEmail;
    }
    return result;
  }

  getMailFromPersonName=function(employeeName){
    var result=undefined;
    var data=Persons.findOne({"employeeName":employeeName},{fields:{"empEmail":1}});
    if(data!=undefined && data.empEmail!=undefined){
      result=data.empEmail;
    }
    return result;
  }

  CreateUpdateUser=function(EmployeeId,EmployeeName,EmployeeCompany,Correo,Roles){
    if(Roles!=undefined){
      var res = Meteor.users.find({ "profile.idEmployee": EmployeeId}).fetch();
      if(res.length!=0){
        for (var i = 0; i < res.length; i++) {
           Meteor.users.update({"_id":res[i]._id}, {$set:{"roles":Roles}});
        }
      }else{
        try {
          Accounts.createUser({
              email: EmployeeId+"@mbes.com",
              emails: [{
                  address: EmployeeId+"@mbes.com",
                  verified: true
              }],
              password: "pancholopez",
              profile: {
                  name: EmployeeName,
                  idcompany: EmployeeCompany,
                  idEmployee: EmployeeId,
                  face : true
              },
              roles: Roles
          });
        } catch (error) {} 
          var a0=Meteor.users.findOne({"emails.address":EmployeeId+"@mbes.com"});
          if(a0){
            Design_app.insert({"color":"Azul","user":a0._id});
            Meteor.users.update({"_id":a0._id}, {$set:{"roles":Roles}});
            var a1=Meteor.users.findOne({"_id":a0._id});
            insertaSync(a1, "Meteor.users", 'update');
          }               
       }

      if(Correo!=undefined && Correo !=""){
        var res = Meteor.users.find({ "emails.address": Correo}).fetch();
        if(res.length!=0){
          for (var i = 0; i < res.length; i++) {            
             Meteor.users.update({"_id":res[i]._id}, {$set:{"roles":Roles}});
             var fo= Meteor.users.findOne({_id:res[i]._id});
             if(fo!=undefined){
              insertaSync(fo, "Meteor.users", 'update');
             }             
          }
        }else{
          try {
            Accounts.createUser({
                email: Correo,
                emails: [{
                    address: Correo,
                    verified: true
                }],
                password: GetPasswordFromMail(Correo),
                profile: {
                    name: EmployeeName,
                    idcompany: EmployeeCompany,
                    idEmployee: EmployeeId
                },
                roles: Roles
            });
          } catch (error) {}
          var a0=Meteor.users.findOne({"emails.address":Correo});
          if(a0){
            Design_app.insert({"color":"Azul","user":a0._id});
            Meteor.users.update({"_id":a0._id}, {$set:{"roles":Roles}});
            var a1=Meteor.users.findOne({"_id":a0._id});
            insertaSync(a1, "Meteor.users", 'update');
          }            
        }
      }
    }
  }

  getRenderDevice=function(val){
    if(val!="Mobile" && val!="Facial"){
      return "Dactilar";
    }else{
      return val;
    }
  }

  getNamePerson=function(_id){
    var result="";
    var res = Persons.findOne({ "_id": _id },{fields:{employeeName:1}});
    if (res && res.employeeName) {
        result = res.employeeName;
    }
    return result;
  }

  getIdPerson=function(_id){
    var result="";
    var res = Persons.findOne({ "_id": _id },{fields:{idEmployee:1}});
    if (res && res.idEmployee) {
        result = res.idEmployee.toString();
    }
    return result;
  }

  getNameUserAccount=function(_id){
    var result="";
    var res = Meteor.users.findOne({ "_id": _id });
    if (res && res.profile && res.profile.name) {
        result = res.profile.name;
    }
    return result;
  }

  getDaysArray = function(start, end) {
      for(var arr=[],dt=start; dt<=end; dt.setDate(dt.getDate()+1)){
          arr.push(new Date(dt));
      }
      return arr;
  };

   MultipartFormData=function(parts) {
    var boundary = '----' + (new Date()).getTime();
    var bodyString = [];
    _.each(parts, function(value, name, blah) {
      if (name === 'attachment') {
        bodyString.push(
          '--' + boundary,
          'Content-Disposition: form-data; name="' + name + '";' +
          'filename="' + value.filename + '"',
          'Content-type: ' + value.contentType,
          '',
          value.value);
      } else {
        bodyString.push(
          '--' + boundary,
          'Content-Disposition: form-data; name="' + name + '"',
          '',
          value);
      }
    });
    bodyString.push('--' + boundary + '--', '');
    return {
      content: bodyString.join('\r\n'),
      headers: {
        'Content-Type': 'multipart/form-data;boundary=' + boundary
      }
    }
  }

  UpdateSensor=function(Sensor,estatus){
    var fiber = Fibers.current;
    Fibers(function () {
      var data=Sensors.findOne();
      if(data!=undefined){
        var _id=data._id;
        var statusActual=data[Sensor];
        if(statusActual!=estatus){
          var obj={};
          obj[Sensor]=estatus;
          Sensors.update({"_id":_id}, {$set:obj});
        }
      }
    }).run();
  }

  CreateAccount=function(empEmail,name,idEmployee,idcompany){
    if(empEmail!=undefined && name!=undefined && idEmployee!=undefined && idcompany!=undefined){
      var res = Meteor.users.findOne({ "emails.address": empEmail});
      if(res==undefined){
        var newidcompany=[];
        if(typeof idcompany=="string"){
          newidcompany.push(idcompany.toString());
        }else{
          newidcompany=idcompany;
        }      
        try {
          var password = GetPasswordFromMail(empEmail);
          Accounts.createUser({
            email:  empEmail.toString().toLowerCase(),
            emails: [{
                address: empEmail.toString().toLowerCase(),
                verified: true
            }],
            password: password.toString(),
            profile: {
                name: name.toString().toUpperCase(),
                idcompany: newidcompany,
                idEmployee: idEmployee.toString()
            },
            roles: ["Usuario"]
          });
        } catch (error) {}
          try {
            if(Meteor.users.findOne({"profile.idEmployee": idEmployee.toString()})){
              var userId=Meteor.users.findOne({"profile.idEmployee": idEmployee.toString()})._id;
              Meteor.users.update({"_id":userId}, {$set:{"roles":["Usuario"]}});
              var DataDesign=Design_app.findOne({"user": userId});
              if(DataDesign==undefined){
                Design_app.insert({ color: "Azul", user: userId });
              }
              Roles.addUserToRoles(userId, "Usuario");
              var insync=Meteor.users.findOne({"_id":userId});
              // insertaSync(insync, "Meteor.users", 'insert');
            }          
          } catch (error) {
            console.log("Err addUserToRoles "+error) ;
          }  
        
      }
    }    
  }
}
