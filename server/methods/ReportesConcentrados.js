Meteor.methods({
    generarReporteConcentrado: function (Inicio, Fin, Company, ByEmployee) {
        this.unblock();
        var InicioIsValid = moment(Inicio, 'YYYY-MM-DD', true).isValid();
        var FinIsValid = moment(Fin, 'YYYY-MM-DD', true).isValid();
        logReport.info("Iniciando el proceso generarReporteConcentrado");
        if (InicioIsValid && FinIsValid) {
            var FechaIsBefore = moment(Inicio).isBefore(Fin);
            var FechaIsSame = moment(Inicio).isSame(Fin);
            if (FechaIsBefore || FechaIsSame) {
                var isServer = Config_application.findOne({
                    "isServer": false
                });
                var tipoEstacion = isServer == undefined ? "Servidor" : "Estacion";
                logReport.info("Tipo de estacion " + tipoEstacion);
                logReport.info("Inicio " + Inicio + " Fin " + Fin);
                if (tipoEstacion == "Servidor") {
                    var CicloInicio = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
                    var CicloFin = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
                    var CicloInicioES = moment(CicloInicio).format('DD/MM/YYYY');
                    var CicloFinES = moment(CicloFin).format('DD/MM/YYYY');

                    var busqueda = {};
                    busqueda["idEmpStatus"] = { "$nin": ["3eRz4SNtFFWbtmYBf","gz76JMkmN6pjS6fqF"] };
                    if (ByEmployee != undefined) {
                        ReportsConcentrados.remove({_idEmployee:ByEmployee});
                        logReport.info("Falso positivo para el empleado " + ByEmployee);
                        busqueda["_id"] = ByEmployee;
                    } else {
                        if (Company != undefined) {                            
                            var abc = [];
                            abc.push(Company);
                            ReportsConcentrados.remove({idcompany: {"$in": abc}});
                            busqueda["idcompany"] = {
                                "$in": abc
                            };
                        }
                    }
                    var DataPersons = Persons.find(busqueda,{sort:{employeeName:1}}).fetch();
                    DataPersons.forEach(dataPerson => {
                        var _idEmployee = dataPerson._id;
                        var faltas = Reports.find({
                            $and: [
                                { "_idEmployee": _idEmployee },
                                { "estatus": "Falta" },
                                { "fechaIni": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).count();

                        var retardos=Reports.find({
                            $and: [
                                { "_idEmployee": _idEmployee },
                                { "estatus": {$in:["Retardo Normal", "Retardo Mayor", "Retardo Menor"]} },
                                { "fechaIni": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).count();

                        var registros=Accesscontrol.find({
                            $and: [
                                { "idEmployee": _idEmployee },
                                { "firstAccess": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).count();

                        var excepciones=Reports.find({
                            $and: [
                                { "_idEmployee": _idEmployee },
                                { "excepcion" : "Si"},
                                { "fechaIni": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).count();

                        var anticipadas=Reports.find({
                            $and: [
                                { "_idEmployee": _idEmployee },
                                { "antes" : "true"},
                                { "fechaIni": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).count();

                        var vacaciones=Vacations.find({
                            $and: [
                                { "idEmployee": _idEmployee },
                                { "fechaIni": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).count();

                        var permisos=Permisos.find({
                            $and: [
                                { "idEmployee": _idEmployee },
                                { "fechaIni": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).count();

                        var justificantes=Justificantes.find({
                            $and: [
                                { "idEmployee": _idEmployee },
                                { "createdAt": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).count();

                        var tickets=Tickets.find({
                            $and: [
                                { "_idEmployee": _idEmployee },
                                { "createdAt": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).count();
                        
                        var time_extra=Extra_time.find({
                            $and: [
                                { "_idEmployee": _idEmployee },
                                { "createdAt": { $gte: CicloInicio, $lte: CicloFin } }
                            ]
                        }).fetch();

                        var extra_time="00:00";
                        var extra_reg=time_extra.length;
                        var minutos=0;
                        time_extra.forEach(elementExtra => {
                            var minutos_inicio = elementExtra.tiempoOficial.split(':')
                            .reduce((p, c) => parseInt(p) * 60 + parseInt(c));
                            var minutos_final = elementExtra.tiempoLaborado.split(':')
                            .reduce((p, c) => parseInt(p) * 60 + parseInt(c));
                            var diff=minutos_final-minutos_inicio;
                            minutos+=diff;
                        });
                        if(minutos!=0){
                            var hours = Math.floor(minutos/ 60);          
                            var minutes = minutos % 60;
                            extra_time=setDateZero(hours)+":"+setDateZero(minutes);
                        }
                        var regInsertar = {
                            _idEmployee: _idEmployee,
                            idEmployee: dataPerson.idEmployee,
                            employeeName: dataPerson.employeeName,
                            idEmpPosition: dataPerson.idEmpPosition,
                            idEmpPosition_txt: dataPerson.idEmpPosition_txt,
                            idEmpStatus: dataPerson.idEmpStatus,
                            idEmpStatus_txt: dataPerson.idEmpStatus_txt,
                            idcompany: dataPerson.idcompany,
                            idcompany_txt: GetcompanyName(dataPerson.idcompany[0]),
                            idDepartment: dataPerson.idDepartment,
                            idDepartment_txt: dataPerson.idDepartment_txt,
                            idLocation: dataPerson.idLocation,
                            idLocation_txt: dataPerson.idLocation_txt,
                            idmanager: dataPerson.idmanager,
                            idmanager_txt: dataPerson.idmanager_txt,
                            idpagadora:dataPerson.idpagadora,
                            idpagadora_txt:dataPerson.idpagadora_txt,
                            idDireccion:dataPerson.idDireccion,
                            idDireccion_txt:dataPerson.idDireccion_txt,
                            idProyecto:dataPerson.idProyecto,
                            idProyecto_txt:dataPerson.idProyecto_txt,
                            idArea:dataPerson.idArea,
                            idArea_txt:dataPerson.idArea_txt,
                            fechaIni: CicloInicio,
                            fechaIni_txt: CicloInicioES,
                            fechaFin: CicloFin,
                            fechaFin_txt: CicloFinES,
                            faltas: faltas,
                            retardos:retardos,
                            registros:registros,
                            excepciones:excepciones,
                            anticipadas:anticipadas,
                            vacaciones:vacaciones,
                            permisos:permisos,
                            justificantes:justificantes,
                            tickets:tickets,
                            extra_reg:extra_reg,
                            extra_time:extra_time
                        };
                        var existsReportsConcentrados = ReportsConcentrados.findOne({
                            _idEmployee: _idEmployee
                        });
                        if (existsReportsConcentrados) {
                            ReportsConcentrados.update({ _id: existsReportsConcentrados._id }, {
                                $set: regInsertar
                            }, function (err, res) {
                                if (err) {
                                    logErrores.info("Error en ReportsConcentrados, update " + err);
                                }
                            });
                        } else {
                            ReportsConcentrados.insert(regInsertar, function (err, res) {
                                if (err) {
                                    logErrores.error("Err al insertar en ReportsConcentrados, el dato " + JSON.stringify(regInsertar) + " causa " + err);
                                }
                            });
                        }
                    });
                }
            } else {
                console.log("La fecha del primer argumento debe ser menor o igual que el segundo arg");
            }
        } else {
            console.log("Fechas No validas");
        }
        logReport.info("Termino el proceso generarReporteConcentrado");
    }
});