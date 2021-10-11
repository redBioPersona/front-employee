if(Meteor.isClient){
Template.tabularFilter.rendered = function(){
  Session.set('fechaInicio', undefined);
  Session.set('fechaFin', undefined);
  
  if (Session.get('fechaInicio')===undefined) {
    var dfIniDefault = moment().subtract({months:1}).format('DD/MM/YYYY');     
    Session.set('fechaInicio', dfIniDefault);
    $('#fechaInicio').val(dfIniDefault);
  }

  if (Session.get('fechaFin')===undefined) {
    var dfFinDefault = moment().format('DD/MM/YYYY');
    Session.set('fechaFin', dfFinDefault);
    $('#fechaFin').val(dfFinDefault);
  }

  if (Session.get('fechaFin')!==undefined && Session.get('fechaInicio')!==undefined) {
    var inicio = Session.get('fechaInicio');
    var fin = Session.get('fechaFin');
    $('#fechaFin').val(fin);
    $('#fechaInicio').val(inicio);
  }
}
Template.tabularFilter.events({
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
    var fechaInicio=$('#fechaInicio')[0].value.split("/");
    var fechaFin=$('#fechaFin')[0].value.split("/");
    fechaInicio=fechaInicio[2]+"-"+fechaInicio[1]+"-"+fechaInicio[0];
    fechaFin   =fechaFin[2]+"-"+fechaFin[1]+"-"+fechaFin[0];

    var resInicial = moment(fechaInicio).hours(0).minutes(0).seconds(0).format('YYYY-MM-DD');
    var resFinal = moment(fechaFin).hours(24).minutes(0).seconds(0).format('YYYY-MM-DD');
    
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
       Session.set('fechaInicio',  moment(resInicial).toDate());
       Session.set('fechaFin', moment(resFinal).toDate());
     }else{
       sAlert.error('La fecha inicial debe ser menor o igual a la final');
     }

  }
});
}
