import { Promise } from 'meteor/promise';
const Fibers = require('fibers');
const fs = require('fs');

basepath = process.env.RAIZ;
if (!basepath) {
    basepath = "/logs/";
}

ReadExcel = function (Tipo, userId, Company, allowUP) {
    if (Tipo && userId && Company) {
        var dataFile = getData(Tipo, userId, Company);
        if (dataFile) {
            fs.readdir(basepath + dataFile.PathFileRead, (err, files) => {
                if (err) {
                    log.error("Error al buscar el archivo de " + Tipo + " causa :" + err)
                } else {
                    if (files.length > 0) {
                        Fibers(function () {
                            for (var i = 0, len = files.length; i < len; i++) {
                                log.info("Se encontro el archivo  " + files[i]);
                                Bound(files[i], Tipo, userId, Company, dataFile, allowUP);
                                sleeper(3000);
                            }
                        }).run();
                    }
                }
            });
        }
    } else {
        log.error("Alguna propiedad es nula o vacia");
    }
}

var Bound = Meteor.bindEnvironment(function (obj, Tipo, userId, Company, dataFile, allowUP) {
    try {
        leeLibro(obj, Tipo, userId, Company, dataFile, allowUP);
    } catch (error) {}
}, function (e) {
    log.error("Error al insertar " + e)
    throw e
});

function sleeper(ms) {
    var fiber = Fibers.current;
    setTimeout(function () {
        fiber.run();
    }, ms);
    Fibers.yield();
}

function mueveArchivosError(nombreDelLibro, Tipo, userId, Company, dataFile, cb) {
    var timeSpan = moment().format('YYYYMMDDHHmmssSS');
    var antiguo = basepath + dataFile.PathFileRead + nombreDelLibro;
    var nuevo = basepath + dataFile.PathFileErr + userId + "_" + Company + "_" + timeSpan + "_" + nombreDelLibro;
    log.info('Moviendo el archivo de ' + antiguo + " a " + nuevo);
    fs.rename(antiguo, nuevo, (err) => {
        if (err) {
            log.error('Error al mover el archivo con error :' + err);
        } else {
            log.info('Se movio el archivo de ' + antiguo + " a " + nuevo);
        }
    });
}

function mueveArchivosCorrecto(nombreDelLibro, Tipo, userId, Company, dataFile, cb) {
    var timeSpan = moment().format('YYYYMMDDHHmmssSS');
    var antiguo = basepath + dataFile.PathFileRead + nombreDelLibro;
    var nuevo = basepath + dataFile.PathFileProc + userId + "_" + Company + "_" + timeSpan + "_" + nombreDelLibro;
    log.info('Moviendo el archivo de ' + antiguo + " a " + nuevo);
    fs.rename(antiguo, nuevo, (err) => {
        if (err) {
            log.error('Error al mover el archivo procesado :' + err);
        } else {
            log.info('Se movio el archivo de ' + antiguo + " a " + nuevo);
        }
    });
}

var leeLibro = function (nombreDelLibro, Tipo, userId, Company, dataFile, allowUP, cb) {
        try {
            var excel = null;
            if (fileExtension(nombreDelLibro) !== ".xls" && fileExtension(nombreDelLibro) !== ".xlsx") {
                mueveArchivosError(nombreDelLibro, Tipo, userId, Company, dataFile);
                log.error("El archivo " + nombreDelLibro + " no cuenta con la extension necesaria .xls o .xlsx")
            } else {
                var ext = fileExtension(nombreDelLibro).replace(/./, '');
                var excel = new Excel(ext);
                var workbook = excel.readFile(basepath + dataFile.PathFileRead + nombreDelLibro);
                log.info('Procesando archivo ' + nombreDelLibro + " permitiendo duplicados "+allowUP);

                var yourSheetsName = workbook.SheetNames;
                var sheet = workbook.Sheets[yourSheetsName[0]];
                var options = {
                    header: 1
                };
                var workbookJson = excel.utils.sheet_to_json(sheet, options);
                var titulosOk = true;
                var colfaltante="";
                dataFile["Headers"].forEach(element => {
                    if (!workbookJson[0].includes(element)) {
                        colfaltante=element;
                        log.error("El archivo no contiene "+element+" en "+workbookJson[0]);
                        titulosOk = false;
                    }
                });
                var error = {};
                var generalError = false;
                if (!titulosOk) {
                    generalError = true;
                    CargaMasiva.insert({
                        causa: "Columna sin asignar",
                        descripcion: "No todas las columnas ("+colfaltante+") requeridas estan definidas ",
                        proporcionado: "",
                        archivo: nombreDelLibro,
                        tipo: Tipo,
                        error: "Error",
                        createdBy: userId,
                        updatedBy: userId,
                        Company: Company,
                        linea: 1
                    }, function (err, res) {
                        if (err) {
                            log.error("Err al insertarCargaMasiva " + err);
                        }
                    });
                } else {
                    var options = {};
                    var workbookJson = excel.utils.sheet_to_json(sheet, options);
                    var rows = Object.keys(workbookJson).length;
                    var arrayErrores = [];
                    var datosInsertar = [];

                    if (rows > 0) {
                        for (var i = 0; i <= rows; i++) {
                            if (workbookJson[i]) {
                                var localError=false;
                                var preInsertar = {};
                                dataFile["Headers"].forEach(element => {
                                            
                                            var Dato = element;
                                            var DatoFinal;
                                            var ValorDato = workbookJson[i][element];
                                            var ValorDatoFinal;
                                            var ValorTipo = dataFile.Data[element].Tipo;
                                            var Requerido = dataFile.Data[element].Requerido;
                                            
                                            // VALIDANDO DATOS REQUERIDOS
                                            if (Requerido == true && ValorDato == undefined) {
                                                generalError = true;
                                                localError=true;
                                                error = {
                                                    causa: "Dato vacio",
                                                    descripcion: "Se requiere el dato " + Dato,
                                                    proporcionado: "",
                                                    error: "Error",
                                                    archivo: nombreDelLibro,
                                                    tipo: Tipo,
                                                    createdBy: userId,
                                                    updatedBy: userId,
                                                    Company: Company,
                                                    linea: i + 2
                                                };
                                                arrayErrores.push(error);
                                            }

                                            // VALIDANDO FORMATOS
                                            if (localError == false && ValorDato != undefined) {
                                                if (ValorTipo == "Numero") {
                                                    if (!esNumero(ValorDato)) {
                                                        generalError = true;
                                                        localError=true;
                                                        error = {
                                                            causa: "Formato Incorrecto",
                                                            descripcion: "Se requiere numero para: " + Dato,
                                                            proporcionado: ValorDato,
                                                            error: "Error",
                                                            archivo: nombreDelLibro,
                                                            tipo: Tipo,
                                                            createdBy: userId,
                                                            updatedBy: userId,
                                                            Company: Company,
                                                            linea: i + 2
                                                        };
                                                        arrayErrores.push(error);
                                                    } else {
                                                        ValorDatoFinal = parseInt(ValorDato);
                                                    }
                                                } else if (ValorTipo == "String") {
                                                    if (esNumero(ValorDato)) {
                                                        generalError = true;
                                                        localError=true;
                                                        error = {
                                                            causa: "Formato Incorrecto",
                                                            descripcion: "Se requiere texto para: " + Dato,
                                                            proporcionado: ValorDato,
                                                            archivo: nombreDelLibro,
                                                            error: "Error",
                                                            tipo: Tipo,
                                                            createdBy: userId,
                                                            updatedBy: userId,
                                                            Company: Company,
                                                            linea: i + 2
                                                        };
                                                        arrayErrores.push(error);
                                                    } else {
                                                        ValorDatoFinal = ValorDato.toUpperCase().trim();
                                                    }
                                                } else if (ValorTipo == "Booleano") {
                                                    if (esNumero(ValorDato) == true || esBooleano(ValorDato) == false) {
                                                        generalError = true;
                                                        localError=true;
                                                        error = {
                                                            causa: "Formato Incorrecto",
                                                            descripcion: "Se requiere booleano para: " + Dato,
                                                            proporcionado: ValorDato,
                                                            archivo: nombreDelLibro,
                                                            error: "Error",
                                                            tipo: Tipo,
                                                            createdBy: userId,
                                                            updatedBy: userId,
                                                            Company: Company,
                                                            linea: i + 2
                                                        };
                                                        arrayErrores.push(error);
                                                    } else {
                                                        ValorDatoFinal = esBooleano(ValorDato);
                                                    }
                                                } else if (ValorTipo == "Array") {
                                                    ValorDatoFinal = [];
                                                    ValorDatoFinal = ValorDato.split(",");
                                                } else {
                                                    log.error(ValorTipo + " no existe");
                                                }
                                            }
                                            preInsertar[dataFile.Data[element].FieldDBName] = ValorDatoFinal;

                                            // VALIDANDO RELACIONES
                                            if (localError == false && ValorDato != undefined && dataFile["ForeignKey"] && dataFile["ForeignKey"][element]) {
                                                var arraybus = [];
                                                var abx = dataFile["ForeignKey"][element];
                                                if (typeof ValorDatoFinal == "object") {
                                                    ValorDatoFinal.forEach(el => {
                                                        var bus = {};
                                                        if (esNumero(el) == true) {
                                                            bus[abx.FieldCompare] = parseInt(el);
                                                        } else {
                                                            bus[abx.FieldCompare] = el;
                                                        }
                                                        if (abx["Compania"]) {
                                                            var propC = Object.keys(abx["Compania"])[0];
                                                            bus[propC] = abx["Compania"][propC];
                                                        }
                                                        arraybus.push(bus);
                                                    });
                                                } else {
                                                    var bus = {};
                                                    bus[abx.FieldCompare] = ValorDatoFinal;
                                                    if (abx["Compania"]) {
                                                        var propC = Object.keys(abx["Compania"])[0];
                                                        bus[propC] = abx["Compania"][propC];
                                                    }
                                                    arraybus.push(bus);
                                                }

                                                var use = [];
                                                var special = false;
                                                var poner;

                                                arraybus.forEach(simpleBus => {
                                                    var Field = abx["Collection"].findOne(simpleBus, { fields: { "_id": 1 } });
                                                    if (!Field) {
                                                        log.info("Buscando relacion " + JSON.stringify(simpleBus));
                                                        generalError = true;
                                                        localError=true;
                                                        error = {
                                                            causa: "Relación no encontrada",
                                                            descripcion: "No existe en (" + element + ") el dato proporcionado",
                                                            proporcionado: ValorDato,
                                                            archivo: nombreDelLibro,
                                                            error: "Error",
                                                            tipo: Tipo,
                                                            createdBy: userId,
                                                            updatedBy: userId,
                                                            Company: Company,
                                                            linea: i + 2
                                                        };
                                                        arrayErrores.push(error);
                                                    } else {
                                                        var data = Field[abx.FieldReturn];
                                                        var usar = data;
                                                        if (ValorTipo == "Array") {
                                                            if (ValorDatoFinal.length > 1) {
                                                                special = true;
                                                                use.push(data);
                                                            } else {
                                                                try {
                                                                    usar = [data.trim()];
                                                                } catch (e1) {
                                                                    usar = [data];
                                                                }
                                                            }
                                                        } else {
                                                            try {
                                                                usar = data.trim();
                                                            } catch (e1) {}
                                                        }
                                                        if (special == false) {
                                                            poner = usar;
                                                        }
                                                    }
                                                });
                                                if (special == true) {
                                                    preInsertar[abx.FieldUse] = use;
                                                } else {
                                                    preInsertar[abx.FieldUse] = poner;
                                                }
                                            }

                                            // VALIDANDO FUNCIONES
                                            if (localError == false && dataFile.Data[element] && dataFile.Data[element].Funcion) {
                                                var functionName = dataFile.Data[element].Funcion;
                                                // log.info("Validando la funcion " + functionName);
                                                let func = new Function('return ' + functionName)();
                                                if(ValorDato!=undefined){
                                                    var functionValorDato = func(ValorDato);
                                                    if (functionValorDato == undefined) {
                                                        generalError = true;
                                                        localError=true;
                                                        error = {
                                                            causa: "Formato Incorrecto",
                                                            descripcion: "Revise el dato: " + Dato,
                                                            proporcionado: ValorDato,
                                                            archivo: nombreDelLibro,
                                                            tipo: Tipo,
                                                            error: "Error",
                                                            createdBy: userId,
                                                            updatedBy: userId,
                                                            Company: Company,
                                                            linea: i + 2
                                                        };
                                                        arrayErrores.push(error);
                                                    } else {
                                                        preInsertar[dataFile.Data[element].FieldDBName] = functionValorDato;
                                                    }
                                                }                                                
                                            }


                                        });

                                    // VALIDANDO DATOS A INSERTAR
                                    if (generalError == false) {
                                        var Insertar = Object.assign(preInsertar, dataFile.Constants);
                                        datosInsertar.push(Insertar);
                                    }
                                }
                                if (localError) {
                                    log.error(JSON.stringify(error));
                                    CargaMasiva.insert(error, function (err, res) {
                                        if (err) {
                                            log.error("Err al insertar en CargaMasiva, el objeto " + JSON.stringify(error), " error " + err);
                                        }
                                    });
                                    // break;
                                }
                            }
                            log.info(JSON.stringify(arrayErrores));
                            if (generalError == false) {
                                var linea = 1;
                                log.info("El archivo procesado es correcto, insertando "+datosInsertar.length);
                                datosInsertar.forEach(pInsert => {
                                    ++linea;
                                    var buscarDuplicados = {};
                                    if (dataFile.Key) {
                                        var busx = dataFile.Key;
                                        busx.forEach(dF => {
                                            var valo = pInsert[dF.FieldDBName];
                                            if (typeof valo == "object") {
                                                buscarDuplicados[dF.FieldDBName] = {
                                                    $in: pInsert[dF.FieldDBName]
                                                };
                                            } else {
                                                buscarDuplicados[dF.FieldDBName] = pInsert[dF.FieldDBName];
                                            }
                                        });
                                    }

                                    if (Object.keys(buscarDuplicados).length > 0) {
                                        var sBus = {};
                                        Object.keys(buscarDuplicados).forEach(e => {
                                            if (buscarDuplicados[e] != undefined) {
                                                sBus[e] = buscarDuplicados[e];
                                            }
                                        });
                                        var dataP = dataFile["Collection"].findOne(sBus, { fields: { _id: 1 } });
                                        if (dataP) {                                            
                                            if (allowUP == true) {
                                                var idD = dataP._id;                                                
                                                var unset={};
                                                Object.keys(pInsert).forEach(e => {
                                                    if(pInsert[e]==undefined){
                                                        unset[e]="";
                                                    }
                                                });
                                                dataFile["Collection"].update({ _id: idD }, { $set: pInsert,$unset:unset }, function (err, res) {
                                                    if (err) {
                                                        CargaMasiva.insert({
                                                            causa: "Error al actualizar",
                                                            descripcion: String(err),
                                                            proporcionado: "...",
                                                            archivo: nombreDelLibro,
                                                            error: "Error",
                                                            tipo: Tipo,
                                                            Company: Company,
                                                            linea: linea,
                                                            createdBy: userId,
                                                            updatedBy: userId,
                                                        });
                                                    } else {
                                                        var AvoidDup = Object.keys(buscarDuplicados)[0];
                                                        var duplicado = "";
                                                        var xAvoidDup = buscarDuplicados[AvoidDup];
                                                        if (typeof xAvoidDup == "string") {
                                                            duplicado = xAvoidDup;
                                                        } else if (typeof xAvoidDup == "number") {
                                                            duplicado = xAvoidDup;
                                                        } else {
                                                            if ("$regex" in xAvoidDup) {
                                                                duplicado = xAvoidDup["$regex"];
                                                            }
                                                        }

                                                        var ins = CargaMasiva.insert({
                                                            causa: "Registro duplicado",
                                                            descripcion: "El dato ya se encuentra en el sistema, actualizando duplicado",
                                                            proporcionado: duplicado,
                                                            archivo: nombreDelLibro,
                                                            error: "Warning",
                                                            tipo: Tipo,
                                                            createdBy: userId,
                                                            updatedBy: userId,
                                                            Company: Company,
                                                            linea: linea,
                                                        });
                                                        CargaMasiva.direct.update({ _id: ins }, { $set: { createdBy: userId } });
                                                        var CollectionString = dataFile.CollectionString;
                                                        orion.collections.list[CollectionString]._collection.update({ _id: idD }, { $set: { updatedBy: userId } });
                                                    }
                                                });
                                            } else {
                                                var AvoidDup = Object.keys(buscarDuplicados)[0];
                                                var duplicado = "";
                                                var xAvoidDup = buscarDuplicados[AvoidDup];
                                                if (typeof xAvoidDup == "string") {
                                                    duplicado = xAvoidDup;
                                                } else if (typeof xAvoidDup == "number") {
                                                    duplicado = xAvoidDup;
                                                } else {
                                                    duplicado = xAvoidDup;
                                                    // if ("$regex" in xAvoidDup) {
                                                    //     duplicado = xAvoidDup["$regex"];
                                                    // }
                                                }
                                                CargaMasiva.insert({
                                                    causa: "Registro duplicado",
                                                    descripcion: "El dato ya se encuentra en el sistema, no es posible insertar duplicado",
                                                    proporcionado: duplicado,
                                                    archivo: nombreDelLibro,
                                                    error: "Warning",
                                                    tipo: Tipo,
                                                    createdBy: userId,
                                                    updatedBy: userId,
                                                    Company: Company,
                                                    linea: linea,
                                                },function(err,res){
                                                    if(err){
                                                    }else if(res){                                                        
                                                        CargaMasiva.direct.update({ _id: res }, { $set: { createdBy: userId } });
                                                    }
                                                });
                                            }
                                        } else {
                                            dataFile["Collection"].insert(pInsert, function (err, res) {
                                                if (err) {
                                                    log.error("No fue posible insertar " + JSON.stringify(pInsert) + " err " + err);
                                                    CargaMasiva.insert({
                                                        causa: "Error al insertar",
                                                        descripcion: String(err),
                                                        proporcionado: "...",
                                                        archivo: nombreDelLibro,
                                                        error: "Error",
                                                        tipo: Tipo,
                                                        Company: Company,
                                                        linea: linea,
                                                        createdBy: userId,
                                                        updatedBy: userId,
                                                    });
                                                } else {
                                                    var insertado = Object.keys(pInsert)[0];
                                                    CargaMasiva.insert({
                                                        causa: "Registro Insertado",
                                                        descripcion: "Registro insertado de manera correcta",
                                                        proporcionado: String(pInsert[insertado]),
                                                        archivo: nombreDelLibro,
                                                        error: "Info",
                                                        tipo: Tipo,
                                                        Company: Company,
                                                        linea: linea,
                                                        createdBy: userId,
                                                        updatedBy: userId,
                                                    });
                                                    var CollectionString = dataFile.CollectionString;
                                                    orion.collections.list[CollectionString]._collection.update({
                                                        _id: res
                                                    }, {
                                                        $set: dataFile.Constants
                                                    });
                                                }
                                            });
                                        }
                                    } else {
                                        log.info("Insertando sin pasar por una busqueda de duplicados");
                                    }
                                });
                                log.info("El archivo se ha procesado satisfactoriamente");
                            }
                        } else {
                            generalError = true;
                            CargaMasiva.insert({
                                causa: "Datos Vacios",
                                descripcion: "El archivo proporcionado se encuentra vacio",
                                proporcionado: "---",
                                archivo: nombreDelLibro,
                                tipo: Tipo,
                                error: "Error",
                                Company: Company,
                                linea: 1,
                                createdBy: userId,
                                updatedBy: userId,
                            }, function (err, res) {
                                if (err) {
                                    log.error("Err al insertarCargaMasiva " + err);
                                }
                            });
                        }
                    }
                    if (generalError) {
                        mueveArchivosError(nombreDelLibro, Tipo, userId, Company, dataFile);
                        log.error("El archivo " + nombreDelLibro + " tiene algun error en su estructura " + JSON.stringify(arrayErrores));
                    } else {
                        log.info("El archivo se proceso de manera correcta");
                        mueveArchivosCorrecto(nombreDelLibro, Tipo, userId, Company, dataFile);
                    }
                }
            } catch (errors) {
                log.error("El archivo " + nombreDelLibro + " tiene errores " + JSON.stringify(errors));
                try {
                    CargaMasiva.insert({
                        causa: "Formato Incorrecto",
                        descripcion: "No fue posible procesar el archivo, revise la estructura necesaria y que el archivo no este corrupto",
                        proporcionado: "---",
                        archivo: nombreDelLibro,
                        tipo: Tipo,
                        error: "Error",
                        Company: Company,
                        linea: 0,
                        createdBy: userId,
                        updatedBy: userId,
                    }, function (err, res) {
                        if (err) {
                            log.error("Err al insertarCargaMasiva " + err);
                        }
                    });
                    mueveArchivosError(nombreDelLibro, Tipo, userId, Company, dataFile);
                } catch (ex) {}
            }
            cb(null, true);
        }