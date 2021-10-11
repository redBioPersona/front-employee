if (Meteor.isServer) {
  Meteor.methods({
      FindPerson: function(id,acceso) {
        FindPerson(id,acceso);
      }
    });
}
