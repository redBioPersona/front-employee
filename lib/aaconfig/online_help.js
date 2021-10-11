if (Meteor.isClient) {

  Template.orionMaterializeCollectionsSelectIndex_XPM.helpers({
    myCollection: function() {
      return Empleados;
    }

  });

  function disabledEventPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }

  Template.orionMaterializeCollectionsSelectIndex_XPM.events({
    "click tr": function(event) {
      //    console.log("click");
      disabledEventPropagation(event);
      if (!$(event.target).is("td"))
        return;
      var dataTable = $(event.target).closest("table").DataTable();
      var rowData = dataTable.row(event.currentTarget).data();

      if (rowData) {
        console.log("id:" + rowData._id);
        Session.set("selectedData", rowData);
        $("#myModal").closeModal();
      }
    }
  });

  Template.orionMaterializeCollectionsCreate_XPM.events({
    'click .return-index': function(event) {
      disabledEventPropagation(event);
      Session.set("isCreating", false);
      Session.set("isUpdating", false);
      Session.set("isListing", true);
    },
    'click .cancel-create': function(event) {
      disabledEventPropagation(event);
      Session.set("isCreating", false);
      Session.set("isUpdating", false);
      Session.set("isListing", true);
    }
  });

  AutoForm.addHooks('orionMaterializeCollectionsCreateForm_XPM', {

    onSuccess: function() {
  //    console.log("AutoForm.addHooks('orionMaterializeCollectionsCreateForm_XPM' onSuccess:");
      Session.set("isCreating", false);
      Session.set("isUpdating", false);
      Session.set("isListing", true);

    }
  }, true);

  Template.orionMaterializeCollectionsIndex_XPM.events({
    'click .cancel-create': function(event) {

      disabledEventPropagation(event);
      Session.set("isCreating", false);
      Session.set("isUpdating", false);
      Session.set("isListing", false);
    },
    /*
    'click tr': function(event, template) {
      disabledEventPropagation(event);
      if (!$(event.target).is('td')){
        return;
      }
  //      console.log("event.currentTarget:" + JSON.stringify(event.currentTarget));
      var dataTable = $(event.currentTarget).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
  //    console.log("rowData:" + JSON.stringify(dataTable.row(event.currentTarget).data()));
      if (rowData && rowData._id) {
    //    console.log("invocando:   MaterializeModal.form");
        MaterializeModal.form({
          title: "¿Usar este valor o Editarlo?",
          inDuration: 100,
          outDuration: 100,
          bodyTemplate: 'usar_editar_Template',
          closeLabel: "USAR",
          cancelLabel: "Cancelar",
          submitLabel: "EDITAR",
          callback: function(error, rtn) {
            if (error) {
              console.log("ERROR:" + error);
            } else {

              if (rtn && rtn.submit) {
                console.log("EDITAR:");
                var collection = rowData._collection();
                if (rowData.canShowUpdate()) {
                  Session.set("recordToUpdate", rowData);
                  Session.set("isCreating", false);
                  Session.set("isUpdating", true);
                  Session.set("isListing", false);
                }

              } else {
                  console.log("USAR:");
            //    Session.set("recordToUpdate", rowData);
                Session.set("isCreating", false);
                Session.set("isUpdating", false);
                Session.set("isListing", false);
                console.log("fieldName:" + template.data.fieldName);
               Session.set("valueToUse", {
                  name: template.data.fieldName,
                  _id: rowData._id
                });
                console.log("valueToUse:" + JSON.stringify(Session.get("valueToUse")));/
                Meteor.setTimeout(function() {
                  $("[name='" + template.data.fieldName + "']")[0].selectize.setValue(rowData._id);
                }, 250);
                //  Template.instance().helpVisibleQE.set(false);
              }
            }
          }
        });

      }else{
          console.log("!rowData && rowData._id ¿?:" + JSON.stringify(rowData));
      }
    },*/
    "click .add-recordx": function(event) {
      disabledEventPropagation(event);
    //  console.log("click .add-record");
      Session.set("isCreating", true);
      Session.set("isUpdating", false);
      Session.set("isListing", false);
    }
  });

  Template.orionMaterializeCollectionsIndex_XPM.onRendered(function() {
    this.autorun(function() {
      RouterLayer.isActiveRoute('');
      Session.set('orionMaterializeCollectionsIndex_XP_showTable', false);
      Meteor.defer(function() {
        Session.set('orionMaterializeCollectionsIndex_XP_showTable', true);
      });
    });
  });

  Template.orionMaterializeCollectionsIndex_XPM.helpers({
    showTable: function() {
      return true; //Session.get('orionMaterializeCollectionsIndex_XPM_showTable');
    },
    esNotificaciones: function(collectionName) {
      return (collectionName == 'notificaciones');
    }
  });

  Template.orionMaterializeCollectionsUpdate_XPM.helpers({
    showField: function(field, name) {
      console.log('showField:' + field + ' :' + name);
      return true;
    }
  });

  Template.orionMaterializeCollectionsUpdate_XPM.events({
    'click .save-btn': function(event) {
      disabledEventPropagation(event);
      $('#orionMaterializeCollectionsUpdateForm_XPM').submit();
    },
    'click .cancel-update': function(event) {
      disabledEventPropagation(event);
      Session.set("isUpdating", false);
      Session.set("isListing", true);
      Session.set("isCreating", false);
    },
    'click .return-index': function(event) {
      disabledEventPropagation(event);
      Session.set("isUpdating", false);
      Session.set("isListing", true);
      Session.set("isCreating", false);
    }
  });

  AutoForm.addHooks('orionMaterializeCollectionsUpdateForm_XPM', {
    onSuccess: function() {
      Session.set("isUpdating", false);
      Session.set("isListing", true);
      Session.set("isCreating", false);
    }
  });

  Template.orionMaterializeCollectionsDelete_XPM.helpers({
    getCollection: function() {
      return this.collection;
      //   RouterLayer.go(this.collection.indexPath());

    }
  });

  Template.orionMaterializeCollectionsDelete_XPM.events({
    'click .confirm-mydelete': function(event, template) {
      disabledEventPropagation(event);
      //      console.log("deleting");
      var objectId = RouterLayer.getParam('_id');
      //    console.log("this.self:"+ simpleStringifyxy(RouterLayer));

      template.view.template.__helpers[" collection"]().update(objectId, {
        $set: {
          active: false
        }
      }, function(error, result) {
        if (error) {
          console.warn('Error al borrar:', objectId, 'en la collection', ':', error);
        }
        // Only go back to index in case the deletion has been properly achieved
        if (result === 1) {
          RouterLayer.go(template.view.template.__helpers[" collection"]().indexPath());
        }
      });

    }
  });

  Template.tabularQuickHelp.onCreated(function onCreated() {
    this.helpVisibleQH = new ReactiveVar(false);
  });

  Template.tabularQuickHelp.helpers({
    showMessage: function() {
      return Template.instance().helpVisibleQH.get();
    },
    color:function(){
      var color=GetColorTemplateTitle();
      return color;
    }
  });

  Template.tabularQuickHelp.events({
    'mouseenter .help': function(event, instance) {
      instance.helpVisibleQH.set(true);
    },
    'mouseleave .help': function(event, instance) {
      instance.helpVisibleQH.set(false);
    }

  });

  Template.afQuickHelp.onCreated(function onCreated() {
    this.helpVisibleAF = new ReactiveVar(false);

  });

  Template.afQuickHelp.helpers({
    isHiddenInput: function afQuickFieldIsHiddenInput() {
      var c = AutoForm.Utility.getComponentContext(this, "afQuickField");
      var inputType = c.atts.type;
      if (inputType) {
        var componentDef = AutoForm._inputTypeDefinitions[inputType];
        if (!componentDef) {
          throw new Error('AutoForm: No component found for rendering input with type "' + inputType + '"');
        }
        return componentDef.isHidden;
      }
      return false;
    },
    showMessage: function() {
      return Template.instance().helpVisibleAF.get();
    },
    displayName: function() {
      var c = AutoForm.Utility.getComponentContext(this, "afQuickField");
      return JSON.stringify(c.defs.label);
    },
    displayHelp: function() {
      var c = AutoForm.Utility.getComponentContext(this, "afQuickField");

  //    console.log("c:" + c.defs.help);
  //    console.log("this.collectionName:"+this.collectionName);
  //    console.log("c.defs:"+simpleStringify(c.defs));
  //console.log("c.atts:"+simpleStringify(c.atts));
      //  return orion.collections.list[this.collectionName].simpleSchema()._schema[this.name].help;
      return c.defs.help;
    },
    displayExample: function() {
      var c = AutoForm.Utility.getComponentContext(this, "afQuickField");
      //  console.log("this.collectionName:"+this.collectionName);
      //  return orion.collections.list[this.collectionName].simpleSchema()._schema[this.name].example;
      return c.defs.example;
    }
  });

  Template.afQuickHelp.events({
    'click .show-help': function(event, instance) {
      disabledEventPropagation(event);
      if (instance.helpVisibleAF.get()) {
        instance.helpVisibleAF.set(false);
      } else {
        instance.helpVisibleAF.set(true);
      }
    },
    'mouseenter .show-help': function(event, instance) {
      instance.helpVisibleAF.set(true);
    },
    'mouseleave .show-help': function(event, instance) {
      instance.helpVisibleAF.set(false);
    }

  });

  Template.afQuickEdit.onCreated(function onCreated() {
    this.helpVisibleQE = new ReactiveVar(false);
  });

  Template.afQuickEdit.helpers({
    isHiddenInput: function afQuickFieldIsHiddenInput() {
      var c = AutoForm.Utility.getComponentContext(this, "afQuickField");
      var inputType = c.atts.type;
      if (inputType) {
        var componentDef = AutoForm._inputTypeDefinitions[inputType];
        if (!componentDef) {
          throw new Error('AutoForm: No component found for rendering input with type "' + inputType + '"');
        }
        return componentDef.isHidden;
      }
      return false;
    },
    isForeign: function() {
      var c = AutoForm.Utility.getComponentContext(this, "afQuickField");
      var inputType = c.atts.type;
      if (inputType) {
        var componentDef = AutoForm._inputTypeDefinitions[inputType];
        if (!componentDef) {
          throw new Error('AutoForm: No component found for rendering input with type "' + inputType + '"');
        }
        return (c.atts.type == "orion.hasOne" || c.atts.type == "orion.hasMany");
      }
      return false;
    },
    getData: function() {
      var c = AutoForm.Utility.getComponentContext(this, "afQuickField");
      var inputType = c.atts.type;
      console.log("getData this:" + simpleStringify(this));
      console.log("getData atts:" + simpleStringify(c.atts));
      console.log("getData defs:" + simpleStringify(c.defs));
      if (inputType) {
        var componentDef = AutoForm._inputTypeDefinitions[inputType];
        if (!componentDef) {
          throw new Error('AutoForm: No component found for rendering input with type "' + inputType + '"');
        }
        return (c.atts.type == "orion.hasOne" || c.atts.type == "orion.hasMany");
      }
      return false;
    },
    showMessage: function() {
  //    console.log("Template.helpVisibleQE.get():" + Template.instance().helpVisibleQE.get());
      return Template.instance().helpVisibleQE.get();
    },

    isCreating: function() {
      return Session.get("isCreating");
    },
    isUpdating: function() {
      return Session.get("isUpdating");
    },
    isListing: function() {
      return Session.get("isListing");
    },
    getCurrentCollectionToPlay: function() {
      console.log("getCurrentCollectionToPlayTitle:" + Session.get('currentCollectionToPlay'));
      return orion.collections.list[Session.get('currentCollectionToPlay')];
    },
    getRecordToUpdate: function() {
      return Session.get("recordToUpdate");
    }
  });

  Template.afQuickEdit.events({
    'click .add-foreign': function(event, instance) {
      disabledEventPropagation(event);
      Session.set('currentCollectionToPlay', orion.collections.list[this.collectionName].simpleSchema()._schema[this.name].orion.collection.name);
      if (instance.helpVisibleQE.get()) {
        instance.helpVisibleQE.set(false);
        Session.set("isUpdating", false);
        Session.set("isListing", false);
        Session.set("isCreating", false);
      } else {
        instance.helpVisibleQE.set(true);
        Session.set("isUpdating", false);
        Session.set("isListing", true);
        Session.set("isCreating", false);
      }
    }

  });
}
