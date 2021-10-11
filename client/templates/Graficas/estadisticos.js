import {Meteor} from 'meteor/meteor';
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
  Template.orionMaterializeCollectionsIndex_GXP.rendered=function(){
    Tracker.autorun(function() {
      dibuja_grafica_gral();
    });
  };

  Template.orionMaterializeCollectionsIndex_GXP.helpers({
    GetColorIconBack:function(){
      return GetColorIconBack();
    }
  });

  dibuja_grafica_gral=function(){
    var grafica_general = document.getElementById('grafica_general');
    var color=GetColorGraphic();
    var myChart = echarts.init(grafica_general, color);
    myChart.showLoading('default', {
    text: 'cargando...',
    color: '#c23531',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  });
    var datos=generarSerieGeneral();
    option = {
      title : {},
      tooltip : { trigger: 'axis' },
      toolbox: {
        show : true,
        y: 'top',
        x:'right',
        feature : {
          mark : {show: true},
          dataView : {show: true, title: 'Datos',readOnly: true,lang: ['Datos', 'Salir', 'Actualizar'],
          optionToContent: function(opt) {
            var series = opt.series;
            var tables = '';
            for (var ii = 0; ii < series.length; ii++) {
                var axisData = series[ii].data;
                tables += '<table class="bordered"><tbody><tr>';
                tables += '<td></td><td>' + series[ii].name + '</td>';
                tables += '</tr>';
                for (var i = 0; i < axisData.length; i++) {
                    tables += '<tr>'
                             + '<td>' + axisData[i].name + '</td>';
                    tables += '<td>' + axisData[i].value + '</td>';
                    tables += '</tr>';
                }
                tables += '</tbody></table><br/>';
            }
            return tables;
          }},
          magicType : {show: true, title: { line: 'Lineal',bar: 'Barras',stack:'Apilar', tiled:'Desapilar'},type: ['line', 'bar', 'stack', 'tiled']},
          restore : {show: true,title:'Recargar'},
          saveAsImage : {show: true,title: 'Descargar'}
        }
      },
      calculable : true,
      legend: {orient: 'horizontal', y:'bottom',data:[]},
      xAxis : [ { type : 'category', splitLine : {show : false}, data : [] } ],
      yAxis : [ { type : 'value', position: 'right' } ],
      series : []
    };
    option.title=datos.title;
    option.legend.data=datos.legend;
    option.xAxis[0].data=datos.xAxis;
    option.series=datos.series;
    myChart.hideLoading();
    myChart.setOption(option);
    window.onresize = function() {
      myChart.resize();
    };
  }

  function generarSerieGeneral(){
    var fechaInicio=Session.get('fechaInicio');
    var fechaFin=Session.get('fechaFin');
    var estatus_reports=Session.get('estatus_reports');
    var idLocation=Session.get("location_report");
    var department_report=Session.get("department_report");
    var company_report=Session.get("company_report");
    var radio_excepcion=Session.get("radio_excepcion");

    var faltas=  Reports.find({estatus:'Falta','createdAt':{$gte : fechaInicio, $lt: fechaFin }}).count();
    var retardos=  Reports.find({$or:[{estatus:'Retardo'},{estatus:'Retardo Mayor'}],'createdAt':{$gte : fechaInicio, $lt: fechaFin }}).count();
    var excepciones=  Reports.find({excepcion:'Si','createdAt':{$gte : fechaInicio, $lt: fechaFin }}).count();
    var anticipadas=  Reports.find({antes:true,'createdAt':{$gte : fechaInicio, $lt: fechaFin }}).count();


    var result={
      title : {
        text: 'Vangent Mexico',
        subtext: 'Registros con retardos'
      },
      legend:['cero','uno','dos','tres','Porcentajes','faltas','retardos','anticipadas','excepciones'],
      xAxis : ['data1','data2','data3','data4','data5','data6','data7'],
      series : [
        {
          name:'cero',
          type:'bar',
          data:[320, 332, 301, 334, 390, 330, 320]
        },
        {
          name:'uno',
          type:'bar',
          tooltip : {trigger: 'item'},
          data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
          name:'dos',
          type:'bar',
          tooltip : {trigger: 'item'},
          data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
          name:'tres',
          type:'bar',
          tooltip : {trigger: 'item'},
          data:[150, 232, 201, 154, 190, 330, 410]
        },
        {
          name:'Porcentajes',
          type:'pie',
          tooltip : {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          center: [160,130],
          radius : [0, 50],
          itemStyle :　{
            normal : {
              labelLine : {
                length : 20
              }
            }
          },
          data:[
            {value:faltas, name:'faltas'},
            {value:retardos, name:'retardos'},
            {value:anticipadas, name:'anticipadas'},
            {value:excepciones, name:'excepciones'}
          ]
        }
      ]
    };
    return result;
  }
 getSelectValues= function(select) {
    var result = [];
    var options = select && select.options;
    var opt;
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }
}
