if (Meteor.isClient) {

  Template.calendarios_Template.onCreated(function () {
    var ini=moment().date(1).hours(0).minutes(0).seconds(0).subtract(2,'months').toDate();
    var fin=moment().add(2,'days').toDate();

    Meteor.subscribe('getReportsbyEmployee', Meteor.userId(),ini,fin, {
      onError: function (error) {},
      onReady: function () {}
    });
    Meteor.subscribe('get_Justificantes', Meteor.userId(), {
      onError: function (error) {},
      onReady: function () {}
    });
    Meteor.subscribe('getFeriados', Meteor.userId(), {
      onError: function (error) {},
      onReady: function () {}
    });
    Meteor.subscribe('get_Config_application',{
      onError: function (error) {},
      onReady: function () {}
    });
  });

  Template.calendarios_Template.helpers({
    events: function () {
      var fc = $('.fc');
      return function (start, end, tz, callback) {
        var _userId = Meteor.userId();
        var res = Meteor.users.findOne({"_id": _userId});
        if (res && res.profile.idEmployee) {
          var _id = res.profile.idEmployee;
          var reportss = Reports.find({
            _idEmployee: _id
          }, {
            fields: {fecha: 1,estatus: 1,primerRegistro:1,ultimoRegistro:1}
          }).fetch();
          var justi=Feriados.find({},{fields:{fecha_txt:1}}).fetch()
          var justif=justi.map(item=>{
            return {
              fecha:item.fecha_txt,
              _id:item._id,
              estatus:"Feriado"
            }
          });

          var children = reportss.concat(justif);
          var events = children.map(item => {
            return {
              title: GetTitle(item._id),
              start: GetDate(item.fecha),
              allDay: true,
              color: GetColor(item.estatus),
              id: item._id
            };
          });
          callback(events);
        }
      };
    },
    validRanges:function(){
      var ini=moment().date(1).hours(0).minutes(0).seconds(0).subtract(2,'months').format('YYYY-MM-DD');
      var fin=moment().add(2,'days').format('YYYY-MM-DD');
      return {
        start:ini,
        end:fin
      }
    },
    onEventClicked: function () {
      return function (calEvent, jsEvent, view) {
        if (calEvent.color == "#b70920" && calEvent.title == "Sin Justificar") {
          AutoForm.resetForm("calendario_justificar_XP");
          Session.set("Justify_id", calEvent.id);
          let listF = Session.get('listFiles');
          if(listF!=undefined && listF.length>0){
            Meteor.call("cleanFilesOrion", listF, function(error, result){
              if(error){ }
              if(result){ }
            });
            Session.set('listFiles',null);
          }
          $("#tabular_table_justify").modal('open', { dismissible: false });
        }
      }
    },
    IconColorBack: function () {
      return GetColorIconBack();
    }
  });

  Template.calendarios_Template.rendered = function () {
    var fc = this.$('.fc');
    this.autorun(function () {
      fc.fullCalendar('refetchEvents');
    });
  }

  function GetColor(estatus) {
      if (estatus== "Falta") {
        return "#b70920";
      } else if (estatus.includes("Retardo")) {
        return "#a4b20a";
      }else if (estatus.includes("Feriado")) {
        return "#146d32";
      }
  }

  function GetDate(fecha) {
    var date = fecha.split("/");
    var result = new Date(date[2], date[1] - 1, date[0], 0, 0, 0);
    return result;
  }

  function GetDateEnd(fecha) {
    var date = fecha.split("/");
    var result = new Date(date[2], date[1] - 1, date[0], 23, 0, 0);
    return result;
  }
  function GetTitle(dato) {
  var result = "";
  if (dato) {
    var Normal = Reports.findOne({ "_id": dato,  $or: [{ "estatus": "-" },{ "estatus": "Normal" }, { "estatus": "Tolerancia" }]}, { fields: { estatus: 1, primerRegistro: 1, ultimoRegistro: 1 } });
    if (Normal != undefined) {
      var primReg = Normal.primerRegistro;
      var ultReg = "Sin Registro";
      if (Normal.ultimoRegistro != undefined  && Normal.ultimoRegistro!="-" ) {
        ultReg = Normal.ultimoRegistro;
      }
      result = primReg + "-" + ultReg;
    } else {
      var Retardo = Reports.findOne({ "_id": dato, $or: [{ "estatus": "Retardo Normal" }, { "estatus": "Retardo Menor" }, { "estatus": "Retardo Mayor" }] }, { fields: { estatus: 1, primerRegistro: 1, ultimoRegistro: 1 } });
      if (Retardo != undefined && Retardo.primerRegistro != undefined) {
        var primReg = Retardo.primerRegistro;
        var ultReg = "Sin Registro";
        if (Retardo.ultimoRegistro != undefined && Retardo.ultimoRegistro!="-") {
          ultReg = Retardo.ultimoRegistro;
        }
        result = primReg + "-" + ultReg;
      } else {
        var ff = Feriados.findOne({ _id: dato },{fields:{comentarios:1}});
        if (ff != undefined) {
          result = ff.comentarios;
        } else {
          var Data = Justificantes.findOne({ reporte: dato },{fields:{estatus:1}});
          if (Data != undefined) {
            result = Data.estatus;
          } else {
            result = "Sin Justificar";
          }
        }
      }

    }

  }
  return result;
};
}
