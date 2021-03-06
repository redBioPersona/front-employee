if (Meteor.isServer) {


  var bodyParser = Meteor.npmRequire('body-parser'); // using meteorhacks:npm package
  Picker.middleware(bodyParser.json({
    limit: '100mb'
  }));

  Picker.route('/admin/download-export-users/:key', function(params, req, res, next) {
    var userId = Roles.keys.getUserId(params.key);
    if (!userId ||  !Roles.userHasPermission(userId, 'nicolaslopezj.orionExport')) {
      res.end('El usuario no está autorizado para realizar esta acción');
      return;
    }

    var data = {};

    data.dictionary = orion.dictionary.findOne();
    if (exportPages) {
      data.pages = pages.find().fetch();
    }

    data.collections = {};

    _.each(collections, function(collection) {
      data.collections[collection._name] = collection.find().fetch();
    });

    data.users = Meteor.users.find().fetch();
    if (Roles._collection) {
      data.roles = Roles._collection.find().fetch();
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=backup.orionexport');

    var json = JSON.stringify(data);
    res.end(json);
  });

  Picker.route('/admin/download-export/:key', function(params, req, res, next) {
    var userId = Roles.keys.getUserId(params.key);
    if (!userId ||  !Roles.userHasPermission(userId, 'nicolaslopezj.orionExport')) {
      throw new Meteor.Error('unauthorized', 'El usuario no está autorizado para realizar esta acción');
    }

    var data = {};

    data.dictionary = orion.dictionary.findOne();
    if (exportPages) {
      data.pages = pages.find().fetch();
    }

    data.collections = {};

    _.each(collections, function(collection) {
      data.collections[collection._name] = collection.find().fetch();
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=backup.orionexport');

    var json = JSON.stringify(data);
    res.end(json);
  });

  Picker.route('/admin/import-data/:key', function(params, req, res, next) {
    var userId = Roles.keys.getUserId(params.key);
    if (!userId ||  !Roles.userHasPermission(userId, 'nicolaslopezj.orionExport')) {
      throw new Meteor.Error('unauthorized', 'El usuario no está autorizado para realizar esta acción');
    }

    try {
      var json = req.body.json;
      var data = JSON.parse(json);
      var inserts = 1;
      const callback = function(error, response) {
        if (error) {
          console.log(error);
        } else {
          if (inserts % 20 == 0) {
            console.log('Documento #${inserts} restaurado...');
          }

          inserts++;
        }
      };

      // import dictionary
      orion.dictionary.remove({});
      console.log('Restaurando diccionario...');
      orion.dictionary.insert(data.dictionary, callback);

      // import pages
      if (exportPages) {
        orion.pages.collection.remove({});
        console.log('Restaurando páginas...');
        data.pages.forEach(function(page) {
          orion.pages.collection.insert(page, callback);
        });
      }

      // import collections
      _.each(collections, function(collection) {
        var collectionData = data.collections[collection._name];
        if (_.contains(Options.get('dontImportCollections'), collection._name)) return;

        if (_.isArray(collectionData)) {
          if (collection.direct) {
            collection.direct.remove({});
          } else {
            collection.remove({});
          }

          console.log(`Restaurando colección: ${collection._name}...`);
          _.each(collectionData, function(doc) {
            if (collection.direct && collection._c2) {
              collection.direct.insert(doc, {
                validate: false,
                filter: false,
                getAutoValues: false,
                removeEmptyStrings: false
              }, callback);
            } else {
              collection.insert(doc, callback);
            }
          });
        }
      });

      var collectionData = null;

      if (_.has(data, 'users')) {
        collectionData = data.users;
        if (_.isArray(collectionData)) {
          if (Meteor.users.direct)  {
            Meteor.users.direct.remove({});
          } else {
            Meteor.users.remove({});
          }

          console.log('Restaurando usuarios...');
          _.each(collectionData, function(doc) {
            if (Meteor.users.direct && Meteor.users._c2)  {
              Meteor.users.direct.insert(doc, {
                validate: false,
                filter: false,
                getAutoValues: false,
                removeEmptyStrings: false
              }, callback);
            } else {
              Meteor.users.insert(doc, callback);
            }
          });
        }
      }

      if (_.has(data, 'roles')) {
        console.log("tiene roles");
        collectionData = data.roles;
        console.log("roles:"+ JSON.stringify(data.roles));
        if (_.isArray(collectionData)) {
          if (Roles._collection) {
            Roles._collection.remove({});
            console.log('Restaurando roles...');
            _.each(collectionData, function(doc) {
              Roles._collection.insert(doc);
            });
          } else {
            Roles._oldCollection.remove({});
            console.log('Restaurando roles...');
            _.each(collectionData, function(doc) {
              Roles._oldCollection.insert(doc);
            });
          }

        }
      }

    } catch (e) {
      console.log(e);
      throw new Meteor.Error('parse-error', 'Error al analizar el archivo');
    }

    res.end('ok');
  });

}
