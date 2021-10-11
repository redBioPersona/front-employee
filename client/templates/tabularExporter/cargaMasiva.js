if (Meteor.isClient) {
    Template.orionMaterializeCollectionsCargaMasiva.onCreated(function () {
        Meteor.subscribe('get_Config_application', {
            onError: function (error) {
                console.log("error " + error);
            },
            onReady: function () {
                ActivateKeyBoard();
            }
        });

        Meteor.subscribe('get_CargaMasiva', Meteor.userId(),{
            onError: function (error) {
                console.log("error " + error);
            },
            onReady: function () {}
        });
    });

    Template.orionMaterializeCollectionsCargaMasiva.events({
        "click #Procesar": function (evt, template) {
            var file = document.getElementById("file_to_upload");
            var moduloSelect=$('#moduloSelect').val();
            var companySelect=$('#companySelect').val();
            var companySelect=$('#companySelect').val();
            var allowUP=$('#allowUP').is(':checked');
            if(moduloSelect){
                if(companySelect){
                    var archivo = file.files[0];
                    if (archivo != undefined) {
                        let size = archivo.size;
                        if (size <= 250000) {
                                let FileName = archivo.name;
                                swal({
                                  title: '¿ Desea procesar la siguiente información?',
                                  text: 'Módulo :'+moduloSelect+" archivo :"+FileName,
                                  type: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#32A617',
                                  cancelButtonColor: '#F31414',
                                  cancelButtonText: 'No',
                                  confirmButtonText: 'Si,Adelante!',
                                  closeOnConfirm: true
                                }, function () {
                                    Meteor.call("EliminarCargaMasiva",Meteor.userId());
                                    var fileReader = new FileReader();
                                    fileReader.onload = function () {
                                        var MyFile=btoa(fileReader.result);
                                        Meteor.call('guardarArchivo',MyFile,FileName,moduloSelect,Meteor.userId(),companySelect,function(err,res){
                                            if(err){
                                                sAlert.error("Error al subir, intente mas tarde");
                                            }else{
                                                sAlert.success("Archivo procesandose..., espere los resultado en la parte inferior");
                                                var dropDown = document.getElementById("moduloSelect");
                                                dropDown.selectedIndex = 0;

                                                var dropDowns = document.getElementById("companySelect");
                                                dropDowns.selectedIndex = 0;
                                                $("#Tfile_to_upload").val("");
                                                document.getElementById("file_to_upload").value="";
                                                Meteor.call("ReadExcel",moduloSelect,Meteor.userId(),companySelect,allowUP);
                                            }
                                        });
                                    }
                                    fileReader.onloadend = function (e) {};
                                    fileReader.onprogress = function (e) {};
                                    fileReader.onabort = function (e) {};
                                    fileReader.onerror = function (e) {
                                        sAlert.error("Error al subir el archivo");
                                    }
                                    if (fileReader.readAsBinaryString) {
                                        fileReader.readAsBinaryString(archivo);
                                    } else {
                                        fileReader.readAsArrayBuffer(archivo);
                                    }
                                });
                        }else{
                            sAlert.error("El archivo es muy pesado para ser procesado");
                        }
                    } else {
                        sAlert.error("Seleccione el archivo a procesar");
                    }
                }else{
                    sAlert.error("Seleccione la compañia, en donde se almacenara la información del archivo .xlsx");
                }
            }else{
                sAlert.error("Seleccione el módulo, en donde se almacenara la información del archivo .xlsx");
            }            
        }
    });
    Template.orionMaterializeCollectionsCargaMasiva.rendered = function () {
        Tracker.autorun(function() {
            clearSelect_Report_Companies();
          });
        setTimeout(() => {
            ActivateKeyBoard();
        }, 1000);
    };

    Template.orionMaterializeCollectionsCargaMasiva.helpers({
        GetColorIconBack: function () {
            return GetColorIconBack();
        },
        ColorTabularIndex: function () {
            return ColorTabularIndex();
        },
        selector: function () {
            var get_url = window.location.toString();
            var url = get_url.split("/");
            var coleccion = url[url.length - 1];
            var res = Meteor.users.findOne({ "_id": Meteor.userId() });
            if (res && res.profile.idcompany) {
                var idcompany = [];
                idcompany = res.profile.idcompany;
                busqueda = {
                    $and: [{
                        "Company": {
                            $in: idcompany
                        }
                    }]
                };
                return busqueda;
            }
        }
    });

    function ActivateKeyBoard() {
        var isStation = Config_application.findOne({
            "active": true
        });
        if (isStation != undefined && isStation.isServer != undefined && isStation.isServer == false&& isStation.showKeyboard==true) {
            $("input[type='search']").keyboard({
                layout: 'qwerty',
                change: function (event, keyboard, el) {},
                beforeClose: function (ev, keyboard, el) {},
                accepted: function (event, keyboard, el) {
                    var contenido = el.value;
                    setTimeout(function () {
                        $("input[type='search']").val(contenido);
                    }, 10);
                }
            });
        }
    }

    function clearSelect_Report_Companies() {
        $('#companySelect') .find('option') .remove() .end();
        var options = $("#companySelect");
        Meteor.call("load_companies", Meteor.userId(), function(error, result){
          if(result){
            var locationxx=result;
            options.append($("<option disabled selected>").val('').text('Seleccione una opción'));
            for (var i = 0; i < Object.keys(locationxx).length; i++) {
              options.append($("<option />").val(locationxx[i]._id).text(locationxx[i].companyName));
            }
            $('select').material_select();
          }
        });
      }

}