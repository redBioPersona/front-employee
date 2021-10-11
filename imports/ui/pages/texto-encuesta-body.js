import { Template } from 'meteor/templating';
// import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

// import {invitacionEncuesta} from '/imports/entities_encs/zMod_enc_textoEncuesta.js';
import './texto-encuesta-body.html';
import '../components/header.html';
import '../components/footer.html';


Template.Encuesta_body.onCreated(function appBodyOnCreated() {
  	//console.log('Template.Encuesta_body');
 //  	this.getIdServicio= () => RouterLayer.getQueryParam("ids");
    //coleccion local para los campos de las invitaciones a las encuestas
    //camposInvitacion = new Mongo.Collection('invitacionEncuesta');

    //Suscripcion a publicacion de BD invitacionEncuesta
    this.subscribe('getDiseñoEncuesta', function(){
        template.idInvitacion=invitacionEncuesta.find().fetch()[0]._id;
    });

    // template=this;
    // Tracker.autorun(function(){
    // 	if(!Session.get('urlServicio')){
    // 		var conexion=DDP.connect(SERVICES_URL);
    // 		var serviceEndpoints=new Mongo.Collection('serviceEndpoints', conexion);
    // 		var remoteServiceUrl="";
    //     template.remote_connection=conexion;
    // 		if (template.getIdServicio()) {
    // 			template.susEndpoints=conexion.subscribe('EndPointsServicios', function() {
    // 			    console.log("BD servicios suscrita...");
    // 			    var dataOfService = serviceEndpoints.find({'_id':template.getIdServicio()}).fetch()[0];
    // 			    remoteServiceUrl='http://'+dataOfService.endPointHost+':'+dataOfService.endPointPort;
    // 			    Session.set('urlServicio', remoteServiceUrl);
    // 			});
    // 		}
    // 		else
    // 		    Session.set('urlServicio', remoteServiceUrl);
    // 	//console.log('Fin: Template.Encuesta_body');
    //   }
    // });


});

Template.Encuesta_body.onRendered(function (){
$("#formInvitacionEnc").validate({
        rules: {
            msgSaludo: {
                required: true,
                minlength: 3
            },
            msgMotivoI: {
                required: true,
                minlength:5
            },
            msgPropositoE: {
				required: true,
				minlength: 5
			},
			tiempoE: {
				required: true,
				minlength: 5
			},
			contacto: {
                required: false,
                minlength: 5
            },
            agradecimiento: {
				required: true,
				minlength: 5
			},
			direccionPostal: {
				required: false,
				minlength: 5
			},
            desuscribir: {
            	required: false
            }
        },
        //For custom messages
        messages: {
            msgSaludo: {
                required: "Indique el mensaje de saludo",
                minlength: "Introduzca al menos 3 caracteres"
            },
            msgMotivoI: {
                required: "Indique el motivo de la invitaci&oacute;n",
                minlength:"Introduzca al menos 5 caracteres"
            },
            msgPropositoE: {
				required: "Indique el prop&oacute;sito de la encuesta",
				minlength: "Introduzca al menos 5 caracteres"
			},
			tiempoE: {
				required: "Indique el tiempo estimado para responder la encuesta",
				minlength: "Introduzca al menos 5 caracteres"
			},
			contacto: {
                required: "Indique la informaci&oacute;n de contacto",
                minlength: "Introduzca al menos 5 caracteres"
            },
            agradecimiento: {
				required: "Indique el agradecimiento",
				minlength: "Introduzca al menos 5 caracteres"
			},
			direccionPostal: {
				required: "Indique la direcci&oacute;n postal",
				minlength: "Introduzca al menos 5 caracteres"
			},
            desuscribir: {
            	required: "indique si se debe enviar el vínculo para desuscripci&oacute;n de la lista de env&iacute;os"
        	}
        },
        errorElement : 'div',
    	errorClass: 'invalid',
    	validClass: "valid",
        errorPlacement: function(error, element) {
          var placement = $(element).data('error');
          if (placement) {
            $(placement).append(error);
          } else {
            error.insertAfter(element);
          }
        }
     });
});

Template.Encuesta_body.helpers({
  	urlServicio : function() {
    	return Session.get('urlServicio');
  	},
    contMsgSaludo: function(){
        instance=Template.instance();
        if (instance.subscriptionsReady())
            return invitacionEncuesta.find().fetch()[0].msgSaludo;
        else
            return "";
    },
    contMsgMotivo: function(){
        instance=Template.instance();
        if (instance.subscriptionsReady())
            return invitacionEncuesta.find().fetch()[0].msgMotivoI;
        else
             return "";
    },
    contMsgPropositoE: function(){
        instance=Template.instance();
        if (instance.subscriptionsReady())
            return invitacionEncuesta.find().fetch()[0].msgPropositoE;
        else
             return "";
    },
    contMsgTiempoE: function(){
        instance=Template.instance();
        if (instance.subscriptionsReady())
            return invitacionEncuesta.find().fetch()[0].tiempoE;
        else
             return "";
    },
    contMsgContacto: function(){
        instance=Template.instance();
        if (instance.subscriptionsReady())
            return invitacionEncuesta.find().fetch()[0].contacto;
        else
             return "";
    },
    contMsgAgradecimiento: function(){
        instance=Template.instance();
        if (instance.subscriptionsReady())
            return invitacionEncuesta.find().fetch()[0].agradecimiento;
        else
             return "";
    },
    contMsgDireccionPostal: function(){
        instance=Template.instance();
        if (instance.subscriptionsReady())
            return invitacionEncuesta.find().fetch()[0].direccionPostal;
        else
             return "";
    },
    contMsgDesuscribir: function(){
        instance=Template.instance();
        if (instance.subscriptionsReady())
            return invitacionEncuesta.find().fetch()[0].desuscribir;
        else
             return "false";
    }
});


Template.Encuesta_body.events({
  'click .js-enviarNvaEnc': function (event, template){
    event.preventDefault();
        //recuperar ids de encuesta y usuario y respuestas
        var formatoInvitacionEnc={'msgSaludo': $('#msgSaludo').val().trim(),
                            'msgMotivoI': $('#msg_MotivoI').val().trim(),
                            'msgPropositoE': $('#msgPropositoE').val().trim(),
                            'tiempoE': $('#msgTiempoE').val().trim(),
                            'contacto': $('#detallesContacto').val().trim(),
                            'agradecimiento': $('#Agradecimiento').val().trim(),
                            'direccionPostal': $('#direccion_postal').val().trim(),
                            'desuscribir': $('#desuscripcion').is(':checked')
                          };

        console.log(formatoInvitacionEnc);
        //actualizar la bd con las respuestas
        //Meteor.call('actualizarEncAplicada', formatoInvitacionEnc.msgPropositoE);
        Meteor.call('registrarInvitacionEnc', template.idInvitacion, formatoInvitacionEnc);
        //updateStatusEnc();
        Meteor.call('registrarInvitacionEncProv', template.idInvitacion, formatoInvitacionEnc);


      //FlowRouter.go('Encuesta.exito', {_id: template.getEncuestaId()});

    //actualizar el estatus de la aplicación de la encuesta
  }
});
