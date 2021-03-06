import 'tracking/build/tracking';
import 'tracking/build/data/face';
import 'tracking/build/data/eye';
import 'tracking/build/data/mouth';
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
  var trackerTask;

  Template.Tracking.rendered = function() {
    var template = this;
    waitingForPermission.set(true);
    var video = template.find("video");
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var videoXxx = document.getElementById('video');
    var arcWidth = videoXxx.clientWidth;
    var arcHeight = videoXxx.clientHeight;
    var rectGW = Math.round((arcWidth / 4));
    var rectGH = Math.round((arcHeight / 6));
    var xRefWidth = Math.round((arcWidth / 4));
    var yRefHeight = Math.round((arcHeight / 3));
    var canvasWidth = 480;
    var canvasHeight = 360;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // context.lineWidth = 1;
    // context.strokeStyle = '#ffff00';
    // context.setLineDash([5, 3]);
    // context.strokeRect(rectGW, rectGH, xRefWidth, yRefHeight);
    // context.stroke();

    var tracker = new tracking.ObjectTracker(['face']);
    tracker.setInitialScale(4);
    tracker.setStepSize(5);
    tracker.setEdgesDensity(0.1);
    trackerTask = tracking.track('#video', tracker, {
      camera: true
    });
    trackerTask.on('track', function(event) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      // context.lineWidth = 1;
      // context.strokeStyle = '#ffff00';
      // context.setLineDash([5, 3]);
      // context.strokeRect(rectGW, rectGH, xRefWidth, yRefHeight);
      // context.stroke();
      if (event.data.length != 0) {
        try {
          event.data.forEach(function(rect) {
            var rectCX = rect.x;
            var rectCY = rect.y;
            var rectCW = rect.width;
            var rectCH = rect.height;

            context.strokeStyle = '#0000ff';
            context.lineWidth = 2;
            context.setLineDash([]);
            context.strokeRect(rectCX, rectCY, rectCW, rectCH);

            context.font = '15px Helvetica';
            context.fillStyle = "#000";
            context.fillText('x: ' + rectCX + 'px', rectCX + 5, rectCY + 11);
            context.fillText('y: ' + rectCY + 'px', rectCX + 5, rectCY + 22);
            context.stroke();

            // if (rectCX >= rectGW && (rectCX + rectCW <= rectGW + xRefWidth) && rectGH <= rectCY && (rectCY + rectCH <= rectGH + yRefHeight)) {
              if (Math.abs(xRefWidth - rectCW) <= 90 && Math.abs(yRefHeight - rectCH) <= 90) {
                if (Sensors.findOne({ FaceService: true }) != undefined) {
                  // if (Session.get("ImProcessing")==undefined || Session.get("ImProcessing")==false) {
                    var ImProcessingDate=Session.get("ImProcessingDate");
                    if(ImProcessingDate==undefined){
                      var t = new Date();
                      t.setSeconds(t.getSeconds() - 10);
                      Session.set("ImProcessingDate",t);
                    }
                    var ahora=new Date();
                    if ((Session.get("ImProcessing")==false || Session.get("ImProcessing")==undefined ) && (Math.abs(ahora.getTime()-ImProcessingDate.getTime())>=2000)){
                      var video = $('#video').get(0);
                      var canvasvideo = $('#canvasvideo').get(0);
                      if (Meteor.Device.isPhone()) {
                        canvas.width = 640;
                        canvas.height = 480;
                      } else {
                        canvas.width = 640;
                        canvas.height = 480;
                      }
                      canvasvideo.getContext('2d').drawImage(video, 0, 0);
                      var data = canvasvideo.toDataURL('image/jpeg', 1);
                      var base64 = data.replace(/^data:image\/(png|jpeg);base64,/, "");
                      Session.set("ImProcessing", true);
                      Session.set("ImProcessingDate", new Date());
                      console.log("Enviando muestra al validador...."+ new Date());
                      Meteor.call("ToWSFaceValidator", base64, "VerifyFace");
                      // trackerTask.stop();
                      throw BreakException;
                  }else{
                    console.log("ImProcessing "+Session.get("ImProcessing"));
                  }
                }else{
                  console.log("Sensors");
                }
              }else {
                console.log("90");
              }
            // }
            });
          } catch (e) {
          }finally{
            setTimeout(function () { trackerTask.run(); }, 5000);
          }
        }
    });


    var success = function(newStream) {
      stream = newStream;
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.srcObject = stream;
      }
      video.play();
      waitingForPermission.set(false);
    };

    fixBinary = function(bin) {
      var length = bin.length;
      var buf = new ArrayBuffer(length);
      var arr = new Uint8Array(buf);
      for (var i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
      }
      return buf;
    }

    var failure = function(err) {
      error.set(err);
    };

    // navigator.getUserMedia = (
    //   navigator.getUserMedia ||
    //   navigator.webkitGetUserMedia ||
    //   navigator.mozGetUserMedia ||
    //   navigator.msGetUserMedia
    // );

    navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

      if (!navigator.getUserMedia) {
        failure("BROWSER_NOT_SUPPORTED");
        return;
      }

      navigator.getMedia({
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



    Template.Tracking.getVideo = function(template, callback) {
      var video = $('#video').get(0);
      var canvas = $('#canvas').get(0);
      if (Meteor.Device.isPhone()) {
        canvas.width = 640;
        canvas.height = 480;
      } else {
        canvas.width = 640;
        canvas.height = 480;
      }
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      var data = canvas.toDataURL('image/png', quality);
      photo.set(data.replace(/^data:image\/(png|jpeg);base64,/, ""));
      photo.set(data);
      callback(data.replace(/^data:image\/(png|jpeg);base64,/, ""));
      canvas.width = 0;
      canvas.height = 0;
    }

    Template.Tracking.helpers({
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
