Router.configureBodyParsers = function() {
  Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));
};

Router.configure({
  notFoundTemplate: 'notFound'
});

Router.route('/', {
  name: 'welcome',
  template: 'welcome'
});

Router.route('/qr/:_id', {
  name: 'qr',
  waitOn: function() {
      return Meteor.subscribe("getOneTicket", this.params._id);
  },
  data: function () {
    var result=Tickets.findOne({"_id":this.params._id});
    return result;
  }
});

Router.route('/reportes/:_id',{
  name:'reportes',
  data: function () {
    return Persons.findOne({_id: this.params._id});
  }
});

Router.route('.', function() {
  Router.go('/admin/login');
}, {
  name: 'main'
});
