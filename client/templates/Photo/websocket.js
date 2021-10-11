/*import 'tracking/build/tracking';
import 'tracking/build/data/face';
import 'tracking/build/data/eye';
import 'tracking/build/data/mouth';
import 'tracking/examples/assets/stats.min';
*/

// NEW BEGIN
import faceapi from  './face-api'

let withFaceLandmarks = true
let withBoxes = false


let inputSize = 128
let scoreThreshold = 0.7


function resizeCanvasAndResults(canvas, results) {
  var video = $('#video').get(0);
  canvas.width = video.clientWidth ;
  canvas.height = video.clientHeight;
  return results.map(res => res.forSize(canvas.width,canvas.height));
}

function drawDetections(dimensions, canvas, detections) {
  const resizedDetections = resizeCanvasAndResults(canvas, detections)
  faceapi.drawDetection(canvas, resizedDetections)
}

function drawLandmarks(dimensions, canvas, results, withBoxes = true) {
  const resizedResults = resizeCanvasAndResults(canvas, results)

  if (withBoxes) {
    faceapi.drawDetection(canvas, resizedResults.map(det => det.detection))
  }

  const faceLandmarks = resizedResults.map(det => det.landmarks)
  const drawLandmarksOptions = {
    lineWidth: 2,
    drawLines: true,
    color: 'yellow'
  }
  faceapi.drawLandmarks(canvas, faceLandmarks, drawLandmarksOptions)
}

function isFaceDetectionModelLoaded() {
  return !!faceapi.nets.tinyFaceDetector.params
}

async function onPlay(who) {
  // console.log("onPlay")
    const videoEl = $('#video').get(0)
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var arcWidth = canvas.width;
    var arcHeight = canvas.height;
    var sidesize= 100;
    var rectGW = Math.round(arcWidth / 2)-sidesize/2;
    var rectGH = Math.round(arcHeight / 2)-sidesize/2;

    if (videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded()){
      return setTimeout(() => onPlay(),500)
    }
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
    const ts = Date.now()
    const faceDetectionTask = faceapi.detectSingleFace(videoEl, options)
    const result = withFaceLandmarks
      ? await faceDetectionTask.withFaceLandmarks()
      : await faceDetectionTask

    const drawFunction = withFaceLandmarks
      ? drawLandmarks
      : drawDetections
    if (result) {
      // console.log("CARA ENCONTRADA")
      drawFunction(videoEl, $('#canvas').get(0), [result], withBoxes);

      if (Session.get("FaceWaitingResponse") == undefined || Session.get("FaceWaitingResponse") == false) {
        console.log("result",result);
        if (result.detection && result.detection.box) {


       //   var resizedResults = resizeCanvasAndResults(canvas,[result])
            var rectCX =  (canvas.width *  result.alignedRect.box.x)/result.alignedRect.imageWidth ;
            var rectCY =  (canvas.height * result.alignedRect.box.y)/result.alignedRect.imageHeight;
            var rectCW =  (canvas.width *  result.alignedRect.box.width)/result.alignedRect.imageWidth ;
            var rectCH = (canvas.height *  result.alignedRect.box.height)/result.alignedRect.imageHeight;

            context.lineWidth = 2;
            context.strokeStyle = '#00ff00';
            context.setLineDash([5, 3]);
            context.strokeRect(rectGW, rectGH, sidesize, sidesize);
            context.stroke();

            context.strokeStyle = '#0000ff';
            context.lineWidth = 2;
            context.setLineDash([]);
            context.strokeRect(rectCX, rectCY, rectCW, rectCH);

            context.font = '14px Helvetica';
            context.fillStyle = "#000";
            // context.fillText('x: ' + rectCX + 'px', rectCX + 5, rectCY + 11);
            // context.fillText('y: ' + rectCY + 'px', rectCX + 5, rectCY + 25);

            context.fillText('x: ' + Number(rectCX + rectCW) + 'px', rectCX + rectCW + 5, rectCY + rectCH + 11);
            context.fillText('y: ' + Number(rectCY + rectCH) + 'px', rectCX + rectCW + 5, rectCY + rectCH + 25);
            context.stroke();

            /* BY RAFA
            console.log("rectCX "+rectCX+" <= rectGW "+rectGW);
            console.log("rectCW "+rectCW+" >= sidesize "+sidesize);
            console.log("rectGH "+rectGH+" >= rectCY "+rectCY);
            console.log("rectCH "+rectCH+" >= sidesize "+sidesize);
            if (rectCX <= rectGW && (rectCW <= sidesize) && rectGH >= rectCY && (rectCH >=  sidesize)) {
            */

            console.log("rectCX "+rectCX+" >= rectGW "+rectGW);
            console.log("rectCX + rectCW "+rectCX + rectCW+" <= rectGW + sidesize "+rectGW + sidesize);
            console.log("rectGH "+rectGH+" <= rectCY "+rectCY);
            console.log("rectCY + rectCH "+rectCY + rectCH+" <= rectGH + sidesize "+rectGH + sidesize);
            if (rectCX >= rectGW && (rectCX + rectCW <= rectGW + sidesize) && rectGH <= rectCY && (rectCY + rectCH <= rectGH + sidesize)) {

              console.log("into");
              // console.log("Ancho G "+xRefWidth+" ancho C "+rectCW+" diferencia :"+Math.abs(xRefWidth-rectCW));
              // console.log("Alto G "+yRefHeight+" Alto C "+rectCH+" diferencia :"+Math.abs(yRefHeight-rectCH));

           //   if (Math.abs(xRefWidth - rectCW) <= 90 && Math.abs(yRefHeight - rectCH) <= 90) {
                Session.set("procesando_verificacion", undefined);
                if (Sensors.findOne({ FaceService: true }) != undefined) {
                  if (Session.get("FaceWaitingResponse") == undefined || Session.get("FaceWaitingResponse") == false) {
                    Session.set("FaceWaitingResponse", true);
                    var video = $('#video').get(0);
                    var canvasvideo = $('#canvasvideo').get(0);
                    if (Meteor.Device.isPhone()) {
                      canvas.width = 480;
                      canvas.height = 360;
                    } else {
                      canvas.width = 480;
                      canvas.height = 360;
                    }
                    canvasvideo.getContext('2d').drawImage(video, 0, 0);
                    var data = canvasvideo.toDataURL('image/jpeg', 1);
                    var base64 = data.replace(/^data:image\/(png|jpeg);base64,/, "");

                    Meteor.call("ToWSFaceValidator", base64, "VerifyFace", "");
                    Session.set("procesando_verificacion", "Rostro encontrado");
                  }
                }
           //   }
            }
            else {
              console.log("no into");
            }
          }

           /* setTimeout(function () {
              // console.log("Limpiando");
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.lineWidth = 3;
              context.strokeStyle = '#00ff00';
              context.setLineDash([5, 3]);
              context.strokeRect(rectGW, rectGH, sidesize, sidesize);
              // console.log("Dibujando en el gde");
              context.stroke();
              Session.set("procesando_verificacion", undefined);
            }, 500);

          });*/

        }
    } else{
      //console.log("CARA NO ENCONTRADA")
      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.lineWidth = 1;
      context.strokeStyle = '#00ff00';
      context.setLineDash([5, 3]);
      context.strokeRect(rectGW, rectGH, sidesize, sidesize);
      context.stroke();
    }
    setTimeout(() => onPlay(),1000)
  }
// NEW END


if (Meteor.isClient) {
  var stream;
  var closeAndCallback;
  var photo = new ReactiveVar(null);
  var error = new ReactiveVar(null);
  var waitingForPermission = new ReactiveVar(null);
  var canvasWidth = 0;
  var canvasHeight = 0;
  var quality = 100;

  Template.viewfinderX.rendered = function () {
    var template = this;

    // NEW
    if (!isFaceDetectionModelLoaded()) {
      faceapi.loadTinyFaceDetectorModel('/models')
      faceapi.loadFaceLandmarkModel('/models')
    }

    waitingForPermission.set(true);

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var arcWidth = video.clientWidth;
    var arcHeight = video.clientHeight;
    var sidesize= 100;
    var rectGW = Math.round(arcWidth / 2)-sidesize/2;
    var rectGH = Math.round(arcHeight / 2)-sidesize/2;

    var canvasWidth = video.clientHeight;
    var canvasHeight = video.clientWidth;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.lineWidth = 1;
    context.strokeStyle = '#00ff00';
    context.setLineDash([5, 3]);
    context.strokeRect(rectGW, rectGH, sidesize, sidesize);
    // console.log("x "+rectGW+" y "+rectGH+" w "+xRefWidth+" h "+yRefHeight);
    // context.strokeRect((canvasWidth/2)-(xRefWidth/2), (canvasHeight/2)-(yRefHeight/2), xRefWidth, yRefHeight);
    context.stroke();

    // NEW
    onPlay(this);

    if (false) { //Session.get("FaceWaitingResponse") == undefined || Session.get("FaceWaitingResponse") == false || Session.get("waitingAfterFinding") == false || Session.get("waitingAfterFinding") == undefined) {
      var tracker = new tracking.ObjectTracker(['face']);
      tracker.setInitialScale(1);
      tracker.setStepSize(5);
      tracker.setEdgesDensity(0.1);
      tracking.track('#video', tracker, { camera: true });

      tracker.on('track', function (event) {
        // if(Sensors.findOne({FaceService:true})!=undefined){
        if (Session.get("FaceWaitingResponse") == undefined || Session.get("FaceWaitingResponse") == false) {
          //console.log("Limpiando el canvas");
          //context.clearRect(0, 0, canvas.width, canvas.height);
          if (event.data.length != 0) {
            event.data.forEach(function (rect) {
              var rectCX = rect.x;
              var rectCY = rect.y;
              var rectCW = rect.width;
              var rectCH = rect.height;

              context.lineWidth = 3;
              context.strokeStyle = '#ffff00';
              context.setLineDash([5, 3]);
              context.strokeRect(rectGW, rectGH, xRefWidth, yRefHeight);
              context.stroke();

              context.strokeStyle = '#00ff00';
              context.lineWidth = 2;
              context.setLineDash([]);
              context.strokeRect(rectCX, rectCY, rectCW, rectCH);

              context.font = '18px Helvetica';
              context.fillStyle = "#000";
              context.fillText('x: ' + rectCX + 'px', rectCX + 5, rectCY + 11);
              context.fillText('y: ' + rectCY + 'px', rectCX + 5, rectCY + 25);

              context.fillText('x: ' + Number(rectCX + rectCW) + 'px', rectCX + rectCW + 5, rectCY + rectCH + 11);
              context.fillText('y: ' + Number(rectCY + rectCH) + 'px', rectCX + rectCW + 5, rectCY + rectCH + 25);
              context.stroke();

              // console.log("rectCX "+rectCX+" rectCY "+rectCY+" rectCW "+rectCW+" rectCH "+rectCH);
              // console.log("rectGW "+rectGW+" rectGH "+rectGH+" xRefWidth "+xRefWidth+" yRefHeight "+yRefHeight);

              if (rectCX >= rectGW && (rectCX + rectCW <= rectGW + xRefWidth) && rectGH <= rectCY && (rectCY + rectCH <= rectGH + yRefHeight)) {
                // console.log("Ancho G "+xRefWidth+" ancho C "+rectCW+" diferencia :"+Math.abs(xRefWidth-rectCW));
                // console.log("Alto G "+yRefHeight+" Alto C "+rectCH+" diferencia :"+Math.abs(yRefHeight-rectCH));

                if (Math.abs(xRefWidth - rectCW) <= 90 && Math.abs(yRefHeight - rectCH) <= 90) {
                  Session.set("procesando_verificacion", undefined);
                  if (Sensors.findOne({ FaceService: true }) != undefined) {
                    if (Session.get("FaceWaitingResponse") == undefined || Session.get("FaceWaitingResponse") == false) {
                      Session.set("FaceWaitingResponse", true);
                      var video = $('#video').get(0);
                      var canvasvideo = $('#canvasvideo').get(0);
                      if (Meteor.Device.isPhone()) {
                        canvas.width = 480;
                        canvas.height = 360;
                      } else {
                        canvas.width = 480;
                        canvas.height = 360;
                      }
                      canvasvideo.getContext('2d').drawImage(video, 0, 0);
                      var data = canvasvideo.toDataURL('image/jpeg', 1);
                      var base64 = data.replace(/^data:image\/(png|jpeg);base64,/, "");

                      Meteor.call("ToWSFaceValidator", base64, "VerifyFace", "");
                      Session.set("procesando_verificacion", "Rostro encontrado");
                    }
                  }
                }
              }

              setTimeout(function () {
                // console.log("Limpiando");
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.lineWidth = 3;
                context.strokeStyle = '#ffff00';
                context.setLineDash([5, 3]);
                context.strokeRect(rectGW, rectGH, xRefWidth, yRefHeight);
                // console.log("Dibujando en el gde");
                context.stroke();
                Session.set("procesando_verificacion", undefined);
              }, 500);

            });
          }
        } else {
          // console.log("esta procesando 1..");
        }
        // }
      });
    } else {
      // console.log("esta procesando..");
    }



    var success = function (newStream) {
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

    fixBinary = function (bin) {
      var length = bin.length;
      var buf = new ArrayBuffer(length);
      var arr = new Uint8Array(buf);
      for (var i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
      }
      return buf;
    }

    var failure = function (err) {
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

    var video = $('#video').get(0);

    if (Meteor.Device.isPhone()) {
      viewfinderWidth = video.clientWidth;
      viewfinderHeight = video.clientHeight;
    }
    var resized = false;
    video.addEventListener('canplay', function () {
      if (!resized) {
        video.setAttribute('width', viewfinderWidth);
        video.setAttribute('height', viewfinderHeight);
        resized = true;
      }
    }, false);
  };

  var permissionDeniedError = function () {
    return error.get() && (
      error.get().name === "PermissionDeniedError" ||
      error.get() === "PERMISSION_DENIED"
    );
  };

  var browserNotSupportedError = function () {
    return error.get() && error.get() === "BROWSER_NOT_SUPPORTED";
  };

  var stopStream = function (st) {
    if (!st) { return; }

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
    photo: function () {
      return photo.get();
    },
    error: function () {
      return error.get();
    },
    permissionDeniedError: permissionDeniedError,
    browserNotSupportedError: browserNotSupportedError
  });

  Template.camera.events({
    "click .use-photo": function () {
      closeAndCallback(null, photo.get());
    },
    "click .new-photo": function () {
      photo.set(null);
    },
    "click .cancel": function () {
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


  Template.viewfinderX.getVideo = function (template, callback) {
    var video = $('#video').get(0);
    var canvas = $('#canvas').get(0);
    if (Meteor.Device.isPhone()) {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
    } else {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
    }
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL('image/png', quality);
    photo.set(data.replace(/^data:image\/(png|jpeg);base64,/, ""));
    photo.set(data);
    callback(data.replace(/^data:image\/(png|jpeg);base64,/, ""));
    canvas.width = 0;
    canvas.height = 0;
  }

  Template.viewfinderX.helpers({
    "waitingForPermission": function () {
      return waitingForPermission.get();
    },
    "getVideo": function (template) {
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
