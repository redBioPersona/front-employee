Devicesconnected = new orion.collection('devicesconnected', {
    singularName: 'Devicesconnected',
    pluralName: 'Devicesconnecteds',
    title: 'Devicesconnecteds',
    parentPath: '/admin/principal',
    link: { title: 'Devicesconnected', parent: '_template' }
  });

  Devicesconnected.attachSchema(new SimpleSchema({
    name: { type: String, label: 'Nombre'},
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true
    }
  }));

