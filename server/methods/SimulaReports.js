Meteor.methods({
  SimulaReports: function(Inicio, Fin, Company,Activos,ByEmployee) {
    //2018-01-01,2018-09-30
    //Formato de las Fechas que se reciben YYYY-MM-DD, ejemplo "2019-01-23"
    this.unblock();
    var InicioIsValid=moment(Inicio,'YYYY-MM-DD', true).isValid();
    var FinIsValid=moment(Fin,'YYYY-MM-DD', true).isValid();
    logReport.info("Iniciando el proceso generacion de reportes");
    if(InicioIsValid && FinIsValid){
      var FechaIsBefore=moment(Inicio).isBefore(Fin);
      var FechaIsSame=moment(Inicio).isSame(Fin);
      if(FechaIsBefore || FechaIsSame){        
        var FechaActual=moment().add(1,'days').format('YYYY-MM-DD');
        var isServer=Config_application.findOne({ "isServer": false });   
        var tipoEstacion=isServer==undefined?"Servidor":"Estacion";
        logReport.info("Tipo de estacion "+tipoEstacion);     
        logReport.info("Inicio "+Inicio+" Fin "+Fin);
        var BAJADEF = Employeestatuses.findOne({ "empStatusName": "BAJADEF" })._id;
        var busqueda={};
        if(ByEmployee!=undefined){
          logReport.info("Falso positivo para el empleado "+ByEmployee);
          busqueda["_id"]=ByEmployee;
        }else{
          if(Activos!=undefined){
            busqueda["idEmpStatus"]={
              "$ne":BAJADEF
            };
          }
          if(Company!=undefined){
            var abc=[];
            abc.push(Company);
            busqueda["idcompany"]={
              "$in":abc
            };
          }
        }
        var DataE=Persons.find(busqueda).fetch();
        var TotalDataE=DataE.length;
        var Porcent=0;
        var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
        var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
        var daylist = getDaysArray(CicloInicio, CicloFin);
        for(var i=0;i<DataE.length;i++){
          var _idEmployee=DataE[i]._id;
          var idEmployee=parseInt(DataE[i].idEmployee);
          var employeeName=DataE[i].employeeName;
          var idDepartment=DataE[i].idDepartment;
          var idLocation=DataE[i].idLocation;
          var idcompany=DataE[i].idcompany;
          var idmanager=DataE[i].idmanager;
          var estatus=DataE[i].idEmpStatus;
          var estatusDelEmpleado=DataE[i].idEmpStatus;
          var idpagadora=DataE[i].idpagadora;
          var idpagadora_txt=DataE[i].idpagadora_txt;

          var idDireccion=DataE[i].idDireccion;
          var idDireccion_txt=DataE[i].idDireccion_txt;
          var idProyecto=DataE[i].idProyecto;
          var idProyecto_txt=DataE[i].idProyecto_txt;
          var idArea=DataE[i].idArea;
          var idArea_txt=DataE[i].idArea_txt;
          var idEmpPosition=DataE[i].idEmpPosition;
          var idEmpPosition_txt=DataE[i].idEmpPosition_txt;
                  
          var employeeCompany = DataE[i].idcompany;
          var idDepartment_txt=GetDeptoName(idDepartment);
          var idLocation_txt=GetMyLocationName(idLocation);
          var idmanager_txt=DataE[i].idmanager_txt;
          var FullHorario=getHorario(_idEmployee);
          var DadoDeBaja=false;
          if(estatus==BAJADEF){
            DadoDeBaja=true;
          }
          logReport.info("Generando reportes de asistencia para el empleado "+_idEmployee+" "+employeeName);
          logReport.info("Horario :"+JSON.stringify(FullHorario));
          if(DadoDeBaja){
            logReport.info("Empleado dado de baja");
            if (FullHorario.hasOwnProperty("Horarios") && FullHorario.hasOwnProperty("Asistencias")) {
              var days=FullHorario.Horarios;
              var HorarioAsistencias=FullHorario.Asistencias;
              var ultimoDia=Accesscontrol.findOne({'idEmployee': _idEmployee},{fields:{firstAccess:1},sort:{firstAccess:-1},limit:1});
              if(ultimoDia!=undefined){
                try {
                  var primerDia=Accesscontrol.findOne({'idEmployee': _idEmployee},{fields:{firstAccess:1},sort:{firstAccess:1},limit:1});
                  var FechaPrimerRegistro=moment(primerDia.firstAccess).format('YYYY-MM-DD');
                  var FechaUltimoRegistro=moment(ultimoDia.firstAccess).format('YYYY-MM-DD');
                  var isInto=moment(Inicio).isBetween(FechaPrimerRegistro,FechaUltimoRegistro);
                  var isIntos=moment(Fin).isBetween(FechaPrimerRegistro,FechaUltimoRegistro);
                  if(isInto||isIntos){
                    logReport.info(_idEmployee+" FechaPrimerRegistro "+FechaPrimerRegistro+" FechaUltimoRegistro "+FechaUltimoRegistro);
                    daylist.map((v) => v.toISOString().slice(0, 10)).join("");
                    daylist.forEach(fechaD => {
                      var fechaFin = moment(fechaD).hour(23).minutes(0).seconds(0).format('YYYY-MM-DD');
                      var is=moment(fechaFin).isBetween(FechaPrimerRegistro,FechaPrimerRegistro);
                      if(is){
                        //same
                        var fechaSem = moment(fechaD).format("dddd");
                        fechaSem = fechaSem.replace(/á/gi,"a");
                        fechaSem = fechaSem.replace(/é/gi,"e");
                        fechaSem = fechaSem.replace(/í/gi,"i");
                        fechaSem = fechaSem.replace(/ó/gi,"o");
                        fechaSem = fechaSem.replace(/ú/gi,"u");
                        var existDayintoJournal=days[fechaSem];
                        if (existDayintoJournal!=undefined) {
                          var createdDate=moment(fechaD).format("DD/MM/YYYY");
                          var filtroDataAccessCtrlByDay={
                            'idEmployee': _idEmployee,
                            'createdDate': createdDate
                          };
                          var oneday=days[fechaSem];
                          var inicioOficial=oneday["Entrada"];
                          var salidaOficial=oneday["Salida"];
                          var DataAccessCtrlByDay = Accesscontrol.findOne(filtroDataAccessCtrlByDay,{fields:{firstAccess:1,lastAccess:1}});
                          if(DataAccessCtrlByDay!=undefined){
                            if(isServer==undefined){
                              var entro = DataAccessCtrlByDay.firstAccess;
                              var primerRegistro = moment(entro).format("HH:mm");
                              var salio= DataAccessCtrlByDay.lastAccess;
                              var ultimoRegistro="-";
                              if(salio!=undefined){
                                ultimoRegistro = moment(salio).format("HH:mm");
                              }
                              var excepcion = getexcepcion(entro, salio);
                              var horas = getHoras(entro, salio);
                              var tiempo = getTiempo(entro, salio);
                              var getSancionandStatus=[];
                              getSancionandStatus=GenerateReports_getEstatus(entro,inicioOficial,HorarioAsistencias);
                              var estatus = getSancionandStatus[0];
                              var sancion = getSancionandStatus[1];
                              var antes=GenerateReports_getAntes(salio,salidaOficial);
                              if(estatusDelEmpleado=="69Z57wy7q74Pkbavo"){
                                estatus="Normal";
                              }
                              var resultado = {
                                _idEmployee: _idEmployee,
                                idEmployee: idEmployee,
                                employeeName: employeeName,
                                idDepartment:idDepartment,
                                idDepartment_txt : idDepartment_txt,
                                idLocation: idLocation,
                                idLocation_txt : idLocation_txt,
                                idcompany: idcompany,
                                idmanager: idmanager,
                                idmanager_txt:idmanager_txt,
                                fecha: createdDate,
                                inicioOficial: inicioOficial,
                                primerRegistro: primerRegistro,
                                salidaOficial: salidaOficial,
                                ultimoRegistro: ultimoRegistro,
                                excepcion: excepcion,
                                tiempo: tiempo,
                                horas: horas,
                                estatus: estatus,
                                sancion:sancion,
                                antes:antes,
                                idpagadora:idpagadora,
                                idpagadora_txt:idpagadora_txt,
                                idDireccion:idDireccion,
                                idDireccion_txt:idDireccion_txt,
                                idProyecto:idProyecto,
                                idProyecto_txt:idProyecto_txt,
                                idArea:idArea,
                                idArea_txt:idArea_txt,
                                idEmpPosition:idEmpPosition,
                                idEmpPosition_txt:idEmpPosition_txt,
                              };

                              if(entro instanceof Date){
                                resultado["fechaIni"]=entro;
                              }
                              if(salio instanceof Date){
                                resultado["fechaFin"]=salio;
                              }

                              var DetalleAcceso=Accessdetails.findOne({"idAccessCtrl":DataAccessCtrlByDay._id},{sort:{createdAt:1}});
                              if(DetalleAcceso){
                                resultado["idDevice"]=GetidDevice(DetalleAcceso.idDevice);
                                resultado["idLocationChk"]=DetalleAcceso.idLocation;
                                resultado["idLocationChk_txt"]=DetalleAcceso.idLocation_txt;
                              }

                              var existe=Reports.findOne({"_idEmployee":resultado._idEmployee,"fecha":resultado.fecha},{fields:{estatus:1}});
                              if(existe==undefined){
                                Reports.direct.insert(resultado,function(err,res){
                                  if(err){
                                    logReport.error("Error "+err+" al insertar el obj "+JSON.stringify(resultado));
                                  }
                                });
                              }else{
                                var estatusAntes=existe.estatus;
                                if(estatusAntes=="Falta"){
                                  Reports.upsert({_id:existe._id}, {$set:resultado});
                                }
                              }
                            }else{
                              logReport.info("Sin Procesar los Upsert, es estacion");
                            }
                          }else{
                            if(estatusDelEmpleado!= "3eRz4SNtFFWbtmYBf" && 
                            estatusDelEmpleado!= "bbqMEZnMD4mmBT7F5" &&
                            estatusDelEmpleado!= "gz76JMkmN6pjS6fqF" && 
                            estatusDelEmpleado!="69Z57wy7q74Pkbavo"){
                              var resultado = {
                                _idEmployee: _idEmployee,
                                idEmployee: idEmployee,
                                employeeName: employeeName,
                                idDepartment:idDepartment,
                                idDepartment_txt:idDepartment_txt,
                                idLocation: idLocation,
                                idLocation_txt: idLocation_txt,
                                idcompany: idcompany,
                                idmanager: idmanager,
                                idmanager_txt: idmanager_txt,
                                fecha: createdDate,
                                inicioOficial: inicioOficial,
                                primerRegistro: "-",
                                salidaOficial: salidaOficial,
                                ultimoRegistro: "-",
                                excepcion:"-",
                                tiempo: "-",
                                horas: "-",
                                estatus: "Falta",
                                sancion:"-",
                                antes:"-",
                                fechaIni : moment(fechaD).hour(12).toDate(),
                                fechaFin : moment(fechaD).hour(12).toDate(),
                                idDevice:"-",
                                idLocationChk:"-",
                                idLocationChk_txt:"-",
                                idpagadora:idpagadora,
                                idpagadora_txt:idpagadora_txt,
                                idDireccion:idDireccion,
                                idDireccion_txt:idDireccion_txt,
                                idProyecto:idProyecto,
                                idProyecto_txt:idProyecto_txt,
                                idArea:idArea,
                                idArea_txt:idArea_txt,
                                idEmpPosition:idEmpPosition,
                                idEmpPosition_txt:idEmpPosition_txt,
                              };
                              var existe=Reports.findOne({estatus: "Falta","_idEmployee":resultado._idEmployee,"fecha":resultado.fecha},{fields:{_id:1}});
                              if(existe==undefined){
                                Reports.direct.insert(resultado,function(err,res){
                                  if(err){
                                    logReport.error("Error "+err+" al insertar el obj "+JSON.stringify(resultado));
                                  }
                                });
                              }
                            }else{
                              logReport.error("El estatus del empleado no permite colocar faltas");
                            }
                          }
                        }
                      }else{
                        throw BreakException;
                      }
                    });
                  }
                } catch(e) {
                }
              }
            }
          }else{
            logReport.info("Empleado activo");
            if (FullHorario.hasOwnProperty("Horarios") && FullHorario.hasOwnProperty("Asistencias")) {
              try {
                var days=FullHorario.Horarios;
                var HorarioAsistencias=FullHorario.Asistencias;
                var primerDia=Accesscontrol.findOne({'idEmployee': _idEmployee},{fields:{firstAccess:1},sort:{firstAccess:1},limit:1});
                if(primerDia!=undefined){
                  var FechaPrimerRegistro=moment(primerDia.firstAccess).format('YYYY-MM-DD');
                  var isInto=moment(Inicio).isBetween(FechaPrimerRegistro,FechaActual);
                  if(isInto){
                    daylist.map((v) => v.toISOString().slice(0, 10)).join("");
                    daylist.forEach(fechaD => {
                      var fechaFin = moment(fechaD).hour(23).minutes(0).seconds(0).format('YYYY-MM-DD');
                      var is=moment(fechaFin).isBetween(FechaPrimerRegistro,FechaActual);
                      if(is){
                        var fechaSem = moment(fechaD).format("dddd");
                        fechaSem = fechaSem.replace(/á/gi,"a");
                        fechaSem = fechaSem.replace(/é/gi,"e");
                        fechaSem = fechaSem.replace(/í/gi,"i");
                        fechaSem = fechaSem.replace(/ó/gi,"o");
                        fechaSem = fechaSem.replace(/ú/gi,"u");
                        var existDayintoJournal=days[fechaSem];
                        if (existDayintoJournal!=undefined) {
                          var createdDate=moment(fechaD).format("DD/MM/YYYY");
                          var filtroDataAccessCtrlByDay={
                            'idEmployee': _idEmployee,
                            'createdDate': createdDate
                          };
                          var oneday=days[fechaSem];                          
                          var inicioOficial=oneday["Entrada"];
                          var salidaOficial=oneday["Salida"];
                          var DataAccessCtrlByDay = Accesscontrol.findOne(filtroDataAccessCtrlByDay,{fields:{firstAccess:1,lastAccess:1}});
                          logReport.info("Analizando "+createdDate+" DataAccessCtrlByDay "+JSON.stringify(DataAccessCtrlByDay));
                          if(DataAccessCtrlByDay!=undefined){
                            if(isServer==undefined){
                              try {
                            var entro = DataAccessCtrlByDay.firstAccess;
                            var primerRegistro = moment(entro).format("HH:mm");
                            var salio= DataAccessCtrlByDay.lastAccess;
                            var ultimoRegistro="-";
                            if(salio!=undefined){
                              ultimoRegistro = moment(salio).format("HH:mm");
                            }
                            var excepcion = getexcepcion(entro, salio);
                            var horas = getHoras(entro, salio);
                            var tiempo = getTiempo(entro, salio);
                            var getSancionandStatus=[];
                            getSancionandStatus=GenerateReports_getEstatus(entro,inicioOficial,HorarioAsistencias);
                            var estatus = getSancionandStatus[0];
                            var sancion = getSancionandStatus[1];
                            var antes=GenerateReports_getAntes(salio,salidaOficial);
                            if(estatusDelEmpleado=="69Z57wy7q74Pkbavo"){
                              estatus="Normal";
                            }
                            var resultado = {
                              _idEmployee: _idEmployee,
                              idEmployee: idEmployee,
                              employeeName: employeeName,
                              idDepartment:idDepartment,
                              idDepartment_txt : idDepartment_txt,
                              idLocation: idLocation,
                              idLocation_txt : idLocation_txt,
                              idcompany: idcompany,
                              idmanager: idmanager,
                              idmanager_txt:idmanager_txt,
                              fecha: createdDate,
                              inicioOficial: inicioOficial,
                              primerRegistro: primerRegistro,
                              salidaOficial: salidaOficial,
                              ultimoRegistro: ultimoRegistro,
                              excepcion: excepcion,
                              tiempo: tiempo,
                              horas: horas,
                              estatus: estatus,
                              sancion:sancion,
                              antes:antes,
                              idpagadora:idpagadora,
                              idpagadora_txt:idpagadora_txt,
                              idDireccion:idDireccion,
                              idDireccion_txt:idDireccion_txt,
                              idProyecto:idProyecto,
                              idProyecto_txt:idProyecto_txt,
                              idArea:idArea,
                              idArea_txt:idArea_txt,
                              idEmpPosition:idEmpPosition,
                              idEmpPosition_txt:idEmpPosition_txt,
                            };

                            if(entro instanceof Date){
                              resultado["fechaIni"]=entro;
                            }
                            if(salio instanceof Date){
                              resultado["fechaFin"]=salio;
                            }
                            
                            var DetalleAcceso=Accessdetails.findOne({"idAccessCtrl":DataAccessCtrlByDay._id},{sort:{createdAt:1}});
                            if(DetalleAcceso){
                              resultado["idDevice"]=GetidDevice(DetalleAcceso.idDevice);
                              resultado["idLocationChk"]=DetalleAcceso.idLocation;
                              resultado["idLocationChk_txt"]=DetalleAcceso.idLocation_txt;
                            }

                            var ReportsFetch=Reports.find({
                              $and:[
                                {"_idEmployee":resultado._idEmployee},
                                {"fecha":resultado.fecha}
                              ]
                              },{fields:{estatus:1,primerRegistro:1,inicioOficial:1,fecha:1}}).fetch();
                            var cuantos=ReportsFetch.length;
                            if(cuantos==0){
                              Reports.direct.insert(resultado,function(err,res){
                                if(err){
                                  logReport.error("Error "+err+" al insertar el obj "+JSON.stringify(resultado));
                                }
                              });
                            }else if(cuantos>1){
                              ReportsFetch.forEach(elementRe => {
                                Reports.remove({"_id":elementRe._id});
                              });
                              Reports.direct.insert(resultado,function(err,res){
                                if(err){
                                  logReport.error("Error "+err+" al insertar el obj "+JSON.stringify(resultado));
                                }
                              });
                            }else{
                              var estatusAntes=ReportsFetch[0].estatus;
                              if(estatusAntes=="Falta"){
                                Reports.upsert({_id:ReportsFetch[0]._id}, {$set:resultado});
                              }else{
                                try {
                                  if(ReportsFetch[0].primerRegistro!=primerRegistro || 
                                    ReportsFetch[0].inicioOficial!=inicioOficial){
                                      logReport.info("Al parecer hubo un cambio en: (primerRegistro, inicioOficial) del colaborador "+ReportsFetch[0]._id);
                                      Reports.upsert({_id:ReportsFetch[0]._id}, {$set:resultado});
                                  }
                                } catch (errorup) {
                                  logReport.info("errorup "+errorup);
                                }                                
                              }
                            }
                          } catch (error) {
                            
                          }
                          }else{
                            logReport.info("Sin Procesar los Upsert, es estacion");
                          }
                          }else{
                            if(estatusDelEmpleado!= "3eRz4SNtFFWbtmYBf" && 
                            estatusDelEmpleado!= "bbqMEZnMD4mmBT7F5" &&
                            estatusDelEmpleado!= "gz76JMkmN6pjS6fqF" && 
                            estatusDelEmpleado!= "69Z57wy7q74Pkbavo"){
                              var resultado = {
                                _idEmployee: _idEmployee,
                                idEmployee: idEmployee,
                                employeeName: employeeName,
                                idDepartment:idDepartment,
                                idDepartment_txt:idDepartment_txt,
                                idLocation: idLocation,
                                idLocation_txt: idLocation_txt,
                                idcompany: idcompany,
                                idmanager: idmanager,
                                idmanager_txt: idmanager_txt,
                                fecha: createdDate,
                                inicioOficial: inicioOficial,
                                primerRegistro: "-",
                                salidaOficial: salidaOficial,
                                ultimoRegistro: "-",
                                excepcion:"-",
                                tiempo: "-",
                                horas: "-",
                                estatus: "Falta",
                                sancion:"-",
                                antes:"-",
                                fechaIni : moment(fechaD).hour(12).toDate(),
                                fechaFin : moment(fechaD).hour(12).toDate(),
                                idDevice:"-",
                                idLocationChk:"-",
                                idLocationChk_txt:"-",
                                idpagadora:idpagadora,
                                idpagadora_txt:idpagadora_txt,
                                idDireccion:idDireccion,
                                idDireccion_txt:idDireccion_txt,
                                idProyecto:idProyecto,
                                idProyecto_txt:idProyecto_txt,
                                idArea:idArea,
                                idArea_txt:idArea_txt,
                                idEmpPosition:idEmpPosition,
                                idEmpPosition_txt:idEmpPosition_txt,
                              };
                              var existe=Reports.findOne({estatus: "Falta","_idEmployee":resultado._idEmployee,"fecha":resultado.fecha},{fields:{_id:1,salidaOficial:1,inicioOficial:1}});
                              if(existe==undefined){
                                Reports.direct.insert(resultado,function(err,res){
                                  if(err){
                                    logReport.error("Error "+err+" al insertar el obj "+JSON.stringify(resultado));
                                  }
                                });
                              }else{
                                if(existe.salidaOficial!=salidaOficial || 
                                  existe.inicioOficial!=inicioOficial){
                                    logReport.info("Al parecer hubo un cambio en: (inicioOficial, salidaOficial) "+existe._id);
                                    Reports.upsert({_id:existe._id}, {$set:resultado});
                                }
                              }
                            }
                          }
                        }else{                          
                          var createdDate = moment(fechaD).format("DD/MM/YYYY");
                          logReport.info("el dia " + fechaSem + " " + createdDate + " el empleado asistio fuera de su horario laboral");
                          var filtroDataAccessCtrlByDay = {
                            'idEmployee': _idEmployee,
                            'createdDate': createdDate
                          };
                          var DataAccessCtrlByDay = Accesscontrol.findOne(filtroDataAccessCtrlByDay, { fields: { firstAccess: 1, lastAccess: 1 } });
                          if (DataAccessCtrlByDay) {
                            var createdDate = moment(fechaD).format("DD/MM/YYYY");
                            var fechaDx = fechaD;
                            var fechaSem = undefined;
                            for (let intentos = 1; intentos < 6; intentos++) {
                              fechaDx.setDate(fechaDx.getDate() + intentos);
                              fechaSem = moment(fechaDx).format("dddd");
                              fechaSem = fechaSem.replace(/á/gi, "a");
                              fechaSem = fechaSem.replace(/é/gi, "e");
                              fechaSem = fechaSem.replace(/í/gi, "i");
                              fechaSem = fechaSem.replace(/ó/gi, "o");
                              fechaSem = fechaSem.replace(/ú/gi, "u");
                              if (days[fechaSem] != undefined) {
                                break;
                              }
                            }
                            if (fechaSem) {
                              var oneday = days[fechaSem];
                              var inicioOficial = oneday["Entrada"];
                              var salidaOficial = oneday["Salida"];
                              if (isServer == undefined) {
                                var entro = DataAccessCtrlByDay.firstAccess;
                                var primerRegistro = moment(entro).format("HH:mm");
                                var salio = DataAccessCtrlByDay.lastAccess;
                                var ultimoRegistro = "-";
                                if (salio != undefined) {
                                  ultimoRegistro = moment(salio).format("HH:mm");
                                }
                                var excepcion = getexcepcion(entro, salio);
                                var horas = getHoras(entro, salio);
                                var tiempo = getTiempo(entro, salio);
                                var getSancionandStatus = [];
                                getSancionandStatus = GenerateReports_getEstatus(entro, inicioOficial, HorarioAsistencias);
                                var estatus = getSancionandStatus[0];
                                var sancion = getSancionandStatus[1];
                                var antes = GenerateReports_getAntes(salio, salidaOficial);
                                if(estatusDelEmpleado=="69Z57wy7q74Pkbavo"){
                                  estatus="Normal";
                                }
                                var resultado = {
                                  _idEmployee: _idEmployee,
                                  idEmployee: idEmployee,
                                  employeeName: employeeName,
                                  idDepartment: idDepartment,
                                  idDepartment_txt: idDepartment_txt,
                                  idLocation: idLocation,
                                  idLocation_txt: idLocation_txt,
                                  idcompany: idcompany,
                                  idmanager: idmanager,
                                  idmanager_txt: idmanager_txt,
                                  fecha: createdDate,
                                  inicioOficial: inicioOficial,
                                  primerRegistro: primerRegistro,
                                  salidaOficial: salidaOficial,
                                  ultimoRegistro: ultimoRegistro,
                                  excepcion: excepcion,
                                  tiempo: tiempo,
                                  horas: horas,
                                  estatus: estatus,
                                  sancion: sancion,
                                  antes: antes,
                                  idpagadora:idpagadora,
                                  idpagadora_txt:idpagadora_txt,
                                  idDireccion:idDireccion,
                                  idDireccion_txt:idDireccion_txt,
                                  idProyecto:idProyecto,
                                  idProyecto_txt:idProyecto_txt,
                                  idArea:idArea,
                                  idArea_txt:idArea_txt,
                                  idEmpPosition:idEmpPosition,
                                  idEmpPosition_txt:idEmpPosition_txt,
                                };

                                if (entro instanceof Date) {
                                  resultado["fechaIni"] = entro;
                                }
                                if (salio instanceof Date) {
                                  resultado["fechaFin"] = salio;
                                }

                                var DetalleAcceso = Accessdetails.findOne({ "idAccessCtrl": DataAccessCtrlByDay._id }, { sort: { createdAt: 1 } });
                                if (DetalleAcceso) {
                                  resultado["idDevice"] = GetidDevice(DetalleAcceso.idDevice);
                                  resultado["idLocationChk"] = DetalleAcceso.idLocation;
                                  resultado["idLocationChk_txt"] = DetalleAcceso.idLocation_txt;
                                }
                                var ReportsFetch=Reports.find({
                                  $and:[
                                  {"_idEmployee":resultado._idEmployee},
                                  {"fecha":resultado.fecha}
                                  ]
                                  },{fields:{estatus:1,primerRegistro:1,inicioOficial:1,fecha:1}}).fetch();
                                var cuantos=ReportsFetch.length;
                                if(cuantos==0){
                                  Reports.direct.insert(resultado,function(err,res){
                                  if(err){
                                    logReport.error("Error "+err+" al insertar el obj "+JSON.stringify(resultado));
                                  }
                                  });
                                }else if(cuantos>1){
                                  ReportsFetch.forEach(elementRe => {
                                  Reports.remove({"_id":elementRe._id});
                                  });
                                  Reports.direct.insert(resultado,function(err,res){
                                  if(err){
                                    logReport.error("Error "+err+" al insertar el obj "+JSON.stringify(resultado));
                                  }
                                  });
                                }else{
                                  try {
                                    if(ReportsFetch[0].primerRegistro!=primerRegistro || 
                                    ReportsFetch[0].inicioOficial!=inicioOficial){
                                      logReport.info("Al parecer hubo un cambio en: (primerRegistro, inicioOficial) del colaborador "+ReportsFetch[0]._id);
                                      Reports.upsert({_id:ReportsFetch[0]._id}, {$set:resultado});
                                    }
                                  } catch (errorup) {
                                    logReport.info("errorup "+errorup);
                                  }                                
                                }
                              }
                            }

                          } else {
                            logReport.info("existDayintoJournal undefined, no existe "+fechaSem+" en "+JSON.stringify(days));
                          }
                        }
                      }else{
                        throw BreakException;
                      }
                    });
                  }else{
                    logReport.error("Fecha prime registro mayor a la actual,entre "+Inicio+" y "+FechaPrimerRegistro+" : "+FechaActual);  
                  }
                }else{
                  logReport.error("Empleado sin ningun registro "+_idEmployee);
                }
              } catch (e) {
                logReport.error("Error "+JSON.stringify(e));
              }
            }else {
              logReport.warn("Empleado sin Horario " + _idEmployee);
            }
          }
          Porcent++;
          logReport.info("*********************************************************************************");
        }
        logReport.info("Proceso terminado generacion de reportes");
      }else{
        console.log("La fecha del primer argumento debe ser menor o igual que el segundo arg")  ;
      }
    }else{
      console.log("Fechas No validas");
    }
  }
});
