Accesscontrol.allow({
    insert: function() {return true;},
    // update: function() {return false;},
    remove: function() {return true;},
    // upsert: function () { return false; }
  });

  Meteor.users.allow({
  	update: function () {return true;}
});

orion.filesystem.collection.allow({
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  },
});
