RoleAdmin = new Roles.Role('Usuario Administrador');

RoleAdmin.allow('principal_template', true);
RoleAdmin.allow('ajustes_template', true);
RoleAdmin.allow('administrar_notificaciones_template', true);
RoleAdmin.allow('administrar_enrolamientos_template', true);
RoleAdmin.allow('administrar_perfil_company_template', true);
RoleAdmin.allow('administrar_estadisticos_template', true);
RoleAdmin.allow('administrar_accesos_template', true);
RoleAdmin.allow('administrar_empleados_template', true);
RoleAdmin.allow('administrar_politicas_template', true);
RoleAdmin.allow('administrar_dispositivos_template', true);
RoleAdmin.allow('administrar_puentes_template', true);
RoleAdmin.allow('administrar_documentos_template', true);
RoleAdmin.allow('administrar_estaciones_template', true);
RoleAdmin.allow('filesystem.upload', true);


// COLECCIONES TEMPORALES
RoleAdmin.allow('collections.enrollments_temp.index', true);
RoleAdmin.helper('collections.enrollments_temp.indexFilter',{});
RoleAdmin.allow('collections.enrollments_temp.insert', true);
RoleAdmin.allow('collections.enrollments_temp.update', true);
RoleAdmin.allow('collections.enrollments_temp.remove', true);
RoleAdmin.allow('collections.enrollments_temp.showCreate', true);
RoleAdmin.allow('collections.enrollments_temp.showUpdate', true);
RoleAdmin.allow('collections.enrollments_temp.showRemove', true);

RoleAdmin.allow('collections.Searchingdate.insert', true);
RoleAdmin.allow('collections.Searchingdate.update', true);
RoleAdmin.allow('collections.Searchingdate.remove', true);

RoleAdmin.allow('collections.documents_temp.index', true);
RoleAdmin.helper('collections.documents_temp.indexFilter', {});
RoleAdmin.allow('collections.documents_temp.insert', true);
RoleAdmin.allow('collections.documents_temp.update', true);
RoleAdmin.allow('collections.documents_temp.remove', true);
RoleAdmin.allow('collections.documents_temp.showCreate', true);
RoleAdmin.allow('collections.documents_temp.showUpdate', true);
RoleAdmin.allow('collections.documents_temp.showRemove', true);

RoleAdmin.allow('collections.employees.index', true);
RoleAdmin.helper('collections.employees.indexFilter', {});
RoleAdmin.allow('collections.employees.insert', true);
RoleAdmin.allow('collections.employees.update', true);
RoleAdmin.allow('collections.employees.remove', true);
RoleAdmin.allow('collections.employees.showCreate', true);
RoleAdmin.allow('collections.employees.showUpdate', true);
RoleAdmin.allow('collections.employees.showRemove', true);


//GRAFICAS
// RoleAdmin.allow('collections.porcentajes.index', true);
// RoleAdmin.helper('collections.porcentajes.indexFilter', {});
RoleAdmin.allow('collections.grafica_deptos.index', true);
RoleAdmin.helper('collections.grafica_deptos.indexFilter', {});
RoleAdmin.allow('collections.grafica_extra_time.index', true);
RoleAdmin.helper('collections.grafica_extra_time.indexFilter', {});


//Enrolamientos
RoleAdmin.allow('collections.create_enroll.index', true);
RoleAdmin.helper('collections.create_enroll.indexFilter', {});
RoleAdmin.allow('collections.enrollments.index', true);
RoleAdmin.helper('collections.enrollments.indexFilter', {});

//ADMINISTRAR ACCESOS
RoleAdmin.allow('collections.accesscontrol.index', true);
RoleAdmin.helper('collections.accesscontrol.indexFilter', {});
RoleAdmin.allow('collections.accessdetails.index', true);
RoleAdmin.helper('collections.accessdetails.indexFilter', {});
RoleAdmin.allow('collections.meal_times.index', true);
RoleAdmin.helper('collections.meal_times.indexFilter', {});
RoleAdmin.allow('collections.reports.index', true);
RoleAdmin.helper('collections.reports.indexFilter', {});
RoleAdmin.allow('collections.tickets.index', true);
RoleAdmin.helper('collections.tickets.indexFilter', {});
RoleAdmin.allow('collections.reports_emp.index', true);
RoleAdmin.helper('collections.reports_emp.indexFilter', {});
RoleAdmin.allow('collections.extra_time.index', true);
RoleAdmin.helper('collections.extra_time.indexFilter', {});

//ADMINISTRAR EMPLEADOS
RoleAdmin.allow('collections.employeestatuses.index', true);
RoleAdmin.helper('collections.employeestatuses.indexFilter', {});

RoleAdmin.allow('collections.days.index', true);
RoleAdmin.helper('collections.days.indexFilter', {});
RoleAdmin.allow('collections.days.insert', true);
RoleAdmin.allow('collections.days.update', true);
RoleAdmin.allow('collections.days.remove', true);
RoleAdmin.allow('collections.days.showCreate', true);
RoleAdmin.allow('collections.days.showUpdate', true);
RoleAdmin.allow('collections.days.showRemove', true);

RoleAdmin.allow('collections.persons.index', true);
RoleAdmin.helper('collections.persons.indexFilter', function(){
    console.log("****");
    var res = Meteor.users.findOne({ "_id": this.userId });
    console.log("res "+JSON.stringify(res));
    if (res && res.profile && res.profile.idcompany) {
        var _idCompany = res.profile.idcompany;
        console.log(_idCompany);
        return {"profile.idcompany":{$in:_idCompany}};
    }
});
RoleAdmin.allow('collections.persons.insert', true);
RoleAdmin.allow('collections.persons.update', true);
RoleAdmin.allow('collections.persons.remove', true);
RoleAdmin.allow('collections.persons.showCreate', true);
RoleAdmin.allow('collections.persons.showUpdate', true);
RoleAdmin.allow('collections.persons.showRemove', true);

// POLITICAS Y HORARIOS
RoleAdmin.allow('collections.sanciones.index', true);
RoleAdmin.helper('collections.sanciones.indexFilter', {});
RoleAdmin.allow('collections.sanciones.insert', true);
RoleAdmin.allow('collections.sanciones.update', true);
RoleAdmin.allow('collections.sanciones.remove', true);
RoleAdmin.allow('collections.sanciones.showCreate', true);
RoleAdmin.allow('collections.sanciones.showUpdate', true);
RoleAdmin.allow('collections.sanciones.showRemove', true);

RoleAdmin.allow('collections.reglas_retardos.index', true);
RoleAdmin.helper('collections.reglas_retardos.indexFilter', {});
RoleAdmin.allow('collections.reglas_retardos.insert', true);
RoleAdmin.allow('collections.reglas_retardos.update', true);
RoleAdmin.allow('collections.reglas_retardos.remove', true);
RoleAdmin.allow('collections.reglas_retardos.showCreate', true);
RoleAdmin.allow('collections.reglas_retardos.showUpdate', true);
RoleAdmin.allow('collections.reglas_retardos.showRemove', true);

RoleAdmin.allow('collections.reglas_alimentos.index', true);
RoleAdmin.helper('collections.reglas_alimentos.indexFilter', {});
RoleAdmin.allow('collections.reglas_alimentos.insert', true);
RoleAdmin.allow('collections.reglas_alimentos.update', true);
RoleAdmin.allow('collections.reglas_alimentos.remove', true);
RoleAdmin.allow('collections.reglas_alimentos.showCreate', true);
RoleAdmin.allow('collections.reglas_alimentos.showUpdate', true);
RoleAdmin.allow('collections.reglas_alimentos.showRemove', true);

RoleAdmin.allow('collections.horarios.index', true);
RoleAdmin.helper('collections.horarios.indexFilter', {});
RoleAdmin.allow('collections.horarios.insert', true);
RoleAdmin.allow('collections.horarios.update', true);
RoleAdmin.allow('collections.horarios.remove', true);
RoleAdmin.allow('collections.horarios.showCreate', true);
RoleAdmin.allow('collections.horarios.showUpdate', true);
RoleAdmin.allow('collections.horarios.showRemove', true);


// PERFILES DE LA COMPAÑIA
RoleAdmin.allow('collections.locations.index', true);
RoleAdmin.helper('collections.locations.indexFilter', {});
RoleAdmin.allow('collections.locations.insert', true);
RoleAdmin.allow('collections.locations.update', true);
RoleAdmin.allow('collections.locations.remove', true);
RoleAdmin.allow('collections.locations.showCreate', true);
RoleAdmin.allow('collections.locations.showUpdate', true);
RoleAdmin.allow('collections.locations.showRemove', true);

RoleAdmin.allow('collections.reportsconcentrados.index', true);
RoleAdmin.helper('collections.reportsconcentrados.indexFilter', {});

RoleAdmin.allow('collections.pagadoras.index', true);
RoleAdmin.helper('collections.pagadoras.indexFilter', {});
RoleAdmin.allow('collections.pagadoras.insert', true);
RoleAdmin.allow('collections.pagadoras.update', true);
RoleAdmin.allow('collections.pagadoras.remove', true);
RoleAdmin.allow('collections.pagadoras.showCreate', true);
RoleAdmin.allow('collections.pagadoras.showUpdate', true);
//RoleAdmin.allow('collections.pagadoras.showRemove', true);

RoleAdmin.allow('collections.direcciones.index', true);
RoleAdmin.helper('collections.direcciones.indexFilter', {});
RoleAdmin.allow('collections.direcciones.insert', true);
RoleAdmin.allow('collections.direcciones.update', true);
RoleAdmin.allow('collections.direcciones.remove', true);
RoleAdmin.allow('collections.direcciones.showCreate', true);
RoleAdmin.allow('collections.direcciones.showUpdate', true);
//RoleAdmin.allow('collections.direcciones.showRemove', true);

RoleAdmin.allow('collections.areas.index', true);
RoleAdmin.helper('collections.areas.indexFilter', {});
RoleAdmin.allow('collections.areas.insert', true);
RoleAdmin.allow('collections.areas.update', true);
RoleAdmin.allow('collections.areas.remove', true);
RoleAdmin.allow('collections.areas.showCreate', true);
RoleAdmin.allow('collections.areas.showUpdate', true);
//RoleAdmin.allow('collections.areas.showRemove', true);

RoleAdmin.allow('collections.proyectos.index', true);
RoleAdmin.helper('collections.proyectos.indexFilter', {});
RoleAdmin.allow('collections.proyectos.insert', true);
RoleAdmin.allow('collections.proyectos.update', true);
RoleAdmin.allow('collections.proyectos.remove', true);
RoleAdmin.allow('collections.proyectos.showCreate', true);
RoleAdmin.allow('collections.proyectos.showUpdate', true);
//RoleAdmin.allow('collections.proyectos.showRemove', true);

RoleAdmin.allow('collections.jefes.index', true);
RoleAdmin.helper('collections.jefes.indexFilter', {});
RoleAdmin.allow('collections.jefes.insert', true);
RoleAdmin.allow('collections.jefes.update', true);
RoleAdmin.allow('collections.jefes.remove', true);
RoleAdmin.allow('collections.jefes.showCreate', true);
RoleAdmin.allow('collections.jefes.showUpdate', true);
//RoleAdmin.allow('collections.jefes.showRemove', true);

RoleAdmin.allow('collections.departments.index', true);
RoleAdmin.helper('collections.departments.indexFilter', {});
RoleAdmin.allow('collections.departments.insert', true);
RoleAdmin.allow('collections.departments.update', true);
RoleAdmin.allow('collections.departments.remove', true);
RoleAdmin.allow('collections.departments.showCreate', true);
RoleAdmin.allow('collections.departments.showUpdate', true);
RoleAdmin.allow('collections.departments.showRemove', true);

RoleAdmin.allow('collections.employeespositions.index', true);
RoleAdmin.helper('collections.employeespositions.indexFilter', {});
RoleAdmin.allow('collections.employeespositions.insert', true);
RoleAdmin.allow('collections.employeespositions.update', true);
RoleAdmin.allow('collections.employeespositions.remove', true);
RoleAdmin.allow('collections.employeespositions.showCreate', true);
RoleAdmin.allow('collections.employeespositions.showUpdate', true);
RoleAdmin.allow('collections.employeespositions.showRemove', true);

RoleAdmin.allow('collections.restaurants.index', true);
RoleAdmin.helper('collections.restaurants.indexFilter', {});
RoleAdmin.allow('collections.restaurants.insert', true);
RoleAdmin.allow('collections.restaurants.update', true);
RoleAdmin.allow('collections.restaurants.remove', true);
RoleAdmin.allow('collections.restaurants.showCreate', true);
RoleAdmin.allow('collections.restaurants.showUpdate', true);
RoleAdmin.allow('collections.restaurants.showRemove', true);


// ESTATUS DE LOS Dispositivos
RoleAdmin.allow('collections.devices.index', true);
RoleAdmin.helper('collections.devices.indexFilter', {});
RoleAdmin.allow('collections.cameras.index', true);
RoleAdmin.helper('collections.cameras.indexFilter', {});
RoleAdmin.allow('collections.microphone.index', true);
RoleAdmin.helper('collections.microphone.indexFilter', {});
RoleAdmin.allow('collections.iris.index', true);
RoleAdmin.helper('collections.iris.indexFilter', {});

RoleAdmin.allow('collections.prints.index', true);
RoleAdmin.helper('collections.prints.indexFilter', {});

// DIAS NO LABORABLES
RoleAdmin.allow('collections.vacations.index', true);
RoleAdmin.helper('collections.vacations.indexFilter', {});
RoleAdmin.allow('collections.vacations.insert', true);
RoleAdmin.allow('collections.vacations.showCreate', true);

RoleAdmin.allow('collections.permisos.index', true);
RoleAdmin.helper('collections.permisos.indexFilter', {});
RoleAdmin.allow('collections.permisos.insert', true);
RoleAdmin.allow('collections.permisos.showCreate', true);

RoleAdmin.allow('collections.feriados.index', true);
RoleAdmin.helper('collections.feriados.indexFilter', {});
RoleAdmin.allow('collections.feriados.insert', true);
RoleAdmin.allow('collections.feriados.update', true);
RoleAdmin.allow('collections.feriados.remove', true);
RoleAdmin.allow('collections.feriados.showCreate', true);
RoleAdmin.allow('collections.feriados.showUpdate', true);
RoleAdmin.allow('collections.feriados.showRemove', true);


RoleAdmin.allow('collections.incidencias.index', true);
RoleAdmin.helper('collections.incidencias.indexFilter', {});
RoleAdmin.allow('collections.incidencias.insert', true);
RoleAdmin.allow('collections.incidencias.update', true);
RoleAdmin.allow('collections.incidencias.remove', true);
RoleAdmin.allow('collections.incidencias.showCreate', true);
RoleAdmin.allow('collections.incidencias.showUpdate', true);
RoleAdmin.allow('collections.incidencias.showRemove', true);

RoleAdmin.allow('collections.justificantes.index', true);
RoleAdmin.helper('collections.justificantes.indexFilter', {});
RoleAdmin.allow('collections.justificantes.insert', true);
RoleAdmin.allow('collections.justificantes.update', true);
RoleAdmin.allow('collections.justificantes.showCreate', true);

//DOCUMENTOS
RoleAdmin.allow('collections.documents.index', true);
RoleAdmin.helper('collections.documents.indexFilter', {});
RoleAdmin.allow('collections.documents.insert', true);
RoleAdmin.allow('collections.documents.update', true);
RoleAdmin.allow('collections.documents.remove', true);
RoleAdmin.allow('collections.documents.showCreate', true);
RoleAdmin.allow('collections.documents.showUpdate', true);
RoleAdmin.allow('collections.documents.showRemove', true);

// Estaciones
RoleAdmin.allow('collections.estaciones.index', true);
RoleAdmin.helper('collections.estaciones.indexFilter', {});


// AJUSTES
RoleAdmin.allow('collections.companies.index', true);
RoleAdmin.helper('collections.companies.indexFilter', {});
// RoleAdmin.allow('collections.companies.insert', true);
RoleAdmin.allow('collections.companies.update', true);
// RoleAdmin.allow('collections.companies.remove', true);
// RoleAdmin.allow('collections.companies.showCreate', true);
RoleAdmin.allow('collections.companies.showUpdate', true);
// RoleAdmin.allow('collections.companies.showRemove', true);

RoleAdmin.allow('collections.design_app.index', true);
RoleAdmin.helper('collections.design_app.indexFilter', {});
RoleAdmin.allow('collections.design_app.insert', true);
RoleAdmin.allow('collections.design_app.update', true);
RoleAdmin.allow('collections.design_app.showCreate', true);
RoleAdmin.allow('collections.design_app.showUpdate', true);

RoleAdmin.allow('collections.cargamasiva.index', true);
RoleAdmin.helper('collections.cargamasiva.indexFilter', {});
RoleAdmin.allow('collections.cargamasiva.insert', true);
RoleAdmin.allow('collections.cargamasiva.update', true);
RoleAdmin.allow('collections.cargamasiva.showCreate', true);
RoleAdmin.allow('collections.cargamasiva.showUpdate', true);

// RoleAdmin.allow('accounts.index', true);
// RoleAdmin.allow('accounts.create', true);
// RoleAdmin.helper('accounts.indexFilter', function(){
//     var user = Meteor.users.findOne(this.userId);
//     if (Roles.userHasRole(user, "admin") == true) {
//         return {};
//     }else {
//         if(user){
//             var idc=user.profile.idcompany;
//             if(idc!=undefined){
//                 var res={
//                     "profile.idcompany":{$in:idc},
//                     "profile.face":{$ne:true}
//                 };
//                 return res;
//             }
//         }
//     }
// });
//
// RoleAdmin.helper('accounts.allowedRoles', function(){
//     //console.log(Roles.availableRoles());
//     return ["Usuario Administrador", "Supervisor", "Usuario"];
// });
// RoleAdmin.allow('accounts.insert', true);
// RoleAdmin.allow('accounts.update', true);
// RoleAdmin.allow('accounts.showCreate', true);
// RoleAdmin.allow('accounts.showUpdate', true);
// RoleAdmin.allow('accounts.remove', true);
// RoleAdmin.allow('accounts.update.profile', true);
// RoleAdmin.allow('accounts.update.roles', true);
// RoleAdmin.allow('accounts.index.roles', true);
// RoleAdmin.allow('accounts.update.password', true);
// RoleAdmin.allow('accounts.update.emails', true);
// RoleAdmin.allow('accounts.roles', true);


// NOTIFICACIONES

RoleAdmin.allow('collections.notificaciones.index', true);
RoleAdmin.helper('collections.notificaciones.indexFilter', {});
RoleAdmin.allow('collections.notificaciones.insert', true);
RoleAdmin.allow('collections.notificaciones.update', true);
RoleAdmin.allow('collections.notificaciones.remove', true);
RoleAdmin.allow('collections.notificaciones.showCreate', true);
RoleAdmin.allow('collections.notificaciones.showUpdate', true);
RoleAdmin.allow('collections.notificaciones.showRemove', true);
