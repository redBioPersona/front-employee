Options.set('forbidClientAccountCreation', true);
Options.set('adminHomeRoute', 'principal_template');

T9n.setLanguage("es");

AccountsTemplates.texts.minRequiredLength ="Longitud mínima requerida:";
AccountsTemplates.texts.maxAllowedLength = "Longitud máxima requerida:";
AccountsTemplates.texts.requiredField = " Es un valor Requerido";
AccountsTemplates.texts.errors.loginForbidden =" Usuario/contraseña Incorrecta";
i18n.setDefaultLanguage('es');
i18n.showMissing('[no translation for "<%= label %>" in <%= language %>]');


ReactiveTemplates.set('materializeHeader', 'orionMaterializeHeaderContainer_XP');
ReactiveTemplates.set('layout', 'orionMaterializeLayout_XP');
ReactiveTemplates.set('tabs', 'orionMaterializeTabs_XP');
ReactiveTemplates.set('materializeContent', 'orionMaterializeContentContainer_XP');
ReactiveTemplates.set('materializeButtons', 'orionMaterializeButtonsContainer_XP');
ReactiveTemplates.set('outAdminLayout', 'orionMaterializeOutAdminLayout_XP');
ReactiveTemplates.set('login', 'orionMaterializeLogin_XP');

ReactiveTemplates.set('accounts.index', 'orionMaterializeAccountsIndex_XP');
ReactiveTemplates.set('accounts.update', 'orionMaterializeAccountsUpdate_XP');
ReactiveTemplates.set('accounts.create', 'orionMaterializeAccountsCreate_XP');

ReactiveTemplates.set('myAccount.index', 'orionMaterializeAccountIndex_XP');
ReactiveTemplates.set('myAccount.password', 'orionMaterializeAccountPassword_XP');
ReactiveTemplates.set('myAccount.profile', 'orionMaterializeAccountProfile_XP');


if (Meteor.isClient) {
  jQuery.extend(jQuery.fn.pickadate.defaults, {
    monthsFull: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    weekdaysFull: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    weekdaysShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    today: 'hoy',
    clear: 'borrar',
    close: 'cerrar',
    firstDay: 1,
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy/mm/dd'
  });

  orion.links.add({
    index: ' ',
    identifier: 'accounts-index',
    title: i18n('accounts.index.title'),
    routeName: 'accounts.index',
    activeRouteRegex: 'accounts',
    permission: 'accounts.index',
    parent: '_template'
  });

}
