import {Meteor} from 'meteor/meteor';

if (Meteor.isClient) {
	Template.welcome.events({
		'click #salir': function () {
			var isStation = Config_application.findOne({ "active": true });
			if (isStation != undefined && isStation.isServer != undefined&& isStation.isServer==false && isStation.showKeyboard==true) {
				
					var inp = document.getElementsByTagName('input');
					for (var i in inp) {
						if (inp[i].type == "text" || inp[i].type == "number" || inp[i].type == "email" || inp[i].type == "password") {
							var elemento = inp[i].name;
							if (elemento) {
								$("[name='" + elemento + "']").keyboard({ layout: 'qwerty' });
							}
						}
					}
				
			}
			$("#iniciar_sesion").modal('open');
		},
		'click #maximize': function () {
			toggleFullScreen(document.documentElement);
		}
	});
	Template.welcome.rendered = function () {
		Limpiar(100,undefined,function(res){});
		try {
			var ws;
			if ("WebSocket" in window) {
				ws = new WebSocket("ws://127.0.0.1:6969");
				ws.onmessage = function (evt) {
					var answer=JSON.parse(event.data);
					Session.set("ImProcessing",false);
					var estatus=answer["estatus"];
					if(estatus){
					switch(estatus.toString()){
						case "found":
							Session.set("Verification_estatus", "found");
							Session.set("ImProcessingDate", new Date());
							Session.set("ProcessingSample", false);
							Session.set("Verification_employeeName", answer.employeeName);
							Session.set("Verification_face_id", answer.id);
							Session.set("Verification_face", answer.url);
							Session.set("Verification_empEmail", answer.empEmail);
							Session.set("Verification_empPhoneNbr", answer.empPhoneNbr);
							Session.set("Verification_empCellNbr", answer.empCellNbr);
							Session.set("Verification_companyName", answer.companyName);
							Session.set("Verification_empPosName", answer.empPosName);
							Session.set("waitingAfterFinding",true);
							try {
								var audio = document.createElement("audio");
								audio.src = "/sounds/correcto.wav";
								audio.play();
							} catch (e) { }
							Limpiar(4000,undefined,function(res){});
						break;
						case "PersonNotFound":
						case "NotFound":
							sAlert.error('Persona no encontrada, intente nuevamente');
							Session.set("ImProcessingDate", new Date());
							var audio = document.createElement("audio");
							audio.src = "/sounds/incorrecto.wav";
							audio.play();
							Session.set("Verification_estatus", estatus);
							Limpiar(1000,undefined,function(res){});
						break;
						case "Processing":
							Session.set("Verification_estatus", estatus);
							Session.set("ProcessingSample", true);
						break;
						case "Desconectado":
							sAlert.warning("Se ha desconectado de la red");
							Session.set("ProcessingSample", false);
						break;						
						case "NotProcessing":
							Session.set("Verification_estatus", estatus);
							Session.set("ProcessingSample", false);
						break;
						case "CatchFinger":
							sAlert.error("Coloque su dedo nuevamente en el sensor");
							Session.set("ProcessingSample", false);
						break;
						case "BAD_OBJECT":						
						case "TOO_FEW_FEATURES":
							sAlert.error("La calidad de su huella es muy mala");
							Session.set("ProcessingSample", false);
						break;
						case "BAD_SHARPNESS":
						case "BAD_CONTRAST":
						case "OBJECT_NOT_FOUND":
						case "TOO_NOISY":
						case "BAD_EXPOSURE":
						case "BAD_DYNAMIC_RANGE":
							sAlert.warning('Calidad  muy baja, intente nuevamente');
							Session.set("ProcessingSample", false);
						break;
						default:
							Session.set("Verification_estatus", estatus);
							Limpiar(500,undefined,function(res){});
						break;
					}
					}
				};
				ws.onerror=function(){
					Tracker.autorun(() => {
						var acceso = Access_temp.findOne();
						var mensajes=Temp_messages.findOne({"status_verification":{$exists:true}},{fields:{"status_verification":1}});
						var sensores=Sensors.findOne({},{fields:{"ProcessingFinger":1,"ProcessingFace":1}});

						console.log("acceso "+JSON.stringify(acceso));
						console.log("mensajes "+JSON.stringify(mensajes));
						console.log("sensores "+JSON.stringify(sensores));

						if(acceso!=undefined){
							Session.set("ImProcessingDate", new Date());
							Session.set("Verification_face_id", acceso.id);
							Session.set("Verification_face", acceso.url);
							Session.set("Verification_employeeName", acceso.employeeName);
							Session.set("Verification_empEmail", acceso.empEmail);
							Session.set("Verification_empPhoneNbr", acceso.empPhoneNbr);
							Session.set("Verification_empCellNbr", acceso.empCellNbr);
							Session.set("Verification_companyName", acceso.companyName);
							Session.set("Verification_empPosName", acceso.empPosName);
							Session.set("waitingAfterFinding",true);

							var audio = document.createElement("audio");
							audio.src = "/sounds/correcto.wav";
							audio.play();
							Limpiar(3000,"",function(res){
								Session.set("ImProcessing",false);
							});
						}

						if (mensajes!=undefined && mensajes.status_verification!=undefined && mensajes.status_verification.includes("RegInserted")) {
							Session.set("Verification_estatus", mensajes.status_verification);
							Limpiar(100,undefined,function(res){});
							Session.set("ImProcessing",false);
						}else if (mensajes!=undefined && mensajes.status_verification!=undefined && mensajes.status_verification!="") {
							Session.set("ImProcessingDate", new Date());
							Session.set("Verification_estatus", mensajes.status_verification);
							var audio = document.createElement("audio");
							audio.src = "/sounds/incorrecto.wav";
							audio.play();
							Session.set("ImProcessing",false);
							Limpiar(100,undefined,function(res){});
						}

						if(sensores!=undefined){
							if(sensores.ProcessingFinger == true || sensores.ProcessingFace == true){
								Session.set("ProcessingSample", true);
							}else{
								Session.set("ProcessingSample", false);
							}
						}

					});
				};
				ws.onopen = function () {};
				ws.onclose = function () {};
			}
		} catch (err) {

		}

		Meteor.call('CleanAccessTemp');
		Meteor.call("isStation", function (err, result) {
			if (result) {
				Router.go('/admin/login');
			} else {
				startTime();
				if (Meteor.isCordova) {
					var options = {
						x: (window.screen.width / 2) - ((window.screen.width * 0.7) / 2) - 15,
						y: 100,
						width: window.screen.width * 0.8,
						height: window.screen.height * 0.5,
						camera: CameraPreview.CAMERA_DIRECTION.FRONT,
						toBack: false,
						tapPhoto: true,
						previewDrag: false
					};
					CameraPreview.startCamera(options);
				}
			}
		});
	};

	Template.welcome.helpers({
		alertas:function(){
			if(Session.get("Verification_estatus")!=undefined){
				if (Session.get("Verification_estatus")=="OBJECT_NOT_FOUND") {
					sAlert.warning('Calidad  muy baja, intente nuevamente');
				}else if (Session.get("Verification_estatus")=="BAD_SHARPNESS" ||
									Session.get("Verification_estatus")=="BAD_CONTRAST") {
					sAlert.warning('Calidad  muy baja, intente nuevamente');
				}else if (Session.get("Verification_estatus")=="ErrorInterno") {
					sAlert.error('Error interno, intente mas tarde');
				}else if (Session.get("Verification_estatus")=="CatchFinger") {
					sAlert.error("Coloque su dedo nuevamente en el sensor");
				}else if (Session.get("Verification_estatus").includes("RegInserted")) {
					var status=Session.get("Verification_estatus");
					var empleado = status.substring(11).toUpperCase();
					sAlert.info(empleado+" SU REGISTRO YA HA SIDO INSERTADO HACE UN MOMENTO");
				}else if (Session.get("Verification_estatus")=="NotProcessing") {
					Session.set("ProcessingSample", false);
				}else if (Session.get("Verification_estatus")=="Processing") {
					Session.set("ProcessingSample", true);
				}
			}
			

			if (Temp_messages.find({ "new_device": true }).count() != 0) {
				$("#tabular_table_analysis").modal('open', {
					dismissible: false
				});
			}

			if (Session.get("Verification_estatus")=="Imprimir" ||
			 Print_ticket.find({ "active": true }).count() != 0) {
				Session.set("ProcessingSample",true);
				logAccesos.info("Showing askmeal modal");

				$("#modal_ask_meal").modal('open', {
					dismissible: false,
					preventScrolling:true,
					opacity:0.5,
					inDuration:0,
					outDuration:0,
					startingTop:"3%",
					endingTop:"3%"
				});
			}

			if (Session.get("Verification_estatus")=="ImpresionCorrecta" || 
			Temp_messages.find({"status_verification": "ImpresionCorrecta"}).count() != 0) {
				logAccesos.info("Closing askmeal modal");
				$('#modal_ask_meal').modal('close');
			}

		},
		isprocesando_verificacion:function(){
			var result=false;
			if (Sensors.findOne({ "FaceService": true })!=undefined) {
				if (Session.get("ProcessingSample")==true) { result = true;}
			}
			return result;
		},
		procesando_verificacion: function () {
			var result = "Coloque su rostro frente a la cámara";
			if (Sensors.findOne({ "FaceService": true })!=undefined) {
				if(Session.get("ProcessingSample")==true){
					result = "Procesando, espere por favor";
				}else{
					if(Config_application.findOne({ "isServer": true }) !=undefined){
						result = "Coloque su rostro frente a la cámara y pulse sobre el botón";
					}else{
						result = "Coloque su rostro frente a la cámara";
					}
				}
			}
			return result;
		},
		isServer:function(){
			var result=false;
			if(Config_application.findOne({ "isServer": true })!=undefined){
				result =true;
			}
			return result;
		},
		getHeight: function () {
			return window.screen.height * 0.55;
		},
		getBiometricStatus: function () {
			var color = "red-text";
			if (Sensors.findOne({ "FingerService": true })!=undefined) {
				color = "green-text";
			}
			return color;
		},
		getFaceStatus: function () {
			var icono = "red-text";
			if (Sensors.findOne({ "FaceService": true })!=undefined) {
				icono = "green-text";
			}
			return icono;
		},
		getPrintStatus: function () {
			var icono = "red-text";
			if (Sensors.findOne({ "PrintService": true })!=undefined) {
				icono = "green-text";
			}
			return icono;
		},
		getBiometricDevices: function () {
			var icono = "red-text";
			if (Sensors.findOne({ "DeviceFingerConnect": true })!=undefined) {
				icono = "green-text";
			}
			return icono;
		},
		getBiometricWifi: function () {
			var icono = "red-text";
			if (Sensors.findOne({ "SyncService": true })!=undefined) {
				icono = "green-text";
			}
			return icono;
		},
		yourface: function () {
			var ruta="/images/employee.png";
			if(Session.get("Verification_face")!=undefined){
				ruta=Session.get("Verification_face");
			}
			return ruta;
		},
		emp_name: function () {
			var result = "";
			if (Session.get("Verification_employeeName")!=undefined) {
				result=Session.get("Verification_employeeName");
				logAccesos.info("Mostrando la informacion del empleado "+result);
			}
			return result;
		},
		emp_correo: function () {
			var result = "Sin asignar";
			if(Session.get("Verification_empEmail")!=undefined){
				result=Session.get("Verification_empEmail");
			}
			return result;
		},
		emp_empresa: function () {
			var result = "Sin asignar";
			if(Session.get("Verification_companyName")!=undefined){
				result=Session.get("Verification_companyName");
			}
			return result;
		},
		emp_puesto: function () {
			var result = "Sin asignar";
			if(Session.get("Verification_empPosName")!=undefined){
				result=Session.get("Verification_empPosName");
			}
			return result;
		},
		someone: function () {
			var result = false;
			if(Session.get("Verification_employeeName")!=undefined || Session.get("Verification_estatus")=="found"){
				result=true;
			}
			return result;
		},
		ShowFingerService:function(){
			var result=false;
			if(Sensors.findOne({"ShowFingerService":true},{fields:{"ShowFingerService":1}})!=undefined){
				result=true;
			}
			return result;
		},
		ShowDeviceFingerConnect:function(){
			var result=false;
			if(Sensors.findOne({"ShowDeviceFingerConnect":true},{fields:{"ShowDeviceFingerConnect":1}})!=undefined){
				result=true;
			}
			return result;
		},
		ShowFaceService:function(){
			var result=false;
			if(Sensors.findOne({"ShowFaceService":true},{fields:{"ShowFaceService":1}})!=undefined){
				result=true;
			}
			return result;
		},
		ShowPrintService:function(){
			var result=false;
			if(Sensors.findOne({"ShowPrintService":true},{fields:{"ShowPrintService":1}})!=undefined){
				result=true;
			}
			return result;
		},
		ShowSyncService:function(){
			var result=false;
			if(Sensors.findOne({"ShowSyncService":true},{fields:{"ShowSyncService":1}})!=undefined){
				result=true;
			}
			return result;
		}
	});

	Template.welcome.onCreated(function () {
		Meteor.subscribe('get_Access_temp', {
			onError: function (error) { console.log("error " + error); },
			onReady: function () {}
		});
		Meteor.subscribe('get_Temp_messages', {
			onError: function (error) { console.log("error " + error); },
			onReady: function () {}
		});
		Meteor.subscribe('get_Config_application', {
			onError: function (error) { console.log("error " + error); },
			onReady: function () {}
		});
		Meteor.subscribe('get_Config_station', {
			onError: function (error) { console.log("error " + error); },
			onReady: function () {}
		});
		Meteor.subscribe('get_Print_ticket', {
			onError: function (error) { console.log("error " + error); },
			onReady: function () {}
		});
		Meteor.subscribe('getSensors', {
			onError: function (error) { console.log("error " + error); },
			onReady: function () {}
		});
	});

	function startTime() {
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		m = checkTime(m);
		s = checkTime(s);
		var ampm = h >= 12 ? 'pm' : 'am';
		var days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
		var diasem = days[today.getUTCDay()];
		var dia = today.getDate();
		var mes = NumberToMes(today.getMonth() + 1);
		var anio = today.getFullYear();
		var ini = diasem + " " + dia + " de " + mes + " " + anio;
		$("#reloj_hora").text(h + ":" + m + ":" + s + " " + ampm);
		$("#reloj_fecha").text(ini);
		var t = setTimeout(startTime, 500);
	}


	function checkTime(i) {
		if (i < 10) {
			i = "0" + i
		};
		return i;
	}

	function Limpiar(n,db,callback){
		setTimeout(function() {
			Session.set("Verification_estatus", undefined);
			Session.set("Verification_face_id", undefined);
			Session.set("Verification_face",undefined);
			Session.set("Verification_employeeName", undefined);
			Session.set("Verification_empEmail", undefined);
			Session.set("Verification_empPhoneNbr", undefined);
			Session.set("Verification_empCellNbr", undefined);
			Session.set("Verification_companyName", undefined);
			Session.set("Verification_empPosName", undefined);
			Session.set("FaceProcessing",false);
			Session.set("FaceWaitingResponse", false);
			Session.set("waitingAfterFinding", false);
			Session.set("ProcessingSample",false );
			if(db!=undefined){
				Meteor.call("LimpiarVerificacion");
			}
      callback("Limpiado");
    }, n);
	}
}
