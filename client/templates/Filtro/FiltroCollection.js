if(Meteor.isClient){
Template.FiltroCollection.rendered = function(){
  // var omar=$("#oculto")[0].value;
  // if (Session.get('fechaInicio'+omar)===undefined) {
  //   var dfIniDefault = moment().subtract(1, 'months').hours(0).minutes(0).seconds(0).toDate();
  //   var dfIniDefaultX = moment(dfIniDefault).format('YYYY-MM-DD');
  //   Session.set('fechaInicio'+omar, dfIniDefault);
  //   $('#fechaInicio').val(dfIniDefaultX);
  // }
  //
  // if (Session.get('fechaFin'+omar)===undefined) {
  //   var dfFinDefault = moment().hours(23).minutes(59).seconds(29).toDate();
  //   var fFinDefault = moment(dfFinDefault).format('YYYY-MM-DD');
  //   Session.set('fechaFin'+omar, dfFinDefault);
  //   $('#fechaFin').val(fFinDefault);
  // }
  //
  // if (Session.get('fechaFin'+omar)!==undefined && Session.get('fechaInicio'+omar)!==undefined) {
  //   var inicio = Session.get('fechaInicio'+omar).toISOString().substring(0,10);
  //   var fin = Session.get('fechaFin'+omar).toISOString().substring(0,10);
  //   $('#fechaFin').val(fin);
  //   $('#fechaInicio').val(inicio);
  // }
};

Template.FiltroCollection.events({
  'focus #fechaFin': function(e, template){
    var f2 = Template.instance().$('#fechaFin');
    f2.bootstrapMaterialDatePicker({
      lang:'es',
      format:'DD/MM/YYYY',
      time:false,
      nowButton:false,
      clearButton:false,
      okText:"Ok",
      cancelText:"Salir",
      currentDate:moment(),
      minDate:moment().subtract(5,'years'),
      maxDate:moment().add(1, 'days')
    });
  },
  'focus #fechaInicio': function(e, template){
    var f = Template.instance().$('#fechaInicio');
    f.bootstrapMaterialDatePicker({
      lang:'es',
      format:'DD/MM/YYYY',
      time:false,
      nowButton:false,
      clearButton:false,
      okText:"Ok",
      cancelText:"Salir",
      currentDate:moment(),
      minDate:moment().subtract(5,'years'),
      maxDate:moment()
    });
  },
  "click #SearchtabularFilter":function(){
    var omar=$("#oculto")[0].value;
    var ini=$('#fechaInicio')[0].value.split("/");
    var fin=$('#fechaFin')[0].value.split("/");
    var Inicio=ini[2]+"-"+ini[1]+"-"+ini[0];
    var Fin=fin[2]+"-"+fin[1]+"-"+fin[0];
    var resInicial = moment(Inicio + "T12:00:00").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD');
    var resFinal = moment(Fin + "T12:00:00").hours(23).minutes(0).seconds(0).format('YYYY-MM-DD');

     var isSame=moment(resInicial).isSame(resFinal);
     var insertar=false;
     if(isSame){
       insertar=true;
     }else{
       var isBefore=moment(resInicial).isBefore(resFinal);
       if(isBefore)
         insertar=true;
     }
     if(insertar){
        var difMonths=moment(Fin + "T12:00:00").diff(moment(Inicio + "T12:00:00"),'days');
        if(difMonths<=31){          
          Session.set('fechaInicio'+omar,  moment(resInicial).hours(0).minutes(0).seconds(0).toDate());
          Session.set('fechaFin'+omar, moment(resFinal).hours(23).minutes(0).seconds(0).toDate());
          if(omar=="reportsconcentrados"){
            var info=Meteor.users.findOne({_id:Meteor.userId()});
            if(info && info.profile && info.profile.idcompany){
              var company=info.profile.idcompany[0];
              Meteor.call("generarReporteConcentrado",resInicial,resFinal,company,undefined);
              sAlert.info('Recreando información...');
            }else{
              sAlert.info('Error al obtener sus datos');
            }
          }else{
            console.log("no "+omar);
          }          
        }else{
          sAlert.error('El Intervalo de tiempo es muy amplio, máximo 1 mes');
        }       
     }else{
       sAlert.error('La fecha inicial debe ser menor o igual a la final');
     }
  }
});
}
