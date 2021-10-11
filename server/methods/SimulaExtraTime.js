Meteor.methods({
  SimulaExtraTime: function(Inicio, Fin, Company) {
    //Formato de las Fechas que se reciben YYYY-MM-DD, ejemplo "2019-01-23"
    logReport.info("Iniciando el proceso generacion de tiempo extra");
    var fechaIni = moment(Inicio).hour(0).minutes(0).seconds(0).format('YYYY-MM-DD');
    var fechaFin = moment(Fin).hour(23).minutes(0).seconds(0).format('YYYY-MM-DD');
    var isSame=moment(fechaIni).isSame(fechaFin);
    var isBefore=moment(fechaIni).isBefore(fechaFin);
    if(isSame || isBefore){
      var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
      var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
      var busqueda={
        "$and":[
          {"estatus":{"$nin":["Falta"]}},
          {"ultimoRegistro":{"$nin":[null,"",undefined]}},
          {"fechaIni":{"$gte" : CicloInicio,"$lt" :CicloFin}}
        ]
      };
      if(Company!=undefined){
        var abc=[];abc.push(Company);
        busqueda["idcompany"]={ "$in":abc };
      }
      var DataE=Reports.find(busqueda).fetch();
      DataE.forEach(DataReports => {
        var _idReport=DataReports._id;
        var salidaOficial=DataReports.salidaOficial;
        var _idEmployee=DataReports._idEmployee;
        var fecha=DataReports.fecha;
        var crearET=crearExtraTime(DataReports.inicioOficial,salidaOficial,DataReports.primerRegistro,DataReports.ultimoRegistro);
        if(crearET){
          var Existsextra={ "_idEmployee":_idEmployee, "fecha" : fecha };
          var DataExtraTime=Extra_time.findOne(Existsextra);
          if(DataExtraTime==undefined){
            var create=fecha.split("/")[2]+"-"+fecha.split("/")[1]+"-"+fecha.split("/")[0];
            var extra={
              "_idEmployee" : _idEmployee,
              "employeeName" : DataReports.employeeName,
              "idEmployee" :DataReports.idEmployee,
              "idDepartment" : DataReports.idDepartment,
              "idDepartment_txt" :DataReports.idDepartment_txt,
              "idLocation" : DataReports.idLocation,
              "idLocation_txt" :DataReports.idLocation_txt,
              "idcompany" :  DataReports.idcompany,
              "fecha" : fecha,
              "inicioOficial" :DataReports.inicioOficial,
              "salidaOficial" : DataReports.salidaOficial,
              "tiempoOficial" :returnHours(DataReports.inicioOficial, DataReports.salidaOficial),
              "inicioLaborado" : DataReports.primerRegistro,
              "salidaLaborado" : DataReports.ultimoRegistro,
              "tiempoLaborado" : returnHours(DataReports.primerRegistro, DataReports.ultimoRegistro),
              "hrsLaborado" : returnHours(DataReports.primerRegistro, DataReports.ultimoRegistro).split(":")[0],
              "minLaborado" : returnHours(DataReports.primerRegistro, DataReports.ultimoRegistro).split(":")[1],
              "createdAt" :moment(create+ "T12:00:00").hour(12).minutes(0).seconds(0).toDate()
            };
            logAccesos.info("Insertando en Tiempo Extra "+JSON.stringify(extra));
            Extra_time.direct.insert(extra,function(err,res){
              if(err){
                logErrores.info("insert "+err);
              }
            });
          }
        }
      });
    }
    logReport.info("Proceso terminado");
  }
});
