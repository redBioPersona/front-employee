RoleUser = new Roles.Role('Usuario');

RoleUser.allow('principal_template', true);
RoleUser.allow('ajustes_template', true);
RoleUser.allow('administrar_notificaciones_template', true);
RoleUser.allow('administrar_mis_registros_template', true);
RoleUser.allow('administrar_puentes_template', true);
RoleUser.allow('filesystem.upload', true);

// MIS REGISTROS
RoleUser.allow('collections.mis_registros.index', true);
RoleUser.helper('collections.mis_registros.indexFilter', {});
RoleUser.allow('collections.mis_registros.insert', true);
RoleUser.allow('collections.mis_registros.update', true);
RoleUser.allow('collections.mis_registros.showCreate', true);
RoleUser.allow('collections.mis_registros.showUpdate', true);

RoleUser.allow('collections.Searchingdate.insert', true);
RoleUser.allow('collections.Searchingdate.update', true);
RoleUser.allow('collections.Searchingdate.remove', true);

RoleUser.allow('collections.justificantes.index', true);
RoleUser.helper('collections.justificantes.indexFilter', {});
RoleUser.allow('collections.justificantes.insert', true);
RoleUser.allow('collections.justificantes.update', true);

// DIAS NO LABORABLES
RoleUser.allow('collections.vacations.index', true);
RoleUser.helper('collections.vacations.indexFilter', {});
RoleUser.allow('collections.vacations.insert', true);

RoleUser.allow('collections.permisos.index', true);
RoleUser.helper('collections.permisos.indexFilter', {});
RoleUser.allow('collections.permisos.insert', true);

RoleUser.allow('collections.justificantes.index', true);
RoleUser.helper('collections.justificantes.indexFilter', {});


// AJUSTES
RoleUser.allow('collections.design_app.index', true);
RoleUser.helper('collections.design_app.indexFilter', {});
RoleUser.allow('collections.design_app.update', true);
RoleUser.allow('collections.design_app.showUpdate', true);

// NOTIFICACIONES

RoleUser.allow('collections.notificaciones.index', true);
RoleUser.helper('collections.notificaciones.indexFilter', {});
RoleUser.allow('collections.notificaciones.insert', true);
RoleUser.allow('collections.notificaciones.update', true);
RoleUser.allow('collections.notificaciones.remove', true);
RoleUser.allow('collections.notificaciones.showCreate', true);
RoleUser.allow('collections.notificaciones.showUpdate', true);
RoleUser.allow('collections.notificaciones.showRemove', true);
