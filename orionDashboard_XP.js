/**
 * @property orion
 * @where {client}
 * @public
 * @return {Object}
 *
 * Declares the orion namespace
 */
orion = orion;

/**
 * @property orion.dashboard
 * @where {client}
 * @public
 * @return {Object}
 *
 * Declares the orion.dashboard namespace and Object.
 */
orion.dashboard = {};

/**
 * @property orion.dashboard._widgets
 * @where {client}
 * @public
 * @return {[Object]}
 *
 * Declares the orion.dashboard._widgets array. Which is an array
 * of objects that are
 */
orion.dashboard._widgets = [];

/**
 * @method orion.dashboard.registerWidget
 * @where {client}
 * @public
 * @param  {Object} data An object that contains the data to be passed to the template
 * @return {Object}      Returns an object with data for the widet.
 *
 * Registers the widget and passes the data along to the declared template.
 * Template must be defined within the Passed argument otherwise it will default
 * to the default widget template.
 */
orion.dashboard.registerWidget = function(data) {
  check(data, Object);

  if (data.template === undefined || data.template == 'default') {
    data.template = ReactiveTemplates.get('orionDashboardWidget');
  }
  return orion.dashboard._widgets.push(data);
};




/**
 * @property ReactiveTemplates.helpers
 * @where {client}
 * @public
 * @return {undefined}
 *
 * Pulls all widgets from the orion.dashboard._widgets array and passes them
 * along to the declared template.
 */

if (Meteor.isClient) {
  ReactiveTemplates.helpers('orionDashboard', {
    widgets: function() {
      return orion.dashboard._widgets;
    },
    count: function() {
      return Counter.get(this);
    }
  });

  /**
   * @property ReactiveTemplates.onCreated('orionDashboardWidget')
   * @where {client}
   * @public
   * @return {undefined}
   *
   * Subscribes to the publication passed to the widget.
   */
  ReactiveTemplates.onCreated('orionDashboardWidget', function() {
    var data = this.data
    this.subscribe(data.publication);
  });

  ReactiveTemplates.helpers('orionDashboardWidget', {
    /**
     * @method getCount
     * @public
     * @param  {String} count The count passed to through registerWidget
     * @return {Number}       Returns the total counts from the publication.
     *
     * Returns the total count of records based on the Counter
     * passed through the registerWidget function.
     */
    getCount: function(count) {
      return Counts.get(count);
    }
  });
}


/**
 * @method Options.init
 * @where {client|server}
 * @private
 * @return {Boolean}  Returns Boolean True or False
 *
 * Optional setting allowing or denying the dashboard link to display
 * in the admin panel.
 */
//Options.init('showDashboardTab', true);

/**
 * @where {client|server}
 * @private
 * @return {Boolean}
 *
 * If the showDashboard option is set to true, the home route will be
 * set to the dashboard path. This option can be overwritten by
 * setting the adminHomeRoute explicitly
 */
//if (Options.get('showDashboardTab') == true) {
//  Options.set('adminHomeRoute', 'orionDashboard');
//}

/**
 * @where {client|server}
 * @private
 * @return {String}
 *
 * Set's the dashboard template and defines the default template.
 * See ReactiveTemplates documentation for how to override the default
 * dashboard template. This typically is not neeed.
 */
ReactiveTemplates.request('orionDashboard', 'orion_dashboard_bootstrap');

if (_.has(Package, 'orionjs:materialize')) {
  ReactiveTemplates.set('orionDashboard', 'orion_dashboard_materialize');
}

/**
 * @method ReactiveTemplates.request
 * @where {client|server}
 * @private
 * @return {String}
 *
 * Set's the Dashboard Widget template and defines the default template.
 * See ReactiveTemplates documentation for informatation on how to override the
 * default widget. NOTE: this is not the same as registering a new widget.
 */
ReactiveTemplates.request('orionDashboardWidget', 'orion_dashboard_default_widget_bootstrap');

if (_.has(Package, 'orionjs:materialize')) {
  ReactiveTemplates.set('orionDashboardWidget', 'orion_dashboard_default_widget_materialize');
}

/**
 * @method Roles.registerAction
 * @where {client|server}
 * @private
 * @return {Boolean}
 *
 * Registers the orionDashboard action to the Roles package.
 * This allows us to ensure the user has the proper permissions to
 * make changes to the dashboard.
 */
Roles.registerAction('orionDashboard', true);

/**
 * @method RouterLayer.route
 * @where {client}
 * @private
 * @return {Object}
 *
 * Registers the route for the dashboard. By Default this route is always
 * registered as a subpath of /admin/
 */
/*
RouterLayer.route('/admin/dashboard', {
  layout: 'layout',
  template: 'orionDashboard',
  name: 'orionDashboard',
  reactiveTemplates: true
});
*/

/**
 * @method orion.accounts.addProtectedRoute
 * @where {client}
 * @private
 * @return {String}
 *
 * Adds a protected route to orionDashboard ensuring that the user must be
 * logged in to navigate to this path.
 */
orion.accounts.addProtectedRoute('orionDashboard');





if (Meteor.isClient) {
  /**
   * @method orion.links.add
   * @where {client}
   * @public
   * @return {Object}
   *
   * Adds the orion dashboard link to the admin panel.
   * Note that the showDashboardTab Option defines whether
   * the ordering of the link.
   */
  Tracker.autorun(function() {
    /*
    var index = Options.get('showDashboardTab') ? 1 : undefined;
    orion.links.add({
      index: index,
      identifier: 'orion-dashboard',
      title: 'Dashboard',
      routeName: 'orionDashboard',
      activeRouteRegex: 'orionDashboard',
      permission: 'orionDashboard',
      parent: 'ajustes_template'
    });*/
  });


}
