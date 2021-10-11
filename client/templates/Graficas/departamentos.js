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

Template.orionMaterializeCollectionsIndex_grafica_deptos.onCreated(function () {
  Tracker.autorun(() => {
        Meteor.subscribe('get_sumados', Meteor.userId());
  });
});

  Template.orionMaterializeCollectionsIndex_grafica_deptos.onRendered(function(){
  	this.autorun(() => {
  		if (this.subscriptionsReady()) {
        dibuja_grafica_principal_deptos();
        cargaSelectDeptos("deptoSelect");
  		}
  	});
  });

  Template.orionMaterializeCollectionsIndex_grafica_deptos.events({
    "change #deptoSelect": function(event) {
      var val = event.target.value;
      dibuja_grafica_deptos_emp(val);
    }
  });

  Template.orionMaterializeCollectionsIndex_grafica_deptos.helpers({
    GetColorIconBack:function(){
      return GetColorIconBack();
    }
  });

  cargaSelectDeptos= function(elemento) {
    var deptosName=Sumados.find({"tag":"EstatusDeptos","idDepartment_txt":{$nin:[null]}},{fields:{idDepartment_txt:1},sort:{idDepartment_txt:1}}).fetch();
    var gru=_.groupBy(deptosName,'idDepartment_txt');
    var llaves=_.keys(gru);
    var options = $("#"+elemento);
    options.children().remove();
    llaves.forEach(elem => {
      var deptosName=Sumados.findOne({"idDepartment_txt":elem,"tag":"EstatusDeptos"}).idDepartment;
      options.append($("<option />").val(elem).text(elem));
    });

    if(llaves.length==0){
      dibuja_grafica_deptos_emp(undefined)
    }else{
      dibuja_grafica_deptos_emp(llaves[0]);
    }
      $('select').material_select();
  }


  dibuja_grafica_deptos_emp= function(_IdDepartment) {
    console.log("_IdDepartment "+_IdDepartment);
    var datos=Sumados.find({$and:[{"idDepartment_txt":_IdDepartment},{"tag" : "EstatusDeptosUsers"}]}).fetch();
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

      var deptosValuesRetardo=Sumados.findOne({"employeeName":elem,"estatus":"Retardo","tag":"EstatusDeptosUsers"});
      var deptosValuesFaltas=Sumados.findOne({"employeeName":elem,"estatus":"Falta","tag":"EstatusDeptosUsers"});
      var deptosValuesAnticipadas=Sumados.findOne({"employeeName":elem,"estatus":"Anticipadas","tag":"EstatusDeptosUsers"});

      var ValuesFaltas=0;var ValuesRetardo=0;var ValuesAnticipadas=0;
      if(deptosValuesFaltas!=undefined)
        ValuesFaltas=deptosValuesFaltas.Totales;
      if(deptosValuesRetardo!=undefined)
        ValuesRetardo=deptosValuesRetardo.Totales;
      if(deptosValuesAnticipadas!=undefined)
        ValuesAnticipadas=deptosValuesAnticipadas.Totales;

      personsNameFaltas.push(ValuesFaltas);
      personsNameRetardos.push(ValuesRetardo);
      personsNameAnticipados.push(ValuesAnticipadas);

    });
    objetoo["xAxis"]=personsNameGraph;
    objetoo["faltas"]=personsNameFaltas;
    objetoo["retardos"]=personsNameRetardos;
    objetoo["anticipados"]=personsNameAnticipados;


    var ExistsData=objetoo.xAxis;
    var grafica_principal_deptos = document.getElementById("grafica_deptos_emp");
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
        if (ExistsData.length!=0) {
          option = {
            title: { text: 'Datos por Colaborador', },
            tooltip: { trigger: 'axis' },
            legend: { x: 'center', y: 'top', data: ['Faltas','Retardos','Anticipados'] },
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
                    tables += '<td>' + series[0].name + '</td>';
                    tables += '<td>' + series[1].name + '</td>';
                    tables += '<td>' + series[2].name + '</td>';
                    tables += '</tr>';
                    for (var i = 0; i < axisData.length; i++) {
                      tables += '<tr>' +'<td>' + axisData[i] + '</td>';
                      tables += '<td>' + series[0].data[i] + '</td>';
                      tables += '<td>' + series[1].data[i] + '</td>';
                      tables += '<td>' + series[2].data[i] + '</td>';
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
              { name: 'Faltas', type: 'line', data: [],  markPoint: {data: [ {type: 'max', name: 'Max.'} ]} },
              { name: 'Retardos', type: 'line', data: [],  markPoint: {data: [ {type: 'max', name: 'Max.'} ]} },
              { name: 'Anticipados', type: 'line', data: [],  markPoint: {data: [ {type: 'max', name: 'Max.'} ]} }
            ]
          };
          option.xAxis[0].data=objetoo.xAxis;
          option.series[0].data=objetoo.faltas;
          option.series[1].data=objetoo.retardos;
          option.series[2].data=objetoo.anticipados;
          myChart.hideLoading();
          myChart.setOption(option);
          window.onresize = function() {
            myChart.resize();
          };
        }else{
          myChart.clear();
          myChart.dispose();
          var theChartArea = "#grafica_deptos_emp";
          var ctx = $(theChartArea);
          ctx.html('<br><br><br><span style="font-size: 26pt;">Sin datos que Mostrar</span>');
        }
      }

  }

  dibuja_grafica_principal_deptos = function() {
    var deptosName=Sumados.find({"tag":"EstatusDeptos","idDepartment_txt":{$nin:[null]}},{fields:{idDepartment_txt:1}}).fetch();
    var gru=_.groupBy(deptosName,'idDepartment_txt');
    var objetoo={};
    var deptosNameGraph=[];
    var deptosNameRetardos=[];
    var deptosNameFaltas=[];
    var deptosNameAnticipados=[];

    var llaves=_.keys(gru);
    llaves.forEach(elem => {
      deptosNameGraph.push(elem);
      var deptosValuesRetardo=Sumados.findOne({"idDepartment_txt":elem,"estatus":"Retardo"});
      var deptosValuesFaltas=Sumados.findOne({"idDepartment_txt":elem,"estatus":"Faltas"});
      var deptosValuesAnticipadas=Sumados.findOne({"idDepartment_txt":elem,"estatus":"Anticipadas"});

      var ValuesFaltas=0;var ValuesRetardo=0;var ValuesAnticipadas=0;
      if(deptosValuesFaltas!=undefined)
        ValuesFaltas=deptosValuesFaltas.Totales;
      if(deptosValuesRetardo!=undefined)
        ValuesRetardo=deptosValuesRetardo.Totales;
      if(deptosValuesAnticipadas!=undefined)
        ValuesAnticipadas=deptosValuesAnticipadas.Totales;

      deptosNameFaltas.push(ValuesFaltas);
      deptosNameRetardos.push(ValuesRetardo);
      deptosNameAnticipados.push(ValuesAnticipadas);
    });
    objetoo["xAxis"]=deptosNameGraph;
    objetoo["faltas"]=deptosNameFaltas;
    objetoo["retardos"]=deptosNameRetardos;
    objetoo["anticipados"]=deptosNameAnticipados;


    var ExistsData=objetoo.xAxis;
    // if (ExistsData.length!=0) {
      var grafica_principal_deptos = document.getElementById('grafica_deptos');
      var color=GetColorGraphic();
      if(grafica_principal_deptos==null||grafica_principal_deptos==undefined){}else{
      var myChart = echarts.init(grafica_principal_deptos, color);

      option = {
        title: { text: 'Departamentos', },
        tooltip: { trigger: 'axis' },
        legend: { x: 'center', y: 'top', data: ['Faltas','Retardos','Anticipados'] },
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
                tables += '<td>' + series[1].name + '</td>';
                tables += '<td>' + series[2].name + '</td>';
                tables += '</tr>';
                for (var i = 0; i < axisData.length; i++) {
                  tables += '<tr>' +'<td>' + axisData[i] + '</td>';
                  tables += '<td>' + series[0].data[i] + '</td>';
                  tables += '<td>' + series[1].data[i] + '</td>';
                  tables += '<td>' + series[2].data[i] + '</td>';
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
          { name: 'Faltas', type: 'bar', data: [], markPoint: {data: [ {type: 'max', name: 'Max.'} ]} },
          { name: 'Retardos', type: 'bar', data: [],markPoint: {data: [ {type: 'max', name: 'Max.'} ]} },
          { name: 'Anticipados', type: 'bar', data: [],markPoint: {data: [ {type: 'max', name: 'Max.'} ]} }
        ]
      };
      option.xAxis[0].data=objetoo.xAxis;
      option.series[0].data=objetoo.faltas;
      option.series[1].data=objetoo.retardos;
      option.series[2].data=objetoo.anticipados;
      myChart.hideLoading();
      myChart.setOption(option);
      window.onresize = function() {
        myChart.resize();
      };}
    // }else{
    //   var theChartArea = "#grafica_deptos";
    //   var ctx = $(theChartArea);
    //   ctx.html('<br><br><br><span style="font-size: 26pt;">Sin datos que Mostrar en deptos</span>');
    // }
  }

  function GetDeptosEmp(_IdDepartment) {
    var datos=getEmpForDepartment(_IdDepartment);
    var _nombre=[], _faltas=[], _retardos=[],_anticipados=[];
    for (let i = 0; i < datos.length; i++) {
      var nombre=datos[i].nombre;
      var faltas=datos[i].faltas;
      var retardos=datos[i].retardos;
      var anticipados=datos[i].anticipados;
      _nombre.push(nombre);
      _faltas.push(faltas);
      _retardos.push(retardos);
      _anticipados.push(anticipados);
    }
    var result={ xAxis:_nombre, faltas:_faltas, retardos:_retardos, anticipados:_anticipados };
    return result;
  }
