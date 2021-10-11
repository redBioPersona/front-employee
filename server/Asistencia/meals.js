insertMealTime=function(idEmployee, CanPrint, PersonFound,FromSync) {
  var idcompany=PersonFound.idcompany;
  var employeeName=PersonFound.employeeName;
  // insertMealTime=function(idEmployee, CanPrint, idcompany,employeeName,FromSync) {
  // insertMealTime(_id, flag, PersonFound,false);

  var ahora=moment();
  var today = moment(ahora).format('DD/MM/YYYY');
  var todayHr = moment(ahora).format('HH:mm');
  var FullHorario = getHorario(idEmployee);
  //var FullHorario = Horariox.findOne({"idEmployee":idEmployee}).horario;
  var TheHorario=FullHorario["Horarios"];
  var TheHorarioAlimentos=FullHorario["Alimentos"];
  logAccesos.info("Horario del empleado "+JSON.stringify(FullHorario));
  if (TheHorario!=undefined) {
    var DataAccessCtrl = Accesscontrol.findOne({'idEmployee': idEmployee,"createdDate":today},{fields: {idEmployee: 1,firstAccess: 1,lastAccess: 1}});
    if(DataAccessCtrl){
      var _idAccessCtrl = DataAccessCtrl._id;
    var _entro = DataAccessCtrl.firstAccess;
    var _salio= DataAccessCtrl.lastAccess;
    var fechaSem = moment(_entro).format("dddd");
    fechaSem = fechaSem.replace(/á/gi,"a");
    fechaSem = fechaSem.replace(/é/gi,"e");
    fechaSem = fechaSem.replace(/í/gi,"i");
    fechaSem = fechaSem.replace(/ó/gi,"o");
    fechaSem = fechaSem.replace(/ú/gi,"u");
    var existDayintoJournal=TheHorario[fechaSem];
    if (existDayintoJournal!=undefined) {
      var comidaInicio=existDayintoJournal["ComidaInicio"];
      var comidaFin=existDayintoJournal["ComidaFin"];

      if(comidaInicio!=undefined && comidaFin!=undefined){
        logAccesos.info("Horario de alimentos, dia "+fechaSem+" es "+comidaInicio+" a "+comidaFin);
        var comidaInicioTiempo=comidaInicio.split(":");
        var comidaFinTiempo=comidaFin.split(":");
        var entro=_entro;
        entro.setHours(comidaInicioTiempo[0]);
        entro.setMinutes(comidaInicioTiempo[1]);
        entro.setSeconds(0);

        var salio;
        if(_salio==undefined || _salio==null){
          log.error("Indefinido "+_idAccessCtrl);
          salio=_entro;
        }else{
          salio=_salio;
        }
        salio.setHours(comidaFinTiempo[0]);
        salio.setMinutes(comidaFinTiempo[1]);
        salio.setSeconds(0);

        var busqueda={
          $and:[
            {idEmployee:idEmployee},
            {createdAt:{$gte:entro}},
            {createdAt:{$lte:salio}}
          ]
        };
        logAccesos.info("Accessdetails search "+JSON.stringify(busqueda));
        var DataAccessDetailsMeals = Accessdetails.find(busqueda,{fields:{"createdAt":1},limit:2}).fetch();
        logAccesos.info("DataAccessDetailsMeals "+JSON.stringify(DataAccessDetailsMeals)+" length "+DataAccessDetailsMeals.length);
        if(DataAccessDetailsMeals.length>0){
          var continua=false;
          if(moment(todayHr,"HH:mm").isSame(moment(comidaInicio,"HH:mm")) ||
            moment(todayHr,"HH:mm").isSame(moment(comidaFin,"HH:mm"))){
            continua=true;
          }else{
            if(moment(todayHr,"HH:mm").isBetween(moment(comidaInicio,"HH:mm"),moment(comidaFin,"HH:mm"))){
              continua=true;
            }
          }
          if(continua){

            if(!FromSync){
              if (CanPrint) {
                insertMealTimeTicket(idEmployee,idcompany,employeeName);
              }else{
                logAccesos.info("No se acepta impresión");
              }
            }else{
              logAccesos.info("No se acepta impresión fromSync");
            } 
            
            var excepcion="No";
            var minutos_permitidos=60;
            var _primerRegistroComida= DataAccessDetailsMeals[0].createdAt;
            var primerRegistro=moment(_primerRegistroComida).format("HH:mm")
            var _ultimoRegistroComida= DataAccessDetailsMeals[DataAccessDetailsMeals.length-1].createdAt;
            var ultimoRegistro=moment(_ultimoRegistroComida).format("HH:mm");
            logAccesos.info("getTiempo "+_primerRegistroComida+" y "+_ultimoRegistroComida)
            var horas = getTiempo(_primerRegistroComida, _ultimoRegistroComida).toString();
            var fecha = moment(_entro).format("DD/MM/YYYY");
            if(primerRegistro ==ultimoRegistro){excepcion="Si"}
            if(TheHorarioAlimentos!=undefined){
              var minperm=TheHorarioAlimentos["tiempoAlimentos"];
              if(minperm!=undefined){
                minutos_permitidos=parseInt(minperm)
              }
            }

            var DataE = PersonFound;
            var resultado = {
              _idEmployee: idEmployee,
              idEmployee: parseInt(DataE.idEmployee),
              employeeName:  DataE.employeeName,
              fecha: fecha,
              primerRegistro:primerRegistro,
              inicioOficial:comidaInicio,
              salidaOficial:comidaFin,
              ultimoRegistro:ultimoRegistro,
              excepcion:excepcion,
              minutos_permitidos:minutos_permitidos,
              idcompany:DataE.idcompany,
              fechaIni:_primerRegistroComida,
              fechaFin:_ultimoRegistroComida
            };
            if(horas!="-" && horas!=undefined && horas!=null){
              resultado["horas"]=horas.split(":")[0];
              resultado["minutos"]=horas.split(":")[1];
              var tiempo_transcurrido=parseInt(horas.split(":")[0]*60)+parseInt(horas.split(":")[1]);
              var estatus=GenerateMealTimes_getEstatus(tiempo_transcurrido,minutos_permitidos,TheHorarioAlimentos);
              resultado["estatus"]=estatus[0];
              resultado["sancion"]=estatus[1];
            }

            

            var exMT=Meal_times.findOne({_idEmployee:idEmployee,fecha:fecha},{fields:{"_id":1}});
            if(exMT==undefined){
                  logAccesos.info("Insertando en Meal Times :"+JSON.stringify(resultado));
                  Meal_times.direct.insert(resultado,function(err,res){
                    if(err){
                      logErrores.info("Err Meal_times "+err);
                    }
                    if(res){
                      resultado["_id"]=res;
                      if(!FromSync){
                        insertaSync(resultado, "meal_times", 'insert');
                      }
                    }
                  });
            }else{
              Meal_times.update({_id:exMT._id}, {$set:{
                  ultimoRegistro:ultimoRegistro,
                  excepcion:excepcion,
                  horas:horas.split(":")[0],
                  minutos:horas.split(":")[1],
                  estatus:estatus[0],
                  sancion:estatus[1]
              }},function(err,res){
                if(err){
                  logErrores.info("Err al Actualizar Meal Times "+err);
                }
                if(res){
                  if(!FromSync){
                    var obj={
                      _id:exMT._id,
                      ultimoRegistro:ultimoRegistro,
                      excepcion:excepcion,
                      horas:horas.split(":")[0],
                      minutos:horas.split(":")[1],
                      estatus:estatus[0],
                      sancion:estatus[1]
                    };
                    insertaSync(obj, 'meal_times', 'update');
                  }
                }
              });
            }

                       
          }else{
            logAccesos.info("La hora actual "+todayHr+" no esta entre el horario de comida");
          }
        }else{
          logAccesos.info("No se encontro AccessDetails  con datos "+JSON.stringify(busqueda));
        }
      }
      }
    }
  }
}


insertMealTimeTicket=function(idEmployee,idcompany,employeeName) {
  Print_ticket.remove({});
  var fecha = moment().format('DD/MM/YYYY');
  var filtro_ticket={
    $and:[
      {createdDate:fecha},
      {idEmployee:idEmployee}
    ]
  };
  logAccesos.info("Buscando en accessControl "+JSON.stringify(filtro_ticket));
  var filtro_ticket_list = Accesscontrol.findOne(filtro_ticket,{fields:{"meal":1}});
  if (filtro_ticket_list!=undefined) {
    var MealFiltroTicket=filtro_ticket_list.meal;
    logAccesos.info("Alimentos "+JSON.stringify(filtro_ticket_list));
    switch(MealFiltroTicket){
      case "true":
        logAccesos.info("El usuario :" + idEmployee + " ya pidio ticket, dia " + fecha);
      break;
      case "no":
        logAccesos.info("El usuario :" + idEmployee + " no desea imprimir ticket, dia " + fecha);
      break;
      default:
        var ticket={
          "idEmployee":idEmployee,
          "idCompany":idcompany,
          "employeeName":employeeName,
          "active":true,
          "date":new Date()
        }
        Print_ticket.insert(ticket,function(err,res){
          if(err){logErrores.info("Print_ticket "+err);}
        });
        try { SendToVerificationWindow('{"estatus":"Imprimir"}');} catch (e) { }
        logAccesos.info("Print_ticket insertado !");
      break;
    }
  }
}
