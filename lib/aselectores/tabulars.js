if(Meteor.isServer){
Meteor.publishComposite("TabularCompanies", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
      this.unblock();
      return Companies.find({_id: {$in: ids}}, {fields: fields,sort:{companyName:-1}});
    },
    children: [
      {
        find: function(data) {
          this.unblock();
          if(data!=undefined && data.idmanager!=undefined){
            return Persons.find({_id:data.idmanager},{fields:{employeeName:1}});
          }
        }
      }
    ]
  };
});

  Meteor.publishComposite("TabularPermisos", function (tableName, ids, fields) {
    this.unblock();
    return {
      find: function () {
        this.unblock();
        var res = Meteor.users.findOne({ "_id": Meteor.userId() });
        if (res && res.profile && res.profile.idcompany) {
          return Permisos.find({_id: {$in: ids}}, {fields: fields,sort:{fechaIni:-1}});
        }
      },
      children: [
        {
          find: function(data) {
            this.unblock();
            if(data!=undefined && data.idEmployee!=undefined){
              return Persons.find({_id:data.idEmployee});
            }
          }
        },
        {
          find: function(data) {
            this.unblock();
            if(data!=undefined && data.razon!=undefined){
              return Incidencias.find({_id:data.razon},{fields:{razon:1}});
            }
          }
        }
      ]
    };
  });

  Meteor.publishComposite("TabularVacations", function (tableName, ids, fields) {
    this.unblock();
    return {
      find: function () {
        this.unblock();
        var res = Meteor.users.findOne({ "_id": Meteor.userId() });
        if (res && res.profile && res.profile.idcompany) {
          var _idCompany = res.profile.idcompany;
          return Vacations.find({_id: {$in: ids}}, {fields: fields,sort:{fechaIni:-1}});
        }
      },
      children: [
        {
          find: function(data) {
            this.unblock();
            if(data!=undefined && data.idEmployee!=undefined){
              var result=data.idEmployee;
              return Persons.find({_id:result},{fields:{idEmployee:1,employeeName:1}});
            }
          }
        }
      ]
    };
  });

  Meteor.publishComposite("TabularDevices", function (tableName, ids, fields) {
    this.unblock();
    return {
      find: function () {
        this.unblock();
        var res = Meteor.users.findOne({ "_id": Meteor.userId() });
        if (res && res.profile && res.profile.idcompany) {
          var _idCompany = res.profile.idcompany;
          return Devices.find({_id: {$in: ids}}, {fields: fields});
        }
      },
      children: [
        {
          find: function(data) {
            this.unblock();
            if(data!=undefined && data.idLocation!=undefined){
              return Locations.find({_id:data.idLocation}, {fields: {locationName: 1}});
            }
          }
        }
      ]
    };
  });

  Meteor.publishComposite("TabularAccesscontrol", function (tableName, ids, fields) {
    this.unblock();
    return {
      find: function () {
        this.unblock();
        var res = Meteor.users.findOne({ "_id": Meteor.userId() });
        if (res && res.profile && res.profile.idcompany) {
          var _idCompany = res.profile.idcompany;
          return Accesscontrol.find({_id: {$in: ids}}, {fields: fields,sort:{firstAccess:1}});
        }
      },
      children: [
        {
          find: function(data) {
            this.unblock();
            var result=[];
            if(data!=undefined && data.idCompany!=undefined){
              result=data.idCompany;
              return Companies.find({_id:{$in:result}}, {fields: {companyName: 1}});
            }
          }
        }
      ]
    };
  });

  Meteor.publishComposite("TabularHorarios", function (tableName, ids, fields) {
    this.unblock();
    return {
      find: function () {
        this.unblock();
        return Horarios.find({_id: {$in: ids}}, {fields: fields,sort:{clave:1}});
      },
      children: [
        {
          find: function(data) {
            this.unblock();
            var result=[];
            if(data!=undefined && data.retardos!=undefined){
              result=data.retardos;
              return Reglas_retardos.find({_id:result}, {fields: {clave: 1,etiqueta:1}});
            }
          }
        },
        {
          find: function(data) {
            this.unblock();
            var result=[];
            if(data!=undefined && data.comidas!=undefined){
              result=data.comidas;
              return Reglas_alimentos.find({_id:result}, {fields: {clave: 1,etiqueta:1}});
            }
          }
        }
      ]
    };
  });

  Meteor.publishComposite("TabularAccessdetails", function (tableName, ids, fields) {
    this.unblock();
    return {
      find: function () {
        this.unblock();
        var res = Meteor.users.findOne({ "_id": Meteor.userId() });
        if (res && res.profile && res.profile.idcompany) {
          var _idCompany = res.profile.idcompany;
          return Accessdetails.find({_id: {$in: ids}}, {fields: fields,sort:{createdAt:1}});
        }
      },
      children: [
        {
          find: function(data) {
            this.unblock();
            var result=[];
            if(data!=undefined && data.idCompany!=undefined){
              result=data.idcompany;
              return Companies.find({_id:{$in:result}}, {fields: {companyName: 1}});
            }
          }
        },
        {
          find: function(data) {
            this.unblock();
            if(data!=undefined && data.idLocation!=undefined){
              return Locations.find({_id:data.idLocation}, {fields: {locationName: 1}});
            }
          }
        }
      ]
    };
  });

Meteor.publishComposite("TabularMeal_times", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
      this.unblock();
      return Meal_times.find({_id: {$in: ids}}, {fields: fields,sort:{fechaIni:1}});
    }
  };
});




Meteor.publishComposite("TabularTickets", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
      this.unblock();
      return Tickets.find({_id: {$in: ids}}, {fields: fields,sort:{createdAt:1}});
    }
  };
});

Meteor.publishComposite("TabularDepartments", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
    this.unblock();
    return Departments.find({_id: {$in: ids}}, {fields: fields,sort:{departmentName:1}});
    },
    children: [
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idLocation!=undefined){
            result=data.idLocation;
            return Locations.find({_id:result},{fields:{locationName:1}});
          }
        }
      },
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idmanager!=undefined){
            result=data.idmanager;
            return Persons.find({_id:result},{fields:{employeeName:1}});
          }
        }
      },
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idcompany!=undefined){
            result=data.idcompany;
            return Companies.find({_id:result},{fields:{companyName:1}});
          }
        }
      }
    ]
  };
});

Meteor.publishComposite("TabularPersons", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
    this.unblock();
    return Persons.find({_id: {$in: ids}}, {fields: fields,sort:{employeeName:1}});
    },
    children: [
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idEmpPosition!=undefined){
            result=data.idEmpPosition;
            return Employeespositions.find({_id:result},{fields:{empPosName:1}});
          }
        }
      },
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idEmpStatus!=undefined){
            result=data.idEmpStatus;
            return Employeestatuses.find({_id:result},{fields:{empStatusName:1}});
          }
        }
      },
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idcompany!=undefined){
            result=data.idcompany;
            return Companies.find({_id:{$in:result}},{fields:{companyName:1}});
          }
        }
      },
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idDepartment!=undefined){
            result=data.idDepartment;
            return Departments.find({_id:result},{fields:{departmentName:1}});
          }
        }
      },
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idLocation!=undefined){
            result=data.idLocation;
            return Locations.find({_id:result},{fields:{locationName:1}});
          }
        }
      },
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idmanager!=undefined){
            result=data.idmanager;
            return Persons.find({_id:result},{fields:{employeeName:1}});
          }
        }
      }
    ]
  };
});

Meteor.publishComposite("TabularReportsOnePerson", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
      this.unblock();
      return Reports.find({_id: {$in: ids}}, {fields: fields,sort:{fechaIni:1},limit:2000});
    }
  };
});


Meteor.publishComposite("TabularReports", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
      this.unblock();
      return Reports.find({_id: {$in: ids}}, {fields: fields});
    },
    children: [
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idLocation!=undefined){
            result=data.idLocation;
            return Locations.find({_id:result},{fields:{locationName:1}});
          }
        }
      },
      {
        find: function(data) {
          this.unblock();
          if(data!=undefined && data.idEmployee!=undefined){
            return Persons.find({idEmployee:parseInt(data.idEmployee)});
          }
        },
        children:[
          {
            find:function(data) {
              this.unblock();
              var dataP=Persons.findOne({"idEmployee":data.idEmployee});
              if(dataP!=undefined){
                return Vacations.find({idEmployee:dataP._id});
              }
            }
          }
        ]
      }

        // find: function(data) {
        //   this.unblock();
        //   var result=[];
        //   if(data!=undefined && data.idLocation!=undefined){
        //     result=data.idLocation;
        //     return Locations.find({_id:result},{fields:{locationName:1}});
        //   }
        // },
        // find: function(data) {
        //   this.unblock();
        //   if(data!=undefined && data.idEmployee!=undefined){
        //     return Persons.find({idEmployee:parseInt(data.idEmployee)});
        //   }
        // },
        // children:[
        //   find(locations, persons) {
        //     console.log("persons "+JSON.stringify(persons));
        //   }
        // ]
      //}
    ]
  };
});

Meteor.publishComposite("TabularDays", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
    this.unblock();
    return Days.find({_id: {$in: ids}}, {fields: fields});
    },
    children: [
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idHorario!=undefined){
            result=data.idHorario;
            return Horarios.find({_id:result});
          }
        }
      }
    ]
  };
});

Meteor.publishComposite("TabularExtra_time", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
    this.unblock();
    return Extra_time.find({_id: {$in: ids}}, {fields: fields});
    },
    children: [
      {
        find: function(data) {
          this.unblock();
          var result=[];
          if(data!=undefined && data.idcompany!=undefined){
            result=data.idcompany;
            return Companies.find({_id:{$in:result}},{fields:{companyName:1}});
          }
        }
      },
      // {
      //   find: function(data) {
      //     this.unblock();
      //     var result=[];
      //     if(data!=undefined && data.idDepartment!=undefined){
      //       result=data.idDepartment;
      //       return Departments.find({_id:result},{fields:{departmentName:1}});
      //     }
      //   }
      // },
      // {
      //   find: function(data) {
      //     this.unblock();
      //     var result=[];
      //     if(data!=undefined && data.idDepartment!=undefined){
      //       result=data.idLocation;
      //       return Locations.find({_id:result},{fields:{locationName:1}});
      //     }
      //   }
      // }
    ]
  };
});


Meteor.publishComposite("TabularReportsByPerson", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
    this.unblock();
    return Persons.find({_id: {$in: ids}}, {fields: fields});
    }
  };
});

Meteor.publishComposite("TabularEnrollments", function (tableName, ids, fields) {
  this.unblock();
  return {
    find: function () {
    this.unblock();
    return Enrollments.find({_id: {$in: ids}}, {fields: fields,sort:{ENROLDATE:1}});
    },
    // children: [
    //   {
    //     find: function(data) {
    //       this.unblock();
    //       var result=[];
    //       if(data!=undefined && data.idLocation!=undefined){
    //         result=data.idLocation;
    //         return Locations.find({_id:result},{fields:{locationName:1}});
    //       }
    //     }
    //   }
    // ]
  };
});


}
