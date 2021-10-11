if (Meteor.isServer) {
  const fs = require('fs');
  const Fibers = require('fibers');
  basepath = process.env.RAIZ;
  if (!basepath) {
      basepath = "/logs/";
  }
  
  Meteor.methods({
    DandoBaja(_id){      
      Meteor.users.remove({"profile.idEmployee":_id});
    },
    EsJefe(_id){
      var data=Jefes.findOne({idEmployee:_id},{fields:{_id:1}});
      if(data){
        return true;
      }else{
        return false;
      }
    },
    getEmpStatus(_id){
      var abc=Persons.findOne({"_id":_id},{fields:{idEmpStatus:1}});
      var result="gz76JMkmN6pjS6fqF";
      if(abc && abc.idEmpStatus){
        result=abc.idEmpStatus;
      }
      return result;
    },
    getLastEmployeeId(_id,userId){
      var result=undefined;
      var data=Locations.findOne({_id:_id},{fields:{sucesion:1}});
      if(data){
        var idEmployee=data.sucesion;
        var numero = parseInt(idEmployee);
        if (!isNaN(numero)) {
          var dataP=Persons.find({idLocation:_id},{fields:{idEmployee:1},sort:{idEmployee:1}}).fetch();
          if(dataP.length==0){
            result=numero;
          }else{
            var ultimo=dataP[dataP.length-1].idEmployee;
            result=ultimo+1;
          }
        }
      }
      return result;
    },
    getAviso:function(userId){
      var res = Meteor.users.findOne({ "_id": userId });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany = res.profile.idcompany;
        var dataC=Companies.findOne({_id:{$in:_idCompany}});
        if(dataC && dataC.aviso){
          return dataC.aviso;
        }
      }
    },
    DatosPersonaCargaMasiva:function(idEmployee,userId){
      var res = Meteor.users.findOne({ "_id": userId });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany = res.profile.idcompany;
        var data=Persons.findOne({
          $and:[
          {"idEmployee" :parseInt(idEmployee)},
          {"idEmpStatus" : "3eRz4SNtFFWbtmYBf"},
          {"cargaMasiva":true},
          {"idcompany":{$in:_idCompany}}
        ]});
        if(data==undefined){
          return undefined;
        }else{
          return data;
        }
      }else{
        return undefined;
      } 
    },
    EliminarCargaMasiva:function(userId){
      var res = Meteor.users.findOne({ "_id": userId });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany = res.profile.idcompany;
        var loca = CargaMasiva.find({"Company": {$in:_idCompany}}, { fields: { '_id': 1 } }).fetch();
        loca.forEach(element => {
          CargaMasiva.remove({_id:element._id});
        });
     }
    },
    guardarArchivo: function (Archivo,FileName, modulo,userId,Company) {
      try {
        var resultado = getData(modulo, userId, Company);
        if (resultado) {
          var bitmap = new Buffer(Archivo, 'base64');
          fs.writeFileSync(basepath + resultado.PathFileRead+FileName, bitmap);
        } else {
          throw new Meteor.Error('Error al subir el archivo', 'Error al subir el archivo');
        }
      } catch (error) {
        console.log("catch "+error);
        throw new Meteor.Error('Error al subir el archivo', 'Error al subir el archivo');
      }
    },
    ReadExcel:function(Tipo,userId,Company,permitirDuplicados){
      ReadExcel(Tipo,userId,Company,permitirDuplicados);
    },
    DadoBajaSinFecha:function(){
    // COLOCA FECHA DE BAJA SINO LA TIENEN LOS EMPLEADOS CON BAJA DEFINITIVA
    logReport.info("Iniciando el proceso DadoBajaSinFecha");
    var dataPersons=Persons.find({
      $and:[
        {"idEmpStatus" : "gz76JMkmN6pjS6fqF"},
        {"dismissalDate":{$exists:false}}
      ]
    }).fetch();
    logReport.info("Cant. de registros "+dataPersons.length);
    dataPersons.forEach(element => {
      var idEmployee=element._id;
      var ultimaRegistro=Accesscontrol.findOne({
        $and:[
          {"idEmployee":idEmployee}
        ]
      },{fields:{firstAccess:1},sort:{firstAccess:-1}});
      if(ultimaRegistro){
        logReport.info("Asignando fecha de baja para el empleado "+idEmployee+" su ultimo accessControl");
        var dismissalDate=ultimaRegistro.firstAccess;
        if(dismissalDate){
          var mhoy=moment();
          var multimo=moment(dismissalDate);
          var diasdiferencia=Math.abs(mhoy.diff(multimo,'days'));
          if(diasdiferencia>30){
            var obj={
              active:false,
              dismissalDate:dismissalDate
            };
            Persons.direct.update({"_id":idEmployee}, {$set:obj},function(err,res){
              if(err){
                logErrores.info("Err Update acbxs "+JSON.stringify(err));
              }
            });
          }          
        }
      }else{
        logReport.info("No existen registros de acceso del empleado "+idEmployee+" fecha de baja, fecha de creacion");
        var dismissalDate=element.createdAt;
        if(dismissalDate){
          var obj={
            active:false,
            dismissalDate:dismissalDate
          };
          Persons.direct.update({"_id":idEmployee}, {$set:obj},function(err,res){
            if(err){
              logErrores.info("Err Update acxs "+JSON.stringify(err));
            }
          });
        }
      }
    });
    logReport.info("Termino el proceso DadoBajaSinFecha");
    },
    TxtDepartmentsEmployeesPositions:function(){
      // PONE _TXT A LA COLECCION PERSONS EN LOS CAMPOS PUESTOS Y DEPARTAMENTOS
      logReport.info("Iniciando el proceso TxtDepartmentsEmployeesPositions");
      var dataPersons=Persons.find({},{fields:{idEmpPosition:1,idDepartment:1}}).fetch();
      logReport.info("Reg. personas "+dataPersons.length);
      dataPersons.forEach(element => {
        var idEmployee=element._id;
        var idEmpPosition=element.idEmpPosition;
        var idDepartment=element.idDepartment;
        var idEmpPosition_txt="";
        var idDepartment_txt="";
        if(idEmpPosition){
          var dataP=Employeespositions.findOne({_id:idEmpPosition},{fields:{empPosName:1}});
          if(dataP){
            idEmpPosition_txt=dataP.empPosName;
          }else{
            logReport.info("Error, el puesto no existe "+idEmpPosition+" para el empleado "+idEmployee);
          }          
        }
        if(idDepartment){
          var dataD=Departments.findOne({_id:idDepartment},{fields:{departmentName:1}});
          if(dataD){
            idDepartment_txt=dataD.departmentName;
          }else{
            logReport.info("Error, el departamento no existe "+idDepartment+" para el empleado "+idEmployee);
          }
        }

        var obj={
          idEmpPosition_txt:idEmpPosition_txt,
          idDepartment_txt:idDepartment_txt
        };
        Persons.direct.update({_id:idEmployee},{$set:obj},function(err,res){
          if(err){ logErrores.info("Err Update AsignarUsuario "+JSON.stringify(err)); }
        });
      });
      logReport.info("Termino el proceso TxtDepartmentsEmployeesPositions");
    },
    InactivoEmployeesPositions:function(){
      // ELIMINA O DA DE BAJA A LOS PUESTOS QUE NO ESTEN EN USO
      // LOS ELIMINA SINO EXISTE UN EMPLEADO ASOCIADO
      // LOS COLOCA COMO INACTIVO SI TODOS LOS EMPLEADOS ASOCIADOS ESTA DADOS DE BAJA
      logReport.info("Iniciando el proceso InactivoEmployeesPositions");
      
      var datapositions=Employeespositions.find({idcompany:{$exists:false}}).fetch();
      datapositions.forEach(element => {
        logReport.info("Eliminando el puesto "+element._id+" ("+element.empPosName+") no tiene compañia");
        Employeespositions.direct.remove({_id:element._id});
      });   
      
      var datapositions=Employeespositions.find({idcompany:{$exists:true}}).fetch();
      datapositions.forEach(element => {
        var idpuesto=element._id;
        var idcompany=element.idcompany;
        var empPosName=element.empPosName;
        var idcompanys=[];
        idcompanys.push(idcompany);

        logReport.info("Analizando puesto "+idpuesto+" ("+empPosName+")");
        var existP=Persons.find({idEmpPosition:idpuesto}).count();
        if(existP==0){
          logReport.info("No existen empleados asociados a este departamento, eliminando "+idpuesto)
          Employeespositions.direct.remove({_id:idpuesto});
        }else{
          var existPC=Persons.find({
            $and:[
              {idEmpPosition:idpuesto},
              {idcompany:{$in:idcompanys}}
            ]
            }).count();
            var existPCDef=Persons.find({
              $and:[
                {idEmpStatus:"gz76JMkmN6pjS6fqF"},
                {idEmpPosition:idpuesto},
                {idcompany:{$in:idcompanys}}
              ]
              }).count();
          logReport.info("Existen "+existPC+" empleados de "+idcompany+" asociados a este puesto, "+idpuesto+" de los cuales "+existPCDef+" estan dados de baja");
          if(existPCDef==existPC){
            logReport.info("Poniendo el puesto como inactivo "+idpuesto)
            Employeespositions.direct.update({_id:idpuesto},{$set:{active:false}},function(err,res){
              if(err){
                logErrores.info("Err Upsert "+JSON.stringify(err));
              }
            });
          }
        }
      });
      logReport.info("termino el proceso InactivoEmployeesPositions");
    },
    InactivoDepartments:function(){
      // ELIMINA O DA DE BAJA A LOS DEPARTAMENTOS QUE NO ESTEN EN USO
      // LOS ELIMINA SINO EXISTE UN EMPLEADO ASOCIADO
      // LOS COLOCA COMO INACTIVO SI TODOS LOS EMPLEADOS ASOCIADOS ESTA DADOS DE BAJA
      logReport.info("Iniciando el proceso InactivoDepartments");
      
      var dataDeptos=Departments.find({idcompany:{$exists:false}}).fetch();
      dataDeptos.forEach(element => {
        logReport.info("Eliminando el departamento "+element._id+" ("+element.departmentName+") no tiene compañia");
        Departments.direct.remove({_id:element._id});
      });   
      
      var dataDeptos=Departments.find({idcompany:{$exists:true}}).fetch();
      dataDeptos.forEach(element => {
        var iddepto=element._id;
        var idcompany=element.idcompany;
        var departmentName=element.departmentName;
        var idcompanys=[];
        idcompanys.push(idcompany);

        logReport.info("Analizando departamento "+iddepto+" ("+departmentName+")");
        var existP=Persons.find({idDepartment:iddepto}).count();
        if(existP==0){
          logReport.info("No existen empleados asociados a este departamento, eliminando "+iddepto)
          Departments.direct.remove({_id:iddepto});
        }else{
          var existPC=Persons.find({
            $and:[
              {idDepartment:iddepto},
              {idcompany:{$in:idcompanys}}
            ]
            }).count();
            var existPCDef=Persons.find({
              $and:[
                {idEmpStatus:"gz76JMkmN6pjS6fqF"},
                {idDepartment:iddepto},
                {idcompany:{$in:idcompanys}}
              ]
              }).count();
          logReport.info("Existen "+existPC+" empleados de "+idcompany+" asociados a este departamento, "+iddepto+" de los cuales "+existPCDef+" estan dados de baja");
          if(existPCDef==existPC){
            logReport.info("Poniendo el departamento como inactivo "+iddepto)
            Departments.direct.update({_id:iddepto},{$set:{active:false}},function(err,res){
              if(err){
                logErrores.info("Err Upsert "+JSON.stringify(err));
              }
            });
          }
        }
      });
      logReport.info("termino el proceso InactivoDepartments");
    },
    MigrarDepartamentos:function(){
      // GENERANDO EL DEPARTAMENTO APARTIR DE LOS DATOS ANTIGUOS
      logReport.info("Iniciando el proceso MigrarDepartamentos");
      var dataP=Persons.find({},{fields:{idDepartment:1,idcompany:1}}).fetch();
      logReport.info("Cant. de registros de empleados "+dataP.length);
      dataP.forEach(element => {
        var idEmployee=element._id;
        var idEmpDepto=element.idDepartment;
        var idcompany=element.idcompany[0];
        var asignaActualiza=false;
        var dataEmployeesdeptos=Departments.findOne({ "_id":idEmpDepto});
        if(dataEmployeesdeptos){
          var dataEmployeesdeptos_idcompany=dataEmployeesdeptos.idcompany;
          var dataEmployeesdeptos_empPosName=dataEmployeesdeptos.departmentName;
          if(dataEmployeesdeptos_idcompany){
            if(dataEmployeesdeptos_idcompany!=idcompany){
              asignaActualiza=true;
            }else{
              logReport.info("Registro Correcto "+idEmployee);
            }
          }else{
            asignaActualiza=true;
          }
          if(asignaActualiza==true){            
            var existe=Departments.findOne({
              $and:[
                {departmentName:{$regex:dataEmployeesdeptos_empPosName,$options: 'i'}},
                {idcompany :idcompany}
              ]
            },{fields:{_id:1}});
            if(existe){
              logReport.info("Actualizandole a "+idEmployee+" el depto  "+existe._id+" ("+dataEmployeesdeptos_empPosName+"), con registro anterior "+idEmpDepto);
              Persons.direct.update({_id:idEmployee},{$set:{idDepartment:existe._id}},function(err,res){
                if(err){ logErrores.info("Err Update AsignarUsuario "+JSON.stringify(err)); }
              });
            }else{
              var obj={
                "departmentName":dataEmployeesdeptos.departmentName,
                "departmentDesc":dataEmployeesdeptos.departmentDesc,
                "idLocation":dataEmployeesdeptos.idLocation,
                "idcompany" :idcompany,
                "active" : true,
                "idmanager" :dataEmployeesdeptos.idmanager,
                "createdAt" :dataEmployeesdeptos.createdAt,
                "createdBy" :dataEmployeesdeptos.createdBy,
                "updatedBy" :dataEmployeesdeptos.updatedBy,
                "updatedAt" :dataEmployeesdeptos.updatedAt                
              };              
              var InsertEmployeesdeptos=Departments.direct.insert(obj);
              logReport.info("Creando el departamento "+InsertEmployeesdeptos+"("+dataEmployeesdeptos.departmentName+"), para "+idcompany+" asignandolo a "+idEmployee);
              Persons.direct.update({_id:idEmployee},{$set:{idDepartment:InsertEmployeesdeptos}},function(err,res){
                if(err){
                  logErrores.info("Err Upsert "+JSON.stringify(err));
                }
              });
            }
          }else{
            logReport.info("Sin asignar ni actualizar "+idEmployee);
          }
        }else{
          logReport.info("Departamento "+idEmpDepto+" no existente");
        }
      });
      logReport.info("Termino el proceso MigrarDepartamentos");
    },
    MigrarPuestos:function(){
      // GENERANDO EL PUESTO APARTIR DE LOS DATOS ANTIGUOS
      logReport.info("Iniciando el proceso MigrarPuestos");
      var dataP=Persons.find({},{fields:{idEmpPosition:1,idcompany:1}}).fetch();
      logReport.info("Cant. de registros de empleados "+dataP.length);
      dataP.forEach(element => {
        var idEmployee=element._id;
        var idEmpPosition=element.idEmpPosition;
        var idcompany=element.idcompany[0];
        var asignaActualiza=false;
        var dataEmployeespositions=Employeespositions.findOne({ "_id":idEmpPosition});
        if(dataEmployeespositions){
          var dataEmployeespositions_idcompany=dataEmployeespositions.idcompany;
          var dataEmployeespositions_empPosName=dataEmployeespositions.empPosName;
          if(dataEmployeespositions_idcompany){
            if(dataEmployeespositions_idcompany!=idcompany){
              asignaActualiza=true;
            }else{
              logReport.info("Registro Correcto "+idEmployee);
            }
          }else{
            asignaActualiza=true;
          }
          if(asignaActualiza==true){            
            var existe=Employeespositions.findOne({
              $and:[
                {empPosName:{$regex:dataEmployeespositions_empPosName,$options: 'i'}},
                {idcompany :idcompany}
              ]
            },{fields:{_id:1}});
            if(existe){
              logReport.info("Actualizandole a "+idEmployee+" el puesto  "+existe._id+" ("+dataEmployeespositions_empPosName+"), con registro anterior "+idEmpPosition);
              Persons.direct.update({_id:idEmployee},{$set:{idEmpPosition:existe._id}},function(err,res){
                if(err){ logErrores.info("Err Update AsignarUsuario "+JSON.stringify(err)); }
              });
            }else{
              var obj={
                "active" : true,
                "createdAt" :dataEmployeespositions.createdAt,
                "createdBy" :dataEmployeespositions.createdBy,
                "updatedBy" :dataEmployeespositions.updatedBy,
                "updatedAt" :dataEmployeespositions.updatedAt,
                "empPosName":dataEmployeespositions.empPosName,
                "empPosDesc":dataEmployeespositions.empPosDesc,
                "idcompany" :idcompany
              };              
              var InsertEmployeespositions=Employeespositions.direct.insert(obj);
              logReport.info("Creando el puesto "+InsertEmployeespositions+"("+dataEmployeespositions.empPosName+"), para "+idcompany+" asignandolo a "+idEmployee);
              Persons.direct.update({_id:idEmployee},{$set:{idEmpPosition:InsertEmployeespositions}},function(err,res){
                if(err){
                  logErrores.info("Err Upsert "+JSON.stringify(err));
                }
              });
            }
          }else{
            logReport.info("Sin asignar ni actualizar "+idEmployee);
          }
        }else{
          logReport.info("Puesto "+idEmpPosition+" no existente");
        }
      });
      logReport.info("Termino el proceso MigrarPuestos");
    },
    AsignarUsuario:function(){
      // BUSCA A LOS EMPLEADOS QUE NO TENGAN ROL Y SE LES ASIGNA ROL= ["Usuario"]
      logReport.info("Iniciando el proceso AsignarUsuario");
      var dataP=Persons.find({roles:{$exists:false}},{fields:{_id:1}}).fetch();
      logReport.info("Cant. de registros de empleados sin rol "+dataP.length);
      dataP.forEach(element=>{
        var idEmployee=element._id;
        var obj={
          roles:[
            "Usuario"
          ]
        };
        Persons.direct.update({"_id":idEmployee}, {$set:obj},function(err,res){
          if(err){
            logErrores.info("Err Update AsignarUsuario "+JSON.stringify(err));
          }
        });
      });
      logReport.info("Termino el proceso AsignarUsuario");
    },
    AsignarBajaDefinitiva:function(){
      // ASIGNA BAJA DEFINITIVA A TODOS LOS 
      // EMPLEADOS CUYO ULTIMO REGISTRO SEA MAYOR A 45 DIAS COMPARADONDOLO CON LA FECHA ACTUAL
      logReport.info("Iniciando el proceso AsignarBajaDefinitiva");
      try {
        var dataP=Persons.find({idEmpStatus:{$ne:"gz76JMkmN6pjS6fqF"}},{fields:{_id:1}}).fetch();
        var mhoy=moment();
        dataP.forEach(element=>{
          var idEmployee=element._id;
          var ultimaRegistro=Accesscontrol.findOne({
            $and:[
              {"idEmployee":idEmployee}
            ]
          },{fields:{firstAccess:1},sort:{firstAccess:-1}});
          if(ultimaRegistro){
            var ultimo=ultimaRegistro.firstAccess;
            var multimo=moment(ultimo);
            var multimoF=moment(ultimo).format('DD-MM-YYYY');
            var diasdiferencia=Math.abs(mhoy.diff(multimo,'days'));
            if(diasdiferencia>45){
              logReport.info("El empleado "+idEmployee+" tiene de diferencia "+diasdiferencia+" entre "+multimoF+" y hoy, colocando BajaDefinitiva ");
              var dismissalDate=ultimo;
              var obj={
                idEmpStatus:"gz76JMkmN6pjS6fqF",
                active:false,
                dismissalDate:dismissalDate
              };
              Persons.direct.update({"_id":idEmployee}, {$set:obj},function(err,res){
                if(err){
                  logErrores.info("Err Update GeneraridLocationChk_txt "+JSON.stringify(err));
                }
              });   
            }
          }else{
            var dismissalDate=element.createdAt;
            var obj={
              idEmpStatus:"gz76JMkmN6pjS6fqF",
              active:false,
              dismissalDate:dismissalDate
            };
            logReport.info("El empleado "+idEmployee+" no tiene registros de acceso, colocando BajaDefinitiva");
            Persons.direct.update({"_id":idEmployee}, {$set:obj},function(err,res){
              if(err){
                logErrores.info("Err Update GeneraridLocationChk_txt "+JSON.stringify(err));
              }
            });
          }          
        });
        logReport.info("Registros encontrados "+dataP.length);
      }catch(error){

      }
      logReport.info("termino el proceso AsignarBajaDefinitiva");
    },
    EliminarFaltasDespuesBajaDefinitiva:function(Inicio) {
      //ELIMINA TODAS LAS FALTAS DESPUES DE LA FECHA DE BAJA DEFINITIVA
      var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
      if(InicioIsValid){
        var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
        logReport.info("Iniciando el proceso EliminarFaltasDespuesBajaDefinitiva");
        try {
          var dataP=Persons.find({
            dismissalDate:{$exists:true},
            updatedAt:{$gte:CicloInicio}
          },{fields:{_id:1,dismissalDate:1}}).fetch();
          logReport.info("Registros encontrados "+dataP.length);
          dataP.forEach(element => {
            var _idEmployee=element._id;
            var fecha=element.dismissalDate;        
            var dataR=Reports.find({
              $and:[
              {"_idEmployee":_idEmployee},
              {"estatus":"Falta"},
              {"fechaIni":{$gt:fecha}}
            ]},{fields:{_id:1}}).fetch();
            logReport.info("Eliminando "+dataR.length+" registros del empleado "+_idEmployee+" apartir de :"+fecha);
            dataR.forEach(elementR => {
              Reports.remove({"_id":elementR._id},(error)=>{
                if(error){
                  logErrores.error("Error en EliminarFaltasDespuesBajaDefinitiva, al eliminar el reporte "+elementR._id+" error "+error);
                }
              }); 
            });
          });
        } catch (error) {
          logErrores.error("Error al ejecutar EliminarFaltasDespuesBajaDefinitiva "+JSON.stringify(error));
        }   
      }else{
        logErrores.error("La fecha "+Inicio+" es invalida en EliminarFaltasDespuesBajaDefinitiva");
      }         
      logReport.info("Termino el proceso EliminarFaltasDespuesBajaDefinitiva");
    },
    SinReporteConAccessCtrl:function(Inicio,Fin) {
      // Busca que todos los accesscontrol tengan asociados un reporte sin falta
      var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
      var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
      if(InicioIsValid && FinIsValid){
        var FechaIsBefore=moment(Inicio).isBefore(Fin);
        var FechaIsSame=moment(Inicio).isSame(Fin);
        if(FechaIsBefore || FechaIsSame){
          logReport.info("Iniciando el proceso SinReporteConAccessCtrl");
          var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
          var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
          var dataAC=Accesscontrol.find({
            firstAccess:{"$gte" : CicloInicio,"$lte" :CicloFin}
          },{
              fields:{ idEmployee:1,createdDate:1 ,firstAccess:1}
            }).fetch();
          logReport.info("Cant. registros "+dataAC.length);
          dataAC.forEach(element => {
            var _idEmployee=element.idEmployee;
            var fecha=element.createdDate;
            var firstAccess=element.firstAccess;
            var Inicio=moment(firstAccess).format('YYYY-MM-DD');
            var existsReport=Reports.findOne({_idEmployee:_idEmployee,fecha:fecha},{fields:{estatus:1}});
            if(existsReport==undefined){
              logReport.info("Un accessControl sin reporte empleado "+_idEmployee+" fecha "+fecha);
              Meteor.call("SimulaReports",Inicio,Inicio,undefined,true,_idEmployee);
            }else{
              var estatus=existsReport.estatus;
              if(estatus=="Falta"){
                logReport.info("Un accessControl con falta empleado "+_idEmployee+" fecha "+fecha);
                Meteor.call("SimulaReports",Inicio,Inicio,undefined,true,_idEmployee);
              }
            }
          });          
          logReport.info("Terminando el proceso SinReporteConAccessCtrl");
        }
      }
    },
    GeneraridLocationChk_txt:function(Inicio,Fin) {
      var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
      var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
      if(InicioIsValid && FinIsValid){
        var FechaIsBefore=moment(Inicio).isBefore(Fin);
        var FechaIsSame=moment(Inicio).isSame(Fin);
        if(FechaIsBefore || FechaIsSame){
          logReport.info("Iniciando el proceso GeneraridLocationChk_txt");
          var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
          var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();

          var cnRep=Reports.find({
            $and:[
              {estatus:{$ne:"Falta"}},
              {idLocationChk_txt:{$exists:false}},
              {fechaIni:{"$gte" : CicloInicio,"$lte" :CicloFin}}
            ]},{
              fields:{ _idEmployee:1,fechaIni:1 }
            });
          logReport.info("Cantidad de registros en Reports "+cnRep.length);
          cnRep.forEach(element => {
            var _idRep=element._id;
            var _idEmployee=element._idEmployee;
            var fechaIni=element.fechaIni;
            var FIni = moment(fechaIni).hour(0).minutes(0).seconds(0).toDate();
            var FFin = moment(fechaIni).hour(23).minutes(0).seconds(0).toDate();
            var dataAccessDetails=Accessdetails.findOne({
              $and:[
                {idEmployee:_idEmployee},
                {createdAt:{"$gte" : FIni,"$lte" :FFin}}
              ]
            },{
              sort:{createdAt:1},
              fields:{idDevice:1,idLocation:1,idLocation_txt:1}
            });
            if(dataAccessDetails){
              var reports={};
              reports["idDevice"]=GetidDevice(dataAccessDetails.idDevice);
              reports["idLocationChk"]=dataAccessDetails.idLocation;
              reports["idLocationChk_txt"]=dataAccessDetails.idLocation_txt;
              Reports.direct.update({"_id":_idRep}, {$set:reports},function(err,res){
                if(err){
                  logErrores.info("Err Update GeneraridLocationChk_txt "+JSON.stringify(err));
                }
              });
            }else{
              logErrores.info("Err no existe ningun  Accessdetails de "+_idEmployee+" con fecha "+FIni);
            }
          });
          logReport.info("Terminando el proceso GeneraridLocationChk_txt");
        }
      }
    },
    GeneraridLocationMovilChk_txt:function(Inicio,Fin) {
      var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
      var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
      if(InicioIsValid && FinIsValid){
        var FechaIsBefore=moment(Inicio).isBefore(Fin);
        var FechaIsSame=moment(Inicio).isSame(Fin);
        if(FechaIsBefore || FechaIsSame){
          logReport.info("Iniciando el proceso GeneraridLocationChk_txt");
          var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
          var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();

          var cnAD=Accessdetails.find({
            $and:[
              {idDevice:"Mobile"},
              {createdAt:{"$gte" : CicloInicio,"$lte" :CicloFin}}
            ]},{
              fields:{
                idAccessCtrl:1,idEmployee:1,createdAt:1,idDevice:1,idLocation:1,idLocation_txt:1
              }
            });
          logReport.info("Cantidad de registros de AccessDetails "+cnAD.length);
          cnAD.forEach(element => {
            var idAccessCtrl=element.idAccessCtrl;
            var idEmployee=element.idEmployee;
            var createdAt=element.createdAt;
            var fecha=moment(createdAt).format("DD/MM/YYYY");
            var fechaEng = moment(createdAt).format("YYYY-MM-DD");
            
            var exRep=Reports.findOne({_idEmployee:idEmployee,fecha:fecha},{fields:{estatus:1,idDevice:1}});
            if(exRep){
              if(exRep.idDevice==undefined){
                var estatus=exRep.estatus;
              if(estatus=="Falta"){
                Meteor.call("SimulaReports",fechaEng,fechaEng,undefined,"",idEmployee,function(err,res){
                  if(err){
                    logReport.error("Err GeneraridLocationChk_txt estatus Falta "+JSON.stringify(err));
                  }
                });
              }
              var reports={};
              reports["idDevice"]=GetidDevice(element.idDevice);
              reports["idLocationChk"]=element.idLocation;
              reports["idLocationChk_txt"]=element.idLocation_txt;
              Reports.direct.update({"_id":exRep._id}, {$set:reports},function(err,res){
                if(err){
                  logErrores.info("Err Update GeneraridLocationChk_txt "+JSON.stringify(err));
                }
              });
              }
            }else{
              var exAC=Accesscontrol.findOne({_id:idAccessCtrl},{fields:{"_id":1}});
              if(exAC){
                logReport.error("No existe reporte de acceso del empleado ");
                Meteor.call("SimulaReports",fechaEng,fechaEng,undefined,"",idEmployee,function(err,res){
                  if(err){
                    logReport.error("Err GeneraridLocationChk_txt SimulaReports "+JSON.stringify(err));
                  }else{
                    var exRep=Reports.findOne({_idEmployee:idEmployee,fecha:fecha},{fields:{estatus:1}});
                    if(exRep){
                      var reports={};
                      reports["idDevice"]=GetidDevice(element.idDevice);
                      reports["idLocationChk"]=element.idLocation;
                      reports["idLocationChk_txt"]=element.idLocation_txt;
                      Reports.direct.update({"_id":exRep._id}, {$set:reports},function(err,res){
                        if(err){
                          logErrores.info("Err Update GeneraridLocationChk_txt "+JSON.stringify(err));
                        }
                      });
                    }                
                  }
                });
              }else{
                logReport.error("No existe reg de Accesscontrol "+idAccessCtrl+" empleado "+idEmployee+" fecha "+fecha);
              }              
            }
          });
          logReport.info("Terminando el proceso GeneraridLocationChk_txt");
        }
      }
    },
    GenerarHorarios:function() {
      logReport.info("Generando horarios");
      var dataP=Persons.find({},{fields:{"_id":1}}).fetch();
      dataP.forEach(element => {
        var _idEmployee=element._id;
        var resultado = {};
        var DataDays = Days.findOne({"idEmployee": _idEmployee});
        if (DataDays != undefined) {
          var idHorario = DataDays.idHorario;
          if (idHorario != undefined) {
            var DataHorarios = Horarios.findOne({"_id": idHorario});
            if (DataHorarios != undefined) {
              resultado["Horarios"] = {
                "lunes": DataHorarios.lunes,
                "martes": DataHorarios.martes,
                "miercoles": DataHorarios.miercoles,
                "jueves": DataHorarios.jueves,
                "viernes": DataHorarios.viernes,
                "sabado": DataHorarios.sabado,
                "domingo": DataHorarios.domingo
              };
              var retardo = DataHorarios.retardos;
              var comidas = DataHorarios.comidas;
              if (retardo != undefined) {
                var DataReglaRetardos = Reglas_retardos.findOne({"_id": retardo});
                if (DataReglaRetardos != undefined) {
                  var ArrayTolerancia = DataReglaRetardos.tolerancia;
                  var objAsistencias = {};
                  for (var i = 0; i < ArrayTolerancia.length; i++) {
                    var ObjSancion = ArrayTolerancia[i];
                    if (ObjSancion != undefined) {
                      var sancion = ObjSancion["sancion"];
                      var DataSanciones = Sanciones.findOne({"_id": sancion});
                      if (DataSanciones != undefined) {
                        var ArraySanciones = DataSanciones.descuento;
                        objAsistencias[ObjSancion["status"]]={
                          "tiempo":ObjSancion["tiempo"],
                          "sancion":ArraySanciones
                        }
                      }
                    }
                  }
                  resultado["Asistencias"] = objAsistencias;
                }
              }
              if (comidas != undefined) {
                var DataReglaAlimentos = Reglas_alimentos.findOne({"_id": comidas});
                if (DataReglaAlimentos != undefined) {
                  var tiempoAlimentos = DataReglaAlimentos.tiempo_consumo;
                  var ArrayAlimentos = DataReglaAlimentos.tolerancia;
                  var objAlimentos = {};
                  objAlimentos["tiempoAlimentos"]=tiempoAlimentos;
                  if(ArrayAlimentos!=undefined){
                    for (var i = 0; i < ArrayAlimentos.length; i++) {
                      var ObjSancion = ArrayAlimentos[i];
                      if (ObjSancion != undefined) {
                        var sancion = ObjSancion["sancion"];
                        var DataSanciones = Sanciones.findOne({"_id": sancion});
                        if (DataSanciones != undefined) {
                          var ArraySanciones = DataSanciones.descuento;
                          objAlimentos[ObjSancion["status"]]={
                            "tiempo":ObjSancion["tiempo"],
                            "sancion":ArraySanciones
                          }
                        }
                      }
                    }
                  }
                  resultado["Alimentos"] = objAlimentos;
                }
              }
            }
          }
          var ex=Horariox.findOne({"idEmployee":_idEmployee});
          if(ex==undefined){
            Horariox.direct.insert({"idEmployee":_idEmployee,"horario":resultado});
          }else{
            Horariox.direct.update({"idEmployee":_idEmployee}, {$set:{"horario":resultado}},function(err,res){
              if(err){
                logErrores.info("Err Update Horariox "+err);
              }
            });
          }          
        }
      });
      logReport.info("Termino generando horarios");
    },
    getRestaurantName(_id){
      var ab=Restaurants.findOne({"_id":_id},{fields:{"restaurantName":1}});
      if(ab!=undefined){
          return ab.restaurantName;
      }else{
          return "";
      }
    },    
    EvitarAccessCtrlDuplicadosPorEmpleado(Inicio,Fin){
      /**
       * Evita accessCtrl duplicados en el mismo dia por empleado
       * Debe enviarse en formato 2019-10-30
      */
      logReport.info("Iniciando la busqueda de accessCtrl duplicados "+Inicio+" : "+Fin);
      try {
      var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
      var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
      if(InicioIsValid && FinIsValid){
        var FechaIsBefore=moment(Inicio).isBefore(Fin);
        var FechaIsSame=moment(Inicio).isSame(Fin);
        if(FechaIsBefore || FechaIsSame){
          var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
          var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
          var daylist = getDaysArray(CicloInicio, CicloFin);
          daylist.map((v) => v.toISOString().slice(0, 10)).join("");
          daylist.forEach(fechaD => {
              var today = moment(fechaD).format("DD/MM/YYYY");
              var SR = moment(fechaD).format("YYYY-MM-DD");
              var PipelineRepetidos = [
                {
                  $match: {
                      $and: [
                      { "createdDate": today}
                    ]
                  }
                },
                { 
                  $project: {
                  "_id":"$_id",
                  "idEmployee":"$idEmployee"
                 }
                },
                {
                  $group:{
                    "_id": "$idEmployee", 
                    "count": { "$sum": 1 }
                  }
                },
                {
                  $match: {
                      $and: [
                      { "count": {$gte:2}}
                    ]
                  }
                }
              ];
              var ResultPipelineDoubleReports = Accesscontrol.aggregate(PipelineRepetidos);
              if(ResultPipelineDoubleReports.length!=0){
                logReport.info("Registros Duplicados "+JSON.stringify(ResultPipelineDoubleReports));
              }
              ResultPipelineDoubleReports.forEach(Reporte => {
                Meteor.setTimeout(function(){
                  var Empleado=Reporte._id;
                  var ReportesAEliminar= Accesscontrol.find({
                    "createdDate":today,
                    "idEmployee":Empleado
                  },{sort:{firstAccess:1,lastAccess:1}}).fetch();
                  
                  var primerAcceso=ReportesAEliminar[0].firstAccess;
                  var employeeName=ReportesAEliminar[0].employeeName;
                  var idEmp=ReportesAEliminar[0].idEmp;
                  var accessStatus=ReportesAEliminar[0].accessStatus;
                  var idCompany=ReportesAEliminar[0].idCompany;
                  var meal=ReportesAEliminar[0].meal;
                  var active=ReportesAEliminar[0].active;
                  var createdAt=ReportesAEliminar[0].createdAt;
                  var updatedAt=ReportesAEliminar[0].updatedAt;
                  var ultimoAcceso=primerAcceso;
                  
                  var lastAccess_first=ReportesAEliminar[ReportesAEliminar.length-1].firstAccess;
                  if(lastAccess_first){
                    if(moment(lastAccess_first).isAfter(moment(ultimoAcceso))==true){
                      ultimoAcceso=lastAccess_first;
                    }                    
                  }

                  var lastAccess_last=ReportesAEliminar[ReportesAEliminar.length-1].lastAccess;
                  if(lastAccess_last){
                    if(moment(lastAccess_last).isAfter(moment(ultimoAcceso))==true){
                      ultimoAcceso=lastAccess_last;
                    } 
                  }

                  var firstAccess_uno=ReportesAEliminar[0].lastAccess;
                  if(firstAccess_uno){
                    if(moment(firstAccess_uno).isAfter(moment(ultimoAcceso))==true){
                      ultimoAcceso=firstAccess_uno;
                    }                    
                  }
                  
                  var nuevo={
                    idEmployee:Empleado,
                    employeeName:employeeName,
                    idEmp:idEmp,
                    accessStatus:accessStatus,
                    idCompany:idCompany,
                    meal:meal,
                    active:active,
                    firstAccess:primerAcceso,
                    lastAccess:ultimoAcceso,
                    createdDate:today,
                    createdBy:"",
                    createdAt:createdAt,
                    updatedBy:"",
                    updatedAt:updatedAt
                  };

                  Accesscontrol.direct.insert(nuevo,function(errsx,res){
                    if(errsx){
                      logErrores.info("Error "+errsx+" al insertar "+JSON.stringify(nuevo)+" en upAccess");
                    }else{
                      logReport.info("Insertando un AccessCtrl");
                      ReportesAEliminar.forEach(ReporteAEliminar => {
                        logReport.info("Eliminando el accessCtrl Duplicado "+ReporteAEliminar._id)
                        Accesscontrol.remove({"_id":ReporteAEliminar._id},(error)=>{
                          if(error){
                            logErrores.info("Error al eliminar el accessCtrl "+ReporteAEliminar._id+" error "+error);
                          }else{
                            logReport.info("Actualizando registro..");
                            Accessdetails.update({idAccessCtrl: ReporteAEliminar._id}, {$set: {idAccessCtrl: res}}, {multi: true})
                          }
                        });                  
                      });
                      Meteor.call("SimulaReports",SR,SR,undefined,"Todos",Empleado);  
                    }
                  });    
                },1000);
              });              
          });             
        }
      }      
    } catch (error) {
      logErrores.info("En EvitarAccessCtrlDuplicadosPorEmpleado "+error);
    }
      logReport.info("Termino la busqueda de accessCtrl duplicados");
    },
    EvitarReportesDuplicadosPorEmpleado(Inicio,Fin){
      /**
       * Evita reportes duplicados en el mismo dia por empleado
       * Debe enviarse en formato 2019-10-30
       */
      logReport.info("Iniciando la busqueda de reportes duplicados "+Inicio+" : "+Fin);
      var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
      var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
      if(InicioIsValid && FinIsValid){
        var FechaIsBefore=moment(Inicio).isBefore(Fin);
        var FechaIsSame=moment(Inicio).isSame(Fin);
        if(FechaIsBefore || FechaIsSame){
          var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
          var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
          var daylist = getDaysArray(CicloInicio, CicloFin);
          daylist.map((v) => v.toISOString().slice(0, 10)).join("");
          daylist.forEach(fechaD => {
              var today = moment(fechaD).format("DD/MM/YYYY");
              var SR = moment(fechaD).format("YYYY-MM-DD");
              var PipelineRepetidos = [
                {
                  $match: {
                      $and: [
                      { "fecha": today}
                    ]
                  }
                },
                { 
                  $project: {
                  "_id":"$_id",
                  "_idEmployee":"$_idEmployee"
                 }
                },
                {
                  $group:{
                    "_id": "$_idEmployee", 
                    "count": { "$sum": 1 }
                  }
                },
                {
                  $match: {
                      $and: [
                      { "count": {$gte:2}}
                    ]
                  }
                }
              ];
              var ResultPipelineDoubleReports = Reports.aggregate(PipelineRepetidos);
              if(ResultPipelineDoubleReports.length!=0){
                logReport.info("Registros Duplicados "+JSON.stringify(ResultPipelineDoubleReports));
              }
              ResultPipelineDoubleReports.forEach(Reporte => {                
                // Meteor.setTimeout(function(){
                  var Empleado=Reporte._id;
                  var ReportesAEliminar= Reports.find({"fecha":today,"_idEmployee":Empleado},{fields:{"_id":1}}).fetch();
                  logReport.info("Buscando los registros con fecha "+today+" _idEmployee "+Empleado+" encontrados "+ReportesAEliminar.length);
                  ReportesAEliminar.forEach(ReporteAEliminar => {
                    logReport.info("Eliminando el reporte "+ReporteAEliminar._id)
                    Reports.remove({"_id":ReporteAEliminar._id},(error)=>{
                      if(error){
                        logErrores.info("Error al eliminar el reporte "+ReporteAEliminar._id+" error "+error);
                      }else{
                        Meteor.call("SimulaReports",SR,SR,undefined,"Todos",Empleado,function(err,res){
                          if(err){
                            
                          }
                        });  
                      }
                    });                  
                  });
                // }, 1500);
              });
          });             
        }
      }
      logReport.info("Termino la busqueda de reportes duplicados");
    },
    CleanSyncFromTotems:function(){
      if (orion.config.get('url') && orion.config.get('puerto')) {
        var remote = DDP.connect(orion.config.get('url')+':' + orion.config.get('puerto'));
        if (remote) {
          SyncRem = new Mongo.Collection('sync', remote);
          remote.subscribe('sync', function() {
            var CollectionsTotems=SyncRem.find({
              "collection":{$in:[
                "persons",
                "meal_times",
                "Meteor.users",
                "reports",
                "deviceslog",
                "tickets",
                "horarios",
                "days",
                "devices"
              ]}
            }).fetch();
            CollectionsTotems.forEach(element => {
              SyncRem.remove({"_id":element._id});
            });
          });
        }
      }else{
        logErrores.info("Err CleanSyncFromTotems orionConfig undefined");
      }      
    },
    LimpiarNotificaciones:function(Inicio,Fin){
      logReport.info("Iniciando la limpíeza de notificaciones "+Inicio+" : "+Fin);
      var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
      var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
      if(InicioIsValid && FinIsValid){
        var FechaIsBefore=moment(Inicio).isBefore(Fin);
        var FechaIsSame=moment(Inicio).isSame(Fin);
        if(FechaIsBefore || FechaIsSame){
          var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
          var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
          Notificaciones.remove({
            createdAt:{
              $gt:CicloInicio,
              $lt:CicloFin
            }});
        }
      }

    },
    LimpiarVerificacion:function(){
        Access_temp.remove({});
    		if (Temp_messages.findOne({},{fields:{"_id":1}})!=undefined) {
    				var dataTemp=Temp_messages.findOne({},{fields:{"_id":1}})
    				Temp_messages.update({"_id":dataTemp._id}, {$unset:{ "status_verification": "" }});
    		}
    },
    insertaImagen:function(obj){
      if (obj.url) {
        var url = obj.url.split('/');
        url = url[(url.length) - 1];
        var dataFiles = orionFileCollection.findOne({ _id: new Mongo.ObjectID(url) });
        insertaSync(dataFiles, 'data.files', 'insert');
        var dataChunks = data_chunks.find({ files_id: new Mongo.ObjectID(url) }).fetch();
        dataChunks.forEach(elem => {
          insertaSync(elem,'data.chunks','insert');
        }); 
      }else{
        if(obj["_id"]!=undefined && obj["_id"]["_str"]!=undefined){
          var url=obj["_id"]["_str"];
          if(url){
            var Done = false;
            var Retries = 0, MaxRetries = 10;
            Meteor.setTimeout(function() {
              while (Done == false && Retries < MaxRetries) {
                try {
                  var dataFiles = orionFileCollection.findOne({ _id: new Mongo.ObjectID(url) });
                  var dataChunks = data_chunks.find({ "files_id": new Mongo.ObjectID(url) }).fetch();
                  if(dataChunks.length!=0){
                    insertaSync(dataFiles, 'data.files', 'insert');
                    dataChunks.forEach(elem => {
                      insertaSync(elem,'data.chunks','insert');
                    }); 
                    Done = true;
                  }else{
                    Meteor.setTimeout(function() {
                      ++Retries;
                    }, 1500);
                  }
                } catch (error) {
                  ++Retries;
                  console.log("error "+error);
                  Meteor.setTimeout(function() {}, 1000);
                }
              } 
            }, 1000);               
          } 
        }           
      }
    },
    RebuildTemplates:function(){
      try{          
          var fingerTemplates=orionFileCollection.find({filename:"SupremaTemplate"}).fetch();
          var callRebuild=false;
          fingerTemplates.forEach(fingerMuestra=>{
            var PersonId=fingerMuestra.PersonId;
            var _id=fingerMuestra._id;
            var eliminando=false;            
            if(PersonId){
              var dataPersons=Persons.findOne({_id:PersonId},{fields:{idEmpStatus:1}});
              if(dataPersons){
                if(dataPersons.idEmpStatus && dataPersons.idEmpStatus=="gz76JMkmN6pjS6fqF"){
                  logBio.info("Eliminando al empleado, por bajaDef "+PersonId);
                  eliminando=true;
                }
              }else{                
                logBio.info("Eliminando al empleado, no encontrado "+PersonId);
                eliminando=true;
              }
              if(eliminando==false){
                var lastAccess=Accesscontrol.findOne({idEmployee:PersonId},{sort: {createdAt:-1}});
                if(lastAccess){
                  var MomentAhora=moment();
                  var MomentUltimoReg=moment(lastAccess.createdAt);
                  var minn=MomentAhora.diff(MomentUltimoReg,'days');
                  if(minn>=30){
                    eliminando=true;
                    logBio.info("Eliminar la muestra "+PersonId+" con diferencia "+minn);  
                  }
                }else{
                  eliminando=true;
                  logBio.info("Eliminar la muestra sin registro "+PersonId);  
                }
              }              
            }else{
              eliminando=true;
              logBio.info("Eliminar la muestra sin empleado "+fingerMuestra._id);
            }

            if(eliminando){
              logBio.info("Eliminando la muestra "+_id+" del empleado "+PersonId);
              try {
                orionFileCollection.remove({"_id":fingerMuestra._id});
                callRebuild=true;
              } catch (error) { }
            }
          });

          if(callRebuild){
            Meteor.call('ToWSDeviceManager',"RebuildTemplates",undefined,undefined,undefined,undefined,undefined,function(err,res){
              if(err){
                logErrores.info("Error "+err+" en RebuildTemplates ToWSDeviceManager");
              }
            });
          }
        }catch(errs){
          logErrores.info("Error "+err+" en RebuildTemplates ");
        }
    },
    FindImgToWS:function(){
      try {
        var rutas=[
          "/images/aprocesar/faces/",
          "/images/aprocesar/fingers/"
        ];
        rutas.forEach(route=>{
          fs.readdir(route, (err, files) => {
            if(err){
              logErrores.info("Err al buscar "+route+" error :"+err);
            }
            if(files){
              files.forEach(file => {
                var cadenas=file.split(".");
                var ext=cadenas[cadenas.length-1].toLowerCase();
                var ruta=route+file;
                if(ext=="jpg" || ext=="wsq" || ext=="png" || ext=="jpeg"){
                  var stats = fs.statSync(ruta);
                  var fileSizeInBytes = stats["size"];
                  if(fileSizeInBytes>10){
                    var sub=file.split("_");
                    if(sub.length>1){
                      var empleado=sub[0];
                      var fiber = Fibers.current;
                      Fibers(function () {
                        var existsP=Persons.findOne({_id:empleado},{fields:{"_id":1}});
                        if(existsP!=undefined){
                          logReport.info("Enviando una muestra para enrolar desde el sincronizador");
                          var bitmap = fs.readFileSync(ruta);
                          var MyFile=new Buffer(bitmap).toString('base64');
                          var Action=route.includes("faces")?"EnrollFace":"EnrollFinger";
                          var ImproveImage=undefined;
                          var VerifySamples=undefined;
                          var SaveIntoServRest="yes";
                          var AvoidDuplicates="yes";
                          var IdBiometricPerson=empleado;
                          var Extra=undefined;
                          Meteor.call("ToWSFaceValidator", MyFile,Action,ImproveImage,VerifySamples,SaveIntoServRest,AvoidDuplicates,IdBiometricPerson,Extra, function(error, result){
                            if(error){
                              logErrores.info("Error al llamar ToWSFaceValidator "+error);
                            }
                            if(result){
                               fs.unlink(ruta, (err) => {
                                 if (err){
                                   logErrores.info("No fue posible eliminar el archivo en "+ruta+" error :"+err);
                                 }
                               });
                               logReport.info("El archivo "+ruta+" se ha enviado al WS para su validacion con registro "+result);
                            }else{
                              logReport.info("No fue posible enviar la muestra, posible error 'Sin conexion con el WS' ");
                            }
                          });
                        }else {
                          fs.unlink(ruta, (err) => {
                            if (err){
                              logErrores.info("No fue posible eliminar el archivo en "+ruta+" error :"+err);
                            }
                          });
                          logReport.info("El archivo "+ruta+" no pertenece a ningun empleado ("+empleado+") eliminando");
                        }
                      }).run();
                    }else{
                      fs.unlink(ruta, (err) => {
                        if (err){
                          logErrores.info("No fue posible eliminar el archivo en "+ruta+" error :"+err);
                        }
                      });
                      logReport.info("El archivo "+ruta+" no tiene la nomenclatura correcta, eliminando");
                    }
                  }else{
                    fs.unlink(ruta, (err) => {
                      if (err){
                        logErrores.info("No fue posible eliminar el archivo en "+ruta+" error :"+err);
                      }
                    });
                    logReport.info("El archivo "+ruta+" esta vacio, eliminando");
                  }
                }else{
                  fs.unlink(ruta, (err) => {
                    if (err){
                      logErrores.info("No fue posible eliminar el archivo en "+ruta+" error :"+err);
                    }
                  });
                  logReport.info("El archivo "+ruta+" no cumple la ext requerida, eliminando");
                }
              });
            }
          });
        });
      } catch (err) {
        logErrores.info("Err en FindImgToWS "+err);
      }
    },
    RelationFingerWithEmployee: function(IdBiometricPerson,PersonIdSample,Extra) {
      var obj={};
      obj[Extra+"_left_template"]=PersonIdSample;
      obj["FingerTemplate"]=true;

      if(Persons.findOne({_id:IdBiometricPerson},{fields:{"_id":1}})!=undefined){
        Persons.update({_id:IdBiometricPerson}, {$set:obj},function(err,res){
          if(err){
            logErrores.info("Error en RelationFingerWithPerson "+err);
          }});
      }

      if(Employees.findOne({_id:IdBiometricPerson},{fields:{"_id":1}})!=undefined){
        Employees.update({_id:IdBiometricPerson}, {$set:obj},function(err,res){
          if(err){
            logErrores.info("Error en RelationFingerWithEmployee "+err);
          }});
      }
    },
    RelationImageWithEmployee: function(blob, filename, encoding,Employee) {
      var path="/logs/";
      var FileRute=path+filename;
       fs.writeFile(FileRute, blob, encoding, Meteor.bindEnvironment(function(err){
          if(!err) {
            orionFileCollection.importFile(FileRute, {
              filename: filename,
              contentType: 'image/jpeg'
            }, function (err, file) {
              fs.unlink(FileRute, (err) => {});
              if (!err){
                var idins=file._id.toString();
                Persons.direct.update({_id:Employee}, {$set:{"face":{
                  "fileId":idins,
                  "url": "/gridfs/data/id/"+idins
                }}});
                var UPFace={
                  "_id":Employee,
                  "face":{
                    "fileId":idins,
                    "url": "/gridfs/data/id/"+idins
                  },
                }
                insertaSync(UPFace, "persons", 'update');
              }
            });
          }
      }));
    },
    exportAllData: function(selector, collectionName, columns) {
      var data = [],fields = [];
      columns=getColumnsFromCollection(collectionName,columns);
      for (var j = 0; j < columns.length; j++) {
        if (columns[j].visible == undefined || (columns[j].visible != undefined && (columns[j].visible != false))) {
          fields.push(columns[j].title);
        }
      }
      var collectionItems = Mongo.Collection.get(collectionName.toLowerCase()).find(selector).fetch();
      _.forEach(collectionItems, function(item) {
        if (item) {
          var row = [];
          for (i = 0; i < columns.length; i++) {
            if (columns[i].visible == undefined || (columns[i].visible != undefined && (columns[i].visible != false))) {
              if (columns[i].Render == 'collection') {
                var tipo=columns[i].tipo;
                var busqueda={},fields={};
                fields[columns[i].GetField]=1;
                if(tipo=="Array"){
                    busqueda[columns[i].Query]={"$in":item[columns[i].data]};
                }else{
                    busqueda[columns[i].Query]=item[columns[i].data];
                }
                var dato=Mongo.Collection.get(columns[i].CollectionRender).findOne(busqueda,{"fields":fields});
                if(dato!=undefined){
                  row.push(dato[columns[i].GetField]);
                }else{
                  row.push("");
                }
              } else if (columns[i].Render == 'function') {
                var functionName=columns[i].FunctionRender;
                var dato=item[columns[i].data];
                let func = new Function('return ' + functionName)();
                var dato=func(dato);
                dato=dato.replace(/\n/g, ', ');
                row.push(dato);
              } else {
                var titulo=columns[i].title;
                var field=columns[i].data;
                var tipo=columns[i].tipo;
                var valor="";
                if(tipo=="Date"){
                  var isValid=moment(item[columns[i].data]).isValid();
                  if(isValid){
                    valor=moment(item[columns[i].data]).format("DD/MM/YYYY HH:mm:ss");
                  }else{
                    valor="--";
                  }
                }else if(tipo=="Object"){
                }else{
                  valor=item[columns[i].data];
                }
                row.push(valor);
              }
            }
          }
          data.push(row);
        }
      });
      return {
        fields: fields,
        data: data
      };
    },
    buscaMuchasFaltas:function(Inicio,Fin,Numero,Company){
      var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
      var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
      if(InicioIsValid && FinIsValid){
        var FechaIsBefore=moment(Inicio).isBefore(Fin);
        var FechaIsSame=moment(Inicio).isSame(Fin);
        if(FechaIsBefore || FechaIsSame){
          logReport.info("Buscando muchas faltas ");
          console.log("Buscando muchas faltas ");
          var employeestatuses = Employeestatuses.findOne({ "empStatusName": "BAJADEF" });
          var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
          var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
          if (employeestatuses != undefined) {
            var busqueda={"idEmpStatus": { "$ne": employeestatuses._id }};
            if(Company!=undefined){
              var abc=[];
              abc.push(Company);
              busqueda["idcompany"]={"$in":abc};
            }
            var DataPersons = Persons.find(busqueda,{fields:{_id:1,employeeName:1,idcompany:1}}).fetch();
            DataPersons.forEach(elem => {
              var _idPerson=elem._id;
              var employeeName=elem.employeeName;
              var company=elem.idcompany;
              var cn=Reports.find({
                $and:[
                  {"estatus":"Falta"},
                  {"_idEmployee":_idPerson},
                  {"fechaIni":{"$gte" : CicloInicio,"$lt" :CicloFin}}
                ]}).count();
                if(cn>=Numero){
                  var CicloInicioES = moment(CicloInicio).format('DD/MM/YYYY');
                  var CicloFinES =  moment(CicloFin).format('DD/MM/YYYY');
                  WriteNotificaciones(employeeName,"MANYFALTAS","ADMIN",company,_idPerson,cn+" faltas del "+CicloInicioES+"-"+CicloFinES);
                }
            });
          }
          console.log("Termino la busqueda de muchas faltas ");
        }else{
          console.log("Fechas invalidas Buscando faltas ");
        }
      }else {
        console.log("Fechas invalidas Buscando faltas ");
      }
    },
    eliminarhorarios:function(){
      var Data=Days.find({},{fields:{idHorario:1}});
      Data.forEach(elem => {
        var _id=elem.idHorario;
        var ex=Horarios.findOne({_id:_id});
        if (ex==undefined) {
          Days.remove({idHorario:_id});
        }
      });
    },
    UpUser:function(idEmployee,roles,idUser){
      var up={
        "roles":roles
      };
      var DataUs = Meteor.users.find({"profile.idEmployee": idEmployee}).fetch();
      for (let index = 0; index < DataUs.length; index++) {
        var element = DataUs[index]._id;
        console.log("element "+element);
        if(element!=idUser){
          Meteor.users.update({"_id":element},{$set:up});
        }
      }
    },
    CleanFeriadosReports:function(){
      var DataFeriados=Feriados.find({},{fields:{"fecha_txt":1,"idcompany":1}}).fetch();
      for (let i = 0; i < DataFeriados.length; i++) {
        var company=DataFeriados[i].idcompany;
        if(company!=undefined){
          var fecha=DataFeriados[i].fecha_txt;
          logReport.info("Eliminando las faltas de los dias feriados "+fecha+ " compañia "+company);
          Reports.remove({"fecha":fecha,"estatus":"Falta","idcompany":{$in:company}});
        }
      }
    },
    CleanAccessTemp: function() {
      Access_temp.remove({});
    },
    isStation: function() {
      var isStation=Config_application.findOne({"active":true});
      var esServidor=false;
      if(isStation!=undefined){
        if (isStation.AccessWithFace==true) {
          esServidor=false;
        }
        else{esServidor=true;}
      }
      return esServidor;
    },
    temp_origin2: function () {
      var result=true;
      var objeto = Enrollments_uptemp.findOne();
      if (objeto != undefined) {
        var copy = {};
        var tmpl = {};
        var _idEmployee = objeto._idEmployee;
        var createdBy = objeto.createdBy;
        var createdAt = objeto.createdAt;

        var DataPersons=Persons.findOne({"_id":_idEmployee});
        for (var data in objeto) {
          if (data.includes("_left_normal") || data.includes("_left_binaria")) {
            if (objeto.hasOwnProperty(data)) {
              var obj = {};
              obj.fileId = objeto[data];
              obj.url = "/gridfs/data/id/" + objeto[data];
              copy[data] = obj;
            }
          } else if (data.includes("_left_template")) {
            if (objeto.hasOwnProperty(data)) {
              copy[data] = objeto[data];
            }
          }
        }
        var EnrollmentsC=Enrollments.find().count();

        var idEnroll=Enrollments.insert({
          "PERSON":_idEmployee,
          "employeeName":DataPersons.employeeName,
          "idcompany":DataPersons.idcompany,
          "IDENROLTYPE":"Fisico",
          "IDENROLSTATE":"Completo",
          "ENROLDATE":createdAt,
          "CREATEDBY":createdBy,
          "CREATEDON":createdAt,
          "UPDATEDBY":createdBy,
          "UPDATEDON":createdAt,
          "IDENROLLMENTMODE":"Fisico",
          "IDENROLSEQUENCE":EnrollmentsC+1,
          "enrolinfo" : {
            "status" : "OK",
            "quality" : "EXCELLENT"
          }
        });
        copy["idEnrol"]=idEnroll;
        logBio.info("Actualizando "+_idEmployee+" objeto "+JSON.stringify(copy));
        Persons.update({ _id: _idEmployee },{$set: copy});
      }
      return result;
    },
    temp_origin: function() {
      var objeto = Enrollments_temp.findOne();
      if (objeto != undefined) {
        logBio.info("Se ha enrolado al empleado "+JSON.stringify(objeto));
        var copy = {};
        var tmpl={};
        var _idEmployee = objeto.empleado;
        var _idDocs = objeto.docs;
        var _idEnrol = objeto.idEnrol;
        var Enroll_CreatedBy = objeto.createdBy;
        var obj_firma = { "sign": objeto.sign }

        var dataEmployees = Employees.find({_id: _idEmployee}).fetch();
        logBio.info(JSON.stringify(dataEmployees));

        var dataDocs = Documents_temp.find({ _id: _idDocs }).fetch();
        var obj_docs = dataDocs[0];

        if(objeto.face_url!=undefined){
          var fileId=objeto.face_url.split("/");
          fileId=fileId[fileId.length-1];
          var face = {
            "face": {
              "fileId ": fileId,
              "url": objeto.face_url
            }
          };
        }
        var idEnrolObj = {
          idEnrol: _idEnrol
        };

        for (var data in objeto) {
          if(data.includes("_left_normal")||data.includes("_left_binaria")){
            if (objeto.hasOwnProperty(data)) {
              var obj={};
              obj.fileId=objeto[data];
              obj.url= "/gridfs/data/id/" +objeto[data];
              copy[data]=obj;
            }
          }else if(data.includes("_left_template")){
            if (objeto.hasOwnProperty(data)) {
              tmpl[data]=objeto[data];
            }
          }
        }
          var obj_final = Object.assign(dataEmployees[0],idEnrolObj,copy,tmpl,  face, obj_firma, obj_docs);
          obj_final["_id"]=_idEmployee;

          logBio.info(JSON.stringify(obj_final));

          if(obj_final.idmanager!=undefined){
            var buse={};
            buse["employeeName"]=obj_final.idmanager;
            buse["idcompany"]={ $in:obj_final.idcompany};

            var exis=Jefes.findOne(buse);
            if(exis!=undefined){
              obj_final.idmanager=exis._id;
            }
          }

          if(obj_final.idEmpPosition!=undefined){
            var busp={};
            busp["empPosName"]=obj_final.idEmpPosition;
            busp["idcompany"]={ $in:obj_final.idcompany};
            var exis=Employeespositions.findOne(busp);
            if(exis!=undefined){
              obj_final.idEmpPosition=exis._id;
            }
          }
          obj_final["FaceTemplate"]=true;

          var idDoc = Persons.insert(obj_final,function(err,res){
            if(err){
              console.log("err "+err);
            }
          });

          if(Enrollments.findOne({ "PERSON": _idEmployee })==undefined){
            var sequence=Enrollments.findOne({
              idcompany:{ $in:obj_final.idcompany }
            },{sort:{"IDENROLSEQUENCE":-1},fields:{"_id":1,"IDENROLSEQUENCE":1}});
            var number=1;
            if(sequence!=undefined && sequence.IDENROLSEQUENCE!=undefined){
              number =parseInt(sequence.IDENROLSEQUENCE)+1;
            }
            var idLocation="";
            if(Config_station.findOne({"idLocation":{$exists:true}})!=undefined){
              idLocation= Config_station.findOne({"idLocation":{$exists:true}});
            }
            var objN={
              "PERSON":_idEmployee,
              "employeeName" : dataEmployees[0].employeeName,
              "idcompany": dataEmployees[0].idcompany,
              "IDENROLTYPE" : "Fisico",
              "IDENROLSTATE" : "Completo",
              "ENROLDATE" : new Date(),
              "CREATEDBY" :Enroll_CreatedBy,
              "CREATEDBY_TX" :getNameUserAccount(Enroll_CreatedBy),
              "CREATEDON" : new Date(),
              "UPDATEDBY" : Enroll_CreatedBy,
              "UPDATEDON" : new Date(),
              "IDENROLLMENTMODE" : "Offline",
              "IDENROLSEQUENCE" : parseInt(number),
              "STATIONENROL_TXT":GetMyLocationName(idLocation)
            }
            Enrollments.insert(objN);
            result=true;
          }else{
            var _idEnrollment = Enrollments.findOne({ "PERSON": _idEmployee })._id;
            var countsEnrollments = Enrollments.find().count();
            Enrollments.update({ _id: _idEnrollment },
              {
                $set: {
                  PERSON: "idDoc",
                  "CREATEDBY_TX" :getNameUserAccount(Enroll_CreatedBy.toString()),
                  "CREATEDBY": Enroll_CreatedBy.toString(),
                  IDENROLSEQUENCE: countsEnrollments
                }
              });
              result=true;
          }
        }
        else {
          result = true;
        }
        return result;
      },
      eliminar_enroll_temp: function() {
        Enrollments_temp.remove({});
      },
      load_locations: function() {
        var loca = Locations.find({"active": true}, {
          fields: {
            '_id': 1,
            'locationName': 1
          }
        }).fetch();
        return loca;
      },
      load_Mylocations: function(userId) {
        var loca;
        if (Roles.userHasRole(userId, "admin") == true) {
          loca = Locations.find({}, {
            fields: {
              '_id': 1,
              'locationName': 1
            }
          }).fetch();
        }else if(Roles.userHasRole(userId, "Usuario Administrador") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                loca = Locations.find({"idcompany": {$in:_idCompany}}, {
                  fields: {
                    '_id': 1,
                    'locationName': 1
                  }
                }).fetch();
            }
        }else if(Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                loca = Locations.find({"idcompany": {$in:_idCompany},"active":true}, {
                  fields: {
                    '_id': 1,
                    'locationName': 1
                  }
                }).fetch();
            }
        }else if( Roles.userHasRole(userId, "Usuario")==true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
                var _idCompany = res.profile.idcompany;
                var _idEmployee = res.profile.idEmployee;
                loca = Locations.find({"idcompany": {$in:_idCompany},"active":true}, {
                  fields: {
                    '_id': 1,
                    'locationName': 1
                  }
                }).fetch();
            }
        }
        return loca;
      },
      load_devicesconnected: function() {
        var loca = Devicesconnected.find({}, {fields: {'_id': 1,'name': 1}}).fetch();
        return loca;
      },
      load_restaurant: function(idcompany) {
        var loca = Restaurants.find({
          "active": true,
          "idcompany":{$in:idcompany}
        }, {
          fields: {
            '_id': 1,
            'restaurantName': 1
          }
        }).fetch();
        return loca;
      },
      load_companies: function(userId) {
        var res = Meteor.users.findOne({ "_id":userId});
        if (res && res.profile && res.profile.idcompany) {
          var _idCompany=[];
          _idCompany = res.profile.idcompany;
          return Companies.find({
            $and:[
              {"_id": {$in: _idCompany}},
              {"active":true}
            ]
           },
           { fields: { companyName:1},sort:{companyName:1}}).fetch();
        }
      },
      load_departments: function(userId) {
        var loca;
        if (Roles.userHasRole(userId, "admin") == true) {
          loca = Departments.find({}, {
            fields: {
              '_id': 1,
              'departmentName': 1
            }
          }).fetch();
        }else if(Roles.userHasRole(userId, "Usuario Administrador") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                loca = Departments.find({"idcompany": _idCompany[0]}, {
                  fields: {
                    '_id': 1,
                    'departmentName': 1
                  }
                }).fetch();
            }
        }else if(Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                loca = Departments.find({"idcompany": _idCompany[0],"active":true}, {
                  fields: {
                    '_id': 1,
                    'departmentName': 1
                  }
                }).fetch();
            }
        }else if( Roles.userHasRole(userId, "Usuario")==true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
                var _idCompany = res.profile.idcompany;
                var _idEmployee = res.profile.idEmployee;
                loca = Departments.find({"idcompany": _idCompany[0],"active":true}, {
                  fields: {
                    '_id': 1,
                    'departmentName': 1
                  }
                }).fetch();
            }
        }
        return loca;
      },
      eliminar_biom_resagada:function(){
        var data = Enrollments_temp.findOne();
        if (data != undefined) {
          var _idEmployee = data.empleado;
          if(_idEmployee){
            logBio.warn("Eliminando biometria resagada "+_idEmployee);
            Meteor.call("ToWSDeleteBiometricValidator",_idEmployee);
          }
        }
      },
      delete_temps: function() {
        Enrollments_temp.remove({});
        Documents_temp.remove({});
        Employees.remove({});
        Enrollments_uptemp.remove({});
      },
      AniversariosCumple:function(){
        var employeestatuses = Employeestatuses.findOne({ "empStatusName": "BAJADEF" });
        var today=moment().format("DD/MM");
        logReport.info("Buscando Aniversarios y Cumpleaños del dia "+today);
        if (employeestatuses != undefined) {
          var estatus = employeestatuses._id;
          var DataPersons = Persons.find({ idEmpStatus: { $ne: estatus } },{fields:{aniversario:1,cumple:1,employeeName:1,idcompany:1}}).fetch();
          for (var i = 0; i < Object.keys(DataPersons).length; i++) {
            var _idEmp = DataPersons[i]._id;
            var aniversario = DataPersons[i].aniversario;
            var cumple = DataPersons[i].cumple;
            if(cumple!=undefined){
              var cumpleanos=moment(cumple).format("DD/MM");
              if(cumpleanos==today){
                WriteNotificaciones(DataPersons[i].employeeName,"CUMPLE","ADMIN",DataPersons[i].idcompany,DataPersons[i]._id);
              }
            }
            if(aniversario!=undefined){
              var aniv=moment(aniversario).format("DD/MM");
              if(aniv==today){
                WriteNotificaciones(DataPersons[i].employeeName,"ANI","ADMIN",DataPersons[i].idcompany,DataPersons[i]._id);
              }
            }
          }
        }
        logReport.info("Termino la busqueda de Cumpleaños y Aniversarios");
      },
      limpieza_db:function(){
        log.info("Ejecutando la limpieza a la BD local");
        var reg_ant=moment().subtract(1,'day').toDate();
        
        Enrollments.direct.remove({"PERSON":{$exists:false}})
        BiometricOperations.remove({createdAt:{$lt:reg_ant}});

        orionFileCollection.remove({"filename":"Verificationface.jpg"});
        orion.filesystem.collection.remove({"name":"Verificationface.jpg"});

        orionFileCollection.remove({"filename":"4"});
        orion.filesystem.collection.remove({"filename":"4"});
        orion.filesystem.collection.remove({"name":"4"});

        orionFileCollection.remove({"filename":"LoadFace"});
        orion.filesystem.collection.remove({"name":"LoadFace"});

        orionFileCollection.remove({"filename":"LoadFinger"});
        orion.filesystem.collection.remove({"name":"LoadFinger"});

        orionFileCollection.remove({"filename":"SupremaTemplate","PersonId":{$exists:false}});
        orion.filesystem.collection.remove({"name":"SupremaTemplate","PersonId":{$exists:false}});

        orionFileCollection.remove({"filename":"DigitalPersonaTemplate","PersonId":{$exists:false}});
        orion.filesystem.collection.remove({"name":"DigitalPersonaTemplate","PersonId":{$exists:false}});


        VerificationFace_temp.remove({});
        log.info("Termino la limpieza a la BD local");
      },
      cleanFilesOrion:function(Arreglo){
        for (var i = 0; i < Arreglo.length; i++) {
          logBio.info(JSON.stringify(Arreglo[i]));
          var _id=Arreglo[i].fileId;
          var url=Arreglo[i].url.substring(16);
          orion.filesystem.collection.remove({"_id":_id});
          orionFileCollection.remove({"_id":new Mongo.ObjectID(url)});
          data_chunks.remove({"files_id":new Mongo.ObjectID(url)});
          data_locks.remove({"files_id":new Mongo.ObjectID(url)});
        }
      },
      cleanLocalBiometric:function(){
        console.log("Ejecutando la limpieza local de la Biometria");

        orionFileCollection.remove({"filename":"1"});
        orion.filesystem.collection.remove({"filename":"1"});
        orion.filesystem.collection.remove({"name":"1"});

        orionFileCollection.remove({"filename":"2"});
        orion.filesystem.collection.remove({"filename":"2"});
        orion.filesystem.collection.remove({"name":"2"});

        orionFileCollection.remove({"filename":"3"});
        orion.filesystem.collection.remove({"filename":"3"});
        orion.filesystem.collection.remove({"name":"3"});

        orionFileCollection.remove({"filename":"4"});
        orion.filesystem.collection.remove({"filename":"4"});
        orion.filesystem.collection.remove({"name":"4"});

        orionFileCollection.remove({"filename":"templateFinger"});
        orion.filesystem.collection.remove({"filename":"templateFinger"});
        orion.filesystem.collection.remove({"name":"templateFinger"});

        orionFileCollection.remove({"filename":"templateFaceToken"});
        orion.filesystem.collection.remove({"filename":"templateFaceToken"});
        orion.filesystem.collection.remove({"name":"templateFaceToken"});

        orionFileCollection.remove({"filename":"templateFace"});
        orion.filesystem.collection.remove({"filename":"templateFace"});
        orion.filesystem.collection.remove({"name":"templateFace"});

        console.log("Termino la limpieza local a la Biometria");
      },
      log: function(nivel,texto) {
        switch(nivel){
          case "info":
            log.info(texto);
          break;
          case "error":
            log.error(texto);
          break;
          default:
            log.info(texto);
          break;
        }
      },
      getJefeName:function(_id){
        var result="";
        var data=Jefes.findOne({_id:_id});
        if(data){
          result=data.employeeName;
        }
        return result;
      },
      llenado_MealTimes:function(Inicio,Fin){
        var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
        var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
        if(InicioIsValid && FinIsValid){
          var FechaIsBefore=moment(Inicio).isBefore(Fin);
          var FechaIsSame=moment(Inicio).isSame(Fin);
          if(FechaIsBefore || FechaIsSame){
            logReport.info("Iniciando la generacion de Tiempos de Alimentos");
            // console.log("Iniciando la generacion de Tiempos de Alimentos");
            var DataComp = Companies.find({"meal" : true}, {fields: {companyName: 1}}).fetch();
            var employeestatuses = Employeestatuses.findOne({ "empStatusName": "BAJADEF" });
            var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
            var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
            var daylist = getDaysArray(CicloInicio, CicloFin);
            daylist.map((v) => v.toISOString().slice(0, 10)).join("");
            for (var  k = 0; k < DataComp.length; k++) {
                var _idCompany= DataComp[k]._id;
                var idcompany=[];
                idcompany[0]=_idCompany;
                logReport.info("Compañia " +_idCompany+" nombre :"+DataComp[k].companyName);
                var DataE;
                if(employeestatuses!=undefined){
                  DataE = Persons.find({"mealsEmp":true, "idcompany":{$in:idcompany},idEmpStatus: { $ne: employeestatuses._id } },{fields: {employeeName: 1,idEmployee:1,idcompany:1}}).fetch();
                }else{
                  DataE = Persons.find({"mealsEmp":true,"idcompany":{$in:idcompany}}, {fields: {employeeName: 1,idEmployee:1,idcompany:1}}).fetch();
                }
                logReport.info("Cant de personas " +DataE.length+" encontradas en "+DataComp[k].companyName);
                for (var i = 0; i < DataE.length; i++) {
                    var _idEmployee = DataE[i]._id;
                    daylist.forEach(fechaD => {
                      var today = moment(fechaD).format("DD/MM/YYYY");
                      var DataAccessCtrl = Accesscontrol.find({'idEmployee': _idEmployee,"createdDate":today},{fields: {idEmployee: 1,firstAccess: 1,lastAccess: 1}}).fetch();
                      if (DataAccessCtrl.length != 0) {
                          for (var j = 0; j < DataAccessCtrl.length; j++) {
                              var _idAccessCtrl = DataAccessCtrl[j]._id;
                              var DataAccessDetails = Accessdetails.find({'idEmployee': _idEmployee,'idAccessCtrl': _idAccessCtrl}, {fields: {accessDate: 1},sort: {accessDate: 1}}).fetch();
                              if (DataAccessDetails.length > 2) {
                              	var _entro = DataAccessCtrl[j].firstAccess;
                              	var _salio= DataAccessCtrl[j].lastAccess;
                              	var fechaSem = moment(_entro).format("dddd");
                              	fechaSem = fechaSem.replace(/á/gi,"a");
                              	fechaSem = fechaSem.replace(/é/gi,"e");
                              	fechaSem = fechaSem.replace(/í/gi,"i");
                              	fechaSem = fechaSem.replace(/ó/gi,"o");
                              	fechaSem = fechaSem.replace(/ú/gi,"u");
                              	var FullHorario = getHorario(_idEmployee);
                              	var TheHorario=FullHorario["Horarios"];
                              	var TheHorarioAlimentos=FullHorario["Alimentos"];
                              	var comidaInicio="12:00";
                              	var comidaFin="16:00"

                              	if (TheHorario!=undefined) {
                                  var existDayintoJournal=TheHorario[fechaSem];
                                  if(existDayintoJournal && existDayintoJournal["ComidaInicio"] && existDayintoJournal["ComidaFin"]){
                                    comidaInicio=existDayintoJournal["ComidaInicio"];
                                    comidaFin=existDayintoJournal["ComidaFin"];
                                  }
                              	}
                              	if(comidaInicio!=undefined && comidaFin!=undefined){
                              		var comidaInicioTiempo=comidaInicio.split(":");
                              		var comidaFinTiempo=comidaFin.split(":");
                              		var entro=_entro;
                              		entro.setHours(comidaInicioTiempo[0]);
                              		entro.setMinutes(comidaInicioTiempo[1]);
                              		entro.setSeconds(0);

                              		var salio;
                              		if(_salio==undefined || _salio==null){
                              			log.error("Indefinido "+_idAccessCtrl);
                              			salio=_entro;
                              		}else{
                              			salio=_salio;
                              		}
                              		salio.setHours(comidaFinTiempo[0]);
                              		salio.setMinutes(comidaFinTiempo[1]);
                              		salio.setSeconds(0);

                              		var busqueda={
                              			$and:[
                              			  {idAccessCtrl:_idAccessCtrl},
                              			  {accessDate:{$gte:entro}},
                              			  {accessDate:{$lt:salio}}
                              			]
                              		};
                              		var DataAccessDetailsMeals = Accessdetails.find(busqueda).fetch();
                              		if(DataAccessDetailsMeals.length>0){
                              			var excepcion="No";
                              			var minutos_permitidos=60;
                              			var _primerRegistroComida= DataAccessDetailsMeals[0].accessDate;
                              			var primerRegistro=moment(_primerRegistroComida).format("HH:mm")
                              			var _ultimoRegistroComida= DataAccessDetailsMeals[DataAccessDetailsMeals.length-1].accessDate;
                              			var ultimoRegistro=moment(_ultimoRegistroComida).format("HH:mm")
                              			var horas = getTiempo(_primerRegistroComida, _ultimoRegistroComida).toString();
                              			var fecha = moment(_entro).format("DD/MM/YYYY");
                              			if(primerRegistro ==ultimoRegistro){excepcion="Si"}
                              			if(TheHorarioAlimentos!=undefined){
                              				var minperm=TheHorarioAlimentos["tiempoAlimentos"];
                              				if(minperm!=undefined){
                              					minutos_permitidos=parseInt(minperm)
                              				}
                              			}

                              			var resultado = {
                              				_idEmployee: _idEmployee,
                              				idEmployee: parseInt(DataE[i].idEmployee),
                              				employeeName:  DataE[i].employeeName,
                              				fecha: fecha,
                              				primerRegistro:primerRegistro,
                              				inicioOficial:comidaInicio,
                              				salidaOficial:comidaFin,
                              				ultimoRegistro:ultimoRegistro,
                              				excepcion:excepcion,
                              				minutos_permitidos:minutos_permitidos,
                              				idcompany:DataE[i].idcompany,
                              				fechaIni:_primerRegistroComida,
                              				fechaFin:_ultimoRegistroComida
                              			};
                              			if(horas!="-" && horas!=undefined && horas!=null){
                              				resultado["horas"]=horas.split(":")[0];
                              				resultado["minutos"]=horas.split(":")[1];
                              				var tiempo_transcurrido=parseInt(horas.split(":")[0]*60)+parseInt(horas.split(":")[1]);
                                      var estatus=[];
                                      if(tiempo_transcurrido<=minutos_permitidos){
                                        estatus=[ "Normal", "-" ];
                                      }else{
                                        estatus=[ "Retardo Normal", "-" ];
                                      }
                                      if(TheHorarioAlimentos!=undefined){
                                        estatus=GenerateMealTimes_getEstatus(tiempo_transcurrido,minutos_permitidos,TheHorarioAlimentos);
                                      }
                              				resultado["estatus"]=estatus[0];
                              				resultado["sancion"]=estatus[1];
                              			}

                              			var exMT=Meal_times.findOne({_idEmployee:_idEmployee,fecha:fecha});
                              			if(exMT==undefined){
                              			  logAccesos.info("Insertando en Meal Times :"+JSON.stringify(resultado));
                              			  Meal_times.direct.insert(resultado);
                              			}
                              		}
                              	}
                              }
                          }
                      }
                    });
                }
            }
          }
        }
        logReport.info("! Termino la generacion de Tiempos de Alimentos ¡");
        // console.log("! Termino la generacion de Tiempos de Alimentos ¡");
      },
      llenado_tickets:function(Inicio,Fin){
        var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
        var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
        if(InicioIsValid && FinIsValid){
          var FechaIsBefore=moment(Inicio).isBefore(Fin);
          var FechaIsSame=moment(Inicio).isSame(Fin);
          if(FechaIsBefore || FechaIsSame){
            var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
            var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
            var daylist = getDaysArray(CicloInicio, CicloFin);
            daylist.map((v) => v.toISOString().slice(0, 10)).join("");
            logReport.info("Llenando Tickets....");
            // console.log("Llenando Tickets....");
            var TheCompany = Companies.find({ "meal_ticket": true },{fields:{"_id":1}}).fetch();
            for (var CC = 0; CC < TheCompany.length; CC++) {
              var _idComp=[];
              var _idC=TheCompany[CC]._id
              _idComp[0]=_idC;
              logReport.info("Para la Compañia " + _idC);

              var employeestatuses = Employeestatuses.findOne({ "empStatusName": "BAJADEF" });
              if (employeestatuses != undefined) {
                var estatus = employeestatuses._id;
                var DataE = Persons.find({ "idcompany":{$in:_idComp},idEmpStatus: { $ne: estatus } },{fields:{"idEmployee":1,"employeeName":1,"idcompany":1}}).fetch();
                logReport.info("Empleados Encontrados :" + DataE.length);
                for (var i = 0; i < DataE.length; i++) {
                  var _idEmployee=DataE[i]._id;
                  var idEmployee=DataE[i].idEmployee;
                  var employeeName=DataE[i].employeeName;
                  var idcompany=DataE[i].idcompany;
                  daylist.forEach(fechaD => {
                    var today = moment(fechaD).format("DD/MM/YYYY");
                    var busquedaAccessCtrl={
                        $and:[
                          {"createdDate":today},
                          {"idEmployee":_idEmployee},
                          {"meal":"true"}
                        ]
                    };
                    var DataAccessCtrl = Accesscontrol.findOne(busquedaAccessCtrl,{fields:{"firstAccess":1}});
                    if(DataAccessCtrl!=undefined){
                        var _idAccessControl= DataAccessCtrl._id;
                        var _entro = DataAccessCtrl.firstAccess;
                         var fecha = moment(_entro).format("DD/MM/YYYY");

                        var busquedaAccessDetail={
                            $and:[
                                    {idAccessCtrl:_idAccessControl},
                                    {fpMatchResult:'MEAL'}
                                ]
                            };

                        var DataAccessDetailsMeals = Accessdetails.findOne(busquedaAccessDetail,{fields:{"accessDate":1}});
                        if(DataAccessDetailsMeals!=undefined){
                            var busqueda={
                              "_idEmployee" : _idEmployee,
                              "fecha" : fecha,
                            };
                            var existTicket=Tickets.findOne(busqueda,{fields:{"_id":1}});
                            if(existTicket==undefined){
                              var createdAt= DataAccessDetailsMeals.accessDate;
                              var registro=moment(createdAt).format("HH:mm")
                              var folio=Tickets.find().count();
                              var resultado = {
                                  _idEmployee: _idEmployee,
                                  idEmployee: parseInt(idEmployee),
                                  employeeName: employeeName,
                                  idcompany:idcompany,
                                  fecha: fecha,
                                  registro:registro,
                                  folio:folio++,
                                  createdAt:createdAt
                              };
                              logReport.info("Insertando ticket, datos :"+JSON.stringify(resultado));
                              Tickets.direct.insert(resultado);
                            }
                        }
                    }
                  });
                }
              }
            }
          }
        }
        logReport.info("Termino el Llenando de Tickets");
        // console.log("Termino el Llenando de Tickets");
      },
      FalsoPositivoReportes: function(Inicio,Fin) {
        logReport.info("Buscando Faltas mal Llenadas");
        console.log("Buscando Faltas mal Llenadas");
        var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
        var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
        if(InicioIsValid && FinIsValid){
          var FechaIsBefore=moment(Inicio).isBefore(Fin);
          var FechaIsSame=moment(Inicio).isSame(Fin);
          if(FechaIsBefore || FechaIsSame){
          	var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
            var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
          	var daylist = getDaysArray(CicloInicio, CicloFin);
          	daylist.map((v) => v.toISOString().slice(0, 10)).join("");
          	daylist.forEach(fechaD => {
              var today = moment(fechaD).format("DD/MM/YYYY");
              var Inicio = moment(fechaD).format("YYYY-MM-DD");
              var DataReports=Reports.find({"fecha":today,"estatus":"Falta"},{fields:{_idEmployee:1}}).fetch();
              for (var i = 0; i < DataReports.length; i++) {
                var idEmployee=DataReports[i]._idEmployee;
                var DataAccess=Accesscontrol.findOne({"idEmployee":idEmployee,"createdDate":today},{fields:{_id:1}});
                if(DataAccess!=undefined){
                  logReport.info("Falso Positivo del Empleado " + idEmployee+" fecha "+today+" con AcessCtrl "+DataAccess._id);
                  logErrores.info("Falso Positivo del Empleado " + idEmployee+" fecha "+today+" con AcessCtrl "+DataAccess._id);
                  Meteor.call("SimulaReports",Inicio,Inicio,undefined,undefined,idEmployee);
                }
              }
            });
          }
        }
        logReport.info("Termino la Busqueda de Faltas mal Llenadas");
        console.log("Termino la Busqueda de Faltas mal Llenadas");
      }
      });
    }
