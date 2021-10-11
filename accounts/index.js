if (Meteor.isClient) {

  Template.orionMaterializeAccountIndex_XP.onCreated(function () {
    Meteor.subscribe('getUsers',Meteor.userId, {
      onError: function (error) {console.log("error "+error);},
      onReady: function () {}
    });
  });

  Template.orionMaterializeAccountIndex_XP.events({
    "click #UpdateFace": function(event, template){
      var userId=Meteor.userId();
      var res = Meteor.users.findOne({ "_id": userId });
      if (res && res.profile && res.profile.idEmployee) {
        var _id = res.profile.idEmployee;
        var dataPerson=Persons.findOne({"_id":_id});
        if(dataPerson!=undefined){
          Session.set("IdUpdateFace", undefined);
          Session.set("ResultadoUpdateFace", undefined);
          Session.set("PersonUpdateFace", _id);
          $("#ModalUpdateFace").modal('open', { dismissible: false });
        }else{
          sAlert.error("Persona no asociada a tu cuenta");
        }
      }else{
        sAlert.error("Persona no asociada a tu cuenta");
      }
    }
  });

  Template.orionMaterializeAccountIndex_XP.helpers({
    IsUpdateFace:function(){
      var result=false;
      if(Sensors.find({"FaceService" : true}).count()!=0){
        result=true;
      }
      return result;
    },
    getCompany: function(empleadoId) {
      if (!empleadoId || empleadoId == "") {
        return "<FALTA ASIGNAR>";
      } else {
        var idx=empleadoId.toString();
        var ids= idx.split(',');
        var result=[];
        for (var i = 0; i < ids.length; i++) {
          var id=ids[i];
          var empleado = Companies.findOne({ _id: id });
          if (empleado) {
            result.push(empleado.companyName);
          } else {
            result.push("<FALTA ASIGNAR>");
          }
        }
        return result;
      }
    },
    getEmployee: function(empleadoId) {
      if (!empleadoId || empleadoId == "") {
        return "<FALTA ASIGNAR>";
      } else {
        var result;
        var empleado = Persons.findOne({ _id: empleadoId });
        if (empleado) { result=empleado.employeeName; }
        else { result="<FALTA ASIGNAR>"; }
        return result;
      }
    },
    getImageProfile: function(empleadoId) {
      var Data=Persons.findOne({"_id":empleadoId},{fields:{"_id":1,face:1}});
      var result="/images/no-photo.png";
      if(Data!=undefined && Data.face!=undefined && Data.face.url!=undefined){
        result=Data.face.url;
      }
      return result;
    }
  });

}
