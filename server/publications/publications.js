if (Meteor.isServer) {

  Meteor.publish('get_sumados', function (userId) {
      if (Roles.userHasRole(userId, "Usuario Administrador") == true ||
          Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Sumados.find({
                  $and:[
                    {pub:"Companie"},
                    {"idcompany":{$in:_idCompany}}
                ]},{sort:{idDepartment_txt:1}});
            }
      }else if (Roles.userHasRole(userId, "Usuario")){
          var res = Meteor.users.findOne({ "_id": userId });
          if (res && res.profile && res.profile.idEmployee) {
              var UserId = res.profile.idEmployee;
              return Sumados.find({
                $and:[
                  {pub:"User"},
                  {"_idEmployee":UserId}
              ]});
          }
      }
  });

  Meteor.publish("getBiometricOperations", function(_id){
    return BiometricOperations.find({"_id":_id});
  });

  Meteor.publish("getOneCompany", function(_id){
    return Companies.find({"_id":{$in:_id}});
  });

  Meteor.publish("getOnePhotoPerson", function(_id){
    return Persons.find({"_id":_id},{fields:{"face":1}});
  });

  Meteor.publish("getOneTicket", function(_id){
    return Tickets.find({"_id":_id});
  });

    Meteor.publish('getUsers', function (userId) {
        if (Roles.userHasRole(userId, "admin") == true) {
            return Meteor.users.find();
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Meteor.users.find({"profile.idcompany":{$in:_idCompany}});
            }
        }
    });

    Meteor.publish('get_Temp_messages', function () {
        return Temp_messages.find();
    });

    Meteor.publish('get_Enrollments_uptemp', function () {
        return Enrollments_uptemp.find();
    });

    Meteor.publish("CountReportsFaltas",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountReportsFaltas",Reports.find({
                "estatus":"Falta",
                "fechaIni":{$gte : fechaInicio },
                "fechaFin":{$lt : fechaFin }
            }));
        }else if(
            Roles.userHasRole(userId, "Usuario Administrador") == true ||
            Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountReportsFaltas",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "estatus":"Falta",
                    "fechaIni":{$gte : fechaInicio },
                    "fechaFin":{$lt : fechaFin }
                }));
            }
        }else if( Roles.userHasRole(userId, "Usuario")==true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
                var _idCompany = res.profile.idcompany;
                var _idEmployee = res.profile.idEmployee;
                Counts.publish(this,"CountReportsFaltas",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "estatus":"Falta",
                    "_idEmployee":_idEmployee,
                    "fechaIni":{$gte : fechaInicio },
                    "fechaFin":{$lt : fechaFin }
                }));
            }
        }
      });

      Meteor.publish('getGraphExtra_time', function (userId,fechaInicio,fechaFin) {
        if(Roles.userHasRole(userId, "Usuario Administrador") == true ||
            Roles.userHasRole(userId, "Supervisor") == true){
              var res = Meteor.users.findOne({ "_id":userId  });
              if (res && res.profile && res.profile.idcompany) {
                  var _idCompany = res.profile.idcompany;
                  return Extra_time.find({
                    $and:[
                      {"idcompany": {$in: _idCompany}},
                      {"createdAt":{$gte : fechaInicio,$lt : fechaFin }}
                    ]
                  }
                  ,{fields:{
                    "idEmployee" : 0,
                    "idLocation" :0,
                    "idcompany" : 0,
                    "fecha" : 0,
                    "inicioOficial" : 0,
                    "salidaOficial" : 0,
                    "tiempoOficial" : 0,
                    "inicioLaborado" : 0,
                    "salidaLaborado" : 0,
                    "tiempoLaborado" : 0,
                    "hrsLaborado" : 0,
                    "minLaborado" : 0,
                    "idLocation_txt" : 0,
                    "idDepartment_txt" : 0
                  }}
                );
              }
            }
      });

      Meteor.publish("CountReportsAnticipadas",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountReportsAnticipadas",Reports.find({
                "antes" : "true",
                "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
            }));
        }else if(
            Roles.userHasRole(userId, "Usuario Administrador") == true ||
            Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountReportsAnticipadas",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "antes" : "true",
                    "fechaIni":{$gte : fechaInicio },
                    "fechaFin":{$lt : fechaFin }
                }));
            }
        }else if( Roles.userHasRole(userId, "Usuario")==true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
                var _idCompany = res.profile.idcompany;
                var _idEmployee = res.profile.idEmployee;
                Counts.publish(this,"CountReportsAnticipadas",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "antes" : "true",
                    "_idEmployee":_idEmployee,
                    "fechaIni":{$gte : fechaInicio },
                    "fechaFin":{$lt : fechaFin }
                }));
            }
        }
      });

      Meteor.publish("CountJustificantes",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountJustificantes",Justificantes.find({
                "createdAt":{$gte : fechaInicio,$lt : fechaFin}
            }));
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountJustificantes",Justificantes.find({
                    "idcompany":{$in:_idCompany},
                    "createdAt":{$gte : fechaInicio },
                    "createdAt":{$lt : fechaFin }
                }));
            }
        }
      });

      Meteor.publish("CountPermisos",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountPermisos",Permisos.find({
                "createdAt":{$gte : fechaInicio,$lt : fechaFin}
            }));
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountPermisos",Permisos.find({
                    "idcompany":{$in:_idCompany},
                    "createdAt":{$gte : fechaInicio },
                    "createdAt":{$lt : fechaFin }
                }));
            }
        }
      });

      Meteor.publish("CountReportsExcepciones",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountReportsExcepciones",Reports.find({
                "excepcion" : "Si",
                "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
            }));
        }else if(
            Roles.userHasRole(userId, "Usuario Administrador") == true ||
            Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountReportsExcepciones",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "excepcion" : "Si",
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        } else if( Roles.userHasRole(userId, "Usuario")==true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
                var _idCompany = res.profile.idcompany;
                var _idEmployee = res.profile.idEmployee;
                Counts.publish(this,"CountReportsExcepciones",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "_idEmployee":_idEmployee,
                    "excepcion" : "Si",
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        }
      });

      Meteor.publish("CountReportsRetardos",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountReportsRetardos",Reports.find({
                $or: [
                    {"estatus" : "Retardo Normal"},
                    {"estatus" : "Retardo Menor"},
                    {"estatus" : "Retardo Mayor"}
                ],
                "fechaIni":{$gte : fechaInicio },
                "fechaFin":{$lt : fechaFin }
            }));
        }else if(
            Roles.userHasRole(userId, "Usuario Administrador") == true ||
            Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountReportsRetardos",Reports.find({
                    $or: [
                        {"estatus" : "Retardo Normal"},
                        {"estatus" : "Retardo Menor"},
                        {"estatus" : "Retardo Mayor"}
                      ],
                    "idcompany":{$in:_idCompany},
                    "fechaIni":{$gte : fechaInicio },
                    "fechaFin":{$lt : fechaFin }
                }));
            }
        }else if( Roles.userHasRole(userId, "Usuario")==true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
                var _idCompany = res.profile.idcompany;
                var _idEmployee = res.profile.idEmployee;
                Counts.publish(this,"CountReportsRetardos",Reports.find({
                    $or: [
                        {"estatus" : "Retardo Normal"},
                        {"estatus" : "Retardo Menor"},
                        {"estatus" : "Retardo Mayor"}
                      ],
                    "idcompany":{$in:_idCompany},
                    "_idEmployee":_idEmployee,
                    "fechaIni":{$gte : fechaInicio },
                    "fechaFin":{$lt : fechaFin }
                }));
            }
        }
      });

      Meteor.publish("CountMeal_times",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountMeal_times",Meal_times.find({
                $or: [
                    {"estatus" : "Retardo Normal"},
                    {"estatus" : "Retardo Menor"},
                    {"estatus" : "Retardo Mayor"}
                ],
                "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
            }));
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountMeal_times",Meal_times.find({
                    $or: [
                        {"estatus" : "Retardo Normal"},
                        {"estatus" : "Retardo Menor"},
                        {"estatus" : "Retardo Mayor"}
                      ],
                    "idcompany":{$in:_idCompany},
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        }
      });

      Meteor.publish("CountReportsRetardosMayores",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountReportsRetardosMayores",Reports.find({
                "estatus" : "Retardo Mayor",
                "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
            }));
        }else if(
            Roles.userHasRole(userId, "Usuario Administrador") == true ||
            Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountReportsRetardosMayores",Reports.find({
                    "estatus" : "Retardo Mayor",
                    "idcompany":{$in:_idCompany},
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        }else if( Roles.userHasRole(userId, "Usuario")==true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
                var _idCompany = res.profile.idcompany;
                var _idEmployee = res.profile.idEmployee;
                Counts.publish(this,"CountReportsRetardosMayores",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "estatus" : "Retardo Mayor",
                    "_idEmployee":_idEmployee,
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        }
      });

      Meteor.publish("CountTotalReports",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountTotalReports",Reports.find({
                "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
            }));
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountTotalReports",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        }
      });

        Meteor.publish("CountTickets",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountTickets",Tickets.find({
                "createdAt":{$gte : fechaInicio,$lt : fechaFin },
            }));
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountTickets",Tickets.find({
                    "idcompany":{$in:_idCompany},
                    "createdAt":{$gte : fechaInicio,$lt : fechaFin}
                }));
            }
        }
      });

      Meteor.publish("CountReportsRetardosMenores",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountReportsRetardosMenores",Reports.find({
                "estatus" : "Retardo Menor",
                "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
            }));
        }else if(
            Roles.userHasRole(userId, "Usuario Administrador") == true ||
            Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountReportsRetardosMenores",Reports.find({
                    "estatus" : "Retardo Menor",
                    "idcompany":{$in:_idCompany},
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        }else if( Roles.userHasRole(userId, "Usuario")==true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
                var _idCompany = res.profile.idcompany;
                var _idEmployee = res.profile.idEmployee;
                Counts.publish(this,"CountReportsRetardosMenores",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "estatus" : "Retardo Menor",
                    "_idEmployee":_idEmployee,
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        }
      });

      Meteor.publish("CountReportsRetardosNormales",function(userId,fechaInicio,fechaFin){
        if (Roles.userHasRole(userId, "admin") == true) {
            Counts.publish(this,"CountReportsRetardosNormales",Reports.find({
                "estatus" : "Retardo Normal",
                "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
            }));
        }else if(
            Roles.userHasRole(userId, "Usuario Administrador") == true ||
            Roles.userHasRole(userId, "Supervisor") == true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                Counts.publish(this,"CountReportsRetardosNormales",Reports.find({
                    "estatus" : "Retardo Normal",
                    "idcompany":{$in:_idCompany},
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        } else if( Roles.userHasRole(userId, "Usuario")==true){
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany && res.profile.idEmployee) {
                var _idCompany = res.profile.idcompany;
                var _idEmployee = res.profile.idEmployee;
                Counts.publish(this,"CountReportsRetardosNormales",Reports.find({
                    "idcompany":{$in:_idCompany},
                    "estatus" : "Retardo Normal",
                    "_idEmployee":_idEmployee,
                    "fechaIni":{$gte : fechaInicio,$lt : fechaFin }
                }));
            }
        }
      });


    Meteor.publish('getSimpleReports', function (userId,fechaInicio,fechaFin) {
        if (Roles.userHasRole(userId, "admin") == true) {
            return Reports.find({
                "fechaIni":{$gte : fechaInicio,$lt : fechaFin}
                },
                {
                    limit:5000,
                    sort:{fechaIni:1}
                });
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Reports.find({
                    "idcompany":{$in:_idCompany},
                    "fechaIni":{$gte : fechaInicio },
                    "fechaFin":{$lt : fechaFin }
                },{
                    limit:5000,
                    sort: {fechaIni: 1}
                });
            }
        }
    });

    Meteor.publish('getReportsbyEmployee', function (userId,fechaIni,FechaFin) {
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idEmployee) {
            var _idEmployee = res.profile.idEmployee;
            return Reports.find({
                "_idEmployee":_idEmployee,
                "fechaIni":{$gte:fechaIni,$lte:FechaFin}
            });
        }
    });

    Meteor.publish('getReportsDeptosGraph', function (userId,fechaInicio,fechaFin) {
      if( Roles.userHasRole(userId, "Usuario Administrador")==true ||
          Roles.userHasRole(userId, "Supervisor")==true){
            var res = Meteor.users.findOne({ "_id": userId});
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Reports.find({
                    $and:[
                        {"idcompany":{$in:_idCompany}},
                        {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}}
                    ]
                },{
                  fields:{
                    "idmanager" : 0,
                    "inicioOficial" : 0,
                    "primerRegistro" : 0,
                    "salidaOficial" : 0,
                    "tiempo" : 0,
                    "horas" :0,
                    "fecha":0,
                    "idEmployee":0,
                    "sancion" : 0,
                    "idDepartment_txt" : 0,
                     "idLocation_txt" : 0,
                     "idmanager_txt" : 0
                }});
            }
      }
    });

    Meteor.publish('getDeptosGraph', function (userId) {
      if( Roles.userHasRole(userId, "Usuario Administrador")==true ||
          Roles.userHasRole(userId, "Supervisor")==true){
            var res = Meteor.users.findOne({ "_id": Meteor.userId() });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Departments.find({
                    $and:[
                        {"idcompany":{$in:_idCompany}},
                        {"active":true}
                    ]
                },{fields:{"departmentName":1,"idcompany":1,"active":1}});
            }
          }
    });



    Meteor.publish('get_Access_temp', function () {
        return Access_temp.find();
    });

    Meteor.publish('getSimpleTickets', function (userId,fechaInicio,fechaFin) {
        if (Roles.userHasRole(userId, "admin") == true) {
            return Tickets.find({
                "createdAt":{$gte : fechaInicio,$lt : fechaFin },
                },
                {
                    limit:5000,
                    sort:{createdAt:1}
                });
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Tickets.find({
                    "idcompany":{$in:_idCompany},
                    "createdAt":{$gte : fechaInicio },
                    "createdAt":{$lt : fechaFin }
                },{
                    limit:5000,
                    sort: {createdAt: 1}
                });
            }
        }
    });



    Meteor.publish('getPermisos', function (userId,fechaInicio,fechaFin) {
        if (Roles.userHasRole(userId, "admin") == true) {
            return Permisos.find({"createdAt":{$gte : fechaInicio },"createdAt":{$lt : fechaFin }},{limit:5000,sort:{createdAt:1}});
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Permisos.find({
                    "idcompany":{$in:_idCompany},
                    "createdAt":{$gte : fechaInicio },
                    "createdAt":{$lt : fechaFin }
                },{
                    limit:1000,
                    sort: {createdAt: 1}
                });
            }
        }
    });

    Meteor.publish('get_Persons', function (userId) {
        if (Roles.userHasRole(userId, "admin") == true) {
            return Persons.find();
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Persons.find({
                    "idcompany":{$in:_idCompany}
                },{
                    sort: {idEmployee: 1}
                });
            }
        }
    });

    // Meteor.publish('departments', function (userId) {
    //     if (Roles.userHasRole(userId, "admin") == true) {
    //         return Departments.find({},{sort:{departmentName:1}});
    //     }else{
    //         var res = Meteor.users.findOne({ "_id": userId });
    //         if (res && res.profile && res.profile.idcompany) {
    //             var _idCompany = res.profile.idcompany;
    //             return Departments.find({
    //                 "idcompany":{$in:_idCompany}
    //             },{
    //                 sort: {departmentName: 1}
    //             });
    //         }
    //     }
    // });

    Meteor.publish('GetEnrollDepartments', function (userId) {
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Departments.find({
          $and:[
            {"idcompany": {$in: _idCompany}},
            {"active":true}
          ]
        },{sort:{departmentName: 1}});
      }
    });

    Meteor.publish('get_Jefes', function (userId) {
        if (Roles.userHasRole(userId, "admin") == true) {
            var aa=Jefes.find();
            return aa;
        } else {
            if (Roles.userHasRole(userId, "Usuario Administrador") == true ||
                Roles.userHasRole(userId, "Supervisor") == true) {
                var res = Meteor.users.findOne({ "_id": userId });
                if (res && res.profile && res.profile.idcompany) {
                    var _idCompany = [];
                    _idCompany = res.profile.idcompany;
                    return Jefes.find({
                        $and: [{ "idcompany": { $in: _idCompany } }, { "active": true } ] },
                        { sort: { employeeName: 1 } });
                }
            }
        }
    });

    Meteor.publish('get_Enrolamientos', function (userId) {
        if (Roles.userHasRole(userId, "admin") == true) {
            return Enrollments.find({},{limit:100,sort:{IDENROLSEQUENCE:1}});
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Enrollments.find({
                    "idcompany":{$in:_idCompany}
                },{
                    sort: {IDENROLSEQUENCE: 1}
                });
            }
        }
    });

    Meteor.publish('getRestaurants', function (userId) {
        if (Roles.userHasRole(userId, "admin") == true) {
            return Restaurants.find({},{limit:100});
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Restaurants.find({
                    "idcompany":_idCompany
                },{
                    limit:100,
                    sort: {restaurantName: 1}
                });
            }
        }
    });


    Meteor.publish('GetEnrollLocations', function () {
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Locations.find({
          $and:[
            {"idcompany": {$in: _idCompany}},
            {"active":true}
          ]
        },{sort:{locationName: 1}});
      }
    });


    Meteor.publish('getLocations', function (userId) {
        if (Roles.userHasRole(userId, "admin") == true) {
            return Locations.find({},{limit:100});
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Locations.find({
                    "idcompany":{$in:_idCompany}
                },{
                    limit:100,
                    sort: {locationName: 1}
                });
            }
        }
    });

    Meteor.publish('getExtra_time', function (userId,fechaInicio,fechaFin) {
        if (Roles.userHasRole(userId, "admin") == true) {
            return Extra_time.find({"createdAt":{$gte : fechaInicio },"createdAt":{$lt : fechaFin }});
        }else{
            var res = Meteor.users.findOne({ "_id": userId });
            if (res && res.profile && res.profile.idcompany) {
                var _idCompany = res.profile.idcompany;
                return Extra_time.find({
                    "idcompany":{$in:_idCompany},
                    "createdAt":{$gte : fechaInicio },
                    "createdAt":{$lt : fechaFin }
                },{
                    sort: {createdAt: 1}
                });
            }
        }
    });


    Meteor.publish('get_Enrollments_temp', function () {
        return Enrollments_temp.find();
    });
    Meteor.publish('get_Config_station', function () {
        return Config_station.find({}, {limit: 2 });
    });
    Meteor.publish('get_Config_application', function () {
        return Config_application.find();
    });
    Meteor.publish('get_Create_enroll', function () {
        return Create_enroll.find({}, {limit: 100 });
    });
    Meteor.publish('get_Documents_temp', function () {
        return Documents_temp.find({}, {limit: 100 });
    });
    Meteor.publish('get_VerificationFace_temp', function () {
        return VerificationFace_temp.find({}, {limit: 100 });
    });
    Meteor.publish('get_EmployeeDocument', function () {
        return EmployeeDocument.find({}, {limit: 100 });
    });

    Meteor.publish('get_Accesos', function () {
        return Accesos.find({}, {limit: 100 });
    });

    Meteor.publish('get_Design_app', function () {
        return Design_app.find({"user": Meteor.userId()});
    });
    Meteor.publish('get_Estaciones', function () {
        return Estaciones.find({}, {limit: 100 });
    });

    Meteor.publish('get_Devicesconnected', function () {
        return Devicesconnected.find({}, {limit: 100 });
    });

    Meteor.publish('get_Prints', function () {
        return Prints.find({}, {limit: 100 });
    });
    Meteor.publish('get_Sanciones', function () {
        return Sanciones.find({}, {limit: 100 });
    });

    Meteor.publish('JustMyProfile', function (userId) {
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idEmployee) {
        var _idEmployee = res.profile.idEmployee;
        return Persons.find({ "_id":_idEmployee });
      }
    });

    Meteor.publish('OnePerson', function (_id) {
      if(_id){
        return Persons.find({ "_id":_id },{fields:{employeeName:1}});
      }
    });

    Meteor.publish('companies', function () {
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Companies.find({ "_id": {$in: _idCompany}});
      }
    });

    Meteor.publish('getNotificaciones', function () {
        var _userId=Meteor.userId();
        if (Roles.userHasRole(_userId, "Usuario Administrador") == true ||
            Roles.userHasRole(_userId, "Supervisor") == true) {
            var res = Meteor.users.findOne({ "_id":_userId });
            if (res && res.profile && res.profile.idcompany) {
              var _idCompany=[];
              var arrayUsuario=["Usuario Administrador"];
              var _idCompany = res.profile.idcompany;
              return Notificaciones.find({
                $and:[
                  {"not_company": {$in: _idCompany}},
                  {"not_rol_destino":{$in:arrayUsuario}}
                ]
              },{sort:{date:-1}});
            };
        }else if(  Roles.userHasRole(_userId, "Usuario") == true){
          var res = Meteor.users.findOne({ "_id": _userId });
          if (res && res.profile.idEmployee) {
              var _idEmp = res.profile.idEmployee;
              var arrayUsuario=["Usuario"];
              return Notificaciones.find({
                $and:[
                  {"not_userId": _idEmp},
                  {"not_rol_destino":{$in:arrayUsuario}}
                ]
              },{sort:{date:-1}});
          }
        }
    });

    Meteor.publish('get_documents', function () {
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Documents.find({$and:[ {"idcompany": {$in: _idCompany}}, {"active":true} ]});
      }
    });

    // Meteor.publish('employeespositions', function () {
    //   var res = Meteor.users.findOne({ "_id": Meteor.userId() });
    //   if (res && res.profile && res.profile.idcompany) {
    //     var _idCompany=[];
    //     _idCompany = res.profile.idcompany;
    //
    //     return Employeespositions.find({
    //       $and:[
    //         {"idcompany": {$in: _idCompany}},
    //         {"active":true}
    //       ]
    //      },
    //      { fields: { empPosName:1 },sort:{empPosName:1}});
    //   }
    // });


    Meteor.publish('getemployeespositions', function () {
        var userId=Meteor.userId();
        if (Roles.userHasRole(userId, "admin") == true) {
            return Employeespositions.find();
        }else{
            if (Roles.userHasRole(userId, "Usuario Administrador") == true ||
                Roles.userHasRole(userId, "Supervisor") == true){
                    var res = Meteor.users.findOne({ "_id": userId });
                    if (res && res.profile && res.profile.idcompany) {
                        var _idCompany = res.profile.idcompany;
                        var data=Employeespositions.find({idcompany:{$in:_idCompany},active:true});
                        return data;
                    }
            }else if (Roles.userHasRole(userId, "Usuario")){
                var res = Meteor.users.findOne({ "_id": userId });
                if (res && res.profile && res.profile.idcompany) {
                    return Employeespositions.find({idcompany:_idCompany,active:true},{sort:{empPosName:1}});
                }
            }
        }
    });

    Meteor.publish('get_CargaMasiva',function(userId){
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            return CargaMasiva.find({ "Company":{$in:_idCompany}, });
        }
    });

    Meteor.publish('getPagadoras', function () {
        var userId=Meteor.userId();
        if (Roles.userHasRole(userId, "admin") == true) {
            return Pagadoras.find();
        }else{
            if (Roles.userHasRole(userId, "Usuario Administrador") == true ||
                Roles.userHasRole(userId, "Supervisor") == true){
                    var res = Meteor.users.findOne({ "_id": userId });
                    if (res && res.profile && res.profile.idcompany) {
                        var _idCompany = res.profile.idcompany;
                        var data=Pagadoras.find({idcompany:{$in:_idCompany},active:true});
                        return data;
                    }
            }
        }
    });

    Meteor.publish('getDirecciones', function () {
        var userId=Meteor.userId();
        if (Roles.userHasRole(userId, "admin") == true) {
            return Direcciones.find();
        }else{
            if (Roles.userHasRole(userId, "Usuario Administrador") == true ||
                Roles.userHasRole(userId, "Supervisor") == true){
                    var res = Meteor.users.findOne({ "_id": userId });
                    if (res && res.profile && res.profile.idcompany) {
                        var _idCompany = res.profile.idcompany;
                        var data=Direcciones.find({idcompany:{$in:_idCompany},active:true});
                        return data;
                    }
            }
        }
    });

    Meteor.publish('getProyectos', function () {
        var userId=Meteor.userId();
        if (Roles.userHasRole(userId, "admin") == true) {
            return Proyectos.find();
        }else{
            if (Roles.userHasRole(userId, "Usuario Administrador") == true ||
                Roles.userHasRole(userId, "Supervisor") == true){
                    var res = Meteor.users.findOne({ "_id": userId });
                    if (res && res.profile && res.profile.idcompany) {
                        var _idCompany = res.profile.idcompany;
                        var data=Proyectos.find({idcompany:{$in:_idCompany},active:true});
                        return data;
                    }else{
                    }
            }else{
            }
        }
    });

    Meteor.publish('getAreas', function () {
        var userId=Meteor.userId();
        if (Roles.userHasRole(userId, "admin") == true) {
            return Areas.find();
        }else{
            if (Roles.userHasRole(userId, "Usuario Administrador") == true ||
                Roles.userHasRole(userId, "Supervisor") == true){
                    var res = Meteor.users.findOne({ "_id": userId });
                    if (res && res.profile && res.profile.idcompany) {
                        var _idCompany = res.profile.idcompany;
                        var data=Areas.find({idcompany:{$in:_idCompany},active:true});
                        return data;
                    }
            }
        }
    });

    Meteor.publish('getActiveemployeespositions', function () {
        var userId=Meteor.userId();
        if (Roles.userHasRole(userId, "admin") == true) {
            return Employeespositions.find({idcompany:{$in:_idCompany}});
        }else{
            if (Roles.userHasRole(userId, "Usuario Administrador") == true ||
                Roles.userHasRole(userId, "Supervisor") == true){
                    var res = Meteor.users.findOne({ "_id": userId });
                    if (res && res.profile && res.profile.idcompany) {
                        var _idCompany = res.profile.idcompany;
                        var data=Employeespositions.find({idcompany:{$in:_idCompany},active:true});
                        return data;
                    }
            }else if (Roles.userHasRole(userId, "Usuario")){
                var res = Meteor.users.findOne({ "_id": userId });
                if (res && res.profile && res.profile.idcompany) {
                    return Employeespositions.find({idcompany:_idCompany,active:true},{sort:{empPosName:1}});
                }
            }
        }
    });

    Meteor.publish('employeespositions', function () {
        var userId=Meteor.userId();
        if (Roles.userHasRole(userId, "admin") == true) {
            return Employeespositions.find();
        }else{
            if (Roles.userHasRole(userId, "Usuario Administrador") == true ||
                Roles.userHasRole(userId, "Supervisor") == true){
                    var res = Meteor.users.findOne({ "_id": userId });
                    if (res && res.profile && res.profile.idcompany) {
                        var _idCompany = res.profile.idcompany;
                        var data=Employeespositions.find({idcompany:_idCompany},{sort:{empPosName:1}});
                        return data;
                    }
            }else if (Roles.userHasRole(userId, "Usuario")){
                console.log("user admin");
                var res = Meteor.users.findOne({ "_id": userId });
                if (res && res.profile && res.profile.idcompany) {
                    return Employeespositions.find({idcompany:_idCompany,active:true},{sort:{empPosName:1}});
                }
            }
        }
    });


    Meteor.publish('employeestatuses', function () {
        return Employeestatuses.find({}, {sort:{empStatusName:1},limit: 100 });
    });
    Meteor.publish('get_devices', function () {
        return Devices.find({}, {limit: 100 });
    });
    Meteor.publish('get_cameras', function () {
        return Cameras.find({}, {limit: 100 });
    });
    Meteor.publish('get_microphone', function () {
        return Microphone.find({}, {limit: 100 });
    });
    Meteor.publish('get_iris', function () {
        return Iris.find({}, {limit: 100 });
    });
    Meteor.publish('employees', function () {
        return Employees.find({}, {limit: 100 });
    });


    Meteor.publish('getMeal', function () {
        return Meals.find({}, {limit: 100 });
    });

    Meteor.publish('get_Reglas_retardos', function () {
        return Reglas_retardos.find({}, {limit: 100 });
    });
    Meteor.publish('get_Reglas_alimentos', function () {
        return Reglas_alimentos.find({}, {limit: 100 });
    });


    // Meteor.publish('getDays', function () {
    //     return Days.find();
    // });

    Meteor.publish('getDays', function (userId) {
        var res = Meteor.users.findOne({ "_id": userId });
        if (res && res.profile && res.profile.idcompany) {
            var _idCompany = res.profile.idcompany;
            return Days.find({
                "idcompany":{$in:_idCompany},
            },{fields:{idEmployee:1}});
        }
    });


    Meteor.publish('getVacations', function () {
        return Vacations.find();
    });
    Meteor.publish('getFeriados', function () {
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Feriados.find({ "idcompany": {$in: _idCompany}});
      }
    });

    Meteor.publish('getIncidencias', function () {
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Incidencias.find({ "idcompany": {$in: _idCompany}});
      }
    });

    Meteor.publish('get_Print_ticket', function () {
        return Print_ticket.find({}, {limit: 100 });
    });
    Meteor.publish('get_Reports_emp', function () {
        return Reports_emp.find({}, {limit: 100 });
    });
    Meteor.publish('get_Porcentajes', function () {
        return Porcentajes.find({}, {limit: 100 });
    });
    Meteor.publish('get_RemoveFingers', function () {
        return RemoveFingers.find({}, {limit: 100 });
    });
    Meteor.publish('get_Grafica_deptos', function () {
        return Grafica_deptos.find({}, {limit: 100 });
    });
    Meteor.publish('get_Mis_registros', function () {
        return Mis_registros.find({}, {limit: 100 });
    });

    Meteor.publish('get_Justificantes', function () {
      var res = Meteor.users.findOne({ "_id": Meteor.userId() });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany=[];
        _idCompany = res.profile.idcompany;
        return Justificantes.find({ "idcompany": {$in: _idCompany}},{sort:{createdAt:-1}});
      }
    });

    Meteor.publish('get_Grafica_extra_time', function () {
        return Grafica_extra_time.find({}, {limit: 100 });
    });

    Meteor.publish('serviceregistry', function () {
        return ServiceRegitry.find({}, {limit: 100 });
    });

    // Meteor.publish('getAccesscontrol', function (userId,fechaInicio,fechaFin) {
    //     if (Roles.userHasRole(userId, "admin") == true) {
    //         return Accesscontrol.find({"createdAt":{$gte : fechaInicio,$lt : fechaFin }},{limit:10000,sort:{createdAt:1}});
    //     }else{
    //         var res = Meteor.users.findOne({ "_id": userId });
    //         if (res && res.profile && res.profile.idcompany) {
    //             var _idCompany = res.profile.idcompany;
    //             return Accesscontrol.find({
    //                 "idCompany":{$in:_idCompany},
    //                 "createdAt":{$gte : fechaInicio,$lt : fechaFin }
    //             },{
    //                 limit:5000,
    //                 sort: {createdAt: 1}
    //             });
    //         }
    //     }
    // });
    //
    // Meteor.publish('getAccessdetails', function (userId,fechaInicio,fechaFin) {
    //     if (Roles.userHasRole(userId, "admin") == true) {
    //         return Accessdetails.find({"createdAt":{$gte : fechaInicio,$lt : fechaFin }},{limit:10000,sort:{createdAt:1}});
    //     }else{
    //         var res = Meteor.users.findOne({ "_id": userId });
    //         if (res && res.profile && res.profile.idcompany) {
    //             var _idCompany = res.profile.idcompany;
    //             return Accessdetails.find({
    //                 "idcompany":{$in:_idCompany},
    //                 "createdAt":{$gte : fechaInicio },
    //                 "createdAt":{$lt : fechaFin }
    //             },{
    //                 limit:5000,
    //                 sort: {createdAt: 1}
    //             });
    //         }
    //     }
    // });
};
