getDepartmentsForCompany=function(idCompany){
  var result=[];
  for(var hh=0;hh<idCompany.length;hh++){
    var idC=idCompany[hh];
    var deptos=Departments.find({
      "idcompany":idC,
      "active":true
    },{fields:{"_id":1,"departmentName":1}}).fetch();
    for (let i = 0; i < deptos.length; i++) {
      var obj={};
      var _idDepartment=deptos[i]._id.toString()
      var reports_deptos_faltas=Reports.find({
         $and:[
            {"idDepartment":_idDepartment},
            {"estatus":"Falta"},
            {"fechaIni":{$gte : Session.get("fechaInicio"),$lt : Session.get("fechaFin")}}
         ]
      },{fields:{_id:1}}).count();
      var reports_deptos_retardos=Reports.find({
        $or:[{estatus:'Retardo Normal'},{estatus:'Retardo Menor'},{estatus:'Retardo Mayor'}],
        "idDepartment":_idDepartment,
        "fechaIni":{$gte : Session.get("fechaInicio"),$lt : Session.get("fechaFin") }
      },{fields:{_id:1}}).count();
      var reports_deptos_anticipados=Reports.find({
        "idDepartment":_idDepartment,
        "antes":"true",
        "fechaIni":{$gte : Session.get("fechaInicio"),$lt : Session.get("fechaFin") }
      },{fields:{_id:1}}).count();
      var total=reports_deptos_faltas+reports_deptos_retardos+reports_deptos_anticipados;
      if (total!=0) {
        var _departmentName=deptos[i].departmentName;
        obj["_id"]=_idDepartment;
        obj["nombre"]=_departmentName;
        obj["faltas"]=reports_deptos_faltas;
        obj["retardos"]=reports_deptos_retardos;
        obj["anticipados"]=reports_deptos_anticipados;
        result.push(obj);
      }
    }
  }
  return result;
}

getExtraTimeOfDepartmentsForCompany=function(idCompany){
  var result=[];
  var deptos=Departments.find({"idcompany":{ $in:idCompany },"active":true}).fetch();
  var fechaInicio=Session.get('fechaInicio');
  var fechaFin=Session.get('fechaFin');
  for (let i = 0; i < deptos.length; i++) {
    var obj={};
    var _idDepartment=deptos[i]._id;
    var _departmentName=deptos[i].departmentName;
    var total=Extra_time.find({
      "idDepartment":_idDepartment,
      'createdAt':{$gte : fechaInicio, $lt: fechaFin }
    }).count();
    if (total!=0) {
      obj["_id"]=_idDepartment;
      obj["nombre"]=_departmentName;
      obj["cuantos"]=total;
      result.push(obj);
    }
  }
  return result;
}

getEmpForDepartment=function(idDepartment){
  var result=[];
  var deptos=Persons.find({"idDepartment":idDepartment,"active":true},{fields:{"_id":1,"employeeName":1}}).fetch();
  for (let i = 0; i < deptos.length; i++) {
    var obj={};
    var _idDepartment=deptos[i]._id;
    var _departmentName=deptos[i].employeeName;
    var reports_deptos_faltas=Reports.find({"_idEmployee":_idDepartment,"estatus":"Falta"}).count();
    var reports_deptos_retardos=Reports.find({$or:[{estatus:'Retardo'},{estatus:'Retardo Mayor'}],"_idEmployee":_idDepartment}).count();
    var reports_deptos_anticipados=Reports.find({"_idEmployee":_idDepartment,"antes":true}).count();
    var total=reports_deptos_faltas+reports_deptos_retardos+reports_deptos_anticipados;
    if (total!=0) {
      obj["_id"]=_idDepartment;
      obj["nombre"]=_departmentName;
      obj["faltas"]=reports_deptos_faltas;
      obj["retardos"]=reports_deptos_retardos;
      obj["anticipados"]=reports_deptos_anticipados;
      result.push(obj);
    }
  }
  return result;
}

getEmpForDepartment_extra_time=function(idDepartment){
  var deptos=Persons.find({"idDepartment":idDepartment,"active":true}).fetch();
  var _nombre=[], _cuantos=[];
  for (let i = 0; i < deptos.length; i++) {
    var _idDepartment=deptos[i]._id;
    var _departmentName=deptos[i].employeeName;
    var total=Extra_time.find({"_idEmployee":_idDepartment}).count();
    if (total!=0) {
      _nombre.push(_departmentName);
      _cuantos.push(total);
    }
  }
  var result={ xAxis:_nombre, cuantos:_cuantos };
  return result;
}



IfUser=function(){
  var _userId=Meteor.userId();
  var result=true;
  if (Roles.userHasRole(_userId, "Usuario") == true) {
    result=false;
  }
  return result;
};

GetEmpUser=function(){
  var result;
  var _userId=Meteor.userId();
  var res = Meteor.users.findOne({ "_id": _userId });
  var _id= res.profile.idEmployee;
  return _id;
};

TakePhoto=function(){
    if (Meteor.isCordova) {
      CameraPreview.takePicture({
        width: 480,
        height: 640,
        quality: 100
      }, function(base64PictureData) {
        imageSrcData = '' + base64PictureData;
        console.log("takePicture length:" + imageSrcData.length);
        Meteor.call('insertTakePhoto', imageSrcData, function(err, result) {
          $('#fotobtn').removeClass('disabled');
          if (err) {
            console.log("error al insertFotoEnVivo:" + err);
          } else {
            $('#fotobtn').removeClass('disabled');
          }
        });
      });
    } else {
      Template.viewfinder.getVideo(Template.viewfinder, function(data) {
        Meteor.call('insertTakePhoto', data, function(err, result) {
          if (err) {
            console.log("error al insertFotoEnVivo:" + err);
          }
        });
      });
    }
  }
