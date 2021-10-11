Template.TmplUpdateFingers.helpers({
  IsModal:function(){
    var result=false;
    if(Session.get('ModalUpdateFinger')!=undefined){
      result=true;
    }
    return result;
  },
  IsUpdateFingerValidator:function(){
    var result="disabled";
    if(Sensors.find({"FaceService" : true}).count()!=0 &&
      Sensors.find({"FingerService" : true}).count()!=0){
      result="enabled";
    }
    return result;
  },
  IsUpdateFingerDevices:function(){
    var result="disabled";
    if(Sensors.find({"FingerService" : true}).count()!=0){
      result="enabled";
    }
    return result;
  },
  getFingersEnrolled:function(){
    if(Session.get('PersonUpdateFinger')!=undefined){
      var IdBiometricPerson=Session.get('PersonUpdateFinger');
      var DataPersons="";
      if(Persons.findOne({"_id":IdBiometricPerson},{fields:{"_id":1}})!=undefined){
        var DataPersons=Persons.findOne({_id:IdBiometricPerson,"PersonIdBiometric":IdBiometricPerson});
      }
      if(Employees.findOne({"_id":IdBiometricPerson},{fields:{"_id":1}})!=undefined){
        var DataPersons=Employees.findOne({_id:IdBiometricPerson});
      }

      if(DataPersons!=undefined){
          var HuellasSuficientes=0;
          Object.keys(DataPersons).forEach(function (key) {
            if(key.includes('_left_template')){
              ++HuellasSuficientes;
              var radio=key.replace("_left_template","");
              $("#" + radio).prop("checked", true);
              $("#" + radio).prop("disabled", true);
            }
          });
          if(HuellasSuficientes>=2){
            $("#biometric_continue_finger").removeClass('disabled');
          }
      }
    }
  },
  ResultadoUpdateFinger: function () {
    var result="Sin Iniciar";
    if(Session.get("ResultadoUpdateFinger")!=undefined){
      if(Session.get("IdUpdateFinger")!=undefined){
        if(Session.get("MethodUpdateFinger")=="Archivo"){
          result="Validando la imagen...";
        }else if (Session.get("MethodUpdateFinger")=="Sensor") {
          result="Coloque su dedo en el sensor y espere por favor";
        }
        var _id=Session.get("IdUpdateFinger");
        Meteor.subscribe("getBiometricOperations", _id);
        var data=BiometricOperations.findOne({"_id":_id});
        if(data!=undefined){
          var Action=data.Action;
          if(Action!=undefined){
            var Resultado=data.Resultado;
            if(Action=="EnrollFinger"){
              if(Resultado!=undefined){
                if(Resultado=="Correcto"){
                  result="Huella agregada exitosamente";
                  $("#" + data.Extra).prop("checked", true);
                  $("#" + data.Extra).prop("disabled", true);
                  Meteor.call('RelationFingerWithEmployee', data.IdBiometricPerson,data.Detalle[0].PersonIdSample,data.Extra);
                }else if (Resultado=="Incorrecto") {
                  if(data.Detalle[0]!=undefined && data.Detalle[0].estatus){
                    var Estatus=data.Detalle[0].estatus;
                    if(Estatus=="OBJECT_NOT_FOUND"){
                      result="Huella no encontrada en la imagen";
                    }if(Estatus=="BAD_OBJECT"){
                      result="Huella no encontrada en la imagen";
                    }else if (Estatus=="PersonAlreadyEnroll") {
                      result="Persona ya enrolada en el sistema, no es posible duplicados";
                    }
                  }
                }
              }
            }
          }
        }
      }else{
        result=Session.get("ResultadoUpdateFinger");
      }
    }
    return result;
  },
});
Template.TmplUpdateFingers.onRendered = function(){
  Session.set("DedoUpdateFinger", undefined);
  $("#biometric_continue_finger").addClass('disabled');
}
Template.TmplUpdateFingers.events({
  "click #biometric_cancel_finger":function(evt,temp){
      CancelandoEnrolamiento();
  },
  "click #biometric_continue_finger": function (evt, temp) {
    var Data=Config_application.findOne({active:true});
    var Can_enroll_docs,Can_enroll_face,Can_enroll_sign;
    if (Data!=undefined) {
      Can_enroll_docs=Data.enroll_docs;
      Can_enroll_face=Data.enroll_face;
      Can_enroll_sign=Data.enroll_sign;
    }
    if (Can_enroll_face) {
      $('#stepper2').addClass('step-done');
      $('#stepper2').removeClass('editable-step');
      $('#stepper3').addClass('active-step');
      $('#stepper3').addClass('editable-step');
      try{
        activeStep($('#step3'));
      }catch(ex){}
      
    }else if (Can_enroll_sign) {
      links_ocultos("link_huella_firma");
      $("#link_huella_firma").click();
    }else if (Can_enroll_docs) {
      links_ocultos("link_huella_documentos");
      $("#link_huella_documentos").click();
    }else{
      links_ocultos("link_huella_fin");
      $("#link_huella_fin").click();
    }
  },
  "change #FormGroupSignE":function(evt,temp){
    var radios = document.getElementById("FormGroupSignE").elements;
    var existe=false;
    var rad = 0,seleccionado, enrolados = [];
    for (var i = 0; i < radios.length; i++) {
      if ($("#"+radios[i].id).is(":checked") && (radios[i].id=="no_fingers_na"||radios[i].id=="no_fingers_xx")){
          existe=true;
      }

      if (radios[i].type == "radio" && radios[i].checked) {
        var selected = radios[i].id;
        var x = document.getElementById(selected).disabled;
        if (x) {
          enrolados.push(radios[i].id);
        } else {
          seleccionado = radios[i].id;
          rad++;
        }
      }
    }
    if (rad>0) {
      Session.set("DedoUpdateFinger", seleccionado);
    }
    if(existe){
      $("#biometric_continue_finger").removeClass('disabled');
    }else{
      $("#biometric_continue_finger").addClass('disabled');
    }
  },
  "click #biometric_capture_finger":function(evt,temp){
    var IdBiometricPerson=Session.get("PersonUpdateFinger");
    var Extra=Session.get("DedoUpdateFinger");
    Session.set("MethodUpdateFinger","Sensor");
    Session.set("IdUpdateFinger", undefined);
    if(Extra!=undefined){
      Session.set("ResultadoUpdateFinger",'Coloque su dedo en el sensor, y espere por favor');
      Meteor.call('ToWSDeviceManager',"EnrollFinger",undefined,"yes","yes",IdBiometricPerson,Extra,function(err,res){
        if(res){
          console.log("rec server "+res);
          Session.set("IdUpdateFinger", res);
        }
      });
    }else{
      Session.set("ResultadoUpdateFinger",'Selecciona la opción del dedo a enrolar');
    }
  },
  "change #finger_to_upload": function (evt, temp) {
    Session.set("ResultadoUpdateFinger",undefined);
    Session.set("IdUpdateFinger",undefined);
    Session.set("MethodUpdateFinger","Archivo");
    if (Session.get("DedoUpdateFinger")==undefined) {
      Session.set("ResultadoUpdateFinger",'Selecciona la opción del dedo a enrolar');
      $("#finger_to_upload").val('');
    } else {
      var dedoSeleccionado = Session.get("DedoUpdateFinger");
      var file = document.getElementById("finger_to_upload");
      var archivo = file.files[0];
      if (archivo != undefined) {
        let size = archivo.size;
        if(size<=2097152){
          let name = archivo.name;
          let cadenas=name.split(".");
          var ext=cadenas[cadenas.length-1];
          if(ext=="jpeg" || ext=="jpg" || ext=="png" || ext=="wsq"){
            if (dedoSeleccionado == undefined || dedoSeleccionado == "ninguno") {
              Session.set("ResultadoUpdateFinger",'Porfavor seleccione el dedo que esta enrolando');
            } else {
              var fileReader = new FileReader();
              let encoding = "binary";
              let name = archivo.name;
              fileReader.onload = function () {
                if (fileReader.readAsBinaryString) {
                  var MyFile=btoa(fileReader.result);
                  var VerifySamples=undefined;
                  var SaveIntoServRest="yes";
                  var AvoidDuplicates="yes";
                  var Action="EnrollFinger";
                  var IdBiometricPerson=Session.get('PersonUpdateFinger');
                  var dataPerson=Persons.findOne({_id:IdBiometricPerson});
                  if(dataPerson!=undefined){
                    var FingerTemplate=dataPerson.FingerTemplate;
                    if(FingerTemplate){
                      var PersonIdBiometric=dataPerson.PersonIdBiometric;
                      if(PersonIdBiometric!=undefined){
                        IdBiometricPerson=PersonIdBiometric;
                      }
                    }
                  }
                  Session.set("ResultadoUpdateFinger", "Imagen procesandose..., espere porfavor");
                  Meteor.call('ToWSFaceValidator',MyFile,Action,undefined, VerifySamples,SaveIntoServRest,AvoidDuplicates,IdBiometricPerson,dedoSeleccionado,function(err,res){
                    if(res){
                      Session.set("IdUpdateFinger", res);
                    }
                  });
                }
              };
              fileReader.onloadend = function (e) {};
              fileReader.onprogress = function (e) {};
              fileReader.onabort = function (e) {};
              fileReader.onerror = function (e) {
                Session.set("ResultadoUpdateFinger", 'Imagen no cargada '+e);
              };
              if (fileReader.readAsBinaryString) { fileReader.readAsBinaryString(archivo); }
              else { fileReader.readAsArrayBuffer(archivo); }
            }
          }else{
            Session.set("ResultadoUpdateFinger", 'Tipos de archivos soportados .jpeg, .jpg, .png y .wsq');
          }
        }else{
          Session.set("ResultadoUpdateFinger",'Archivo muy grande, debe ser menor a 2MB');
        }
      }
    }
  }
});
