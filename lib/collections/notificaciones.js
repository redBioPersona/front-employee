Notificaciones = new orion.collection('notificaciones', {
  singularName: 'Notificación',
  pluralName: 'Notificaciones',
  title: 'Notificaciones',
  help:'Mensajes o notificaciones relevantes',
  parentPath: '/admin/principal/ajustes',
  link: {
    title: 'Notificaciones',
    parent: '_template'
  },
  tabular: {
    scrollX: true,
    createdRow: function(row,data,dataIndex){
      createdRowNotificaciones(row,data,dataIndex);
    },
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
    lengthMenu: [
      [10, 25, 50, 100, 500,-1],
      ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
    ],
    selector:SelectorNotificaciones,
    order: [[1, "desc"]],
    columns: [{
      data: "active",
      title: "Activo",
      visible: false
    },
    {
      data: "date",
      title: "Fecha de notificación",
      render: function(val) {
        return formatADate(val);
      }
    },
    {
      data: "not_mensaje",
      title: "Mensaje de notificación"
    },
    {
      data: "not_status",
      title: "Estatus de notificaciones"
    },
    {
      data: "no_tipo",
      title: "Tipo de notificación"
    },
    {
      data: "not_url",
      title: "Ver"
    }
  ]
}
});

Notificaciones.attachSchema(new SimpleSchema({
  not_mensaje: {
    type: String,
    label: 'Mensaje de notificación',
    optional:true
  },
  not_status: {
    type: String,
    label: 'Estatus de notificaciones',
    optional:true
  },
  emp_id_txt: {
    type: String,
    label: "Nombre del empleado",
    optional: true
  },
  no_tipo: {
    type: String,
    label: 'Tipo de notificación',
    optional:true
  },
  date: {
    type: Date,
    label: 'Fecha',
    optional:true
  },
  not_company:{
    type: [String],
    label: 'Compañia',
    optional:true
  },
  not_rol_destino:{
    type: [String],
    label: 'Rol',
    optional:true
  },
  not_userId: {
    type: String,
    label: 'Usuario',
    optional: true
  },
  not_url: {
    type: String,
    label: 'Ver',
    optional: true
  },
  active: {
    type: Boolean,
    label: 'Activo',
    defaultValue: true
  },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));
