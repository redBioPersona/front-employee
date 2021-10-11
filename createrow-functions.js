createdRowNotificaciones = function(row, data, dataIndex) {
  //console.log("hola mundo data:" + JSON.stringify(data));
  if (data.not_url) {
    //  console.log("ver?:"+data.not_url);
    $('td', row).eq(4).html('<a class="btn" href="' + data.not_url + '">Ver</a>');
  }
  if (data.not_status == 'Enviado' || data.not_status == 'No Leído') {
    if (Meteor.isClient) {
      //row.addClass(" orange ");
      $('td', row).eq(1).addClass(ColorMensajeNotifications()+'flow-text noleido hoverable z-depth-1');
    }
  }
};

createdRowCargaMasiva = function (row, data, dataIndex) {
  if (data.error == 'Warning') {
    if (Meteor.isClient) {
      var l = ($('td', row).length);
      for (var i = 0; i < l; i++) {  
        $('td', row).eq(i).addClass('yellow accent-4');
      }
    }
  } else if (data.error == 'Error') {
    if (Meteor.isClient) {
      var l = ($('td', row).length);
      for (var i = 0; i < l; i++) {  
        $('td', row).eq(i).addClass('deep-orange darken-2');
      }
    }
  }
};


createdRowGeneral = function(row, data, dataIndex) {
  //console.log("row:" + JSON.stringify(row));
  //console.log("data:" + JSON.stringify(data));
  //  console.log("dataIndex:" + JSON.stringify(dataIndex));
  if (data.active == false) {
    if (Meteor.isClient) {
      //row.addClass(" orange ");
      $('td', row).addClass('brown lighten-4');
    }
  } else {
    var l = ($('td', row).length);
    for (var i = 0; i < l; i++) {
      //      console.log("column:"+ JSON.stringify($('td', row).eq(i).html()));

      if ($('td', row).eq(i).html().endsWith("**")) {
        $('td', row).eq(i).addClass('brown lighten-4');
        var val = $('td', row).eq(i).html();
        val = val.substring(0, val.length - 2);
        $('td', row).eq(i).html(val);
      }
    }
    //  $('td', row).eq(i).addClass('orange lighten-4 flow-text noleido hoverable z-depth-1');
  }
};



//Se agrega en el archivo createrow-functions.js

createdRowPropuestas = function(row, data, dataIndex){
  // console.log("row:" + JSON.stringify(row));
  //console.log("data:" + JSON.stringify(data));
  //  console.log("dataIndex:" + JSON.stringify(dataIndex));
  if (data.prp_estatus == 'En Modificación') {
    if (Meteor.isClient) {
      //row.addClass(" orange ");
      $('td', row).addClass('green lighten-4');
    }
  }
  if (data.prp_estatus == 'Rechazada') {
    if (Meteor.isClient) {
      //row.addClass(" orange ");
      $('td', row).addClass('orange lighten-4');
    }
  }
    if (data.active == false) {
      if (Meteor.isClient) {
        //row.addClass(" orange ");
        $('td', row).addClass('brown lighten-4');
      }
    } else {
      var l = ($('td', row).length);
      for(var i=0;i<l;i++){
//    console.log("column:"+ JSON.stringify($('td', row).eq(i).html()));

        if($('td', row).eq(i).html().endsWith("**")){
          $('td', row).eq(i).addClass('brown lighten-4');
          var val = $('td', row).eq(i).html();
          val = val.substring(0,val.length-2);
          $('td', row).eq(i).html(val);
        }
      }
    //  $('td', row).eq(i).addClass('orange lighten-4 flow-text noleido hoverable z-depth-1');
    }
}
