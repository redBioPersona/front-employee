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

Template.orionMaterializeCollectionsIndex_grafica_extra_time.onCreated(function () {
  Tracker.autorun(() => {
    Meteor.subscribe('get_sumados', Meteor.userId());
  });
});


  Template.orionMaterializeCollectionsIndex_grafica_extra_time.rendered=function(){
    Tracker.autorun(function() {
      dibuja_grafica_principal_extra_time("grafica_extra_time");
      cargaSelectExtraDeptos("deptoSelectExtra");
    });
  };

  cargaSelectExtraDeptos= function(elemento) {
    var deptosName=Sumados.find({"tag":"EstatusExtra"},{fields:{idDepartment_txt:1},sort:{idDepartment_txt:1}}).fetch();
    var gru=_.groupBy(deptosName,'idDepartment_txt');
    var llaves=_.keys(gru);
    var options = $("#"+elemento);
    options.children().remove();
    llaves.forEach(elem => {
      //var deptosName=Sumados.findOne({"idDepartment_txt":elem,"tag":"EstatusExtra"}).idDepartment;
      options.append($("<option />").val(elem).text(elem));
    });
    if(llaves.length==0){
      dibuja_grafica_deptos_emp_extra_time(undefined);
    }else{
      //var _id=Sumados.findOne({"idDepartment_txt":llaves[0],"tag":"EstatusExtra"}).idDepartment;
      dibuja_grafica_deptos_emp_extra_time(llaves[0]);
    }
    $('select').material_select();
  }

  Template.orionMaterializeCollectionsIndex_grafica_extra_time.events({
    "change #deptoSelectExtra": function(event) {
      var val = event.target.value;
      dibuja_grafica_deptos_emp_extra_time(val);
    }
  });

  Template.orionMaterializeCollectionsIndex_grafica_extra_time.helpers({
    GetColorIconBack:function(){
      return GetColorIconBack();
    }
  });

  dibuja_grafica_deptos_emp_extra_time= function(_IdDepartment) {
    var datos=Sumados.find({$and:[{"idDepartment_txt":_IdDepartment},{"tag" : "EstatusExtraUsers"}]}).fetch();
    var gru=_.groupBy(datos,'employeeName');

    var objetoo={};
    var personsNameGraph=[];
    var personsNameRetardos=[];
    var personsNameFaltas=[];
    var personsNameAnticipados=[];

    var llaves=_.keys(gru);
    llaves.forEach(elem => {
      var nombre=elem.split(" ");
      personsNameGraph.push(nombre[0]+" "+nombre[1]);

      var deptosValuesFaltas=Sumados.findOne({"employeeName":elem,"estatus":"Extra","tag":"EstatusExtraUsers"});
      var ValuesFaltas=0;
      if(deptosValuesFaltas!=undefined)
        ValuesFaltas=deptosValuesFaltas.Totales;
      personsNameFaltas.push(ValuesFaltas);
    });
    objetoo["xAxis"]=personsNameGraph;
    objetoo["cuantos"]=personsNameFaltas;

    var grafica_principal_deptos = document.getElementById("grafica_deptos_extra_time");
    if(grafica_principal_deptos==null||grafica_principal_deptos==undefined){
    }else{
      var color=GetColorGraphic();
      var myChart = echarts.init(grafica_principal_deptos, color);
       if (  objetoo["xAxis"].length!=0) {
        option = {
          title: { text: 'Datos por Colaborador', },
          tooltip: { trigger: 'axis' },
          legend: { x: 'center', y: 'bottom', data: ['Faltas','Retardos','Anticipados'] },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: {
                show: true,
                title: 'Datos',
                readOnly: true,
                lang: ['Datos', 'Salir', 'Actualizar'],
                optionToContent: function(opt) {
                  var axisData = opt.xAxis[0].data;
                  var series = opt.series;
                  var tables = '';
                  tables += '<table class="bordered"><tbody><tr>';
                  tables += '<td>Colaborador</td>';
                  tables += '<td>CANT. REGISTROS</td>';
                  tables += '</tr>';
                  for (var i = 0; i < axisData.length; i++) {
                    tables += '<tr>' +'<td>' + axisData[i] + '</td>';
                    tables += '<td>' + series[0].data[i] + '</td>';
                    tables += '</tr>';
                  }
                  tables += '</tbody></table>';
                  return tables;
                }
              },
              magicType: {
                show: true,
                title: {
                  line: 'Lineal',
                  bar: 'Barras',
                  stack: 'Gráfica apilada',
                  tiled: 'Gráfica desapilada'
                },
                type: ['line', 'bar', 'stack', 'tiled']
              },
              saveAsImage: { show: true, title: 'Descargar' },
              restore : {show: true,title:'Recargar'},
            }
          },
          calculable: true,
          dataZoom : {
            show : true,
            realtime : true,
            start : 20,
            end : 80
          },
          xAxis: [ { type: 'category',show: false, data: [] } ],
          yAxis: [{ type: 'value',show: false}],
          series: [
            {
              name: 'registros',
              type: 'bar',
              data: [],
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'top',
                    formatter: '{b}\n{c}'
                  }
                }
              },
              // markPoint: { data: [{ type: 'max', name: 'Max.' }] }
            }
          ]
        };
        option.xAxis[0].data=objetoo.xAxis;
        option.series[0].data=objetoo.cuantos;
        myChart.setOption(option);
        window.onresize = function() {
          myChart.resize();
        };
      }else{
        myChart.clear();
        myChart.dispose();
        var theChartArea = "#grafica_deptos_extra_time";
        var ctx = $(theChartArea);
        ctx.html('<br><br><br><span style="font-size: 26pt;">Sin datos que Mostrar</span>');
      }
    }

  }

  dibuja_grafica_principal_extra_time=function(elemento){
    var deptosName=Sumados.find({"tag":"EstatusExtra"},{fields:{idDepartment_txt:1,Totales:1}}).fetch();
    var names=_.pluck(deptosName, 'idDepartment_txt');
    var valores=_.pluck(deptosName, 'Totales');
     var ExistsData=names;
     // if (ExistsData.length!=0) {
      var grafica_principal_deptos = document.getElementById(elemento);
      if(grafica_principal_deptos==null||grafica_principal_deptos==undefined){
      }else{
        var color=GetColorGraphic();
        var myChart = echarts.init(grafica_principal_deptos, color);
        myChart.showLoading('default', {
          text: 'cargando...',
          color: '#c23531',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        });
        option = {
          title: { text: 'Departamentos', },
          tooltip: { trigger: 'axis' },
          legend: { x: 'center', y: 'top', data: ['Registros'] },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: {
                show: true,
                title: 'Datos',
                readOnly: true,
                lang: ['Datos', 'Salir', 'Actualizar'],
                optionToContent: function(opt) {
                  var axisData = opt.xAxis[0].data;
                  var series = opt.series;
                  var tables = '';
                  tables += '<table class="bordered"><tbody><tr>';
                  tables += '<td>Departamento</td>';
                  tables += '<td>' + series[0].name + '</td>';
                  tables += '</tr>';
                  for (var i = 0; i < axisData.length; i++) {
                    tables += '<tr>' +'<td>' + axisData[i] + '</td>';
                    tables += '<td>' + series[0].data[i] + '</td>';
                    tables += '</tr>';
                  }
                  tables += '</tbody></table>';
                  return tables;
                }
              },
              magicType: {
                show: true,
                title: {
                  line: 'Lineal',
                  bar: 'Barras',
                  stack: 'Gráfica apilada',
                  tiled: 'Gráfica desapilada'
                },
                type: ['line', 'bar', 'stack', 'tiled']
              },
              saveAsImage: { show: true, title: 'Descargar' },
              restore : {show: true,title:'Recargar'},
            }
          },
          calculable: true,
          dataZoom : {
            show : true,
            realtime : true,
            start : 20,
            end : 80
          },
          xAxis: [ { type: 'category', data: [] } ],
          yAxis: [{ type: 'value' }],
          series: [
            {
              name: 'Registros',
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  areaStyle: {
                    type: 'default'
                  }
                }
              },
              data: [],
              markPoint: {
                data: [{
                  type: 'max',
                  name: 'Max.'
                }]
              }
            }
          ]
        };
        option.xAxis[0].data=names;
        option.series[0].data=valores;
        myChart.hideLoading();
        myChart.setOption(option);
        window.onresize = function() {
          myChart.resize();
        };
      }
    // }else{
    //   var theChartArea = "#" + elemento;
    //   var ctx = $(theChartArea);
    //   ctx.html('<br><br><br><span style="font-size: 26pt;">Sin datos que Mostrar</span>');
    // }
  }
