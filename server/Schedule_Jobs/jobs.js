if (Meteor.isServer) {
    var schedule = require('node-schedule');
    const Fibers = require('fibers');

    // *    *    *    *    *    *
    // ┬    ┬    ┬    ┬    ┬    ┬
    // │    │    │    │    │    │
    // │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    // │    │    │    │    └───── month (1 - 12)
    // │    │    │    └────────── day of month (1 - 31)
    // │    │    └─────────────── hour (0 - 23)
    // │    └──────────────────── minute (0 - 59)
    // └───────────────────────── second (0 - 59, OPTIONAL)

    Meteor.startup(function() {
        var algo=Sensors.findOne();
        if(algo!=undefined){
         var _id=algo._id;
           Sensors.direct.update({_id:_id}, {$set:{ "SyncService":false}},function(err,res){
             if(err){
               logErrores.info("SyncService "+err);
             }
           });
        }
        var fiber = Fibers.current;

        var g = schedule.scheduleJob('15 22 * * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              Meteor.call("CleanSyncFromTotems");
            }
          }).run();
        });

        var gxc = schedule.scheduleJob('0 12 1 * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              var Inicio=moment().subtract(2, "months").format('YYYY-MM-DD');
              var Fin=moment().subtract(1, "months").format('YYYY-MM-DD');
              Meteor.call("LimpiarNotificaciones",Inicio,Fin);
            }
          }).run();
        });
        
        var jx = schedule.scheduleJob('30 23 * * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              var Inicio=moment().subtract(3, "days").format('YYYY-MM-DD');
              var Fin=moment().format('YYYY-MM-DD');
              Meteor.call("EvitarReportesDuplicadosPorEmpleado",Inicio,Fin);
            }
          }).run();
        });

        var evitarAccessCtrlDup = schedule.scheduleJob('0 9 * * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              var Inicio=moment().subtract(2, "days").format('YYYY-MM-DD');
              var Fin=moment().format('YYYY-MM-DD');
              Meteor.call("EvitarAccessCtrlDuplicadosPorEmpleado",Inicio,Fin);
            }
          }).run();
        });


        var g = schedule.scheduleJob('30 5 * * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              Meteor.call("CleanSyncFromTotems");
            }
          }).run();
        });


        var j = schedule.scheduleJob('1 4 * * *', function(){
          Fibers(function(){
            logReport.info("Limpiando los dias feriados");
            Meteor.call("CleanFeriadosReports");
          }).run();
        });

        var h = schedule.scheduleJob('0 23 * * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              logReport.info("Buscando imagenes por cargar...");
              Meteor.call("FindImgToWS");
            }            
          }).run();
        });

        var hcf = schedule.scheduleJob('0 23 * * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              var Inicio=moment().subtract(1, "days").format('YYYY-MM-DD');
              Meteor.call("EliminarFaltasDespuesBajaDefinitiva",Inicio);
            }            
          }).run();
        });
        

        var rebuildFingerTemplates = schedule.scheduleJob('0 12 * * 7', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":false});
            if(isStation!=undefined){
              logReport.info("Buscando campios enFingerTemplates");
              Meteor.call("RebuildTemplates");
            }            
          }).run();
        });
        
        var hx = schedule.scheduleJob('0 21 * * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              var Inicio=moment().subtract(5, "days").format('YYYY-MM-DD');
              var Fin=moment().subtract(5, "days").format('YYYY-MM-DD');
              Meteor.call("SinReporteConAccessCtrl",Inicio,Fin);
            }            
          }).run();
        });

        var j = schedule.scheduleJob('1 1 1 * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              var Inicio=moment().subtract(1, "months").format('YYYY-MM-DD');
              var Fin=moment().format('YYYY-MM-DD');
              logReport.info("Buscando muchas faltas del "+Inicio+"-"+Fin);
              Meteor.call("buscaMuchasFaltas",Inicio,Fin,10,undefined);
            }
          }).run();
        });

        var j = schedule.scheduleJob('1 5 * * 1,3,5', function(){
          Fibers(function(){
            var Inicio=moment().subtract(5,"days").format('YYYY-MM-DD');
            var Fin=moment().subtract(1, "days").format('YYYY-MM-DD');
            logReport.info("Buscando faltas FalsasPositivas "+Inicio+" - "+Fin);
            Meteor.call("FalsoPositivoReportes",Inicio,Fin);
          }).run();
        });

        var j = schedule.scheduleJob('1 3 * * *', function(){
          Fibers(function(){
            var Inicio=moment().subtract(2, "days").format('YYYY-MM-DD');
            var Fin=moment().subtract(1, "days").format('YYYY-MM-DD');
            logReport.info("Simulando Reportes "+Inicio+"-"+Fin);
            Meteor.call("SimulaReports",Inicio,Fin,undefined,true,undefined);
          }).run();
        });

        var j = schedule.scheduleJob('1 2 * * *', function(){
          Fibers(function(){
            var Inicio=moment().subtract(1, "days").format('YYYY-MM-DD');
            var Fin=moment().subtract(1, "days").format('YYYY-MM-DD');
            logReport.info("LLenando tickets..");
            Meteor.call("llenado_tickets",Inicio,Fin);
          }).run();
        });

        var j = schedule.scheduleJob('30 1 * * *', function(){
          Fibers(function(){
            var Inicio=moment().subtract(1, "days").format('YYYY-MM-DD');
            var Fin=moment().subtract(1, "days").format('YYYY-MM-DD');
            logReport.info("LLenando MealTimes...");
            Meteor.call("llenado_MealTimes",Inicio,Fin);
          }).run();
        });

        var j = schedule.scheduleJob('1 1 * * *', function(){
          Fibers(function(){
            var isStation=Config_application.findOne({"isServer":true});
            if(isStation!=undefined){
              logReport.info("LLenando AniversariosCumple");
              Meteor.call("AniversariosCumple");
            }
          }).run();
        });

        var cleaning = schedule.scheduleJob('1 22 * * *', function(){
          Fibers(function(){
            logReport.info("Limpiando DB...");
            Meteor.call("limpieza_db");
          }).run();
        });

        var cleaning = schedule.scheduleJob('1 5 * * *', function(){
          Fibers(function(){
            var Inicio = moment().subtract(1, 'months').format('YYYY-MM-DD');
            var Fin = moment().format('YYYY-MM-DD');
            logReport.info("Contadores "+Inicio+"-"+Fin);
            Meteor.call("GetPersonalized",undefined,Inicio,Fin);
            Meteor.call("GetDepartamentos",undefined,Inicio,Fin);
            Meteor.call("GetExtraTiempo",undefined,Inicio,Fin);
          }).run();
        });

        var cleaning = schedule.scheduleJob('30 22 * * *', function(){
          Fibers(function(){
            var Inicio = moment().subtract(1, 'months').format('YYYY-MM-DD');
            var Fin = moment().format('YYYY-MM-DD');
            logReport.info("Contando registros por usuario...");
            Meteor.call("GetCountUser",undefined,Inicio,Fin);
          }).run();
        });


    });
}
