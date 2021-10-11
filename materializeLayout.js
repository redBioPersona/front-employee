if (Meteor.isClient) {

  Template.orionMaterializeLogin_XP.onCreated(function () {
  Tracker.autorun(() => {
    Meteor.subscribe('get_Config_application');
  });
});

  Template.version_Template.helpers({
    anio:function(){
      return moment().format('YYYY');
    }
  });

  Template.orionMaterializeLogin_XP.helpers({
    IsServer:function(){
      var da=false;
      var isStation=Config_application.findOne({"active":true});
			if(isStation!=undefined && isStation.isServer!=undefined){
				da=isStation.isServer;
      }
      return da;
    },
    PersonFound:function(){
      var result=false;
      if(Session.get("Verification_face")!=undefined){
        result=true;
      }
      return result;
    },
    AccessWithFace:function(){
      var result=true;
      var omar = Sensors.find({ "FaceService": true }).count();
      if (omar == 0) {
				result=false;
			}

      // var da=false;
      // var isStation=Config_application.findOne({"active":true});
      // console.log("isStation "+JSON.stringify(isStation));
      // if(isStation!=undefined && isStation.AccessWithFace!=undefined){
      //   da=isStation.AccessWithFace;
      // }
      return result;
    },
    img:function(){
        if(Session.get("Verification_face")==undefined){
          $("#Ingresar").addClass('disabled');
          return "images/employee.png";
        }else{
          $("#Ingresar").removeClass('disabled');
          return Session.get("Verification_face");
        }
    },
    clean:function(){
      if(Session.get("Verification_face")!=undefined){
        setTimeout(() => {
          Session.set("Verification_face",undefined);
          Session.set("Verification_face_id",undefined);
        }, 5000);
      }

      var get_url = window.location.toString();
      if(get_url.includes("my-account")){
        Router.go('/')
      }
    }
  });

  Template.orionMaterializeLogin_XP.onRendered(function() {
    $("#Ingresar").addClass('disabled');
    Router.go("/");
  });

  Template.orionMaterializeLogin_XP.events({
    'click #Ingresar': function(event) {
       if(Session.get("Verification_face_id")!=undefined){
          Meteor.loginWithPassword(Session.get("Verification_face_id")+"@mbes.com","pancholopez", function(error){
            if(error){
                console.log(error.reason);
            } else {
                Router.go("/admin");
            }
        });
       }
     }
  });

  Template.orionMaterializeLayout_XP.onCreated(function () {
    if (!Meteor.userId()) {
      Router.go("/");
    }else{
      var MyLastActivity=Session.get("MyLastActivity");
      if (MyLastActivity==undefined) {
        MyLastActivity=new Date();
      }
      console.log("MyLastActivity "+MyLastActivity);
      Tracker.autorun(() => {
        Meteor.subscribe('get_Design_app');
      });
    }
});

Template.orionMaterializeLayout_XP.onRendered(function() {
  Tracker.autorun(() => {
    if (!Meteor.userId()) {
      Router.go("/");
    }
  });
});


  Template.orionMaterializeLayout_XP.helpers({
    dataReady: function() {
      var isReady = globalSubscriptionHandles.every(function(handle) {
        return handle.ready();
      });
      return isReady;
    },
    gotoLogin: function() {
      Router.go("/");
    },
    colorBody:function(){
      var color=GetColorTemplateBody();
      return color;
    },
    colorFooter:function(){
      var color=GetColorTemplateFooter();
      return color;
    }
  });


  Template.orionMaterializeHeaderContainer_XP.onCreated(function () {
    Tracker.autorun(() => {
      Meteor.subscribe('companies');
      Meteor.subscribe('JustMyProfile',Meteor.userId());
      Meteor.subscribe('getNotificaciones');
    });
  });

  Template.orionMaterializeHeaderContainer_XP.onRendered(function() {
    $('#sidenav-overlay').click();
    $('.button-collapse').sideNav();
    $('.dropdown-button').dropdown({
      constrain_width: false
    });
  });

  Template.orionMaterializeHeaderContainer_XP.events({
    'click .logout': function(event) {
      event.preventDefault();
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
  });


  Template.orionMaterializeHeaderContainer_XP.helpers({
    logo: function() {
      var result="/img/logo_mbes.png";
      var _userId = Meteor.userId();
      var res = Meteor.users.findOne({"_id": _userId});
      if (res && res.profile.idcompany) {
        var ids=[];
        _ids = res.profile.idcompany;
        var dataP=Companies.findOne({"_id":_ids[0]},{fields:{logo:1}});
        if(dataP!=undefined && dataP.logo!=undefined){
          result=dataP.logo.url;
        }
      }
      return result;
    },
    ImgUser:function(){
      var result="/images/no-photo.png";
      var _userId = Meteor.userId();
      var res = Meteor.users.findOne({"_id": _userId});
      if (res && res.profile.idEmployee) {
        var _id = res.profile.idEmployee;
        var dataP=Persons.findOne({"_id":_id},{fields:{face:1}});
        if(dataP!=undefined && dataP.face!=undefined){
          result=dataP.face.url;
        }
      }
      return result;
    },
    getNotificacionesNoLeidas: function() {
      var numnot = Notificaciones.find({"not_status": "No Leído"}).count();
      if (!numnot || numnot == 0) {
        return "";
      } else {
        return numnot;
      }
    },
    GetColorIconsHeader:function(){
      return GetColorIconsHeader();
    },
    getClassNotificacionesNoLeidas: function() {
      var numnot = Notificaciones.find({"not_status": "No Leído"}).count();
      if (!numnot || numnot == 0) {
        return "";
      } else {
        return ColorNotifications();
      }
    },
    hayNotificacionesNoLeidas: function() {
      var numnot = Notificaciones.find({"not_status": "No Leído"}).count();
      if (!numnot || numnot == 0) {
        return false;
      } else {
        return true;
      }
    },
    colorHeader:function(){
      var color=GetColorTemplateHeader();
      return color;
    },
    colorTitle:function(){
      var color=GetColorTemplateTitle();
      return color;
    },
    IngresoConCorreo: function () {
      var result=true;
      var _userId = Meteor.userId();
      var res = Meteor.users.findOne({"_id": _userId});
      if (res && res.profile && res.profile.face) {
        result=false;
      }
      return result;
    }
  });

  Template.orionMaterializeTabs_XP.onRendered(function() {
    this.$('ul.tabs').tabs();
  });

  Template.orionMaterializeTabs_XP.helpers({
    items: function() {
      return this;
    },

  });

  Template.orionMaterializeTabs_XP.events({
    'click a': function() {
      this.onClick();
    }
  });

  Template.orionMaterializeSidebar_XP.helpers({
    color: function() {
      var colors=GetColorTemplateLogo();
      return colors;
    },
    logo: function() {
      var result="/img/logo_mbes.png";
      var _userId = Meteor.userId();
      var res = Meteor.users.findOne({"_id": _userId});
      if (res && res.profile.idcompany) {
        var _id = res.profile.idcompany;
        var dataP=Companies.findOne({"_id":_id},{fields:{logo:1}});
        if(dataP!=undefined && dataP.logo!=undefined){
          result=dataP.logo.url;
        }
      }
      return result;
    }
  });

  Template.orionMaterializeSidebarLink_XP.helpers({
    color: function() {
      var colors=GetColorTemplateListPrincipal();
      return colors;
    },
    colorColecciones: function() {
      var colors=GetColorTemplateBody();
      return colors;
    },
    colorTextoColecciones: function() {
      var colors=GetColorTemplateTextoColecciones();
      return colors;
    },
    collectionTitle:function(msj){
      console.log("ti "+msj);
    }
  });


  Template.orionMaterializeSidebar_XP.onRendered(function() {
    this.autorun(function() {
      var depend = orion.links._collection.find().fetch();
      $('.materialize-sidebar .collapsible').collapsible();
    })
  });

  AutoForm.addHooks('updateProfileForm', {
    onSuccess: function() {
      RouterLayer.go('myAccount.index');
    }
  });

  AutoForm.addHooks('accountsUpdateProfileForm', {
    onSuccess: function(formType, result) {
      var url=window.location.toString();
      var _id=url.substr(-24);
      var usuario=_id.substr(0,17);
      var dato=Design_app.find({"user":usuario}).count();
      if (dato==0) {
        Design_app.insert({"color":"Azul","user":usuario});
      }
    }
  });
}
