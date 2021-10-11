GetPasswordFromMail=function(mail){
    var result="pancholopez";
    if(mail!=undefined){
      var algo=mail.indexOf("@");
      if(algo!=-1){
        result=mail.substring(0,algo);
      }
    }
    return result
  }

esNumero=function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

esBooleano=function(n) {
  var result=false;
  if(n==true || n=="TRUE" || n=="SI"|| n=="si" || n=="true"){
    result=true;
  }
  return result;
}

fileExtension = function(filename) {
  var path = require('path');
  var ext = path.extname(filename);
  return ext;
}

GeBooleano=function(val){
  var result="-";
  if(val){
    result="Si";
  }else{
    result="No";
  }
  return result;
}

ValidateRolesToArray=function(val){
  var resultado=undefined;
  try {
    switch (val) {
      case "Usuario":
        return ["Usuario"];
      break;
      case "Usuario Administrador":
        return ["Usuario Administrador"];
      break;
      case "Supervisor":
        return ["Supervisor"];
      break;
    } 
  } catch (error) {
    
  }
  return resultado;
}

ValidateStringToDate = function (val) {
  try {
    var vals = val.split("/");
    if (vals.length == 3) {
      var dia = vals[0];
      var mes = vals[1];
      var anio = vals[2];
      var fecha = anio + "-" + mes + "-" + dia;
      var InicioIsValid = moment(fecha, 'YYYY-MM-DD', true).isValid();
      if (InicioIsValid) {
        var retorno=moment(fecha + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
        return retorno;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
}

ValidateStringToBoolean = function (val) {
  var result=false;
  switch (val) {
    case "Si":
    case "SI":
    case "Sí":
    case "SÍ":
    case "true":
    case true:
    case "True":
    case "si":
    case "sí":
    case "TRUE":
        result=true;
    break;
  }
  return result;
}

GetcompanyName=function(val){
	var result="";
  var data = Companies.findOne({ _id: val },{fields:{"companyName":1}});
	if(data!=undefined){
		result=data.companyName;
	}
	return result;
}

isCompanymeal=function(val){
  var result=[];
  result[0]=false;
  result[1]=false;
  var data = Companies.findOne({ _id: {$in:val} },{fields:{"meal":1,"meal_ticket":1}});
	if(data!=undefined){
		if(data.meal!=undefined){
        result[0]=data.meal;
    }
    if(data.meal_ticket!=undefined){
        result[1]=data.meal_ticket;
    }
	}
	return result;
}

GetempPosName=function(val){
	var result="";
  var data = Employeespositions.findOne({ _id: val },{fields:{"empPosName":1}});
	if(data!=undefined){
		result=data.empPosName;
	}
	return result;
}

GetAnticipado=function(val){
  var result="-";
  if(val=="false"){
    result="No"
  }else if(val=="true"){
    result="Si";
  }
  return result;
}

setDateZero=function(date) {
return date < 10 ? '0' + date : date;
}

GetDepartmentName= function(_id) {
   var result="";
   var data=Persons.findOne({"_id":_id},{fields:{"_id":1,"idDepartment":1}});
   if(data!=undefined){
     var _idDepto=data.idDepartment;
     if(_idDepto!=undefined){
       var datas=Departments.findOne({"_id":_idDepto},{fields:{"_id":1,"departmentName":1}});
       if(datas!=undefined){
         result=datas.departmentName;
       }
     }
   }
   return result;
 }

 GetDeptoName= function(_id) {
    var result="";
    var datas=Departments.findOne({"_id":_id},{fields:{"_id":1,"departmentName":1}});
    if(datas!=undefined){
      result=datas.departmentName;
    }
    return result;
  }

  GetidDevice= function(_id) {
    var result="Dactilar";
    switch (_id.toLowerCase()) {
      case "facial":
        result="Facial";
      break;
      case "dactilar":
        result="Dactilar";
      break;
      case "mobile":
        result="Móvil";
      break;
      default:
          result="Dactilar";
        break;
    }
    return result;
  }
  
  GetMyLocationName=function(_id){
    var result="";
    var datas=Locations.findOne({"_id":_id},{fields:{"_id":1,"locationName":1}});
    if(datas!=undefined){
      result=datas.locationName;
    }
    return result;
  }

  GetCheckLocationName=function(_id){
    var result="";
    var datas=LocationsReg.findOne({"_id":_id});
    if(datas!=undefined){
      result=datas.name;
    }
    return result;
  }


  GetMyPagadoraName=function(_id){
    var result="";
    var datas=Pagadoras.findOne({"_id":_id},{fields:{"_id":1,"pagadoraName":1}});
    if(datas!=undefined){
      result=datas.pagadoraName;
    }
    return result;
  }


 GetLocationName=function(_id){
   var result="";
   var data=Persons.findOne({"_id":_id},{fields:{"_id":1,"idLocation":1}});
   if(data!=undefined){
     var _idLocation=data.idLocation;
     if(_idLocation!=undefined){
       var datas=Locations.findOne({"_id":_idLocation},{fields:{"_id":1,"locationName":1}});
       if(datas!=undefined){
         result=datas.locationName;
       }
     }
   }
   return result;
 }

getEstatusP=function(ingreso){
    var resultado="-";
    if (ingreso instanceof Date) {
        var entro= moment(ingreso).format("HH:mm");
        var oficial = "08:00";
        var _entro=parseInt(entro.split(":")[0]*60)+parseInt(entro.split(":")[1]);
        var _oficial=parseInt(oficial.split(":")[0]*60)+parseInt(oficial.split(":")[1]);
        if(_entro<_oficial){
            resultado="Normal";
        }else if(_entro>_oficial){
            var diferencia=_entro-_oficial;
            if(diferencia<=15){
                resultado="Normal";
            }else if(diferencia<=30){
                resultado="Retardo Normal";
            }else if(diferencia<=45){
                resultado="Retardo Menor";
            }else{
                resultado="Retardo Mayor";
            }
        }
    }
    return resultado;
}

generateId = function () {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

getEstatus=function(tiempo){
    var resultado="-";
    if(tiempo<=60){
        resultado="Normal";
    }else if(tiempo<=70){
        resultado="Retardo Normal";
    }else if(tiempo<=85){
        resultado="Retardo Menor";
    }else{
        resultado="Retardo Mayor";
    }
    return resultado;
}

ModifySearchingdate=function(fechaInicio,fechaFin){
    var data=Searchingdate.findOne();
    if(data==undefined){
        var ServerInicio=new Date();
        var mes=fechaInicio.getMonth();
        ServerInicio.setMonth(mes-1);

        Searchingdate.insert({
            "SearchClientfechaInicio":fechaInicio,
            "SearchClientfechaFin":fechaFin ,
            "SearchServerfechaInicio":ServerInicio,
            "SearchServerfechaFin": fechaFin
        });
    }else{
        var datas=Searchingdate.findOne();
        var SearchServerfechaInicio=datas.SearchServerfechaInicio;
        var SearchServerfechaFin=datas.SearchServerfechaFin;
        if(SearchServerfechaInicio>fechaInicio){
            var _id=datas._id;
            Searchingdate.update({_id:_id}, {$set:{ "SearchServerfechaInicio":fechaInicio }});
        }
    }
}

GetSearchingdate=function(){
    var data=Searchingdate.findOne();
    var result=[];
    if(data!=undefined){
        result[0]=data.SearchClientfechaInicio;
        result[1]=data.SearchClientfechaFin;
        result[2]=data.SearchServerfechaInicio;
        result[3]=data.SearchServerfechaFin;
    }else{
        var ServerFin=new Date();

        var ServerInicio=new Date();
        var ServerMes=ServerInicio.getMonth();
        ServerInicio.setMonth(ServerMes-2);
        ServerInicio.setHours(24);
        ServerInicio.setMinutes(0);
        ServerInicio.setSeconds(0);

        var ClientInicio=new Date();
        var ClientMes=ClientInicio.getMonth();
        ClientInicio.setMonth(ClientMes-1);
        ClientInicio.setHours(0);
        ClientInicio.setMinutes(0);
        ClientInicio.setSeconds(0);


        var ClientFin=new Date();

        result[0]=ClientInicio;
        result[1]=ClientFin;
        result[2]=ServerInicio;
        result[3]=ServerFin;
    }
    return result;
}


getSancion=function(ingreso){
    var resultado="";
    if (ingreso instanceof Date) {
        var entro= moment(ingreso).format("HH:mm");
        var oficial = "08:00";
        var _entro=parseInt(entro.split(":")[0]*60)+parseInt(entro.split(":")[1]);
        var _oficial=parseInt(oficial.split(":")[0]*60)+parseInt(oficial.split(":")[1]);
         if(_entro>_oficial){
            resultado="Sin Descuento";
        }
    }
    return resultado;
}

getAntes=function(exit){
    var resultado="-";
    if (exit instanceof Date) {
        var salio= moment(exit).format("HH:mm");
        var oficial = "18:00";
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

crearExtraTime=function(inicioOficial,salidaOficial,primerRegistro,ultimoRegistro){
  var resultado=false;
  if(inicioOficial && salidaOficial && primerRegistro && ultimoRegistro){
    var EntradaOficial=parseInt(inicioOficial.split(":")[0]*60)+parseInt(inicioOficial.split(":")[1]);
    var SalidaOficial =parseInt(salidaOficial.split(":")[0]*60)+parseInt(salidaOficial.split(":")[1]);
    var TiempoOficial=SalidaOficial-EntradaOficial+30;
    var PrimerAcceso=parseInt(primerRegistro.split(":")[0]*60)+parseInt(primerRegistro.split(":")[1]);
    var UltimoAcceso=parseInt(ultimoRegistro.split(":")[0]*60)+parseInt(ultimoRegistro.split(":")[1]);
    var TiempoAcceso=UltimoAcceso-PrimerAcceso;
    if(TiempoAcceso>=TiempoOficial){
      resultado=true;
    }
  }  
  return resultado;
}

returnHours=function(inicioOficial,salidaOficial){
  var EntradaOficial=parseInt(inicioOficial.split(":")[0]*60)+parseInt(inicioOficial.split(":")[1]);
  var SalidaOficial =parseInt(salidaOficial.split(":")[0]*60)+parseInt(salidaOficial.split(":")[1]);
  var TimeOficial=SalidaOficial-EntradaOficial;

  var hours = Math.floor( TimeOficial / 60 );
  var minutes = Math.floor( TimeOficial % 60);

  minutes = minutes < 10 ? '0' + minutes : minutes;
  hours = hours < 10 ? '0' + hours : hours;
  var result = hours + ":" + minutes;
  return result;
}

getHoras = function(fechaInicio, fechaFin) {
    if (fechaFin instanceof Date) {
        var fecha1 = moment(fechaInicio);
        var fecha2 = moment(fechaFin);
        return fecha2.diff(fecha1, 'hours');
    } else {
        return '-'
    }
}

getTiempo = function(fechaInicio, fechaFin) {
    if (fechaFin instanceof Date) {
        var ms = moment(fechaFin, "DD/MM/YYYY HH:mm:ss").diff(moment(fechaInicio, "DD/MM/YYYY HH:mm:ss"));
        var d = moment.duration(ms);
        return moment.utc(moment(fechaFin, "DD/MM/YYYY HH:mm:ss").diff(moment(fechaInicio, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
    } else {
        return '-'
    }
}

getexcepcion=function (fecha1,fecha2){
    if (verificaId(fecha1) && verificaId(fecha2)) {
      return "No"
    } else {
      return "Si"
    }
  }


  	NumberToMes = function (number) {
  		var number = parseInt(number);
  		var mes;
  		switch (number) {
  			case 1:
  				mes = 'Enero';
  				break;
  			case 2:
  				mes = 'Febrero';
  				break;
  			case 3:
  				mes = 'Marzo';
  				break;
  			case 4:
  				mes = 'Abril';
  				break;
  			case 5:
  				mes = 'Mayo';
  				break;
  			case 6:
  				mes = 'Junio';
  				break;
  			case 7:
  				mes = 'Julio';
  				break;
  			case 8:
  				mes = 'Agosto';
  				break;
  			case 9:
  				mes = 'Septiembre';
  				break;
  			case 10:
  				mes = 'Octubre';
  				break;
  			case 11:
  				mes = 'Noviembre';
  				break;
  			case 12:
  				mes = 'Diciembre';
  				break;
  		}
  		return mes;
  	}
