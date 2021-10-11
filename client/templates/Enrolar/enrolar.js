var net = require('net');
import '/imports/keyboard.js';

if (Meteor.isClient) {
  var imgHeight,imgWidth;
  function StartSign() {
    try {
      var canvasObj = document.getElementById('cnv');
      canvasObj.getContext('2d').clearRect(0, 0, canvasObj.width, canvasObj.height);
      document.FORM1.sigRawData.value = "Signature Raw Data: ";
      document.FORM1.sigImageData.value = "Signature Image Data: ";
      imgWidth = canvasObj.width;
      imgHeight = canvasObj.height;
      var message = {
        "firstName": "",
        "lastName": "",
        "eMail": "",
        "location": "",
        "imageFormat": 1,
        "imageX": imgWidth,
        "imageY": imgHeight,
        "imageTransparency": false,
        "imageScaling": false,
        "maxUpScalePercent": 0.0,
        "rawDataFormat": "ENC",
        "minSigPoints": 25,
        "penThickness": 3,
        "penColor": "#000000"
      };
  
      document.addEventListener('SigCaptureWeb_SignResponse', SignResponse, false);
      var messageData = JSON.stringify(message);
      var element = document.createElement("SigCaptureWeb_ExtnDataElem");
      element.setAttribute("SigCaptureWeb_MsgAttribute", messageData);
      document.documentElement.appendChild(element);
      var evt = document.createEvent("Events");
      evt.initEvent("SigCaptureWeb_SignStartEvent", true, false);
      element.dispatchEvent(evt); 
    } catch (error) {
      
    }    
  }

  function SignResponse(event) {
    var str = event.target.getAttribute("SigCaptureWeb_msgAttri");
    var obj = JSON.parse(str);
    SetValues(obj, imgWidth, imgHeight);
  }

  function SetValues(objResponse, imageWidth, imageHeight) {
    var obj = JSON.parse(JSON.stringify(objResponse));
    var ctx = document.getElementById('cnv').getContext('2d');
    if (obj.errorMsg != null && obj.errorMsg != "" && obj.errorMsg != "undefined") {
    } else {
      if (obj.isSigned) {
        document.FORM1.sigRawData.value += obj.rawData;
        document.FORM1.sigImageData.value += obj.imageData;
        var img = new Image();
        img.onload = function () {
          ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
        }
        img.src = "data:image/png;base64," + obj.imageData;
        IdNavegador = generateId();
        Meteor.call("Saving_sign", obj.imageData, IdNavegador);
      }
    }
  }

  function ClearFormData() {
    document.FORM1.sigRawData.value = "Signature Raw Data: ";
    document.FORM1.sigImageData.value = "Signature Image Data: ";
  }

  function ActivateKeyBoard(){
    // Aplica Keyboard
    var isStation=Config_application.findOne({"active":true});
    // if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false){
    //     var inp = document.getElementsByTagName('input');
    //     for(var i in inp){
    //       if(inp[i].type == "text"||inp[i].type == "number"||inp[i].type == "email"){
    //         var elemento=inp[i].name;
    //         if(elemento){
    //           if(elemento=="idmanager"){

    //             $("[name="+elemento+"]").keyboard({
    //               layout: 'qwerty',
    //               change:function(event,keyboard,el){
    //                 var valor=keyboard.$preview.val();
    //                 var element = keyboard.$el[0].name;
    //                 $("[name=idmanager]").val(valor);
    //                 $("[name=idmanager]").onclick;
    //                 Session.set("val_idmanager",elemento);
    //                 // template.elementEdit.set(element);
    //                 setTimeout(() => {
    //                   $("[name=idmanager]").trigger('keyup');
    //                 }, 100);
    //               }
    //             });
    //             // var caca=$("[name=idmanager]").getkeyboard();
    //           }else if(elemento=="idmanager"){
    //             $("[name="+elemento+"]").keyboard({
    //               layout: 'qwerty',
    //               change:function(event,keyboard,el){
    //                 var valor=keyboard.$preview.val();
    //                 var element = keyboard.$el[0].name;
    //                 $("[name=idmanager]").val(valor);
    //                 $("[name=idmanager]").onclick;
    //                 // template.elementEdit.set(element);
    //                 setTimeout(() => {
    //                   $("[name='" + element + "']").trigger('keyup');
    //                 }, 100);
    //               }
    //             });
    //           }else {
    //             $("[name="+elemento+"]").keyboard({
    //               layout: 'qwerty',
    //               change:function(event,keyboard,el){
    //                 var valor=keyboard.$preview.val();
    //                 var element = keyboard.$el[0].name;
    //                 $("[name='" + element + "']").val(valor);
    //                 // template.elementEdit.set(element);
    //                 setTimeout(() => {
    //                   $("[name='" + element + "']").trigger('keyup');
    //                 }, 100);
    //               }
    //             });
    //           }
    //         }
    //       }
    //       if(inp[i].type == "search"){
    //         console.log("Existe una busqueda");
    //         console.log(inp[i]);

    //         // var elemento=inp[i].name;
    //         // if(elemento){
    //         //   $("[name="+elemento+"]").keyboard({ layout: 'qwerty' });
    //         // }
    //       }
    //     }
    // }

    if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==true){
      $("#mensajes").removeClass('hide');
      $("#instrucciones").text("SOLO ES POSIBLE ENROLAR EN LAS ESTACIONES DE ENROLAMIENTO");
      $(".create-btn").addClass('disabled');
    }else{
      //Dejando los mensajes modo Normal
      var datatmp=Temp_messages.findOne();
      if(datatmp!=undefined){
        var _id=datatmp._id;
        Temp_messages.update({ _id: _id }, { $set: { status_verification: "" } });
      }

      Session.set('sign_touch', false);
      Session.set("document_accion",undefined);
      $("#sign_device").prop("checked", true);

      Session.set("txt_process_left_enroll", 'No iniciado');
      Session.set("txt_quality_left_enroll", '0');
      Session.set("txt_status_left_enroll", 'No iniciado');
      $("#datos_izq").addClass('hide');
      $("#datos_der").addClass('hide');
      $("#menu_toggle").click();

      var a1=Sensors.find({"FingerService": true}).count();
      var a2=Sensors.find({"FaceService": true}).count();
      var a3=parseInt(a1)+parseInt(a2);
      if (a3>0) {
        $("#mensajes").addClass('hide');
        $(".create-btn").removeClass('disabled');
      } else {
        $("#mensajes").removeClass('hide');
        $("#instrucciones").text("NO ES POSIBLE INICIAR EL PROCESO DE ENROLAMIENTO, SIN CONEXION CON EL LECTOR BIOMETRICO");
        $(".create-btn").addClass('disabled');
      }
    }
  }


  Template.orionMaterializeCollectionsIndex_XPz.rendered = function () {
    $("#biometric_continue_finger").addClass('disabled');
    Session.set("IdUpdateFace", undefined);
    Session.set("ResultadoUpdateFace", undefined);
    Session.set("PersonUpdateFinger", undefined);

    ActivateKeyBoard();
    var isStation=Config_application.findOne({"active":true});
    if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false){
      Meteor.call("getAviso",Meteor.userId(),function(err,res){
        if(res){
          $("#ModalShowAviso").modal('open', { dismissible: false });
          Session.set("AvisoPrivacidad",res);
        }
      });
    }
  };

  function activeStep(stepDiv){
    $('.step').addClass('hide');
    stepDiv.removeClass('hide');
  }

  Template.orionMaterializeCollectionsIndex_XPz.onCreated(function () {
    this.elementEdit = new ReactiveVar(""); 
    Meteor.subscribe('get_Config_application', {
      onError: function (error) {console.log("error "+error);},
      onReady: function () {
        ActivateKeyBoard();
      }
    });
    var isStation=Config_application.findOne({"active":true});
    if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==true){
    }else{
      Meteor.subscribe('get_Enrollments_temp', {
        onError: function (error) {console.log("error "+error);},
        onReady: function () {}
      });
      Meteor.subscribe('get_documents', {
        onError: function (error) {console.log("error "+error);},
        onReady: function () {}
      });

      Meteor.subscribe('getSensors', {
        onError: function (error) {console.log("error "+error);},
        onReady: function () {}
      });
      // Meteor.subscribe('GetEnrollLocations', {
      //   onError: function (error) {console.log("error "+error);},
      //   onReady: function () {}
      // });
      Meteor.subscribe('employees', {
        onError: function (error) {console.log("error "+error);},
        onReady: function () {}
      });
      Meteor.subscribe('get_Jefes',Meteor.userId(), {
        onError: function (error) {console.log("error "+error);},
        onReady: function () {}
      });
      
      Meteor.subscribe('getActiveemployeespositions', {
        onError: function (error) {console.log("error "+error);},
        onReady: function () {}
      });
      // Meteor.subscribe('GetEnrollDepartments', Meteor.userId,{
      //   onError: function (error) {console.log("error "+error);},
      //   onReady: function () {}
      // });
      Meteor.subscribe('get_Temp_messages', {
        onError: function (error) {console.log("error "+error);},
        onReady: function () {}
      });

    }
  });

  Template.orionMaterializeCollectionsIndex_XPz.events({
    'change [name=idcompany]': function (event, template) {
      var isStation=Config_application.findOne({"active":true});
      if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false && isStation.showKeyboard==true){
        setTimeout(() => {
          var inp = document.getElementsByTagName('input');
          for (var i in inp) {
            if (inp[i].type == "text" || inp[i].type == "number") {
              var elemento = inp[i].name;
              if (elemento) {
                try {
                  $("[name='" + elemento + "']").keyboard({
                    layout: 'qwerty',
                    change: function (event, keyboard, el) {
                      var contenido = keyboard.$preview.val();
                      var element = keyboard.$el[0].name;
                      var id = keyboard.$el[0].id;
                      $("[name='" + element + "']").val(contenido);
                      // template.elementEdit.set(element);
                      // setTimeout(() => {
                      //   $("[name='" + element + "']").trigger('keyup');
                      // }, 100);
                    },
                    accepted: function (event, keyboard, el) {
                      var element = keyboard.$el[0].name;
                      $("[name='" + element + "']").trigger('keyup');
                      var contenido = el.value;
                      template.elementEdit.set(contenido);
                    }
                  });
                } catch (e) {
                }
              }
            }
          }
        }, 1000);
      }
    },
    'click .-autocomplete-item': function (event, template) {
      var dd = template.elementEdit.get();
      if(dd){
        $("[name='" + dd + "']").val(event.currentTarget.innerText);
      }
    },
    'change [name=idLocation]': function (event, template) {
      var idLocation = $("[name='idLocation']").val();
      Meteor.call("getLastEmployeeId",idLocation,Meteor.userId(),function(err,res){
        if(err){
          document.getElementsByName("idEmployee").readOnly = false;
        }else{
          if(res){
            document.getElementsByName("idEmployee").readOnly = true;
            $("[name='idEmployee']").val(res);
          }else{
            document.getElementsByName("idEmployee").readOnly = false;
          }
        }
      });
    },
    "click #get_finger_biometric_devices": function (evt, temp) {
      Meteor.call('update_devices');
    },
    "click #AceptarAviso":function(evt,temp){
      $('#ModalShowAviso').modal('close');
    },
    "click #RechazarAviso":function(evt,temp){
      $('#ModalShowAviso').modal('close');
      setTimeout(() => {
        Router.go("/admin/");
      }, 500);
    },    
    "click #biometric_cancel_finger": function (evt, temp) {
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
        activeStep($('#step3'));
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
    "change #FormGroupSign":function(evt,temp){
      var radios = document.getElementById("FormGroupSign").elements;
      var existe=false;
      for (var i = 0; i < radios.length; i++) {
        if ($("#"+radios[i].id).is(":checked") && (radios[i].id=="no_fingers_na"||radios[i].id=="no_fingers_xx")){
          existe=true;
        }
      }
      if(existe){
        $("#biometric_capture_finger").addClass('disabled');
        $("#biometric_continue_finger").removeClass('disabled');
      }else{
        $("#biometric_capture_finger").removeClass('disabled');
        $("#biometric_continue_finger").addClass('disabled')
      }
    },
    "change [name='idcompany']": function (evt, template) {},
    'change #sign_device': function (evt, template) {
      Session.set('sign_touch', false);
    },
    'change #sign_touch': function (evt, template) {
      Session.set('sign_touch', true);
    },
    "click #capture_finger_left": function (event, template) {
      $("#datos_izq").removeClass('hide');
      $("#mensajes").removeClass('hide');
      $("#instrucciones").text("COLOQUE SU DEDO INDICE EN EL LECTOR DE HUELLA");
      Session.set("txt_process_left_enroll", 'Procesando...');
      Session.set("txt_quality_left_enroll", '0');
      Session.set("txt_status_left_enroll", 'Espere, porfavor...');
      Meteor.call("cliente3", "enrolar");
    },
    "click #capture_finger_right": function (event, template) {
      $("#datos_der").removeClass('hide');
      $("#mensajes").removeClass('hide');
      $("#instrucciones").text("COLOQUE SU DEDO INDICE EN EL LECTOR DE HUELLA");
      Session.set("txt_process_right_enroll", 'Procesando...');
      Session.set("txt_quality_right_enroll", '0');
      Session.set("txt_status_right_enroll", 'Espere, porfavor...');
      Meteor.call("cliente3", "enrolar");
    },
    "click #cancel_finger_left": function (event, template) {
      CancelandoEnrolamiento();
    },
    "click #cancel_finger_right": function (event, template) {
      CancelandoEnrolamiento();
    },
    "click #continue_finger_left": function (event, template) {
      links_ocultos("link_huella_der");
      $("#link_huella_der").click();
    },
    'click .create-btn': function () {
      Meteor.call('eliminar_biom_resagada');
      Meteor.call('delete_temps');      
      var exists = Enrollments_temp.find().count();
      if (exists != 0) {
        Meteor.call("cliente3", "cancelar");
      }
      var valor= $("[name='idEmployee']").val();
      var valorC= $("[name='idcompany']").val();
      var idmanager= $("[name='idmanager']").val();
      var idEmpPosition= $("[name='idEmpPosition']").val();

      var data = Persons.find({"idcompany":{$in:valorC},"idEmployee":parseInt(valor)}).count();
      if(data==1){
        sAlert.error('El N° de Colaborador ya se encuentra en uso, intente con uno distinto');
      }else{
        var todoOk=true;
        if(idmanager!=undefined && idmanager!=""){
          Meteor.call("idmanagerExists",idmanager,function(err,result){
            if(result){
              if(result=="noexiste"){
                todoOk=false;
                Employees.simpleSchema().namedContext("orionMaterializeCollectionsCreateForm_XPz").addInvalidKeys([{name: "idmanager", type: "notAllowedx"}]);
              }
            }
          });
        }

        if(idEmpPosition!=undefined && idEmpPosition!=""){
          Meteor.call("idEmpPositionExists",idEmpPosition,function(err,result){
            if(result){
              if(result=="noexiste"){
                todoOk=false;
                Employees.simpleSchema().namedContext("orionMaterializeCollectionsCreateForm_XPz").addInvalidKeys([{name: "idEmpPosition", type: "notAllowedx"}]);
              }else{
                if(todoOk==true){
                  $('#orionMaterializeCollectionsCreateForm_XPz').submit();
                }        
              }
            }
          });
        }else{
          sAlert.error("Seleccione el puesto");
        }        
      }
    },
    "click #continue_finger_right": function (event, template) {
      var Data = Config_application.findOne({
        active: true
      });
      var Can_enroll_docs, Can_enroll_face, Can_enroll_sign;
      if (Data != undefined) {
        Can_enroll_docs = Data.enroll_docs;
        Can_enroll_face = Data.enroll_face;
        Can_enroll_sign = Data.enroll_sign;
      }
      if (Can_enroll_face) {
        links_ocultos("link_huella_foto");
        $("#link_huella_foto").click();
      } else if (Can_enroll_sign) {
        links_ocultos("link_huella_firma");
        $("#link_huella_firma").click();
      } else if (Can_enroll_docs) {
        links_ocultos("link_huella_documentos");
        $("#link_huella_documentos").click();
      } else {
        links_ocultos("link_huella_fin");
        $("#link_huella_fin").click();
      }
    },
    'click #capture_face': function (event) {
      IdNavegador = generateId();
      var NuevoEmpleado=Enrollments_temp.findOne({}).empleado;

      if (Meteor.isCordova) {
        CameraPreview.takePicture({
          width: 480,
          height: 640,
          quality: 100
        }, function (base64PictureData) {
          imageSrcData = '' + base64PictureData;
          imageSrcData=imageSrcData.replace(/^data:image\/(png|jpeg);base64,/, "");

          Session.set("IdUpdateFace","Validando la imagen, espere por favor");
          Meteor.call("ToWSFaceValidator",imageSrcData,"EnrollFace",true,undefined,"yes","yes",NuevoEmpleado,function(err,res){
            if(res){
              Session.set("IdUpdateFace", res);
            }
          });
        });
      } else {
        Template.viewfinder.getVideo(Template.viewfinder, function (data) {
          data=data.replace(/^data:image\/(png|jpeg);base64,/, "");
          Session.set("IdUpdateFace","Validando la imagen, espere por favor");
          Meteor.call("ToWSFaceValidator",data,"EnrollFace",true,undefined,"yes","yes",NuevoEmpleado,undefined,function(err,res){
            if(err){
              console.log("err getVideo "+err);
            }
            if(res){
              Session.set("IdUpdateFace", res);
            }
          });
        });
      }
    },
    "click #cancel_face": function (event, template) {
      CancelandoEnrolamiento();
    },
    "click #continue_face": function (event, template) {
      var Data = Config_application.findOne({
        active: true
      });
      var Can_enroll_docs, Can_enroll_face, Can_enroll_sign;
      if (Data != undefined) {
        Can_enroll_docs = Data.enroll_docs;
        Can_enroll_sign = Data.enroll_sign;
      }
      if (Can_enroll_sign) {
        $('#stepper3').addClass('step-done');
        $('#stepper3').removeClass('editable-step');
        $('#stepper4').addClass('active-step');
        $('#stepper4').addClass('editable-step');
        activeStep($('#step4'));
      } else if (Can_enroll_docs) {
        $('#stepper3').addClass('step-done');
        $('#stepper3').removeClass('editable-step');
        $('#stepper5').addClass('active-step');
        $('#stepper5').addClass('editable-step');
        activeStep($('#step5'));
      } else {
        $('#stepper3').addClass('step-done');
        $('#stepper3').removeClass('editable-step');
        $('#stepper6').addClass('active-step');
        $('#stepper6').addClass('editable-step');
        activeStep($('#step6'));
      }
    },
    'click #StartSign': function () {
      StartSign();
    },
    "click #continue_sign": function (event, template) {
      var Data = Config_application.findOne({
        active: true
      });
      var Can_enroll_docs, Can_enroll_face, Can_enroll_sign;
      if (Data != undefined) {
        Can_enroll_docs = Data.enroll_docs;
      }
      if (Can_enroll_docs) {
        $('#stepper4').addClass('step-done');
        $('#stepper4').removeClass('editable-step');
        $('#stepper5').addClass('active-step');
        $('#stepper5').addClass('editable-step');
        activeStep($('#step5'));
      } else {
        $('#stepper4').addClass('step-done');
        $('#stepper4').removeClass('editable-step');
        $('#stepper6').addClass('active-step');
        $('#stepper6').addClass('editable-step');
        activeStep($('#step6'));
      }
    },
    'click .create-btn-doc': function () {
      $('#orionMaterializeCollectionsCreateDocumentsForm').submit();
    },
    "click #continue_docs": function (event, template) {
      $('#stepper5').addClass('step-done');
      $('#stepper5').removeClass('editable-step');
      $('#stepper6').addClass('active-step');
      $('#stepper6').addClass('editable-step');
      activeStep($('#step6'));
    },
    "click #fin_save": function (event, template) {
      sAlert.success('Enrolamiento Correcto');
      Meteor.call("temp_origin", function (error, result) {
        if (result) {
          Meteor.call('delete_temps');
          Router.go('/admin/principal/administrar_enrolamientos');
          sAlert.success('Enrolamiento Correcto');
        }
      });
    },
    "click #fin_cancel": function (event, template) {
      CancelandoEnrolamiento();
    }
  });


  AutoForm.addHooks('orionMaterializeCollectionsCreateForm_XPz', {
    onSuccess: function (formType, result) {
      Session.set("ModalUpdateFinger",undefined);
      Session.set("PersonUpdateFinger",result);
      Session.set("IdUpdateFinger", undefined);
      Session.set("ResultadoUpdateFinger", undefined);

      Meteor.call("eliminar_enroll_temp");
      Enrollments_temp.insert({
        "empleado": result,
        "idEnrol": result
      });
      $('#stepper1').addClass('step-done');
      $('#stepper1').removeClass('editable-step');
      $('#stepper2').addClass('active-step');
      $('#stepper2').addClass('editable-step');
      activeStep($('#step2'));

      Session.set('Session_biometric_finger_enroll', undefined);
      Session.set('Session_biometric_enrolados', undefined);
    },
    onError: function(formType, error) {
      sAlert.error(String(error));
    }
  });

  AutoForm.addHooks('orionMaterializeCollectionsUpdateForm_OXP', {
    onSuccess: function (formType, result) {
      var bin = Enrollments_temp.findOne({
        "active": true
      });
      var img;
      if (bin !== undefined) {
        img = bin.sign.url;
      }
      $(".save-btn").addClass('hide');
      Session.set("img_firma", img);
    }
  });

  AutoForm.addHooks('orionMaterializeCollectionsCreateDocumentsForm', {
    onSuccess: function (formType, result) {
      $(".create-btn-doc").addClass('hide');
      Session.set("document_accion","Continuar");
      var bin = Enrollments_temp.findOne({"active": true});
      var _id;
      if (bin !== undefined) {
        _id = bin._id;
        Enrollments_temp.update({
          _id: _id
        }, {
          $set: {
            docs: result
          }
        });
      }
    }
  });

  Template.orionMaterializeCollectionsIndex_XPz.helpers({
    AvisoPrivacidad:function(){
      return Session.get("AvisoPrivacidad");
    },
    accion:function(){
      var accion=Session.get("sign_accion");
      var result="Saltar";
      if(accion!=undefined){
        result="Continuar";
      }
      return result;
    },
    biometric_finger_binarized: function () {

    },
    biometric_finger_image: function () {
      var dedo = Session.get('Session_biometric_finger_enroll');
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
    txt_process_biometric_enroll: function () {

      var leng=Session.get("Session_biometric_enrolados");
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
          Session.set("Session_biometric_finger_enroll",undefined);
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

      if (Temp_messages.find({"status_verification": "LoadFaceDuplicate"}).count()!=0) {
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


      if (Temp_messages.find({"status_verification": "LoadFaceNotFound"}).count()!=0) {
        swal({
          title: 'Error',
          text: 'Persona no encontrada, intente nuevamente',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#32A617',
          cancelButtonColor: '#F31414',
          cancelButtonText: 'No',
          confirmButtonText: 'Reintentar',
          closeOnConfirm: true
        });

        var data=Temp_messages.findOne();
        Temp_messages.update({_id: data._id}, {$set: {status_verification: ""}});
      }


      if (Temp_messages.find({"status_verification": "BAD_OBJECT"}).count()!=0) {
        swal({
          title: 'Error',
          text: 'Baja calidad de la imagen',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#32A617',
          cancelButtonColor: '#F31414',
          cancelButtonText: 'No',
          confirmButtonText: 'Reintentar',
          closeOnConfirm: true
        });
        var data=Temp_messages.findOne();
        Temp_messages.update({_id: data._id}, {$set: {status_verification: ""}});
      }

      var dedo = Session.get('Session_biometric_finger_enroll');
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
      var dedo = Session.get('Session_biometric_finger_enroll');
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
                Session.set("Session_biometric_finger_enroll",undefined);
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
      var dedo = Session.get('Session_biometric_finger_enroll');
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
    left_finger_binarized: function () {
      var img = "";
      var bin = Enrollments_temp.findOne({
        "finger_left": "true"
      });
      if (bin != undefined) {
        img = bin.finger_left_binaria;
        return '/gridfs/data/id/' + img;
      }
    },
    document_info: function () {
      var accion=Session.get("document_accion");
      var result="SALTAR Y CONTINUAR";
      if(accion!=undefined){
        result="CONTINUAR";
      }
      return result;
    },
    fingers_enroll_biometric: function () {
      var registros = Session.get('Session_biometric_enrolados');
      var result = [];
      if (registros != undefined) {
        for (i = 0; i < registros.length; i++) {
          var name, ruta, ruta2;
          var obj = {};
          var dato = registros[i];

          var dedos = dato + "_left_binaria";
          var bin = Enrollments_temp.findOne({"active": true});
          if (bin != undefined) {
            var img = bin[dedos];
            if (img != undefined) {
              ruta = '/gridfs/data/id/' + img;
            }
          }

          var dedos2 = dato + "_left_normal";
          var bin2 = Enrollments_temp.findOne({
            "active": true
          });
          if (bin2 != undefined) {
            var img2 = bin2[dedos2];
            if (img2 != undefined) {
              ruta2 = '/gridfs/data/id/' + img2;
            }
          }

          switch (dato) {
            case "left_pulgares":
            name = "Pulgar Izquierdo";
            break;
            case "left__indices":
            name = "Indice Izquierdo";
            break;
            case "left___medios":
            name = "Medio Izquierdo";
            break;
            case "left_anulares":
            name = "Anular Izquierdo";
            break;
            case "left_meniques":
            name = "Meñique Izquierdo";
            break;
            case "right_pulgars":
            name = "Pulgar Derecho";
            break;
            case "right_indices":
            name = "Indice Derecho";
            break;
            case "right__medios":
            name = "Medio Derecho";
            break;
            case "right__anular":
            name = "Anular Derecho";
            break;
            case "right_menique":
            name = "Meñique Derecho";
            break;
            default:
            name = "Dedo"
            break;
          }
          obj.nose = dato;
          obj.name = name;
          obj.ruta = ruta;
          obj.ruta2 = ruta2;
          result.push(obj);
        }
      }
      return result;
    },
    using_touch: function () {
      var retorno = false;
      var result = Session.get('sign_touch');
      if (result != undefined) {
        if (result)
        retorno = true;
      }
      return retorno;
    },
    GetColorIconBack: function () {
      return GetColorIconBack();
    },
    ColorTabularIndex:function(){
      return ColorTabularIndex();
    },
    left_finger_image: function () {
      var img = "";
      var bin = Enrollments_temp.findOne({
        "finger_left": "true"
      });
      if (bin != undefined) {
        img = bin.finger_left_normal;
        return '/gridfs/data/id/' + img;
      }
    },
    txt_process_left_enroll: function () {
      var a1=Sensors.find({"FingerService": true}).count();
      var a2=Sensors.find({"FaceService": true}).count();
      var a3=parseInt(a1)+parseInt(a2);
      if (a3<1) {
        $("#mensajes").addClass('hide');
        $(".create-btn").removeClass('disabled');
        $("#biometric_capture_finger").removeClass('disabled');
      } else {
        $("#mensajes").removeClass('hide');
        $("#instrucciones").text("NO ES POSIBLE INICIAR EL PROCESO DE ENROLAMIENTO, SIN CONEXION CON EL LECTOR BIOMETRICO");
        $(".create-btn").addClass('disabled');
        $("#biometric_capture_finger").addClass('disabled');
      }

      var bin = Enrollments_temp.findOne({
        "finger_left": "true"
      });
      if (bin != undefined) {
        var data = bin.finger_left_proceso;
        $("#mensajes").addClass('hide');
      }
      return data;
    },
    txt_quality_left_enroll: function () {
      var bin = Enrollments_temp.findOne({
        "finger_left": "true"
      });
      var result = "---"
      if (bin != undefined) {
        var data = bin.finger_left_calidad;
        switch (data) {
          case "GOOD":
          result = "Buena";
          break;
          case "VERY_GOOD":
          result = "Buena";
          break;
          case "POOR":
          result = "Pobre";
          break;
          case "EXCELLENT":
          result = "Excelente";
          break;
        }
      }
      return result;
    },
    txt_status_left_enroll: function () {
      var bin = Enrollments_temp.findOne({
        "finger_left": "true"
      });
      if (bin != undefined) {
        var data = bin.finger_left_estatus;
      }
      if (data == "OK") {
        $("#continue_finger_left").removeClass('hide');
        $("#capture_finger_left").addClass('hide');
      }
      return data;
    },
    right_finger_binarized: function () {
      var img = "";
      var bin = Enrollments_temp.findOne({
        "finger_right": "true"
      });
      if (bin != undefined) {
        img = bin.finger_right_binaria;
        return '/gridfs/data/id/' + img;
      }
    },
    right_finger_image: function () {
      var img = "";
      var bin = Enrollments_temp.findOne({
        "finger_right": "true"
      });
      if (bin != undefined) {
        img = bin.finger_right_normal;
        return '/gridfs/data/id/' + img;
      }
    },
    txt_process_right_enroll: function () {
      var bin = Enrollments_temp.findOne({
        "finger_right": "true"
      });
      if (bin != undefined) {
        var data = bin.finger_right_proceso;
        $("#mensajes").addClass('hide');
      }
      return data;
    },
    txt_quality_right_enroll: function () {
      var bin = Enrollments_temp.findOne({
        "finger_right": "true"
      });
      if (bin != undefined) {
        var data = bin.finger_right_calidad;
      }
      return data;
    },
    txt_status_right_enroll: function () {
      var bin = Enrollments_temp.findOne({
        "finger_right": "true"
      });
      if (bin != undefined) {
        var data = bin.finger_right_estatus;
      }
      if (data == "OK") {
        $("#continue_finger_right").removeClass('hide');
        $("#capture_finger_right").addClass('hide');
      }
      return data;
    },
    txt_status_face_enroll: function () {
      var result="Proceso no Iniciado";
      if(Session.get("IdUpdateFace")!=undefined){
        var _id=Session.get("IdUpdateFace");
        Meteor.subscribe("getBiometricOperations", _id);
        var data=BiometricOperations.findOne({"_id":_id});
        if(data!=undefined){
          var Resultado=data.Resultado;
          if(Resultado!=undefined){
            if(Resultado=="Correcto"){
              result="La imagen es correcta";
              $("#continue_face").removeClass('hide');
              $("#capture_face").addClass('hide');
            }else{
              if(data.Detalle[0]!=undefined && data.Detalle[0].estatus){
                var Estatus=data.Detalle[0].estatus;
                if(Estatus=="OBJECT_NOT_FOUND"){
                  result="Persona no encontrada en la imagen";
                }else if (Estatus=="BAD_SHARPNESS") {
                  result="La calidad de la imagen es muy baja, intente con otra fotografia";
                }else if (Estatus=="PersonAlreadyEnroll") {
                  result="Persona ya enrolada en el sistema, no es posible duplicados";
                }else{
                  console.log("Estatus "+Estatus);
                  $("#continue_face").removeClass('hide');
                  $("#capture_face").addClass('hide');
                  result="Error, intente nuevamente o continúe el proceso";
                }
              }
            }
          }
        }else{
          result=Session.get("IdUpdateFace");
        }
      }
      return result;
    },
    iditem: function () {
      var bin = Enrollments_temp.findOne({
        "facing": "true"
      });
      if (bin !== undefined) {
        return bin;
      }
    },
    img_firma: function () {
      var ruta = Session.get("img_firma");
      return ruta;
    },
    fin_face: function () {
      var bin = Enrollments_temp.findOne();
      var data;
      if (bin != undefined) {
        data = bin.face_url;
      }
      return data;
    },
    fin_emp_name: function () {
      var bin = Enrollments_temp.findOne({
        "active": true
      });
      var result;
      if (bin != undefined) {
        var _id = bin.empleado;
        if (_id != undefined) {
          var dataEmp = Employees.findOne({
            "_id": _id
          });
          if (dataEmp != undefined) {
            result = dataEmp.employeeName;
          }
        }
      }
      return result;
    },
    fin_emp_num: function () {
      var bin = Enrollments_temp.findOne({
        "active": true
      });
      var result;
      if (bin != undefined) {
        var _id = bin.empleado;
        if (_id != undefined) {
          var dataEmp = Employees.findOne({
            "_id": _id
          });
          if (dataEmp != undefined) {
            result = dataEmp.idEmployee;
          }
        }
      }
      return result;
    },
    fin_emp_pos: function () {
      var bin = Enrollments_temp.findOne({
        "active": true
      });
      var result;
      if (bin != undefined) {
        var _id = bin.empleado;
        if (_id != undefined) {
          var dataEmp = Employees.findOne({ "_id": _id });
          if (dataEmp != undefined) {
            var id = dataEmp.idEmpPosition;
            if (id != undefined) {
              var dataPos = Employeespositions.findOne({ "_id": id });
              if (dataPos != undefined) {
                result = dataPos.empPosName;
              }else{
                result=id;
              }
            }
          }
        }
      }
      return result;
    },
    fin_emp_sta: function () {
      var bin = Enrollments_temp.findOne({
        "active": true
      });
      var result;
      if (bin != undefined) {
        var _id = bin.empleado;
        if (_id != undefined) {
          var dataEmp = Employees.findOne({
            "_id": _id
          });
          if (dataEmp != undefined) {
            var id = dataEmp.idEmpStatus;
            if (id != undefined) {
              var dataPos = Employeestatuses.findOne({
                "_id": id
              });
              if (dataPos != undefined) {
                result = dataPos.empStatusName;
              }
            }
          }
        }
      }
      return result;
    },
    fin_emp_comp: function () {
      var bin = Enrollments_temp.findOne({
        "active": true
      });
      var result;
      if (bin != undefined) {
        var _id = bin.empleado;
        if (_id != undefined) {
          var dataEmp = Employees.findOne({
            "_id": _id
          });
          if (dataEmp != undefined) {
            var id = dataEmp.idcompany[0];
            if (id != undefined) {
              var dataPos = Companies.findOne({
                "_id": id
              });
              if (dataPos != undefined) {
                result = dataPos.companyName;
              }
            }
          }
        }
      }
      return result;
    },
    fin_emp_depto: function () {
      var bin = Enrollments_temp.findOne({
        "active": true
      });
      var result;
      if (bin != undefined) {
        var _id = bin.empleado;
        if (_id != undefined) {
          var dataEmp = Employees.findOne({
            "_id": _id
          });
          if (dataEmp != undefined) {
            var id = dataEmp.idDepartment;
            if (id != undefined) {
              var dataPos = Departments.findOne({
                "_id": id
              });
              if (dataPos != undefined) {
                result = dataPos.departmentName;
              }
            }
          }
        }
      }
      return result;
    },
    fin_emp_location: function () {
      var bin = Enrollments_temp.findOne({
        "active": true
      });
      var result;
      if (bin != undefined) {
        var _id = bin.empleado;
        if (_id != undefined) {
          var dataEmp = Employees.findOne({
            "_id": _id
          });
          if (dataEmp != undefined) {
            var id = dataEmp.idLocation;
            if (id != undefined) {
              var dataPos = Locations.findOne({
                "_id": id
              });
              if (dataPos != undefined) {
                result = dataPos.locationName;
              }
            }
          }
        }
      }
      return result;
    },
    fin_sign: function () {
      var bin = Enrollments_temp.findOne();
      var result;
      if (bin != undefined && bin.sign!=undefined ) {
        var _id = bin.sign;
        if (_id != undefined) {
          result = _id.url;
        }
      }
      return result;
    },
    fin_huella_izq_img: function () {
      var bin = Enrollments_temp.findOne({
        "finger_left": "true"
      });
      var result, _id = "";
      if (bin != undefined) {
        _id = bin.finger_left_normal;
        if (_id != undefined) {
          result = "/gridfs/data/id/" + _id;
        }
      }
      return result;
    },
    fin_huella_izq_bin: function () {
      var bin = Enrollments_temp.findOne({
        "finger_left": "true"
      });
      var result, _id = "";
      if (bin != undefined) {
        _id = bin.finger_left_binaria;
        if (_id != undefined) {
          result = "/gridfs/data/id/" + _id;
        }
      }
      return result;
    },
    fin_huella_der_img: function () {
      var bin = Enrollments_temp.findOne({
        "finger_right": "true"
      });
      var result, _id = "";
      if (bin != undefined) {
        _id = bin.finger_right_normal;
        if (_id != undefined) {
          result = "/gridfs/data/id/" + _id;
        }
      }
      return result;
    },
    fin_huella_der_bin: function () {
      var bin = Enrollments_temp.findOne({
        "finger_right": "true"
      });
      var result, _id = "";
      if (bin != undefined) {
        _id = bin.finger_right_binaria;
        if (_id != undefined) {
          result = "/gridfs/data/id/" + _id;
        }
      }
      return result;
    },
    Can_enroll_docs: function () {
      var result;
      var Data = Config_application.findOne({
        active: true
      });
      if (Data != undefined) {
        result = Data.enroll_docs;
      } else {
        result = true;
      }
      return result;
    },
    Can_enroll_face: function () {
      var result;
      var Data = Config_application.findOne({
        active: true
      });
      if (Data != undefined) {
        result = Data.enroll_face;
      } else {
        result = true;
      }
      return result;
    },
    Can_enroll_sign: function () {
      var result;
      var Data = Config_application.findOne({
        active: true
      });
      if (Data != undefined) {
        result = Data.enroll_sign;
      } else {
        result = true;
      }
      return result;
    },
    IsStation: function () {
      var result;
      var Data = Config_application.findOne({
        active: true
      });
      if (Data != undefined) {
        result = Data.isServer;
      } else {
        result = false;
      }
      return !result;
    },
    ICanEnrol: function () {
      var _userId = Meteor.userId();
      var result;
      if (Roles.userHasRole(_userId, "admin") == true) {
        result = true;
      } else if (Roles.userHasRole(_userId, "Usuario Administrador") == true) {
        result = true;
      } else {
        var res = Meteor.users.findOne({
          "_id": _userId
        });
        if (res && res.emails[0]) {
          var _Mail = res.emails[0].address;
          var Data = Persons.findOne({
            empEmail: _Mail
          });
          if (Data != undefined) {
            result = Data.permissionEnrol;
          } else {
            result = false;
          }
        } else {
          result = false;
        }
      }
      return !result;
    }
  });

  links_ocultos = function (mostrar) {
    $("#link_huella_data").addClass('noclick');
    $("#link_huella_izq").addClass('noclick');
    $("#link_huella_der").addClass('noclick');
    $("#link_huella_foto").addClass('noclick');
    $("#link_huella_firma").addClass('noclick');
    $("#link_huella_documentos").addClass('noclick');
    $("#link_huella_fin").addClass('noclick');
    $("#link_Biometria").addClass('noclick');
    $("#" + mostrar).removeClass('noclick');
  }
  CancelandoEnrolamiento = function () {
    swal({
      title: '¿ Desea cancelar el proceso de enrolamiento ?',
      text: 'Si cancela el proceso sus datos seran eliminados',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#32A617',
      cancelButtonColor: '#F31414',
      cancelButtonText: 'No',
      confirmButtonText: 'Si,Adelante!',
      closeOnConfirm: true
    }, function () {
      Meteor.call("cliente3", "cancelar");
      Router.go('/admin/');
    });
  }

}
