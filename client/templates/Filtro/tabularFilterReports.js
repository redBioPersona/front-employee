if(Meteor.isClient){
Template.tabularFilterReports.rendered = function(){
  if (Session.get('fechaInicioReporte')===undefined) {
    var dfIniDefaultX =moment().subtract(1, 'months').format('DD/MM/YYYY');
    $('#fechaInicio').val(dfIniDefaultX);
  }
  if (Session.get('fechaFinReporte')===undefined) {
    var fFinDefault = moment().format('DD/MM/YYYY');
    $('#fechaFin').val(fFinDefault);
  }

  if (Session.get('fechaFinReporte')!==undefined && Session.get('fechaInicioReporte')!==undefined) {
    var fechaInicioReporte=Session.get('fechaInicioReporte');
    var fechaFinReporte=Session.get('fechaFinReporte');
    var fechaInicio=moment(fechaInicioReporte).format('DD/MM/YYYY');
    var fechaFin=moment(fechaFinReporte).format('DD/MM/YYYY');
    $('#fechaInicio').val(fechaInicio);
    $('#fechaFin').val(fechaFin);
  }

}
Template.tabularFilterReports.events({
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
  }
});
}
