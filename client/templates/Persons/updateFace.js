ResultadoUpdateFaceFromEmployees=function(){
  var result="";
  if(Session.get("ResultadoUpdateFace")!=undefined){
    if(Session.get("IdUpdateFace")!=undefined){
      var _id=Session.get("IdUpdateFace");
      Meteor.subscribe("getBiometricOperations", _id);
      var data=BiometricOperations.findOne({"_id":_id});
      if(data!=undefined){
        var Action=data.Action;
        var VerifySamples=data.VerifySamples;
        if(Action!=undefined){
          var Resultado=data.Resultado;
          if(Action=="VerifyFace"){
            if(Resultado!=undefined){
              if(Resultado=="Correcto"){
                Session.set('ClickTakePhoto',false);
                var prFace=false;
                var MyFileString;
                var MyFile;
                var encoding;
                var name;
                result="La imagen es correcta, espere porfavor";
                var file=document.getElementById('face_to_upload');
                if(file!=undefined && file.files[0]){
                  console.log("paraF");
                  var archivo = file.files[0];
                  var fileReader = new FileReader();
                  fileReader.onload = function () {
                    if (fileReader.readAsBinaryString) {
                      prFace=true;                      
                      MyFile=fileReader.result;
                      name = archivo.name;
                      encoding = "binary";
                      MyFileString=btoa(fileReader.result);                      
                      Meteor.call('ToWSFaceValidator',MyFileString,"EnrollFace",undefined, undefined,"yes","no",data.IdBiometricPerson);
                      Meteor.call('RelationImageWithEmployee', MyFile, name, encoding,data.IdBiometricPerson);
                      sAlert.success('Imagen agregada existosamente');
                      sAlert.info('Espere un momento se esta actualizando su fotografía');
                      $('#ModalUpdateFace').modal('close');
                      Session.set("PersonUpdateFace",undefined);
                    }
                  };
                  if (fileReader!=undefined && fileReader.readAsBinaryString) {
                    fileReader.readAsBinaryString(archivo);
                  } else if(fileReader!=undefined) {
                    fileReader.readAsArrayBuffer(archivo);
                  }
                }else if(Session.get("DataUpdateFace")){
                  if(data.Detalle[0].PersonId==data.IdBiometricPerson){
                    console.log("Todo coinciden al actualizar");
                    prFace=true;
                    MyFileString=Session.get("DataUpdateFace");
                    MyFile=MyFileString;
                    encoding="base64";
                    name="FaceEmployee.jpg";
                    
                    Meteor.call('ToWSFaceValidator',MyFileString,"EnrollFace",undefined, undefined,"yes","no",data.IdBiometricPerson);
                    Meteor.call('RelationImageWithEmployee', MyFile, name, encoding,data.IdBiometricPerson);
                    sAlert.success('Imagen agregada existosamente');
                    sAlert.info('Espere un momento se esta actualizando su fotografía');
                    Session.set('ClickTakePhoto',false);
                    Session.set("PersonUpdateFace",undefined);
                    Session.set('DataUpdateFace',undefined);
                  }else{
                    sAlert.info('Esta persona no coincide con tu fotografía almacenada');
                    result="Esta persona no coincide con tu fotografía almacenada";
                  }                  
                }else{
                  console.log("Ninguno");
                }
              }else if (Resultado=="Incorrecto") {
                $("#Take_Photo_Template_Face").removeClass("disabled")
                if(data.Detalle[0]!=undefined && data.Detalle[0].estatus){
                  var Estatus=data.Detalle[0].estatus;
                  if(Estatus=="OBJECT_NOT_FOUND"){
                    result="Persona no encontrada en la imagen";
                  }else if (Estatus=="BAD_SHARPNESS") {
                    result="La calidad de la imagen es muy baja, intente con otra fotografia";
                  } else if (Estatus=="NotFound") {
                    if(VerifySamples==null){
                      sAlert.info('Espere porfavor, validando la calidad de la imagen');
                      console.log("aqui, agregando..");
                      Session.set('ClickTakePhoto',false);
                      var prFace=false;
                      var MyFileString;
                      var MyFile;
                      var encoding;
                      var name;
                      result="Cargando...";
                      var file=document.getElementById('face_to_upload');
                      if(file!=undefined && file.files[0]){
                        console.log("paraF");
                        var archivo = file.files[0];
                        var fileReader = new FileReader();
                        fileReader.onload = function () {
                          if (fileReader.readAsBinaryString) {
                            prFace=true;                      
                            MyFile=fileReader.result;
                            name = archivo.name;
                            encoding = "binary";
                            MyFileString=btoa(fileReader.result);                      
                            Meteor.call('ToWSFaceValidator',MyFileString,"EnrollFace",undefined, undefined,"yes","no",data.IdBiometricPerson);
                            Meteor.call('RelationImageWithEmployee', MyFile, name, encoding,data.IdBiometricPerson);
                            sAlert.success('Imagen agregada existosamente');
                            sAlert.info('Espere un momento se esta actualizando su fotografía');
                            $('#ModalUpdateFace').modal('close');
                            Session.set("PersonUpdateFace",undefined);
                          }
                        };
                        if (fileReader!=undefined && fileReader.readAsBinaryString) {
                          fileReader.readAsBinaryString(archivo);
                        } else if(fileReader!=undefined) {
                          fileReader.readAsArrayBuffer(archivo);
                        }
                      }else if(Session.get("DataUpdateFace")){
                        prFace=true;
                        MyFileString=Session.get("DataUpdateFace");
                        MyFile=MyFileString;
                        encoding="base64";
                        name="FaceEmployee.jpg";
                        
                        Meteor.call('ToWSFaceValidator',MyFileString,"EnrollFace",undefined, undefined,"yes","no",data.IdBiometricPerson);
                        Meteor.call('RelationImageWithEmployee', MyFile, name, encoding,data.IdBiometricPerson);
                        sAlert.success('Imagen agregada existosamente');
                        sAlert.info('Espere un momento se esta actualizando su fotografía');
                        Session.set('ClickTakePhoto',false);
                        Session.set("PersonUpdateFace",undefined);
                        Session.set('DataUpdateFace',undefined);
                      }else{
                        console.log("Ninguno");
                      }
                    }else{
                      result="Esta persona no coincide con tu fotografía almacenada";
                    }
                  }else{
                    console.log("Estatus desconocido "+Estatus);
                    result=Estatus;
                  }
                }
              }
            }
          }else if(Action=="EnrollFace"){
            if(Resultado!=undefined){
              if(Resultado=="Correcto"){
                Session.set('ClickTakePhoto',false);
                result="La imagen es correcta, espere porfavor";
                var file=document.getElementById('face_to_upload');
                if(file!=undefined && file.files[0]){
                  var archivo = file.files[0];
                  var fileReader = new FileReader();
                  fileReader.onload = function () {
                    if (fileReader.readAsBinaryString) {
                      var MyFile=fileReader.result;
                      var name = archivo.name;
                      var encoding = "binary";
                      Meteor.call('RelationImageWithEmployee', MyFile, name, encoding,data.IdBiometricPerson);
                      sAlert.success('Imagen agregada existosamente');
                      sAlert.info('Espere un momento se esta actualizando su fotografía');
                      $('#ModalUpdateFace').modal('close');
                      Session.set("PersonUpdateFace",undefined);
                    }
                  };
                  if (fileReader.readAsBinaryString) {
                    fileReader.readAsBinaryString(archivo);
                  } else {
                    fileReader.readAsArrayBuffer(archivo);
                  }
                }else{
                  console.log("EnrollFace not file");
                }                
              }else if (Resultado=="Incorrecto") {
                $("#Take_Photo_Template_Face").removeClass("disabled")
                if(data.Detalle[0]!=undefined && data.Detalle[0].estatus){
                  var Estatus=data.Detalle[0].estatus;
                  var PersonId=data.Detalle[0].PersonId;

                  if(Estatus=="OBJECT_NOT_FOUND"){
                    result="Persona no encontrada en la imagen";
                  }else if (Estatus=="PersonAlreadyEnroll") {
                    /**
                     * Cuando un empleado ya enrolado agrega una foto valida para ser usada como rec facial
                    */
                    var IdBiometricPerson=Session.get('PersonUpdateFace');
                    if(PersonId==IdBiometricPerson){
                      var file=document.getElementById('face_to_upload');
                      var archivo = file.files[0];
                      var fileReader = new FileReader();
                      fileReader.onload = function () {                        
                        var MyFile=fileReader.result;
                        var name = archivo.name;
                        var encoding = "binary";
                        Meteor.call('RelationImageWithEmployee', MyFile, name, encoding,IdBiometricPerson);
                        var MyFileString=btoa(fileReader.result);
                        Meteor.call('ToWSFaceValidator',MyFileString,"EnrollFace",undefined, undefined,"yes","no",IdBiometricPerson,undefined);
                        sAlert.success('Imagen agregada existosamente');
                        
                        sAlert.info('Espere un momento se esta actualizando su fotografía');
                        $('#ModalUpdateFace').modal('close');
                        Session.set("PersonUpdateFace",undefined);
                      };       
                      if (fileReader.readAsBinaryString) {
                        fileReader.readAsBinaryString(archivo);
                      } else {
                        fileReader.readAsArrayBuffer(archivo);
                      }
                    }else{
                      result="Persona ya enrolada en el sistema, no es posible duplicados";                        
                    }                      
                  }else{
                    result="La calidad de la imagen es muy baja, intente con otra fotografia";
                  }
                }
              }
            }
          }
        }
      }
    }else{
      result=Session.get("ResultadoUpdateFace");
    }
  }else{
    result="Proceso No Iniciado";
  }
  return result;
};

Template.updateFace.helpers({
  IsUpdateFace:function(){
    var result="disabled";
    if(Sensors.find({"FaceService" : true}).count()!=0){
      result="enabled";
    }
    return result;
  },
  ResultadoUpdateFace:function(){
    return ResultadoUpdateFaceFromEmployees();
  }
});

Template.updateFace.events({
  "change #face_to_upload": function(evt, temp){
    logReport.info("Actualizando foto del empleado");
    var file = document.getElementById("face_to_upload");
    var archivo = file.files[0];
    if (archivo != undefined) {
      let size = archivo.size;
      logReport.info("Tamaño "+size+" name "+archivo.name);
      if(size<=2097152){
        let name = archivo.name;
        let cadenas=name.split(".");
        var ext=cadenas[cadenas.length-1];
        if(ext=="jpeg" || ext=="jpg" || ext=="png"){
          var fileReader = new FileReader();
          fileReader.onload = function () {
            if (fileReader.readAsBinaryString) {
                  var MyFile=btoa(fileReader.result);
                  var VerifySamples=undefined;
                  var SaveIntoServRest="yes";
                  var AvoidDuplicates="yes";
                  var IdBiometricPerson=Session.get('PersonUpdateFace');
                  logReport.info("IdBiometricPerson "+IdBiometricPerson);
                  var dataPerson=Persons.findOne({_id:IdBiometricPerson});
                  logReport.info("dataPerson "+JSON.stringify(dataPerson));
                  var Action="EnrollFace";
                  var FaceTemplate=dataPerson.FaceTemplate;
                  if(FaceTemplate){
                    var PersonIdBiometric=(dataPerson.PersonIdBiometric)?dataPerson.PersonIdBiometric:dataPerson._id;
                    if(PersonIdBiometric!=undefined){
                      Action="VerifyFace";
                      VerifySamples=PersonIdBiometric;
                      IdBiometricPerson=PersonIdBiometric;
                    }
                  }
                  Session.set("ResultadoUpdateFace", "Imagen procesandose..., espere porfavor");
                  logReport.info("Env WS, Action :"+Action+" VerifySamples "+VerifySamples+" AvoidDuplicates "+AvoidDuplicates+" IdBiometricPerson "+IdBiometricPerson);

                  Meteor.call('ToWSFaceValidator',MyFile,Action,undefined, VerifySamples,SaveIntoServRest,AvoidDuplicates,IdBiometricPerson,function(err,res){
                    if(res){
                      Session.set("IdUpdateFace", res);
                    }
                  });
            }
          };
          fileReader.onloadend = function (e) {};
          fileReader.onprogress = function (e) {};
          fileReader.onabort = function (e) {};
          fileReader.onerror = function (e) {
            Session.set("ResultadoUpdateFace", 'Imagen no cargada');
          }
          if (fileReader.readAsBinaryString) {
            fileReader.readAsBinaryString(archivo);
          } else {
            fileReader.readAsArrayBuffer(archivo);
          }
        }else{
          Session.set("ResultadoUpdateFace", 'Tipos de archivos soportados .jpeg, .jpg y .png');
        }
      }else{
        Session.set("ResultadoUpdateFace", 'Archivo muy grande, debe ser menor a 2MB');
      }
    }
  }
});
