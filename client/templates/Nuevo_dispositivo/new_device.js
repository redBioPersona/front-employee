if(Meteor.isClient){
  Template.new_device.events({
    "click .btn-excel": function(event, template){
      var _idLocation=$("#LocationSelectX").val();
      var _idDevices=Temp_messages.findOne({"active":true}).device;
      var _idTemp_messages=Temp_messages.findOne({"active":true})._id;
      Devices.update({_id:_idDevices}, {$set:{ "idLocation":_idLocation }});
      Temp_messages.update({_id:_idTemp_messages}, {$set:{ "new_device":false }});
      $('#tabular_table_analysis').modal('close');
    }
  });

    Template.new_device.rendered = function(){
        clearSelectSem_det();
    }

    Template.new_device.onCreated = function(){
       clearSelectSem_det();
    };

  clearSelectSem_det = function() {
    $('#LocationSelectX') .find('option') .remove() .end();
    var options = $("#LocationSelectX");
    Meteor.call("load_locations", function(error, result){
      if(result){
        var locationxx=result;
        options.append($("<option disabled selected>").val('').text('Seleccione una opción'));
         for (var i = 0; i < Object.keys(locationxx).length; i++) {
           options.append($("<option />").val(locationxx[i]._id).text(locationxx[i].locationName));
         }
        $('select').material_select();
      }

    });

  }

}
