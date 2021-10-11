// if (Sample.find().count() === 0) {
//     Sample.insert({"active": true,"isServer":false});
// }
//
// dado=Sample.findOne({"active":true}).isServer;



SelectorTabCompany= function() {
  if (SelectorIsAdmin()) {
    return {}
  } else {
    if (SelectorWithUserCompany()) {
      var data=SelectorGetMyCompany();
      if(SelectorIsAdministrator()){
        if(data!=undefined){
          return {
            idcompany: data._id
          }
        }
      }else{
        if(data!=undefined){
          return {
            active: true,
            idcompany: data._id
          }
        }
      }
    }else {
    }
  }
}

SelectorTheCompany= function() {
  if (SelectorIsAdmin()) {
    return { }
  } else {
    var data=SelectorGetMyIdsCompanies();
    if (SelectorIsAdministrator()) {
      return {
        '_id': { $in:data }
      }
    }else{
      if (SelectorWithUserCompany) {
        return {
          active: true,
          _id: { $in:data }
        }
      }
    }
  }
}

Locations = new orion.collection('locations', {
  singularName: 'Localidad',
  pluralName: 'Localidades',
  title: 'Localidades',
  CanAdd:true,
  help:'Localidades/Sedes de la empresa',
  parentPath: '/admin/principal',
  link: {
    title: 'Localidades',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {
        first: 'Primero',
        previous: 'Anterior',
        next: 'Siguiente',
        last: 'Último',
      }
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
      ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop:"Localidades",
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: creaTitulosDeArchivos("Localidades"),
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:creaTitulosDeArchivos("Localidades"),
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    selector:SelectorOnlyByCompany,
    columns: [
      { data: "locationName", title: "Nombre de la localidad" },
      { data: "locationDesc", title: "Descripción de la localidad" },
      { data: "locationAddr", title: "Dirección de la localidad" },
      {
        data: "active",
        title: "Activo",
        render(val) {
          if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
          else {return "<img src='/images/check.png' width='25px'>"}
        }
      },
      orion.attributeColumn('createdByXP', 'createdBy', "Inserto"),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedByXP', 'updatedBy', "Actualizo"),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}},
      {data: "sucesion", title: "Sucesión N° Empleado" },
    ],
  }
});



// ******************COLLECTION COMPANIES
Companies = new orion.collection('companies', {
  singularName: 'Compañia',
  pluralName: 'Compañias',
  title: 'Compañias',
  help:'Compañias asociadas a su cuenta',
  // parentPath: '/admin',
  CanAdd:true,
  link: {
    title: 'Compañias',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    pub:'TabularCompanies',
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {
        first: 'Primero',
        previous: 'Anterior',
        next: 'Siguiente',
        last: 'Último',
      }
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
		buttons: [{
				extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Compañias',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
			},
      {
				extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Compañias',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
			},
			{
				extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Compañias',
        filename:creaTitulosDeArchivos("Compañias"),
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {doc.defaultStyle.fontSize =7;}
			}
		],
    selector:SelectorTheCompany,
    columns: [
      orion.attributeColumn('image', 'logo', 'logo'),
      { data: "companyName", title: "Nombre de la compañia" },
      { data: "companyDesc", title: "Descripción", },
      { data: "direccion", title: "Domicilio Fiscal" },
      {
        data: "idmanager",
        title: "Jefe",
        render: function(val) {
          var employeeName = Persons.findOne({
            _id: val
          });

          if (employeeName !== undefined) {
            return employeeName.employeeName;
          } else {
            return "Sin Asignar";
          }
        }
      },
      {
        data: "meal",
        title: "Evaluar tiempo de alimentos",
        render(val) {
          if (val) {
            return "<img src='/images/check.png' width='25px'>"
          } else {
            return "<img src='/images/denied.png' width='25lpx'>"
          }
        }
      },
      {
        data: "meal_ticket",
        title: "Imprimir ticket de alimentos",
        render(val) {
          if (val) {
            return "<img src='/images/check.png' width='25px'>"
          } else {
            return "<img src='/images/denied.png' width='25lpx'>"
          }
        }
      },
      orion.attributeColumn('createdByXP', 'createdBy', "Inserto"),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedByXP', 'updatedBy', "Actualizo"),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
    ]
  }
});


//************************DEPARTMENTS
Departments = new orion.collection('departments', {
  singularName: 'Departamento',
  pluralName: 'Departamentos',
  title: 'Departamentos',
  parentPath: '/admin/principal',
  help:'Departamentos de la empresa, generalmente es un subconjunto de Direcciones Corporativas',
  CanAdd:true,
  link: {
    title: 'Departamentos',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    pub: 'TabularDepartments',
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Departamentos',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Departamentos"),
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:"Departamentos",
        filename:creaTitulosDeArchivos("Departamentos"),
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {
          doc.defaultStyle.fontSize =8;
       }
      }
    ],
    selector:SelectorOnlyByCompany,
    columns: [
      {
        data: "active",
        title: "Activo",
        render(val) {
          if (val) {return "<img src='/images/check.png' width='25px'>"}
          else {return "<img src='/images/denied.png' width='25lpx'>"}
        }
      },
    { data: "departmentName", title: "Nombre del departamento" },
    { data: "departmentDesc", title: "Descripción del departamento", },
    { data: "idLocation_txt", title: "Localidad" },
    { data: "idmanager_txt", title: "Responsable" },
    { data: "idcompany_txt", title: "Compañia" },
    orion.attributeColumn('createdByXP', 'createdBy', "Inserto"),
    {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
    orion.attributeColumn('updatedByXP', 'updatedBy', "Actualizo"),
    {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
    // { data: "createdBy", title: "Creado por", render: function(val){ var Data = Meteor.users.findOne({_id:val}); if (Data !== undefined) { return Data.profile.name; }else { return "Sin Asignar"; } } },
    // { data: "createdAt", title: "Fecha de creación", render: function(val){ return formatADate(val); } },
    // { data: "updatedBy", title: "Actualizado por", render: function(val){ var Data = Meteor.users.findOne({_id:val}); if (Data !== undefined) { return Data.profile.name; }else { return "Sin Asignar"; } } },
    // { data: "updatedAt", title: "Fecha de Actualización", render: function(val){ return formatADate(val); } }
  ]
}
});

Employeespositions = new orion.collection('employeespositions', {
  singularName: 'Puesto',
  pluralName: 'Puestos',
  CanAdd:true,
  title: 'Puestos',
  help:"Puestos de los colaboradores",
  parentPath: '/admin/principal',
  link: {
    title: 'Puestos',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
        {
          extend: 'copyHtml5',
          text: '<i class="large material-icons">content_copy</i>',
          messageTop: 'Puestos',
          "className": 'btn-floating waves-effect waves-light blue',
          enabled:EnableButtonsExport()
        },
        {
          extend: 'csvHtml5',
          charset:'utf-8',
          bom: true,
          text: '<i class="large material-icons">cloud_download</i>',
          title: 'Puestos',
          "className": 'btn-floating waves-effect waves-light red',
          enabled:EnableButtonsExport()
        },
        {
          extend: 'pdfHtml5',
          text: '<i class="large material-icons">picture_as_pdf</i>',
          title:'Puestos',
          filename:creaTitulosDeArchivos("Puestos"),
          "className": 'btn-floating waves-effect waves-light orange',
          enabled:EnableButtonsExport(),
          exportOptions: {
            modifier: {
              page: 'current'
            }
          }
        }
    ],
    selector:SelectorOnlyByCompany,
    columns: [
      {
        data: "active",
        title: "Activo",
        render(val) {
          if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
          else {return "<img src='/images/check.png' width='25px'>"}
        }
      },
      { data: "empPosName", title: "Nombre del Puesto", },
      { data: "empPosDesc", title: "Descripción del Puesto", },
      {
        data: "idcompany",
        title: "Compañia" ,
        render: function(val) {
          var companyName = Companies.findOne({ _id: val });
          if (companyName !== undefined) {
            return companyName.companyName;
          } else {
            return "Sin Asignar";
          }
        }
      },
      orion.attributeColumn('createdByXP', 'createdBy', "Inserto"),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedByXP', 'updatedBy', "Actualizo"),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}

    ]
  }
});

// *****************COLLECTION Employees_Estatuses
Employeestatuses = new orion.collection('employeestatuses', {
  singularName: 'Estatus',
  pluralName: 'Estatus',
  CanAdd:true,
  title: 'Estatus',
  parentPath: '/admin',
  link: {
    title: 'Estatus',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Localidades',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Localidades',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Localidades',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    columns: [{
      data: "empStatusName",
      title: "Nombre del Estatus"
    }, {
      data: "empStatusDesc",
      title: "Descripción del Estatus",
    }]
  }
});
Devices = new orion.collection('devices', {
  singularName: 'Dispositivo',
  pluralName: 'Dispositivos',
  title: 'Dispositivos',
  help:'Dispositivos biométricos',
  parentPath: '/admin',
  link: {
    title: 'Dispositivos',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    pub: 'TabularDevices',
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Dispositivos',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Dispositivos',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Dispositivos',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    columns: [{
      data: "idLocation",
      title: "Localidad",
      render: function(val) {
        var locationName = Locations.findOne({ _id: val });
        if (locationName !== undefined) { return locationName.locationName; }
        else { return "SIN ASIGNAR"; }
      }
    },
    { data: "deviceName", title: "Nombre del Dispositivo"},
    { data: "deviceModel", title: "Modelo"},
    { data: "deviceType", title: "Tipo de Dispositivo"},
    { data: "deviceSerial", title: "Serial"},
    { data: "deviceStatus", title: "Status"},
    { data: "deviceUsage", title: "Uso de Dispositivo"}
  ]
}
});

Devices.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  // upsert: function () { return true; },

});


Cameras = new orion.collection('cameras', {
  singularName: 'Cámara',
  pluralName: 'Cámaras',
  title: 'Cámaras',
  help:'Cámaras web instaladas',
  parentPath: '/admin',
  link: {
    title: 'Cámaras',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Localidades',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Localidades',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Localidades',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    columns: [{
      data: "idLocation",
      title: "Localidad",
      render: function(val) {
        var locationName = Locations.findOne({ _id: val });
        if (locationName !== undefined) { return locationName.locationName; }
        else { return "SIN ASIGNAR"; }
      }
    },
    { data: "deviceName", title: "Nombre del Dispositivo"},
    { data: "deviceModel", title: "Modelo"},
    { data: "deviceType", title: "Tipo de Dispositivo"},
    { data: "deviceSerial", title: "Serial"},
    { data: "deviceStatus", title: "Status"},
    { data: "deviceUsage", title: "Uso de Dispositivo"}
  ]
}
});

Cameras.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

Microphone = new orion.collection('microphone', {
  singularName: 'Micrófono',
  pluralName: 'Micrófonos',
  title: 'Micrófonos',
  help:'Micrófonos instalados',
  parentPath: '/admin',
  link: {
    title: 'Micrófonos',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Localidades',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Localidades',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Localidades',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    columns: [{
      data: "idLocation",
      title: "Localidad",
      render: function(val) {
        var locationName = Locations.findOne({ _id: val });
        if (locationName !== undefined) { return locationName.locationName; }
        else { return "SIN ASIGNAR"; }
      }
    },
    { data: "deviceName", title: "Nombre del Dispositivo"},
    { data: "deviceModel", title: "Modelo"},
    { data: "deviceType", title: "Tipo de Dispositivo"},
    { data: "deviceSerial", title: "Serial"},
    { data: "deviceStatus", title: "Status"},
    { data: "deviceUsage", title: "Uso de Dispositivo"}
  ]
}
});

Microphone.allow({
  insert: function() {return true;},
  update: function() { return true; },
  remove: function() { return true; }
});

Iris = new orion.collection('iris', {
  singularName: 'Iris',
  pluralName: 'Iris',
  title: 'Iris',
  parentPath: '/admin',
  help:'Lectores de iris conectados',
  link: {
    title: 'Iris',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Localidades',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Localidades',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Localidades',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    columns: [{
      data: "idLocation",
      title: "Localidad",
      render: function(val) {
        var locationName = Locations.findOne({ _id: val });
        if (locationName !== undefined) { return locationName.locationName; }
        else { return "SIN ASIGNAR"; }
      }
    },
    { data: "deviceName", title: "Nombre del Dispositivo"},
    { data: "deviceModel", title: "Modelo"},
    { data: "deviceType", title: "Tipo de Dispositivo"},
    { data: "deviceSerial", title: "Serial"},
    { data: "deviceStatus", title: "Status"},
    { data: "deviceUsage", title: "Uso de Dispositivo"}
  ]
}
});

Iris.allow({
  insert: function() {return true;},
  update: function() { return true; },
  remove: function() { return true; }
});

Employees = new orion.collection('employees', {
  singularName: 'Colaborador',
  pluralName: 'Colaboradores',
  title: 'Colaboradores',
  parentPath: '/admin',
  link: {
    title: 'Colaboradores',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Localidades',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Localidades',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Localidades',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    columns: [{
      data: "Info",
      title: "Enrolar",
      tmpl: Meteor.isClient && Template.enroll_template
    },
    {
      data: "idEmployee",
      title: "ID"
    }, {
      data: "employeeName",
      title: "Nombre"
    }, {
      data: "idEmpPosition",
      title: "Puesto",
      render: function(val) {
        var empPosName = Employeespositions.findOne({
          _id: val
        });

        if (empPosName !== undefined) {
          return empPosName.empPosName;
        } else {
          return "SIN ASIGNAR";
        }
        //return Companies.findOne({_id:val}).companyName;
      }
    }, {
      data: "idEmpStatus",
      title: "Estatus",
      render: function(val) {
        var empStatusName = Employeestatuses.findOne({
          _id: val
        });

        if (empStatusName !== undefined) {
          return empStatusName.empStatusName;
        } else {
          return "SIN ASIGNAR";
        }
        //return Companies.findOne({_id:val}).companyName;
      }

    }, {
      data: "idcompany",
      title: "Compañia",
      render: function(val) {
        var companyName = Companies.findOne({
          _id: val
        });

        if (companyName !== undefined) {
          return companyName.companyName;
        } else {
          return "SIN ASIGNAR";
        }

        //  console.log(val);
        //return Companies.findOne({_id:val}).companyName;
      }
    }, {
      data: "idDepartment",
      title: "Departamento",
      render: function(val) {
        var departmentName = Departments.findOne({
          _id: val
        });

        if (departmentName !== undefined) {
          return departmentName.departmentName;
        } else {
          return "SIN ASIGNAR";
        }
      }
    }, {
      data: "idLocation",
      title: "Localidad",
      render: function(val) {
        var locationName = Locations.findOne({
          _id: val
        });

        if (locationName !== undefined) {
          return locationName.locationName;
        } else {
          return "SIN ASIGNAR";
        }
      }
    }, {
      data: "hireDate",
      title: "Fecha de Contratación",
      render: function(val) {
        return formatADate(val);
      }
    }, {
      data: "empPhoneNbr",
      title: "Teléfono fijo",
    }, {
      data: "empCellNbr",
      title: "Teléfono celular",
    }, {
      data: "empEmail",
      title: "Email",
    },
    {
      data: "empPhoto",
      title: "Fotografía",
      tmpl: Meteor.isClient && Template.foto_template
    },
    {
      data: "empFpTpl1",
      title: "Huella izquierda",
      tmpl: Meteor.isClient && Template.tieneHuellaizq_template
    },
    {
      data: "empFpTpl2",
      title: "Huella derecha",
      tmpl: Meteor.isClient && Template.tieneHuellader_template
    },
    // orion.attributeColumn('image', 'empFpTpl1','Huella izquierda'),
    // orion.attributeColumn('image', 'empFpTpl2', 'Huella derecha'),
    {
      data: "idmanager",
      title: "Jefe",
      render: function(val) {
        var employeeName = Persons.findOne({
          _id: val
        });

        if (employeeName !== undefined) {
          return employeeName.employeeName;
        } else {
          return "SIN ASIGNAR";
        }
      }
    },
    {
      data: "mealsEmp",
      title: "Comida",
      render(val) {
        if (val) {
          return "<img src='/images/check.png' width='25px'>"
        } else {
          return "<img src='/images/denied.png' width='25lpx'>"
        }
      }
    }
  ]
}
});


Documents = new orion.collection('documents', {
  singularName: 'Documento',
  pluralName: 'Documentos',
  title: 'Documentos',
  parentPath: '/admin',
  help:'Documentos permitidos al enrolar colaboradores',
  CanAdd:true,
  link: {
    title: 'Documentos',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Documentos',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Documentos',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Documentos',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ],
    selector:SelectorOnlyByCompany,
    columns: [{
      data: "name",
      title: "Documento"
    },
    {
      data:"active",
      title:"Activo",
      render(val) {
        if (!val) {
          return "<img src='/images/denied.png' width='25lpx'>"
        } else {
          return "<img src='/images/check.png' width='25px'>"
        }
      }
    },
    orion.attributeColumn('createdByXP', 'createdBy', 'Inserto'),
    {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
    orion.attributeColumn('updatedByXP', 'updatedBy', 'Actualizo'),
    {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
  }
});



Restaurants = new orion.collection('restaurants', {
  singularName: 'Restaurante',
  pluralName: 'Restaurantes',
  CanAdd:true,
  title: 'Restaurantes',
  help: "Proveedores de alimentos para la empresa",
  parentPath: '/admin',
  link: {
    title: 'Restaurantes',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Restaurantes',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Restaurantes',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Restaurantes',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {doc.defaultStyle.fontSize =7;}
      }
    ],
    selector:SelectorOnlyByCompany,
    columns: [{
      data: "restaurantName",
      title: "Nombre de Restaurante"
    },{
      data: "restaurantDesc",
      title: "Descripción de Restaurante"
    }, {
      data: "contactPerson",
      title: "Contacto"
    }, {
      data: "restEmail",
      title: "Email"
    }, {
      data: "restPhone",
      title: "Teléfono"
    }, {
      data: "restAddr",
      title: "Dirección"
    }, {
      data: "idcompany",
      title: "Compañía",
      render: function(val){
        var companyName = Companies.findOne({_id:val});

        if (companyName !== undefined) {
          return companyName.companyName;
        }else {
          return "Sin Asignar";
        }
      }
    },
    {
        data: "active",
        title: "Activo",
        render(val) {
          if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
      else {return "<img src='/images/check.png' width='25px'>"}
        }
    },
    orion.attributeColumn('createdByXP', 'createdBy', "Inserto"),
    {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
    orion.attributeColumn('updatedByXP', 'updatedBy', "Actualizo"),
    {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
}
});

Pagadoras = new orion.collection('pagadoras', {
  singularName: 'Outsourcing',
  pluralName: 'Outsourcing',
  CanAdd:true,
  title: 'Outsourcing',
  help: "Outsourcing de empresas",
  parentPath: '/admin/principal',
  link: {
    title: 'Pagadoras',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
      ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Pagadoras',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Pagadoras',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Pagadoras',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {doc.defaultStyle.fontSize =7;}
      }
    ],
    selector:SelectorOnlyByCompany,
    columns: [
      { data: "pagadoraName", title: "Nombre" },
      { data: "pagadoraDesc", title: "Descripción" },
      { data: "idcompany_txt", title: "Compañia" },
      {
          data: "active",
          title: "Activo",
          render(val) {
            if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
            else {return "<img src='/images/check.png' width='25px'>"}
          }
      },
      orion.attributeColumn('createdBy', 'createdBy', "Inserto"),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedBy', 'updatedBy', "Actualizo"),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
}
});

Direcciones = new orion.collection('direcciones', {
  singularName: 'Dirección Corporativa',
  pluralName: 'Direcciones Corporativas',
  CanAdd:true,
  title: 'Direcciones Corporativas',
  help: "Áreas directivas de la empresa",
  parentPath: '/admin/principal',
  link: {
    title: 'Dirección Corporativa',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
      ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Direcciones',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Direcciones',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Direcciones',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {doc.defaultStyle.fontSize =7;}
      }
    ],
    selector:SelectorOnlyByCompany,
    columns: [
      { data: "direccionName", title: "Nombre" },
      { data: "direccionDesc", title: "Descripción" },
      { data: "idJefe_txt", title: "Responsable" },
      { data: "idcompany_txt", title: "Compañia" },
      {
          data: "active",
          title: "Activo",
          render(val) {
            if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
            else {return "<img src='/images/check.png' width='25px'>"}
          }
      },
      orion.attributeColumn('createdBy', 'createdBy', "Inserto"),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedBy', 'updatedBy', "Actualizo"),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
}
});

Areas = new orion.collection('areas', {
  singularName: 'Área',
  pluralName: 'Áreas',
  CanAdd:true,
  title: 'Áreas',
  help: "Áreas, generalmente en un subconjunto de departamentos",
  parentPath: '/admin/principal',
  link: {
    title: 'Áreas',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
      ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Áreas',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Áreas',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Áreas',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {doc.defaultStyle.fontSize =7;}
      }
    ],
    selector:SelectorOnlyByCompany,
    columns: [
      { data: "areaName", title: "Nombre" },
      { data: "areaDesc", title: "Descripción" },
      { data: "idJefe_txt", title: "Responsable" },
      { data: "idcompany_txt", title: "Compañia" },
      {
          data: "active",
          title: "Activo",
          render(val) {
            if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
            else {return "<img src='/images/check.png' width='25px'>"}
          }
      },
      orion.attributeColumn('createdBy', 'createdBy', "Inserto"),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedBy', 'updatedBy', "Actualizo"),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
}
});

Proyectos = new orion.collection('proyectos', {
  singularName: 'Proyecto',
  pluralName: 'Proyectos',
  CanAdd:true,
  title: 'Proyectos',
  help: "Proyectos",
  parentPath: '/admin/principal',
  link: {
    title: 'Proyectos',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
      ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Proyectos',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Proyectos',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Proyectos',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {doc.defaultStyle.fontSize =7;}
      }
    ],
    selector:SelectorOnlyByCompany,
    columns: [
      { data: "proyectoName", title: "Nombre" },
      { data: "proyectoDesc", title: "Descripción" },
      { data: "idcompany_txt", title: "Compañia" },
      {
          data: "active",
          title: "Activo",
          render(val) {
            if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
            else {return "<img src='/images/check.png' width='25px'>"}
          }
      },
      orion.attributeColumn('createdBy', 'createdBy', "Inserto"),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedBy', 'updatedBy', "Actualizo"),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
}
});

Jefes = new orion.collection('jefes', {
  singularName: 'Jefe',
  pluralName: 'Jefes',
  CanAdd:true,
  title: 'Jefes',
  help: "Jefes",
  parentPath: '/admin/principal',
  link: {
    title: 'Jefes',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    "processing": true,
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
      ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Jefes',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title: 'Jefes',
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:'Jefes',
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        },
        customize: function(doc) {doc.defaultStyle.fontSize =7;}
      }
    ],
    selector:SelectorOnlyByCompany,
    columns: [
      { data:"Info", title:"Colaboradores a cargo",tmpl: Meteor.isClient && Template.subsempleado_template},
      { data: "idEmp", title: "N° Colaborador" },
      { data: "employeeName", title: "Nombre" },
      { data: "idEmpPosition", title: "Puesto" },
      { data: "idDepartment", title: "Departamento" },
      { data: "idcompany_txt", title: "Compañia" },
      {
          data: "active",
          title: "Activo",
          render(val) {
            if (!val) {return "<img src='/images/denied.png' width='25lpx'>"}
            else {return "<img src='/images/check.png' width='25px'>"}
          }
      },
      orion.attributeColumn('createdBy', 'createdBy', "Inserto"),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedBy', 'updatedBy', "Actualizo"),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}
  ]
}
});

CargaMasiva= new orion.collection('cargamasiva', {
  singularName: 'Importar información',
  pluralName: 'Importar información',
  title:'Importar información',
  // parentPath: '/admin/principal',
  help: 'Permite importar datos al sistema de manera masiva a partir de un excel',
  link: { title: 'Importar información',parent: '_template' },
  tabular: {
  scrollX: true,
  createdRow: function(row,data,dataIndex){
    createdRowCargaMasiva(row,data,dataIndex);
  },
  "processing": true,
  "language": {
    "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
    search: 'Buscar:',
    info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
    infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
    emptyTable: 'Ningún dato disponible',
    paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
  },
  dom: 'frtip',
  //selector:Selector_DesingApp,
  columns: [
    {data:'causa',title:'Causa'},
    {data:'descripcion',title:'Descripción'},
    {data:'proporcionado',title:'Dato proporcionado'},
    {data:'archivo',title:'Archivo'},
    {data:'tipo',title:'Modulo'},
    {data:'error',title:'Etiqueta'},
    {data:'linea',title:'Linea'},
    orion.attributeColumn('createdBy', 'createdBy', "Carga de registro"),
    orion.attributeColumn('createdAt', 'createdAt', "Fecha de carga")
  ]
  }
});

Persons = new orion.collection('persons', {
  singularName: 'Colaborador',
  pluralName: 'Colaboradores',
  title: 'Colaboradores',
  parentPath: '/admin',
  help: 'Colaboradores de la empresa',
  link: { title: 'Colaboradores', parent: '_template' },
  tabular: {
    scrollX: true,
    "processing": true,
    pub:'TabularPersons',
    "language": {
      "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
      search: 'Buscar:',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      lengthMenu: 'Mostrar _MENU_ registros',
      emptyTable: 'Ningún dato disponible',
      paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
    },
    dom: 'lBfrtip',
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
            ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<i class="large material-icons">content_copy</i>',
        messageTop: 'Colaboradores',
        "className": 'btn-floating waves-effect waves-light blue',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'csvHtml5',
        charset:'utf-8',
        bom: true,
        text: '<i class="large material-icons">cloud_download</i>',
        title:creaTitulosDeArchivos("Colaboradores"),
        "className": 'btn-floating waves-effect waves-light red',
        enabled:EnableButtonsExport()
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="large material-icons">picture_as_pdf</i>',
        title:creaTitulosDeArchivos("Colaboradores"),
        filename:creaTitulosDeArchivos("Colaboradores"),
        "className": 'btn-floating waves-effect waves-light orange',
        enabled:EnableButtonsExport(),
        orientation: 'landscape',
        exportOptions: {
          columns: [ 0,1,3,4,5,6,7,8,9,10,11,12],
          modifier: {
            page: 'current' 
          } 
        },
        customize: function(doc) {
          doc.defaultStyle.fontSize =7;
       }
      }
    ],
    selector:SelectorTabCompany,
    columns: [
      { data: "idEmployee", title: "Id Colaborador" },
      { data: "employeeName", title: "Nombre" },
      orion.attributeColumn('image', 'face', 'Foto'),
      { data: "idEmpPosition_txt", title: "Puesto" },
      { data: "idEmpStatus_txt", title: "Estatus", searchable:false},
      {
        data: "idcompany",
        title: "Compañia",
        searchable:false,
        render: function(val) {
          var datos=val;
          var result=[];
          for (let i = 0; i < datos.length; i++) {
            var _id=datos[i];
            var Data = Companies.findOne({ _id: _id });
            if (Data !== undefined) { result.push(Data.companyName); }
            else { result.push("Sin Asignar"); }
          }
          return result;
        }
      },
      { data: "idDepartment_txt", title: "Departamento",searchable:false },
      { data: "idLocation_txt", title: "Localidad",searchable:false },
      { data: "hireDate", title: "Fecha de Contratación",searchable:false, render: function(val){ return formatJustDate(val); } },
      { data: "empPhoneNbr", title: "Teléfono fijo", searchable:false,},
      { data: "empCellNbr", title: "Teléfono celular", searchable:false,},
      { data: "empEmail", title: "Email", searchable:false,},
      { data: "idmanager_txt", title: "Jefes",searchable:false},
      { data: "roles", title: "Roles",searchable:false, },
      { data: "mealsEmp", title: "Imprimir Ticket", searchable:false,render(val){ if (val) { return "<img src='/images/check.png' width='25px'>"}else{return "<img src='/images/denied.png' width='25lpx'>"}} },
      { data: "dismissalDate", title: "Fecha de baja definitiva",searchable:false, render: function(val){ return formatJustDate(val); } },
      { data: "idpagadora_txt", title: "Outsourcing", searchable:false},
      { data: "idDireccion_txt", title: "Directiva", searchable:false},
      { data: "idProyecto_txt", title: "Proyecto", searchable:false},
      orion.attributeColumn('createdByXP', 'createdBy', 'Inserto'),
      {data:"createdAt",title:"Creado",render:function(val){return formatADate(val);}},
      orion.attributeColumn('updatedBy', 'updatedBy', 'Actualizo'),
      {data:"updatedAt",title:"Actualizado",render:function(val){return formatADate(val);}}      
    ]
  }
});
