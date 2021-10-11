import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';

import './login.html';

Template.login_p.helpers ({
	loggedIn : function (){
		console.log('login '+Meteor.userId());
		return Meteor.userId();            
	},
	redirigir :function(){
		FlowRouter.go('Encuesta.show', FlowRouter.getParam('_id'));
	}
});
