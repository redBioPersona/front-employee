import {Logger} from 'meteor/ostrio:logger';
import {LoggerFile} from 'meteor/ostrio:loggerfile';

basepath = process.env.RAIZ;
if (!basepath) {
	basepath="/logs/";
}
	this.log = new Logger();
	var LogFile = new LoggerFile(log, {
		fileNameFormat: function (time) {
			return moment(time).format('MMMM_DD_YYYY[.log]');
		},
		format: function (time, level, message, data) {
			return "[" + level + "] | " + moment(time).format('HH:mm:ss') + " | \"" + message + "\r\n";
		},
		client: true,
		server: true,
		path: basepath + '/MeteorMbes/'
	});
	LogFile.enable();


	this.logSync = new Logger();
	var LogFile1 = new LoggerFile(logSync, {
		fileNameFormat: function(time) {
			return moment(time).format('MMMM_DD_YYYY[_SYNC.log]');
		},
		format: function(time, level, message, data,) {
			return "[" + level + "] | " + moment(time).format('HH:mm:ss') + " | \"" + message + "\r\n";
		},
		path: basepath+'/MeteorSyncMbes/'
	});
	LogFile1.enable();


	this.logBio = new Logger();
	var LogFile2 = new LoggerFile(logBio, {
		fileNameFormat: function(time) {
			return moment(time).format('MMMM_DD_YYYY[_BIO.log]');
		},
		format: function(time, level, message, data,) {
			return "[" + level + "] | " + moment(time).format('HH:mm:ss') + " | \"" + message + "\r\n";
		},
		path: basepath+'/MeteorBiometricMbes/'
	});
	LogFile2.enable();


	this.logReport = new Logger();
	var LogFile3 = new LoggerFile(logReport, {
		fileNameFormat: function(time) {
			return moment(time).format('MMMM_DD_YYYY[_rep.log]');
		},
		format: function(time, level, message, data,) {
			return "[" + level + "] | " + moment(time).format('HH:mm:ss') + " | \"" + message + "\r\n";
		},
		path: basepath+'/MeteorReportsBiometricMbes/'
	});
	LogFile3.enable();


	this.logErrores = new Logger();
	var LogFile4 = new LoggerFile(logErrores, {
		fileNameFormat: function(time) {
			return moment(time).format('MMMM_DD_YYYY[_Errores.log]');
		},
		format: function(time, level, message, data,) {
			return "[" + level + "] | " + moment(time).format('HH:mm:ss') + " | \"" + message + "\r\n";
		},
		path: basepath+'/MeteorErrores/'
	});
	LogFile4.enable();

	this.logAccesos = new Logger();
	var LogFile5 = new LoggerFile(logAccesos, {
		fileNameFormat: function(time) {
			return moment(time).format('MMMM_DD_YYYY[_Accesos.log]');
		},
		format: function(time, level, message, data,) {
			return "[" + level + "] | " + moment(time).format('HH:mm:ss') + " | \"" + message + "\r\n";
		},
		path: basepath+'/MeteorAccesos/'
	});
	LogFile5.enable();
