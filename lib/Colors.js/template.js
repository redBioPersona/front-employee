GetColorTemplateBody=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="blue lighten-2";
      break;
      case "Obscuro":
      color="grey darken-2";
      break;
      case "Blanco":
      color="white";
      case "Blanco Light":
      color="white";
      break;
      case "Rosa":
      color="pink lighten-2";
      break;
      case "Papel Light":
      color="https://i.pinimg.com/236x/b0/ce/fb/b0cefbe418bdf71df7ad58a2d4302bc5.jpg";
      break;
    }
  }else {
    color="blue lighten-2";
  }
  return color;
}

GetColorTemplateFooter=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="blue lighten-2";
      break;
      case "Blanco":
      color="gradientX";
      break;
      case "Blanco Light":
      color="white black-text";
      break;
      case "Obscuro":
      color="grey darken-3";
      break;
      case "Rosa":
      color="pink lighten-2";
      break;
      case "Papel Light":
      color="gradientX";
      break;
    }
  }else {
    color="indigo light-green-1";
  }
  return color;
}

GetColorTemplateHeader=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="blue darken-2";
      break;
      case "Blanco":
      color="gradientX";
      break;
      case "Blanco Light":
      color="white";
      break;
      case "Obscuro":
      color="grey darken-4";
      break;
      case "Rosa":
      color="gradientRosaHeader";
      break;
      case "Papel Light":
      color="gradientX";
      break;
    }
  }else {
    color="blue darken-2";
  }
  return color;
}

GetColorTemplateTitle=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="indigo light-green-3";
      break;
      case "Blanco":
      color="red accent-1";
      break;
      case "Blanco Light":
      color="black accent-1";
      break;
      case "Obscuro":
      color="blue-grey darken-3";
      break;
      case "Rosa":
      color="pink light-green-3";
      break;
      case "Papel Light":
      color="red accent-1";
      break;
    }
  }else {
    color="indigo light-green-3";
  }
  return color;
}

GetColorTemplateLogo=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="blue darken-1";
      break;
      case "Blanco":
      color="gradientBlancoLogo";
      break;
      case "Blanco Light":
      color="white";
      break;
      case "Obscuro":
      color="blue-grey darken-2";
      break;
      case "Rosa":
      color="gradientRosaHeader";
      break;
      case "Papel Light":
      color="gradientBlancoLogo";
      break;
    }
  }else {
    color="blue darken-1";
  }
  return color;
}

GetColorTemplateListPrincipal=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="blue darken-1";
      break;
      case "Blanco":
      color="blue-grey darken-2";
      break;
      case "Blanco Light":
      color="black";
      break;
      case "Obscuro":
      color="blue-grey darken-3";
      break;
      case "Rosa":
      color="pink darken-1";
      break;
      case "Papel Light":
      color="blue-grey darken-2";
      break;
    }
  }else {
    color="blue darken-1";
  }
  return color;
}

GetColorIconsHeader=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="black-text";
      break;
      case "Blanco":
      color="black-text";
      break;
      case "Blanco Light":
      color="black-text";
      break;
      case "Obscuro":
      color="white-text";
      break;
      case "Rosa":
      color="white-text";
      break;
       case "Papel Light":
       color="black-text";
      break;
    }
  }else {
    color="blue darken-1";
  }
  return color;
}

GetColorTemplateTextoColecciones=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="black-text";
      break;
      case "Blanco":
      color="black-text";
      break;
      case "Blanco Light":
      color="black-text";
      break;
      case "Obscuro":
      color="white-text";
      break;
      case "Rosa":
      color="black-text";
      break;
      case "Papel Light":
      color="black-text";
      break;
    }
  }else {
    color="black-text";
  }
  return color;
}

GetColorTemplateShowInfo=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="yellow lighten-5";
      break;
      case "Rosa":
      color="yellow lighten-5";
      break;
      case "Blanco":
      color="#b8b8b8";
      break;
      case "Blanco Light":
      color="white";
      break;
      case "Obscuro":
      color="blue-grey lighten-5";
      break;
      case "Papel Light":
      color="white";
      break;
    }
  }else {
    color="yellow lighten-5";
  }
  return color;
}


GetColorIconBack=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="indigo darken-2";
      break;
      case "Rosa":
      color="red darken-1";
      break;
      case "Blanco":
      color="red accent-2";
      break;
      case "Blanco Light":
      color="black accent-2";
      break;
      case "Obscuro":
      color="grey darken-4";
      break;
      case "Papel Light":
      color="black accent-2";
      break;
    }
  }else {
    color="yellow lighten-5";
  }
  return color;
}

GetColorIconCreate=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="indigo darken-2";
      break;
      case "Rosa":
      color="red darken-1";
      break;
      case "Blanco":
      color="red accent-3";
      break;
      case "Blanco Light":
      color="black accent-3";
      break;
      case "Obscuro":
      color="grey darken-4";
      break;
      case "Papel Light":
      color="black accent-3";
      break;
    }
  }else {
    color="yellow lighten-5";
  }
  return color;
}


ColorTextWidget=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="white-text";
      break;
      case "Rosa":
      color="yellow lighten-5";
      break;
      case "Blanco":
      color="black-text";
      break;
      case "Blanco Light":
      color="black-text";
      break;
      case "Obscuro":
      color="white-text";
      break;
      case "Papel Light":
      color="black-text";
      break;
    }
  }else {
    color="yellow lighten-5";
  }
  return color;
}

ColorWidget=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="blue darken-1";
      break;
      case "Rosa":
      color="yellow lighten-5";
      break;
      case "Blanco":
      color="white";
      break;
      case "Blanco Light":
      color="white";
      break;
      case "Obscuro":
      color="grey darken-1";
      break;
      case "Papel Light":
      color="white";
      break;
    }
  }else {
    color="yellow lighten-5";
  }
  return color;
}


ColorLeftWidget=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="blue darken-4";
      break;
      case "Rosa":
      color="red darken-1";
      break;
      case "Blanco":
      color="red accent-1";
      break;
      case "Blanco Light":
      color="black accent-1";
      break;
      case "Obscuro":
      color="grey darken-3";
      break;
      case "Papel Light":
      color="red accent-1";
      break;
    }
  }else {
    color="yellow lighten-5";
  }
  return color;
}

ColorNotifications=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="blue darken-3";
      break;
      case "Rosa":
      color="orange lighten-1";
      break;
      case "Blanco":
      color="red accent-3";
      break;
      case "Blanco Light":
      color="grey accent-3";
      break;
      case "Obscuro":
      color="grey darken-2";
      break;
      case "Papel Light":
      color="red accent-3";
      break;
    }
  }else {
    color="red z-depth-1";
  }
  return color;
}

ColorMensajeNotifications=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      color="blue darken-";
      break;
      case "Rosa":
      color="yellow";
      break;
      case "Blanco":
      color="red accent-4";
      break;
      case "Blanco Light":
      color="grey";
      break;
      case "Obscuro":
      color="grey darken-4";
      break;
      case "Papel Light":
      color="red accent-4";
      break;
    }
  }else {
    color="red z-depth-1";
  }
  return color;
}

ColorTabularIndex=function(){
  var user=Meteor.userId();
  var colorApp=Design_app.findOne({user:user});
  var color;
  if (colorApp!=undefined) {
    var colors=colorApp.color;
    switch (colors) {
      case "Azul":
      Session.set("ColorTabularIndex","Azul");
      color="white lighten-1 black-text z-depth-2";
      break;
      case "Blanco":
      Session.set("ColorTabularIndex","Blanco");
      color="white black-text z-depth-2";
      break;
      case "Blanco":
      Session.set("ColorTabularIndex","Blanco");
      color="white black-text z-depth-2";
      break;
      case "Obscuro":
      Session.set("ColorTabularIndex","Obscuro");
      color="blue-grey darken-3 white-text z-depth-2";
      break;
      case "Rosa":
      Session.set("ColorTabularIndex","Rosa");
      color="pink light-green-3 white-text z-depth-2";
      break;
      case "Papel Light":
      Session.set("ColorTabularIndex","Blanco");
      color="white black-text z-depth-2";
      break;
    }
  }else {
    color="white black-text z-depth-2";
  }
  return color;
}