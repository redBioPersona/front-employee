if (Meteor.isClient) {
  Meteor.startup(function() {
    sAlert.config({
      position: 'top-right',
      stack: {
          limit: 2
      }
    });
    var dfIniDefault=moment().subtract(1, 'months').hours(0).minutes(0).seconds(0).toDate();
    Session.set('fechaInicio', dfIniDefault);
    var dfFinDefault=moment().hours(24).minutes(0).seconds(0).toDate();
    Session.set('fechaFin', dfFinDefault);

    setTimeout(function() {
      $("#inject-loader-wrapper").fadeOut(50, function() {
          $(this).hide();
        $(this).remove();
      });
    }, 50);
  });
}
