import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import './app-body.html';
import '/imports/ui/components/header.js';
import '/imports/ui/components/footer.js';

//import {Encuestasprocesadas} from '../../api/lists/listas-encuestas.js';

Template.App_body.onCreated(function appBodyOnCreated() {
  console.log('Template.App_body');
  // this.getIdServicio= () => FlowRouter.getQueryParam("ids");
  // var conexion=DDP.connect(SERVICES_URL);
  // var serviceEndpoints=new Mongo.Collection('serviceEndpoints', conexion);
  var template=this;
  // var remoteServiceUrl="";
  // if (template.getIdServicio()) {
    // template.susEndpoints=conexion.subscribe('EndPointsServicios', function() {
    //   console.log("BD servicios suscrita...");
    //   var cursorOfService = serviceEndpoints.find({'_id':template.getIdServicio()});
    //   if (cursorOfService.count()==0)
        // Router.go('Recurso.noEncontrado');
    //   dataOfService=cursorOfService.fetch()[0];
    //   remoteServiceUrl='http://'+dataOfService.endPointHost+':'+dataOfService.endPointPort;
    //   Session.set('urlServicio', remoteServiceUrl);
    // });
  // }
  // else
    //   Session.set('urlServicio', remoteServiceUrl);
  // console.log('Fin: Template.App_body');
});


Template.App_body.helpers({
  lists() {
    //console.log('Listas encontradas helper: '+Encuestasprocesadas.find().count());
    var id_cliente=Meteor.user().profile.id_cliente;
    //console.log(id_cliente+ 'id cliente en cliente');
    //console.log('Listas del cliente: '+Encuestasprocesadas.find({'id_cliente':id_cliente}).fetch());
    //return Encuestasprocesadas.find({'id_cliente':id_cliente}).fetch(); //solo las encuestas de ese usuario
  },
  cargando(){
  	return ('Cargando...');
  },
  activeListClass(list) {
    // const active = ActiveRoute.name('Encuesta.show')
    //   && RouterLayer.getQueryParam('_id') === list._id;
    // return active && 'active';

  },
  app_loading(){
    return ('Cargando...');
  },
  loggedIn (){
    //return true;
    return Meteor.userId();
  },
  redirigir :function(){
    RouterLayer.go('/admin');
  }
});

Template.App_body.onRendered(function (){

  $(document).ready(function() {
      window_size = $(window).height();
      console.log("window size: "+window_size);
      $('.j-main').height(window_size*0.8);
      //console.log($('.j-main').html());
  });
});

Template.App_body.events({
  'click .js-menu-item'() {
    //const listId = insert.call();
    console.log(FlowRouter.getParam('_id'));
    RouterLayer.go('/pub/encuestas/', { _id: this._id });
  }
});
