AccountsTemplates.configureRoute('verifyEmail', {
  name: 'verifyEmail',
  path: '/verify-email',
  redirect: '/admin'
});

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPassword',
  path: '/reset-password',
  redirect: '/admin'
});

AccountsTemplates.configureRoute('enrollAccount', {
  name: 'enrollAccount',
  path: '/enroll',
  redirect: '/admin'
});


SimpleSchema.messages({   
  idEmployeeFound: "N° de colaborador ya existente",
  notAllowedx:"Es un valor no permitido",
  required: "[label] es requerido",                                  // 93
  minString: "[label] de tener por lo menos [min] caracteres",            // 94
  maxString: "[label] no puede exceder [max] caracteres",               // 95
  minNumber: "[label] debe ser mínimo [min]",                       // 96 		Se modificó el campo.
  maxNumber: "[label] no puede exceder de [max]",                          // 97 	Se modificó el campo.
  minDate: "[label] must be on or after [min]",                      // 98
  maxDate: "[label] cannot be after [max]",                          // 99
  badDate: "[label] no es una fecha valida",                            // 100
  minCount: "You must specify at least [minCount] values",           // 101
  maxCount: "You cannot specify more than [maxCount] values",        // 102
  noDecimal: "[label] debe ser un entero",                           // 103
  notAllowed: "[value] es un valor no permitido",                     // 104
  expectedString: "[label] debe ser una cadena",                        // 105
  expectedNumber: "[label] debe ser un number",                        // 106
  expectedBoolean: "[label] debe ser un boolean",                      // 107
  expectedArray: "[label] debe ser un arreglo",                         // 108
  expectedObject: "[label] debe ser un object",                       // 109
  expectedConstructor: "[label] debe ser un [type]",                   // 110
  regEx: [{
    msg: "[label] failed regular expression validation"
  }, {
    exp: SimpleSchema.RegEx.Email,
    msg: "[label] debe ser una cuenta de correo electrónico valida"
  }, {
    exp: SimpleSchema.RegEx.WeakEmail,
    msg: "[label] debe ser una cuenta de correo electrónico valida"
  }, {
    exp: SimpleSchema.RegEx.Domain,
    msg: "[label] debe ser un valid domain"
  }, {
    exp: SimpleSchema.RegEx.WeakDomain,
    msg: "[label] debe ser un valid domain"
  }, {
    exp: SimpleSchema.RegEx.IP,
    msg: "[label] debe ser un valid IPv4 or IPv6 address"
  }, {
    exp: SimpleSchema.RegEx.IPv4, msg: "[label] debe ser un valid IPv4 address" }
    ,
    { exp: SimpleSchema.RegEx.IPv6, msg: "[label] debe ser un valid IPv6 address" },
    { exp: SimpleSchema.RegEx.Url, msg: "[label] debe ser un valid URL" },
    { exp: SimpleSchema.RegEx.Id, msg: "[label] debe ser un valid alphanumeric ID" }
  ],
  keyNotInSchema: "[key] is not allowed by the schema"

});
