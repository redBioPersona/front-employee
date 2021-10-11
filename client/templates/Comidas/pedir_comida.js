if(Meteor.isClient){
  Template.ask_meal.events({
    "click #yes_print": function(event, template){
      var _idRestaurant=$('#RestaurantSelectX').val();
      logAccesos.info("El usuario selecciono el restaurante "+_idRestaurant);
      if(_idRestaurant!=undefined){
        document.getElementById("InstruccionesImpresion").innerHTML = "Imprimiendo..., espere por favor";
        var data=Print_ticket.findOne({"active":true});
        if (data!=undefined) {
          var idEmployee=data.idEmployee;
          Meteor.call("yes_print_ticket", idEmployee,_idRestaurant,function(err,res){
            if(err){
              document.getElementById("InstruccionesImpresion").innerHTML = "...";
            }else{
              if(res){
                logAccesos.info("Cerrando modal Impresión exitosa");
                sAlert.success('Impresión exitosa');
                $('#modal_ask_meal').modal('close');
              }else{
                document.getElementById("InstruccionesImpresion").innerHTML = "...";
              }
            }
          });
          Session.set("ProcessingSample",false);
        }
      }else{
        document.getElementById("InstruccionesImpresion").innerHTML = "Es necesario seleccionar el restaurante de su preferencia";
      }
    },
    "click #cancel_print": function(event, template){
      var data=Print_ticket.findOne({"active":true});
      if (data!=undefined) {
        var idEmployee=data.idEmployee;
        Meteor.call("cancel_print_ticket", idEmployee);
      }
      $('#modal_ask_meal').modal('close');
      Session.set("ProcessingSample",false);
    },
    "click #no_print": function(event, template){
      var data=Print_ticket.findOne({"active":true});
      if (data!=undefined) {
        var idEmployee=data.idEmployee;
        Meteor.call("no_print_ticket", idEmployee);
      }
      $('#modal_ask_meal').modal('close');
      Session.set("ProcessingSample",false);
    },
    "change #RestaurantSelectX":function(event,template){
      var _idRestaurant=$('#RestaurantSelectX').val();
      Meteor.call("getRestaurantName",_idRestaurant,function(err,res){
        if(res){
          document.getElementById("RestSel").innerHTML = res;
        }
      });
    }
  });

  Template.ask_meal.helpers({
    ticket_name: function(){
      var result="";
      var data=Print_ticket.findOne({"active":true});
      if (data!=undefined) {
        result=data.employeeName;
        get_restaurants();
      }
      return result;
    }
  });

  Template.ask_meal.rendered = function(){
    document.getElementById("InstruccionesImpresion").innerHTML = "Porfavor seleccione el Restaurante de su preferencia";
  }

  Template.ask_meal.onCreated = function(){
  };

  get_restaurants = function() {
    $('#RestaurantSelectX') .find('option') .remove() .end();
    var options = $("#RestaurantSelectX");

    var data=Print_ticket.findOne({"active":true});
    if (data!=undefined && data.idCompany) {
      Meteor.call("load_restaurant", data.idCompany, function(error, result){
        if(result){
          var locationxx=result;
          options.append($("<option disabled selected>").val('').text('Seleccione una opción'));
          for (var i = 0; i < Object.keys(locationxx).length; i++) {
            options.append($("<option />").val(locationxx[i]._id).text(locationxx[i].restaurantName));
          }
          $('select').material_select();
        }
      });
    }else{
      logAccesos.info("Se mostro el modal, pero no existe Print_ticket en get_restaurants");
    }
  }
}
