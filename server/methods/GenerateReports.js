Meteor.methods({
  MigrateReports: function(Inicio, Fin, Company) {
    //2018-01-01,2018-09-30
    //Formato de las Fechas que se reciben YYYY-MM-DD, ejemplo "2019-01-23"
    //console.log("Iniciando el proceso");
    var CicloInicio = moment(Inicio + "T12:00:00").hour(12).minutes(0).seconds(0).toDate();
    var CicloFin = moment(Fin + "T12:00:00").hour(12).minutes(0).seconds(0).toDate();
    var daylist = getDaysArray(CicloInicio, CicloFin);
    daylist.map((v) => v.toISOString().slice(0, 10)).join("");
    daylist.forEach(fechaD => {
      var fechaInicio = moment(fechaD).hour(0).minutes(0).seconds(0).toDate();
      var fechaFin = moment(fechaD).hour(23).minutes(0).seconds(0).toDate();
      var Fecha = moment(fechaD).hour(12).minutes(0).seconds(0).toDate();
      var today = moment(fechaInicio).format('DD/MM/YYYY');
      var fechaSem = moment(fechaInicio).format("dddd");
      logReport.info("Llenando los Reportes del dia " + today);

      var DataE=Persons.find().fetch();
      for(var i=0;i<DataE.length;i++){
        var _idEmployee=DataE[i]._id;
        var employeeName=DataE[i].employeeName;
        var idEmpStatus=DataE[i].idEmpStatus;
        var DataAccessCtrl = Accesscontrol.find(
            {
              $and: [
                { 'idEmployee': _idEmployee},
                {  "firstAccess": { $gte: fechaInicio, $lt: fechaFin }}
              ]
            },
            {
                fields: {
                    idEmployee: 1,
                    firstAccess: 1,
                    lastAccess: 1
                },
                sort: {firstAccess: 1}
            }
        ).fetch();
        logReport.info("Empleado "+_idEmployee+" Nombre "+employeeName+" cn AccessCtrl "+DataAccessCtrl.length);
        if(DataAccessCtrl!=undefined){
          if(DataAccessCtrl.length!=0){
            var FullHorario=getHorario(_idEmployee);
            if (FullHorario.hasOwnProperty("Horarios")) {
              if(FullHorario.hasOwnProperty("Asistencias")){
                var idEmployee=DataE[i].idEmployee;
                var employeeName=DataE[i].employeeName;
                var idDepartment=DataE[i].idDepartment;
                var idLocation=DataE[i].idLocation;
                var idcompany=DataE[i].idcompany;
                var idmanager=DataE[i].idmanager;
                var idmanager_txt=DataE[i].idmanager_txt;
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

                var FechaPrimerAcceso=DataAccessCtrl[0].firstAccess;
                var FechaUltimoAcceso=DataAccessCtrl[DataAccessCtrl.length-1].firstAccess;
                var days=FullHorario.Horarios;
                var HorarioAsistencias=FullHorario.Asistencias;
                var DatesWorks=getDatesBetween(FechaPrimerAcceso,FechaUltimoAcceso);
                for(var j=0;j<DatesWorks.length;j++){
                    var ElapsedDay=DatesWorks[j];
                    var fechaSem = moment(ElapsedDay).format("dddd");
                    fechaSem = fechaSem.replace(/á/gi,"a");
                    fechaSem = fechaSem.replace(/é/gi,"e");
                    fechaSem = fechaSem.replace(/í/gi,"i");
                    fechaSem = fechaSem.replace(/ó/gi,"o");
                    fechaSem = fechaSem.replace(/ú/gi,"u");
                    //logReport.info("fechaSem "+ElapsedDay+" dia "+fechaSem);
                    var existDayintoJournal=days[fechaSem];
                    if (existDayintoJournal!=undefined) {
                        //logReport.info("existDayintoJournal "+JSON.stringify(existDayintoJournal));

                        var createdDate=moment(ElapsedDay).format("DD/MM/YYYY");
                        var filtroDataAccessCtrlByDay={
                            'idEmployee': _idEmployee,
                            'createdDate': createdDate
                        };
                        var oneday=days[fechaSem];
                        //logReport.info("Analizando "+JSON.stringify(oneday));
                        var inicioOficial=oneday["Entrada"];
                        var salidaOficial=oneday["Salida"];

                        //logReport.info("Ejecutando el filtro "+JSON.stringify(filtroDataAccessCtrlByDay));
                        var DataAccessCtrlByDay = Accesscontrol.findOne(filtroDataAccessCtrlByDay);
                        if(DataAccessCtrlByDay!=undefined){

                            var entro = DataAccessCtrlByDay.firstAccess;
                            var fecha = moment(entro).format("DD/MM/YYYY");
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

                            var resultado = {
                                _idEmployee: _idEmployee,
                                idEmployee: parseInt(idEmployee),
                                employeeName: employeeName,
                                idDepartment:idDepartment,
                                idDepartment_txt : GetDeptoName(idDepartment),
                                idLocation: idLocation,
                                idLocation_txt : GetMyLocationName(idLocation),
                                idcompany: idcompany,
                                idmanager: idmanager,
                                idmanager_txt:idmanager_txt,
                                fecha: fecha,
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

                            Reports.direct.insert(resultado,function(err,res){
                              if(err){
                                logErrores.info("Err al insertar reports "+err);
                              }
                              if (res){
                                //insertaSync(resultado, "reports", 'insert');
                              }
                            });
                        }else{
                          if(idEmpStatus!="69Z57wy7q74Pkbavo"){
                            var resultado = {
                                _idEmployee: _idEmployee,
                                idEmployee: parseInt(idEmployee),
                                employeeName: employeeName,
                                idDepartment:idDepartment,
                                idDepartment_txt : GetDepartmentName(idDepartment),
                                idLocation: idLocation,
                                idcompany: idcompany,
                                idmanager: idmanager,
                                idmanager_txt:idmanager_txt,
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
                                fechaIni : ElapsedDay,
                                fechaFin : ElapsedDay,
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
                            Reports.direct.insert(resultado,function(err,res){
                              if(err){
                                logErrores.info("Err al insertar reports "+err);
                              }
                              if (res){
                                //insertaSync(resultado, "reports", 'insert');
                              }
                            });
                          }
                        }
                    }
                }

              }
            }
          }
        }
      }
    });
  }
});
