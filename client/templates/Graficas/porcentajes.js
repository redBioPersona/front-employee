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
  Template.orionMaterializeCollectionsIndex_Porcentajes.rendered=function(){
    Tracker.autorun(function() {
      dibuja_grafica_porcentajes();
    });
  };
  Template.orionMaterializeCollectionsIndex_Porcentajes.helpers({
    GetColorIconBack:function(){
      return GetColorIconBack();
    }
  });

  dibuja_grafica_porcentajes=function(){
    var grafica_general = document.getElementById('grafica_procentajes');
    var color=GetColorGraphic();
    var myChart = echarts.init(grafica_general, color);
    //var datos=generarSerieGeneral();
    var labelTop = {
      normal : {
        label : {
          show : true,
          position : 'bottom',
          formatter: "{c} ({d}%)",
          // formatter : '{b}',
          textStyle: {
            baseline : 'bottom'
          }
        },
        labelLine : {
          show : false
        }
      }
    };
    var labelFromatter = {
      normal : {
        label : {
          formatter : function (params){
          //return 100 - params.value + '%'},
          textStyle: {baseline : 'top'}
        }
      }
    }
  }
    var labelBottom = {
      normal : {
        color: '#ccc',
        label : {
          show : true,
          position : 'center'
        },
        labelLine : {
          show : false
        }
      },
      emphasis: {
        color: 'rgba(0,0,0,0)'
      }
    };
    var radius = [40, 55];
    option = {
      legend: {
        x : 'center',
        y : 'center',
        data:['Tickets','Faltas','Excepciones','Anticipados','Retardos Norm.','Retardos Men.', 'Retardos May.','Retardos Comida','Permisos','Justificantes']
      },
      title : {
        text: 'Porcentajes Generales',
        x: 'center'
      },
      toolbox: {
        show : true,
        feature : {
          dataView : {
            show: true,
            title: 'Datos',
            readOnly: true,
            lang: ['Datos', 'Salir', 'Actualizar'],
          },
          saveAsImage: { show: true, title: 'Descargar' },
          restore : {show: true,title:'Recargar'},
          magicType : {
            show: true,
            type: ['pie', 'funnel'],
            option: {
              funnel: {
                width: '20%',
                height: '30%',
                itemStyle : {
                  normal : {
                    label : {
                      formatter : function (params){
                        return 'other\n' + params.value + '%\n'
                      },
                      textStyle: {
                        baseline : 'middle'
                      }
                    }
                  },
                }
              }
            }
          }
        }
      },
      series : [
        {
          type : 'pie',
          center : ['10%', '30%'],
          radius : radius,
          x: '0%',
          data : [
            {name:'Tickets', value:Session.get("CountTickets"),itemStyle :labelTop},
            {name:'Total', value:46, itemStyle :labelBottom }
          ]
        },
        {
          type : 'pie',
          center : ['30%', '30%'],
          radius : radius,
          x:'20%',
          data : [
            {name:'Faltas', value:Session.get("principal_faltas"), itemStyle :labelTop },
            {name:'Total', value:Session.get("TotalCountReports"),itemStyle :labelBottom }
          ]
        },
        {
          type : 'pie',
          center : ['50%', '30%'],
          radius : radius,
          x:'40%',
          data : [
            {name:'Excepciones', value:Session.get("principal_excepciones"), itemStyle : labelTop},
            {name:'Total', value:Session.get("TotalCountReports"),itemStyle : labelBottom}
          ]
        },
        {
          type : 'pie',
          center : ['70%', '30%'],
          radius : radius,
          x:'60%',
          data : [
            {name:'Anticipados', value:Session.get("principal_anticipadas"), itemStyle : labelTop},
            {name:'Total', value:Session.get("TotalCountReports"),itemStyle : labelBottom}
          ]
        },
        {
          type : 'pie',
          center : ['90%', '30%'],
          radius : radius,
          x:'80%',
          data : [
            {name:'Retardos Norm.', value:Session.get("TotalCountRetardoNormal"), itemStyle : labelTop},
            {name:'Total', value:Session.get("TotalCountReports"),itemStyle : labelBottom}
          ]
        },
        {
          type : 'pie',
          center : ['10%', '70%'],
          radius : radius,
          y: '55%',
          x: '0%',
          data : [
            {name:'Retardos Men.', value:Session.get("TotalCountRetardoMenor"), itemStyle : labelTop},
            {name:'Total', value:Session.get("TotalCountReports"),itemStyle : labelBottom}
          ]
        },
        {
          type : 'pie',
          center : ['30%', '70%'],
          radius : radius,
          y: '55%',
          x:'20%',
          data : [
            {name:'Retardos May.', value:Session.get("TotalCountRetardoMayor"), itemStyle : labelTop},
            {name:'Total', value:Session.get("TotalCountReports"),itemStyle : labelBottom}
          ]
        },
        {
          type : 'pie',
          center : ['50%', '70%'],
          radius : radius,
          y: '55%',
          x:'40%',
          data : [
            {name:'Retardos Comida', value:Session.get("CountMeal_times"), itemStyle : labelTop},
            {name:'Total', value:78,itemStyle : labelBottom}
          ]
        },
        {
          type : 'pie',
          center : ['70%', '70%'],
          radius : radius,
          y: '55%',
          x:'60%',
          data : [
            {name:'Permisos', value:Session.get("CountPermisos"), itemStyle : labelTop},
            {name:'Total', value:78,itemStyle : labelBottom}
          ]
        },
        {
          type : 'pie',
          center : ['90%', '70%'],
          radius : radius,
          y: '55%',
          x:'80%',
          //itemStyle : labelFromatter,
          data : [
            {name:'Total de Registros', value:78, itemStyle : labelBottom},
            {name:'Justificantes', value:Session.get("CountJustificantes"),itemStyle : labelTop}
          ]
        }
      ]
    };
    // option.title=datos.title;
    // option.legend.data=datos.legend;
    // option.xAxis[0].data=datos.xAxis;
    // option.series=datos.series;
    myChart.setOption(option);
    window.onresize = function() {
      myChart.resize();
    };
  }

  // function generarSerieGeneral(){
  //   var fechaInicio=Session.get('fechaInicio');
  //   var fechaFin=Session.get('fechaFin');
  //   var estatus_reports=Session.get('estatus_reports');
  //   var idLocation=Session.get("location_report");
  //   var department_report=Session.get("department_report");
  //   var company_report=Session.get("company_report");
  //   var radio_excepcion=Session.get("radio_excepcion");

  //   var faltas=  Reports.find({estatus:'Falta','createdAt':{$gte : fechaInicio, $lt: fechaFin }}).count();
  //   var retardos=  Reports.find({$or:[{estatus:'Retardo'},{estatus:'Retardo Mayor'}],'createdAt':{$gte : fechaInicio, $lt: fechaFin }}).count();
  //   var excepciones=  Reports.find({excepcion:'Si','createdAt':{$gte : fechaInicio, $lt: fechaFin }}).count();
  //   var anticipadas=  Reports.find({antes:true,'createdAt':{$gte : fechaInicio, $lt: fechaFin }}).count();


  //   var result={
  //     title : {
  //       text: 'Vangent Mexico',
  //       subtext: 'Registros con retardos'
  //     },
  //     legend:['cero','uno','dos','tres','Porcentajes','faltas','retardos','anticipadas','excepciones'],
  //     xAxis : ['data1','data2','data3','data4','data5','data6','data7'],
  //     series : [
  //       {
  //         name:'cero',
  //         type:'bar',
  //         data:[320, 332, 301, 334, 390, 330, 320]
  //       },
  //       {
  //         name:'uno',
  //         type:'bar',
  //         tooltip : {trigger: 'item'},
  //         data:[120, 132, 101, 134, 90, 230, 210]
  //       },
  //       {
  //         name:'dos',
  //         type:'bar',
  //         tooltip : {trigger: 'item'},
  //         data:[220, 182, 191, 234, 290, 330, 310]
  //       },
  //       {
  //         name:'tres',
  //         type:'bar',
  //         tooltip : {trigger: 'item'},
  //         data:[150, 232, 201, 154, 190, 330, 410]
  //       },
  //       {
  //         name:'Porcentajes',
  //         type:'pie',
  //         tooltip : {
  //           trigger: 'item',
  //           formatter: '{a} <br/>{b} : {c} ({d}%)'
  //         },
  //         center: [160,130],
  //         radius : [0, 50],
  //         itemStyle :　{
  //           normal : {
  //             labelLine : {
  //               length : 20
  //             }
  //           }
  //         },
  //         data:[
  //           {value:faltas, name:'faltas'},
  //           {value:retardos, name:'retardos'},
  //           {value:anticipadas, name:'anticipadas'},
  //           {value:excepciones, name:'excepciones'}
  //         ]
  //       }
  //     ]
  //   };
  //   return result;
  // }

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
