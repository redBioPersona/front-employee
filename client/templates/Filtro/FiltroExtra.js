var echarts = require('echarts/lib/echarts');
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/lines';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/title';

if(Meteor.isClient){

Template.FiltroExtra.helpers({
  ultimaActualizacion:function(){
    var fecha=Sumados.findOne({"estatus" : "lastUpdateExtra"});
    if(fecha!=undefined){
      var mm=new moment(fecha.lastUpdate).format('hh:mm a');
      return mm;
    }else{
      return "Sin Información";
    }
  }
});

Template.FiltroExtra.rendered = function(){
  if(Session.get('fechaInicioExtra')===undefined){
    var dfIniDefaultX =moment().subtract(1, 'months').format('DD/MM/YYYY');
    $('#fechaInicio').val(dfIniDefaultX);
  }

  if(Session.get('fechaFinExtra')===undefined){
    var fFinDefault = moment().format('DD/MM/YYYY');
    $('#fechaFin').val(fFinDefault);
  }

  if (Session.get('fechaFinExtra')!==undefined && Session.get('fechaInicioExtra')!==undefined) {
    $('#fechaFin').val(Session.get('fechaFinExtra'));
    $('#fechaInicio').val(Session.get('fechaInicioExtra'));
  }


}
Template.FiltroExtra.events({
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
    var iniX=$('#fechaInicio')[0].value;
    var finX=$('#fechaFin')[0].value;

    var ini=iniX.split("/");
    var fin=finX.split("/");

    var Inicio=ini[2]+"-"+ini[1]+"-"+ini[0];
    var Fin=fin[2]+"-"+fin[1]+"-"+fin[0];

    var resInicial = moment(Inicio + "T12:00:00").format('YYYY-MM-DD');
    var resFinal = moment(Fin + "T12:00:00").format('YYYY-MM-DD');

    var InicialValida=moment(resInicial).isValid();
    var FinalValida=moment(resFinal).isValid();
    if(InicialValida && FinalValida){
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
        var difMonths=moment(Inicio + "T12:00:00").diff(moment(Fin + "T12:00:00"),'months');
        if(Math.abs(difMonths)>2){
          sAlert.error('El intervalo máximo entre las fechas es de 2 meses');
        }else{
        Session.set("fechaInicioExtra",iniX);
        Session.set("fechaFinExtra", finX);

        Meteor.call("GetExtraTiempo",Meteor.userId(),Inicio,Fin);

       var grafica2 = document.getElementById("grafica_extra_time");
        var grafica_principal_deptos = document.getElementById("grafica_deptos_extra_time");


        if(grafica_principal_deptos!=null && grafica_principal_deptos!=undefined){
          var myChart = echarts.init(grafica_principal_deptos);
          myChart.showLoading('default', {
           text: 'cargando...',
           color: '#c23531',
           textColor: '#000',
           maskColor: 'rgba(255, 255, 255, 0.8)',
           zlevel: 0
         });
         setTimeout(function () {
           myChart.hideLoading();
         }, 2000);
        }

        if(grafica2!=null && grafica2!=undefined){
          var myChart2 = echarts.init(grafica2);
          myChart2.showLoading('default', {
           text: 'cargando...',
           color: '#c23531',
           textColor: '#000',
           maskColor: 'rgba(255, 255, 255, 0.8)',
           zlevel: 0
         });
         setTimeout(function () {
           myChart2.hideLoading();
         }, 2000);
        }}
      }else{
        sAlert.error('La fecha inicial debe ser menor o igual a la final');
      }
    }else{
      sAlert.error('Alguna de las fechas es Invalida');
    }
  }
});
}
