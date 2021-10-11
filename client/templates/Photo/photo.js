import 'tracking/build/tracking';
import 'tracking/build/data/face';
import 'tracking/examples/assets/stats.min';

if (Meteor.isClient) {
  var stream;
  var closeAndCallback;
  var photo = new ReactiveVar(null);
  var error = new ReactiveVar(null);
  var waitingForPermission = new ReactiveVar(null);
  var canvasWidth = 0;
  var canvasHeight = 0;
  var quality = 100;

  Template.viewfinder.rendered = function() {
    var template = this;
    waitingForPermission.set(true);
    var video = template.find("video");

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(1);
    tracker.setStepSize(5);
    tracker.setEdgesDensity(0.1);
    tracking.track('#video', tracker, { camera: true });

    tracker.on('track', function(event) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (event.data.length === 0) {
        var exists = Session.get("ExistsPersonFrontCamera");
        if (exists != false) {
          Session.set('ExistsPersonFrontCamera', false);
        }
      } else {
        var acceso = Access_temp.findOne();
        if (acceso == undefined) {
          var exists = Session.get("ExistsPersonFrontCamera");
          if (exists != true) {
            var LastPersonDate = Session.get("ExistsPersonFrontCameraDate");
            if (LastPersonDate == undefined) {
              Session.set('ExistsPersonFrontCamera', true);
            } else {
              var actual = new Date();
              var diferencia = actual - LastPersonDate;
              if (diferencia > 3000) {
                Session.set('ExistsPersonFrontCamera', true);
              } else {
                Session.set('ExistsPersonFrontCamera', false);
              }
            }
          }
        }
      }
    });

    var success = function(newStream) {
      stream = newStream;
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        //video.src = vendorURL.createObjectURL(stream);
        video.srcObject = stream;
      }
      video.play();
      waitingForPermission.set(false);
    };


    var failure = function(err) {
      error.set(err);
    };


    navigator.getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );

    if (!navigator.getUserMedia) {
      failure("BROWSER_NOT_SUPPORTED");
      return;
    }


    navigator.getUserMedia({
      video: true,
      audio: false
    }, success, failure);


    var viewfinderWidth = "100%";
    var viewfinderHeight = "100%";

    if (Meteor.Device.isPhone()) {
      viewfinderWidth = 240;
      viewfinderHeight = 320;
    }
    var resized = false;
    video.addEventListener('canplay', function() {
      if (!resized) {
        video.setAttribute('width', viewfinderWidth);
        video.setAttribute('height', viewfinderHeight);
        resized = true;
      }
    }, false);
  };


  var permissionDeniedError = function() {
    return error.get() && (
      error.get().name === "PermissionDeniedError" ||
      error.get() === "PERMISSION_DENIED"
    );
  };


  var browserNotSupportedError = function() {
    return error.get() && error.get() === "BROWSER_NOT_SUPPORTED";
  };

  var stopStream = function(st) {
    if (!st) {
      return;
    }

    if (st.stop) {
      st.stop();
      return;
    }

    if (st.getTracks) {
      var tracks = st.getTracks();
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        if (track && track.stop) {
          track.stop();
        }
      }
    }
  };


  Template.camera.helpers({
    photo: function() {
      return photo.get();
    },
    error: function() {
      return error.get();
    },
    permissionDeniedError: permissionDeniedError,
    browserNotSupportedError: browserNotSupportedError
  });

  Template.camera.events({
    "click .use-photo": function() {
      closeAndCallback(null, photo.get());
    },
    "click .new-photo": function() {
      photo.set(null);
    },
    "click .cancel": function() {
      if (permissionDeniedError()) {
        closeAndCallback(new Meteor.Error("permissionDenied", "Camera permissions were denied."));
      } else if (browserNotSupportedError()) {
        closeAndCallback(new Meteor.Error("browserNotSupported", "This browser isn't supported."));
      } else if (error.get()) {
        closeAndCallback(new Meteor.Error("unknownError", "There was an error while accessing the camera."));
      } else {
        closeAndCallback(new Meteor.Error("cancel", "Photo taking was cancelled."));
      }

      if (stream) {
        stopStream(stream);
      }
    }
  });

  Template.viewfinder.events({
    'click .shutter': function(event, template) {
      var video = template.find("video");
      var canvas = template.find("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvasWidth, canvasHeight);
      var data = canvas.toDataURL('image/jpeg', 1);
      photo.set(data.replace(/^data:image\/(png|jpeg);base64,/, ""));
    }
  });

  Template.viewfinder.getVideo = function(template, callback) {
    var video = $('#video').get(0);
    var canvas = $('#canvas').get(0);
    if (Meteor.Device.isPhone()) {
      canvas.width = 480;
      canvas.height = 360;
    } else {
      canvas.width = 480;
      canvas.height = 360;
    }

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL('image/png', quality);
    photo.set(data.replace(/^data:image\/(png|jpeg);base64,/, ""));
    photo.set(data);
    callback(data.replace(/^data:image\/(png|jpeg);base64,/, ""));
    canvas.width = 0;
    canvas.height = 0;
  }

  Template.viewfinder.helpers({
    "waitingForPermission": function() {
      return waitingForPermission.get();
    },
    "getVideo": function(template) {
      var video = template.find("video");
      var canvas = template.find("canvas");

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvasWidth, canvasHeight);
      var data = canvas.toBlob('image/jpeg', 1);
      photo.set(data);
    }
  });

}
