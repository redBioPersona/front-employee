Meteor.startup(function() {
    if (Meteor.isServer) {
      basepath = process.env.RAIZ;
      if (!basepath) {
      	basepath="/logs/";
      }
        try{
            creaDirectorios(basepath);
            creaDirectorios(basepath+"/MeteorMbes/");
            creaDirectorios(basepath+"/DeviceManager/");
            creaDirectorios(basepath+"/MeteorSyncMbes/");
            creaDirectorios(basepath+"/MeteorBiometricMbes/");
            creaDirectorios(basepath+"/MeteorReportsBiometricMbes/");
            creaDirectorios(basepath+"/MeteorErrores/");
            creaDirectorios(basepath+"/MeteorAccesos/");
            creaDirectorios(basepath+"/JavaMbes/");
            
            creaDirectorios(basepath+"/Archivos/");
            creaDirectorios(basepath+"/Archivos/Colaboradores/");
            creaDirectorios(basepath+"/Archivos/Colaboradores/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Colaboradores/Error/");
            creaDirectorios(basepath+"/Archivos/Colaboradores/Procesados/");

            creaDirectorios(basepath+"/Archivos/Localidades/");
            creaDirectorios(basepath+"/Archivos/Localidades/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Localidades/Error/");
            creaDirectorios(basepath+"/Archivos/Localidades/Procesados/");

            creaDirectorios(basepath+"/Archivos/Restaurantes/");
            creaDirectorios(basepath+"/Archivos/Restaurantes/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Restaurantes/Error/");
            creaDirectorios(basepath+"/Archivos/Restaurantes/Procesados/");

            creaDirectorios(basepath+"/Archivos/Documentos/");
            creaDirectorios(basepath+"/Archivos/Documentos/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Documentos/Error/");
            creaDirectorios(basepath+"/Archivos/Documentos/Procesados/");

            creaDirectorios(basepath+"/Archivos/Departamentos/");
            creaDirectorios(basepath+"/Archivos/Departamentos/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Departamentos/Error/");
            creaDirectorios(basepath+"/Archivos/Departamentos/Procesados/");
            
            creaDirectorios(basepath+"/Archivos/Incidencias/");
            creaDirectorios(basepath+"/Archivos/Incidencias/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Incidencias/Error/");
            creaDirectorios(basepath+"/Archivos/Incidencias/Procesados/");           
            
            creaDirectorios(basepath+"/Archivos/Puestos/");
            creaDirectorios(basepath+"/Archivos/Puestos/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Puestos/Error/");
            creaDirectorios(basepath+"/Archivos/Puestos/Procesados/");

            creaDirectorios(basepath+"/Archivos/Outsourcing/");
            creaDirectorios(basepath+"/Archivos/Outsourcing/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Outsourcing/Error/");
            creaDirectorios(basepath+"/Archivos/Outsourcing/Procesados/");

            creaDirectorios(basepath+"/Archivos/Horarios/");
            creaDirectorios(basepath+"/Archivos/Horarios/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Horarios/Error/");
            creaDirectorios(basepath+"/Archivos/Horarios/Procesados/");

            creaDirectorios(basepath+"/Archivos/Areas/");
            creaDirectorios(basepath+"/Archivos/Areas/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Areas/Error/");
            creaDirectorios(basepath+"/Archivos/Areas/Procesados/");

            creaDirectorios(basepath+"/Archivos/Direcciones/");
            creaDirectorios(basepath+"/Archivos/Direcciones/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Direcciones/Error/");
            creaDirectorios(basepath+"/Archivos/Direcciones/Procesados/");

            creaDirectorios(basepath+"/Archivos/Proyectos/");
            creaDirectorios(basepath+"/Archivos/Proyectos/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Proyectos/Error/");
            creaDirectorios(basepath+"/Archivos/Proyectos/Procesados/");

            creaDirectorios(basepath+"/Archivos/Jefes/");
            creaDirectorios(basepath+"/Archivos/Jefes/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Jefes/Error/");
            creaDirectorios(basepath+"/Archivos/Jefes/Procesados/");

            creaDirectorios(basepath+"/Archivos/Sanciones/");
            creaDirectorios(basepath+"/Archivos/Sanciones/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Sanciones/Error/");
            creaDirectorios(basepath+"/Archivos/Sanciones/Procesados/");
            
            creaDirectorios(basepath+"/Archivos/Alimentos/");
            creaDirectorios(basepath+"/Archivos/Alimentos/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Alimentos/Error/");
            creaDirectorios(basepath+"/Archivos/Alimentos/Procesados/");

            creaDirectorios(basepath+"/Archivos/Retardos/");
            creaDirectorios(basepath+"/Archivos/Retardos/Aprocesar/");
            creaDirectorios(basepath+"/Archivos/Retardos/Error/");
            creaDirectorios(basepath+"/Archivos/Retardos/Procesados/");

            creaDirectorios("/Temp/");
            creaDirectorios("/images/");
            creaDirectorios("/images/faces/");
            creaDirectorios("/images/fingers/");
            creaDirectorios("/images/aprocesar/");
            creaDirectorios("/images/aprocesar/faces/");
            creaDirectorios("/images/aprocesar/fingers/");
        }
        catch(e){
            console.log("Error al crear la estructura de directorios "+err);
        }
    }
});

creaDirectorios = function(ruta){
    fs = require('fs');
    fs.exists(ruta,(exists)=>{
    if (!exists) {
      fs.mkdir(ruta,function(err){
        if (err) {
          log.error("Error al crear la carpeta :"+ruta+" error :"+err);
        }else{
          log.info('Se creo la carpeta '+ruta);
        }
      });
    }
  });
  }
