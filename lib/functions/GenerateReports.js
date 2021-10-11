GenerateReports_getAntes=function(exit,oficial){
    var resultado="-";
    if (exit instanceof Date && oficial) {
        var salio= moment(exit).format("HH:mm");
        var _salio=parseInt(salio.split(":")[0]*60)+parseInt(salio.split(":")[1]);
        var _oficial=parseInt(oficial.split(":")[0]*60)+parseInt(oficial.split(":")[1]);
        if(_salio<_oficial){
            resultado="true";
        }else {
            resultado="false";
        }
    }
    return resultado;
}

GenerateReports_getSancion=function(ingreso,oficial){
    var resultado="";
    if (ingreso instanceof Date) {
        var entro= moment(ingreso).format("HH:mm");
        var _entro=parseInt(entro.split(":")[0]*60)+parseInt(entro.split(":")[1]);
        var _oficial=parseInt(oficial.split(":")[0]*60)+parseInt(oficial.split(":")[1]);
         if(_entro>_oficial){
            resultado="Sin Descuento";
        }
    }
    return resultado;
}
GenerateMealTimes_getEstatus=function(transcurrio,permitido,HorarioAlimentos){
    var resultado=[];
    var estatus="-";
    var sancion="-";

    var objTolerancia=HorarioAlimentos["Tolerancia"];
    var objRetNormal=HorarioAlimentos["Retardo Normal"];
    var objRetMenor=HorarioAlimentos["Retardo Menor"];
    var objRetMayor=HorarioAlimentos["Retardo Mayor"];
    if(transcurrio<=permitido){
        estatus="Normal";
        sancion="-";
    }else{
        if(objTolerancia!=undefined && objRetNormal!=undefined &&
            objRetMenor!=undefined && objRetMayor!=undefined){
                if(transcurrio<=objTolerancia.tiempo){
                    estatus="Normal";
                    sancion=objTolerancia.sancion;
                }else if(transcurrio<=objRetNormal.tiempo){
                    estatus="Retardo Normal";
                    sancion=objRetNormal.sancion;
                }else if(transcurrio<=objRetMenor.tiempo){
                    estatus="Retardo Menor";
                    sancion=objRetMenor.sancion;
                }else{
                    estatus="Retardo Mayor";
                    sancion=objRetMayor.sancion;
                }
        }else if(objTolerancia!=undefined){
            if(transcurrio<=objTolerancia.tiempo){
                estatus="Normal";
                sancion=objTolerancia.sancion;
            }else{
                estatus="Retardo Normal";
                sancion="-";
            }
        }
        else{
            estatus="Retardo Normal";
            sancion="-";
        }
    }
    resultado[0]=estatus;
    resultado[1]=sancion;
    return resultado
}


GenerateReports_getEstatus=function(ingreso,oficial,HorarioAsistencias){
    var resultado="-";
    var sancion="-";
    var retorna=[];
    var objeto=HorarioAsistencias;
    if (ingreso instanceof Date) {
      var entro= moment(ingreso).format("HH:mm");
      var _entro=parseInt(entro.split(":")[0]*60)+parseInt(entro.split(":")[1]);
      var _oficial=parseInt(oficial.split(":")[0]*60)+parseInt(oficial.split(":")[1]);
      if(_entro<=_oficial){
        resultado="Normal";
        sancion="-";
      }else if(_entro>_oficial){
        var diferencia=_entro-_oficial;
        if(objeto!=undefined){
          var objTolerancia=objeto["Tolerancia"];
          var objRetNormal=objeto["Retardo Normal"];
          var objRetMenor=objeto["Retardo Menor"];
          var objRetMayor=objeto["Retardo Mayor"];
          if(objTolerancia!=undefined && objRetNormal!=undefined &&
           objRetMenor!=undefined && objRetMayor!=undefined &&
           objTolerancia.tiempo!=undefined && objRetNormal.tiempo!=undefined &&
           objRetMenor.tiempo!=undefined && objRetMayor.tiempo!=undefined){
            if(diferencia<=objTolerancia.tiempo){
              resultado="Normal";
              var Sancionobj=objTolerancia.sancion;
              if(Sancionobj!=undefined){
                sancion=objTolerancia.sancion;
              }
            }else if(diferencia<=objRetNormal.tiempo){
              resultado="Retardo Normal";
              var Sancionobj=objRetNormal.sancion;
              if(Sancionobj!=undefined){
                sancion=objRetNormal.sancion;
              }
            }else if(diferencia<=objRetMenor.tiempo){
              resultado="Retardo Menor";
              var Sancionobj=objRetMenor.sancion;
              if(Sancionobj!=undefined){
                sancion=objRetMenor.sancion;
              }
            }else{
              resultado="Retardo Mayor";
              var Sancionobj=objRetMayor.sancion;
              if(Sancionobj!=undefined){
                sancion=objRetMayor.sancion;
              }
            }
          }else{
            if(objTolerancia!=undefined && objTolerancia.tiempo!=undefined){
              if(diferencia<=objTolerancia.tiempo){
                resultado="Normal";
                sancion="Sin Descuento";
              }else{
                resultado="Retardo Normal";
                sancion="Sin Descuento";
              }
            }else{
              if(diferencia<=15){
                resultado="Normal";
                sancion="-";
              }else {
                resultado="Retardo Normal";
                sancion="Sin Descuento";
              }
            }            
          }
        }else{
          if(diferencia<=15){
            resultado="Normal";
            sancion="-";
          }else {
            resultado="Retardo Normal";
            sancion="Sin Descuento";
          }
        }
      }
    }
    retorna[0]=resultado;
    retorna[1]=sancion;
    return retorna;
  }

getDatesBetween = function (startDate, endDate) {
    var dates = [],
    currentDate = startDate,
    addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
};

getHorario = function (_idEmployee) {
  var resultado = {
    "Horarios": {
      "lunes": { "Entrada": "08:00", "Salida": "18:00", "ComidaInicio": "12:00", "ComidaFin": "16:00" },
      "martes": { "Entrada": "08:00", "Salida": "18:00", "ComidaInicio": "12:00", "ComidaFin": "16:00" },
      "miercoles": { "Entrada": "08:00", "Salida": "18:00", "ComidaInicio": "12:00", "ComidaFin": "16:00" },
      "jueves": { "Entrada": "08:00", "Salida": "18:00", "ComidaInicio": "12:00", "ComidaFin": "16:00" },
      "viernes": { "Entrada": "08:00", "Salida": "16:00", "ComidaInicio": "12:00", "ComidaFin": "16:00" }
    },
    "Asistencias":{
      "Tolerancia":{"tiempo":15,"sancion":"Sin Descuento"},
      "Retardo Normal":{"tiempo":30,"sancion":"Sin Descuento"},
      "Retardo Menor":{"tiempo":45,"sancion":"Sin Descuento"},
      "Retardo Mayor":{"tiempo":60,"sancion":"Sin Descuento"}
    },
    "Alimentos":{
      "tiempoAlimentos":60,
      "Tolerancia":{"tiempo":0,"sancion":"Sin Descuento"},
    }
  };  
    var DataDays = Days.findOne({"idEmployee": _idEmployee});
    if (DataDays != undefined) {
      var idHorario = DataDays.idHorario;
      if (idHorario != undefined) {
        var DataHorarios = Horarios.findOne({"_id": idHorario});
        if (DataHorarios != undefined) {
          resultado["Horarios"] = {
            "lunes": DataHorarios.lunes,
            "martes": DataHorarios.martes,
            "miercoles": DataHorarios.miercoles,
            "jueves": DataHorarios.jueves,
            "viernes": DataHorarios.viernes,
            "sabado": DataHorarios.sabado,
            "domingo": DataHorarios.domingo
          };
          var retardo = DataHorarios.retardos;
          var comidas = DataHorarios.comidas;
          if (retardo != undefined) {
            var DataReglaRetardos = Reglas_retardos.findOne({"_id": retardo});
            if (DataReglaRetardos != undefined) {
              var ArrayTolerancia = DataReglaRetardos.tolerancia;
              var objAsistencias = {};
              for (var i = 0; i < ArrayTolerancia.length; i++) {
                var ObjSancion = ArrayTolerancia[i];
                if (ObjSancion != undefined) {
                  var sancion = ObjSancion["sancion"];
                  var DataSanciones = Sanciones.findOne({"_id": sancion});
                  if (DataSanciones != undefined) {
                    var ArraySanciones = DataSanciones.descuento;
                    objAsistencias[ObjSancion["status"]]={
                      "tiempo":ObjSancion["tiempo"],
                      "sancion":ArraySanciones
                    }
                  }
                }
              }
              resultado["Asistencias"] = objAsistencias;
            }
          }
          if (comidas != undefined) {
            var DataReglaAlimentos = Reglas_alimentos.findOne({"_id": comidas});
            if (DataReglaAlimentos != undefined) {
              var tiempoAlimentos = DataReglaAlimentos.tiempo_consumo;
              var ArrayAlimentos = DataReglaAlimentos.tolerancia;
              var objAlimentos = {};
              objAlimentos["tiempoAlimentos"]=tiempoAlimentos;
              if(ArrayAlimentos!=undefined){
                for (var i = 0; i < ArrayAlimentos.length; i++) {
                  var ObjSancion = ArrayAlimentos[i];
                  if (ObjSancion != undefined) {
                    var sancion = ObjSancion["sancion"];
                    var DataSanciones = Sanciones.findOne({"_id": sancion});
                    if (DataSanciones != undefined) {
                      var ArraySanciones = DataSanciones.descuento;
                      objAlimentos[ObjSancion["status"]]={
                        "tiempo":ObjSancion["tiempo"],
                        "sancion":ArraySanciones
                      }
                    }
                  }
                }
              }
              resultado["Alimentos"] = objAlimentos;
            }
          }
        }
      }
    }
    return resultado;
  }
