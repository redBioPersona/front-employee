Locations.attachSchema(new SimpleSchema({
  locationName: {
    type: String,
    label: 'Nombre de la localidad',
    optional:false,
    help:"Nombre de la localidad de la empresa",
    example:"Ciudad de México",
    autoValue: function() {
      var locationName = this.field("locationName");
      if (locationName.isSet) {
        return locationName.value.toUpperCase();
      } else {
        this.unset();
      }
    }
  },
  locationDesc: {
    type: String,
    label: 'Descripción de la localidad',
    optional:true,
    help:"Descripción de la localidad",
    example:"---",
    autoValue: function() {
      var locationDesc = this.field("locationDesc");
      if (locationDesc.isSet) {
        return locationDesc.value.toUpperCase();
      } else {
        this.unset();
      }
    }
  },
  locationAddr: {
    type: String,
    label: 'Dirección de localidad',
    help:"Dirección de la localidad",
    example:"Ciudad de México",
    optional: true,
    defaultValue: ""
  },
  idcompany: {
    type: [String],
    label: 'Compañia',
    optional: true,
    autoform: { type: "hidden" },
    autoValue: function() {
      var id = this.siblingField("idcompany").value;
      if (id) {
        var entity = Companies.findOne({ _id: id });
        var value = "";
        var fields = ["companyName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            value = value + " " + entity[fields[i]];
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: value.trim()
          };
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    },
  },
  idcompany: orion.attribute('hasMany', {
    label: 'Nombre de la Compañia',
    defaultValue: "",
    help:"Nombre de la Compañia",
    example:"Mi Compañia",
  }, {
    validateOnServer :false,
    collection: Companies,
    titleField: ['companyName'],
    publicationName: 'Companies_localidad',
    validateOnServer :false,
    filter: function(userId) {
      if (userId) {
        var user = Meteor.users.findOne(userId);
        if (Roles.userHasRole(userId,"admin")) {
          return { _id: {$ne: ""}};
        }else {
          return { _id: {$in:user.profile.idcompany} };
        }
      }
    }
  }),
  sucesion: {
    type: Number,
    label: 'Sucesión N° de empleado',
    optional:true,
    //min:1000,
    help:"Sucesión para generar N° empleado",
    example:"10000",
  },
  active: {
    type: Boolean,
    label: 'Activo',
    defaultValue: true,
    help:"Registro activo",
    example:"Cuadro Seleccionado (con palomita)=Registro Activo",
  },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));

Companies.attachSchema(new SimpleSchema({
  companyName: {
    type: String,
    help:"Nombre de la empresa",
    example:"Mi Compañia",
    label: 'Nombre de la compañia',
    optional:true,
    autoValue: function() {
      var companyName = this.field("companyName");
      if (companyName.isSet) {
        return companyName.value.toUpperCase();
      } else {
        this.unset();
      }
    }
  },
  companyDesc: orion.attribute("materialnote",{
    label: "Descripción de la Compañia",
    help:"Descripción de la Compañia",
    example:"Descripción de la Compañia"
}),
  aviso: orion.attribute("materialnote",{
    label: "Aviso de privacidad",
    help:"Aviso de privacidad de la Compañia",
    example:"Aviso de privacidad de la Compañia",
    optional:true
  }),
  direccion: {
    type: String,
    label: 'Dirección Juridica de la Compañia',
    optional:true,
    help:"Dirección Juridica de la Compañia",
    example:"Ciudad de México",
  },
  idmanager: orion.attribute('hasOne', {
    type: String,
    label: 'JEFE',
    optional: true,
    help:"Director@ de la empresa",
    example:"Omar Barrera",
  }, {
    collection: Persons,
    titleField: ['employeeName'],
    customPublication:true,
    publicationName: 'GetSelectOnePersons'
  }),
  logo: orion.attribute('image', {
    optional: true,
    label: 'Logo'
  }),
  meal: {
    type: Boolean,
    label: 'Evaluar tiempo de alimentos',
    defaultValue: false,
    help:"La empresa evalúa tiempos de alimentos",
    example:"Cuadro Seleccionado (con palomita)=Registro Activo",
  },
  meal_ticket: {
    type: Boolean,
    label: 'Imprimir ticket de alimentos',
    defaultValue: false,
    help:"La empresa genera tickets para el consumo de alimentos",
    example:"Cuadro Seleccionado (con palomita)=Registro Activo",
  },
  active: {
    type: Boolean,
    label: 'Activo',
    defaultValue: true,
    autoform:{ type:"hidden" }
  },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
}));



Persons.attachSchema(new SimpleSchema({
  idEmployee: { type: Number, label:'Id del Colaborador', optional: false,  autoform: { readonly: true } },
  employeeName: { type: String, label:'Nombre del Colaborador', optional: false },  
  idEmpPosition: orion.attribute('hasOne',{ label: 'Puesto', optional: false, }, {
    collection: Employeespositions,
    titleField: ['empPosName'],
    customPublication:true,
    publicationName: 'getemployeespositions',
  }),
  idEmpPosition_txt: {
    type: String,
    label:'Nombre del Colaborador',
    optional: true,
    autoform:{ type:"hidden" },
    autoValue: function() {
      var id = this.siblingField("idEmpPosition").value;
      if (id) {
        LaColleccion=Employeespositions;
        var entity = LaColleccion.find({ _id: id}).fetch();
        var value = "";
        var fields = ["empPosName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            var values="";
            entity.forEach(element => {
              var dato=element[fields[i]]+" ";
              values+=dato;
            });  
            value=values;
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {$setOnInsert: value.trim()};
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    }
  },
  idDireccion: orion.attribute('hasOne', {
    label: 'Dirección Corporativa',
    optional: true
  }, {
    collection: Direcciones,
    titleField: ['direccionName'],
    customPublication:true,
    publicationName: 'GetSelectOneDirecciones'
  }),
  idDireccion_txt: {
    type: String,
    label: 'Jefe',      
    autoform: { type: "hidden" },
    autoValue: function() {
      var id = this.siblingField("idDireccion").value;
      if (id) {
        var entity = Direcciones.findOne({ _id: id });
        var valor = "";
        var fields = ["direccionName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              valor = valor + " " + res;
            }
          } else {
            valor = valor + " " + entity[fields[i]];
          }
        }
        
        if (this.isInsert && (this.value == null || !this.value.length)) {
          return valor;
        }
        if (this.isUpdate && this.isSet && this.operator === '$unset') {
          return { $set: valor};
        }
        if (this.isUpdate) {
          return valor;
        }
        if (this.isUpsert) {
          return valor;
        }
      } else {
        return "";
      }
    },
    optional: true,
  },
  idpagadora: orion.attribute('hasOne',{ label: 'Outsourcing', optional: true, }, {
    collection: Pagadoras,
    titleField: ['pagadoraName'],
    customPublication:true,
    publicationName: 'getPagadoras',
  }),
  idpagadora_txt: {
    type: String,
    label:'Nombre del Outsourcing',
    optional: true,
    autoform:{ type:"hidden" },
    autoValue: function() {
      var id = this.siblingField("idpagadora").value;
      if (id) {
        LaColleccion=Pagadoras;
        var entity = LaColleccion.find({ _id: id}).fetch();
        var value = "";
        var fields = ["pagadoraName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            var values="";
            entity.forEach(element => {
              var dato=element[fields[i]]+" ";
              values+=dato;
            });  
            value=values;
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {$setOnInsert: value.trim()};
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    }
  },
  idDireccion: orion.attribute('hasOne',{ label: 'Dirección Organizacional (Opcional)', optional: true, }, {
    collection: Direcciones,
    titleField: ['direccionName'],
    customPublication:true,
    publicationName: 'getDirecciones',
  }),
  idDireccion_txt: {
    type: String,
    label:'Nombre de la direccion',
    optional: true,
    autoform:{ type:"hidden" },
    autoValue: function() {
      var id = this.siblingField("idDireccion").value;
      if (id) {
        LaColleccion=Direcciones;
        var entity = LaColleccion.find({ _id: id}).fetch();
        var value = "";
        var fields = ["direccionName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            var values="";
            entity.forEach(element => {
              var dato=element[fields[i]]+" ";
              values+=dato;
            });  
            value=values;
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {$setOnInsert: value.trim()};
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    }
  },
  idArea: orion.attribute('hasOne',{ label: 'Áreas (Opcional)', optional: true, }, {
    collection: Areas,
    titleField: ['areaName'],
    customPublication:true,
    publicationName: 'getAreas',
  }),
  idArea_txt: {
    type: String,
    label:'Nombre de la direccion',
    optional: true,
    autoform:{ type:"hidden" },
    autoValue: function() {
      var id = this.siblingField("idArea").value;
      if (id) {
        LaColleccion=Areas;
        var entity = LaColleccion.find({ _id: id}).fetch();
        var value = "";
        var fields = ["areaName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            var values="";
            entity.forEach(element => {
              var dato=element[fields[i]]+" ";
              values+=dato;
            });  
            value=values;
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {$setOnInsert: value.trim()};
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    }
  },
  idProyecto: orion.attribute('hasOne',{ label: 'Proyecto (Opcional)', optional: true, }, {
    collection: Proyectos,
    titleField: ['proyectoName'],
    customPublication:true,
    publicationName: 'getProyectos',
  }),
  idProyecto_txt: {
    type: String,
    label:'Nombre de la direccion',
    optional: true,
    autoform:{ type:"hidden" },
    autoValue: function() {
      var id = this.siblingField("idProyecto").value;
      if (id) {
        LaColleccion=Proyectos;
        var entity = LaColleccion.find({ _id: id}).fetch();
        var value = "";
        var fields = ["proyectoName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            var values="";
            entity.forEach(element => {
              var dato=element[fields[i]]+" ";
              values+=dato;
            });  
            value=values;
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {$setOnInsert: value.trim()};
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    }
  },
  idEmpStatus: orion.attribute('hasOne', {
    label: 'Estatus',
    optional: false
  }, {
    collection: Employeestatuses,
    titleField: ['empStatusName'],
    publicationName: 'Persons_Estatus',
    validateOnServer :false, 
  }),
  idEmpStatus_txt: {
    type: String,
    label:'Estatus',
    optional: true,
    autoform:{ type:"hidden" },
    autoValue: function() {
      var id = this.siblingField("idEmpStatus").value;
      if (id) {
        LaColleccion=Employeestatuses;
        var entity = LaColleccion.find({ _id: id}).fetch();
        var value = "";
        var fields = ["empStatusName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            var values="";
            entity.forEach(element => {
              var dato=element[fields[i]]+" ";
              values+=dato;
            });  
            value=values;
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {$setOnInsert: value.trim()};
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    }
  },
  idcompany: orion.attribute('hasMany', {
    label: 'Nombre de la compañia',
    optional: false
  }, {
    collection: Companies,
    titleField: ['companyName'],
    publicationName: 'Empleados_company',
    validateOnServer :false,
    filter: function(userId) {
      if (userId) {
        var user = Meteor.users.findOne(userId);
        if (Roles.userHasRole(userId,"admin")) {
          return { _id: {$ne: ""}};
        }else {
          return { "_id":{$in:user.profile.idcompany}  };
        }
      }
    }
  }),
  idDepartment: orion.attribute('hasOne', {
    label: 'Nombre de Departamento',
    optional: false,
  }, {
    collection: Departments,
    titleField: ['departmentName'],
    customPublication:true,
    publicationName: 'GetSelectOneDepartments'
  }),
  idDepartment_txt: {
    type: String,
    label:'Nombre del Colaborador',
    optional: true,
    autoform:{ type:"hidden" },
    autoValue: function() {
      var id = this.siblingField("idDepartment").value;
      if (id) {
        LaColleccion=Departments;
        var entity = LaColleccion.find({ _id: id}).fetch();
        var value = "";
        var fields = ["departmentName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            var values="";
            entity.forEach(element => {
              var dato=element[fields[i]]+" ";
              values+=dato;
            });  
            value=values;
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {$setOnInsert: value.trim()};
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    }
  },
  idLocation: orion.attribute('hasOne', {
    label: 'Nombre de la Localidad',
    optional: false
  }, {
    collection: Locations,
    titleField: ['locationName'],
    customPublication:true,
    publicationName: 'GetSelectOneLocations'
  }),
  idLocation_txt: {
    type: String,
    label: 'Nombre de la Localidad',
    optional: true,
    autoform:{ type:"hidden" },
    autoValue: function() {
      var id = this.siblingField("idLocation").value;
      if (id) {
        LaColleccion=Locations;
        var entity = LaColleccion.find({ _id: id}).fetch();
        var value = "";
        var fields = ["locationName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            var values="";
            entity.forEach(element => {
              var dato=element[fields[i]]+" ";
              values+=dato;
            });  
            value=values;
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {$setOnInsert: value.trim()};
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    }
  },
  hireDate: {
    type: Date,
    label: 'Fecha de contratación',
    optional: true,
    autoform: {
      type: "pickadate",
      pickadateOptions: {
        format: 'dd/mm/yyyy',
        selectMonths: true,
        selectYears: 100
      }
    },
  },
  dismissalDate: {
    type: Date,
    label: 'Fecha de baja definitiva',
    optional: true,
    autoform: {
      type: "pickadate",
      pickadateOptions: {
        format: 'dd/mm/yyyy',
        selectMonths: true,
        selectYears: 100
      }
    },
  },
  cumple: {
    type:Date,
    label: 'Cumpleaños',
    optional: true,
    autoform: {
      type: "pickadate",
      pickadateOptions: {
        format: 'dd/mm',
        selectMonths: true,
        selectYears: false,
        onOpen: function() {
          $(".picker__year-display").remove();
        },
        onRender: function() {
          $(".picker__year-display").remove();
        },
        onSet: function() {
          $(".picker__year-display").remove();
        },
        klass: {
          year:'ClaseCumple'
        }
      }
    },
  },
  empPhoneNbr: {
    type: String,
    label: 'Teléfono fijo',
    optional: true,
    max: 15,
    defaultValue: ""
  },
  empCellNbr: {
    type: String,
    label: 'Teléfono celular',
    optional: true,
    max: 15,
    defaultValue: ""
  },
  roles: {
    type: Array,
  },
  'roles.$': {
    type: String,
    label:'Roles',
    allowedValues: ['Usuario Administrador', 'Supervisor', 'Usuario']
  },
  empEmail: { type: String, label: 'Email', optional: true,regEx: SimpleSchema.RegEx.Email},
  idmanager: orion.attribute('hasOne', {
    label: 'Jefe directo',
    optional: true
  }, {
    collection: Jefes,
    titleField: ['employeeName'],
    customPublication:true,
    publicationName: 'GetSelectOneJefe'
  }),
  idmanager_txt: {
    type: String,
    label: 'Jefe',      
    autoform: { type: "hidden" },
    autoValue: function() {
      var id = this.siblingField("idmanager").value;
      if (id) {
        var entity = Jefes.findOne({ _id: id });
        var valor = "";
        var fields = ["employeeName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              valor = valor + " " + res;
            }
          } else {
            if(entity && entity[fields[i]]){
              valor = valor + " " + entity[fields[i]];
            }                        
          }
        }
        
        if (this.isInsert && (this.value == null || !this.value.length)) {
          return valor;
        }
        if (this.isUpdate && this.isSet && this.operator === '$unset') {
          return { $set: valor};
        }
        if (this.isUpdate) {
          return valor;
        }
        if (this.isUpsert) {
          return valor;
        }
      } else {
        return "";
      }
    },
    optional: true,
  },
  idEnrol:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },

  // ******** TEMPLATES
  PersonIdBiometric:{ type: String, label: 'PersonIdBiometric', optional: true, autoform:{ type:"hidden" } },
  FaceTemplate:{ type: Boolean, label: 'FaceTemplate', optional: true, autoform:{ type:"hidden" } },
  FingerTemplate:{ type: Boolean, label: 'FingerTemplate', optional: true, autoform:{ type:"hidden" } },

  left_pulgares_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  left__indices_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  left___medios_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  left_anulares_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  left_meniques_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  //
  right_pulgars_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  right_indices_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  right__medios_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  right__anular_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  right_menique_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
  //
  face_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },

  // ******** NORMALES
  left_pulgares_left_normal: orion.attribute('image', {optional: true,label: 'Pulgar Izquierdo'}),
  left__indices_left_normal: orion.attribute('image', {optional: true,label: 'Indice Izquierdo'}),
  left___medios_left_normal: orion.attribute('image', {optional: true,label: 'Medio Izquierdo'}),
  left_anulares_left_normal: orion.attribute('image', {optional: true,label: 'Anular Izquierdo'}),
  left_meniques_left_normal: orion.attribute('image', {optional: true,label: 'Meñique Izquierdo'}),
  //
  right_pulgars_left_normal: orion.attribute('image', {optional: true,label: 'Pulgar Derecho'}),
  right_indices_left_normal: orion.attribute('image', {optional: true,label: 'Indice Derecho'}),
  right__medios_left_normal: orion.attribute('image', {optional: true,label: 'Medio Derecho'}),
  right__anular_left_normal: orion.attribute('image', {optional: true,label: 'Anular Derecho'}),
  right_menique_left_normal: orion.attribute('image', {optional: true,label: 'Meñique Derecho'}),

  // ******** BINARIAS
  left_pulgares_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
  left__indices_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
  left___medios_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
  left_anulares_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
  left_meniques_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
  right_pulgars_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
  right_indices_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
  right__medios_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
  right__anular_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
  right_menique_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),


  face: orion.attribute('image', {
    optional: true,
    label: 'Rostro de la persona'
  }),
  faceToken: orion.attribute('image', {
    optional: true,
    label: 'Token Facial'
  }),
  sign: orion.attribute('image', {
    optional: true,
    label: 'Huella Izquierda Binaria'
  }),
  mealsEmp:{
    type: Boolean,
    label: 'Imprimir Ticket',
    defaultValue: false
  },
  permissionEnrol:{
    type: Boolean,
    label: 'Enrolador',
    defaultValue: false
  },
  active: { type: Boolean, label: 'Activo', defaultValue: true},
  documents: { type: Array, optional: true },
  "documents.$": {
    optional: true,
    type: Object
  },
  "documents.$.name":orion.attribute("hasOne", {
    optional: true,
    label: "Nombre del documento"
  }, {
    collection: Documents,
    titleField: ["name"],
    customPublication:true,
    publicationName: "get_documents",
  }),
  "documents.$.file":orion.attribute("file", {
    optional: true,
    label: "Documento"
  }),
  //Termina la zona de los Documentos
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true }),
}));


Departments.attachSchema(new SimpleSchema({
  departmentName: {
    type: String,
    label: 'Nombre del departamento',
    help:"Nombre del Departamento",
    example:"Finanzas",
    optional:false,
    autoValue: function() {
      var departmentName = this.field("departmentName");
      if (departmentName.isSet) {
        if (departmentName && departmentName.value) {
          return departmentName.value.toUpperCase();
        }
      } else {
        this.unset();
      }
    }
  },
  departmentDesc: {
    type: String,
    label: 'Descripción del Departamento',
    help:"Descripción del Departamento",
    example:"---",
    optional: true,
    autoValue: function() {
      var departmentDesc = this.field("departmentDesc");
      if (departmentDesc.isSet) {
        if(departmentDesc && departmentDesc.value){
          return departmentDesc.value.toUpperCase();
        }        
      } else {
        this.unset();
      }
    }
  },
  idLocation_txt: {
    type: String,
    label: 'Localidad',
    optional: true,
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      var id = this.siblingField("idLocation").value;
      if (id) {
        var entity = Locations.findOne({
          _id: id
        });
        var value = "";
        var fields = ["locationName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Locations.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Locations.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            if(entity && entity[fields[i]]){
              value = value + " " + entity[fields[i]];
            }            
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: value.trim()
          };
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    },
  },
  idLocation: orion.attribute('hasOne', {
    label: 'Nombre de la localidad',
    optional: true,
    help:"Nombre de la localidad",
    example:"---",
    defaultValue:""
  }, {
    collection: Locations,
    titleField: ['locationName'],
    customPublication:true,
    publicationName: 'GetSelectOneLocations',
  }),
  idmanager: {
    type: String,
    optional: true,
    defaultValue: "",
    autoValue: function() {
      var id = this.siblingField("idmanager").value;
      if (id) {
        var entity = Employees.findOne({
          _id: id
        });
        var value = "";
        var fields = ["employeeName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Employees.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Employees.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            value = value + " " + entity[fields[i]];
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: value.trim()
          };
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    },
  },
  idmanager: orion.attribute('hasMany', {
    label: 'Responsable',
    optional: true,
    help:"Responsable del Departamento",
    example:"---"
  }, {
    collection: Jefes,
    titleField: ['employeeName'],
    customPublication:true,
    publicationName: 'GetSelectOneJefe'
  }),
  idmanager_txt:{
    type: String,
    label: 'Responsable',
    optional: true,
    autoform: { type: "hidden" },
    autoValue: function() {
      var id = this.siblingField("idmanager").value;
      if (id) {
        LaColleccion=Jefes;
        var entity = LaColleccion.find({ _id: {$in:id} }).fetch();
        var value = "";
        var fields = ["employeeName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            var values="";
            entity.forEach(element => {
              var dato=element[fields[i]]+" ";
              values+=dato;
            });  
            value=values;
          }
        }
        if (this.isInsert && (this.value == null || !this.value.length)) {
          return value;
        }
        if (this.isUpdate && this.isSet && this.operator === '$unset') {
          return { $set: value};
        }
        if (this.isUpdate) {
          return value;
        }
        if (this.isUpsert) {
          return value;
        }
      } else {
        return "";
      }
    }
  },
  idcompany_txt: {
    type: String,
    label: 'Compañia',
    optional: true,
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      var id = this.siblingField("idcompany").value;
      if (id) {
        var entity = Companies.findOne({
          _id: id
        });
        var value = "";
        var fields = ["companyName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            value = value + " " + entity[fields[i]];
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: value.trim()
          };
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    },
  },
  idcompany: orion.attribute('hasOne', {
    label: 'Nombre de la Compañia',
    help:"Nombre de la Compañia",
    example:"---",
    optional:false
  }, {
    collection: Companies,
    titleField: ['companyName'],
    publicationName: 'Department_Compañia',
    validateOnServer: false,
    filter: function(userId) {
      if (userId) {
        var user = Meteor.users.findOne(userId);
        if (Roles.userHasRole(userId,"admin")) {
          return { _id: {$ne: ""}};
        }else {
          return { _id:{$in: user.profile.idcompany }};
        }
      }
    }
  }),
  active: {
    type: Boolean,
    label: 'Activo',
    help:"Registro activo",
    example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    defaultValue: true
  },
  createdBy: orion.attribute('createdBy'),  // Estos campos siempre se ponen, el meteor los llena solito
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', {
    optional: true
  }),
  updatedAt: orion.attribute('updatedAt', {
    optional: true
  }),
}));

Employeespositions.attachSchema(new SimpleSchema({
  empPosName: {
    type: String,
    label: 'Nombre del Puesto',
    help:"Nombre del Puesto",
    example:"Contador",
    optional:true,
    autoValue: function() {
      var empPosName = this.field("empPosName");
      if (empPosName.isSet) {
        return empPosName.value.toUpperCase();
      } else {
        this.unset();
      }
    }
  },
  empPosDesc: {
    type: String,
    label: 'Descripción del Puesto',
    help:"Descripción del Puesto",
    example:"---",
    optional:true,
    autoValue: function() {
      var empPosDesc = this.field("empPosDesc");
      if (empPosDesc.isSet) {
        return empPosDesc.value.toUpperCase();
      } else {
        this.unset();
      }
    }
  },
  idcompany: {
    type: String,
    label: 'Compañia',
    optional: true,
    autoform: { type: "hidden" },
    autoValue: function() {
      var id = this.siblingField("idcompany").value;
      if (id) {
        var entity = Companies.findOne({ _id: id });
        var value = "";
        var fields = ["companyName"];
        for (var i = 0; i < fields.length; i++) {
          if (fields[i].endsWith("_id")) {
            var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
            var resultx = orion.collections.list[otraCollectionFK]._collection.find({
              _id: entity[fields[i]]
            }).fetch();
            var res;
            var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
            var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
              _id: entity[fields[i]]
            });
            if (resultx) {
              if (_.isArray(theTitleField)) {
                res = titleField.map((field) => {
                  return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }).join(" ");
              } else {
                res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
              }
              value = value + " " + res;
            }
          } else {
            value = value + " " + entity[fields[i]];
          }
        }
        if (this.isInsert || this.isUpdate) {
          return value.trim();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: value.trim()
          };
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    },
  },
  idcompany: orion.attribute('hasOne', { // Esta es definicion de un campo foraneo, que pone el id de un registro de otra tabla
    label: 'Nombre de la Compañia',
    help:"Nombre de la Compañia",
    example:"---",
    defaultValue: ""
  }, {
    validateOnServer :false,
    collection: Companies,
    titleField: ['companyName'],
    publicationName: 'Companies_Puestos',
    validateOnServer :false,
    filter: function(userId) {
      if (userId) {
        var user = Meteor.users.findOne(userId);
        if (Roles.userHasRole(userId,"admin")) {
          return { _id: {$ne: ""}};
        }else {
          return { _id:{$in: user.profile.idcompany }};
        }
      }
    }
  }),
  active: {
    type: Boolean,
    label: 'Activo',
    help:"Registro activo",
    example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    defaultValue: true
  },
  createdBy: orion.attribute('createdBy'),
  createdAt: orion.attribute('createdAt'),
  updatedBy: orion.attribute('updatedBy', { optional: true }),
  updatedAt: orion.attribute('updatedAt', { optional: true })
  }));

  Employeestatuses.attachSchema(new SimpleSchema({
    empStatusName: {
      type: String,
      label: 'Nombre del Estatus',
      help:"Nombre del Estatus",
      example:"Activo",
      autoValue: function() {
        var empStatusName = this.field("empStatusName");
        if (empStatusName.isSet) {
          return empStatusName.value.toUpperCase();
        } else {
          this.unset();
        }
      }

    },
    empStatusDesc: {
      type: String,
      label: 'Descripción del Estatus',
      help:"Descripción del Estatus",
      example:"---",
      autoValue: function() {
        var empStatusDesc = this.field("empStatusDesc");
        if (empStatusDesc.isSet) {
          return empStatusDesc.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true,
      help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    },
    createdBy: orion.attribute('createdBy'),  // Estos campos siempre se ponen, el meteor los llena solito
    createdAt: orion.attribute('createdAt'),
    updatedBy: orion.attribute('updatedBy', {
      optional: true
    }),
    updatedAt: orion.attribute('updatedAt', {
      optional: true
    }),
  }));

  Devices.attachSchema(new SimpleSchema({
    idLocation: {
      type: String,
      label: 'Localidad',
      autoValue: function() {
        var id = this.siblingField("idLocation").value;
        if (id) {
          var entity = Locations.findOne({
            _id: id
          });
          var value = "";
          var fields = ["locationName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Locations.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Locations.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idLocation: orion.attribute('hasOne', {
      label: 'localidad',
      optional:true,
    }, {
      collection: Locations,
      titleField: ['locationName'],
      publicationName: 'localidad_dispositivos',
      validateOnServer :false,
    }),

    deviceType: {
      type: String,
      label: 'Tipo de Dispositivo',
      optional:esOpcional(),
      autoValue: function() {
        var deviceType = this.field("deviceType");
        if (deviceType.isSet) {
          return deviceType.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    deviceName: { type: String, label: 'Nombre del Dispositivo', optional: true, },
    deviceModel: { type: String, label: 'Modelo', optional: true, },
    deviceSerial: {
      type: String,
      label: 'Serial de Dispositivo',
      optional: true,
    },
    deviceStatus: {
      type: String,
      label: 'Status de Dispositivo',
      optional:true
    },
    deviceUsage: {
      type: Number,
      label: 'Uso de Dispositivo',
      optional: true,
    },
    applicationId: {
      type: String,
      label: 'ID de Aplicacion',
      optional: true,
    },
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true
    },

    createdBy: orion.attribute('createdBy'),  // Estos campos siempre se ponen, el meteor los llena solito
    createdAt: orion.attribute('createdAt'),
    updatedBy: orion.attribute('updatedBy', {
      optional: true
    }),
    updatedAt: orion.attribute('updatedAt', {
      optional: true
    }),
  }));

  Cameras.attachSchema(new SimpleSchema({
    idLocation: {
      type: String,
      label: 'Localidad',
      autoValue: function() {
        var id = this.siblingField("idLocation").value;
        if (id) {
          var entity = Locations.findOne({
            _id: id
          });
          var value = "";
          var fields = ["locationName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Locations.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Locations.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idLocation: orion.attribute('hasOne', {
      label: 'localidad',
      optional:true,
    }, {
      collection: Locations,
      titleField: ['locationName'],
      publicationName: 'localidad_dispositivo2',
      validateOnServer :false,
    }),

    deviceType: {
      type: String,
      label: 'Tipo de Dispositivo',
      optional:esOpcional(),
      autoValue: function() {
        var deviceType = this.field("deviceType");
        if (deviceType.isSet) {
          return deviceType.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    deviceSerial: {
      type: String,
      label: 'Serial de Dispositivo',
      optional: true,
    },
    deviceName: { type: String, label: 'Nombre del Disposition', optional:true },
    deviceStatus: {
      type: String,
      label: 'Status de Dispositivo',
      optional:true
    },
    deviceUsage: {
      type: Number,
      label: 'Uso de Dispositivo',
      optional: true,
    },
    applicationId: {
      type: String,
      label: 'ID de Aplicacion',
      optional: true,
    },
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true
    },

    createdBy: orion.attribute('createdBy'),  // Estos campos siempre se ponen, el meteor los llena solito
    createdAt: orion.attribute('createdAt'),
    updatedBy: orion.attribute('updatedBy', {
      optional: true
    }),
    updatedAt: orion.attribute('updatedAt', {
      optional: true
    }),
  }));

  Microphone.attachSchema(new SimpleSchema({
    idLocation: {
      type: String,
      label: 'Localidad',
      autoValue: function() {
        var id = this.siblingField("idLocation").value;
        if (id) {
          var entity = Locations.findOne({
            _id: id
          });
          var value = "";
          var fields = ["locationName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Locations.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Locations.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idLocation: orion.attribute('hasOne', {
      label: 'localidad',
      optional:true,
    }, {
      collection: Locations,
      titleField: ['locationName'],
      publicationName: 'localidad_dispositivo3',
      validateOnServer :false,
    }),

    deviceType: {
      type: String,
      label: 'Tipo de Dispositivo',
      optional:esOpcional(),
      autoValue: function() {
        var deviceType = this.field("deviceType");
        if (deviceType.isSet) {
          return deviceType.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    deviceSerial: {
      type: String,
      label: 'Serial de Dispositivo',
      optional: true,
    },
    deviceName: {
      type: String,
      label: 'Serial de Dispositivo',
      optional: true,
    },
    deviceModel: {
      type: String,
      label: 'Serial de Dispositivo',
      optional: true,
    },
    deviceStatus: {
      type: String,
      label: 'Status de Dispositivo',
      optional:true
    },
    deviceUsage: {
      type: Number,
      label: 'Uso de Dispositivo',
      optional: true,
    },
    applicationId: {
      type: String,
      label: 'ID de Aplicacion',
      optional: true,
    },
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true
    },

    createdBy: orion.attribute('createdBy'),  // Estos campos siempre se ponen, el meteor los llena solito
    createdAt: orion.attribute('createdAt'),
    updatedBy: orion.attribute('updatedBy', {
      optional: true
    }),
    updatedAt: orion.attribute('updatedAt', {
      optional: true
    }),
  }));

  Iris.attachSchema(new SimpleSchema({
    idLocation: {
      type: String,
      label: 'Localidad',
      autoValue: function() {
        var id = this.siblingField("idLocation").value;
        if (id) {
          var entity = Locations.findOne({
            _id: id
          });
          var value = "";
          var fields = ["locationName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Locations.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Locations.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idLocation: orion.attribute('hasOne', {
      label: 'localidad',
      optional:true,
    }, {
      collection: Locations,
      titleField: ['locationName'],
      publicationName: 'localidad_dispositivo',
      validateOnServer :false,
    }),

    deviceType: {
      type: String,
      label: 'Tipo de Dispositivo',
      optional:esOpcional(),
      autoValue: function() {
        var deviceType = this.field("deviceType");
        if (deviceType.isSet) {
          return deviceType.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    deviceSerial: {
      type: String,
      label: 'Serial de Dispositivo',
      optional: true,
    },
    deviceStatus: {
      type: String,
      label: 'Status de Dispositivo',
      optional:true
    },
    deviceUsage: {
      type: Number,
      label: 'Uso de Dispositivo',
      optional: true,
    },
    applicationId: {
      type: String,
      label: 'ID de Aplicacion',
      optional: true,
    },
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true
    },

    createdBy: orion.attribute('createdBy'),  // Estos campos siempre se ponen, el meteor los llena solito
    createdAt: orion.attribute('createdAt'),
    updatedBy: orion.attribute('updatedBy', {
      optional: true
    }),
    updatedAt: orion.attribute('updatedAt', {
      optional: true
    }),
  }));

  Employees.attachSchema(new SimpleSchema({
    idEmployee: {
      type: Number,
      label: 'N° de Colaborador',
      optional:false,
      custom: function() {
        if (Meteor.isClient && this.isSet) {
          Meteor.call("idEmployeeExists",this.value,function(err,result){
            if(result){
              if(result=="existe"){
                Employees.simpleSchema().namedContext("orionMaterializeCollectionsCreateForm_XPz").addInvalidKeys([{name: "idEmployee", type: "idEmployeeFound"}]);
              }
            }
          });
        }
      }
    },
    employeeName: {
      type: String,
      label: 'Nombre',
      optional:false,
      autoValue: function() {
        var employeeName = this.field("employeeName");
        if (employeeName.isSet) {
          return employeeName.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    idEmpPosition: {
      type: String,
      label: 'Puesto',
      optional: false,
      autoform: {
        afFieldInput: {
          type: 'autocomplete-input',
          settings: {
              position: "top",
              limit: 5,
              rules: [
               {
                 collection: Employeespositions,
                 field: "empPosName",
                 matchAll: true,
                 template: Meteor.isClient &&Template.EmployeespositionsX,
                 noMatchTemplate:Meteor.isClient && Template.SinCoincidencias
               }
              ]
          }
        }
      },
      custom: function() {
        if (Meteor.isClient && this.isSet) {
          Meteor.call("idEmpPositionExists",this.value,function(err,result){
            if(result){
              if(result=="noexiste"){
                Employees.simpleSchema().namedContext("orionMaterializeCollectionsCreateForm_XPz").addInvalidKeys([{name: "idEmpPosition", type: "notAllowedx"}]);
              }
            }
          });
        }
      }
    },
    // idEmpPosition: {
    //   type: String,
    //   label: 'Puesto',
    //   optional:false,
    //   autoform: {
    //     firstOption: false,
    //     type: "hidden"
    //   }
    // },
    // idEmpPosition: orion.attribute('hasOne', {
    //   label: 'Puesto',
    //   optional:false,
    // }, {
    //   collection: Employeespositions,
    //   titleField: ['empPosName'],
    //   publicationName: 'Empleados_Puestos',
    //   validateOnServer :false,
    //   filter: function(userId) {
    //     if (userId) {
    //       var user = Meteor.users.findOne(userId);
    //       if (Roles.userHasRole(userId,"admin")) {
    //         return {};
    //       }else {
    //         var arrasy=[];
    //         arrasy=user.profile.idcompany;
    //         return {
    //           idcompany : {$in:arrasy},
    //           active:true
    //         };
    //       }
    //     }
    //   }
    // }),
    idEmpStatus: {
      type: String,
      label: 'Estatus',
      optional:false,
      autoform: {
        type: "hidden"
      },
    },
    idEmpStatus: orion.attribute('hasOne', {
      label: 'Estatus',
      optional:false,
    }, {
      collection: Employeestatuses,
      titleField: ['empStatusName'],
      publicationName: 'Empleados_Estatus',
      validateOnServer :false
    }),
    idcompany: orion.attribute('hasMany', {
      label: 'Nombre de la compañia',
      optional:false
    }, {
      collection: Companies,
      titleField: ['companyName'],
      customPublication:true,
      publicationName: 'GetSelectOneCompanies'
    }),
    idDepartment: orion.attribute('hasOne', {
      label: 'Nombre de Departamento',
      optional:false,
    }, {
      collection: Departments,
      titleField: ['departmentName'],
      customPublication:true,
      publicationName:'GetSelectOneDepartments'
    }),
    idLocation: orion.attribute('hasOne', {
      label: 'Nombre de la Localidad',
      optional:false
    }, {
      collection: Locations,
      titleField: ['locationName'],
      customPublication:true,
      publicationName: 'GetSelectOneLocations'
    }),
    hireDate: {
      type: Date,
      label: 'Fecha de contratación (Opcional)',
      optional: true,
      autoform: {
        type: "pickadate",
        pickadateOptions: {
          format: 'dd/mm/yyyy',
          selectMonths: true,
          selectYears: 100
        }
      },
    },
    cumple: {
      type:Date,
      label: 'Cumpleaños (Opcional)',
      optional: true,
      autoform: {
        type: "pickadate",
        pickadateOptions: {
          format: 'dd/mm',
          selectMonths: true,
          selectYears: false,
          onOpen: function() {
            $(".picker__year-display").remove();
          },
          onRender: function() {
            $(".picker__year-display").remove();
          },
          onSet: function() {
            $(".picker__year-display").remove();
          },
          klass: {
            year:'ClaseCumple'
          }
        }
      },
    },
    empPhoneNbr: {
      type: String,
      label: 'Teléfono fijo (Opcional)',
      optional: true,
      max: 15,
      defaultValue: ""
    },
    empCellNbr: {
      type: String,
      label: 'Teléfono celular (Opcional)',
      optional: true,
      max: 15,
      defaultValue: ""
    },
    empEmail: {
      type: String,
      label: 'Correo electrónico (Opcional)',
      optional: true,
      regEx: SimpleSchema.RegEx.Email
    },
    empPhoto: orion.attribute('image', {
      optional: true,
      label: 'Fotografía'
    }),
    left_png: orion.attribute('image', {
      optional: true,
      label: 'Fotografía'
    }),
    right_png: orion.attribute('image', {
      optional: true,
      label: 'Fotografía'
    }),
    empFpTpl1:{
      type:String,
      label: 'Huella dedo izquierdo',
      defaultValue:"000000000000000000000000",
      optional:true,
      autoform: {
        type: "hidden"
      }
    },
    empFpTpl2:{
      type:String,
      label: 'Huella dedo derecho',
      defaultValue:"000000000000000000000000",
      optional: true,  autoform: {
        type: "hidden"
      }
    },
    idenrol: {
      type: String,
      label: 'ID de Enrolamiento',
      optional: true,
      autoform: {
        type: "hidden"
      },
    },
	  PersonIdBiometric:{ type: String, label: 'PersonIdBiometric', optional: true, autoform:{ type:"hidden" } },
	  FaceTemplate:{ type: Boolean, label: 'FaceTemplate', optional: true, autoform:{ type:"hidden" } },
	  FingerTemplate:{ type: Boolean, label: 'FingerTemplate', optional: true, autoform:{ type:"hidden" } },

	  left_pulgares_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  left__indices_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  left___medios_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  left_anulares_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  left_meniques_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  //
	  right_pulgars_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  right_indices_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  right__medios_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  right__anular_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  right_menique_left_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },
	  //
	  face_template:{ type: String, label: 'Id Enrol', optional: true, autoform:{ type:"hidden" } },

	  // ******** NORMALES
	  left_pulgares_left_normal: orion.attribute('image', {optional: true,label: 'Pulgar Izquierdo'}),
	  left__indices_left_normal: orion.attribute('image', {optional: true,label: 'Indice Izquierdo'}),
	  left___medios_left_normal: orion.attribute('image', {optional: true,label: 'Medio Izquierdo'}),
	  left_anulares_left_normal: orion.attribute('image', {optional: true,label: 'Anular Izquierdo'}),
	  left_meniques_left_normal: orion.attribute('image', {optional: true,label: 'Meñique Izquierdo'}),
	  //
	  right_pulgars_left_normal: orion.attribute('image', {optional: true,label: 'Pulgar Derecho'}),
	  right_indices_left_normal: orion.attribute('image', {optional: true,label: 'Indice Derecho'}),
	  right__medios_left_normal: orion.attribute('image', {optional: true,label: 'Medio Derecho'}),
	  right__anular_left_normal: orion.attribute('image', {optional: true,label: 'Anular Derecho'}),
	  right_menique_left_normal: orion.attribute('image', {optional: true,label: 'Meñique Derecho'}),

	  // ******** BINARIAS
	  left_pulgares_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  left__indices_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  left___medios_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  left_anulares_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  left_meniques_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  right_pulgars_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  right_indices_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  right__medios_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  right__anular_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  right_menique_left_binaria: orion.attribute('image', {optional: true,label: 'Huella Binaria',autoform:{ type:"hidden" }}),
	  documents: { type: Array, optional: true },
	  "documents.$": {
		optional: true,
		type: Object
	  },
	  "documents.$.name":orion.attribute("hasOne", {
		optional: true,
		label: "Nombre del documento"
	  }, {
      collection: Documents,
      titleField: ["name"],
      customPublication:true,
      publicationName: "get_documents",
	  }),
	  "documents.$.file":orion.attribute("file", {
		optional: true,
		label: "Documento"
	  }),
    idmanager: {
      type: String,
      label: 'Jefe (Opcional)',
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'autocomplete-input',
          settings: {
              position: "top",
              limit: 5,
              rules: [
               {
                 collection: Jefes,
                 field: "employeeName",
                 filter:{active:true},
                 matchAll: true,
                 template:Meteor.isClient && Template.standardLegends,
                 noMatchTemplate:Meteor.isClient && Template.SinCoincidencias
               }
              ]
          }
        }
      },
      custom: function() {
        if (Meteor.isClient && this.isSet) {
          Meteor.call("idmanagerExists",this.value,function(err,result){
            if(result){
              if(result=="noexiste"){
                Employees.simpleSchema().namedContext("orionMaterializeCollectionsCreateForm_XPz").addInvalidKeys([{name: "idmanager", type: "notAllowedx"}]);
              }
            }
          });
        }
      }
    },
    // idmanager: orion.attribute('hasOne', {
    //   label: 'JEFE',
    //   optional: true,
    //   defaultValue: ""
    // }, {
    //   collection: Persons,
    //   titleField: ['employeeName'],
    //   publicationName: 'Empleados_manager',
    //   validateOnServer :false,
    //    filter:function(userId){
    //      if (userId) {
    //        var user = Meteor.users.findOne(userId);
    //       if (Roles.userHasRole(userId,"admin")) {
    //         return { idcompany: {$ne: ""}};
    //       }else {
    //         return { idcompany: user.profile.idcompany };
    //       }
    //     }
    //   }
    // }),
    mealsEmp:{
      type: Boolean,
      label: 'Puede Imprimir Tickets de alimentos',
      defaultValue: false
    },
    permissionEnrol:{
      type: Boolean,
      label: 'Enrolador',
      defaultValue: false
    },
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true
    },
    roles: {
      type: Array,
    },
    'roles.$': {
      type: String,
      label:'Roles',
      allowedValues: ['Usuario Administrador', 'Supervisor', 'Usuario']
    },
    idpagadora: orion.attribute('hasOne',{ label: 'Outsourcing (Opcional)', optional: true, }, {
      collection: Pagadoras,
      titleField: ['pagadoraName'],
      customPublication:true,
      publicationName: 'getPagadoras',
    }),
    idpagadora_txt: {
      type: String,
      label:'Nombre del Outsourcing',
      optional: true,
      autoform:{ type:"hidden" },
      autoValue: function() {
        var id = this.siblingField("idpagadora").value;
        if (id) {
          LaColleccion=Pagadoras;
          var entity = LaColleccion.find({ _id: id}).fetch();
          var value = "";
          var fields = ["pagadoraName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              var values="";
              entity.forEach(element => {
                var dato=element[fields[i]]+" ";
                values+=dato;
              });  
              value=values;
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {$setOnInsert: value.trim()};
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      }
    },
    idDireccion: orion.attribute('hasOne',{ label: 'Dirección Corporativa (Opcional)', optional: true, }, {
      collection: Direcciones,
      titleField: ['direccionName'],
      customPublication:true,
      publicationName: 'getDirecciones',
    }),
    idDireccion_txt: {
      type: String,
      label:'Nombre de la direccion',
      optional: true,
      autoform:{ type:"hidden" },
      autoValue: function() {
        var id = this.siblingField("idDireccion").value;
        if (id) {
          LaColleccion=Direcciones;
          var entity = LaColleccion.find({ _id: id}).fetch();
          var value = "";
          var fields = ["direccionName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              var values="";
              entity.forEach(element => {
                var dato=element[fields[i]]+" ";
                values+=dato;
              });  
              value=values;
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {$setOnInsert: value.trim()};
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      }
    },
    idArea: orion.attribute('hasOne',{ label: 'Áreas (Opcional)', optional: true, }, {
      collection: Areas,
      titleField: ['areaName'],
      customPublication:true,
      publicationName: 'getAreas',
    }),
    idArea_txt: {
      type: String,
      label:'Nombre de la direccion',
      optional: true,
      autoform:{ type:"hidden" },
      autoValue: function() {
        var id = this.siblingField("idArea").value;
        if (id) {
          LaColleccion=Areas;
          var entity = LaColleccion.find({ _id: id}).fetch();
          var value = "";
          var fields = ["areaName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              var values="";
              entity.forEach(element => {
                var dato=element[fields[i]]+" ";
                values+=dato;
              });  
              value=values;
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {$setOnInsert: value.trim()};
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      }
    },
    idProyecto: orion.attribute('hasOne',{ label: 'Proyecto (Opcional)', optional: true, }, {
      collection: Proyectos,
      titleField: ['proyectoName'],
      customPublication:true,
      publicationName: 'getProyectos',
    }),
    idProyecto_txt: {
      type: String,
      label:'Nombre de la direccion',
      optional: true,
      autoform:{ type:"hidden" },
      autoValue: function() {
        var id = this.siblingField("idProyecto").value;
        if (id) {
          LaColleccion=Proyectos;
          var entity = LaColleccion.find({ _id: id}).fetch();
          var value = "";
          var fields = ["proyectoName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              var values="";
              entity.forEach(element => {
                var dato=element[fields[i]]+" ";
                values+=dato;
              });  
              value=values;
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {$setOnInsert: value.trim()};
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      }
    },
    createdBy: orion.attribute('createdBy'),  // Estos campos siempre se ponen, el meteor los llena solito
    createdAt: orion.attribute('createdAt'),
    updatedBy: orion.attribute('updatedBy', {
      optional: true
    }),
    updatedAt: orion.attribute('updatedAt', {
      optional: true
    }),
  }, {tracker: Tracker}));

  /// SCHEMA Documents
  Documents.attachSchema(new SimpleSchema({
    name: {
      type: String,
      label: 'Nombre del Documento',
      help:"Nombre del documento que sera almacenado",
      example:"Acta de nacimiento",
      optional:false,
      autoValue: function() {
        var locationName = this.field("name");
        if (locationName.isSet) {
          return locationName.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    idcompany: {
      type: String,
      label: 'Compañia',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idcompany").value;
        if (id) {
          var entity = Companies.findOne({ _id: id });
          var value = "";
          var fields = ["companyName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idcompany: orion.attribute('hasOne', {
      label: 'Nombre de la Compañia',
      help:"Nombre de la Compañia",
      example:"---",
      optional:false
    }, {
      collection: Companies,
      titleField: ['companyName'],
      customPublication:true,
      publicationName: 'GetSelectOneCompanies',
    }),
    active: {
      type: Boolean,
      label: 'Activo',
      help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",
      defaultValue: true
    },
    createdBy: orion.attribute('createdBy'),
    createdAt: orion.attribute('createdAt'),
    updatedBy: orion.attribute('updatedBy', { optional: true }),
    updatedAt: orion.attribute('updatedAt', { optional: true })
  }));





  Restaurants.attachSchema(new SimpleSchema({
    restaurantName: {
      type: String,
      label: 'Nombre del Restaurante',
      help:"Nombre del restaurante proveedor de alimentos",
      example:"Taco Green",
      optional:false,
      autoValue: function() {
        var locationName = this.field("restaurantName");
        if (locationName.isSet) {
          return locationName.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    restaurantDesc: {
      type: String,
      label: 'Descripción del Restaurante',
      help:"Descripción del Restaurante",
      example:"---",
      optional:true,
    },
    contactPerson: {
      type: String,
      label: 'Nombre del Contacto',
      help:"Nombre de la persona encargada del Restaurante",
      example:"---",
      optional:true,
    },
    restEmail: {
      type: String,
      label: 'Email',
      help:"Correo electrónico del Restaurante",
      example:"---",
      optional: true,
      regEx: SimpleSchema.RegEx.Email
    },
    restPhone: {
      type: String,
      label: 'Teléfono',
      optional: true,
      help:"Teléfono del Restaurante",
      example:"5512345678",
      max: 15,
      defaultValue: ""
    },
    restAddr: {
      type: String,
      label: 'Dirección',
      optional: true,
      help:"Dirección del Restaurante",
      example:"Ciudad de México",
      defaultValue: ""
    },
    idcompany: orion.attribute('hasOne', {
      label: 'Nombre de la Compañia',
      optional:false,
      help:"Nombre de la Compañia",
      example:"---",
    }, {
      collection: Companies,
      titleField: ['companyName'],
      customPublication:true,
      publicationName: 'GetSelectOneCompanies'
    }),
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true,
      help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    },
    createdBy: orion.attribute('createdBy'),  // Estos campos siempre se ponen, el meteor los llena solito
    createdAt: orion.attribute('createdAt'),
    updatedBy: orion.attribute('updatedBy', {
      optional: true
    }),
    updatedAt: orion.attribute('updatedAt', {
      optional: true
    }),
  }));


  Pagadoras.attachSchema(new SimpleSchema({
    pagadoraName: {
      type: String,
      label: 'Nombre del Outsourcing',
      help:"Nombre del Outsourcing",
      example:"GIN",
      optional:false,
      autoValue: function() {
        var locationName = this.field("pagadoraName");
        if (locationName.isSet) {
          return locationName.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    pagadoraDesc: { type: String, label: 'Descripción del Outsourcing', help:"Descripción del Outsourcing", example:"---", optional:true, },
    idcompany_txt: {
      type: String,
      label: 'Compañia',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idcompany").value;
        if (id) {
          var entity = Companies.findOne({ _id: id });
          var value = "";
          var fields = ["companyName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idcompany: orion.attribute('hasOne', {
      label: 'Nombre de la Compañia',
      optional:false,
      help:"Nombre de la Compañia",
      example:"---",
    }, {
      collection: Companies,
      titleField: ['companyName'],
      customPublication:true,
      publicationName: 'GetSelectOneCompanies'
    }),
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true,
      help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    },
    createdBy: orion.attribute('createdBy', { optional: true }),
    createdAt: orion.attribute('createdAt', { optional: true }),
    updatedBy: orion.attribute('updatedBy', { optional: true }),
    updatedAt: orion.attribute('updatedAt', { optional: true })
  }));

  Direcciones.attachSchema(new SimpleSchema({
    direccionName: {
      type: String,
      label: 'Nombre de la Dirección',
      help:"Nombre del Dirección",
      example:"SERVICIOS",
      optional:false,
      autoValue: function() {
        var locationName = this.field("direccionName");
        if (locationName.isSet) {
          return locationName.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    direccionDesc: { type: String, label: 'Descripción de la Dirección', help:"Descripción de la Dirección", example:"---", optional:true, },
    idJefe: orion.attribute('hasOne', {
      label: 'Responsable',
      optional: true
    }, {
      collection: Jefes,
      titleField: ['employeeName'],
      customPublication:true,
      publicationName: 'GetSelectOneJefe'
    }),
    idJefe_txt: {
      type: String,
      label: 'Jefe',      
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idJefe").value;
        if (id) {
          var entity = Jefes.findOne({ _id: id });
          var valor = "";
          var fields = ["employeeName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                valor = valor + " " + res;
              }
            } else {
              valor = valor + " " + entity[fields[i]];
            }
          }
          
          if (this.isInsert && (this.value == null || !this.value.length)) {
            return valor;
          }
          if (this.isUpdate && this.isSet && this.operator === '$unset') {
            return { $set: valor};
          }
          if (this.isUpdate) {
            return valor;
          }
          if (this.isUpsert) {
            return valor;
          }
        } else {
          return "";
        }
      },
      optional: true,
    },
    idcompany_txt: {
      type: String,
      label: 'Compañia',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idcompany").value;
        if (id) {
          var entity = Companies.findOne({ _id: id });
          var value = "";
          var fields = ["companyName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idcompany: orion.attribute('hasOne', {
      label: 'Nombre de la Compañia',
      optional:false,
      help:"Nombre de la Compañia",
      example:"---",
    }, {
      collection: Companies,
      titleField: ['companyName'],
      customPublication:true,
      publicationName: 'GetSelectOneCompanies'
    }),
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true,
      help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    },
    createdBy: orion.attribute('createdBy', { optional: true }),
    createdAt: orion.attribute('createdAt', { optional: true }),
    updatedBy: orion.attribute('updatedBy', { optional: true }),
    updatedAt: orion.attribute('updatedAt', { optional: true })
  }));

  Areas.attachSchema(new SimpleSchema({
    areaName: {
      type: String,
      label: 'Nombre del área',
      help:"Nombre del área",
      example:"SERVICIOS",
      optional:false,
      autoValue: function() {
        var locationName = this.field("areaName");
        if (locationName.isSet) {
          return locationName.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    areaDesc: { type: String, label: 'Descripción del área', help:"Descripción del área", example:"---", optional:true, },
    idJefe: orion.attribute('hasMany', {label: 'Responsable', optional: true}, {
      collection: Jefes,
      titleField: ['employeeName'],
      customPublication:true,
      publicationName: 'GetSelectOneJefe',
    }),
    idJefe_txt:{
      type: String,
      label: 'Responsable',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idJefe").value;
        if (id) {
          LaColleccion=Jefes;
          var entity = LaColleccion.find({ _id: {$in:id} }).fetch();
          var value = "";
          var fields = ["employeeName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = LaColleccion.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = LaColleccion.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              var values="";
              entity.forEach(element => {
                var dato=element[fields[i]]+" ";
                values+=dato;
              });  
              value=values;
            }
          }
          if (this.isInsert && (this.value == null || !this.value.length)) {
            return value;
          }
          if (this.isUpdate && this.isSet && this.operator === '$unset') {
            return { $set: value};
          }
          if (this.isUpdate) {
            return value;
          }
          if (this.isUpsert) {
            return value;
          }
        } else {
          return "";
        }
      }
    },
    idcompany_txt: {
      type: String,
      label: 'Compañia',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idcompany").value;
        if (id) {
          var entity = Companies.findOne({ _id: id });
          var value = "";
          var fields = ["companyName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idcompany: orion.attribute('hasOne', {
      label: 'Nombre de la Compañia',
      optional:false,
      help:"Nombre de la Compañia",
      example:"---",
    }, {
      collection: Companies,
      titleField: ['companyName'],
      customPublication:true,
      publicationName: 'GetSelectOneCompanies'
    }),
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true,
      help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    },
    createdBy: orion.attribute('createdBy', { optional: true }),
    createdAt: orion.attribute('createdAt', { optional: true }),
    updatedBy: orion.attribute('updatedBy', { optional: true }),
    updatedAt: orion.attribute('updatedAt', { optional: true })
  }));

  Proyectos.attachSchema(new SimpleSchema({
    proyectoName: {
      type: String,
      label: 'Nombre del proyecto',
      help:"Nombre del proyecto",
      example:"SERVICIOS",
      optional:false,
      autoValue: function() {
        var locationName = this.field("proyectoName");
        if (locationName.isSet) {
          return locationName.value.toUpperCase();
        } else {
          this.unset();
        }
      }
    },
    proyectoDesc: { type: String, label: 'Descripción del proyecto', help:"Descripción del proyecto", example:"---", optional:true, },
    idcompany_txt: {
      type: String,
      label: 'Compañia',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idcompany").value;
        if (id) {
          var entity = Companies.findOne({ _id: id });
          var value = "";
          var fields = ["companyName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idcompany: orion.attribute('hasOne', {
      label: 'Nombre de la Compañia',
      optional:false,
      help:"Nombre de la Compañia",
      example:"---",
    }, {
      collection: Companies,
      titleField: ['companyName'],
      customPublication:true,
      publicationName: 'GetSelectOneCompanies'
    }),
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true,
      help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    },
    createdBy: orion.attribute('createdBy', { optional: true }),
    createdAt: orion.attribute('createdAt', { optional: true }),
    updatedBy: orion.attribute('updatedBy', { optional: true }),
    updatedAt: orion.attribute('updatedAt', { optional: true })
  }));

  Jefes.attachSchema(new SimpleSchema({
    idEmployee: orion.attribute('hasOne', {
      label: 'Colaborador',
      optional: false
    }, {
      collection: Persons,
      titleField: ['idEmployee','employeeName'],
      customPublication:true,
      publicationName: 'GetSelectOnePersons'
    }),
    employeeName: {
      type: String,
      label: 'Colaborador',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idEmployee").value;
        if (id) {
          var entity = Persons.findOne({ _id: id });
          var value = "";
          var fields = ["employeeName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idEmpPosition: {
      type: String,
      label: 'Puesto',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idEmployee").value;
        if (id) {
          var entity = Persons.findOne({ _id: id });
          var value = "";
          var fields = ["idEmpPosition_txt"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idDepartment: {
      type: String,
      label: 'Departamento',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idEmployee").value;
        if (id) {
          var entity = Persons.findOne({ _id: id });
          var value = "";
          var fields = ["idDepartment_txt"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idEmp: {
      type: Number,
      label: 'Colaborador',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idEmployee").value;
        if (id) {
          var entity = Persons.findOne({ _id: id });
          var value;
          var fields = ["idEmployee"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = res;
              }
            } else {
              value = entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return parseInt(value);
          } else if (this.isUpsert) {
            return {
              $setOnInsert: parseInt(value)
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idcompany_txt: {
      type: String,
      label: 'Compañia',
      optional: true,
      autoform: { type: "hidden" },
      autoValue: function() {
        var id = this.siblingField("idcompany").value;
        if (id) {
          var entity = Companies.findOne({ _id: id });
          var value = "";
          var fields = ["companyName"];
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].endsWith("_id")) {
              var otraCollectionFK = Companies.simpleSchema()._schema[fields[i]].orion.collection._name;
              var resultx = orion.collections.list[otraCollectionFK]._collection.find({
                _id: entity[fields[i]]
              }).fetch();
              var res;
              var theTitleField = Companies.simpleSchema()._schema[fields[i]].orion.titleField;
              var theRow = orion.collections.list[otraCollectionFK]._collection.findOne({
                _id: entity[fields[i]]
              });
              if (resultx) {
                if (_.isArray(theTitleField)) {
                  res = titleField.map((field) => {
                    return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                  }).join(" ");
                } else {
                  res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                }
                value = value + " " + res;
              }
            } else {
              value = value + " " + entity[fields[i]];
            }
          }
          if (this.isInsert || this.isUpdate) {
            return value.trim();
          } else if (this.isUpsert) {
            return {
              $setOnInsert: value.trim()
            };
          } else {
            this.unset();
          }
        } else {
          this.unset();
        }
      },
    },
    idcompany: orion.attribute('hasOne', {
      label: 'Nombre de la Compañia',
      optional:false,
      help:"Nombre de la Compañia",
      example:"---",
    }, {
      collection: Companies,
      titleField: ['companyName'],
      customPublication:true,
      publicationName: 'GetSelectOneCompanies'
    }),    
    active: {
      type: Boolean,
      label: 'Activo',
      defaultValue: true,
      help:"Registro activo",
      example:"Cuadro Seleccionado (con palomita)=Registro Activo",
    },
    createdBy: orion.attribute('createdBy', { optional: true }),
    createdAt: orion.attribute('createdAt', { optional: true }),
    updatedBy: orion.attribute('updatedBy', { optional: true }),
    updatedAt: orion.attribute('updatedAt', { optional: true })
  }));

  CargaMasiva.attachSchema(new SimpleSchema({
	  causa:{ type:String, optional: true, label:'Causa' },
	  descripcion: { type: String, label: 'Descripción', optional: true},
	  proporcionado: { type: String, label: 'Proporcionado', optional: true},
	  archivo: { type: String, label: 'Nombre del archivo', optional: true},
	  tipo: { type: String, label: 'Modulo', optional: true},
	  error: { type: String, label: 'Etiqueta',allowedValues:['Error','Warning','Info'],optional: true},
	  linea: { type: Number, label: 'Linea del archivo', optional: true},
	  Company: { type: String, label: 'Compañia', optional: true},
	  createdBy: { type: String, label: 'Creado por', optional: true},
	  createdAt: orion.attribute('createdAt'),
	  updatedBy: { type: String, label: 'Actualizado por', optional: true},
	  updatedAt: orion.attribute('updatedAt', { optional: true }),
	}));