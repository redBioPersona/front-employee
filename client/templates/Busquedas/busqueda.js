Template.search_report.rendered=function(){
  Tracker.autorun(function() {
    clearSelect_Report_Location();
    clearSelect_Report_Companies();
    clearSelect_Report_Departments(Meteor.userId());
    $("#radio_retardos").prop("checked", true);
    Session.set("estatus_reports", "Retardo");
    Session.set("radio_salida_anticipada", false);
    Session.set("radio_todos", false);
    Session.set("radio_excepcion", "No");
  });
};
Template.search_report.events({
  "change #LocationSelectX":function(evt,template){
    // var valor=evt.target.value;
  },
  "change #CompanySelectX":function(evt,template){
    var valor=evt.target.value;
    //clearSelect_Report_Departments(valor);
  },
  "click #CleanLocation":function(evt,template){
    clearSelect_Report_Location();
  },
  "click #CleanCompany":function(evt,template){
    clearSelect_Report_Companies();
  },
  "click #CleanDeptos":function(evt,template){
    clearSelect_Report_Departments(Meteor.userId());
  },
  "click #Search":function(evt,template){
    var ini=$('#fechaInicio')[0].value.split("/");
    var fin=$('#fechaFin')[0].value.split("/");

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
          Session.set('fechaInicioReporte', Inicio);
          Session.set('fechaFinReporte', Fin);
          var companies=$('#CompanySelectX').val();
          var company=[];
          company.push(companies);
          Session.set("company_report",company);
          var departments=$('#DepartmentSelectX').val();
          Session.set("department_report",departments);
          var locations=$('#LocationSelectX').val();
          Session.set("location_report",locations);
          if ($("#radio_retardos").is(":checked")) {
            Session.set("estatus_reports", "Retardo");
            Session.set("radio_excepcion", undefined);
            Session.set("radio_salida_anticipada", undefined);
            Session.set("radio_todos", undefined);
          }else if ($("#radio_faltas").is(":checked")) {
            Session.set("estatus_reports", "Falta");
            Session.set("radio_excepcion", undefined);
            Session.set("radio_salida_anticipada", undefined);
            Session.set("radio_todos", undefined);
          }else if ($("#radio_asistencias").is(":checked")) {
            Session.set("estatus_reports", "Normal");
            Session.set("radio_excepcion", undefined);
            Session.set("radio_salida_anticipada", undefined);
            Session.set("radio_todos", undefined);
          }else if ($("#radio_incompleto").is(":checked")) {
            Session.set("radio_salida_anticipada", true);
            Session.set("radio_excepcion", undefined);
            Session.set("radio_todos", undefined);
          }else if ($("#radio_todos").is(":checked")) {
            Session.set("radio_todos", true);
            Session.set("radio_salida_anticipada", undefined);
            Session.set("radio_excepcion", undefined);
          }else if ($("#radio_excepciones").is(":checked")) {
            Session.set("radio_excepcion", "Si");
          }
        }
      }else{
        sAlert.error('La fecha inicial debe ser menor o igual a la final');
      }
    }else{
      sAlert.error('Alguna de las fechas es Invalida');
    }
  }
});

function clearSelect_Report_Location() {
  $('#LocationSelectX') .find('option') .remove() .end();
  var options = $("#LocationSelectX");
  Meteor.call("load_Mylocations", Meteor.userId(),function(error, result){
    if(result){
      var locationxx=result;
      options.append($("<option disabled selected>").val('').text('Seleccione una opción'));
      for (var i = 0; i < Object.keys(locationxx).length; i++) {
        options.append($("<option />").val(locationxx[i]._id).text(locationxx[i].locationName));
      }
      $('select').material_select();
    }
  });
}
function clearSelect_Report_Companies() {
  $('#CompanySelectX') .find('option') .remove() .end();
  var options = $("#CompanySelectX");
  Meteor.call("load_companies", Meteor.userId(), function(error, result){
    if(result){
      var locationxx=result;
      options.append($("<option disabled selected>").val('').text('Seleccione una opción'));
      for (var i = 0; i < Object.keys(locationxx).length; i++) {
        options.append($("<option />").val(locationxx[i]._id).text(locationxx[i].companyName));
      }
      $('select').material_select();
    }
  });
}
function clearSelect_Report_Departments(userId) {
  $('#DepartmentSelectX') .find('option') .remove() .end();
  var options = $("#DepartmentSelectX");
  Meteor.call("load_departments", userId,function(error, result){
    if(result){
      var locationxx=result;
      options.append($("<option disabled selected>").val('').text('Seleccione una opción'));
      for (var i = 0; i < Object.keys(locationxx).length; i++) {
        options.append($("<option />").val(locationxx[i]._id).text(locationxx[i].departmentName));
      }
      $('select').material_select();
    }
  });
}
