if (Meteor.isServer) {
    Meteor.methods({
        idEmployeeExists:function(_id){
            var result="vacio";
            if(_id!=undefined){
                if (Persons.findOne({idEmployee:_id},{fields:{"idEmployee":1}})!=undefined) {
                    result="existe";
    		    }else{
                    result="noexiste";
                }
            }
            return result;
        },
        idEmpPositionExists:function(_id){
            var result="vacio";
            if(_id!=undefined){
                if (Employeespositions.findOne({empPosName:_id},{fields:{"empPosName":1}})!=undefined) {
                    result="existe";
    		    }else{
                    result="noexiste";
                }
            }
            return result;
        },
        idmanagerExists:function(_id){
            var result="vacio";
            if(_id!=undefined){
                if (Persons.findOne({employeeName:_id},{fields:{"employeeName":1}})!=undefined) {
                    result="existe";
    		    }else{
                    result="noexiste";
                }
            }
            return result;
        }
    });
}