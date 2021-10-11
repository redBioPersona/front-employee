FunctionAccessDetails=function(_idAccessDetail,_idEmpleado, employeeName, idEmp, nodes, idDevice,fpMatchResult){
  var filtroAccess = {"idEmployee": _idEmpleado};
  var AccessControlList=Accesscontrol.findOne(filtroAccess,{fields:{"_id":1},sort:{createdAt:-1},limit:1});
  var idAccessCtrl="";
  if(AccessControlList!=undefined){
    idAccessCtrl=AccessControlList._id;
  }
  var ConfigStationList=Config_station.findOne({});
  var idLocation="";
  if(ConfigStationList!=undefined){
    idLocation=ConfigStationList.idLocation;
  }

  var ahora=moment().toDate();
  var result={
    "idAccessCtrl" : idAccessCtrl,
    "employeeName" : employeeName,
    "idEmp" :idEmp,
    "idcompany" :nodes,
    "idEmployee" : _idEmpleado,
    "idLocation" :idLocation,
    "idLocation_txt" :GetCheckLocationName(idLocation),
    "idDevice" : idDevice,
    "fpMatchResult" : fpMatchResult,
    "accessResult" : "OK",
    "accessDate": ahora ,
    "createdAt" : ahora,
    "updatedAt" : ahora
  };
  if(_idAccessDetail){
    result["idAccessCtrl"]=_idAccessDetail;
  }

  Accessdetails.insert(result,function(err,res){
    if(err){
        logErrores.info("Error insertar en Accessdetails "+err);
    }
    if(res){
      result["_id"]=res;
      result["empPhoto" ]={
        "fileId" : "000000000000000000000000",
        "url" : "/gridfs/data/id/000000000000000000000000",
        "filename" : "000000000000000000000000"
      };
      delete result.employeeName;
      delete result.idEmp;
      delete result.idcompany;
      delete result.idLocation_txt;
      delete result.active;
      delete result.active;
      insertaSync(result, "accessdetails", 'insert');
    }
  });


}
