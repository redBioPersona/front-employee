getEmpleadoById = function(userId) {
    var res = Meteor.users.findOne({
        _id: userId
    });
    var empleado = undefined;
    //  console.log("Meteor.users.findOne:" + JSON.stringify(res));
    if (res && res.profile && res.profile.empleado) {
        //  console.log("res.profile:" + JSON.stringify(res.profile));
        //  console.log("res.profile.empleado:" + JSON.stringify(res.profile.empleado));
        var empleadoId = res.profile.empleado;
        empleado = Empleados.findOne({
            _id: empleadoId
        });
    } else {
        console.log("getEmpleadoById: EMPLEADO NO ENCONTRADO: UserId:" + userId);
        return undefined;
    }
    return empleado;
}


///////////////////////////////
// SELECTORES
///////////////////////////////

getUserProcessByUserId = function(userId) {
    var empleado = getEmpleadoById(userId);
    if (empleado) {
        var empProcesos = Empprocesos.find({
            emp_id: empleado._id
        });
        var procId = empProcesos.proc_id;
        //    console.log("procId:" + procId);
        return procId;
    } else {
        return undefined;
    }
}


simpleStringifyx = function(object) {
    var simpleObject = {};
    for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
            continue;
        }
        if (typeof(object[prop]) == 'object') {
            continue;
        }
        if (typeof(object[prop]) == 'function') {
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};


getUserProcessesByUserId = function(userId) {
    var empleado = getEmpleadoById(userId);
    if (empleado) {
        var empProcesos = Empprocesos.find({
            emp_id: empleado._id
        }).fetch();
        var procId = _.pluck(empProcesos, 'proc_id');
        //    console.log("procId:" + procId);
        return procId;

    } else {
        return undefined;
    }
}

mySelectorByActive = function(userId) {
    // console.log("mySelectorPorProcesoySG userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}
    } else {
        return {
            active: true
        }
    }
};


mySelectorPorProcesoySG = function(userId) {
    // console.log("mySelectorPorProcesoySG userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}
    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            procId = [];
        }
    };

    procId.push(Procesos.findOne({
        proc_nombre: "Sistema de Gestión"
    })._id);

    return {
        active: true,
        proc_id: {
            $in: procId
        }
    }
}


mySelectorPorUsuario = function(userId) {
    // console.log("mySelectorPorProcesoySG userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}
    } else {


        return {
            active: true,
            createdBy: userId
        }
    }
}

toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

mySelectorPorUsuarioYasignadoYowner = function(userId) {

  if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}
    }
    var empleado = getEmpleadoById(userId);
    var procidList = getUserProcessesByUserId(userId);
    var modulo = Modulos.findOne({
        mod_nombre: Mongo.Collection.get(this.name.replace("tabular_","")).title
    });

//    console.log("modulo:" + JSON.stringify(modulo));
//    console.log("empleado:" + JSON.stringify(empleado));
//    console.log("procidList:" + JSON.stringify(procidList));

    if (modulo != undefined && procidList != [] && empleado != undefined) {
        var rolpermisosList = Rolpermisos.find({
            mod_id: modulo._id,
            proc_id: {
                $in: procidList
            }, active:true
        }).fetch();
//        console.log("rolpermisosList:"+JSON.stringify(rolpermisosList));
//          console.log("rolpermisosListprocs::"+JSON.stringify( _.pluck(rolpermisosList,"proc_id")));
//console.log("emp_id:" +empleado._id);
        if (rolpermisosList && rolpermisosList.length > 0) {
            var empProcesosList = Empprocesos.find({
                emp_id: empleado._id,
                proc_id: { $in: _.pluck(rolpermisosList,"proc_id")
                },
                epp_tiporol: "Dueño" ,active:true
            }).fetch();
  //          console.log("empProcesosList:"+JSON.stringify(empProcesosList));


            if (empProcesosList && empProcesosList.length > 0) {
            //    console.log("Empleado:" + empleado._id + " Proceso:" + empProcesosList[0].proc_id_txt + " rol:" + empProcesosList[0].epp_tiporol);
                return {active: true};
            }
            return {
                $or: [{
                    emp_id: empleado._id,
                    active: true
                }, {
                    createdBy: userId,
                    active: true
                }]
            };
        }
    }
    return {
        createdBy: userId,
        active: true
    };

}

myFilterPorUsuarioYasignadoYowner = function(userId,modulo_nombre) {

  if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}
    }
    var empleado = getEmpleadoById(userId);
    var procidList = getUserProcessesByUserId(userId);
    var modulo = Modulos.findOne({
        mod_nombre: modulo_nombre //Mongo.Collection.get("prospectos").title
    });

    if (modulo != undefined && procidList != [] && empleado != undefined) {
        var rolpermisosList = Rolpermisos.find({
            mod_id: modulo._id,
            proc_id: {
                $in: procidList
            }, active:true
        }).fetch();
        if (rolpermisosList && rolpermisosList.length > 0) {
            var empProcesosList = Empprocesos.find({
                emp_id: empleado._id,
                proc_id: { $in: _.pluck(rolpermisosList,"proc_id")
                },
                epp_tiporol: "Dueño" ,active:true
            }).fetch();
            if (empProcesosList && empProcesosList.length > 0) {
            //    console.log("Empleado:" + empleado._id + " Proceso:" + empProcesosList[0].proc_id_txt + " rol:" + empProcesosList[0].epp_tiporol);
                return {active: true};
            }
            return {
                $or: [{
                    emp_id: empleado._id,
                    active: true
                }, {
                    createdBy: userId,
                    active: true
                }]
            };
        }
    }
    return {
        createdBy: userId,
        active: true
    };
}


myFilterPorUsuarioYasignadoYownerProyecto = function(userId) {

  if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}
    }
    var empleado = getEmpleadoById(userId);
    var procidList = getUserProcessesByUserId(userId);
    var modulo = Modulos.findOne({
        mod_nombre: 'Proyectos' //Mongo.Collection.get("prospectos").title
    });

    if (modulo != undefined && procidList != [] && empleado != undefined) {
        var rolpermisosList = Rolpermisos.find({
            mod_id: modulo._id,
            proc_id: {
                $in: procidList
            }, active:true
        }).fetch();
        if (rolpermisosList && rolpermisosList.length > 0) {
            var empProcesosList = Empprocesos.find({
                emp_id: empleado._id,
                proc_id: { $in: _.pluck(rolpermisosList,"proc_id")
                },
                epp_tiporol: "Dueño" ,active:true
            }).fetch();
            if (empProcesosList && empProcesosList.length > 0) {
                return {active: true};
            }
            var proyectosList=Proyectos.find(
             {
                $or: [{
                    emp_id: empleado._id,
                    active: true
                }, {
                    createdBy: userId,
                    active: true
                }]
            }).fetch();
    return({ active: true,_id: { $in: _.pluck(proyectosList,'_id')  }})
        }
    }
    var proyectosList=Proyectos.find( {
        createdBy: userId,
        active: true
    }).fetch();

    return({ active: true,_id: { $in: _.pluck(proyectosList,'_id')  }})
}

myFilterPorUsuarioYasignadoYownerProspectos = function(userId) {

  if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}
    }
    var empleado = getEmpleadoById(userId);
    var procidList = getUserProcessesByUserId(userId);
    var modulo = Modulos.findOne({
        mod_nombre: 'Prospectos' //Mongo.Collection.get("prospectos").title
    });

    if (modulo != undefined && procidList != [] && empleado != undefined) {
        var rolpermisosList = Rolpermisos.find({
            mod_id: modulo._id,
            proc_id: {
                $in: procidList
            }, active:true
        }).fetch();
        if (rolpermisosList && rolpermisosList.length > 0) {
            var empProcesosList = Empprocesos.find({
                emp_id: empleado._id,
                proc_id: { $in: _.pluck(rolpermisosList,"proc_id")
                },
                epp_tiporol: "Dueño" ,active:true
            }).fetch();
            if (empProcesosList && empProcesosList.length > 0) {
                return {active: true};
            }
            var proyectosList=Prospectos.find(
             {
                $or: [{
                    emp_id: empleado._id,
                    active: true
                }, {
                    createdBy: userId,
                    active: true
                }]
            }).fetch();
    return({ active: true,_id: { $in: _.pluck(proyectosList,'_id')  }})
        }
    }
    var proyectosList=Prospectos.find( {
        createdBy: userId,
        active: true
    }).fetch();

    return({ active: true,_id: { $in: _.pluck(proyectosList,'_id')  }})
}

mySelectorPorProceso = function(userId) {
    //  console.log("mySelectorPorProceso userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}

    } else {
        var procsId = getUserProcessesByUserId(userId);
        if (!procsId || procsId == []) {
            return false;
        }

        return {
            active: true,
            proc_id: {
                $in: procsId

            }
        }
    }
};



mySelectorPorProcesoProcesos = function(userId) {
    //  console.log("mySelectorPorProceso userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}

    } else {
        var procsId = getUserProcessesByUserId(userId);
        if (!procsId || procsId == []) {
            return false;
        }

        return {
            active: true,
            _id: {
                $in: procsId

            }
        }
    }
};

filterByProcAcp = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;
        }

        var acpList = Accionescorrectprev.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();

        if (!acpList || acpList == []) {
            return false;
        }

        return {
            active: true,
            _id: {
                $in: _.pluck(acpList, "_id")
            }
        }
    }
};

mySelectorPorProcesoAcp = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        }

        var acpList = Accionescorrectprev.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();

        if (!acpList || acpList == []) return false;

        return {
            active: true,
            acp_id: {
                $in: _.pluck(acpList, "_id")
            }
        }
    }
};


mySelectorPorEvidReunion = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {

        return {
            active: true,
            createdBy: userId
        }
    }
};


filterPorEvidReunion = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {
        var empleado = getEmpleadoById(userId);

        if (empleado) {
            return {
                active: true,
                emp_id: {
                    $in: [empleado._id]
                }
            };
        } else {
            console.log("!empleado:userId:" + userId);
            return false;
        }
    }
};

mySelectorPorEvidResultAcuerdo = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {
        var empleado = getEmpleadoById(userId);

        if (empleado) {
            minutadetallesList = Minutadetalles.find({
                emp_id: empleado._id
            }).fetch();

            if (minutadetallesList && minutadetallesList.length > 0) {
                return {
                    active: true,
                    min_id: {
                        $in: _.pluck(minutadetallesList, '_id')
                    }
                };
            }
        }
        return false;

    }
};

filterEvidResultAcuerdo = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {
        var empleado = getEmpleadoById(userId);

        if (empleado) {
            return {
                active: true,
                emp_id: empleado._id
            }
        } else {
            return false;

        }
    }
};


mySelectorPorProcesoDetalleAcp = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        }

        var acpList = Accionescorrectprev.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();

        if (!acpList || acpList == []) return false;


        var detAcpList = Detalleaccionescp.find({
            "acp_id": {
                $in: _.pluck(acpList, "_id")
            }
        }).fetch();

        if (!detAcpList || detAcpList == []) return false;


        return {
            active: true,
            dac_id: {
                $in: _.pluck(detAcpList, "_id")
            }
        }
    }
};

filterByProcDetAcp = function(userId) {
  //  console.log("filterByProcDetAcp userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
  //    console.log("isadmin");
        return {}
    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        }

        var acpList = Accionescorrectprev.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();

        if (!acpList || acpList == []) return false;

        var detAcpList = Detalleaccionescp.find({
            "acp_id": {
                $in: _.pluck(acpList, "_id")
            }
        }).fetch();

        if (!detAcpList || detAcpList == []) return false;


        return {
            active: true,
            _id: {
                $in: _.pluck(detAcpList, "_id")
            }
        }
    }
};

mySelectorPorProcesoInvInf = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;
        };

        var infraList = Infraestructuras.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();

        if (!infraList || infraList == []) return false;

        return {
            active: true,
            inf_id: {
                $in: _.pluck(infraList, "_id")
            }
        }

    }
};

mySelectorPorProcesoMntInf = function(userId) {
    //  console.log("mySelectorPorProcesoMntInf userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        };

        var infraList = Infraestructuras.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();

        if (!infraList || infraList == []) return false;


        var progmtsList = Programamtosinf.find({
            "inf_id": {
                $in: _.pluck(infraList, "_id")
            }
        }).fetch();

        if (!progmtsList || progmtsList == []) return false;

        return {
            active: true,
            pmt_id: {
                $in: _.pluck(progmtsList, "_id")
            }
        }

    }
};

mySelectorPorProcesoEvidMntInf = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) return false;


        var infraList = Infraestructuras.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();

        if (!infraList || infraList == []) return false;

        //console.log("infraList:"+_.pluck(infraList,"_id"));


        var progmtsList = Programamtosinf.find({
            "inf_id": {
                $in: _.pluck(infraList, "_id")
            }
        }).fetch();

        if (!progmtsList || progmtsList == []) return false;

        //console.log("progmtsList:"+_.pluck(progmtsList,"_id"));

        var mantinfList = Mantenimientosinf.find({
            "pmt_id": {
                $in: _.pluck(progmtsList, "_id")
            }
        }).fetch();

        if (!mantinfList || mantinfList == []) return false;
        //      console.log("mantinfList:"+_.pluck(mantinfList,"_id"));
        return {
            active: true,
            mti_id: {
                $in: _.pluck(mantinfList, "_id")
            }
        }

    }
};


mySelectorPorProcesoObj = function(userId) {
    //  console.log("mySelectorPorProcesoObj userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);


        var objetivosProcList = Objetivos.find({
            proc_id: {
                $in: procId
            }
        }).fetch();


        return {
            active: true,
            obj_id: {
                $in: _.pluck(objetivosProcList, "_id")
            }
        }
    }
};


mySelectorPorProcesoEvalObj = function(userId) {
    //  console.log("mySelectorPorProcesoObj userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        };

        var objetivosProcList = Objetivos.find({
            proc_id: {
                $in: procId
            }
        }).fetch();

        if (!objetivosProcList || (objetivosProcList && objetivosProcList == [])) return false;

        var evaloOjetivosProcList = Evalobjetivos.find({
            obj_id: {
                $in: _.pluck(objetivosProcList, "_id")
            }
        }).fetch();

        if (!evaloOjetivosProcList || (evaloOjetivosProcList && evaloOjetivosProcList == [])) return false;


        return {
            active: true,
            evo_id: {
                $in: _.pluck(evaloOjetivosProcList, "_id")
            }
        }
    }
};


mySelectorPorProcesoEvidDocs = function(userId) {
    //console.log("mySelectorPorProcesoEvidDocs userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        };

        var documentosoficialesList = Documentosoficiales.find({
            proc_id: {
                $in: procId
            }
        }).fetch();

        return {
            active: true,
            doc_id: {
                $in: _.pluck(documentosoficialesList, "_id")
            }
        }
    }
};

mySelectorPorUsuario = function(userId) {
    //  console.log("mySelectorPorUsuario userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //    console.log("I am admin");
        return {}

    } else {

        return {
            active: true,
            createdBy: userId,
        }
    }
};

mySelectorPorUsuarioParaMi = function(userId) {
    //  console.log("mySelectorPorUsuario userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //    console.log("I am admin");
        return {}

    } else {
        var user = Meteor.users.findOne({
            _id: userId
        });
        //     console.log("user:" + JSON.stringify(user));
        if (user && user.profile && user.profile.empleado) {
            var empleado = Empleados.findOne(user.profile.empleado);
            if (empleado) {
                return {
                    active: true,
                    emp_id: empleado._id,
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

mySelectorPorProcesoEvidEval = function(userId) {
    //  console.log("mySelectorPorProcesoEvidEval userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        };

        var objetivosProcList = Objetivos.find({
            proc_id: {
                $in: procId
            }
        }).fetch();

        //      console.log("objetivosProcList:" + _.pluck(objetivosProcList,"_id"));

        var evalObjetivosProcList = Evalobjetivos.find({
            obj_id: {
                $in: _.pluck(objetivosProcList, "_id")
            }
        }).fetch();

        //      console.log("evalObjetivosProcList:" + _.pluck(evalObjetivosProcList,"_id"));

        return {
            active: true,
            evo_titulo_id: {
                $in: _.pluck(evalObjetivosProcList, "_id")
            }

        }
    }
};

///////////////////////////////
// FILTROS
///////////////////////////////
filterByOwnerUser = function(userId) {
    //  console.log("filterByOwnerUser userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //    console.log("I am admin");
        return {}

    } else {

        return {
            active: true,
            createdBy: userId,
        }
    }
};

filterByProcObj = function(userId) {
    //  console.log("filterByProcObj userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        };

        var objetivosProcList = Objetivos.find({
            proc_id: {
                $in: procId
            }
        }).fetch();


        return {
            active: true,
            _id: {
                $in: _.pluck(objetivosProcList, "_id")
            }
        }
    }
};

filterByProcEvalObj = function(userId) {
    //  console.log("filterByProcEvalObj userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //   console.log("am admin");
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;
        };

        var objetivosProcList = Objetivos.find({
            proc_id: {
                $in: procId
            }
        }).fetch();

        if (!objetivosProcList || objetivosProcList == []) {
            return false;
        }

        var evalobjList = Evalobjetivos.find({
            obj_id: {
                $in: _.pluck(objetivosProcList, "_id")
            }
        }).fetch();

        if (!evalobjList || evalobjList == []) {
            return false;

        }


        return {
            active: true,
            _id: {
                $in: _.pluck(evalobjList, "_id")
            }
        }
    }
};

filterByOwnerUserAndPorRevisar = function(userId) {
    //  console.log("filterByOwnerUserAndPorRevisar userId:" + userId);
    if (Roles.userHasRole(userId, "admin") == true) {
        //    console.log("I am admin");
        return {}

    } else {
        var porRevisarList = Documentos.find({
            "createdBy": userId,
            "doc_status": {
                $in: ["Por Revisar", "En Revisión"]
            }
        }).fetch();
        console.log("porRevisarList:" + porRevisarList);
        var porRevisarListIds = _.pluck(porRevisarList, "_id");
        console.log("porRevisarListIds:" + porRevisarListIds);
        return {
            _id: {
                $in: porRevisarListIds
            },
            active: true,
            createdBy: userId,
        }
    }
};


filterByEmpUserProcessAndAltaDir = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        }
        procId.push(Procesos.findOne({
            proc_nombre: "Alta Dirección"
        })._id);
        var empProcesosList = Empprocesos.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();
        var empleadosList = _.pluck(empProcesosList, "emp_id");
        return {
            active: true,
            _id: {
                $in: empleadosList
            }
        }
    }
};

filterByEmpUserProcessInvFact = function(userId) {
    {
        var procId = [];
        var proc = Procesos.findOne({
            proc_nombre: "Infraestructura de Operación"
        });
        if (proc) {
            procId.push(proc._id);
        }
        proc = Procesos.findOne({
            proc_nombre: "Infraestructura de Producción"
        });
        if (proc) {
            procId.push(proc._id);
        }
        proc = Procesos.findOne({
            proc_nombre: "Infraestructura para Calibración"
        });

        if (proc) {
            procId.push(proc._id);
        }
        proc = Procesos.findOne({
            proc_nombre: "Infraestructura del Inmueble"
        });
        if (proc) {
            procId.push(proc._id);
        }

        proc = Procesos.findOne({
            proc_nombre: "Infraestructura Tecnológica"
        });

        if (proc) {
            procId.push(proc._id);
        }

        var empProcesosList = Empprocesos.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();
        var empleadosList = _.pluck(empProcesosList, "emp_id");
        return {
            active: true,
            _id: {
                $in: empleadosList
            }
        }
    }
};


filterByEmpUserProcess = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) return false;

        var empProcesosList = Empprocesos.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();

        if (!empProcesosList || empProcesosList == []) return false;


        var empleadosList = _.pluck(empProcesosList, "emp_id");
        return {
            active: true,
            _id: {
                $in: empleadosList
            }
        }
    }
};

filterByInfUserProcess = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) return false;




        return {
            active: true,
            proc_id: {
                $in: procId
            }
        }
    }
};

filterMyMmtInfProcess = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {
            return false;

        };

        var infraList = Infraestructuras.find({
            "proc_id": {
                $in: procId
            }
        }).fetch();

        if (!infraList || infraList == []) return false;

        var progmtsList = Programamtosinf.find({
            "inf_id": {
                $in: _.pluck(infraList, "_id")
            }
        }).fetch();

        if (!progmtsList || progmtsList == []) return false;


        var filterResultList = Mantenimientosinf.find({
            "pmt_id":  { $in: _.pluck(progmtsList, "_id") }
        }).fetch();

        return {
            active: true,
            _id: {
                $in: _.pluck(filterResultList, "_id")
            }
        }
    }
};

filterByProcUserProcess = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}

    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) return false;


        return {
            active: true,
            _id: {
                $in: procId
            }
        }
    }
};

filterByProcess = function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
        return {}
    } else {
        var procId = getUserProcessesByUserId(userId);
        if (!procId || procId == []) {return false;}
        var acpList = Accionescorrectprev.find({"proc_id": {$in: procId}}).fetch();
        if (!acpList || acpList == []) {return false;}
        return {
            active: true,
            _id: {$in: _.pluck(acpList, "proc_id")}
        }
    }
};

Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
  });

getting_Process= function(userId) {
    if (Roles.userHasRole(userId, "admin") == true) {
      var datos=Procesos.find().fetch();
      var result=[];
      if (Object.keys(datos).length!=0) {
        for (var i = 0; i < datos.length; i++) {
          var id=datos[i]._id;
          result[i]=id;
        }
      }
      return result;
    } else {
      var filterData = Mongo.Collection.get("users").findOne({_id:userId});
      var _idEmployee=filterData.profile.empleado;
      var data=Empprocesos.find({emp_id:_idEmployee}).fetch();
      if (Object.keys(data).length!=0) {
        var proceso_asociado=[];
        for (var i = 0; i < data.length; i++) {
          var proc_id=data[i].proc_id;
          proceso_asociado[i]=proc_id;
        }
      }
      return proceso_asociado.unique();
    }
};
