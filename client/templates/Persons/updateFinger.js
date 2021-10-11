Template.updateFingers.helpers({
    txt_process_biometric_enroll: function () {
        if (Temp_messages.find({"status_verification": "Usuario no encontrado"}).count() != 0) {
            sAlert.error('Error al generar la huella desde la Imagen');
            var data = Temp_messages.findOne({"status_verification": "Usuario no encontrado"});
                Temp_messages.update({
                    _id: data._id
                }, {
                    $set: {
                        status_verification: ""
                    }
                });
        }

        var dedo = Session.get('Session_biometric_finger_enroll2');
        var resultado = "No Iniciado";
        if (dedo != undefined) {
            var dedos = dedo + "_left_proceso";
            var bin = Enrollments_uptemp.findOne({
                "active": true
            });
            if (bin != undefined) {
                if (bin[dedos] != undefined) {
                    resultado = bin[dedos];
                }
            }
        }
        return resultado;
    },
    txt_quality_biometric_enroll: function () {
        var dedo = Session.get('Session_biometric_finger_enroll2');
        var resultado = "0 %";
        if (dedo != undefined) {
            var dedos = dedo + "_left_calidad";
            var bin = Enrollments_uptemp.findOne({
                "active": true
            });
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
                                var dataN = bin[dedosN];
                                var dedosB = dedo + "_left_binaria";
                                var dataB = bin[dedosB];
                                var dedosT = dedo + "_left_template";
                                var dataT = bin[dedosT];
                                var dedosE = dedo + "_left_estatus";
                                var dedosP = dedo + "_left_proceso";
                                $("#" + dedo).addClass('hide');
                                $("#" + dedo).prop("checked", false);
                                $("#" + dedo).prop("disabled", false);
                                Session.set("Session_biometric_finger_enroll2", undefined);
                                Meteor.call("BadQuality", bin._id, dedo, dedosN, dedosB, dedosT, dedosE, dedos, dedosP, dataT, dataB, dataN);
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
        var dedo = Session.get('Session_biometric_finger_enroll2');
        var resultado = "Sin Iniciar";
        if (dedo != undefined) {
            var dedos = dedo + "_left_estatus";
            var bin = Enrollments_uptemp.findOne({
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
    biometric_finger_binarized: function () {
        var Data=Enrollments_uptemp.findOne({"active":true});
        var cuantos=0;
        if(Data!=undefined){
            Object.keys(Data).forEach(function (key) {
                if(key.includes('_template')){
                    ++cuantos;
                }
            });
        }
        if (cuantos > 1) {
            $("#finish_biometric_capture_finger").removeClass('disabled')
        }

        if (Temp_messages.find({
                "status_verification": "FingerDuplicate"
            }).count() != 0) {
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
                Session.set("Session_biometric_finger_enroll2", undefined);
                var data = Temp_messages.findOne({"status_verification": "FingerDuplicate"});
                Temp_messages.update({
                    _id: data._id
                }, {
                    $set: {
                        status_verification: ""
                    }
                });
            });
        }

        if (Temp_messages.find({
                "status_verification": "FaceDuplicate"
            }).count() != 0) {
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
                var data = Temp_messages.findOne({
                    "active": true
                });
                Temp_messages.update({
                    _id: data._id
                }, {
                    $set: {
                        status_verification: ""
                    }
                });
            });
        }

        var dedo = Session.get('Session_biometric_finger_enroll2');
        var resultado = '/img/huella.png';
        if (dedo != undefined) {
            var dedos = dedo + "_left_binaria";
            var bin = Enrollments_uptemp.findOne({
                "active": true
            });
            if (bin != undefined) {
                var img = bin[dedos];
                if (img == undefined) {
                    resultado = '/img/scanning_finger.gif';
                } else {
                    resultado = '/gridfs/data/id/' + img;
                }
            }
        }
        return resultado;
    },
    biometric_finger_image: function () {
        var dedo = Session.get('Session_biometric_finger_enroll2');
        var resultado = '/img/huella.png';
        if (dedo != undefined) {
            var dedos = dedo + "_left_normal";
            var bin = Enrollments_uptemp.findOne({
                "active": true
            });
            if (bin != undefined) {
                var img = bin[dedos];
                if (img == undefined) {
                    resultado = '/img/scanning_finger.gif';
                } else {
                    resultado = '/gridfs/data/id/' + img;
                }
            }
        }
        return resultado;
    }
});

Template.updateFingers.events({
    "change #FormGroupSignE":function(evt,temp){
        var radios = document.getElementById("FormGroupSignE").elements;
        var existe=false;
        for (var i = 0; i < radios.length; i++) {
          if ($("#"+radios[i].id).is(":checked") && (radios[i].id=="no_fingers_na"||radios[i].id=="no_fingers_xx")){
              existe=true;
          }
        }
        if(existe){
            $("#biometric_capture_finger").addClass('disabled');
            $("#finish_biometric_capture_finger").removeClass('disabled');
        }else{
            $("#biometric_capture_finger").removeClass('disabled');
            $("#finish_biometric_capture_finger").addClass('disabled')
        }
    },
    "change #finger_to_upload": function (evt, temp) {
        var radios = document.getElementById("FormGroupSignE").elements;
        var rad = 0,seleccionado, enrolados = [];
        for (var i = 0; i < radios.length; i++) {
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

        if (rad<1) {
            sAlert.warning('Selecciona la opción del dedo a enrolar');
            $("#finger_to_upload").val('');
        } else {
            Session.set('Session_biometric_finger_enroll2', seleccionado.toString());
            var dedoSeleccionado = seleccionado.toString();
            var file2 = document.getElementById("finger_to_upload");
            var _idEmployee = RouterLayer.getParam('_id');
            var archivo = file2.files[0];
            if (archivo == undefined) {
                sAlert.warning('Es necesario seleccionar el archivo');
            } else {
                if (dedoSeleccionado == undefined || dedoSeleccionado == "ninguno") {
                    sAlert.warning('Porfavor seleccione el dedo que esta enrolando');
                } else {
                    var fileReader = new FileReader();
                    let encoding = "binary";
                    let name = archivo.name;
                    fileReader.onload = function () {
                        sAlert.success('! Huella cargada ¡');
                        if (fileReader.readAsBinaryString) {
                            Meteor.call('biometric_update_enroll', fileReader.result, name, '', encoding, _idEmployee, dedoSeleccionado+Meteor.userId());
                        } else {
                            var binary = "";
                            var bytes = new Uint8Array(fileReader.result);
                            var length = bytes.byteLength;
                            for (var i = 0; i < length; i++) {
                                binary += String.fromCharCode(bytes[i]);
                            }
                            Meteor.call('biometric_update_enroll', binary, name, '', encoding, _idEmployee, dedoSeleccionado+Meteor.userId());
                        }
                    };
                    fileReader.onloadend = function (e) {};
                    fileReader.onprogress = function (e) {};
                    fileReader.onabort = function (e) {};
                    fileReader.onerror = function (e) {
                        sAlert.error('La imagen no se ha cargado');
                    };
                    if (fileReader.readAsBinaryString) {
                        fileReader.readAsBinaryString(archivo);
                    } else {
                        fileReader.readAsArrayBuffer(archivo);
                    }
                }
            }
        }
        Session.set('Session_biometric_enrolados2', enrolados);
    },
    "click #biometric_capture_finger": function (evt, temp) {
        var radios = document.getElementById("FormGroupSignE").elements;
        var rad = 0,seleccionado, enrolados = [];
        var _id = RouterLayer.getParam('_id');
        for (var i = 0; i < radios.length; i++) {
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
        if (rad < 1) {
            sAlert.warning('Selecciona la opción del dedo a enrolar');
        } else {
            console.log("set "+seleccionado);
            Session.set('Session_biometric_finger_enroll2', seleccionado);
            Meteor.call("biometric_up_enroll_from_emp", seleccionado, _id,Meteor.userId());
        }
        Session.set('Session_biometric_enrolados2', enrolados);
    },
    "click #biometric_cancel_finger": function (evt, temp) {
        CancelandoEnrolamiento();
    },
    "click #finish_biometric_capture_finger": function (evt, temp) {
        Session.set('Session_biometric_finger_enroll2', undefined);
        Meteor.call("temp_origin2", function (error, result) {
            if (result) {
            Meteor.call('delete_temps');
            Router.go('/admin/persons');
            sAlert.success('Biometría Actualizada');
            }
        });
    }
});

Template.orionMaterializeAccountIndex_XP.onCreated(function () {
    var data = Temp_messages.findOne({"active": true});
    if(data!=undefined){
        Temp_messages.update({_id: data._id}, {
            $set: {status_verification: ""}
        });
    }
  });

Template.updateFingers.rendered = function () {
    $("#finish_biometric_capture_finger").addClass('disabled');
    var data = Temp_messages.findOne({"active": true});
    if(data!=undefined){
        Temp_messages.update({_id: data._id}, {
            $set: {status_verification: ""}
        });
    }
}
