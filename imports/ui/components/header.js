import { Template } from 'meteor/templating';
// import { FlowRouter } from 'meteor/kadira:flow-router';

import './header.html'

Template.encabezado.onCreated(function appBodyOnCreated() {
 //  	console.log('Template.encabezado');
 //  	var template=this;
 //  	Tracker.autorun(function(){
    // 	template.remoteServiceUrl=Session.get('urlServicio');
    // 	if (!template.remoteServiceUrl) {
	// 	  	template.getIdServicio= () => FlowRouter.getQueryParam("ids");
	// 		var conexion=DDP.connect(SERVICES_URL);
	// 		var serviceEndpoints=new Mongo.Collection('serviceEndpoints', conexion);
	// 		var remoteServiceUrl="";
	// 		if (template.getIdServicio()) {
	// 			template.susEndpoints=conexion.subscribe('EndPointsServicios', function() {
	// 			    console.log("BD servicios suscrita...");
	// 		        var cursorOfService = serviceEndpoints.find({'_id':template.getIdServicio()});
	// 		        if (cursorOfService.count()==0)
	// 		          FlowRouter.go('Recurso.noEncontrado');
	// 		        dataOfService=cursorOfService.fetch()[0];
	// 			    remoteServiceUrl='http://'+dataOfService.endPointHost+':'+dataOfService.endPointPort;
	// 			    Session.set('urlServicio', remoteServiceUrl);
	// 			});
	// 		}
	// 		else
	// 		    Session.set('urlServicio', remoteServiceUrl);
	// 	}
	// });
  console.log('Fin: Template.encabezado');
});

Template.encabezado.helpers({
  	urlServicio : function() {
  		console.log(Session.get('urlServicio'));
    	return Session.get('urlServicio');
  	}
});
