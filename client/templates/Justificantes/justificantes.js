Template.comentar_justificante.events({
  'click #asistencias' : function(evt){
    Session.set("JustificantesDoc", this._id);
    AutoForm.resetForm("comentar_justificante_XP");
    $("#tabular_table_justify2").modal('open');
  }
});

Template.comentar_justificante.onCreated(function () {
  ActivateCreateKeyboard();
});

Template.comentar_justificante.rendered= function () {
  ActivateCreateKeyboard();
}

Template.comentar_justificante.helpers({
  JustificantesDoc: function(){
    var _id=Session.get("JustificantesDoc");
    if(_id!=undefined){
      var algo=Justificantes.findOne({"_id":_id});
      return algo;
    }
  }
});


AutoForm.addHooks('comentar_justificante_XP', {
  formToModifier: function(modifier) {
    var idEmp=modifier.$set.idEmp;
    var fecha=modifier.$set.fecha;
    var procede=modifier.$set.procede;
    var observaciones_admin=modifier.$set.observaciones_admin;
    var EmployeeName=modifier.$set.idEmpName;
    var data=Justificantes.findOne({"idEmp" : idEmp,"fecha":fecha});
    var estatus="No justificada";
    if(procede)
      estatus="Justificada"
    if(data!=undefined){
      var empleado=Persons.findOne({"idEmployee":idEmp,"employeeName":EmployeeName});
      if(empleado!=undefined){
        WriteNotificaciones(EmployeeName,"Justificante","USERS","",empleado._id);
      }
      Justificantes.update({_id:data._id}, {$set:{estatus:estatus,procede:procede,observaciones_admin:observaciones_admin}});
    }
    setTimeout(function () { }, 100);
    $("#tabular_table_justify2").modal('close');
 },
});

function ActivateCreateKeyboard(){
  var isStation=Config_application.findOne({"active":true});
    if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false && isStation.showKeyboard==true){
        var inp = document.getElementsByTagName('input');
        var inp2 = document.getElementsByTagName('textarea');
        for(var i in inp){
            if(inp[i].type == "text"||inp[i].type == "number"||inp[i].type == "textarea"){
              var elemento=inp[i].name;
              if(elemento){
                try {
                  $("[name='"+elemento+"']").keyboard({ layout: 'qwerty' });
                } catch (e) {
                }
              }             
            }
      }

      for(var i in inp2){
          if(inp2[i].type == "text"||inp2[i].type == "number"||inp2[i].type == "textarea"){
            var elemento=inp2[i].name;
            if(elemento){
              try {
                $("[name='observaciones_admin']").keyboard({ layout: 'qwerty' });
              } catch (e) {
              }
            }           
          }
    }

    }
}
