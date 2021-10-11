// Sample = new Mongo.Collection("sample");
// Sample.allow({
//   insert: function(){
//     return true;
//   },
//   update: function(){
//     return true;
//   },
//   remove: function(){
//     return true;
//   }
// });

formatADate = function(time) {
    if (time == null || time== 'undefined' || time == '')
        return 'Sin información'
    else if ((moment().unix() - moment(time).unix()) < 3600) {
        return moment(time).locale('es').fromNow();
    } else {
        return moment(time).format("DD/MM/YYYY HH:mm:ss a");
    }
};

formatDateTime = function(time) {
    if (time == null || time== 'undefined' || time == ''){
        return 'Sin información'
    }else {
        if(moment(time).isValid()){
            return moment(time).format("DD/MM/YYYY HH:mm:ss a");
        }else{
            return time;
        }
    }
};

formatJustDate = function(time) {
    if (time == null || time== 'undefined' || time == '')
        return 'Sin información'
    else if ((moment().unix() - moment(time).unix()) < 3600) {
        return moment(time).locale('es').fromNow();
    } else {
        return moment(time).format("DD/MM/YYYY");
    }
};

formatSimpleDate = function(time) {
    if (time == null || time== 'undefined' || time == '')
        return 'Sin información'
    else{
        try{
            return moment(time).format("DD/MM/YYYY");
        }catch(error){
            return "";
        }
    }
};

formatADateFromNow = function(time) {
    var resultado='Sin información';
    if (time != null && time != 'undefined' && time != ''){
      if(moment(time).isValid()){
        resultado=moment(time).locale('es').fromNow().toString();
        if(resultado.toLowerCase().includes("en")){
          resultado=resultado.replace("en","hace");
        }
      }
    }
    return resultado;
};


i18n.setDefaultLanguage('es');
var myGetSchema = function(options, hasMany) {
    check(options, Match.ObjectIncluding({
        titleField: Match.OneOf(String, Array),
        publicationName: String,
        customPublication: Match.Optional(Boolean),
        pluralName: Match.Optional(Match.OneOf(String, Function)),
        singularName: Match.Optional(Match.OneOf(String, Function)),
        collection: Mongo.Collection,
        filter: Match.Optional(Function),
        createFilter: Match.Optional(Function),
        create: Match.Optional(Function),
        additionalFields: Match.Optional(Array),
        sortFields: Match.Optional(Match.OneOf(Array, Object)),
        validateOnClient: Match.Optional(Boolean),
        validateOnServer: Match.Optional(Boolean),
        dontValidate: Match.Optional(Boolean),
        render: Match.Optional({
            item: Function,
            option: Function
        })
    }));

    if (!_.has(options, 'validateOnClient')) {
        options.validateOnClient = true;
    }
    if (!_.has(options, 'validateOnServer')) {
        options.validateOnServer = true;
    }

    if (!options.filter) {
        options.filter = function(userId) {
            return {};
        };
    }

    if (!options.create) {
        options.create = false;
    }

    if (_.isArray(options.titleField) && options.titleField.length === 1) {
        options.titleField = options.titleField[0];
    }

    function render_item_default(item, escape) {
      //console.log("rendering:"+ JSON.stringify(item));
        var fieldContent = "";

        if (_.isArray(options.titleField)) {
            _.each(options.titleField, function(field, index) {
                if (field.endsWith("_id")) {
                    var resultx = options.collection.find({
                        $and: [{
                            _id: item[field]
                        }, options.filter(this.userId)]
                    });

                    //console.log("resultx:"+resultx);
                    //   console.log("field:" +(field));
                    //   console.log("item[field]:" +(item[field]));
                    //   console.log("collection:" +(options.collection.name));
                    //    console.log("data:" +  simpleStringify(orion.collections.list[options.collection.name]._collection.simpleSchema()._schema[field]));

                    var res;
                    var theTitleField = orion.collections.list[options.collection.name]._collection.simpleSchema()._schema[field].orion.titleField;
                    var theRow = orion.collections.list[options.collection.name]._collection.simpleSchema()._schema[field].orion.collection.findOne({
                        _id: item[field]
                    });

                        // console.log("theRow:"+ simpleStringify(theRow));
                    if (resultx) {
                        if (_.isArray(theTitleField)) {
                            res = titleField.map((field) => {
                                return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                            }).join(' ');
                        } else {
                            res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                        }
                    }
                    fieldContent += (index > 0 ? " " : "") + escape(res); //item[field]);
                } else {
                    fieldContent += (index > 0 ? " " : "") + escape(item[field]);
                }
            });
        } else {
            fieldContent = escape(item[options.titleField]);
        }

        if(item.active==false){
          return '<div class="brown lighten-4">' + fieldContent + '</div>';
        }

        return '<div>' + fieldContent + '</div>';
    }

    if (!options.render) {
        options.render = {
            item: render_item_default,
            option: render_item_default
        };
    }

    if (!options.additionalFields) {
        options.additionalFields = [];
    }
    options.additionalFields.push("active");

    if (!options.pluralName) {
        options.pluralName = i18n('collections.common.defaultPluralName');
    }

    if (!options.singularName) {
        options.singularName = i18n('collections.common.defaultSingularName');
    }

    options.fields = _.union(options.additionalFields, options.titleField);

    if (Meteor.isServer) {
        if (!options.customPublication) {
            Meteor.publish(options.publicationName, function() {
                var pubFields = {};
                for (var i = 0; i < options.fields.length; i++) {
                    pubFields[options.fields[i]] = 1;
                }

                return options.collection.find(options.filter(this.userId), {
                    fields: pubFields
                });
            }, {
                is_auto: true
            });
        }
        if (!hasMany) {
            Meteor.publish(options.publicationName + '_row', function(id) {
                var pubFields = {};
                for (var i = 0; i < options.fields.length; i++) {
                    pubFields[options.fields[i]] = 1;
                }

                var filter = options.filter(this.userId);
                filter._id = id;
                return options.collection.find(filter, {
                    fields: pubFields
                });
            }, {
                is_auto: true
            });
        }
    }

    if (options.dontValidate && hasMany) {
        return {
            type: [String],
            orion: options
        };
    } else if (options.dontValidate && !hasMany) {
        return {
            type: String,
            orion: options,
        };
    } else if (hasMany) {
        return {
            type: [String],
            orion: options,
            custom: function() {
                if (Meteor.isClient && !options.validateOnClient) {
                    return;
                }
                if (Meteor.isServer && !options.validateOnServer) {
                    return;
                }
                if (this.isSet && _.isArray(this.value) && this.value) {
                    var count = options.collection.find({
                        $and: [{
                            _id: {
                                $in: this.value
                            }
                        }, options.filter(this.userId)]
                    }).count();
                    if (count != this.value.length) {
                        return 'notAllowed';
                    }
                }
            }
        };
    } else {
        return {
            type: String,
            orion: options,
            custom: function() {
                if (Meteor.isClient && !options.validateOnClient) {
                    return;
                }
                if (Meteor.isServer && !options.validateOnServer) {
                    return;
                }
                if (this.isSet && _.isString(this.value) && this.value) {
                    var count = options.collection.find({
                        $and: [{
                            _id: this.value
                        }, options.filter(this.userId)]
                    }).count();
                    if (count != 1) {
                        return 'notAllowed';
                    }
                }
            }
        };
    }
};


orion.attributes['hasMany'].getSchema = function(options) {
    return myGetSchema(options, true);
};
orion.attributes['hasOne'].getSchema = function(options) {
    return myGetSchema(options, false);
};


orion.attributes.registerAttribute('fileXP', {
    template: 'orionAttributesFileUploadXP',
    previewTemplate: 'orionAttributesFileUploadColumnXP',
    getSchema: function(options) {
        var subSchema = new SimpleSchema({
            url: {
                type: String,
                optional: true,
                defaultValue: "/img/sinimagen.jpg"
            },
            fileId: {
                type: String,
                optional: true
            },
            fileName: {
                type: String,
                optional: true
            },
            parentId: {
                type: String,
                optional: true
            },
            //     createdBy: orion.attribute('createdBy'),
            //     createdAt: orion.attribute('createdAt'),
            //     updatedBy: orion.attribute('updatedBy'),
            //     updatedAt: orion.attribute('updatedAt'),
        });
        return {
            type: subSchema
        };
    },
    valueIn: function(valuein){
        if (Array.isArray(valuein))
            Session.set("listFiles", valuein);
        else if (typeof(valuein)==='object') { //retrocompatibilidad
            let newVal=[];
            newVal.push(valuein);
            Session.set("listFiles", newVal);
        }
        else
            Session.set("listFiles", null);
    },
    valueOut: function() {
        let listWithNulls = Session.get("listFiles");
        let listOnlyFiles = [];
        if (listWithNulls)
            for (let i=0; i < listWithNulls.length; i++) {
                if (listWithNulls[i])
                    listOnlyFiles.push(listWithNulls[i]);
            }
        Session.set("listFiles", listOnlyFiles);
        return listOnlyFiles;
    },
});

if (Meteor.isClient) {
    ReactiveTemplates.helpers("attributePreview.hasOne", {
        val: function() {
            var item = this.schema && this.schema.orion.collection.findOne(this.value);
            if (item) {
                var collectionName = this.schema && this.schema.orion.collection.name;
                var fieldContent = "";
                if (_.isArray(this.schema.orion.titleField)) {
                    _.each(this.schema.orion.titleField, function(field, index) {
                        if (field.endsWith("_id")) {
                            var res;
                            var theTitleField = orion.collections.list[collectionName]._collection.simpleSchema()._schema[field].orion.titleField;
                            var theRow = orion.collections.list[collectionName]._collection.simpleSchema()._schema[field].orion.collection.findOne({
                                _id: item[field]
                            });

                            //    console.log("theRow:"+ simpleStringify(theRow));

                            if (theRow) {
                                if (_.isArray(theTitleField)) {
                                    res = titleField.map((field) => {
                                        return orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                                    }).join(" ");
                                } else {
                                    res = orion.helpers.searchObjectWithDots(theRow, theTitleField, true);
                                }

                                fieldContent += (index > 0 ? " " : "") + res; //item[field]);

                                if(item.active==false){
                                   fieldContent = fieldContent +  ' **';
                                }
                            }
                        } else {

                            if (field.includes(".")) {

                                var field1 = field.substring(0, field.lastIndexOf("."));
                                var field2 = field.substring(field.lastIndexOf(".") + 1);

                                fieldContent += (index > 0 ? " " : "") + item[field1][field2];

                                if(item.active==false){
                                   fieldContent = fieldContent +  ' **';
                                }
                            } else {
                                fieldContent += (index > 0 ? " " : "") + item[field];

                                if(item.active==false){
                                   fieldContent = fieldContent +  ' **';
                                }
                            }
                        }
                    });
                    return fieldContent;
                } else {
                    return orion.helpers.searchObjectWithDots(item, this.schema.orion.titleField, true);
                }
            }
        }
    });

    // ReactiveTemplates.onRendered('attribute.fileXP', function (){
    //     Session.set('uploadProgressXP' + this.fileName, null);
    //     Session.set('isUploadingXP' + this.fileName, false);
    //     Session.set('fileXP' + this.fileName, this.data.value);
    // });

    ReactiveTemplates.onCreated('attribute.fileXP', function (){
        // Session.set("listFiles",[]);
        this.listHandler = {
          push: (value) => {
              let arr=Session.get("listFiles");
              arr.push(value);
              Session.set("listFiles",arr);
          },
          remove: (value) => {
            const arr = Session.get("listFiles");
            for (let i=0;i<arr.length;i++){
                if (arr[i].fileId === value)
                    //arr.splice(i, 1);
                    arr[i] = null;
            }
            Session.set("listFiles", arr);
          }
        };
    });

    ReactiveTemplates.helpers('attribute.fileXP', {
        'schemaKey': function (){
    		// var instance=Template.instance();
            // instance.data.atts["data-schema-key"]=this.name;
            // instance.fileName=this.name;
    		return this.atts['data-schema-key'];
    	},
        'listHandler': function (data){
            return Template.instance().listHandler;
        }
    });


/*********************************************/

    Template.orionFileAttr.events({
        'click .autoform-remove-item': function(event, template) {
            var file = template.file.get();
            if (file && file.fileId && file.fileName) {
                orion.filesystem.remove(file.fileId);
            }
            // Session.set('fileXP' + template.fileName, null);
            this.list.remove(file.fileId);
        },
        'change input': function(event, template) {
            if (orion.filesystem.isUploading()) return;

            var self = this;
            var instance=template;
            var files = event.currentTarget.files;
            if (files.length != 1) return;

            var theFileName = files[0].name;

            var upload = orion.filesystem.upload({
                fileList: files,
                name: theFileName,
                uploader: 'fileXP-attribute'
            });

            Session.set('isUploadingXP' + theFileName, true);
            Session.set('uploadProgressXP' + theFileName, 0);
            let lista=Session.get("listFiles");

            Tracker.autorun(function() {
                if (upload.ready()) {
                    if (upload.error) {
                        // Session.set('fileXP' + self.atts.name, null);
                        //          console.log(upload.error);
                        alert(upload.error.reason);
                    } else {
                        //  console.log("upload.name:" + files[0].name);
                        // Session.set('fileXP' + self.atts.name, {
                        //     fileId: upload.fileId,
                        //     url: upload.url,
                        //     fileName: theFileName
                        // });
                        template.file.set({
                            fileId: upload.fileId,
                            url: upload.url,
                            fileName: theFileName
                        });
                        lista.push({
                            fileId: upload.fileId,
                            url: upload.url,
                            fileName: theFileName
                        });
                        Session.set("listFiles", lista);
                        // self.list.push({
                        //     fileId: upload.fileId,
                        //     url: upload.url,
                        //     fileName: theFileName
                        // });
                    }
                    Session.set('isUploadingXP' + theFileName, false);
                }
            });
            Tracker.autorun(function() {
                Session.set('uploadProgressXP' + theFileName, upload.progress());
            });
        }
    });

    Template.orionFileAttr.helpers({
        progressXP: function() {
            let file=Template.instance().file.get();
            if (file)
                return Session.get('uploadProgressXP' + file.fileName);
        },
        isUploadingXP: function() {
            let file=Template.instance().file.get();
            if (file)
                return Session.get('isUploadingXP' + file.fileName);
        },
        fileXP: function() {
            var listF = Session.get('listFiles');
            let file = Template.instance().file.get();
            if (file&&listF) {
                for (let i = 0; i < listF.length; i++){
                    if (listF[i] != null)
                        if (listF[i].fileId === file.fileId)
                            return listF[i];
                }
            }
        },
    });

    Template.orionFileAttr.onRendered(function (){
        let self=this;
        this.autorun(function (){
            if (self.file.get()) {
                Session.set('uploadProgressXP' + self.file.get().fileName, null);
                Session.set('isUploadingXP' + self.file.get().fileName, false);
            }
        });
    });

    Template.orionFileAttr.onCreated(function (){
        this.file=new ReactiveVar(null);
        let self=this;
        this.autorun(function (){
            let listF = Session.get('listFiles');
            if (listF) {
                self.file.set(listF[self.data.atts.index]);
            }
        });
    });//

    Template.orionAttributesFileUploadColumnXP.helpers({
        'test': function (self) {
            console.log(self);
        },
        'esObj':function(data){
            if (!Array.isArray(data))
                if (typeof(data)==='object')
                    return true;
            else
                return false;
        },
        'esArray':function(data){
            if (Array.isArray(data))
                return true;
            else
                return false;
        },
        'hasPermission': function() {
            return Meteor.user().hasRole('admin');
        },
        'esPDF': function(file) {
          //console.log("file "+JSON.stringify(file));
            return "omar";
        }
    });
}

SimpleSchema.extendOptions({
  help: Match.Optional(String),
  example: Match.Optional(String)
});

orion.attributes.registerAttribute('createdByXP', {
  previewTemplate: 'createdByPreviewXP',
  getSchema: function(options) {
    return {
      type: String,
      index: 1,
      autoform: {
        omit: true,
      },
      optional: true,
      autoValue: function() {
        if (this.isInsert) {
          return this.userId;
        } else if (this.isUpsert) {
          return { $setOnInsert: this.userId };
        } else {
          this.unset();
        }
      },
    };
  },
});

orion.attributes.registerAttribute('updatedByXP', {
  previewTemplate: 'updatedByPreviewXP',
  getSchema: function(options) {
    return {
      type: String,
      index: 1,
      autoform: {
        omit: true
      },
      autoValue: function() {
        if (this.isUpdate || this.isInsert) {
          return this.userId;
        } else if (this.isUpsert) {
          return {$setOnInsert: this.userId};
        } else {
          this.unset();
        }
      }
    };
  }
});

if (Meteor.isServer) {
  Meteor.publish('userProfileForCreatedByAttributeColumnXP', function(userId) {
    return Meteor.users.find({ _id: userId }, { fields: { profile: 1 } });
  });
  Meteor.publish('userProfileForUpdatedByAttributeColumnXP', function(userId) {
    return Meteor.users.find({ _id: userId }, { fields: { profile: 1 } });
 });
}

if (Meteor.isClient) {
  ReactiveTemplates.onRendered('attributePreview.createdByXP', function() {
    if (this.data !=undefined && this.data.value!=undefined) {
      this.subscribe('userProfileForCreatedByAttributeColumnXP', this.data.value);
    }
  });

  ReactiveTemplates.helpers('attributePreview.createdByXP', {
    name: function() {
      if(this.value!=undefined){
        var user = Meteor.users.findOne(this.value)
        return user && user.profile.name;
      }
    },
  });

  ReactiveTemplates.onRendered('attributePreview.updatedByXP', function() {
    if (this.data !=undefined && this.data.value!=undefined) {
      this.subscribe('userProfileForUpdatedByAttributeColumnXP', this.data.value)
    }
  });
  ReactiveTemplates.helpers('attributePreview.updatedByXP', {
    name: function() {
      if(this.value!=undefined){
        var user = Meteor.users.findOne(this.value)
        return user && user.profile.name;
      }
    }
  });
}
