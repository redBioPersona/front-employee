Template.justificar_template.helpers({
  datos: function(){
    var id = this.estatus;
    if (id=="Falta") { return true; }
    else{ return false; }
  },
  fecha:function(){
    var fecha = this.fecha;
    return "fecha";
  },
  idEmp:function(){
    var datos=Session.get("idEmp");
    if (datos!=undefined) {
      return datos;
    }
  },
  _idEmp:function(){
    var datos=Session.get("_idEmp");
    if (datos!=undefined) {
      return datos;
    }
  },
  idEmpName:function(){
    var datos=Session.get("idEmpName");
    if (datos!=undefined) {
      return datos;
    }
  },
  estatusX:function(){
    var datos="Fuera de Tiempo";
    return datos;
  },
  fechaX:function(){
    var datos=Session.get("fecha_just");
    if (datos!=undefined) {
      return datos;
    }
  },
  reporte:function(){
    var datos=Session.get("reporte_j");
    if (datos!=undefined) {
      return datos;
    }
  }
});

Template.justificar_template.events({
  'click #asistencias' : function(evt){
    var id = this._id;
    var fecha=this.fecha;
    var _idEmp=Reports.findOne({_id:id})._idEmployee;
    var idEmp=Reports.findOne({_id:id}).idEmployee;
    var idEmpName=Reports.findOne({_id:id}).employeeName;
    Session.set("_idEmp", _idEmp);
    Session.set("idEmp", idEmp);
    Session.set("idEmpName", idEmpName);
    Session.set("fecha_just", fecha);
    Session.set("reporte_j", id);
    $("#tabular_table_justify").modal('open',{dismissible: false});
  }
});

AutoForm.addHooks('justificar_template_XP', {
  onSuccess: function() {
    $("#tabular_table_justify").modal('close');
  }
});
