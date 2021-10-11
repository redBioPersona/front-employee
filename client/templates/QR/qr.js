Template.qr.helpers({
    'idEmp': function () {
        var data=this.idEmployee;
        var result="Sin Asignar";
        if(data!=undefined){
            result=data;
        }
        return result;
    },
    'restaurante': function () {
        var data=this.restaurantName;
        var result="Sin Asignar";
        if(data!=undefined){
            result=data;
        }
        return result;
    },
    'nombre': function () {
        var data=this.employeeName;
        var result="Sin Asignar";
        if(data!=undefined){
            result=data;
        }
        return result;
    },
    'fecha': function () {
        var data=this.fecha;
        var result="Sin Asignar";
        if(data!=undefined){
            result=data;
        }
        return result;
    },
    'hora': function () {
        var data=this.registro;
        var result="Sin Asignar";
        if(data!=undefined){
            result=data;
        }
        return result;
    },
    'folio': function () {
        var data=this.folio;
        var result="Sin Asignar";
        if(data!=undefined){
            result=data;
        }
        return result;
    },
    "compania": function () {
        var result = "Sin Asignar";
        var gc=[];
        if(typeof this.idcompany=="object"){
          gc=this.idcompany;
        }else{
          gc[0]=this.idcompany;
        }
        if(gc!=undefined){
            Meteor.subscribe("getOneCompany", gc);
            var Data = Companies.findOne({ "_id": {$in:gc} });
            if (Data != undefined) {
                result = Data.companyName;
            }
        }
        return result;
    },
    "photo": function () {
      var result = "/images/no-photo.png";
      Meteor.subscribe("getOnePhotoPerson", this._idEmployee);
      var Data = Persons.findOne({ "_id": this._idEmployee });
      if (Data != undefined && Data.face != undefined) {
          result = Data.face.url;
      }
      return result;
    }
});

Template.qr.onCreated(function () {
    var _id = RouterLayer.getParam('_id');
    var _idEmp = this._idEmployee;
    this.subscribe('GetOneTicket', _id);
    this.subscribe('GetOnePerson', _idEmp);
    this.subscribe('companies');
});
