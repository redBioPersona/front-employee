Meteor.methods({
    GenerarTodo:function(){
        // console.log("Iniciando Migrate Reports");
        var DataE=Persons.find().fetch();
        for(var i=0;i<DataE.length;i++){
            var _idEmployee=DataE[i]._id;
            var employeeName=DataE[i].employeeName;
            //logReport.info("Empleado "+_idEmployee+" Nombre "+employeeName);
            var DataAccessCtrl = Accesscontrol.find(
                {'idEmployee': _idEmployee},
                {
                    fields: {
                        idEmployee: 1,
                        firstAccess: 1,
                        lastAccess: 1
                    },
                    sort: {firstAccess: 1}
                }
            ).fetch();
            if(DataAccessCtrl!=undefined){
                ////logReport.info("Registros en  Accesscontrol :"+DataAccessCtrl.length);
                if(DataAccessCtrl.length!=0){
                    var FullHorario=getHorario(_idEmployee);
                    if (FullHorario.hasOwnProperty("Horarios")) {
                        if(FullHorario.hasOwnProperty("Asistencias"))
                        var idEmployee=DataE[i].idEmployee;
                        var employeeName=DataE[i].employeeName;
                        var idDepartment=DataE[i].idDepartment;
                        var idLocation=DataE[i].idLocation;
                        var idcompany=DataE[i].idcompany;
                        var idmanager=DataE[i].idmanager;

                        ////logReport.info("Horario "+JSON.stringify(FullHorario));
                        var FechaPrimerAcceso=DataAccessCtrl[0].firstAccess;
                        var FechaUltimoAcceso=DataAccessCtrl[DataAccessCtrl.length-1].firstAccess;
                        //logReport.info("FechaPrimerAcceso "+FechaPrimerAcceso);
                        //logReport.info("FechaUltimoAcceso "+FechaUltimoAcceso);
                        var days=FullHorario.Horarios;
                        var HorarioAsistencias=FullHorario.Asistencias;
                        var DatesWorks=getDatesBetween(FechaPrimerAcceso,FechaUltimoAcceso);
                        ////logReport.info("DatesWorks "+JSON.stringify(DatesWorks));
                        for(var j=0;j<DatesWorks.length;j++){
                            var ElapsedDay=DatesWorks[j];
                            var fechaSem = moment(ElapsedDay).format("dddd");
                            fechaSem = fechaSem.replace(/á/gi,"a");
                            fechaSem = fechaSem.replace(/é/gi,"e");
                            fechaSem = fechaSem.replace(/í/gi,"i");
                            fechaSem = fechaSem.replace(/ó/gi,"o");
                            fechaSem = fechaSem.replace(/ú/gi,"u");
                            //logReport.info("fechaSem "+ElapsedDay+" dia "+fechaSem);
                            var existDayintoJournal=days[fechaSem];
                            if (existDayintoJournal!=undefined) {
                                //logReport.info("existDayintoJournal "+JSON.stringify(existDayintoJournal));

                                var createdDate=moment(ElapsedDay).format("DD/MM/YYYY");
                                var filtroDataAccessCtrlByDay={
                                    'idEmployee': _idEmployee,
                                    'createdDate': createdDate
                                };
                                var oneday=days[fechaSem];
                                //logReport.info("Analizando "+JSON.stringify(oneday));
                                var inicioOficial=oneday["Entrada"];
                                var salidaOficial=oneday["Salida"];

                                //logReport.info("Ejecutando el filtro "+JSON.stringify(filtroDataAccessCtrlByDay));
                                var DataAccessCtrlByDay = Accesscontrol.findOne(filtroDataAccessCtrlByDay);
                                if(DataAccessCtrlByDay!=undefined){

                                    var entro = DataAccessCtrlByDay.firstAccess;
                                    var fecha = moment(entro).format("DD/MM/YYYY");
                                    var primerRegistro = moment(entro).format("HH:mm");
                                    var salio= DataAccessCtrlByDay.lastAccess;
                                    var ultimoRegistro="-";
                                    if(salio!=undefined){
                                        ultimoRegistro = moment(salio).format("HH:mm");
                                    }
                                    var excepcion = getexcepcion(entro, salio);
                                    var horas = getHoras(entro, salio);
                                    var tiempo = getTiempo(entro, salio);
                                    var getSancionandStatus=[];
                                    getSancionandStatus=GenerateReports_getEstatus(entro,inicioOficial,HorarioAsistencias);
                                    var estatus = getSancionandStatus[0];
                                    var sancion = getSancionandStatus[1];
                                    var antes=GenerateReports_getAntes(salio,salidaOficial);

                                    var resultado = {
                                        _idEmployee: _idEmployee,
                                        idEmployee: parseInt(idEmployee),
                                        employeeName: employeeName,
                                        idDepartment:idDepartment,
                                        idLocation: idLocation,
                                        idcompany: idcompany,
                                        idmanager: idmanager,
                                        fecha: fecha,
                                        inicioOficial: inicioOficial,
                                        primerRegistro: primerRegistro,
                                        salidaOficial: salidaOficial,
                                        ultimoRegistro: ultimoRegistro,
                                        excepcion: excepcion,
                                        tiempo: tiempo,
                                        horas: horas,
                                        estatus: estatus,
                                        sancion:sancion,
                                        antes:antes
                                    };

                                    if(entro instanceof Date){
                                        resultado["fechaIni"]=entro;
                                    }
                                    if(salio instanceof Date){
                                        resultado["fechaFin"]=salio;
                                    }
                                    var DetalleAcceso=Accessdetails.findOne({"idAccessCtrl":DataAccessCtrlByDay._id},{sort:{createdAt:1}});
                                    if(DetalleAcceso){
                                        resultado["idDevice"]=GetidDevice(DetalleAcceso.idDevice);
                                        resultado["idLocationChk"]=DetalleAcceso.idLocation;
                                        resultado["idLocationChk_txt"]=DetalleAcceso.idLocation_txt;
                                    }
                                    Reports.direct.insert(resultado);
                                }else{
                                    var resultado = {
                                        _idEmployee: _idEmployee,
                                        idEmployee: parseInt(idEmployee),
                                        employeeName: employeeName,
                                        idDepartment:idDepartment,
                                        idLocation: idLocation,
                                        idcompany: idcompany,
                                        idmanager: idmanager,
                                        fecha: createdDate,
                                        inicioOficial: inicioOficial,
                                        primerRegistro: "-",
                                        salidaOficial: salidaOficial,
                                        ultimoRegistro: "-",
                                        excepcion:"-",
                                        tiempo: "-",
                                        horas: "-",
                                        estatus: "Falta",
                                        sancion:"-",
                                        antes:"-",
                                        fechaIni : ElapsedDay,
                                        fechaFin : ElapsedDay,
                                        idDevice:"-",
                                        idLocationChk:"-",
                                        idLocationChk_txt:"-",
                                    };
                                    Reports.direct.insert(resultado);
                                }
                            }
                        }
                   }else{
                    //logReport.error("Falta de Horario del Empleado "+_idEmployee+" Nombre "+employeeName);
                   }
                }
            }
        }
        console.log("! Termino Migrate Reports ¡");



        // console.log(" Iniciando la generacion de Tiempos de Alimentos");
        var DataComp = Companies.find({"meal" : true}, {fields: {companyName: 1}}).fetch();
        //logReport.info("Cant. de compañias que evaluan tiempo de alimentos :"+DataComp.length);
        for (var  k = 0; k < DataComp.length; k++) {
            var _idCompany= DataComp[k]._id;
            var idcompany=[];
            idcompany[0]=_idCompany;
            //logReport.info("Compañia " +_idCompany+" nombre :"+DataComp[k].companyName);
            var DataE = Persons.find({"idcompany":{$in:idcompany}}, {fields: {employeeName: 1,idEmployee:1,idcompany:1}}).fetch();
            //logReport.info("Cant de personas " +DataE.length+" encontradas en "+DataComp[k].companyName);
            for (var i = 0; i < DataE.length; i++) {
                var _idEmployee = DataE[i]._id;
                //logReport.info("Empleado " + _idEmployee + " Nombre " + DataE[i].employeeName);
                var DataAccessCtrl = Accesscontrol.find({'idEmployee': _idEmployee},{fields: {idEmployee: 1,firstAccess: 1,lastAccess: 1}}).fetch();
                if (DataAccessCtrl.length != 0) {
                    //logReport.info("Registros en  Accesscontrol :" + DataAccessCtrl.length);
                    for (var j = 0; j < DataAccessCtrl.length; j++) {
                        var _idAccessCtrl = DataAccessCtrl[j]._id;
                        var DataAccessDetails = Accessdetails.find({'idEmployee': _idEmployee,'idAccessCtrl': _idAccessCtrl}, {fields: {accessDate: 1},sort: {accessDate: 1}}).fetch();
                        if (DataAccessDetails.length > 2) {
                            //logReport.info("Registros en  DataAccessDetails :" + DataAccessDetails.length+" con idAccessCtrl "+_idAccessCtrl);
                            var FullHorario = getHorario(_idEmployee);
                            var TheHorario=FullHorario["Horarios"];
                            var TheHorarioAlimentos=FullHorario["Alimentos"];
                            if (TheHorario!=undefined) {
                                //logReport.info("Horario "+JSON.stringify(FullHorario));
                                var _entro = DataAccessCtrl[j].firstAccess;
                                var _salio= DataAccessCtrl[j].lastAccess;
                                var fechaSem = moment(_entro).format("dddd");
                                fechaSem = fechaSem.replace(/á/gi,"a");
                                fechaSem = fechaSem.replace(/é/gi,"e");
                                fechaSem = fechaSem.replace(/í/gi,"i");
                                fechaSem = fechaSem.replace(/ó/gi,"o");
                                fechaSem = fechaSem.replace(/ú/gi,"u");
                                var existDayintoJournal=TheHorario[fechaSem];
                                //logReport.info("existDayintoJournal "+JSON.stringify(existDayintoJournal));
                                if (existDayintoJournal!=undefined) {
                                    var comidaInicio=existDayintoJournal["ComidaInicio"];
                                    var comidaFin=existDayintoJournal["ComidaFin"];
                                    if(comidaInicio!=undefined && comidaFin!=undefined){
                                        var comidaInicioTiempo=comidaInicio.split(":");
                                        var comidaFinTiempo=comidaFin.split(":");
                                        var entro=_entro;
                                        entro.setHours(comidaInicioTiempo[0]);
                                        entro.setMinutes(comidaInicioTiempo[1]);
                                        entro.setSeconds(0);

                                        var salio;
                                        if(_salio==undefined || _salio==null){
                                            log.error("Indefinido "+_idAccessCtrl);
                                            salio=_entro;
                                        }else{
                                            salio=_salio;
                                        }
                                        salio.setHours(comidaFinTiempo[0]);
                                        salio.setMinutes(comidaFinTiempo[1]);
                                        salio.setSeconds(0);

                                        var busqueda={
                                            $and:[
                                              {idAccessCtrl:_idAccessCtrl},
                                              {accessDate:{$gte:entro}},
                                              {accessDate:{$lt:salio}}
                                            ]
                                        };
                                        //logReport.info("Ejecutando la busqueda :" + JSON.stringify(busqueda));
                                        var DataAccessDetailsMeals = Accessdetails.find(busqueda).fetch();
                                        //logReport.info("Cantidad de Registros despues de la busqueda :" + DataAccessDetailsMeals.length);
                                        if(DataAccessDetailsMeals.length>0){
                                            var excepcion="No";
                                            var minutos_permitidos=60;
                                            var _primerRegistroComida= DataAccessDetailsMeals[0].accessDate;
                                            var primerRegistro=moment(_primerRegistroComida).format("HH:mm")
                                            var _ultimoRegistroComida= DataAccessDetailsMeals[DataAccessDetailsMeals.length-1].accessDate;
                                            var ultimoRegistro=moment(_ultimoRegistroComida).format("HH:mm")
                                            var horas = getTiempo(_primerRegistroComida, _ultimoRegistroComida).toString();
                                            var fecha = moment(_entro).format("DD/MM/YYYY");
                                            if(primerRegistro ==ultimoRegistro){excepcion="Si"}
                                            if(TheHorarioAlimentos!=undefined){
                                                var minperm=TheHorarioAlimentos["tiempoAlimentos"];
                                                if(minperm!=undefined){
                                                    minutos_permitidos=parseInt(minperm)
                                                }
                                            }

                                            var resultado = {
                                                _idEmployee: _idEmployee,
                                                idEmployee: parseInt(DataE[i].idEmployee),
                                                employeeName:  DataE[i].employeeName,
                                                fecha: fecha,
                                                primerRegistro:primerRegistro,
                                                inicioOficial:comidaInicio,
                                                salidaOficial:comidaFin,
                                                ultimoRegistro:ultimoRegistro,
                                                excepcion:excepcion,
                                                minutos_permitidos:minutos_permitidos,
                                                idcompany:DataE[i].idcompany,
                                                fechaIni:_primerRegistroComida,
                                                fechaFin:_ultimoRegistroComida
                                            };
                                            if(horas!="-" && horas!=undefined && horas!=null){
                                                resultado["horas"]=horas.split(":")[0];
                                                resultado["minutos"]=horas.split(":")[1];
                                                var tiempo_transcurrido=parseInt(horas.split(":")[0]*60)+parseInt(horas.split(":")[1]);
                                                var estatus=GenerateMealTimes_getEstatus(tiempo_transcurrido,minutos_permitidos,TheHorarioAlimentos);
                                                resultado["estatus"]=estatus[0];
                                                resultado["sancion"]=estatus[1];
                                            }
                                            Meal_times.direct.insert(resultado);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //logReport.info("! Termino la generacion de Tiempos de Alimentos ¡ ");
        console.log("! Termino la generacion de Tiempos de Alimentos ¡ ");


        var DataE2=Persons.find().fetch();
        var folio=1;
        // console.log("Iniciando Migrate Tickets");
        for(var i=0;i<DataE2.length;i++){
            var _idEmployee=DataE2[i]._id;
            var idEmployee=DataE2[i].idEmployee;
            var employeeName=DataE2[i].employeeName;
            var idcompany=DataE2[i].idcompany;
            var busquedaAccessCtrl={
                $and:[
                  {idEmployee:_idEmployee},
                  {meal:"true"}
                ]
              };
            var DataAccessCtrl = Accesscontrol.find(busquedaAccessCtrl).fetch();
            for(var j=0;j<DataAccessCtrl.length;j++){
                var _idAccessControl= DataAccessCtrl[j]._id;
                var _entro = DataAccessCtrl[j].firstAccess;
                 var fecha = moment(_entro).format("DD/MM/YYYY");

                var busquedaAccessDetail={
                    $and:[
                            {idAccessCtrl:_idAccessControl},
                            {fpMatchResult:'MEAL'}
                        ]
                    };

                var DataAccessDetailsMeals = Accessdetails.findOne(busquedaAccessDetail);
                if(DataAccessDetailsMeals!=undefined){
                    var createdAt= DataAccessDetailsMeals.accessDate;
                    var registro=moment(createdAt).format("HH:mm")

                    var resultado = {
                        _idEmployee: _idEmployee,
                        idEmployee: parseInt(idEmployee),
                        employeeName: employeeName,
                        idcompany:idcompany,
                        fecha: fecha,
                        registro:registro,
                        folio:folio++,
                        createdAt:createdAt
                    };
                    Tickets.direct.insert(resultado);
                }
            }
        }
        console.log("Termino... Migrate Tickets");

        // console.log("Iniciando Generacion de Usuarios");
        var BajaDef = Employeestatuses.findOne({ "empStatusName": "BAJADEF" });
        if (BajaDef != undefined) {
            var estatus = BajaDef._id;
            var DataPersons = Persons.find({ "idEmpStatus": { $ne: estatus } }).fetch();
            for (var i = 0; i < Object.keys(DataPersons).length; i++) {
                var emails = DataPersons[i].empEmail;
                if (emails != null && emails != undefined && emails != "") {
                    var email=emails.toLowerCase();
                    var idEmployee = DataPersons[i]._id;
                    var res = Meteor.users.findOne({ "emails.address": email});
                    if(res==undefined){
                        var name = DataPersons[i].employeeName;
                        var idcompany = DataPersons[i].idcompany;
                        var n = emails.indexOf("@");
                        var passwords = emails.substring(0, n);
                        var password = passwords.toLowerCase();
                        var obj = {
                            email: email,
                            emails: [{
                                address: email,
                                verified: true
                            }],
                            password: password,
                            profile: {
                                name: name,
                                idcompany: idcompany,
                                idEmployee: idEmployee
                            },
                            roles: [
                                "Usuario"
                            ]
                        };
                        userId = Accounts.createUser(obj);
                        Meteor.users.update({"_id":userId}, {$set:{"roles":["Usuario"]}});
                        Design_app.insert({ color: "Azul", user: userId });
                    }
                }
            }
        }
        console.log("¡ Termino la generacion de Usuarios !");
    },
    GenerateUsers: function () {
        // console.log("Iniciando Generacion de Usuarios");
        var BajaDef = Employeestatuses.findOne({ "empStatusName": "BAJADEF" });
        if (BajaDef != undefined) {
            var estatus = BajaDef._id;
            var DataPersons = Persons.find({ "idEmpStatus": { $ne: estatus } }).fetch();
            for (var i = 0; i < Object.keys(DataPersons).length; i++) {
                var emails = DataPersons[i].empEmail;
                if (emails != null && emails != undefined && emails != "") {
                    var email=emails.toLowerCase();
                    var idEmployee = DataPersons[i]._id;
                    var res = Meteor.users.findOne({ "emails.address": email});
                    if(res==undefined){
                        var name = DataPersons[i].employeeName;
                        var idcompany = DataPersons[i].idcompany;
                        var n = emails.indexOf("@");
                        var passwords = emails.substring(0, n);
                        var password = passwords.toLowerCase();
                        var obj = {
                            email: email,
                            emails: [{
                                address: email,
                                verified: true
                            }],
                            password: password,
                            profile: {
                                name: name,
                                idcompany: idcompany,
                                idEmployee: idEmployee
                            },
                            roles: [
                                "Usuario"
                            ]
                        };
                        userId = Accounts.createUser(obj);
                        Meteor.users.update({"_id":userId}, {$set:{"roles":["Usuario"]}});
                        Design_app.insert({ color: "Azul", user: userId });
                    }
                }
            }
        }
        console.log("¡ Termino la generacion de Usuarios !");
    },
    GenerateFaceUsers: function () {
        // console.log("Iniciando Generacion de Usuarios Face");
        var BajaDef = Employeestatuses.findOne({ "empStatusName": "BAJADEF" });
        if (BajaDef != undefined) {
            var estatus = BajaDef._id;
            var DataPersons = Persons.find({ "idEmpStatus": { $ne: estatus } }).fetch();
            for (var i = 0; i < Object.keys(DataPersons).length; i++) {
                var idEmployee = DataPersons[i]._id;
                var mail=idEmployee+"@mbes.com"
                var res = Meteor.users.findOne({ "emails.address": mail});
                if(res==undefined){
                    var name = DataPersons[i].employeeName;
                    var idcompany = DataPersons[i].idcompany;
                    var password = "pancholopez";
                    var obj = {
                        email: mail,
                        emails: [{
                            address: mail,
                            verified: true
                        }],
                        password: password,
                        profile: {
                            name: name,
                            idcompany: idcompany,
                            idEmployee: idEmployee,
                            face:true
                        },
                        roles: [
                            "Usuario"
                        ]
                    };
                    userId = Accounts.createUser(obj);
                    Meteor.users.update({"_id":userId}, {$set:{"roles":["Usuario"]}});
                    Design_app.insert({ color: "Azul", user: userId });
                }
            }
        }
        console.log("¡ Termino la generacion de Usuarios  Face !");
    },
    MigrateTickets: function () {
        var DataE=Persons.find().fetch();
        var folio=1;
        // console.log("Iniciando Migrate Tickets");
        for(var i=0;i<DataE.length;i++){
            var _idEmployee=DataE[i]._id;
            var idEmployee=DataE[i].idEmployee;
            var employeeName=DataE[i].employeeName;
            var idcompany=DataE[i].idcompany;
            var busquedaAccessCtrl={
                $and:[
                  {idEmployee:_idEmployee},
                  {meal:"true"}
                ]
              };
            var DataAccessCtrl = Accesscontrol.find(busquedaAccessCtrl).fetch();
            for(var j=0;j<DataAccessCtrl.length;j++){
                var _idAccessControl= DataAccessCtrl[j]._id;
                var _entro = DataAccessCtrl[j].firstAccess;
                 var fecha = moment(_entro).format("DD/MM/YYYY");

                var busquedaAccessDetail={
                    $and:[
                            {idAccessCtrl:_idAccessControl},
                            {fpMatchResult:'MEAL'}
                        ]
                    };

                var DataAccessDetailsMeals = Accessdetails.findOne(busquedaAccessDetail);
                if(DataAccessDetailsMeals!=undefined){
                    var createdAt= DataAccessDetailsMeals.accessDate;
                    var registro=moment(createdAt).format("HH:mm")

                    var resultado = {
                        _idEmployee: _idEmployee,
                        idEmployee: parseInt(idEmployee),
                        employeeName: employeeName,
                        idcompany:idcompany,
                        fecha: fecha,
                        registro:registro,
                        folio:folio++,
                        createdAt:createdAt
                    };
                    Tickets.direct.insert(resultado);
                }
            }
        }
        console.log("Termino... Migrate Tickets");
    },
    GenerateMealTimes: function () {
        //logReport.info("Iniciando la generacion de Tiempos de Alimentos");
        // console.log("Iniciando la generacion de Tiempos de Alimentos");
        var DataComp = Companies.find({"meal" : true}, {fields: {companyName: 1}}).fetch();
        //logReport.info("Cant. de compañias que evaluan tiempo de alimentos :"+DataComp.length);
        for (var  k = 0; k < DataComp.length; k++) {
            var _idCompany= DataComp[k]._id;
            var idcompany=[];
            idcompany[0]=_idCompany;
            //logReport.info("Compañia " +_idCompany+" nombre :"+DataComp[k].companyName);
            var DataE = Persons.find({"idcompany":{$in:idcompany}}, {fields: {employeeName: 1,idEmployee:1,idcompany:1}}).fetch();
            //logReport.info("Cant de personas " +DataE.length+" encontradas en "+DataComp[k].companyName);
            for (var i = 0; i < DataE.length; i++) {
                var _idEmployee = DataE[i]._id;
                //logReport.info("Empleado " + _idEmployee + " Nombre " + DataE[i].employeeName);
                var DataAccessCtrl = Accesscontrol.find({'idEmployee': _idEmployee},{fields: {idEmployee: 1,firstAccess: 1,lastAccess: 1}}).fetch();
                if (DataAccessCtrl.length != 0) {
                    //logReport.info("Registros en  Accesscontrol :" + DataAccessCtrl.length);
                    for (var j = 0; j < DataAccessCtrl.length; j++) {
                        var _idAccessCtrl = DataAccessCtrl[j]._id;
                        var DataAccessDetails = Accessdetails.find({'idEmployee': _idEmployee,'idAccessCtrl': _idAccessCtrl}, {fields: {accessDate: 1},sort: {accessDate: 1}}).fetch();
                        if (DataAccessDetails.length > 2) {
                            //logReport.info("Registros en  DataAccessDetails :" + DataAccessDetails.length+" con idAccessCtrl "+_idAccessCtrl);
                            var FullHorario = getHorario(_idEmployee);
                            var TheHorario=FullHorario["Horarios"];
                            var TheHorarioAlimentos=FullHorario["Alimentos"];
                            if (TheHorario!=undefined) {
                                //logReport.info("Horario "+JSON.stringify(FullHorario));
                                var _entro = DataAccessCtrl[j].firstAccess;
                                var _salio= DataAccessCtrl[j].lastAccess;
                                var fechaSem = moment(_entro).format("dddd");
                                fechaSem = fechaSem.replace(/á/gi,"a");
                                fechaSem = fechaSem.replace(/é/gi,"e");
                                fechaSem = fechaSem.replace(/í/gi,"i");
                                fechaSem = fechaSem.replace(/ó/gi,"o");
                                fechaSem = fechaSem.replace(/ú/gi,"u");
                                var existDayintoJournal=TheHorario[fechaSem];
                                //logReport.info("existDayintoJournal "+JSON.stringify(existDayintoJournal));
                                if (existDayintoJournal!=undefined) {
                                    var comidaInicio=existDayintoJournal["ComidaInicio"];
                                    var comidaFin=existDayintoJournal["ComidaFin"];
                                    if(comidaInicio!=undefined && comidaFin!=undefined){
                                        var comidaInicioTiempo=comidaInicio.split(":");
                                        var comidaFinTiempo=comidaFin.split(":");
                                        var entro=_entro;
                                        entro.setHours(comidaInicioTiempo[0]);
                                        entro.setMinutes(comidaInicioTiempo[1]);
                                        entro.setSeconds(0);

                                        var salio;
                                        if(_salio==undefined || _salio==null){
                                            log.error("Indefinido "+_idAccessCtrl);
                                            salio=_entro;
                                        }else{
                                            salio=_salio;
                                        }
                                        salio.setHours(comidaFinTiempo[0]);
                                        salio.setMinutes(comidaFinTiempo[1]);
                                        salio.setSeconds(0);

                                        var busqueda={
                                            $and:[
                                              {idAccessCtrl:_idAccessCtrl},
                                              {accessDate:{$gte:entro}},
                                              {accessDate:{$lt:salio}}
                                            ]
                                        };
                                        //logReport.info("Ejecutando la busqueda :" + JSON.stringify(busqueda));
                                        var DataAccessDetailsMeals = Accessdetails.find(busqueda).fetch();
                                        //logReport.info("Cantidad de Registros despues de la busqueda :" + DataAccessDetailsMeals.length);
                                        if(DataAccessDetailsMeals.length>0){
                                            var excepcion="No";
                                            var minutos_permitidos=60;
                                            var _primerRegistroComida= DataAccessDetailsMeals[0].accessDate;
                                            var primerRegistro=moment(_primerRegistroComida).format("HH:mm")
                                            var _ultimoRegistroComida= DataAccessDetailsMeals[DataAccessDetailsMeals.length-1].accessDate;
                                            var ultimoRegistro=moment(_ultimoRegistroComida).format("HH:mm")
                                            var horas = getTiempo(_primerRegistroComida, _ultimoRegistroComida).toString();
                                            var fecha = moment(_entro).format("DD/MM/YYYY");
                                            if(primerRegistro ==ultimoRegistro){excepcion="Si"}
                                            if(TheHorarioAlimentos!=undefined){
                                                var minperm=TheHorarioAlimentos["tiempoAlimentos"];
                                                if(minperm!=undefined){
                                                    minutos_permitidos=parseInt(minperm)
                                                }
                                            }

                                            var resultado = {
                                                _idEmployee: _idEmployee,
                                                idEmployee: parseInt(DataE[i].idEmployee),
                                                employeeName:  DataE[i].employeeName,
                                                fecha: fecha,
                                                primerRegistro:primerRegistro,
                                                inicioOficial:comidaInicio,
                                                salidaOficial:comidaFin,
                                                ultimoRegistro:ultimoRegistro,
                                                excepcion:excepcion,
                                                minutos_permitidos:minutos_permitidos,
                                                idcompany:DataE[i].idcompany,
                                                fechaIni:_primerRegistroComida,
                                                fechaFin:_ultimoRegistroComida
                                            };
                                            if(horas!="-" && horas!=undefined && horas!=null){
                                                resultado["horas"]=horas.split(":")[0];
                                                resultado["minutos"]=horas.split(":")[1];
                                                var tiempo_transcurrido=parseInt(horas.split(":")[0]*60)+parseInt(horas.split(":")[1]);
                                                var estatus=GenerateMealTimes_getEstatus(tiempo_transcurrido,minutos_permitidos,TheHorarioAlimentos);
                                                resultado["estatus"]=estatus[0];
                                                resultado["sancion"]=estatus[1];
                                            }
                                            Meal_times.direct.insert(resultado);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //logReport.info("! Termino la generacion de Tiempos de Alimentos ¡ ");
        console.log("! Termino la generacion de Tiempos de Alimentos ¡ ");
    },
    GenerateReports: function () {
        var DataE=Persons.find().fetch();
        // console.log("Iniciando Migrate Reports");
        for(var i=0;i<DataE.length;i++){
            var _idEmployee=DataE[i]._id;
            var employeeName=DataE[i].employeeName;
            //logReport.info("Empleado "+_idEmployee+" Nombre "+employeeName);
            var DataAccessCtrl = Accesscontrol.find(
                {'idEmployee': _idEmployee},
                {
                    fields: {
                        idEmployee: 1,
                        firstAccess: 1,
                        lastAccess: 1
                    },
                    sort: {firstAccess: 1}
                }
            ).fetch();
            if(DataAccessCtrl!=undefined){
                ////logReport.info("Registros en  Accesscontrol :"+DataAccessCtrl.length);
                if(DataAccessCtrl.length!=0){
                    var FullHorario=getHorario(_idEmployee);
                    if (FullHorario.hasOwnProperty("Horarios")) {
                        if(FullHorario.hasOwnProperty("Asistencias"))
                        var idEmployee=DataE[i].idEmployee;
                        var employeeName=DataE[i].employeeName;
                        var idDepartment=DataE[i].idDepartment;
                        var idLocation=DataE[i].idLocation;
                        var idcompany=DataE[i].idcompany;
                        var idmanager=DataE[i].idmanager;
                        var idpagadora=DataE[i].idpagadora;
                        var idpagadora_txt=DataE[i].idpagadora_txt;

                        ////logReport.info("Horario "+JSON.stringify(FullHorario));
                        var FechaPrimerAcceso=DataAccessCtrl[0].firstAccess;
                        var FechaUltimoAcceso=DataAccessCtrl[DataAccessCtrl.length-1].firstAccess;
                        //logReport.info("FechaPrimerAcceso "+FechaPrimerAcceso);
                        //logReport.info("FechaUltimoAcceso "+FechaUltimoAcceso);
                        var days=FullHorario.Horarios;
                        var HorarioAsistencias=FullHorario.Asistencias;
                        var DatesWorks=getDatesBetween(FechaPrimerAcceso,FechaUltimoAcceso);
                        ////logReport.info("DatesWorks "+JSON.stringify(DatesWorks));
                        for(var j=0;j<DatesWorks.length;j++){
                            var ElapsedDay=DatesWorks[j];
                            var fechaSem = moment(ElapsedDay).format("dddd");
                            fechaSem = fechaSem.replace(/á/gi,"a");
                            fechaSem = fechaSem.replace(/é/gi,"e");
                            fechaSem = fechaSem.replace(/í/gi,"i");
                            fechaSem = fechaSem.replace(/ó/gi,"o");
                            fechaSem = fechaSem.replace(/ú/gi,"u");
                            //logReport.info("fechaSem "+ElapsedDay+" dia "+fechaSem);
                            var existDayintoJournal=days[fechaSem];
                            if (existDayintoJournal!=undefined) {
                                //logReport.info("existDayintoJournal "+JSON.stringify(existDayintoJournal));

                                var createdDate=moment(ElapsedDay).format("DD/MM/YYYY");
                                var filtroDataAccessCtrlByDay={
                                    'idEmployee': _idEmployee,
                                    'createdDate': createdDate
                                };
                                var oneday=days[fechaSem];
                                //logReport.info("Analizando "+JSON.stringify(oneday));
                                var inicioOficial=oneday["Entrada"];
                                var salidaOficial=oneday["Salida"];

                                //logReport.info("Ejecutando el filtro "+JSON.stringify(filtroDataAccessCtrlByDay));
                                var DataAccessCtrlByDay = Accesscontrol.findOne(filtroDataAccessCtrlByDay);
                                if(DataAccessCtrlByDay!=undefined){

                                    var entro = DataAccessCtrlByDay.firstAccess;
                                    var fecha = moment(entro).format("DD/MM/YYYY");
                                    var primerRegistro = moment(entro).format("HH:mm");
                                    var salio= DataAccessCtrlByDay.lastAccess;
                                    var ultimoRegistro="-";
                                    if(salio!=undefined){
                                        ultimoRegistro = moment(salio).format("HH:mm");
                                    }
                                    var excepcion = getexcepcion(entro, salio);
                                    var horas = getHoras(entro, salio);
                                    var tiempo = getTiempo(entro, salio);
                                    var getSancionandStatus=[];
                                    getSancionandStatus=GenerateReports_getEstatus(entro,inicioOficial,HorarioAsistencias);
                                    var estatus = getSancionandStatus[0];
                                    var sancion = getSancionandStatus[1];
                                    var antes=GenerateReports_getAntes(salio,salidaOficial);

                                    var resultado = {
                                        _idEmployee: _idEmployee,
                                        idEmployee: parseInt(idEmployee),
                                        employeeName: employeeName,
                                        idDepartment:idDepartment,
                                        idLocation: idLocation,
                                        idcompany: idcompany,
                                        idmanager: idmanager,
                                        fecha: fecha,
                                        inicioOficial: inicioOficial,
                                        primerRegistro: primerRegistro,
                                        salidaOficial: salidaOficial,
                                        ultimoRegistro: ultimoRegistro,
                                        excepcion: excepcion,
                                        tiempo: tiempo,
                                        horas: horas,
                                        estatus: estatus,
                                        sancion:sancion,
                                        antes:antes,
                                        idpagadora:idpagadora,
                                        idpagadora_txt:idpagadora_txt
                                    };

                                    if(entro instanceof Date){
                                        resultado["fechaIni"]=entro;
                                    }
                                    if(salio instanceof Date){
                                        resultado["fechaFin"]=salio;
                                    }
                                    
                                    var DetalleAcceso=Accessdetails.findOne({"idAccessCtrl":DataAccessCtrlByDay._id},{sort:{createdAt:1}});
                                    if(DetalleAcceso){
                                        resultado["idDevice"]=GetidDevice(DetalleAcceso.idDevice);
                                        resultado["idLocationChk"]=DetalleAcceso.idLocation;
                                        resultado["idLocationChk_txt"]=DetalleAcceso.idLocation_txt;
                                    }
                                    Reports.direct.insert(resultado);
                                }else{
                                    var resultado = {
                                        _idEmployee: _idEmployee,
                                        idEmployee: parseInt(idEmployee),
                                        employeeName: employeeName,
                                        idDepartment:idDepartment,
                                        idLocation: idLocation,
                                        idcompany: idcompany,
                                        idmanager: idmanager,
                                        fecha: createdDate,
                                        inicioOficial: inicioOficial,
                                        primerRegistro: "-",
                                        salidaOficial: salidaOficial,
                                        ultimoRegistro: "-",
                                        excepcion:"-",
                                        tiempo: "-",
                                        horas: "-",
                                        estatus: "Falta",
                                        sancion:"-",
                                        antes:"-",
                                        fechaIni : ElapsedDay,
                                        fechaFin : ElapsedDay,
                                        idDevice:"-",
                                        idLocationChk:"-",
                                        idLocationChk_txt:"-",
                                        idpagadora:idpagadora,
                                        idpagadora_txt:idpagadora_txt
                                    };
                                    Reports.direct.insert(resultado);
                                }
                            }
                        }
                   }else{
                    //logReport.error("Falta de Horario del Empleado "+_idEmployee+" Nombre "+employeeName);
                   }
                }
            }
        }
        console.log("Termino... Migrate Reports");
    }
});
