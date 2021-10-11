var wrapper,clearButton ,saveButton,canvas,signaturePad;


Template.sigpad.onRendered(function(){
  wrapper = document.getElementById("signature-pad");
  canvas = wrapper.querySelector("canvas");
  function resizeCanvas() {
      var ratio =  Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
  }

  window.onresize = resizeCanvas;
  resizeCanvas();
  signaturePad = new SignaturePad(canvas);
  Session.set("sign_accion",undefined);
  $(".save").removeClass('disabled');
  $(".clear").removeClass('disabled');
});

Template.sigpad.rendered = function() {
  wrapper = document.getElementById("signature-pad");
  canvas = wrapper.querySelector("canvas");
  function resizeCanvas() {
      var ratio =  Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
  }

  window.onresize = resizeCanvas;
  resizeCanvas();
  signaturePad = new SignaturePad(canvas);
  Session.set("sign_accion",undefined);
  $(".save").removeClass('disabled');
  $(".clear").removeClass('disabled');

};


Template.sigpad.helpers({
  accion:function(){
    var accion=Session.get("sign_accion");
    var result="Saltar";
    if(accion!=undefined){
      result="Continuar";
    }
    return result;
  }  
});

Template.sigpad.events({
  "click [data-action=clear]": function() {
    signaturePad.clear();
  },
  "click [data-action=save]": function() {
    if (signaturePad.isEmpty()) {
        sAlert.warning('Para guardar su firma es necesario haber colocado alguna');
        Session.set("sign_accion",undefined);
    } else {
        var image = signaturePad.toDataURL("image/png");
        var data = image.replace(/^data:image\/\w+;base64,/, "");
        IdNavegador = generateId();
        Meteor.call("Saving_sign", data,IdNavegador);
        Session.set("sign_accion","Continuar");
        $(".save").addClass('disabled');
        $(".clear").addClass('disabled');
    }
  },
});
