if(Meteor.isClient){

  Template.orionMaterializeCollectionsReports_Emp.onCreated(function(){
    Meteor.subscribe('get_Config_application', {
      onError: function (error) {console.log("error "+error);},
      onReady: function () {
        ActivateKeyBoard();
      }
    });
  });

  Template.orionMaterializeCollectionsReports_Emp.rendered = function() {
    Session.set("SearchingReports_Emp",undefined);
    setTimeout(() => {
      ActivateKeyBoard();
    }, 1000);
  };

  Template.orionMaterializeCollectionsReports_Emp.helpers({
    GetColorIconBack:function(){
      return GetColorIconBack();
    },
    ColorTabularIndex:function(){
      return ColorTabularIndex();
    },
    getEmps: function() {
      var cols =[
        { data:"Info", title:"Registros",tmpl: Meteor.isClient && Template.empleado_template},
        { data: "idEmployee", title: "Id Colaborador" },
        { data: "employeeName", title: "Nombre" },
        { data: "idEmpPosition_txt", title: "Puesto", },
        // { data: "idEmpPosition",title: "Puesto", render: function(val) { var empPosName = Employeespositions.findOne({ _id: val }); if (empPosName !== undefined) { return empPosName.empPosName; } else { return "SIN ASIGNAR"; } } },
        { data: "idcompany", title: "Compañia", render: function(val){
          var result=[];
          for(var i=0;i<val.length;i++){
            var _idcompany=val[i];
            var companyName = Companies.findOne({_id:_idcompany});
            if (companyName !== undefined) {
              result.push(companyName.companyName);
            }
          }
          return result;
        }},
        { data: "idDepartment_txt", title: "Departamento", },
        // { data: "idDepartment", title: "Departamento", render: function(val){ var departmentName = Departments.findOne({_id:val}); if (departmentName !== undefined) { return departmentName.departmentName; }else { return "SIN ASIGNAR"; } } },
        { data: "idLocation", title: "Localidad", render: function(val){ var locationName = Locations.findOne({_id:val}); if (locationName !== undefined) { return locationName.locationName; }else { return "SIN ASIGNAR"; } } },
        { data: "empEmail", title: "Email", },
        { data: "idmanager", title: "Jefe", render: function(val){ var employeeName = Persons.findOne({_id:val}); if (employeeName !== undefined) { return employeeName.employeeName; }else { return "SIN ASIGNAR"; } } }
      ];
      // Persons.tabularTable.pub=TabularReportsByPerson;
      Persons.tabularTable.options.columns = cols;
      return Persons.tabularTable;
    },
    myemp:function(){
      var SearchingReports=Session.get("SearchingReports_Emp");
      if (SearchingReports!=undefined && SearchingReports!="") {
        var numero = parseInt(SearchingReports);
        if (isNaN(numero)) {
          busqueda={
            $and:[
              {"employeeName":{ $regex: SearchingReports, $options: '-i' }},
              {"idEmpStatus":"7NAGoQFpPiaCz7hW6"}
            ]
          };
          return busqueda;
        }else{
          busqueda={
            $and:[
              {"idEmployee":{$eq: numero}},
              {"idEmpStatus":"7NAGoQFpPiaCz7hW6"}
            ]
          };
          return busqueda;
        }
      }else{
        var busqueda={
          $and:[
            {
              idEmpStatus:"7NAGoQFpPiaCz7hW6"
            }
          ]
        };
        return busqueda;
      }      
    }
  });

  Template.empleado_template.events({
     'click #asistencias' : function(evt){
       var id = this._id;
       Session.set('SearchEmployee',id);
       Router.go('/admin/outreports');
     }
   });

   Template.subsempleado_template.events({
    'click #asistencias' : function(evt){
      var id = this._id;
      Session.set('SearchEmployee',id);
      Router.go('/admin/jefecargo');
    }
  });

   

   function ActivateKeyBoard(){
    var isStation=Config_application.findOne({"active":true});
    if(isStation!=undefined && isStation.isServer!=undefined && isStation.isServer==false&& isStation.showKeyboard==true){
        $("input[type='search']").keyboard({
          layout: 'qwerty',
          change:function(event,keyboard,el){},
          beforeClose: function(ev, keyboard, el){},
          accepted : function(event, keyboard, el) {
            var contenido=el.value;
            Session.set("SearchingReports_Emp", contenido);
            setTimeout(function () {
              $("input[type='search']").val(contenido);
            }, 10);
          }
        });
    }
  }

}
