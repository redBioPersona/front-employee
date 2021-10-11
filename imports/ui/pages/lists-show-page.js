import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { listRenderHold } from '../launch-screen.js';
import './lists-show-page.html';
import './enc-inactiva.html';

Template.Lists_show_page.onCreated(function listsShowPageOnCreated() {
    this.encuestaId = RouterLayer.getQueryParam('lin');
    if (!RouterLayer.getQueryParam('lin')) {
        RouterLayer.go('Recurso.noEncontrado');
        console.log('Recurso.noEncontrado');
    }
    this.i = 0;
    this.j = 0;
    template = this;
    template.estatus_enc = 'nan';
    this.subscribe('getEncuestassatisfaccion', function() {
        var encuesta = Encuestassatisfaccion.find({
            '_id': template.encuestaId
        });
        if (encuesta.count() > 0)
            template.estatus_enc = encuesta.fetch()[0].enc_status;
        else {
            console.log('Recurso.noEncontrado');
            RouterLayer.go('Recurso.noEncontrado');
        }

        if (template.estatus_enc === 'Por Aplicar') {
            var ids = [];
            template.ids = ids;
            let idPregsEnEnc = encuesta.fetch()[0].evaluacion; //arr  de obj
            idPregsEnEnc.forEach(function(pregAct) {
                ids.push(pregAct.pregunta);
            });
            template.subscribe('getPreguntasencuestasc', function() {
                let pregsEnc = [];
                if (ids) {
                    for (let i = 0; i < ids.length; i++) {
                        let preg = Preguntasencuestasc.findOne({_id: ids[i]});
                        if (preg)
                            pregsEnc.push(preg);
                    }
                }
                template.pregsEnc = pregsEnc;
            });
        }
        else if (template.estatus_enc === 'Aplicada') {
            RouterLayer.go('Encuesta.noEncontrada');
        }
    });
});


Template.Lists_show_page.onRendered(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      listRenderHold.release();
    }
  });

});

Template.Lists_show_page.helpers({
    preguntasEnc: function() {
        let instance = Template.instance();
        let pregsEnc = instance.pregsEnc;
        return pregsEnc;
    },
    noPregunta: function() {
        template = Template.instance();
        return 1 + template.i++;
    },
    noPreguntaTxt: function() {
        template = Template.instance();
        return 'noPreg' + template.j++;
    },
    suscripcionesRemotasReady: function() {
        return true; //es local todo
    },
    encPorAplicar: function() {
        template = Template.instance();
        var porAplicar = template.estatus_enc;
        return porAplicar;
    },
    templateArgs: function(urlServicio) {
        template = Template.instance();
        template.urlServicio = urlServicio;
    }
});


Template.Lists_show_page.events({
  'click .js-enviar': function(event, template) {
    event.preventDefault();
    var errores = validar();
    // console.log('err: ' + errores);
    if (errores == 0) {
      var noPregs = template.ids.length;
      var respsEncuesta = [];
      for (let i = 0; i < noPregs; i++) {
        //recuperar ids de encuesta y usuario y respuestas
        respsEncuesta.push({'pregunta': template.ids[i],
                            'calif': $('#' + template.ids[i]).val()
                        });
      }
      updateStatusEnc({_id: template.encuestaId},
                                    {$set: {evaluacion: respsEncuesta,
                                            enc_status: 'Aplicada',
                                            enc_calificacion: calcCalificacionFinal(respsEncuesta)}});
    }
    //actualizar el estatus de la aplicación de la encuesta
  }
});

function validar() {
    var errores = 0;
    template = Template.instance();
    //var valorInput=$("#errores").text();
    var msgError = '';
    for (var k = 0; k < template.ids.length; k++) {
      if ($('#' + template.ids[k]).val() == null) {//ids[0] es la pregunta 0
        console.log('error en preg ' + (k + 1));
        if (errores == 0)
          msgError = (msgError + (k + 1));
        else if (errores == template.ids.length)
          msgError = (msgError + ' y ' + (k + 1));
        else
          msgError = (msgError + ', ' + (k + 1));
        errores++;
      }
    }
    if (errores == 1)
      $('#errores').text('Seleccione un valor para la pregunta: ' + msgError);
    else if (errores > 0)
      $('#errores').text('Seleccione un valor para las preguntas: ' + msgError);
    return errores;
}

function calcCalificacionFinal(respsEncuesta) {
    var sum = 0;
    var califs = 0;
    var count = respsEncuesta.length;

    for (var i = 0; i < respsEncuesta.length; i++) {
        califs = Number.parseInt(respsEncuesta[i].calif);
        // console.log("calificaciones length "+fields.length);
        sum = sum + califs;
    }
    sum = (sum / count);
    // console.log("calificacion final "+Math.round(sum));

    var calificacionFinal = Math.round(sum);
    return calificacionFinal;
}

function updateStatusEnc(query, update) {
    Meteor.call('updateEncAp', query, update, function(err, res) {
        if (err)
            console.log(err);
        else {
            RouterLayer.go('Encuesta.exito', {_id: template.encuestaId});
        }
    });
}
