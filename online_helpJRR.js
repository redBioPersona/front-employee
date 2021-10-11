if (Meteor.isClient) {

  Template.afQuickHelpMR.onCreated(function onCreated() {
    this.helpVisibleAF = new ReactiveVar(false);

  });

  Template.afQuickHelpMR.helpers({
    isHiddenInput: function afQuickFieldIsHiddenInput() {
      var c = AutoForm.Utility.getComponentContext(this, "afFieldInput");
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
      var c = AutoForm.Utility.getComponentContext(this, "afFieldInput");
      return JSON.stringify(c.defs.label);
    },
    displayHelp: function() {
      var c = AutoForm.Utility.getComponentContext(this, "afFieldInput");
  //    console.log("c:" + c.defs.help);
  //    console.log("this.collectionName:"+this.collectionName);
  //    console.log("c.defs:"+simpleStringify(c.defs));
  //console.log("c.atts:"+simpleStringify(c.atts));
      //  return orion.collections.list[this.collectionName].simpleSchema()._schema[this.name].help;
      return c.defs.help;
    },
    displayExample: function() {
      var c = AutoForm.Utility.getComponentContext(this, "afFieldInput");
      //  console.log("this.collectionName:"+this.collectionName);
      //  return orion.collections.list[this.collectionName].simpleSchema()._schema[this.name].example;
      return c.defs.example;
    }
  });

  Template.afQuickHelpMR.events({
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

//   Template.afQuickEditMR.onCreated(function onCreated() {
//     this.helpVisibleQE = new ReactiveVar(false);
//     this.inputs = new ReactiveVar();
//   });
//
//   Template.afQuickEditMR.helpers({
//     inputs: function() {
//         return Template.instance().inputs.get();
//     },
//     isHiddenInput: function afQuickFieldIsHiddenInput(input) {
//       var c = AutoForm.Utility.getComponentContext(this, "afQuickField");
//       var inputType = c.atts.type;
//       if (inputType) {
//         var componentDef = AutoForm._inputTypeDefinitions[inputType];
//         if (!componentDef) {
//           throw new Error('AutoForm: No component found for rendering input with type "' + inputType + '"');
//         }
//         return componentDef.isHidden;
//       }
//       return false;
//     },
//     isForeign: function() {
//       var c = AutoForm.Utility.getComponentContext(this, "afQuickField");
//       var inputType = c.atts.type;
//       if (inputType) {
//         var componentDef = AutoForm._inputTypeDefinitions[inputType];
//         if (!componentDef) {
//           throw new Error('AutoForm: No component found for rendering input with type "' + inputType + '"');
//         }
//         return (c.atts.type == "orion.hasOne" || c.atts.type == "orion.hasMany");
//       }
//       return false;
//     },
//     getData: function() {
//       var c = AutoForm.Utility.getComponentContext(this, "afQuickField");
//       var inputType = c.atts.type;
//       console.log("getData this:" + simpleStringify(this));
//       console.log("getData atts:" + simpleStringify(c.atts));
//       console.log("getData defs:" + simpleStringify(c.defs));
//       if (inputType) {
//         var componentDef = AutoForm._inputTypeDefinitions[inputType];
//         if (!componentDef) {
//           throw new Error('AutoForm: No component found for rendering input with type "' + inputType + '"');
//         }
//         return (c.atts.type == "orion.hasOne" || c.atts.type == "orion.hasMany");
//       }
//       return false;
//     },
//     showMessage: function() {
//       console.log("Template.helpVisibleQE.get():" + Template.instance().helpVisibleQE.get());
//       return Template.instance().helpVisibleQE.get();
//     },
//
//     isCreating: function() {
//       return Session.get("isCreating");
//     },
//     isUpdating: function() {
//       return Session.get("isUpdating");
//     },
//     isListing: function() {
//       return Session.get("isListing");
//     },
//     getCurrentCollectionToPlay: function() {
//       console.log("getCurrentCollectionToPlayTitle:" + Session.get('currentCollectionToPlay'));
//       return orion.collections.list[Session.get('currentCollectionToPlay')];
//     },
//     getRecordToUpdate: function() {
//       return Session.get("recordToUpdate");
//     }
//   });
//
//   Template.afQuickEditMR.events({
//     'click .add-foreign': function(event, instance) {
//       disabledEventPropagation(event);
//       Session.set('currentCollectionToPlay', orion.collections.list[this.collectionName].simpleSchema()._schema[this.name].orion.collection.name);
//       if (instance.helpVisibleQE.get()) {
//         instance.helpVisibleQE.set(false);
//         Session.set("isUpdating", false);
//         Session.set("isListing", false);
//         Session.set("isCreating", false);
//       } else {
//         instance.helpVisibleQE.set(true);
//         Session.set("isUpdating", false);
//         Session.set("isListing", true);
//         Session.set("isCreating", false);
//       }
//     }
//
//   });

    function disabledEventPropagation(event) {
      if (event.stopPropagation) {
        event.stopPropagation();
      } else if (window.event) {
        window.event.cancelBubble = true;
      }
    }
}
