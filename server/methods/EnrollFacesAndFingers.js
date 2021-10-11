if (Meteor.isServer) {
  const Fibers = require('fibers');
  const fs = require('fs');

  function sleeper(ms) {
    var fiber = Fibers.current;
    setTimeout(function () {
      fiber.run();
    }, ms);
    Fibers.yield();
  }

  CleanDirectory=function(path){
    var stats = fs.statSync(path);
    if(stats.isDirectory()){
      var files=fs.readdirSync(path);
      files.forEach(elem => {
        fs.unlinkSync(path+elem);
      });
      try {
        fs.rmdirSync(path);
      } catch (e) {
        logReport.info("No fue posible eliminar la carpeta "+e);
      }
    }else{
      fs.unlinkSync(path);
    }
  };

  SendWS=function(ruta,idEmployee,Action){
    try{
      var bitmap = fs.readFileSync(ruta);
      var MyFile=new Buffer(bitmap).toString('base64');
      Meteor.call("ToWSFaceValidator", MyFile,Action,undefined,undefined,"yes","yes",idEmployee,undefined, function(error, result){
        if(error){
          logReport.error("Error ToWSFaceValidator "+error);
        }else{
          if(result){
            CleanDirectory(ruta);
            logReport.info("Operacion "+Action+" enviada del empleado "+idEmployee);
            if(Action=="EnrollFace"){
              var sub=ruta.split("/");
              var res = ruta.replace(sub[sub.length-1], "");
              CleanDirectory(res);
            }
          }else{
            logReport.error("Resultado undefined ");
          }
        }
      });
    }catch(e){
      logReport.info("Sin Conexion con el validador");
    }
  }


  var ProcessFace = function (idEmployee,ruta) {
    var path=ruta+idEmployee+"/";
    var files=fs.readdirSync(path);
    files.forEach(elem => {
      orionFileCollection.importFile(path+elem, {
        filename: "FaceEmployee",
        contentType: 'image/jpeg'
      }, function (err, file) {
        if (!err){
          var idins="/gridfs/data/id/"+file._id.toString();
          var face={
            "url":idins,
            "fileId":file._id.toString()
          };
          Persons.update({"_id":idEmployee}, {$set:{
            "face":face
          }});
        }
      });
    });
  }

  var ProcessSample = function (idEmployee,ruta) {
    var obj={"_id":idEmployee};
    var Action="";
    if(ruta.includes("faces")){
      obj["FaceTemplate"]=true;
      Action="EnrollFace";
    }else if(ruta.includes("fingers")){
      obj["FingerTemplate"]=true;
      Action="EnrollFinger";
    }
    var data=Persons.findOne(obj,{fields:{"_id":1}});
    var reconocimiento=(Action=="EnrollFace")?"Facial":"Dactilar";
    if (data!=undefined) {
      if(reconocimiento=="Facial"){
        logReport.info("Persona "+idEmployee+" con reconocimiento "+reconocimiento+" ya asignado");
        CleanDirectory(ruta+idEmployee+"/");
      }else if(reconocimiento=="Dactilar"){
        var HuellasSuficientes=0;
        Object.keys(data).forEach(function (key) {
          if(key.includes('_left_template')){
            ++HuellasSuficientes;
          }
        });
        if (HuellasSuficientes>=2) {
          logReport.info("Persona "+idEmployee+" con reconocimiento "+reconocimiento+" ya asignado");
          CleanDirectory(ruta+idEmployee+"/");
        }
      }
    }else {
      var path=ruta+idEmployee+"/";
      var stats = fs.statSync(path);
      if(stats.isDirectory()){
        var files=fs.readdirSync(path);
        files.forEach(elem => {
          SendWS(path+elem,idEmployee,Action);
        });
      }else{
        SendWS(ruta+idEmployee,idEmployee,Action);
      }
    }
  };

  var Bound = Meteor.bindEnvironment(function (idEmployee,ruta) {
    ProcessSample(idEmployee,ruta);
  }, function (e) {
    console.log("Error "+e);
    throw e
  });

  var Bound2 = Meteor.bindEnvironment(function (idEmployee,ruta) {
    ProcessFace(idEmployee,ruta);
  }, function (e) {
    console.log("Error "+e);
    throw e
  });

  Meteor.methods({
    SavePhotoEmployees:function(){
      var SamplePaths=[
        "/Migracion/faces/"
      ];
      logReport.info("Iniciando el proceso de carga de fotos");
      SamplePaths.forEach(ruta=>{
        var files=fs.readdirSync(ruta);
        for(var i = 0, len = files.length; i < len; i++){
          Bound2(files[i],ruta);
          sleeper(500);
        }
      });
      logReport.info("Termino el proceso de carga de fotos");
    },
    EnrollFacesAndFingers:function(){
      var SamplePaths=[
        "/Migracion/faces/",
        "/Migracion/fingers/antiguas/",
      ];
      logReport.info("Iniciando el proceso de enrolamiento masivo ");
      SamplePaths.forEach(ruta=>{
        logReport.info("Procesando la ruta "+ruta);
        var files=fs.readdirSync(ruta);
        for(var i = 0, len = files.length; i < len; i++){
          Bound(files[i],ruta);
          sleeper(3000);
        }
      });
      logReport.info("Termino el proceso de enrolamiento masivo");
    }
  });
}
