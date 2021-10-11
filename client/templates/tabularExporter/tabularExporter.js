circularJSON = function (v) {
  const cache = new Map();
  return JSON.stringify(v, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our map
      cache.set(value, true);
    }
    return value;
  });
};

Template.tabularExporter.helpers({
  atts() {
    return _.omit(this, 'table', 'selector');
  },
  isDownloading: function() {
    return Session.get("isDownloading");
  }
});

Template.tabularExporter.events({
  'click #btn-exporta': function(event, template) {
    Session.set("isDownloading", true);
    event.preventDefault();
    event.stopPropagation();
    event.cancelBubble = true;
    var selector = this.selector;
    if(!selector)
      selector={};
    var collection = this.table.collection.name.toString();
    var TitleCollection = this.table.collection.title.toString();
    var columns = this.table.options.columns;
    var fecha=moment().format("DD_MM_YYYY");
    for (var i = 0; i < columns.length; i++) {
      var obj=columns[i];
      var aa= obj.data;
      var type=orion.collections.list[collection]._collection.simpleSchema()._schema[aa];
      var tipo="";
      if (type!=undefined) {
        tipo=type.type.name;
      }else{
        tipo="Object";
      }
      columns[i]["tipo"]=tipo;
    }
    //console.log(JSON.stringify(columns));
    Meteor.call("exportAllData", selector, collection, columns, function(error, data) {
      if (error) {
        console.log("error:" + error);
      } else {
        var csv = Papa.unparse(data,{encoding: "utf-8"});
        _downloadCSV("Datos "+TitleCollection+"-"+fecha, csv);
      }
      Session.set("isDownloading", false);
    });
  }
});

_downloadCSV = function(nombreArchivo, csv) {
   var blob = new Blob(['\ufeff',csv], {type: 'text/csv;charset=utf-8;'});
   var a = window.document.createElement("a");
   a.id = "downloader"
   a.href = window.URL.createObjectURL(blob, {
     type: "text/plain"
   }); // 23
   a.download = nombreArchivo + ".csv";
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   //$('#downloader').
 }
