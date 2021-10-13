if (Meteor.isServer) {
  // var wincmd = require('node-windows');
  // wincmd.list(function(svc){
  // console.log(svc);
  // },true);

  var WebSocketClient = require('websocket').client;
  const Fibers = require('fibers');
  const fs = require('fs');
  const Jimp = require('jimp');

  var tiempo=1000*60*5;
  var ErrConnectWSDeviceManager=[],ErrConnectWSValidator=[];
  var ClientName="5ad8dd283d019226ef82bavo";

  var ServerWSValidator="wss://asistencias-xp-websockets.servicios.vangentmexico.com.mx";
  var ServerWSDeviceManager="ws://127.0.0.1:3060";
  var User="mbes";
  var NeuroOnline=true;

  if(MachineId.findOne()!=undefined){
    User=MachineId.findOne({}).idMachine;
  }  

  Meteor.startup(() => {
    if(Config_application.findOne({ "isServer": true }) ==undefined){
      ConnectWSDeviceManager();
    }
    var DataConfigApp=Config_application.findOne({});
    if(DataConfigApp){
      if(DataConfigApp.motorBiometricOperations==undefined || DataConfigApp.motorBiometricOperations=="Online"){
        ConnectWSValidator();
      }else{
        logBio.info("Usando el servicio de manera Offline ");
        NeuroOnline=false;
      }      
    }
    
    var omar=Config_application.find({"WebSocketClientName":{$exists:true}}).fetch();
    if(omar!=undefined){
      if(omar[0]!=undefined){ ClientName=omar[0].WebSocketClientName; }
    }
  });

  DeshabilitarFaceOperaciones=function(){
    var fiber = Fibers.current;
    Fibers(function () {
      try { SendToVerificationWindow('{"estatus":"NotProcessing"}');} catch (e) { }

      var dataTemp=Temp_messages.findOne({});
      if (dataTemp!=undefined) {
        Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "FaceWebSocketOffline" }});
      }

      var Sens=Sensors.findOne({});
      if(Sens!=undefined){
        Sensors.update({"_id":Sens._id}, {$set:{ "FaceService":false,"ProcessingFace":false,"ProcessingFinger":false}});
      }
    }).run();
  }

  HabilitarFaceOperaciones=function(){
    var fiber = Fibers.current;
    Fibers(function () {
      ErrConnectWSValidator=[];
      var dataTemp=Temp_messages.findOne({});
      if(dataTemp!=undefined){
        Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "" }});
      }
      var dataTemp2=Sensors.findOne({});
      if(dataTemp2!=undefined){
        Sensors.update({"_id":dataTemp2._id}, {$set:{ "FaceService":true}});
      }
    }).run();
  }

  DeshabilitarFingerOperaciones=function(){
    var fiber = Fibers.current;
    Fibers(function () {
      var busqueda={
        $or:[
           {"Action":"VerifyFinger"},
           {"Action":"EnrollFinger"}
         ],
         $and:[
           {"Resultado":{$exists:false}}
         ]
      };
      var DataBiometricOperations=BiometricOperations.findOne(busqueda,{sort:{createdAt:-1}});
      if(DataBiometricOperations!=undefined){
        BiometricOperations.direct.update({"_id":DataBiometricOperations._id}, {$set:{
          "Resultado":"Incorrecto",
          "Detalle":[{
            "estatus":"SocketFingerOffline"
          }],
          "updatedAt":new Date()
        }});
      }
      var dataTemp=Sensors.findOne({});
      if(dataTemp!=undefined){
        Sensors.update({"_id":dataTemp._id}, {$set:{
          "FingerService":false,
          "PrintService":false,
          "DeviceFingerConnect":false
        }});
      }
    }).run();
  }

  HabilitarFingerOperaciones=function(){
    var fiber = Fibers.current;
    Fibers(function () {
      ErrConnectWSDeviceManager=[];
      var dataTemp=Sensors.findOne({});
      if(dataTemp!=undefined){
        Sensors.update({"_id":dataTemp._id}, {$set:{ "FingerService":true}});
        Sensors.update({"_id":dataTemp._id}, {$set:{ "PrintService":true}});
      }
      // if(Sensors.findOne({"FingerService":true})!=undefined &&
      //   Sensors.findOne({"DeviceFingerConnect":true})!=undefined){
        // Meteor.call('ToWSDeviceManager',"CancelCaptureFinger");
        Meteor.call('ToWSDeviceManager',"VerifyFinger");
      // }
    }).run();
  }

  EnvMailWSDeviceManager=function(){
    if(ErrConnectWSDeviceManager.length==3 ||
      ErrConnectWSDeviceManager.length==6 || ErrConnectWSDeviceManager.length==12|| ErrConnectWSDeviceManager.length==24){
        console.log("Enviando Correo WSDeviceManager");
        var fiber = Fibers.current;
        Fibers(function () {

        }).run();
      }
    }

    EnvMailWSValidator=function(){
      if(ErrConnectWSValidator.length==3 ||
        ErrConnectWSValidator.length==6 || ErrConnectWSValidator.length==12|| ErrConnectWSValidator.length==24){
          var fiber = Fibers.current;
          Fibers(function () {
            var dataTemp=Temp_messages.findOne({});
            Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "FaceWebSocketOffline" }});
          }).run();
        }
      }

      ConnectWSDeviceManager=function(){
        try {
          var fiber = Fibers.current;
          Fibers(function () {
            var omar=Config_application.find({"WebSocketFinger":{$exists:true}}).fetch();
            if(omar!=undefined){
              if(omar[0]!=undefined){
                ServerWSDeviceManager=omar[0].WebSocketFinger;
              }
            }

            var clientFinger = new WebSocketClient();
            clientFinger.connect(ServerWSDeviceManager);
            clientFinger.on('connectFailed', function(error) {
              logBio.info("WS DEVICES connectFailed "+error);
              ErrConnectWSDeviceManager.push("");
              client=null;
              EnvMailWSDeviceManager();
              DeshabilitarFingerOperaciones();
              setTimeout(function () {
                ConnectWSDeviceManager();
              }, 4000);
            });

            clientFinger.on('connect', function(connectionFinger) {
              logBio.info("WS DEVICES ONLINE ");
              HabilitarFingerOperaciones();
              connectionFinger.on('error', function(error) {
                logBio.info("WS DEVICES error "+error);
                var fiber = Fibers.current;
                Fibers(function () {
                  try {
                    // Meteor.call('ToWSDeviceManager',"CancelCaptureFinger");
                    Meteor.call('ToWSDeviceManager',"VerifyFinger");
                  } catch (err) {}
                }).run();
              });
              connectionFinger.on('ping', function(cancel,data) {
                logBio.info("ping SEND  "+data);
              });
              connectionFinger.on('pong', function(data) {
                logBio.info("PONG RECEIVE  "+data);
              });
              connectionFinger.on('close', function() {
                logBio.info("WS DEVICES close ");
                ErrConnectWSDeviceManager.push("");
                client=null;
                DeshabilitarFingerOperaciones();
                EnvMailWSDeviceManager();
                setTimeout(function () {
                  ConnectWSDeviceManager();
                }, 4000);
              });
              connectionFinger.on('message', function(message) {
                if (message.type === 'utf8') {
                  try {
                    var resultado=message.utf8Data;
                    var answer=JSON.parse(resultado);
                    var Action=answer.Action;

                    var fiber = Fibers.current;
                    Fibers(function () {
                      switch(Action){
                        case "CatchFinger":
                            logBio.info("CatchFinger");
                          try {
                            SendToVerificationWindow('{"estatus":"CatchFinger"}');
                        } catch (e) { }
                        var dataTemp=Temp_messages.findOne({});
                        if(dataTemp!=undefined){
                          Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "CatchFinger" }});
                          Meteor.setTimeout(function(){
                                 Temp_messages.update({"_id":dataTemp._id}, {$unset:{ "status_verification": "" }});
                          }, 3000);
                        }
                        Meteor.call('ToWSDeviceManager',"VerifyFinger");
                        break;

                        case "PersonFound":
                          try { SendToVerificationWindow('{"estatus":"Processing"}');} catch (e) { }
                          var Data=Sensors.findOne({});
                          if(Data!=undefined){Sensors.update({_id:Data._id}, {$set:{ "ProcessingFinger":true }});}
                          Meteor.call("FindPerson",answer.PersonId,"Dactilar");
                          Meteor.call('ToWSDeviceManager',"VerifyFinger");
                        break;

                        case "SensorFinger":
                        try {
                          var muestra=answer.FingerSample;
                          var busqueda={
                            $or:[
                               {"Action":"VerifyFinger"},
                               {"Action":"EnrollFinger"}
                             ],
                             $and:[
                               {"Resultado":{$exists:false}}
                             ]
                          };
                          var DataBiometricOperations=BiometricOperations.findOne(busqueda,{sort:{createdAt:-1}});
                          if(DataBiometricOperations!=undefined){
                            var obj={
                              "Client":ClientName,
                              "User":User,
                              "Action":DataBiometricOperations.Action,
                              "Id":DataBiometricOperations._id,
                              "MyFileName":"Finger.jpg",
                              "MyFile":muestra
                            };
                            try { SendToVerificationWindow('{"estatus":"Processing"}');} catch (e) { }
                            if(DataBiometricOperations.SaveIntoServRest!=undefined){
                              obj["SaveIntoServRest"]=DataBiometricOperations.SaveIntoServRest;
                            }
                            if(DataBiometricOperations.AvoidDuplicates!=undefined){
                              obj["AvoidDuplicates"]=DataBiometricOperations.AvoidDuplicates;
                            }
                            if(DataBiometricOperations.IdBiometricPerson!=undefined){
                              obj["IdBiometricPerson"]=DataBiometricOperations.IdBiometricPerson;
                            }
                            if(DataBiometricOperations.VerifySamples!=undefined){
                              obj["VerifySamples"]=DataBiometricOperations.VerifySamples;
                            }
                            var Data=Sensors.findOne({});
                             if(Data!=undefined){
                               Sensors.update({_id:Data._id}, {$set:{ "ProcessingFinger":true }});
                             }

                            if(NeuroOnline){
                              try {
                                sendToWSValidator(JSON.stringify(obj));
                              } catch (err) {
                                logBio.info("Err sendToWSValidatorFinger");
                                try { SendToVerificationWindow('{"estatus":"CatchFinger"}'); } catch (e) { }
                                Meteor.call('ToWSDeviceManager',"VerifyFinger");
                                var dataTemp=Temp_messages.findOne({});
                                if(dataTemp!=undefined){
                                  Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "CatchFinger" }});
                                  Meteor.setTimeout(function(){
                                     Temp_messages.update({"_id":dataTemp._id}, {$unset:{ "status_verification": "" }});
                                   }, 3000);
                                }
                              }
                            }else{
                              logBio.info("Ejecutando operacion "+ DataBiometricOperations.Action+" offline ");
                              var msj={ "estatus":"NotFound" };
                              try { SendToVerificationWindow(JSON.stringify(msj)); } catch (e) { }
                              if(DataBiometricOperations.Action=="VerifyFinger"){
                                BiometricOperations.direct.upsert({_id:DataBiometricOperations._id}, {$set:{
                                  "Resultado":"Incorrecto",
                                  "Detalle":[ { "estatus" : "NotFound" } ],
                                  "updatedAt":new Date()
                                 }});
                                 var dataTemp=Temp_messages.findOne({});
                                 if(dataTemp!=undefined){
                                  Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "NotFound" }});
                                  Meteor.setTimeout(function(){
                                          Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "" }});
                                  }, 3000);
                                 }                                 
                              }
                            }                           
                          }
                          else{
                            logAccesos.info("No se encontro BiometricOperations");
                            Meteor.call('ToWSDeviceManager',"VerifyFinger");
                          }
                        } catch (error) {
                          logErrores.info("Err con una verificacion "+error);
                        }
                        break;
                        case "SendPrint":
                        logAccesos.info("Recibiendo como Impresión :"+JSON.stringify(answer));
                        if(answer.Found=="true"){
                          var dataTemp=Temp_messages.findOne({});
                          if(dataTemp!=undefined){
                            Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "ImpresionCorrecta"}});
                          }
                          try { SendToVerificationWindow('{"estatus":"ImpresionCorrecta"}'); } catch (e) { }

                          logAccesos.info("Impresión correcta eliminando Print_ticket en SendPrint");
                          Print_ticket.remove({});
                          try {
                            var DataTickets=JSON.parse(answer.VerifySamples);
                            var idOperation=answer.Id;
                            var tick_id=DataTickets.tick_id;
                            var empleado=DataTickets.employeeName;
                            var company=DataTickets.empresa;
                            var idEmployeeT=parseInt(DataTickets.idEmployee);
                            var to=getMailFromRestaurantName(DataTickets.restaurantName);
                            var cc=getMailFromPersonName(DataTickets.employeeName);
                            var fecha=moment().locale('es').format("dddd DD MMMM YYYY hh:mm:ss a");
                            var mensaje="NOMBRE DEL COLABORADOR: <b>"+empleado.toUpperCase()+"</b><br><br>COMPAÑIA: <b>"+company.toUpperCase()+"</b><br><br>FECHA DE EMISIÓN: <b>"+fecha.toUpperCase()+"</b>";
                            logAccesos.info("Enviando por correo el msj "+mensaje);                            
                            var TicketSync=Tickets.findOne({"_id":tick_id});
                            if (TicketSync!=undefined) {
                              FunctionAccessControl(TicketSync._idEmployee,"Dactilar",true);
                              insertaSync(TicketSync, "tickets", 'insert');
                            }else{
                              logErrores.info("No se ha enviado el dato del Ticker");
                            }
                            logAccesos.info("Enviando correo a "+to+" copia "+cc);                            
                            Meteor.call("sendEmail",to,cc,"TICKET DE ALIMENTOS",mensaje,"#0ecb45", function(error, result){if(error){console.log("error "+error);}; if(result){console.log("result "+result);}});
                            
                          } catch (e) {
                            console.log("Error en la Impresion "+e);
                          }

                          Meteor.setTimeout(function(){
                            Temp_messages.update({"_id":dataTemp._id}, {$unset:{ "status_verification": "" }});
                         }, 500);
                        }else{
                          try {
                            var DataTickets=JSON.parse(answer.VerifySamples);
                            var tick_id=DataTickets.tick_id;
                            Tickets.remove({"_id":tick_id});

                            logAccesos.info("Impresion incorrecta");
                            var dataTemp=Temp_messages.findOne({});
                            if(dataTemp!=undefined){
                              Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "ImpresionIncorrecta"}});
                            }

                            var fecha=moment().locale('es').format("DD/MM/YYYY");
                            var DataAccess=Accesscontrol.findOne({"employeeName":DataTickets.employeeName,"createdDate":fecha},{fields:{"_id":1}});
                            if(DataAccess!=undefined){
                              Accesscontrol.update({_id:DataAccess._id}, {$set:{ "meal":"-" }});
                            }

                            logAccesos.info("Error al imprimir, se elimino el registro "+tick_id);
                          } catch (e) {
                            logAccesos.info("Error al imprimir, no se elimino el registro "+e);
                          }
                        }
                        break;

                        case "GetSensors":
                        var dataSensors=Sensors.findOne({});
                        if(answer.Found=="true"){
                          if(dataSensors!=undefined){
                            Sensors.update({"_id":dataSensors._id}, {$set:{ "DeviceFingerConnect": true }});
                          }
                        }else{
                          if(dataSensors!=undefined){
                            Sensors.update({"_id":dataSensors._id}, {$set:{ "DeviceFingerConnect": false }});
                          }
                        }
                        break;

                        case "CancelCaptureFinger":
                        console.log("Lectura cancelada");
                        break;

                        case "VerifyFinger":
                        case "EnrollFinger":
                        case "IdentifyFinger":
                        try{
                          sendToWSValidator(resultado);
                        }catch(e){
                          logBio.info("Err sendToWSValidatorFinger Multiplecases");
                          var dataTemp=Temp_messages.findOne({});
                          Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "ErrorInterno" }});
                          Meteor.call('ToWSDeviceManager',"VerifyFinger");
                        }

                        break;

                        default:
                        break
                      }
                    }).run(); 
                  } catch (error) {
                    console.log("error "+error);
                  }
                }
              });

              sendToWSDeviceManager=function(Data) {
                if (connectionFinger.connected) {
                  connectionFinger.sendUTF(Data);
                }else{
                  DeshabilitarFingerOperaciones();
                }
              }

            });
          }).run();
        } catch (err) {
          console.log("Error fatal "+err);
        }
      }


      ConnectWSValidator=function(){
        var fiber = Fibers.current;
        Fibers(function () {
          var omar=Config_application.find({"WebSocketFace":{$exists:true}}).fetch();
          if(omar!=undefined){
            if(omar[0]!=undefined){
              ServerWSValidator=omar[0].WebSocketFace;
            }
          }

          var client = new WebSocketClient({
            closeTimeout: 600000
          });
          client.connect(ServerWSValidator);
          client.on('connectFailed', function(error) {
            ErrConnectWSValidator.push("");
            client=null;
            EnvMailWSValidator();
            DeshabilitarFaceOperaciones();
            setTimeout(function () {
              ConnectWSValidator();
            }, 4000);
          });

          client.on('connect', function(connection) {
            HabilitarFaceOperaciones();
            connection.on('error', function(error) { });
            connection.on('ping', function(cancel,data) { });
            connection.on('pong', function(data) { });
            connection.on('close', function() {
              ErrConnectWSValidator.push("");
              client=null;
              EnvMailWSValidator();
              DeshabilitarFaceOperaciones();
              setTimeout(function () {
                ConnectWSValidator();
              }, 4000);
            });

            connection.on('message', function(message) {
              if (message.type === 'utf8') {
                try {
                 
                  var AnswerValidator=JSON.parse(message.utf8Data);                  
                  var Id=AnswerValidator.Id;
                  var Resultado=AnswerValidator.resultado;
                  var Detalle=AnswerValidator.detalle;
                  var fiber = Fibers.current;
                  Fibers(function () {
                    var Data=Sensors.findOne({});
                      if(Data!=undefined){
                        Sensors.update({_id:Data._id}, {$set:{
                          "ProcessingFinger":false,
                          "ProcessingFace":false
                      }});
                    }
                    try { SendToVerificationWindow('{"estatus":"NotProcessing"}');} catch (e) { }
 
                   var arre=[];
                   var DetalleType=typeof Detalle;
                   if(DetalleType=="object"){
                     arre.push(Detalle);
                   }else{
                     var abc={
                       "estatus":"OBJECT_NOT_FOUND"
                     };
                     arre.push(abc);
                   }
                   BiometricOperations.direct.upsert({_id:Id}, {$set:{
                     "Resultado":Resultado,
                     "Detalle":arre,
                     "updatedAt":new Date()
                    }});
                   var DataBiometricOperations=BiometricOperations.findOne({_id:Id});
                   var stt=Detalle.estatus;
                   if(Resultado=="Correcto"){
                       var Action=DataBiometricOperations.Action;
                       var PersonIdFound=Detalle.PersonId;
                       if(Action=="VerifyFinger"){
                         var dataFiles = orionFileCollection.findOne({ "Id": Id});
                         if(dataFiles!=undefined){
                           var EnrollSuprema={
                             "_id":Id,
                             "PersonId":PersonIdFound,
                             "Action":"BuildSupremaTemplate"
                           };
                           orionFileCollection.update({"Id": Id}, {$set:{ "PersonId":PersonIdFound }});
                           try{sendToWSDeviceManager(JSON.stringify(EnrollSuprema)); }catch(e){}
                         }
                         Meteor.call("FindPerson",PersonIdFound,"Dactilar");
                         if(Sensors.findOne({"FingerService":true})!=undefined &&
                         Sensors.findOne({"DeviceFingerConnect":true})!=undefined){
                         Meteor.call('ToWSDeviceManager',"VerifyFinger");
                         }
                       }else if(Action=="VerifyFace"){
                         Meteor.call("FindPerson",PersonIdFound,"Facial");
                       }else if(Action=="EnrollFace"){
                         Persons.update({_id:PersonIdFound}, {$set:{
                           "FaceTemplate":true,
                           "PersonIdBiometric":PersonIdFound,
                           "face_template":Detalle.PersonIdSample
                         }});
                       }else if(Action=="EnrollFinger"){
                         var data=Persons.findOne({_id:PersonIdFound});
                         if(data!=undefined){
                           var obj={
                             "FingerTemplate":true,
                             "PersonIdBiometric":PersonIdFound
                           };
                           if(!('left_pulgares_left_template' in data)){
                             obj["left_pulgares_left_template"]=Detalle.PersonIdSample;
                           }else if(!('left__indices_left_template' in data)){
                             obj["left__indices_left_template"]=Detalle.PersonIdSample;
                           }else if(!('left___medios_left_template' in data)){
                             obj["left___medios_left_template"]=Detalle.PersonIdSample;
                           }else if(!('left_anulares_left_template' in data)){
                             obj["left_anulares_left_template"]=Detalle.PersonIdSample;
                           }else if(!('left_meniques_left_template' in data)){
                             obj["left_meniques_left_template"]=Detalle.PersonIdSample;
                           }else if(!('right_pulgars_left_template' in data)){
                             obj["right_pulgars_left_template"]=Detalle.PersonIdSample;
                           }else if(!('right_indices_left_template' in data)){
                             obj["right_indices_left_template"]=Detalle.PersonIdSample;
                           }else if(!('right__medios_left_template' in data)){
                             obj["right__medios_left_template"]=Detalle.PersonIdSample;
                           }else if(!('right__anular_left_template' in data)){
                             obj["right__anular_left_template"]=Detalle.PersonIdSample;
                           }else if(!('right_menique_left_template' in data)){
                             obj["right_menique_left_template"]=Detalle.PersonIdSample;
                           }
                           Persons.update({_id:PersonIdFound}, {$set:obj});
                         }
                       }
                   }else{
                       var dataTemp=Temp_messages.findOne({});
                       var AnswerValidatorEstatus=(Detalle && Detalle.estatus)?Detalle.estatus:"CatchFinger";
                       if(DataBiometricOperations!=undefined){
                           var Action=DataBiometricOperations.Action;
                           if(Action=="VerifyFinger" || Action=="EnrollFinger"){
                            if(Action=="EnrollFinger"){
                              try { SendToVerificationWindow('{"estatus":"PersonNotFound"}');} catch (e) { }
                            }                             
                            if(Sensors.findOne({"FingerService":true})!=undefined &&
                            Sensors.findOne({"DeviceFingerConnect":true})!=undefined){
                                  Meteor.call('ToWSDeviceManager',"VerifyFinger");
                            }
                           }
                       }else{
                         if(Sensors.findOne({"FingerService":true})!=undefined &&
                         Sensors.findOne({"DeviceFingerConnect":true})!=undefined){
                               Meteor.call('ToWSDeviceManager',"VerifyFinger");
                         }
                       }
                       var msj={
                         "estatus":AnswerValidatorEstatus
                       };
                       try { SendToVerificationWindow(JSON.stringify(msj)); } catch (e) { }
                       Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": AnswerValidatorEstatus }});
                       Meteor.setTimeout(function(){
                              Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification": "" }});
                       }, 3000);
                   }
                 }).run(); 
                } catch (error) {
                  console.log("Err resp Validado "+error);
                }
              }
            });

            sendToWSValidator=function(Data) {
              if (connection.connected) {
                connection.sendUTF(Data);
              }else{
                var mj={
                  "estatus":"Desconectado"
                };
                try { SendToVerificationWindow(JSON.stringify(mj)); } catch (e) { }
                DeshabilitarFaceOperaciones();
                Meteor.call('ToWSDeviceManager',"VerifyFinger");
              }
            }

          });
        }).run();
      }

      Meteor.methods({
        ToWSFaceValidator:function(MyFile,Action,ImproveImage,VerifySamples,SaveIntoServRest,AvoidDuplicates,IdBiometricPerson,Extra){
          var MyFileName="VerificacionFacial.jpg";
          var Id=BiometricOperations.direct.insert({
            "Client":ClientName,
            "User": User,
            "Action": Action,
            "MyFileName": MyFileName,
            "IdBiometricPerson":IdBiometricPerson,
            "VerifySamples": VerifySamples,
            "SaveIntoServRest": SaveIntoServRest,
            "AvoidDuplicates": AvoidDuplicates,
            "Extra":Extra,
            "createdAt":new Date()
          });

          var obj={
            "Client":ClientName,
            "User":User,
            "Action":Action,
            "Id":Id,
            "MyFileName":MyFileName,
            "SaveIntoServRest":"yes",
            "AvoidDuplicates":"yes",
            "MyFile":MyFile
          };

          if(ImproveImage!=undefined){
              // var NewId=generateId();
              // var archivo="/images/faces/"+NewId+".jpg";
              // var archivoNuevo="/images/faces/"+NewId+"_XP.jpg";
              // var bitmap = new Buffer(MyFile, 'base64');
              // fs.writeFileSync(archivo, bitmap);
              // Jimp.read(archivo, function (err, foto) {
              Jimp.read(Buffer.from(MyFile, 'base64'), function (err, foto) {
                if(err){
                  var error="Err actualizando BiometricOperations "+err;
                  console.log(error)
                  var Detalle=[{
                      "estatus":"OBJECT_NOT_FOUND"
                    }];
                  BiometricOperations.direct.update({_id:Id}, {$set:{
                    "Detalle":Detalle,
                    "updatedAt":new Date()
                  }});
                }else{
                    foto
                    .flip(true,false)
                    .autocrop()
                    .brightness(0.3)
                    .contrast(0.4)
                    .quality(100)
                    .normalize()
                    // .write(archivoNuevo)
                    .getBase64(Jimp.AUTO, (err, res) => {
                      if(err){
                        console.log("Err getBase64 "+err);
                      }
                      if(res){
                        obj["MyFile"]=res;
                      }
                    });
                  }
                });
          }
          if(VerifySamples!=undefined){
            obj["VerifySamples"]=VerifySamples;
          }
          if(SaveIntoServRest!=undefined){
            obj["SaveIntoServRest"]=SaveIntoServRest;
          }
          if(AvoidDuplicates!=undefined){
            obj["AvoidDuplicates"]=AvoidDuplicates;
          }
          if(IdBiometricPerson!=undefined){
            obj["IdBiometricPerson"]=IdBiometricPerson;
          }
          try{
            sendToWSValidator(JSON.stringify(obj));
            try { SendToVerificationWindow('{ "estatus":"Processing" }'); } catch (e) { }
            var Data=Sensors.findOne();
            if(Data!=undefined){
              Sensors.update({_id:Data._id}, {$set:{ "ProcessingFace":true }},function(err,res){
                if(err){
                  console.log(err);
                }
              });
            }
          }catch(e){
            DeshabilitarFaceOperaciones();
            Id=undefined;
          }finally{
            if(Action=="EnrollFace"){
              if (Enrollments_temp.findOne()!=undefined) {
                var NuevoEmpleado=Enrollments_temp.findOne({}).empleado;
                try {
                  var NewId=generateId();
                  var archivo="/images/faces/"+NewId+".jpg";
                  var bitmap = new Buffer(obj["MyFile"], 'base64');
                  fs.writeFile(archivo, bitmap, Meteor.bindEnvironment(function(err){
                    if(err){
                      logErrores.info("Error al crear el archivo "+archivo+" error "+err);
                    }else{
                      orionFileCollection.importFile(archivo, {
                        filename: "FaceEmployee",
                        contentType: 'image/jpeg'
                      }, function (err, file) {
                        fs.unlink(archivo, (err) => {});
                        if (!err){
                          var idins="/gridfs/data/id/"+file._id.toString();
                          Enrollments_temp.update({empleado:NuevoEmpleado}, {$set:{
                            "face_url":idins
                          }});
                        }
                      });
                    }
                 }));
                } catch (err) {
                  console.log("Error al guardar la foto");
                }
              }
            }
          }
          return Id;
        },
        ToWSDeleteBiometricValidator:function(RmBiometricId){
          var Action="DeleteBiometric";

          var Id=BiometricOperations.direct.insert({
            "Client":ClientName,
            "User": User,
            "Action": Action,
            "RmBiometricId": RmBiometricId,
            "createdAt":new Date()
          });

          var obj={
            "Client":ClientName,
            "User":User,
            "Action":Action,
            "Id":Id,
            "RmBiometricId":RmBiometricId,
          };
          try{
            sendToWSValidator(JSON.stringify(obj));
          }catch(e){
            DeshabilitarFaceOperaciones();
          }
        },
        ToWSDeviceManager: function(Action,VerifySamples,SaveIntoServRest,AvoidDuplicates,IdBiometricPerson,Extra) {
          var MyFileName="VerificacionDactilar.jpg";

          var Id=BiometricOperations.direct.insert({
            "Client":ClientName,
            "User": User,
            "Action": Action,
            "MyFileName": MyFileName,
            "IdBiometricPerson":IdBiometricPerson,
            "VerifySamples": VerifySamples,
            "SaveIntoServRest": SaveIntoServRest,
            "AvoidDuplicates": AvoidDuplicates,
            "Extra": Extra,
            "createdAt":new Date()
          });
          var obj={
            "Client":ClientName,
            "User":User,
            "Action":Action,
            "Id":Id,
            "MyFileName":MyFileName,
            "SaveIntoServRest":"yes",
            "AvoidDuplicates":"yes",
          };
          if(VerifySamples!=undefined)
          obj["VerifySamples"]=VerifySamples;
          if(SaveIntoServRest!=undefined)
          obj["SaveIntoServRest"]=SaveIntoServRest;
          if(AvoidDuplicates!=undefined)
          obj["AvoidDuplicates"]=AvoidDuplicates;
          if (IdBiometricPerson!=undefined)
          obj["IdBiometricPerson"]=IdBiometricPerson
          try{
            sendToWSDeviceManager(JSON.stringify(obj));
          }catch(e){
            if(Sensors.findOne({"FingerService":true})!=undefined &&
              Sensors.findOne({"DeviceFingerConnect":true})!=undefined){
            }
            logErrores.info("Err sendToWSDeviceManager "+e);
            DeshabilitarFingerOperaciones();
            throw new Meteor.Error('SocketDispositivos', "WebSocketServer de dispositivos desconectado");
          }
          return Id;
        }
      });
    }
