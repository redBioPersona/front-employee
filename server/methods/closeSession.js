var staleSessionPurgeInterval =  (1*60*1000);
var inactivityTimeout = (3*60*1000);
var forceLogout = false;
var closeSession=false;

Meteor.methods({
    heartbeat: function(options) {
        if (!this.userId) {
            return "err";
        }
        var user = Meteor.users.findOne(this.userId);
        if (user) {
            if(closeSession){
                return "err";
            }else{
                Meteor.users.update(user._id, {$set: {heartbeat: new Date()}});
                return "ok";
            }            
        }else{
            return "notFound";
        }
    }
});

if (forceLogout !== false) {
    Meteor.setInterval(function() {
        var now = new Date(), overdueTimestamp = new Date(now-inactivityTimeout);
        var usersLoggedOut =Meteor.users.update({heartbeat: {$lt: overdueTimestamp}},
                            {$set: {'services.resume.loginTokens': [], forceLogout: true},
                            $unset: {heartbeat:1}},
                            {multi: true});
        if (usersLoggedOut > 0) {
            closeSession=true;
            console.log("==== users logged out: " + usersLoggedOut);
        }else{
            console.log("usersLoggedOut not possitive")
        }
    }, staleSessionPurgeInterval);
}