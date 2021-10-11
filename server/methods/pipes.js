if (Meteor.isServer) {
  Meteor.methods({
    //*********** Formato de Inicio y Fin que se recibe YYYY-MM-DD, ejemplo "2019-01-23"
    //Datos Generales de la Compañia manera Mensual
    GetCountMonthForCompany:function(userId,Inicio,Fin){
      this.unblock();
      var Inicial = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
      var Final = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({ "idcompany":{$in:_idCompany},"tag" : "Gral","pub":"Companie" });
        }
      }


      var PipelineCompany = [
        {
          $match: {
            $and: [
              { "estatus": { $nin: ["Normal","Tolerancia","-"] } },
              { "fechaIni": { $gte: Inicial, $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: { "estatus": "$estatus","idcompany": "$idcompany"},
            "idcompany":{"$first":"$idcompany"},
            "estatus":{"$first":"$estatus"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,idcompany:{$arrayElemAt:["$idcompany",0]},estatus:1,Totales:1,tag:"Gral",pub:"Companie"} },
        { $sort: {idcompany: 1 } },
      ];
      var PipelineAnticipadas = [
        {
          $match: {
            $and: [
              { "antes": "true" },
              { "fechaIni": { $gte: Inicial, $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"idcompany": "$idcompany"},
            "idcompany":{"$first":"$idcompany"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,idcompany:{$arrayElemAt:["$idcompany",0]},Totales:1,estatus:"Anticipadas",tag:"Gral",pub:"Companie"} },
        { $sort: {idcompany: 1 } },
      ];
      var PipelineExcepciones = [
        {
          $match: {
            $and: [
              { "excepcion": "Si" },
              { "fechaIni": { $gte: Inicial, $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"idcompany": "$idcompany"},
            "idcompany":{"$first":"$idcompany"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,idcompany:{$arrayElemAt:["$idcompany",0]},Totales:1,estatus:"Excepciones",tag:"Gral",pub:"Companie"} },
        { $sort: {idcompany: 1 } },
      ];
      var PipelineTickets = [
        {
          $match: {
            $and: [
              { "createdAt": { $gte: Inicial, $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"idcompany": "$idcompany"},
            "idcompany":{"$first":"$idcompany"},
            "Totales":{$sum:1}
          }
        },
        {
            $project: {
              _id:0,
              // idcompany:{
              //   $arrayElemAt:["$idcompany",0]
              // },
              idcompany:1,
              Totales:1,
              estatus:"Tickets",
              tag:"Gral",
              pub:"Companie"
          }
        },
        { $sort: {idcompany: 1 } },
      ];


      var PipelinePermisos = [
        {
          $match: {
            $and: [
              { "createdAt": { $gte: Inicial, $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"idcompany": "$idcompany"},
            "idcompany":{"$first":"$idcompany"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,idcompany:{$arrayElemAt:["$idcompany",0]},Totales:1,estatus:"Permisos",tag:"Gral",pub:"Companie"} },
        { $sort: {idcompany: 1 } },
      ];
      var PipelineVacations = [
        {
          $match: { $and: [ { "fechaIni": { $gte: Inicial, $lt: Final } } ] }
        },
        {
          $group:{
            _id: {"idcompany": "$idcompany"},
            "idcompany":{"$first":"$idcompany"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,idcompany:{$arrayElemAt:["$idcompany",0]},Totales:1,estatus:"Vacations",tag:"Gral",pub:"Companie"} },
        { $sort: {idcompany: 1 } },
      ];
      var PipelineAlimentos = [
        {
          $match: {
              $and: [
              { "fechaIni": { $gte: Inicial} },
              { "fechaFin": { $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"idcompany": "$idcompany"},
            "idcompany":{"$first":"$idcompany"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,idcompany:1,Totales:1,estatus:"Alimentos",tag:"Gral",pub:"Companie"} },
        { $sort: {idcompany: 1 } },
      ];
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            var obj={
              "idcompany":{$in:_idCompany}
            };
            PipelineCompany[0]["$match"]["$and"].push(obj);
            PipelineAnticipadas[0]["$match"]["$and"].push(obj);
            PipelineExcepciones[0]["$match"]["$and"].push(obj);
            PipelineTickets[0]["$match"]["$and"].push(obj);
            PipelinePermisos[0]["$match"]["$and"].push(obj);
            PipelineVacations[0]["$match"]["$and"].push(obj);
        }
      }
      var ResultPipelineCompany = Reports.aggregate(PipelineCompany);
      var ResultPipelineAnticipadas = Reports.aggregate(PipelineAnticipadas);
      var ResultPipelineExcepciones = Reports.aggregate(PipelineExcepciones);
      var ResultPipelineTickets = Tickets.aggregate(PipelineTickets);
      var ResultPipelinePermisos = Permisos.aggregate(PipelinePermisos);
      var ResultPipelineVacations= Vacations.aggregate(PipelineVacations);
      var ResultPipelineAlimentos= Meal_times.aggregate(PipelineAlimentos);

      if(ResultPipelineCompany.length==0){
        if(userId!=undefined){
          var res = Meteor.users.findOne({ "_id": userId });
          if (res && res.profile && res.profile.idcompany) {
              var _idCompany = res.profile.idcompany;
              Sumados.remove({
                "idcompany":{$in:_idCompany},"tag":"Gral","pub":"Companie","estatus":{$in:["Falta","Retardo Normal","Retardo Menor","Retardo Mayor"]}
              });
          }
        }
      }

      ResultPipelineCompany.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":elem.estatus,tag:"Gral",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelineAnticipadas.length==0){
      if(userId!=undefined){
          var res = Meteor.users.findOne({ "_id": userId });
          if (res && res.profile && res.profile.idcompany) {
              var _idCompany = res.profile.idcompany;
              Sumados.remove({
                "idcompany":{$in:_idCompany},"estatus":"Anticipadas",tag:"Gral",pub:"Companie"
              });
          }
        }
      }

      ResultPipelineAnticipadas.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":"Anticipadas",tag:"Gral",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelineExcepciones.length==0){
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({
              "idcompany":{$in:_idCompany},"estatus":"Excepciones",tag:"Gral",pub:"Companie"
            });
        }
      }
    }

      ResultPipelineExcepciones.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":"Excepciones",tag:"Gral",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelineTickets.length==0){
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({
              "idcompany":{$in:_idCompany},"estatus":"Tickets",tag:"Gral",pub:"Companie"
            });
        }
      }
    }

      ResultPipelineTickets.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":"Tickets",tag:"Gral",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelinePermisos.length==0){
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({
              "idcompany":{$in:_idCompany},"estatus":"Permisos",tag:"Gral",pub:"Companie"
            });
        }
      }
    }

      ResultPipelinePermisos.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":"Permisos",tag:"Gral",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelineVacations.length==0){
            if(userId!=undefined){
              var res = Meteor.users.findOne({ "_id": userId });
              if (res && res.profile && res.profile.idcompany) {
                  var _idCompany = res.profile.idcompany;
                  Sumados.remove({
                    "idcompany":{$in:_idCompany},"estatus":"Vacations",tag:"Gral",pub:"Companie"
                  });
              }
            }
          }

      ResultPipelineVacations.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":"Vacations",tag:"Gral",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelineAlimentos.length==0){
            if(userId!=undefined){
              var res = Meteor.users.findOne({ "_id": userId });
              if (res && res.profile && res.profile.idcompany) {
                  var _idCompany = res.profile.idcompany;
                  Sumados.remove({
                    "idcompany":{$in:_idCompany},"estatus":"Alimentos",tag:"Gral",pub:"Companie"
                  });
              }
            }
          }

      ResultPipelineAlimentos.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":"Alimentos",tag:"Gral",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

    },
    //Datos Generales por Departamentos
    GetDepartmentsExtraMonthForCompany:function(userId,Inicio,Fin){
      this.unblock();
      var Inicial = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
      var Final = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();
      var PipelineExtraDepartments = [
        {
          $match: {
            $and: [
              { "idDepartment": { $nin: ["",null] } },
              { "createdAt": { $gte:  Inicial, $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"idDepartment_txt":"$idDepartment_txt","idcompany":"$idcompany"},
            "estatus":{"$first":"Extra"},
            "tag":{"$first":"EstatusExtra"},
            "idcompany":{"$first":"$idcompany"},
            "idDepartment_txt":{"$first":"$idDepartment_txt"},
            "idDepartment":{"$first":"$idDepartment"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,estatus:1,tag:1,idcompany:{$arrayElemAt:["$idcompany",0]},idDepartment_txt:1,idDepartment:1,Totales:1,pub:"Companie"} },
        { $sort: {idDepartment_txt: 1 } },
      ];
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            var obj={
              "idcompany":{$in:_idCompany}
            };
            PipelineExtraDepartments[0]["$match"]["$and"].push(obj);
        }
      }

      var ResultPipelineExtraDepartments=Extra_time.aggregate(PipelineExtraDepartments);
      if(ResultPipelineExtraDepartments.length==0){
        if(userId!=undefined){
          var res = Meteor.users.findOne({ "_id": userId });
          if (res && res.profile && res.profile.idcompany) {
              var _idCompany = res.profile.idcompany;
              Sumados.remove({
                "idcompany":{$in:_idCompany},
                "estatus":"Extra",
                tag:"EstatusExtra",
                pub:"Companie"
              });
          }
        }
      }
      ResultPipelineExtraDepartments.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":"Extra",tag:"EstatusExtra",idDepartment:elem.idDepartment,pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });
    },
    GetDepartmentsMonthForCompany:function(userId,Inicio,Fin){
      this.unblock();
      var Inicial = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
      var Final = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();

      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({ "idcompany":{$in:_idCompany},"tag" : "EstatusDeptos","pub":"Companie" });
        }
      }

      var PipelineDepartmentsGralRetardos = [
        {
          $match: {
            $and: [
              { "estatus": { $in: ["Retardo Normal","Retardo Menor","Retardo Mayor"] } },
              { "fechaIni": { $gte:  Inicial, $lt: Final} }
            ]
          }
        },
        {
          $group:{
            _id: {"idDepartment_txt":"$idDepartment_txt","idcompany":"$idcompany"},
            "estatus":{"$first":"Retardo"},
            "tag":{"$first":"EstatusDeptos"},
            "idcompany":{"$first":"$idcompany"},
            "idDepartment_txt":{"$first":"$idDepartment_txt"},
            "idDepartment":{"$first":"$idDepartment"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,estatus:1,tag:1,idcompany:{$arrayElemAt:["$idcompany",0]},idDepartment_txt:1,idDepartment:1,Totales:1,pub:"Companie"} },
        { $sort: {idDepartment: 1 } },
      ];
      var PipelineDepartmentsGralFaltas = [
        {
          $match: {
            $and: [
              { "estatus":"Falta" },
              { "fechaIni": { $gte:  Inicial, $lt: Final} }
            ]
          }
        },
        {
          $group:{
            _id: {"idDepartment_txt":"$idDepartment_txt","idcompany":"$idcompany"},
            "estatus":{"$first":"Faltas"},
            "tag":{"$first":"EstatusDeptos"},
            "idcompany":{"$first":"$idcompany"},
            "idDepartment_txt":{"$first":"$idDepartment_txt"},
            "idDepartment":{"$first":"$idDepartment"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,estatus:1,tag:1,idcompany:{$arrayElemAt:["$idcompany",0]},idDepartment_txt:1,idDepartment:1,Totales:1,pub:"Companie"} },
        { $sort: {idDepartment: 1 } },
      ];
      var PipelineDepartmentsGralAnticipadas = [
        {
          $match: {
            $and: [
              { "antes" : "true"},
              { "fechaIni": { $gte:  Inicial, $lt: Final} }
            ]
          }
        },
        {
          $group:{
            _id: {"idDepartment_txt":"$idDepartment_txt","idcompany":"$idcompany"},
            "estatus":{"$first":"Anticipadas"},
            "tag":{"$first":"EstatusDeptos"},
            "idcompany":{"$first":"$idcompany"},
            "idDepartment_txt":{"$first":"$idDepartment_txt"},
            "idDepartment":{"$first":"$idDepartment"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,estatus:1,tag:1,idcompany:{$arrayElemAt:["$idcompany",0]},idDepartment_txt:1,idDepartment:1,Totales:1,pub:"Companie"} },
        { $sort: {idDepartment: 1 } },
      ];
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            var obj={
              "idcompany":{$in:_idCompany}
            };
            PipelineDepartmentsGralRetardos[0]["$match"]["$and"].push(obj);
            PipelineDepartmentsGralFaltas[0]["$match"]["$and"].push(obj);
            PipelineDepartmentsGralAnticipadas[0]["$match"]["$and"].push(obj);
        }
      }
      var ResultPipelineDepartmentsGralRetardos= Reports.aggregate(PipelineDepartmentsGralRetardos);
      var ResultPipelineDepartmentsGralFaltas= Reports.aggregate(PipelineDepartmentsGralFaltas);
      var ResultPipelineDepartmentsGralAnticipadas= Reports.aggregate(PipelineDepartmentsGralAnticipadas);

      if(ResultPipelineDepartmentsGralRetardos.length==0){
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({
              "idcompany":{$in:_idCompany},"tag" : "EstatusDeptos","pub":"Companie","estatus":"Retardo"
            });
        }
      }
    }

      ResultPipelineDepartmentsGralRetardos.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":elem.estatus,"idDepartment":elem.idDepartment,"tag" : "EstatusDeptos",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelineDepartmentsGralFaltas.length==0){
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({
              "idcompany":{$in:_idCompany},"tag" : "EstatusDeptos","pub":"Companie","estatus":"Faltas"
            });
        }
      }
    }

      ResultPipelineDepartmentsGralFaltas.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":elem.estatus,"idDepartment":elem.idDepartment,"tag" : "EstatusDeptos",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelineDepartmentsGralAnticipadas.length==0){
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({
              "idcompany":{$in:_idCompany},"tag" : "EstatusDeptos","pub":"Companie","estatus":"Anticipadas"
            });
        }
      }
    }
      ResultPipelineDepartmentsGralAnticipadas.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"estatus":elem.estatus,"idDepartment":elem.idDepartment,"tag" : "EstatusDeptos",pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });
    },
    //Datos Generales por Departamento y usuario
    GetDepartmentsExtraXUsersMonthForCompany:function(userId,Inicio,Fin){
      this.unblock();
      var Inicial = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
      var Final = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();

      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({ "idcompany":{$in:_idCompany},"estatus":"Extra",tag:"EstatusExtraUsers",pub:"Companie" });
        }
      }

      var PipelineExtraUsersDepartments = [
        {
          $match: {
            $and: [
              { "idDepartment": { $nin: ["",null] } },
              { "createdAt": { $gte:  Inicial, $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: { "_idEmployee": "$_idEmployee"},
           "estatus":{"$first":"Extra"},
           "_idEmployee":{"$first":"$_idEmployee"},
           "tag":{"$first":"EstatusExtraUsers"},
           "idDepartment":{"$first":"$idDepartment"},
           "idDepartment_txt":{"$first":"$idDepartment_txt"},
           "employeeName":{"$first":"$employeeName"},
           "Totales":{$sum:1},
           "idcompany":{"$first":"$idcompany"}
          }
        },
        { $project: {_id:0,estatus:1,_idEmployee:1,tag:1,idDepartment:1,idDepartment_txt:1,employeeName:1,Totales:1,idcompany:{$arrayElemAt:["$idcompany",0]},pub:"Companie"} },
        { $sort: {idcompany:1,idDepartment:1,employeeName: 1 } }
      ];

      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            var obj={
              "idcompany":{$in:_idCompany}
            };
            PipelineExtraUsersDepartments[0]["$match"]["$and"].push(obj);
        }
      }

      var ResultPipelineExtraUsersDepartments=Extra_time.aggregate(PipelineExtraUsersDepartments);
      if(ResultPipelineExtraUsersDepartments.length==0){
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({
              "idcompany":{$in:_idCompany},"estatus":"Extra",tag:"EstatusExtraUsers",pub:"Companie"
            });
        }
      }
    }

      ResultPipelineExtraUsersDepartments.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":{$in:[elem.idcompany]},"estatus":"Extra",tag:"EstatusExtraUsers",pub:"Companie",_idEmployee:elem._idEmployee});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });
    },
    GetDepartmentsXUsersMonth:function(userId,Inicio,Fin){
      this.unblock();
      var Inicial = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
      var Final = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();

      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({ "idcompany":{$in:_idCompany},tag:"EstatusDeptosUsers",pub:"Companie" });
        }
      }

      var PipelineDepartmentsUsersGralRetardos = [
        {
          $match: {
            $and: [
              { "estatus": { $in: ["Retardo Normal","Retardo Menor","Retardo Mayor"] } },
              { "fechaIni": { $gte:  Inicial, $lt:  Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"_idEmployee": "$_idEmployee"},
            "estatus":{"$first":"Retardo"},
            "_idEmployee":{"$first":"$_idEmployee"},
            "tag":{"$first":"EstatusDeptosUsers"},
            "idDepartment":{"$first":"$idDepartment"},
            "idDepartment_txt":{"$first":"$idDepartment_txt"},
            "employeeName":{"$first":"$employeeName"},
            "Totales":{$sum:1},
            "idcompany":{"$first":"$idcompany"}
          }
        },
        { $project: {_id:0,estatus:1,_idEmployee:1,tag:1,idDepartment:1,idDepartment_txt:1,employeeName:1,Totales:1,idcompany:{$arrayElemAt:["$idcompany",0]},"pub" : "Companie"} },
        { $sort: {idcompany:1,idDepartment:1,employeeName: 1 } },
      ];

      var PipelineDepartmentsUsersGralFaltas = [
        {
          $match: {
            $and: [
              { "estatus": "Falta" },
              { "fechaIni": { $gte:  Inicial, $lt:  Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"_idEmployee": "$_idEmployee"},
            "estatus":{"$first":"Falta"},
            "_idEmployee":{"$first":"$_idEmployee"},
            "tag":{"$first":"EstatusDeptosUsers"},
            "idDepartment":{"$first":"$idDepartment"},
            "idDepartment_txt":{"$first":"$idDepartment_txt"},
            "employeeName":{"$first":"$employeeName"},
            "Totales":{$sum:1},
            "idcompany":{"$first":"$idcompany"}
          }
        },
        { $project: {_id:0,estatus:1,_idEmployee:1,tag:1,idDepartment:1,idDepartment_txt:1,employeeName:1,Totales:1,idcompany:{$arrayElemAt:["$idcompany",0]},"pub" : "Companie"} },
        { $sort: {idcompany:1,idDepartment:1,employeeName: 1 } },
      ];

      var PipelineDepartmentsUsersGralAnticipadas = [
        {
          $match: {
            $and: [
              { "antes": "true" },
              { "fechaIni": { $gte:  Inicial, $lt:  Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"_idEmployee": "$_idEmployee"},
            "estatus":{"$first":"Anticipadas"},
            "_idEmployee":{"$first":"$_idEmployee"},
            "tag":{"$first":"EstatusDeptosUsers"},
            "idDepartment":{"$first":"$idDepartment"},
            "idDepartment_txt":{"$first":"$idDepartment_txt"},
            "employeeName":{"$first":"$employeeName"},
            "Totales":{$sum:1},
            "idcompany":{"$first":"$idcompany"}
          }
        },
        { $project: {_id:0,estatus:1,_idEmployee:1,tag:1,idDepartment:1,idDepartment_txt:1,employeeName:1,Totales:1,idcompany:{$arrayElemAt:["$idcompany",0]},"pub" : "Companie"} },
        { $sort: {idcompany:1,idDepartment:1,employeeName: 1 } },
      ];
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            var obj={
              "idcompany":{$in:_idCompany}
            };
            PipelineDepartmentsUsersGralRetardos[0]["$match"]["$and"].push(obj);
            PipelineDepartmentsUsersGralFaltas[0]["$match"]["$and"].push(obj);
            PipelineDepartmentsUsersGralAnticipadas[0]["$match"]["$and"].push(obj);
        }
      }
      var ResultPipelineDepartmentsUsers = Reports.aggregate(PipelineDepartmentsUsersGralRetardos);
      var ResultPipelineDepartmentsUsersGralFaltas = Reports.aggregate(PipelineDepartmentsUsersGralFaltas);
      var ResultPipelineDepartmentsUsersGralAnticipadas = Reports.aggregate(PipelineDepartmentsUsersGralAnticipadas);

      ResultPipelineDepartmentsUsers.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"idDepartment":elem.idDepartment,"estatus":elem.estatus,tag:elem.tag,"_idEmployee":elem._idEmployee,pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelineDepartmentsUsersGralFaltas.length==0){
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({
              "idcompany":{$in:_idCompany},"estatus":"Falta",tag:"EstatusDeptosUsers",pub:"Companie"
            });
        }
      }
    }

      ResultPipelineDepartmentsUsersGralFaltas.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"idDepartment":elem.idDepartment,"estatus":elem.estatus,tag:elem.tag,"_idEmployee":elem._idEmployee,pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      if(ResultPipelineDepartmentsUsersGralAnticipadas.length==0){
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.remove({
              "idcompany":{$in:_idCompany},"estatus":"Anticipadas",tag:"EstatusDeptosUsers",pub:"Companie"
            });
        }
      }
    }

      ResultPipelineDepartmentsUsersGralAnticipadas.forEach(elem => {
        var exists=Sumados.findOne({"idcompany":elem.idcompany,"idDepartment":elem.idDepartment,"estatus":elem.estatus,tag:elem.tag,"_idEmployee":elem._idEmployee,pub:"Companie"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });
    },
    //Datos Generales por Usuario
    GetCountUser:function(userId,Inicio,Fin){
      this.unblock();
      var Inicial = moment(Inicio + "T12:00:00").hour(0).minutes(0).seconds(0).toDate();
      var Final = moment(Fin + "T12:00:00").hour(23).minutes(0).seconds(0).toDate();

      var PipelineUsersAsistencias = [
        {
          $match: {
            $and: [
              { "estatus": { $nin: ["Normal","Tolerancia","-"] } },
              { "fechaIni": { $gte:  Inicial, $lt:  Final } }
            ]
          }
        },
        {
          $group:{
            _id: { "estatus": "$estatus","_idEmployee": "$_idEmployee"},
            "_idEmployee":{"$first":"$_idEmployee"},
            "estatus":{"$first":"$estatus"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,_idEmployee:1,estatus:1,Totales:1,"tag":"Gral",pub:"User"} },
        { $sort: {_idEmployee: 1 } },
      ];

      var PipelineAnticipadas = [
        {
          $match: {
            $and: [
              { "antes": "true" },
              { "fechaIni": { $gte: Inicial, $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"_idEmployee": "$_idEmployee"},
            "_idEmployee":{"$first":"$_idEmployee"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,_idEmployee:1,estatus:"Anticipadas",Totales:1,tag:"Gral",pub:"User"} },
        { $sort: {_idEmployee: 1 } }
      ];

      var PipelineExcepciones = [
        {
          $match: {
            $and: [
              { "excepcion": "Si" },
              { "fechaIni": { $gte: Inicial, $lt: Final } }
            ]
          }
        },
        {
          $group:{
            _id: {"_idEmployee": "$_idEmployee"},
            "_idEmployee":{"$first":"$_idEmployee"},
            "Totales":{$sum:1}
          }
        },
        { $project: {_id:0,_idEmployee:1,estatus:"Excepciones",Totales:1,"tag":"Gral",pub:"User"} },
        { $sort: {idcompany: 1 } },
      ];

      if (userId!=undefined) {
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idEmployee) {
            var idEmployee = res.profile.idEmployee;
            var obj={"_idEmployee":idEmployee};
            PipelineUsersAsistencias[0]["$match"]["$and"].push(obj);
            PipelineAnticipadas[0]["$match"]["$and"].push(obj);
            PipelineExcepciones[0]["$match"]["$and"].push(obj);
        }
      }
      var ResultPipelineUsers= Reports.aggregate(PipelineUsersAsistencias);
      var ResultPipelineAnticipadas= Reports.aggregate(PipelineAnticipadas);
      var ResultPipelineExcepciones= Reports.aggregate(PipelineExcepciones);

      ResultPipelineUsers.forEach(elem => {
        var exists=Sumados.findOne({"_idEmployee":elem._idEmployee,"estatus":elem.estatus,"tag":"Gral",pub:"User"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      ResultPipelineAnticipadas.forEach(elem => {
        var exists=Sumados.findOne({"_idEmployee":elem._idEmployee,"estatus":"Anticipadas","tag":"Gral",pub:"User"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

      ResultPipelineExcepciones.forEach(elem => {
        var exists=Sumados.findOne({"_idEmployee":elem._idEmployee,"estatus":"Excepciones","tag":"Gral",pub:"User"});
        if(exists==undefined){
          Sumados.direct.insert(elem);
        }else{
          Sumados.direct.update({_id:exists._id}, {$set:{ "Totales":elem.Totales }});
        }
      });

    },
    GetPersonalized:function(userId,Inicio,Fin){
      var lastUpdate=moment().subtract({seconds:2}).toDate();
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.upsert({"idcompany":_idCompany[0],"estatus":"lastUpdateCompany",pub:"Companie"}, {$set:{ "lastUpdate":lastUpdate }});
        }
      }else{
        var Compani=Companies.find({"active":true},{fields:{"_id":1}}).fetch();
        Compani.forEach(elem => {
          Sumados.upsert({"idcompany":elem._id,"estatus":"lastUpdateCompany",pub:"Companie"}, {$set:{ "lastUpdate":lastUpdate}});
        });
      }
      Meteor.call("GetCountMonthForCompany",userId,Inicio,Fin);
    },
    GetDepartamentos:function(userId,Inicio,Fin){
      var lastUpdate=moment().subtract({seconds:2}).toDate();
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.upsert({"idcompany":_idCompany[0],"estatus":"lastUpdateDeptos",pub:"Companie"}, {$set:{ "lastUpdate":lastUpdate }});
        }
      }else{
        var Compani=Companies.find({"active":true},{fields:{"_id":1}}).fetch();
        Compani.forEach(elem => {
          Sumados.upsert({"idcompany":elem._id,"estatus":"lastUpdateDeptos",pub:"Companie"}, {$set:{ "lastUpdate":lastUpdate }});
        });
      }
      Meteor.call("GetDepartmentsMonthForCompany",userId,Inicio,Fin);
      Meteor.call("GetDepartmentsXUsersMonth",userId,Inicio,Fin);
    },
    GetExtraTiempo:function(userId,Inicio,Fin){
        var lastUpdate=moment().subtract({seconds:2}).toDate();
      if(userId!=undefined){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            Sumados.upsert({"idcompany":_idCompany[0],"estatus":"lastUpdateExtra",pub:"Companie"}, {$set:{ "lastUpdate":lastUpdate }});
        }
      }else{
        var Compani=Companies.find({"active":true},{fields:{"_id":1}}).fetch();
        Compani.forEach(elem => {
          Sumados.upsert({"idcompany":elem._id,"estatus":"lastUpdateExtra",pub:"Companie"}, {$set:{ "lastUpdate":lastUpdate }});
        });
      }
      Meteor.call('GetDepartmentsExtraMonthForCompany',userId,Inicio,Fin);
      Meteor.call("GetDepartmentsExtraXUsersMonthForCompany",userId,Inicio,Fin);
    }
  });
}
