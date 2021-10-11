const Counts = new Mongo.Collection("counts");
Meteor.publish('getReportsRetardosNormal', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     var deptosdata=Departments.find({"idcompany":{$in:_idCompany},"active" : true},{fields:{"_id":1}}).fetch();
     var deptos=_.pluck(deptosdata,'_id');

     let count = 0;
     let initializing = true;
     var busqueda=[
        {"estatus" : "Retardo Normal"},
         {"idDepartment":{$in:deptos}},
        {"idcompany":{$in:_idCompany}},
        {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}}
     ];
     if( Roles.userHasRole(userId, "Usuario Administrador")==true ||
         Roles.userHasRole(userId, "Supervisor")==true){
     }else if( Roles.userHasRole(userId, "Usuario")==true){
       var _idEmployee = res.profile.idEmployee;
       var obj={"_idEmployee":_idEmployee};
       busqueda.push(obj);
     }
     const handle=Reports.find({
       $and:busqueda
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsRetardosNormal"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsRetardosNormal"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsRetardosNormal"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});

Meteor.publish('getReportsRetardosMenor', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     var deptosdata=Departments.find({"idcompany":{$in:_idCompany},"active" : true},{fields:{"_id":1}}).fetch();
     var deptos=_.pluck(deptosdata,'_id');

     let count = 0;
     let initializing = true;
     var busqueda=[
       {"estatus" : "Retardo Menor"},
       {"idDepartment":{$in:deptos}},
       {"idcompany":{$in:_idCompany}},
       {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}}
     ];
     if( Roles.userHasRole(userId, "Usuario Administrador")==true ||
         Roles.userHasRole(userId, "Supervisor")==true){
     }else if( Roles.userHasRole(userId, "Usuario")==true){
       var _idEmployee = res.profile.idEmployee;
       var obj={"_idEmployee":_idEmployee};
       busqueda.push(obj);
     }
     const handle=Reports.find({
       $and:busqueda
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsRetardosMenor"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsRetardosMenor"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsRetardosMenor"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});

Meteor.publish('getReportsRetardosMayor', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     var deptosdata=Departments.find({"idcompany":{$in:_idCompany},"active" : true},{fields:{"_id":1}}).fetch();
     var deptos=_.pluck(deptosdata,'_id');
     let count = 0;
     let initializing = true;
     var busqueda=[
       {"estatus" : "Retardo Mayor"},
       {"idDepartment":{$in:deptos}},
       {"idcompany":{$in:_idCompany}},
       {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}}
     ];
     if( Roles.userHasRole(userId, "Usuario Administrador")==true ||
         Roles.userHasRole(userId, "Supervisor")==true){
     }else if( Roles.userHasRole(userId, "Usuario")==true){
       var _idEmployee = res.profile.idEmployee;
       var obj={"_idEmployee":_idEmployee};
       busqueda.push(obj);
     }
     const handle=Reports.find({
       $and:busqueda
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsRetardosMayor"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsRetardosMayor"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsRetardosMayor"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});

Meteor.publish('getReportsAll', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     let count = 0;
     let initializing = true;
     const handle=Reports.find({
       $and:[ {"idcompany":{$in:_idCompany}}, {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}} ]
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsAll"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsAll"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsAll"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});

Meteor.publish('getReportsFaltas', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     var deptosdata=Departments.find({"idcompany":{$in:_idCompany},"active" : true},{fields:{"_id":1}}).fetch();
     var deptos=_.pluck(deptosdata,'_id');
     let count = 0;
     let initializing = true;
     var busqueda=[
       {"estatus":"Falta"},
       {"idDepartment":{$in:deptos}},
       {"idcompany":{$in:_idCompany}},
       {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}}
     ];

     if( Roles.userHasRole(userId, "Usuario Administrador")==true ||
         Roles.userHasRole(userId, "Supervisor")==true){
     }else if( Roles.userHasRole(userId, "Usuario")==true){
       var _idEmployee = res.profile.idEmployee;
       var obj={"_idEmployee":_idEmployee};
       busqueda.push(obj);
     }

     const handle=Reports.find({
       $and:busqueda
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsFaltas"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsFaltas"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsFaltas"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});

Meteor.publish('getReportsExcepciones', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     var deptosdata=Departments.find({"idcompany":{$in:_idCompany},"active" : true},{fields:{"_id":1}}).fetch();
     var deptos=_.pluck(deptosdata,'_id');

     let count = 0;
     let initializing = true;

     var busqueda=[
       {"excepcion":"Si"},
       {"idDepartment":{$in:deptos}},
       {"idcompany":{$in:_idCompany}},
       {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}}
     ];
     if( Roles.userHasRole(userId, "Usuario Administrador")==true ||
         Roles.userHasRole(userId, "Supervisor")==true){
     }else if( Roles.userHasRole(userId, "Usuario")==true){
       var _idEmployee = res.profile.idEmployee;
       var obj={"_idEmployee":_idEmployee};
       busqueda.push(obj);
     }

     const handle=Reports.find({
         $and:busqueda
       },{fields:{"_id":1}}).observeChanges({
         added:(id)=>{
           count++;
           if (!initializing)
           self.changed("counts", "ReportsExcepciones"+userId, {count});
         },
         removed: (id) => {
           count --;
           self.changed('counts', "ReportsExcepciones"+userId, { count });
        }
       });
    initializing = false;
    this.added('counts', "ReportsExcepciones"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});

Meteor.publish('getReportsAnticipadas', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   // var userId=Meteor.userId();
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     var deptosdata=Departments.find({"idcompany":{$in:_idCompany},"active" : true},{fields:{"_id":1}}).fetch();
     var deptos=_.pluck(deptosdata,'_id');

     let count = 0;
     let initializing = true;
     var busqueda=[
       {"antes":"true"},
       {"idDepartment":{$in:deptos}},
       {"idcompany":{$in:_idCompany}},
       {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}}
     ];
     if( Roles.userHasRole(userId, "Usuario Administrador")==true ||
         Roles.userHasRole(userId, "Supervisor")==true){
     }else if( Roles.userHasRole(userId, "Usuario")==true){
       var _idEmployee = res.profile.idEmployee;
       var obj={"_idEmployee":_idEmployee};
       busqueda.push(obj);
     }

     const handle=Reports.find({
         $and:busqueda
       },{fields:{"_id":1}}).observeChanges({
         added:(id)=>{
           count++;
           if (!initializing)
           self.changed("counts", "ReportsAnticipadas"+userId, {count});
         },
         removed: (id) => {
           count --;
           self.changed('counts', "ReportsAnticipadas"+userId, { count });
        }
       });
    initializing = false;
    this.added('counts', "ReportsAnticipadas"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});
Meteor.publish('getReportsTickets', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   // var userId=Meteor.userId();
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     let count = 0;
     let initializing = true;
     const handle=Tickets.find({
       $and:[{"idcompany":{$in:_idCompany}}, {"createdAt":{$gte : fechaInicio ,$lt : fechaFin}} ]
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsTickets"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsTickets"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsTickets"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});

Meteor.publish('getReportsMeal_times', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   // var userId=Meteor.userId();
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     let count = 0;
     let initializing = true;
     const handle=Meal_times.find({
       $or: [
           {"estatus" : "Retardo Normal"},
           {"estatus" : "Retardo Menor"},
           {"estatus" : "Retardo Mayor"}
       ],
       $and:[
         {"idcompany":{$in:_idCompany}},
         {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}}
       ]
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsMeal_times"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsMeal_times"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsMeal_times"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});

Meteor.publish('getReportsPermisos', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   // var userId=Meteor.userId();
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     let count = 0;
     let initializing = true;
     const handle=Permisos.find({
       $and:[
         {"idcompany":{$in:_idCompany}},
         {"createdAt":{$gte : fechaInicio ,$lt : fechaFin}}
       ]
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsPermisos"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsPermisos"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsPermisos"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});


Meteor.publish('getReportsVacations', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   // var userId=Meteor.userId();
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     let count = 0;
     let initializing = true;
     const handle=Vacations.find({
       $and:[
         {"idcompany":{$in:_idCompany}},
         {"fechaIni":{$gte : fechaInicio ,$lt : fechaFin}}
       ]
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsVacations"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsVacations"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsVacations"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});

Meteor.publish('getReportsJustificantes', function (userId,fechaInicio,fechaFin) {
   this.unblock();
   var self=this;
   // var userId=Meteor.userId();
   var res = Meteor.users.findOne({ "_id":userId});
   if (res && res.profile && res.profile.idcompany) {
     var _idCompany = res.profile.idcompany;
     let count = 0;
     let initializing = true;
     const handle=Justificantes.find({
       $and:[
         {"idcompany":{$in:_idCompany}},
         {"createdAt":{$gte : fechaInicio ,$lt : fechaFin}}
       ]
     },{fields:{"_id":1}}).observeChanges({
       added:(id)=>{
         count++;
         if (!initializing)
         self.changed("counts", "ReportsJustificantes"+userId, {count});
       },
       removed: (id) => {
         count --;
         self.changed('counts', "ReportsJustificantes"+userId, { count });
      }
     });
    initializing = false;
    this.added('counts', "ReportsJustificantes"+userId, { count });
     self.ready();
     self.onStop(() => handle.stop());
   }
});
