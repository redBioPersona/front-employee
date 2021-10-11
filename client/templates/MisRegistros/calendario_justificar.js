Template.calendario_justificar.onRendered(function() {
  this.autorun(() => {
    var isStation=Config_application.findOne({"active":true});
    console.log("isStation "+JSON.stringify(isStation))
    if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false && isStation.showKeyboard==true){
      $("[name=observaciones]").keyboard({ layout: 'qwerty' });      
    }
  });
});


Template.calendario_justificar.onCreated(function () {
  Meteor.subscribe('get_Config_application');
  Meteor.subscribe('getIncidencias');
});


Template.calendario_justificar.helpers({
  fecha:function(){
    var id=Session.get("Justify_id");
    if (id!=undefined) {
      var data=Reports.findOne({_id:id});
      if(data!=undefined && data.fecha!=undefined){
        return data.fecha;
      }
    }
  },
  idEmp:function(){
    var id=Session.get("Justify_id");
    if (id!=undefined) {
      var data=Reports.findOne({_id:id});
      if(data!=undefined && data.idEmployee!=undefined){
        return data.idEmployee;
      }
    }
  },
  _idEmp:function(){
    var id=Session.get("Justify_id");
    if (id!=undefined) {
      var data=Reports.findOne({_id:id});
      if(data!=undefined && data._idEmployee!=undefined){
        return data._idEmployee;
      }
    }
  },
  idEmpName:function(){
    var id=Session.get("Justify_id");
    if (id!=undefined) {
      var data=Reports.findOne({_id:id});
      if(data!=undefined && data.employeeName!=undefined){
        return data.employeeName;
      }
    }
  },
  estatusX:function(){
    var datos="En revisión";
    return datos;
  },
  fechaX:function(){
    var id=Session.get("Justify_id");
    if (id!=undefined) {
      var data=Reports.findOne({_id:id});
      if(data!=undefined && data.fecha!=undefined){
        return data.fecha;
      }
    }
  },
  reporte:function(){
    var _id=Session.get("Justify_id");
    if (_id!=undefined) {
        return _id;
    }
  }
});

AutoForm.addHooks('calendario_justificar_XP', {
  onSuccess: function() {
    Session.set('listFiles',null);
    $("#tabular_table_justify").modal('close');
  }
});
