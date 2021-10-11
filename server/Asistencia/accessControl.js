LastAccessControl=function(_idEmpleado){
  var result=undefined;
  var filtroAccess = {"idEmployee": _idEmpleado};
  var accesscontrol_list=Accesscontrol.findOne(filtroAccess,{fields:{firstAccess:1,lastAccess:1},limit:1,sort:{updatedAt:-1}});
  if(accesscontrol_list!=undefined){
    if(accesscontrol_list.lastAccess){
      result=accesscontrol_list.lastAccess;
    }else{
      result=accesscontrol_list.firstAccess;
    }
  }else{    
    result=moment().subtract(45, 'seconds').toDate();
  }
  return result;
}

FunctionAccessControl=function(_idEmpleado,MetodoAcceso,WithMeal){
  var _idAccessDetail=undefined;
  var filtroAccess = {"idEmployee": _idEmpleado};
  var filtroReport = {"_idEmployee":_idEmpleado};
  var filtroEmp    = {"_id": _idEmpleado};
  var fpMatchResult="OK";
  var accesscontrol_list=Accesscontrol.findOne(filtroAccess,{fields:{firstAccess:1},limit:1,sort:{createdAt:-1}})
  var persons_list=Persons.findOne(filtroEmp);

  var idEmp = parseInt(persons_list.idEmployee);
  var employeeName = persons_list.employeeName;
  var idDepartment = persons_list.idDepartment;
  var idLocation = persons_list.idLocation;
  var idmanager = persons_list.idmanager;
  var idpagadora=persons_list.idpagadora;
  var nodes=persons_list.idcompany;
  if(nodes!=persons_list.idcompany){
    logAccesos.info("La compañia "+nodes+" no coincide con :"+persons_list.idcompany);
    nodes=persons_list.idcompany;
  }

  if (accesscontrol_list==undefined) {
    logAccesos.info("Insertando un AccessControl "+_idEmpleado+" - "+employeeName+" - "+idDepartment+" - "+idLocation+" - "+idmanager+" - "+idEmp+" - "+nodes);
    _idAccessDetail=Insert_AcessCtrl(_idEmpleado, employeeName, idDepartment, idLocation, idmanager, idEmp,nodes,MetodoAcceso,idpagadora,persons_list);
  } else {
    var fecha_actual = moment().format('DD/MM/YYYY');
    var firstAccess = accesscontrol_list.firstAccess;
    var fecha_primer_acceso = moment(firstAccess).format('DD/MM/YYYY');
    if (fecha_actual==fecha_primer_acceso) {
      _idAccessDetail=accesscontrol_list._id;
      var ultimoAcceso=moment();

      logAccesos.info("actualizando ctrl acceso " + fecha_actual);
      var upSet={
        "lastAccess":ultimoAcceso.toDate()
      };
      if(WithMeal){
        upSet["meal"]=true;
        fpMatchResult="MEAL";
      }

      Accesscontrol.update({_id:accesscontrol_list._id}, {$set:upSet},function(err,res){
        if(err){
          logErrores.info("Err Update AccessControl "+err);
        }
        if(res){
          var obj={
            "_id":accesscontrol_list._id,
            "lastAccess":ultimoAcceso.toDate()
          };
          if(WithMeal){
            obj["meal"]=true;
          }
          insertaSync(obj, "accesscontrol", 'update');
        }
      });
      var ReportsList=Reports.findOne({"fecha":fecha_actual,"_idEmployee":_idEmpleado});
      var inicioOficial="08:00";
      var salidaOficial="18:00";
      var primerRegistro=moment(firstAccess).format("HH:mm");
      if(ReportsList!=undefined){
        inicioOficial=ReportsList.inicioOficial;
        salidaOficial=ReportsList.salidaOficial;
        primerRegistro=ReportsList.primerRegistro;
        
        var reports={
          "ultimoRegistro":moment(ultimoAcceso).format("HH:mm"),
          "excepcion":"No",
          "tiempo":getTiempo(firstAccess,ultimoAcceso.toDate()),
          "horas":getHoras(firstAccess,ultimoAcceso.toDate()),
          "antes":GenerateReports_getAntes(ultimoAcceso.toDate(),salidaOficial),
          "fechaFin":ultimoAcceso.toDate()
        };
        var DetalleAcceso=Accessdetails.findOne({"idAccessCtrl":accesscontrol_list._id},{sort:{createdAt:1}});
        if(DetalleAcceso){
          reports["idDevice"]=GetidDevice(DetalleAcceso.idDevice);
          reports["idLocationChk"]=DetalleAcceso.idLocation;
          reports["idLocationChk_txt"]=DetalleAcceso.idLocation_txt;
        }

        Reports.update({_id:ReportsList._id}, {$set:reports},function(err,res){
          if(err){
            logErrores.info("Err al Actualizar Reports "+err);
          }
          if(res){
            reports["_id"]=ReportsList._id;
            //insertaSync(reports, "reports", 'update');
          }
        });

      }
     
      var crearET=crearExtraTime(inicioOficial,salidaOficial,primerRegistro,moment(ultimoAcceso).format("HH:mm"));
      if(crearET){
        var Existsextra={
          "_idEmployee":_idEmpleado,
          "fecha" : fecha_actual
        };
        logAccesos.info("El usuario cumplio con tiempo extra, verificando si ya existe, buscando :"+JSON.stringify(Existsextra));
        var DataExtraTime=Extra_time.findOne(Existsextra);
        if(DataExtraTime!=undefined){
          var _idExtraTime=DataExtraTime._id;
          var extra={
            "_idEmployee" : _idEmpleado,
            "salidaLaborado" : moment(ultimoAcceso).format("HH:mm"),
            "tiempoLaborado" : returnHours(primerRegistro, moment(ultimoAcceso).format("HH:mm")),
            "hrsLaborado" : returnHours(primerRegistro, moment(ultimoAcceso).format("HH:mm")).split(":")[0],
            "minLaborado" : returnHours(primerRegistro, moment(ultimoAcceso).format("HH:mm")).split(":")[1],
            "createdAt" :new Date()
          };
          logAccesos.info("Actualizando Tiempo Extra "+JSON.stringify(extra));
          Extra_time.direct.update({_id:_idExtraTime},{$set:extra},function(err,res){
            if(err){
              logErrores.info("Extra_time "+err);
            }
            if(res){
              extra["_id"]=_idExtraTime,
              insertaSync(extra, "extra_time", 'update');
            }
          });
        }else{
          var extra={
            "_idEmployee" : _idEmpleado,
            "employeeName" : employeeName,
            "idEmployee" :parseInt(idEmp),
            "idDepartment" : idDepartment,
            "idDepartment_txt" :GetDeptoName(idDepartment),
            "idLocation" : idLocation,
            "idLocation_txt" : GetMyLocationName(idLocation),
            "idcompany" :  nodes,
            "fecha" : fecha_primer_acceso,
            "inicioOficial" :inicioOficial,
            "salidaOficial" : salidaOficial,
            "tiempoOficial" :returnHours(inicioOficial,salidaOficial),
            "inicioLaborado" : primerRegistro,
            "salidaLaborado" : moment(ultimoAcceso).format("HH:mm"),
            "tiempoLaborado" : returnHours(primerRegistro, moment(ultimoAcceso).format("HH:mm")),
            "hrsLaborado" : returnHours(primerRegistro, moment(ultimoAcceso).format("HH:mm")).split(":")[0],
            "minLaborado" : returnHours(primerRegistro, moment(ultimoAcceso).format("HH:mm")).split(":")[1],
            "createdAt" :new Date(),
            "idmanager" :idmanager,
            "hrsOficial" :returnHours(inicioOficial,salidaOficial).split(":")[0],
            "minOficial" :returnHours(inicioOficial,salidaOficial).split(":")[1],
          };
          logAccesos.info("Insertando en Tiempo Extra "+JSON.stringify(extra));

          Extra_time.direct.insert(extra,function(err,res){
            if(err){
              logErrores.info("insert "+err);
            }
            if(res){
              extra["_id"]=res;
              insertaSync(extra, "extra_time", 'insert');
            }
          });
        }
      }
    }
    else {
      _idAccessDetail=Insert_AcessCtrl(_idEmpleado, employeeName, idDepartment, idLocation, idmanager, idEmp,nodes,MetodoAcceso,idpagadora,persons_list);
    }
  }
  FunctionAccessDetails(_idAccessDetail,_idEmpleado, employeeName, idEmp, nodes, MetodoAcceso,fpMatchResult);
}

Insert_AcessCtrl=function(_idEmpleado, employeeName, idDepartment, idLocation, idmanager, idEmp,idCompany,MetodoAcceso,idpagadora,persons_list){
  var entro=moment();
  var inicioOficial="08:00";
  var salidaOficial="18:00";
  var estatus="-";
  var sancion="-";
  var FullHorario=getHorario(_idEmpleado);
  if(FullHorario!=undefined){
    var TheHorario=FullHorario["Horarios"];
    if (TheHorario!=undefined) {
      var fechaSem = moment(entro).format("dddd");
      fechaSem = fechaSem.replace(/á/gi,"a");
      fechaSem = fechaSem.replace(/é/gi,"e");
      fechaSem = fechaSem.replace(/í/gi,"i");
      fechaSem = fechaSem.replace(/ó/gi,"o");
      fechaSem = fechaSem.replace(/ú/gi,"u");
      var existDayintoJournal=TheHorario[fechaSem];
      if (existDayintoJournal!=undefined) {
        inicioOficial=existDayintoJournal["Entrada"];
        salidaOficial=existDayintoJournal["Salida"];
      }
    }

    var HorarioAsistence=FullHorario["Asistencias"];
    if(HorarioAsistence!=undefined){
      var getSancionandStatus=[];
      getSancionandStatus=GenerateReports_getEstatus(entro.toDate(),inicioOficial,HorarioAsistence);
      estatus = getSancionandStatus[0];
      sancion = getSancionandStatus[1];
    }
  }

  var result={
    "idEmployee" : _idEmpleado,
    "employeeName" :employeeName,
    "idEmp" : idEmp,
    "accessStatus" : "OK",
    "idCompany" : idCompany,
    "meal" : "-",
    "active" : true,
    "firstAccess" :entro.toDate(),
    "lastAccess":entro.toDate(),
    "createdDate" :moment(entro).format("DD/MM/YYYY")
  };

  var reports={
    "_idEmployee" : _idEmpleado,
    "idEmployee" :idEmp,
    "employeeName" : employeeName,
    "idDepartment" : idDepartment,
    "idDepartment_txt" : GetDeptoName(idDepartment),
    "idLocation" : idLocation,
    "idLocation_txt" : GetMyLocationName(idLocation),
    "idcompany" : idCompany,
    "idmanager" : idmanager,
    "idmanager_txt" : persons_list.idmanager_txt,
    "fecha" : moment(entro).format("DD/MM/YYYY"),
    "inicioOficial" : inicioOficial,
    "primerRegistro" : moment(entro).format("HH:mm"),
    "salidaOficial" : salidaOficial,
    "excepcion" : "Si",
    "estatus" : estatus,
    "fechaIni" : entro.toDate(),
    "sancion":sancion,
    "idpagadora":idpagadora,
    "idpagadora_txt":GetMyPagadoraName(idpagadora),
    "idDireccion":persons_list.idDireccion,
    "idDireccion_txt":persons_list.idDireccion_txt,
    "idProyecto":persons_list.idProyecto,
    "idProyecto_txt":persons_list.idProyecto_txt,
    "idArea":persons_list.idArea,
    "idArea_txt":persons_list.idArea_txt,
    "idEmpPosition":persons_list.idEmpPosition,
    "idEmpPosition_txt":persons_list.idEmpPosition_txt
  };

  
  Accesscontrol.direct.insert(result,function(err,res){
    if(err){
      logErrores.info("Error insertar en AccessControl "+err);
      return undefined;
    }
    if(res){
      result["_id"]=res;
      delete result.employeeName;
      delete result.idEmp;
      delete result.active;
      delete result.createdDate;
      delete result.lastAccess;
      result["idCompany"]=result["idCompany"][0];
      var meal=false;
      if(result["meal"]==true){
        meal=true;
      }
      result["meal"]=meal;
      insertaSync(result, "accesscontrol", 'insert');
      return res;
    }
  });
  
  var ConfigStationList=Config_station.findOne({});
  var idLocation="";
  if(ConfigStationList!=undefined){
    idLocation=ConfigStationList.idLocation;
  }
  if(idLocation){
    reports["idLocationChk"]=idLocation;
    reports["idLocationChk_txt"]=GetCheckLocationName(idLocation);
  }
  reports["idDevice"]=GetidDevice(MetodoAcceso);
  Reports.direct.insert(reports,function(err,res){
    if(err){
      logErrores.info("Error insertar en Reports "+err);
    }
    if(res){
      reports["_id"]=res;
      //insertaSync(reports, "reports", 'insert');
    }
  });
}
