Searchingdate = new orion.collection('searchingdate', {
    singularName: 'Searchingdate',
    pluralName: 'Searchingdate',
    title: 'Searchingdate',
    parentPath: '/admin/principal',
    help: 'Searchingdate',
    link: { title: 'Searchingdate', parent: '_template' }
  });

  Searchingdate.attachSchema(new SimpleSchema({
    SearchClientfechaInicio: { type: Date, label: 'SearchClientfechaInicio'},
    SearchClientfechaFin: { type: Date, label: 'SearchClientfechaFin'},
    SearchServerfechaInicio: { type: Date, label: 'SearchServerfechaInicio'},
    SearchServerfechaFin: { type: Date, label: 'SearchServerfechaFin'},
    active: { type: Boolean, label: 'active', defaultValue: true},
    createdBy: orion.attribute('createdBy'),
    createdAt: orion.attribute('createdAt'),
    updatedBy: orion.attribute('updatedBy', { optional: true }),
    updatedAt: orion.attribute('updatedAt', { optional: true }),
  }));

  Searchingdate.allow({
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
