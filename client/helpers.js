simpleStringify = function(object) {
  var simpleObject = {};
  for (var prop in object) {
    if (!object.hasOwnProperty(prop)) {
      continue;
    }
    if (typeof(object[prop]) == 'object') {
      continue;
    }
    if (typeof(object[prop]) == 'function') {
      continue;
    }
    simpleObject[prop] = object[prop];
  }
  return JSON.stringify(simpleObject); // returns cleaned up JSON
};

Template.registerHelper("HasCount", function(dato) {
  var usa=dato+Meteor.userId();
  var retorno=false;
  try{
    var algo=Counts.findOne(usa).count;
    if(algo!=undefined){
      retorno=true;
    }
  }catch(err){}
  return retorno;
});


ReactiveTemplates.helpers('attributePreview.hasMany', {
      val: function() {
        var fieldFK = this.key;
        var result = [];
        for (var i = 0; i < this.value.length; i++) {
          var item = this.schema && this.schema.orion.collection.findOne(this.value[i]);
        //  console.log("item["+ i.toString() + "] :"+simpleStringify(item));
          if (item) {
            if (_.isArray(this.schema.orion.titleField)) {
              result.push(this.schema.orion.titleField.map(function(field){
                return orion.helpers.searchObjectWithDots(item, field, true);
              }).join('  '));
            } else {
          //    console.log("result.push:"+orion.helpers.searchObjectWithDots(item, this.schema.orion.titleField, true));
              result.push(orion.helpers.searchObjectWithDots(item, this.schema.orion.titleField, true));
            }
          }
        }
          return result;
      }
    });
    /* Custom filtering function which will search data in column four between two values */
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
    //  console.log("$.fn.dataTable.ext.search.push settings:"+JSON.stringify(settings));

        return false;
    }
);
