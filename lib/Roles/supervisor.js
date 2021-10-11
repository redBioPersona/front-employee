RoleSupervisor = new Roles.Role('Supervisor');

RoleSupervisor.allow('principal_template', true);
RoleSupervisor.allow('ajustes_template', true);
RoleSupervisor.allow('administrar_notificaciones_template', true);
RoleSupervisor.allow('administrar_enrolamientos_template', true);
RoleSupervisor.allow('administrar_perfil_company_template', true);
RoleSupervisor.allow('administrar_estadisticos_template', true);
RoleSupervisor.allow('administrar_accesos_template', true);
RoleSupervisor.allow('administrar_empleados_template', true);
RoleSupervisor.allow('administrar_politicas_template', true);
//RoleSupervisor.allow('administrar_dispositivos_template', true);
RoleSupervisor.allow('administrar_puentes_template', true);
RoleSupervisor.allow('administrar_documentos_template', true);
RoleSupervisor.allow('administrar_estaciones_template', true);

RoleSupervisor.allow('collections.Searchingdate.insert', true);
RoleSupervisor.allow('collections.Searchingdate.update', true);
RoleSupervisor.allow('collections.Searchingdate.remove', true);
RoleSupervisor.allow('filesystem.upload', true);

//GRAFICAS
// RoleSupervisor.allow('collections.porcentajes.index', true);
// RoleSupervisor.helper('collections.porcentajes.indexFilter', {});
RoleSupervisor.allow('collections.grafica_deptos.index', true);
RoleSupervisor.helper('collections.grafica_deptos.indexFilter', {});
RoleSupervisor.allow('collections.grafica_extra_time.index', true);
RoleSupervisor.helper('collections.grafica_extra_time.indexFilter', {});

//Enrolamientos
// RoleSupervisor.allow('collections.create_enroll.index', true);
// RoleSupervisor.helper('collections.create_enroll.indexFilter', {});
RoleSupervisor.allow('collections.enrollments.index', true);
RoleSupervisor.helper('collections.enrollments.indexFilter', {});

//ADMINISTRAR ACCESOS
RoleSupervisor.allow('collections.accesscontrol.index', true);
RoleSupervisor.helper('collections.accesscontrol.indexFilter', {});
RoleSupervisor.allow('collections.accessdetails.index', true);
RoleSupervisor.helper('collections.accessdetails.indexFilter', {});
RoleSupervisor.allow('collections.meal_times.index', true);
RoleSupervisor.helper('collections.meal_times.indexFilter', {});
RoleSupervisor.allow('collections.reports.index', true);
RoleSupervisor.helper('collections.reports.indexFilter', {});
RoleSupervisor.allow('collections.tickets.index', true);
RoleSupervisor.helper('collections.tickets.indexFilter', {});
RoleSupervisor.allow('collections.reports_emp.index', true);
RoleSupervisor.helper('collections.reports_emp.indexFilter', {});
RoleSupervisor.allow('collections.extra_time.index', true);
RoleSupervisor.helper('collections.extra_time.indexFilter', {});

//ADMINISTRAR EMPLEADOS
RoleSupervisor.allow('collections.employeestatuses.index', true);
RoleSupervisor.helper('collections.employeestatuses.indexFilter', {});

RoleSupervisor.allow('collections.days.index', true);
RoleSupervisor.helper('collections.days.indexFilter', {});

RoleSupervisor.allow('collections.persons.index', true);
RoleSupervisor.helper('collections.persons.indexFilter', {});
RoleSupervisor.allow('collections.persons.update', true);
RoleSupervisor.allow('collections.persons.remove', true);


// POLITICAS Y HORARIOS
RoleSupervisor.allow('collections.sanciones.index', true);
RoleSupervisor.helper('collections.sanciones.indexFilter', {});
RoleSupervisor.allow('collections.sanciones.insert', true);
RoleSupervisor.allow('collections.sanciones.update', true);
RoleSupervisor.allow('collections.sanciones.remove', true);


RoleSupervisor.allow('collections.reglas_retardos.index', true);
RoleSupervisor.helper('collections.reglas_retardos.indexFilter', {});
RoleSupervisor.allow('collections.reglas_retardos.insert', true);
RoleSupervisor.allow('collections.reglas_retardos.update', true);
RoleSupervisor.allow('collections.reglas_retardos.remove', true);

RoleSupervisor.allow('collections.reglas_alimentos.index', true);
RoleSupervisor.helper('collections.reglas_alimentos.indexFilter', {});
RoleSupervisor.allow('collections.reglas_alimentos.insert', true);
RoleSupervisor.allow('collections.reglas_alimentos.update', true);
RoleSupervisor.allow('collections.reglas_alimentos.remove', true);

RoleSupervisor.allow('collections.horarios.index', true);
RoleSupervisor.helper('collections.horarios.indexFilter', {});
RoleSupervisor.allow('collections.horarios.insert', true);
RoleSupervisor.allow('collections.horarios.update', true);
RoleSupervisor.allow('collections.horarios.remove', true);



// PERFILES DE LA COMPAÑIA
RoleSupervisor.allow('collections.locations.index', true);
RoleSupervisor.helper('collections.locations.indexFilter', {});
RoleSupervisor.allow('collections.pagadoras.index', true);
RoleSupervisor.helper('collections.pagadoras.indexFilter', {});
RoleSupervisor.allow('collections.reportsconcentrados.index', true);
RoleSupervisor.helper('collections.reportsconcentrados.indexFilter', {});
RoleSupervisor.allow('collections.direcciones.index', true);
RoleSupervisor.helper('collections.direcciones.indexFilter', {});
RoleSupervisor.allow('collections.areas.index', true);
RoleSupervisor.helper('collections.areas.indexFilter', {});
RoleSupervisor.allow('collections.proyectos.index', true);
RoleSupervisor.helper('collections.proyectos.indexFilter', {});
RoleSupervisor.allow('collections.jefes.index', true);
RoleSupervisor.helper('collections.jefes.indexFilter', {});

RoleSupervisor.allow('collections.departments.index', true);
RoleSupervisor.helper('collections.departments.indexFilter', {});
RoleSupervisor.allow('collections.departments.insert', true);
RoleSupervisor.allow('collections.departments.update', true);
RoleSupervisor.allow('collections.departments.remove', true);

RoleSupervisor.allow('collections.employeespositions.index', true);
RoleSupervisor.helper('collections.employeespositions.indexFilter', {});
RoleSupervisor.allow('collections.employeespositions.insert', true);
RoleSupervisor.allow('collections.employeespositions.update', true);
RoleSupervisor.allow('collections.employeespositions.remove', true);

RoleSupervisor.allow('collections.restaurants.index', true);
RoleSupervisor.helper('collections.restaurants.indexFilter', {});
RoleSupervisor.allow('collections.restaurants.insert', true);
RoleSupervisor.allow('collections.restaurants.update', true);
RoleSupervisor.allow('collections.restaurants.remove', true);


// ESTATUS DE LOS Dispositivos
RoleSupervisor.allow('collections.devices.index', true);
RoleSupervisor.helper('collections.devices.indexFilter', {});
RoleSupervisor.allow('collections.cameras.index', true);
RoleSupervisor.helper('collections.cameras.indexFilter', {});
RoleSupervisor.allow('collections.microphone.index', true);
RoleSupervisor.helper('collections.microphone.indexFilter', {});
RoleSupervisor.allow('collections.iris.index', true);
RoleSupervisor.helper('collections.iris.indexFilter', {});

RoleSupervisor.allow('collections.prints.index', true);
RoleSupervisor.helper('collections.prints.indexFilter', {});

// DIAS NO LABORABLES
RoleSupervisor.allow('collections.vacations.index', true);
RoleSupervisor.helper('collections.vacations.indexFilter', {});
RoleSupervisor.allow('collections.vacations.insert', true);


RoleSupervisor.allow('collections.permisos.index', true);
RoleSupervisor.helper('collections.permisos.indexFilter', {});
RoleSupervisor.allow('collections.permisos.insert', true);


RoleSupervisor.allow('collections.feriados.index', true);
RoleSupervisor.helper('collections.feriados.indexFilter', {});
RoleSupervisor.allow('collections.feriados.insert', true);


RoleSupervisor.allow('collections.incidencias.index', true);
RoleSupervisor.helper('collections.incidencias.indexFilter', {});
RoleSupervisor.allow('collections.incidencias.insert', true);
RoleSupervisor.allow('collections.incidencias.update', true);
RoleSupervisor.allow('collections.incidencias.remove', true);

RoleSupervisor.allow('collections.justificantes.index', true);
RoleSupervisor.helper('collections.justificantes.indexFilter', {});


//DOCUMENTOS
RoleSupervisor.allow('collections.documents.index', true);
RoleSupervisor.helper('collections.documents.indexFilter', {});
RoleSupervisor.allow('collections.documents.insert', true);
RoleSupervisor.allow('collections.documents.update', true);
RoleSupervisor.allow('collections.documents.remove', true);

// Estaciones
RoleSupervisor.allow('collections.estaciones.index', true);
RoleSupervisor.helper('collections.estaciones.indexFilter', {});


// AJUSTES
RoleSupervisor.allow('collections.companies.index', true);
RoleSupervisor.helper('collections.companies.indexFilter', {});

RoleSupervisor.allow('collections.design_app.index', true);
RoleSupervisor.helper('collections.design_app.indexFilter', {});
RoleSupervisor.allow('collections.design_app.insert', true);
RoleSupervisor.allow('collections.design_app.update', true);
RoleSupervisor.allow('collections.design_app.showCreate', true);
RoleSupervisor.allow('collections.design_app.showUpdate', true);

RoleSupervisor.allow('collections.cargamasiva.index', true);
RoleSupervisor.helper('collections.cargamasiva.indexFilter', {});
RoleSupervisor.allow('collections.cargamasiva.insert', true);
RoleSupervisor.allow('collections.cargamasiva.update', true);
RoleSupervisor.allow('collections.cargamasiva.showCreate', true);
RoleSupervisor.allow('collections.cargamasiva.showUpdate', true);


//CUENTAS DE USUARIO
// RoleSupervisor.allow('accounts.index', true);
// RoleSupervisor.helper('accounts.indexFilter', function(){
//     var user = Meteor.users.findOne(this.userId);
//     if (Roles.userHasRole(user, "admin") == true) {
//         return {};
//     }else {
//         if(user){
//             var idc=user.profile.idcompany;
//             if(idc!=undefined){
//                 var res={"profile.idcompany":{$in:idc}};
//                 return res;
//             }
//         }
//     }
// });




// NOTIFICACIONES

RoleSupervisor.allow('collections.notificaciones.index', true);
RoleSupervisor.helper('collections.notificaciones.indexFilter', {});
RoleSupervisor.allow('collections.notificaciones.insert', true);
RoleSupervisor.allow('collections.notificaciones.update', true);
RoleSupervisor.allow('collections.notificaciones.remove', true);
RoleSupervisor.allow('collections.notificaciones.showCreate', true);
RoleSupervisor.allow('collections.notificaciones.showUpdate', true);
RoleSupervisor.allow('collections.notificaciones.showRemove', true);
