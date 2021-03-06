console.log('root-redirector');
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Encuestasprocesadas} from '../../api/lists/listas-encuestas.js';
import './root-redirector.html';

Template.app_rootRedirector.onCreated(() => {
  // We need to set a timeout here so that we don't redirect from inside a redirection
  //   which is a no-no in FR.
  Meteor.defer(() => {
    //FlowRouter.go('App_body', Lists.findOne());
    FlowRouter.go('App_body', Encuestasprocesadas.findOne());
  });
});
