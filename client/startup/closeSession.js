var heartbeatInterval = (2*60*1000);
var activityEvents = 'mousemove click keydown';
var activityDetected = false;
var activityNotDetected=[];

Meteor.startup(function() {
    Meteor.setInterval(function() {
        var close=false;
        var pushing=false;
        if (Meteor.userId() && activityDetected) {
            Meteor.call('heartbeat',function(err,res){
                if(err){
                    close=true;                    
                }
                if(res){
                    if(res=="ok"){
                        close=false;                    
                        activityNotDetected=[];                        
                    }else{
                        close=true;
                    }
                    
                }
            });
            activityDetected = false;
        }else{
            if(Meteor.userId()){
                activityNotDetected.push("");
                if(activityNotDetected.length==5){
                    close=true;
                }
            }                        
        }
        if(close==true){
            Meteor.logout(function (err) {
                if (!err) {
                    Object.keys(Session.keys).forEach(function (key) {
                      Session.set(key, undefined);
                    });
                    Session.keys = {};
                    Router.go('/');
                }
            });
        }
    }, heartbeatInterval);

    $(document).on(activityEvents, function() {
       activityDetected = true;
    });
});