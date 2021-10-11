GetColorGraphic=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="shine";
      break;
      case "Obscuro":
      color="dark";
      break;
      case "Blanco":
      color="shine";
      break;
      case "Rosa":
      color="infographic";
      break;
    }
  }else {
    color="shine";
  }
  return color;
}
