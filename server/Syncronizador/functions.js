GetemployeeName= function(_id) {
    var data=Persons.findOne({"_id":_id},{fields:{"_id":1,"employeeName":1}});
    var result="";
    if(data!=undefined){
      result=data.employeeName;
    }
    return result;
  }

  GetidEmployee= function(_id) {
    var data=Persons.findOne({"_id":_id},{fields:{"_id":1,"idEmployee":1}});
    var result=0;
    if(data!=undefined){
      result=data.idEmployee;
    }
    return result;
  }

  GetComida= function(meal) {
    var result="";
    if(meal){
      result="yes";
    }
    return result;
  }

  Getidcompany= function(_id) {
    var data=Persons.findOne({"_id":_id},{fields:{"_id":1,"idcompany":1}});
    var result=[];
    if(data!=undefined){
      result=data.idcompany;
    }
    return result;
  }

  GetidDepartment= function(_id) {
    var data=Persons.findOne({"_id":_id},{fields:{"_id":1,"idDepartment":1}});
    var result="";
    if(data!=undefined){
      result=data.idDepartment;
    }
    return result;
  }

  GetidLocation=function(_id){
    var data=Persons.findOne({"_id":_id},{fields:{"_id":1,"idLocation":1}});
    var result="";
    if(data!=undefined){
      result=data.idLocation;
    }
    return result;
  }

  Getidmanager=function(_id){
    var data=Persons.findOne({"_id":_id},{fields:{"_id":1,"idmanager":1}});
    var result="";
    if(data!=undefined){
      result=data.idmanager;
    }
    return result;
  }
