creaTitulosDeArchivos = function(tabla){
  var fecha = new Date();
  var date = moment(fecha).format('DD-MM-YYYY');
  return 'Reporte_'+tabla+'_'+date;
}
esOpcional = function(){
  return false;
};
excepcion = function (fecha1,fecha2){
  if (fecha1 !== undefined  && fecha1 !== "Sin Registro" && fecha1 !== null && fecha2 !== undefined && fecha2 !== null && fecha2 !== "Sin Registro" ) {
    return "No"
  } else {
    return "Si"
  }
};


disableFieldMeal = function(){
  if (Meteor.isClient) {
    if (Roles.userHasRole(Meteor.userId(),"Usuario Administrador")|| Roles.userHasRole(Meteor.userId(),"admin")) {
      if(this.meal == false || this.meal == null || this.meal == "" || this.meal == undefined ){
        return true, "<img src='/images/check.png' width='25px'>"
      }else {
        return "<img src='/images/denied.png' width='25lpx'>",false;
      }
    }else {
      return "<img src='/images/denied.png' width='25lpx'>",false;
    }
  }
};


verificaId = function(val){
  if(val !== undefined && val !== "" && val !== null){
    return true;
  }else{
    return false;
  }
};
