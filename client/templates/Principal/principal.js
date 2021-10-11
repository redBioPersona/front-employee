import { Meteor } from 'meteor/meteor';
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
import 'echarts/theme/dark.js';
import 'echarts/theme/infographic.js';
import 'echarts/theme/macarons.js';
import 'echarts/theme/roma.js';
import 'echarts/theme/shine.js';
import 'echarts/theme/vintage.js';

if (Meteor.isClient) {
  require('datatables.net-buttons');
  require('datatables.net-buttons/js/buttons.html5.js')();
}

Template.principal_dashboardTemplate.onCreated(function () {
  Tracker.autorun(() => {
    Meteor.subscribe('get_sumados', Meteor.userId());
  });
});

Template.principal_dashboardTemplate.onRendered(function(){
	this.autorun(() => {
		if (this.subscriptionsReady()) {
      dibuja_grafica_principal_porcentajes();
      dibuja_grafica_principal_sanciones();
		}
	});
});

Template.principal_dashboardTemplate.events({
  "click #SearchtabularFilter":function(){
      var Inicio = moment().subtract(1, 'months').format('YYYY-MM-DD');
      var Fin = moment().format('YYYY-MM-DD');
      Meteor.call("GetCountUser",Meteor.userId(),Inicio,Fin);
      var grafica1 = document.getElementById("grafica_principal_porcentajes");
      if(grafica1!=null && grafica1!=undefined){
        var myChart1 = echarts.init(grafica1);
        myChart1.showLoading('default', {
         text: 'cargando...',
         color: '#c23531',
         textColor: '#000',
         maskColor: 'rgba(255, 255, 255, 0.8)',
         zlevel: 0
       });
       setTimeout(function () {
         myChart1.hideLoading();
       }, 1500);
      }

      var grafica2 = document.getElementById("grafica_principal_sanciones");
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
       }, 1500);
      }
  }
});

Template.principal_dashboardTemplate.helpers({
  color:function(){
    var colors=GetColorTemplateShowInfo();
    return colors;
  },
  IHadCompany:function(){
    return IHadCompany();
  },
  user:function() {
    var userId=Meteor.userId();
    var result=true;
    if (Roles.userHasRole(userId, "admin") == true) {
      result=true;
    }else if(
      Roles.userHasRole(userId, "Usuario Administrador") == true ||
      Roles.userHasRole(userId, "Supervisor") == true){
      result=true;
    }else if (Roles.userHasRole(userId, "Usuario") == true) {
      result=false;
    }
    return result;
  },
  principal_faltas: function() {
    var CountReportsFaltas=0;
    var exists=Sumados.findOne({"estatus":"Falta","tag":"Gral"});
    if(exists){
      CountReportsFaltas=exists.Totales;
    }
    Session.set("principal_faltas",CountReportsFaltas);
    return CountReportsFaltas;
  },
  principal_retardos_asistencia: function() {
    var Data=0;
    var DataN=0;
    var DataM=0;
    var DataMay=0;
    var DataTotalReports=0;

    var existsRetNormal=Sumados.findOne({"estatus":"Retardo Normal","tag":"Gral"});
    if(existsRetNormal){
      DataN=existsRetNormal.Totales;
    }

    var existsRetMenor=Sumados.findOne({"estatus":"Retardo Menor","tag":"Gral"});
    if(existsRetMenor){
      DataM=existsRetMenor.Totales;
    }

    var existsRetMayor=Sumados.findOne({"estatus":"Retardo Mayor","tag":"Gral"});
    if(existsRetMayor){
      DataMay=existsRetMayor.Totales;
    }

    Data=DataN+DataM+DataMay;
    Session.set("principal_retardos_asistencia",Data);
    Session.set("TotalCountRetardoNormal",DataN);
    Session.set("TotalCountRetardoMenor",DataM);
    Session.set("TotalCountRetardoMayor",DataMay);

    return Data;
  },
  principal_excepciones: function() {
    var Data=0;
    var exists=Sumados.findOne({"estatus":"Excepciones","tag":"Gral"});
    if(exists){
      Data=exists.Totales;
    }
    Session.set("principal_excepciones",Data);
    return Data;
  },
  principal_anticipadas: function() {
    var Data=0;
    var exists=Sumados.findOne({"estatus":"Anticipadas","tag":"Gral"});
    if(exists){
      Data=exists.Totales;
    }
    Session.set("principal_anticipadas",Data);
    return Data;
  },
  principal_tickets: function() {
    var Data=0;
    var exists=Sumados.findOne({"estatus":"Tickets","tag":"Gral"});
    if(exists){
      Data=exists.Totales;
    }
    Session.set("CountTickets",Data);
    return Data;
  },
  principal_retardos_comidas: function() {
    var Data=0;
    var exists=Sumados.findOne({"estatus":"Alimentos","tag":"Gral"});
    if(exists){
      Data=exists.Totales;
    }
    return Data;
  },
  principal_permisos: function() {
    var Data=0;
    var exists=Sumados.findOne({"estatus":"Permisos","tag":"Gral"});
    if(exists){
      Data=exists.Totales;
    }
    Session.set("CountPermisos",Data);
    return Data;
  },
  principal_vacaciones: function() {
    var Data=0;
    var exists=Sumados.findOne({"estatus":"Vacations","tag":"Gral"});
    if(exists){
      Data=exists.Totales;
    }
    return Data;
  },
  principal_justificantes: function() {
    var Data=0;
    var exists=Sumados.findOne({"estatus":"Justificantes","tag":"Gral"});
    if(exists)
      Data=exists.Totales;
    Session.set("CountJustificantes",Data);
    return Data;
  }
});

user=function(){
  var userId=Meteor.userId();
  var result=true;
  if (Roles.userHasRole(userId, "admin") == true) {
    result=true;
  }else if(
    Roles.userHasRole(userId, "Usuario Administrador") == true ||
    Roles.userHasRole(userId, "Supervisor") == true){
    result=true;
  }else if (Roles.userHasRole(userId, "Usuario") == true) {
    result=false;
  }
  return result;
};

function IHadCompany(){
  var result;
  if (SelectorIsAdmin()) { result=true; }
  else{
    result=false;
    if (SelectorWithUserCompany()) { result=true; }
  }
  return result;
};


dibuja_grafica_principal_deptos_FaltasRetardos=function(){
  var deptosName=Sumados.find({"tag":"EstatusDeptos"},{fields:{idDepartment_txt:1}}).fetch();
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

  var grafica_principal_deptos = document.getElementById('grafica_principal_deptos');
  var color=GetColorGraphic();
  var ExistsData=objetoo.xAxis;
  if (ExistsData.length!=0) {
    if(grafica_principal_deptos==null||grafica_principal_deptos==undefined){}else{
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
  }else{
    var theChartArea = "#grafica_principal_deptos";
    var ctx = $(theChartArea);
    ctx.html('<br><br><br><span style="font-size: 26pt;">Sin datos que Mostrar en deptos</span>');
  }
}



dibuja_grafica_principal_porcentajes = function() {
  var grafica_principal_porcentajes = document.getElementById('grafica_principal_porcentajes');
  var color=GetColorGraphic();
  if(grafica_principal_porcentajes==null||grafica_principal_porcentajes==undefined){
  }else{
    var myChart = echarts.init(grafica_principal_porcentajes, color);
    myChart.showLoading('default', {
      text: 'cargando...',
      color: '#c23531',
      textColor: '#000',
      maskColor: 'rgba(255, 255, 255, 0.8)',
      zlevel: 0
    });
    option = {
      title: {
        text: 'Porcentajes',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'horizontal', // 'vertical,horizontal'
        x: 'center', // 'center' | 'left' | 'right' | {number},
        y: 'top', // 'center' | 'bottom' | 'top' | {number}
        padding: 25,    // [5, 10, 15, 20]
        data: ['Faltas', 'Retardos', 'Excepciones', 'Anticipadas']
      },
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
              var series = opt.series;
              var tables = '';
              for (var ii = 0; ii < series.length; ii++) {
                var axisData = series[ii].data;
                tables += '<table class="bordered"><tbody><tr>';
                tables += '</tr>';
                for (var i = 0; i < axisData.length; i++) {
                  tables += '<tr>' +
                    '<td>' + axisData[i].name + '</td>';
                  tables += '<td>' + axisData[i].value + '</td>';
                  tables += '</tr>';
                }
                tables += '</tbody></table><br/>';
              }
              return tables;
            }

          },
          magicType: {
            show: true,
            type: ['pie', 'funnel'],
            title: { pie: 'Pastel', funnel: 'Embudo', },
            option: { funnel: { x: '25%', width: '50%', funnelAlign: 'left', max: 1548 } }
          },
          saveAsImage: { show: true, title: 'Descargar' },
          restore : {show: true,title:'Recargar'},
        }
      },
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: '50%',
          center: ['50%', '60%'],
          data: [
            { value:Session.get("principal_faltas"), name: 'Faltas' },
            { value: Session.get("principal_retardos_asistencia"), name: 'Retardos' },
            { value: Session.get("principal_excepciones"), name: 'Excepciones' },
            { value: Session.get("principal_anticipadas"), name: 'Anticipadas' }
          ]
        }
      ]
    };
    myChart.hideLoading();
    myChart.setOption(option);
    window.onresize = function() {
      myChart.resize();
    };
  }
}

dibuja_grafica_principal_sanciones = function() {
  var grafica_principal_sanciones = document.getElementById('grafica_principal_sanciones');
  var color=GetColorGraphic();
  if(grafica_principal_sanciones==null||grafica_principal_sanciones==undefined){
  }else{
  var myChart = echarts.init(grafica_principal_sanciones, color);
  myChart.showLoading('default', {
    text: 'cargando...',
    color: '#c23531',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  });
  option = {
    title: {
      text: 'Retardos',
      x: 'center'
    },
    tooltip: { trigger: 'axis' },
    legend: {
      x: 'center',
      y: 'bottom',
      data: ['Retardo Normal', 'Retardo Menor', 'Retardo Mayor']
    },
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
            tables += '<td></td>';
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
            bar: 'Barras'
          },
          type: ['line', 'bar']
        },
        saveAsImage: { show: true, title: 'Descargar' },
        restore : {show: true,title:'Recargar'},
      }
    },
    calculable: true,
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: ['Retardo Normal', 'Retardo Menor', 'Retardo Mayor']
    }],
    yAxis: [ { type: 'value' }],
    series: [{
      name: 'Tolerancia',
      type: 'line',
      stack: 'Tolerancia',
      itemStyle: { normal: { areaStyle: { type: 'default' } } },
      data: [Session.get("TotalCountRetardoNormal"), Session.get("TotalCountRetardoMenor"), Session.get("TotalCountRetardoMayor")]
    }]
  };
  myChart.hideLoading();
  myChart.setOption(option);
  window.onresize = function() {
    myChart.resize();
  };
}
}

GetDeptos=function() {
  var data=SelectorGetMyIdsCompanies();
  var datos=getDepartmentsForCompany(data);
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
  Session.set('GetDeptosResult',result);
  //console.log("result "+JSON.stringify(result));
  return result;
}

function GetExtraTime() {
  var data=SelectorGetMyIdsCompanies();
  var datos=getExtraTimeOfDepartmentsForCompany(data);
  var _nombre=[], _cuantos=[];
  for (let i = 0; i < datos.length; i++) {
    var nombre=datos[i].nombre;
    var cuantos=datos[i].cuantos;
    _nombre.push(nombre);
    _cuantos.push(cuantos);
  }
  var result={ xAxis:_nombre, cuantos:_cuantos};
  return result;
}
