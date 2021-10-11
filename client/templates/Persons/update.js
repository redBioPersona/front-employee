Template.orionMaterializeCollectionsUpdate_OXP.onCreated(function () {
  Meteor.subscribe('get_documents', {
    onError: function (error) {console.log("error "+error);},
    onReady: function () {}
  });
  Meteor.subscribe('get_Temp_messages', {
    onError: function (error) {console.log("error "+error);},
    onReady: function () {}
  });
});


Template.orionMaterializeCollectionsUpdate_OXP.helpers({
  ResultadoUpdateFace:function(){
    return ResultadoUpdateFaceFromEmployees();
  },
  IsUpdateFace:function(){
    var result=false;
    if(Session.get('ClickTakePhoto')!=true){
      if(Sensors.find({"FaceService" : true}).count()!=0){
        result=true;
      }
    }    
    return result;
  },
  IsUpdateFinger:function(){
    var result=false;
    if(Sensors.find({"DeviceFingerConnect" : true}).count()!=0){
      result=true;
    }
    return result;
  },
  employeeNam:function(){
    return Session.get("employeeNam");
  },
  /*
    txt_process_biometric_enroll: function () {
      var dedo = Session.get('Session_biometric_finger_update_enroll');
      var resultado = "No Iniciado";
      if (dedo != undefined) {
          var dedos = dedo + "_left_proceso";
          var bin = Enrollments_temp.findOne({"active": true});
          if (bin != undefined) {
              if (bin[dedos] != undefined) {
                  resultado = bin[dedos];
              }
          }
      }
      return resultado;
  },
  txt_quality_biometric_enroll: function () {
      var dedo = Session.get('Session_biometric_finger_update_enroll');
      var resultado = "0 %";
      if (dedo != undefined) {
          var dedos = dedo + "_left_calidad";
          var bin = Enrollments_temp.findOne({"active": true});
          if (bin != undefined) {
              if (bin[dedos] != undefined) {
                  var data = bin[dedos];
                  switch (data) {
                      case "GOOD":
                          resultado = "Buena";
                          break;
                      case "VERY_GOOD":
                          resultado = "Buena";
                          break;
                      case "POOR":
                          resultado = "Pobre";
                          swal({
                              title: 'Mala Calidad',
                              text: 'Huella con mala calidad, intente nuevamente',
                              type: 'warning',
                              showCancelButton: false,
                              confirmButtonColor: '#32A617',
                              cancelButtonColor: '#F31414',
                              cancelButtonText: 'No',
                              confirmButtonText: 'Reintentar',
                              closeOnConfirm: true
                            }, function () {
                              var dedosN = dedo + "_left_normal";
                              var dataN= bin[dedosN];
                              var dedosB = dedo + "_left_binaria";
                              var dataB= bin[dedosB];
                              var dedosT = dedo + "_left_template";
                              var dataT= bin[dedosT];
                              var dedosE = dedo + "_left_estatus";
                              var dedosP = dedo + "_left_proceso";
                              $("#" + dedo).addClass('hide');
                              $("#" + dedo).prop("checked", false);
                              $("#" + dedo).prop("disabled", false);
                              Session.set("Session_biometric_finger_update_enroll",undefined);
                              Meteor.call("BadQuality",bin._id,dedo,dedosN,dedosB,dedosT,dedosE,dedos,dedosP,dataT,dataB,dataN);
                            });
                          break;
                      case "EXCELLENT":
                          resultado = "Excelente";
                          break;
                  }
              }
          }
      }
      return resultado;
  },

  txt_status_biometric_enroll: function () {
      var dedo = Session.get('Session_biometric_finger_update_enroll');
      var resultado = "Sin Iniciar";
      if (dedo != undefined) {
          var dedos = dedo + "_left_estatus";
          var bin = Enrollments_temp.findOne({
              "active": true
          });
          if (bin != undefined) {
              if (bin[dedos] != undefined) {
                  resultado = bin[dedos];
              }
          }
      }
      if (resultado == "OK") {
          $("#" + dedo).prop("checked", true);
          $("#" + dedo).prop("disabled", true);
          $("#" + dedo).attr("name", "new_name" + Math.floor((Math.random() * 100) + 1));
      }
      return resultado;
  },
  */
    fingers_enroll_biometric: function () {
        //ALGUNOS COMUNES
        var _id = RouterLayer.getParam('_id');
        var Data=Persons.findOne({"_id":_id});
        var datos=[];
        if(Data!=undefined){
            Object.keys(Data).forEach(function (key) {
                if(key.includes('_left_binaria') || key.includes('_left_template')){
                    var obj={};
                    var normal=key.substring(0,13);
                    obj.nombre= fingersName(normal);
                    datos.push(obj);
                }
            });
        }
        return datos;
      },
      existsFingers:function(){
        var _id = RouterLayer.getParam('_id');
        var Data=Persons.findOne({"_id":_id});
        var cuantos=0;
        var resultado=false;
        if(Data!=undefined){
            Object.keys(Data).forEach(function (key) {
                if(key.includes('_left_template')){
                  ++cuantos;
                }
            });
        }
        if(cuantos!=0){
          resultado=true;
        }
        return resultado;
      },
      /*
      biometric_finger_binarized: function () {
          var leng=Session.get("Session_biometric_update_enrolados");
          if(leng!=undefined && leng.length>=1){
              $("#biometric_continue_finger").removeClass('disabled')
          }

          if (Temp_messages.find({"status_verification": "FingerDuplicate"}).count()!=0) {
              swal({
                  title: 'Huella Duplicada',
                  text: 'No es posible enrolarse con la misma huella',
                  type: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#32A617',
                  cancelButtonColor: '#F31414',
                  cancelButtonText: 'No',
                  confirmButtonText: 'Reintentar',
                  closeOnConfirm: true
                }, function () {
                  Session.set("Session_biometric_finger_update_enroll",undefined);
                  var data=Temp_messages.findOne({"status_verification": "FingerDuplicate"});
                  Temp_messages.update({_id: data._id}, {$set: {status_verification: ""}});
                });
          }
          if (Temp_messages.find({"status_verification": "FaceDuplicate"}).count()!=0) {
              swal({
                  title: 'Rostro Duplicado',
                  text: 'Esta persona ya ha sido enrolada',
                  type: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#32A617',
                  cancelButtonColor: '#F31414',
                  cancelButtonText: 'No',
                  confirmButtonText: 'Reintentar',
                  closeOnConfirm: true
                }, function () {
                  $("#capture_face").removeClass('hide');
                  $("#continue_face").addClass('hide');
                  var data=Temp_messages.findOne({"active": true});
                  Temp_messages.update({_id: data._id}, {$set: {status_verification: ""}});
                });
          }

          var dedo = Session.get('Session_biometric_finger_update_enroll');
          var resultado = '/img/huella.png';
          if (dedo != undefined) {
              var dedos = dedo + "_left_binaria";
              var bin = Enrollments_temp.findOne({"active": true});
              if (bin != undefined) {
                  var img = bin[dedos];
                  if(img==undefined){
                      resultado = '/img/scanning_finger.gif';
                  }else{
                      resultado = '/gridfs/data/id/' + img;
                  }
              }
          }
          return resultado;
      },
      biometric_finger_image: function () {
        var dedo = Session.get('Session_biometric_finger_update_enroll');
        var resultado = '/img/huella.png';
        if (dedo != undefined) {
            var dedos = dedo + "_left_normal";
            var bin = Enrollments_temp.findOne({"active": true});
            if (bin != undefined) {
                var img = bin[dedos];
                if(img==undefined){
                    resultado = '/img/scanning_finger.gif';
                }else{
                    resultado = '/gridfs/data/id/' + img;
                }
            }
        }
        return resultado;
    },
    */
      face_person: function () {
        var _id = RouterLayer.getParam('_id');
        var Data=Persons.findOne({"_id":_id},{fields:{"_id":1,face:1}});
        var result="/images/no-photo.png";
        if(Data!=undefined && Data.face!=undefined){
            result=Data.face.url;
        }
        return result;
      },
      face_token:function(){
        var _id = RouterLayer.getParam('_id');
        var Data=Persons.findOne({"_id":_id},{fields:{"_id":1,faceToken:1}});
        var result="/images/no-photo.png";
        if(Data!=undefined && Data.faceToken!=undefined){
            result=Data.faceToken.url;
        }
        return result;
      },
      TakePhoto:function(){
        var data=Session.get('ClickTakePhoto');
        var result=false;
        if(data!=undefined && data==true){
          result=true;
        }
        return result;
      },
      ClickTakePhoto:function(){
        var data=Session.get('ClickTakePhoto');
        var result="TOMAR FOTO";
        var isp=Session.get("IdUpdateFaceByEmployee");

        if(data!=undefined && data==true){
          result="CAPTURAR IMAGEN";
        }
        return result;
      },
    ColorTabularIndex:function(){
     return ColorTabularIndex();
    },
    GetColorIconBack:function(){
     return GetColorIconBack();
    },
    FaceCustom:function(){
      var tem=Temp_messages.findOne({"active":true});
      if(tem!=undefined){
        var status=tem.status_verification;
        if(status=="BAD_OBJECT"){
          sAlert.error("Mala calidad de la imagen, intente nuevamente con una imagen con mayor resolucion");
        }else if(status=="LoadFaceBAD_OBJECT"){
          sAlert.error("Mala calidad de la imagen, intente nuevamente con una imagen con mayor resolucion");
        }else if(status=="LoadFaceOBJECT_NOT_FOUND"){
          sAlert.error("Persona no encontrada en la imagen");
        }else if(status=="LoadFaceDuplicate"){
          sAlert.error("Esta Persona ya ha sido enrolada");
        }else if(status=="LoadFaceBAD_DYNAMIC_RANGE"){
          sAlert.error("Mala calidad de la imagen, intente nuevamente con una imagen con mayor resolucion");
        }else if(status=="LoadFaceOk"){
          sAlert.success("Imagen actualizada Correctamente");
        }
        // var _id=tem._id;
        // Temp_messages.update({ _id: _id }, { $set: { status_verification: "" } });
        return status;
      }
    },
    GenerateTemplateFace:function(){
      // var _id = RouterLayer.getParam('_id');
      // var Data=Persons.findOne({"_id":_id},{fields:{"_id":1,FaceTemplate:1}});
      // var result=false;
      // if(Data!=undefined && Data.FaceTemplate!=undefined){
      //     result=false;
      // }
      // result=false;
      return false;
    },
  });
  Template.orionMaterializeCollectionsUpdate_OXP.events({
    "click #AceptarBaja":function(event,template){
      var _id = RouterLayer.getParam('_id');
      Meteor.call("ToWSDeleteBiometricValidator", _id);
      Meteor.call("DandoBaja", _id);
      $('#ModalEliminarHuellasCuenta').modal('close');
      $('#orionMaterializeCollectionsUpdateForm_OXP').submit();      
    },
    "click #RechazarBaja":function(event,template){
      $('#ModalEliminarHuellasCuenta').modal('close');
    },
    "click #ShowPreviewCam":function(event,template){
      navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
      navigator.getMedia({video: true}, function() {      
        var TP=Session.get('ClickTakePhoto');
        if(TP===false){
          Session.set('ClickTakePhoto',true);
          $("#UpdateFace").addClass('hide');
          $("#ShowPreviewCam").addClass('hide');
        }else{
          Session.set('ClickTakePhoto',false);
        }      
      }, function() {
        sAlert.error("Cámara web no disponible (permisos denegados o dispositivo no encontrado)");
      });
    },
    "click #UpdateFace": function(event, template){
      $("#UpdateFace").addClass('hide');
      $("#ShowPreviewCam").addClass('hide');

      Session.set('ClickTakePhoto',false);
      var _id = RouterLayer.getParam('_id');
      Session.set("IdUpdateFace", undefined);
      Session.set("ResultadoUpdateFace", undefined);
      Session.set("PersonUpdateFace", _id);
      $("#ModalUpdateFace").modal('open', { dismissible: false });
    },
    "click #UpdateFinger": function(event, template){
      var _id = RouterLayer.getParam('_id');
      Session.set("IdUpdateFinger", undefined);
      Session.set("ModalUpdateFinger", true);
      Session.set("ResultadoUpdateFinger", undefined);
      Session.set("PersonUpdateFinger", _id);
      $("#ModalUpdateFingers").modal('open', { dismissible: false });
    },
    'click .save-btn': function() {
        var algo=$("[name=idEmpStatus]").val();        
        var _id = RouterLayer.getParam('_id');
        if(algo=="gz76JMkmN6pjS6fqF"){
          Meteor.call("getEmpStatus",_id,function(err,res){
            if(err){
              $('#orionMaterializeCollectionsUpdateForm_OXP').submit();
            }else{
              if(res!=algo){
                var employeeNam=$("[name=employeeName]").val();
                Session.set("employeeNam",employeeNam.toUpperCase());
                $("#ModalEliminarHuellasCuenta").modal('open', { dismissible: false });
              }else{
                $('#orionMaterializeCollectionsUpdateForm_OXP').submit();
              }
            }
          })
        }else{
          $('#orionMaterializeCollectionsUpdateForm_OXP').submit();
        }        
    },
    'click #Cancel_Photo_Template_Face':function(){
      Session.set('ClickTakePhoto',false);
    },
    'click #Take_Photo_Template_Face': function() {
      Session.set("DataUpdateFace", undefined); 
      $("#Take_Photo_Template_Face").addClass("disabled")
      
      Session.set('ClickTakePhoto',true);
      if( Session.get('ClickTakePhoto')==true){
      $("#Upload_Photo_Template_Face").addClass('hide');
      var _idEmployee = RouterLayer.getParam('_id');
      Session.set("IdUpdateFace", undefined);
      Session.set("ResultadoUpdateFace", undefined);
      Session.set("PersonUpdateFace", _idEmployee);

      IdNavegador = generateId();
      if (Meteor.isCordova) {
        CameraPreview.takePicture({
          width: 480,
          height: 640,
          quality: 100
        }, function (base64PictureData) {
          imageSrcData = '' + base64PictureData;
          console.log(imageSrcData);
        });
      } else {
        Session.set("ResultadoUpdateFace", "Imagen procesandose..., espere porfavor");
        Template.viewfinder.getVideo(Template.viewfinder, function (data) {
          Session.set("DataUpdateFace", data); 
          Meteor.call("ToWSFaceValidator",data,"VerifyFace",undefined,undefined,"yes","yes",_idEmployee,undefined,function(err,res){
            if(res){              
              console.log("IdUpdateFace "+res);
              Session.set("IdUpdateFace", res);
            }
          });
        });
      }
    }
    },
    'click #Upload_Photo_Template_Face': function() {
      var _id = RouterLayer.getParam('_id');
      Meteor.call("Upload_Photo_Template_Face",_id);
    },
    "click #upload_file":function(){
      var tem=Temp_messages.findOne({"active":true});
      var file2 = document.getElementById("file_to_upload");
      var _idEmployee = RouterLayer.getParam('_id');
      var archivo = file2.files[0];
      if(archivo==undefined){
        sAlert.warning('Es necesario seleccionar el archivo');
      }else{
        var fileReader  = new FileReader();
        let encoding = "binary";
        let name = archivo.name;
        fileReader.onload = function() {
          if(fileReader.readAsBinaryString) {
            Meteor.call('saveFile', fileReader.result, name, '', encoding,_idEmployee);
        } else {
            var binary = "";
            var bytes = new Uint8Array(fileReader.result);
            var length = bytes.byteLength;
            for(var i=0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            Meteor.call('saveFile', binary, name, '', encoding,_idEmployee);
          }
        };
          fileReader.onloadend = function (e) {};
          fileReader.onprogress = function (e) {};
          fileReader.onabort = function (e) {};
          fileReader.onerror = function (e) {
            sAlert.error('La imagen no se ha cargado');
          };
          if(fileReader.readAsBinaryString) {
              fileReader.readAsBinaryString(archivo);
          } else {
              fileReader.readAsArrayBuffer(archivo);
          }
      }
    }
  });

  Template.orionMaterializeCollectionsUpdate_OXP.rendered= function () {
    Session.set("IdUpdateFace", undefined);
    Session.set("DataUpdateFace", undefined);     
    Session.set("ResultadoUpdateFace", undefined);

    var tem=Temp_messages.findOne({"active":true});
    if(tem!=undefined){
      var _id=tem._id
      Temp_messages.update({ _id: _id },{
          $set: {
            status_verification: "",
          }
        });
    }
    Session.set('ClickTakePhoto',false);
    $("#UpdateFace").removeClass('hide');
    $("#ShowPreviewCam").removeClass('hide');
    Session.set("IdUpdateFaceByEmployee",undefined);
    setTimeout(() => {
      var isStation=Config_application.findOne({"active":true});
      if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false && isStation.showKeyboard==true){
          var inp = document.getElementsByTagName('input');
          for(var i in inp){
              if(inp[i].type == "text"||inp[i].type == "number"){
                var elemento=inp[i].name;
                if(elemento){
                  $("[name='"+elemento+"']").keyboard({ layout: 'qwerty' });
                }
              }
          }        
      }
    }, 1000);
  }


  AutoForm.addHooks('orionMaterializeCollectionsUpdateForm_OXP', {
    onSuccess: function() {
      RouterLayer.go(this.collection.indexPath());
    }
  });
