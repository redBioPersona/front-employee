import { Meteor } from 'meteor/meteor';
import { log } from 'util';
import {HTTP} from 'meteor/http';
var net = require('net');

if (Meteor.isServer) {
  const Fibers = require('fibers');
  const fs = require('fs');
  const Jimp = require('jimp');
  data_chunks = new Mongo.Collection('data.chunks');
  data_locks = new Mongo.Collection('data.locks');
  Meteor.startup(() => {
    // var sockets={};
    // var net = require('net');

    // var serverPrint=net.createServer(
    //   function(connection3){
    //     sockets["valentin"]=connection3;
    //     UpdateSensor("PrintService",true);
    //     connection3.on('end', function () {});
    //     connection3.on('error', function () {});
    //     connection3.on('close', function () {UpdateSensor("PrintService",false);});
    //     connection3.on('data', function (data) {});
    //     connection3.pipe(connection3);
    //   }
    // );

    // var serverFace=net.createServer(
    //   function(connection2){
    //     sockets["barrera"]=connection2;
    //     UpdateSensor("FaceService",true);
    //     connection2.on('end', function () {});
    //     connection2.on('error', function () {});
    //     connection2.on('close', function () {UpdateSensor("FaceService",false);});
    //     connection2.on('data', function (data) {});
    //     connection2.pipe(connection2);
    //   }
    // );

    // var server = net.createServer(
    //   function (connection) {
    //     var fiber = Fibers.current;
    //     Fibers(function () {
    //       if (Config_station.find().count() == 0) {
    //         Config_station.insert({"status":"online"});
    //       }else {
    //         var _id=Config_station.findOne({})._id;
    //         Config_station.update({_id:_id}, {$set:{ "status":"online" }});
    //       }
    //     }).run();
    //     sockets["omar"]=connection;
    //     UpdateSensor("FingerService",true);
    //     connection.on('end', function () {});
    //     connection.on('error', function () { });
    //     connection.on('close', function () {
    //       var fiber = Fibers.current;
    //       Fibers(function () {
    //         logBio.info("Socket desconectado");
    //         var config_station=Config_station.find().count();
    //         if (config_station==0) {
    //           Config_station.insert({"status":"offline"});
    //         }else {
    //           var _id=Config_station.findOne({})._id;
    //           Config_station.update({_id:_id}, {$set:{ "status":"offline","license":"error","devices_connected":"no" }});
    //         }
    //       }).run();

    //       UpdateSensor("FingerService",false);
    //       UpdateSensor("DeviceFingerConnect",false);
    //     });
    //     connection.on('data', function (data) {});
    //     connection.pipe(connection);
    //   }
    // );
    // var data=Config_station.findOne({"active":true});
    // var port=52275;
    // var portFace=52276;
    // var portPrint=52277;
    // if(data!=undefined){
    //   port=data.port_socket;
    //   if(data.port_face_socket!=undefined){
    //     portFace=data.port_face_socket;
    //   }
    //   if(data.port_print_socket!=undefined){
    //     portFace=data.port_print_socket;
    //   }
    // }
    // server.listen(52678, '127.0.0.1');
    // serverFace.listen(52239, '127.0.0.1');
    // serverPrint.listen(portPrint,'127.0.0.1');

    Meteor.methods({
      BadQuality: function (Id,Dedo,Normal,Binario,Template,Estatus,Calidad,Proceso,TemplateId,BinarioId,NormalId) {
        orionFileCollection.remove({"_id":new Mongo.ObjectID(TemplateId.toString())});
        data_chunks.remove({"files_id":new Mongo.ObjectID(TemplateId.toString())});
        data_locks.remove({"files_id":new Mongo.ObjectID(TemplateId.toString())});
        orion.filesystem.collection.remove({"_id":TemplateId.toString()});

        orionFileCollection.remove({"_id":new Mongo.ObjectID(BinarioId.toString())});
        data_chunks.remove({"files_id":new Mongo.ObjectID(BinarioId.toString())});
        data_locks.remove({"files_id":new Mongo.ObjectID(BinarioId.toString())});
        orion.filesystem.collection.remove({"_id":BinarioId.toString()});

        orionFileCollection.remove({"_id":new Mongo.ObjectID(NormalId.toString())});
        data_chunks.remove({"files_id":new Mongo.ObjectID(NormalId.toString())});
        data_locks.remove({"files_id":new Mongo.ObjectID(NormalId.toString())});
        orion.filesystem.collection.remove({"_id":NormalId.toString()});

        var obj={};
        obj[Dedo]="";
        obj[Normal]="";
        obj[Binario]="";
        obj[Template]="";
        obj[Estatus]="";
        obj[Calidad]="";
        obj[Proceso]="";
        Enrollments_temp.direct.update( {_id: Id.toString()} ,{$unset: obj },{ filter: false, validate: false } );
      },
      Take_Photo_Template_Face:function(data,hj,_idEmployee){
        var path="/images/faces/";
        var archivo=path + hj + '.jpg';
        var archivoNuevo=path + hj + "XP.jpg";

        var bitmap = new Buffer(data, 'base64');
        fs.writeFileSync(archivo, bitmap);
        Fiber = Npm.require('fibers');
        var theUserId = Meteor.userId();
        Jimp.read(archivo, function (err, foto) {
          if (err) throw err;
          Fiber(function () {
            foto.flip(true, false).write(archivoNuevo);
            Meteor.setTimeout(function () {
              orionFileCollection.importFile(archivoNuevo, {
                filename: 'LoadFace',
                contentType: 'image/jpeg'
              }, function (err, file) {
                if (err) console.log("Error al guardar la foto");
                else {
                  if (sockets["barrera"]!==undefined) {
                    // let variable=url+"LoadFace"+_idEmployee;
                    // sockets["barrera"].write(variable+'\n');

                    let variable="LoadFace"+_idEmployee+archivoNuevo;
                    sockets["barrera"].write(variable+'\n');
                    orionFileCollection.update({"_id":file._id}, {$set:{id:hj}});


                  }else{
                    fs.unlink(archivo, (err) => {
                      if (err) { console.log("La foto no se ha eliminado, error :"+err); }
                    });
                    fs.unlink(archivoNuevo, (err) => {
                      if (err) { console.log("La foto no se ha eliminado, error :"+err); }
                    });
                  }
                }
              });
            }, 100);
          }).run();
        });
        return hj;
      },
      Upload_Photo_Template_Face:function(_idEmpleado){
        if (sockets["omar"]!==undefined) {
          logBio.info("Subiendo la foto facial del Empleado "+_idEmpleado);
          sockets["omar"].write('Upload_Photo_Template_Face'+_idEmpleado+'\n');
        }
      },
      cliente3: function (mensaje) {
        if (mensaje=="cancelar") {
          var deleteFromServer=[];

          var dataup=Enrollments_uptemp.findOne();
          if(dataup!=undefined){

            for (var datas in dataup) {
              if(datas.includes("_left_template")){
                if (dataup.hasOwnProperty(datas)) {
                  var _id=dataup[datas];
                  RemoveFingers.insert({"id":_id});
                }
              }
            }

            for (var datas in dataup) {
              if(datas.includes("_left_normal")||
              datas.includes("_left_binaria")||
              datas.includes("_left_template")){
                if (dataup.hasOwnProperty(datas)) {
                  var _id=dataup[datas];
                  deleteFromServer.push(_id);
                  logBio.info("Eliminando los reg "+_id);
                  orionFileCollection.remove({"_id":new Mongo.ObjectID(_id.toString())});
                  data_chunks.remove({"files_id":new Mongo.ObjectID(_id.toString())});
                  data_locks.remove({"files_id":new Mongo.ObjectID(_id.toString())});
                  orion.filesystem.collection.remove({"_id":_id.toString()});
                }
              }
            }

            Enrollments_uptemp.remove({});
          };

          var data=Enrollments_temp.findOne();
          if (data!==undefined) {
            var _idEmpleado=data.empleado;
            try {
              Meteor.call("ToWSDeleteBiometricValidator", _idEmpleado, function(error, result){
                if(error){
                  var msj="Error call DeleteBiometricValidator "+error;
                  console.log(msj);
                  logErrores.error(msj);
                }
                if(result){
                  var msj="Result DeleteBiometricValidator ";
                  console.log(msj);
                }
              });
            } catch (e) {}


            for (var datas in data) {
              if(datas.includes("_left_template")){
                if (data.hasOwnProperty(datas)) {
                  var _id=data[datas];
                  RemoveFingers.insert({"id":_id});
                }
              }
            }

            //DEDOS GENERALIZADOS
            for (var datas in data) {
              if(datas.includes("_left_normal")||
              datas.includes("_left_binaria")||
              datas.includes("_left_template")){
                if (data.hasOwnProperty(datas)) {
                  var _id=data[datas];
                    deleteFromServer.push(_id);
                  orionFileCollection.remove({"_id":new Mongo.ObjectID(_id.toString())});
                  data_chunks.remove({"files_id":new Mongo.ObjectID(_id.toString())});
                  data_locks.remove({"files_id":new Mongo.ObjectID(_id.toString())});
                  orion.filesystem.collection.remove({"_id":_id.toString()});
                }
              }
            }

            //FIRMA
            var _idSigning=data.sign;
            if (_idSigning!=undefined) {
              var _idSign=data.sign.url;
              var _idsign=data.sign.fileId;
              _idSign = _idSign.replace("/gridfs/data/id/","");
              data_chunks.remove({"files_id":new Mongo.ObjectID(_idSign)});
              orionFileCollection.remove({"_id":new Mongo.ObjectID(_idSign)});
              orionFileCollection.remove({"_id":new Mongo.ObjectID(_idSign)});
              data_locks.remove({"files_id":new Mongo.ObjectID(_idSign)});
              orion.filesystem.collection.remove({"_id":_idsign});
            }

            //FOTO
            var _idface=data.face;
            if (_idface!=undefined) {
              var _idFaceTemplate=data.face_template;
              var _idFace=data.face_url;
              var _idFaceToken=data.faceToken;
              _idFace = _idFace.replace("/gridfs/data/id/","");
              data_chunks.remove({"files_id":new Mongo.ObjectID(_idFace)});
              orionFileCollection.remove({"_id":new Mongo.ObjectID(_idFace)});
              data_locks.remove({"files_id":new Mongo.ObjectID(_idFace)});
              orion.filesystem.collection.remove({"_id":_idface});

              data_chunks.remove({"files_id":new Mongo.ObjectID(_idFaceToken)});
              orionFileCollection.remove({"_id":new Mongo.ObjectID(_idFaceToken)});
              data_locks.remove({"files_id":new Mongo.ObjectID(_idFaceToken)});
              orion.filesystem.collection.remove({"_id":_idFaceToken});

              data_chunks.remove({"files_id":new Mongo.ObjectID(_idFaceTemplate)});
              orionFileCollection.remove({"_id":new Mongo.ObjectID(_idFaceTemplate)});
            }

            //Documentos
            var _idDocs=data.docs;
            var docsx=Documents_temp.findOne({_id:_idDocs});
            if (docsx!==undefined) {
              var docsname=docsx.documents;
              for (let i = 0; i < docsname.length; i++) {
                var _idco=docsname[i].name;
                var fileId=docsname[i].file.fileId;
                var fileUrl=docsname[i].file.url;
                fileUrl = fileUrl.replace("/gridfs/data/id/","");
                orion.filesystem.collection.remove({"_id":fileId});
                data_chunks.remove({"files_id":new Mongo.ObjectID(fileUrl)});
                orionFileCollection.remove({"_id":new Mongo.ObjectID(fileUrl)});
                data_locks.remove({"files_id":new Mongo.ObjectID(fileUrl)});
              }
              Documents_temp.remove({_id:_idDocs})
            }
            Enrollments.direct.remove({PERSON:_idEmpleado});
            Employees.remove({_id:_idEmpleado});
            Enrollments_temp.remove({});
          }
        }
      },InitialVerify_dactilar:function(){
        if (sockets["omar"]!==undefined){

          var data=Config_station.findOne({});
          var dataTemp=Temp_messages.findOne({});
          Config_station.update({"_id":data._id}, {$set:{ "finished":false }});
          Temp_messages.update({"_id":dataTemp._id}, {$set:{ "status_verification":""}});
          sockets["omar"].write('InitialVerify_dactilar\n');
        }else{
          var dataTemp=Temp_messages.findOne({});
          Temp_messages.update({"_id":dataTemp._id}, {$set:{ "error_verification":true}});
        }
        Access_temp.remove({});
      },
      checkDevice:function(){
        if (sockets["omar"]!==undefined){
          sockets["omar"].write('checkDevice\n');
        }else{
          console.log("Monitor del servicio finger java apagado")
        }
      },
      biometric_enroll:function(data){
        if (sockets["omar"]!==undefined){
          var write="EnrollBiometricFingers"+data;
          sockets["omar"].write(write+'\n');
        };
      },
      biometric_up_enroll_from_emp:function(dedo,_idEmployee,userId){
        if (sockets["omar"]!==undefined){
          var write=_idEmployee+"UpFinger"+dedo+"User"+userId;
          sockets["omar"].write(write+'\n');
        };
      },
      biometric_update_enroll: function(blob, name, path, encoding,_idEmployee,dedoSeleccionado,UserId) {
        var path="/Temp/";
        var theUserId = Meteor.userId();
        var filename = name.toLowerCase().replace(/ /g,'_').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9_.]/g,'');
         fs.writeFile(path+"/"+filename, blob, encoding, Meteor.bindEnvironment(function(err){
            if(err) {
                console.log("Error:"+err);
            } else {
              orionFileCollection.importFile('/Temp/' +filename, {
                filename: 'LoadFinger',
                contentType: 'image/jpeg'
              }, function (err, file) {
                if (err) console.log("Error al guardar la foto");
                else {
                  var _id=file._id;
                  var theID = orion.filesystem.collection.insert({
                    url: '/gridfs/data/id/' + file._id,
                    meta: { gridFS_id: file._id },
                    name: 'LoadFinger',
                    uploader: 'image',
                    uploadedBy: theUserId,
                    size: file.length
                  });
                  fs.unlink('/Temp/' + filename, (err) => {
                    if (err) { console.log("La foto no se ha eliminado, error :"+err); }
                  });
                    logBio.info("Actualizando Imagen del Empleado :"+_idEmployee+" por el usuario "+theUserId+" Por carga de archivo con id :"+theID+" "+_id+" dedo "+dedoSeleccionado);
                  if (sockets["omar"]!==undefined) {
                    let variable=_id+"LoadFinger"+_idEmployee+"dedo"+dedoSeleccionado;
                    logBio.info(variable);
                    sockets["omar"].write(variable+'\n');
                  }else{
                    orion.filesystem.collection.remove({"_id":theID});
                    orionFileCollection.remove({"_id":_id});
                  }
                }
              });
            }
        }));
      },
      update_devices:function(){
        if (sockets["omar"]!==undefined){
          sockets["omar"].write('update_devices\n');
        };
      },
      SaveSignTouch:function(img){
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        fs.writeFile('/Temp/image.png', buf);
      },
      Saving_sign:function(data,hj){
        var bitmap = new Buffer(data, 'base64');
        fs.writeFileSync('/Temp/' + hj + '.jpg', bitmap);
        var theUserId = Meteor.userId();
        orionFileCollection.importFile('/Temp/' + hj + '.jpg', {
          filename: 'Signs.jpg',
          contentType: 'image/jpeg'
        }, function (err, file) {
          if (err) console.log("Error al guardar la foto");
          else {
            var theID = orion.filesystem.collection.insert({
              url: '/gridfs/data/id/' + file._id,
              meta: { gridFS_id: file._id },
              name: 'Signs.jpg',
              uploader: 'image',
              uploadedBy: theUserId,
              size: file.length
            });
            var theFile = {
              url: "/gridfs/data/id/" + file._id,
              fileName: file.filename,
              fileId: theID
            };
            var face_imageXP=hj + 'XP.jpg';
            fs.unlink('/Temp/' + hj+ '.jpg', (err) => {
              if (err) { console.log("La foto no se ha eliminado, error :"+err); }
            });
            var url=file._id;
            var rute="/gridfs/data/id/"+url.toString();
            var data=Enrollments_temp.find().fetch();
            if(data!=undefined){
              if(data[0]!=undefined){
                var _id=data[0]._id;
                var sign={
                  "url":rute,
                  "fileId":url.toString(),
                  "filename":"Signs.jpg"
                };
                Enrollments_temp.update( { _id: _id }, { $set: { sign:sign } });
              }
            }
          }
        });
      },
      saveFile: function(blob, name, path, encoding,_idEmployee) {
        var path="/images/faces/";
        var theUserId = Meteor.userId();
        var autoId=generateId();
        var filename = autoId+"."+name.split('.').pop();
         fs.writeFile(path+filename, blob, encoding, Meteor.bindEnvironment(function(err){
            if(err) {
                console.log("Error:"+err);
            } else {
              orionFileCollection.importFile(path +filename, {
                filename: 'LoadFace',
                contentType: 'image/jpeg'
              }, function (err, file) {
                if (err) console.log("Error al guardar la foto "+err);
                else {
                  if (sockets["barrera"]!==undefined) {
                    let variable="LoadFace"+_idEmployee+path+filename;
                    sockets["barrera"].write(variable+'\n');
                    orionFileCollection.update({"_id":file._id}, {$set:{id:autoId}});
                  }else{
                    fs.unlink(path + filename, (err) => {
                      if (err) { console.log("La foto no se ha eliminado, error :"+err); }
                    });
                  }
                }
              });
            }
        }));
      },
      InitialVerify_face:function(data,hj){
        if (sockets["barrera"]!==undefined) {
          var bitmap = new Buffer(data, 'base64');
          fs.writeFileSync('/images/faces/' + hj + '.jpg', bitmap);
          let variable=hj+"InitialVerify_face";
          sockets["barrera"].write(variable+'\n');
        }
      },
      FacePersonFound:function(_id){
        if (sockets["barrera"]!==undefined) {
          let variable="FacePersonFound"+_id;
          sockets["barrera"].write(variable+'\n');
        }
      },
      insertEnrollface: function (data, hj) {
        var bitmap = new Buffer(data, 'base64');
        fs.writeFileSync('/images/faces/' + hj + '.jpg', bitmap);
        Fiber = Npm.require('fibers');
        var theUserId = Meteor.userId();
        Jimp.read("/images/faces/" + hj + ".jpg", function (err, foto) {
          if (err) throw err;
          Fiber(function () {
            foto.flip(true, false).write("/images/faces/" + hj + "XP.jpg");
            Meteor.setTimeout(function () {
              orionFileCollection.importFile('/images/faces/' + hj + 'XP.jpg', {
                filename: hj,
                contentType: 'image/jpeg'
              }, function (err, file) {
                if (err) console.log("Error al guardar la foto");
                else {
                  var theID = orion.filesystem.collection.insert({
                    url: '/gridfs/data/id/' + file._id,
                    meta: { gridFS_id: file._id },
                    name: hj,
                    uploader: 'image',
                    uploadedBy: theUserId,
                    size: file.length
                  });
                  var theFile = {
                    url: "/gridfs/data/id/" + file._id,
                    fileName: file.filename,
                    fileId: theID
                  };
                  var face_imageXP=hj + 'XP.jpg';
                  var data=Enrollments_temp.find().fetch();
                  var _id=data[0]._id;
                  var url=file._id;
                  var rute="/gridfs/data/id/"+url.toString();
                  Enrollments_temp.update({_id:_id}, {$set:{facing:"true", face:hj ,face_image:face_imageXP,face_url:rute}});
                  if (sockets["barrera"]!==undefined) {
                    sockets["barrera"].write('enroll_face\n');
                  }
                }
              });
            }, 100);
          }).run();
        });
        return hj;
      },
      omarshit: function (data, hj) {
        if (sockets["barrera"]!==undefined) {
          sockets["barrera"].write('InitialVerify_face\n');
        }
      },
      yes_print_ticket:function(idEmployee,_idRestaurant){
        logAccesos.info("El usuario desea imprimir ticket ");
        var result=false;
        var fecha = moment().format('DD/MM/YYYY');
        var registro=moment().format('HH:mm');
        var dataPerson=Persons.findOne({"_id":idEmployee},{fields:{idEmployee:1,employeeName:1,idcompany:1}});
        var dataRestaurant=Restaurants.findOne({"_id":_idRestaurant},{fields:{restaurantName:1}});
        var folio=Tickets.find({}).count()+1;
        if(dataPerson!=undefined){
          if(dataRestaurant!=undefined){
            var Ticket={
              "_idEmployee" : idEmployee,
              "idEmployee" : dataPerson.idEmployee,
              "employeeName" : dataPerson.employeeName,
              "idcompany" : dataPerson.idcompany,
              "fecha" : fecha,
              "registro" : registro,
              "folio" : parseInt(folio),
              "createdAt" : new Date()
            };

            var obj={
              "idEmployee":dataPerson.idEmployee,
              "employeeName":dataPerson.employeeName,
              "fecha":fecha,
              "restaurantName":dataRestaurant.restaurantName,
              "folio":folio,
              "empresa":GetcompanyName(dataPerson.idcompany[0])
            };
            var insertado="";
            logAccesos.info("Insertando el ticker "+JSON.stringify(Ticket));

            Tickets.insert(Ticket,function(err,res){
              if(res){
                insertado=res;
                obj["tick_id"]=res;
                Meteor.call('ToWSDeviceManager',"SendPrint",JSON.stringify(obj),function(err,res){
                  if(err){
                    Tickets.remove({"_id":insertado});
                  }else{
                    if(res){
                      result=true;
                      Accesscontrol.update({"idEmployee":idEmployee,"createdDate":fecha}, {$set:{meal:"true" }});
                      Print_ticket.remove({});
                    }else{
                      console.log("unde");
                    }
                  }
                });
              }
              if(err){
                logErrores.info("Err al insertar el ticket "+err);
              }
            });
          }
        }
        return result;
      },
      cancel_print_ticket:function(idEmployee){
        logAccesos.info("El usuario cancelo el proceso de imprimir ticket ");
        Print_ticket.remove({});
      },
      no_print_ticket:function(idEmployee){
        logAccesos.info("El usuario no desea imprimir ticket ");
        var fecha=new Date();
        var dia=fecha.getDate();
        var mes=fecha.getMonth()+1;
        var anio=fecha.getFullYear();
        dia=setDateZero(dia);
        mes=setDateZero(mes);
        var fech=dia+"/"+mes+"/"+anio;
        Accesscontrol.update({"idEmployee":idEmployee,"createdDate":fech}, {$set:{meal:"no"}});
        Print_ticket.remove({});
      }
    });
    //omar
  });
}
