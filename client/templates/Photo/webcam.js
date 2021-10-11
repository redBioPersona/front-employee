Template.webcam.onRendered(function() {
	var video = document.getElementById('video');
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
	}

	// Webcam.on( 'error', function(err) {
	// 	  sAlert.error(err);
	// });
	//
	// Webcam.set({
	// 	width: 320,
	// 	height: 240,
  //   // enable_flash: true,
	// 	dest_width: 480,
	// 	dest_height: 360,
	// 	image_format: 'jpeg',
  //   // flip_horiz: true,
	// 	jpeg_quality: 100
	// });
	// Webcam.attach( '#webcam' );
});

Template.webcam.events({
	'click #BtnCapture': function () {
		navigator.getMedia = ( navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia);
		navigator.getMedia({video: true}, function() {
			var canvas = document.getElementById('canvas');
			canvas.width = 640;
			canvas.height = 480;
			var context = canvas.getContext('2d');
			var video = document.getElementById('video');
			context.drawImage(video, 0, 0);
			var data = canvas.toDataURL("image/png",1.0);
			console.log(data);
			canvas.width = 0;
			canvas.height = 0;
			var alfa=data.replace(/^data:image\/(png|jpeg);base64,/, "");
			if(alfa!="" && alfa!=undefined){
				Meteor.call("ToWSFaceValidator", alfa,"VerifyFace",true);
			}   
		}, function() {
			sAlert.error("Cámara web no disponible (permisos denegados o dispositivo no encontrado)");
		});    
	}
});

Template.webcam.helpers({
	disable:function(){
		var omar = Sensors.find({ "FaceService": true }).count();
		var result="";
		if(omar==0){
			result="hide";
		}
		return result;
	},
	status: function(){
		var result = "";
		if(Session.get("FaceWaitingResponse")==undefined || Session.get("FaceWaitingResponse")==false ){
			$('#BtnCapture').removeClass('disabled');
		}else if(Session.get("FaceWaitingResponse")){
			$('#BtnCapture').addClass('disabled');
		}
		return result;
	}
});
