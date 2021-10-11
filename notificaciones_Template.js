if (Meteor.isClient) {
 Template.notificaciones_Template.helpers({
   rendered: function(){

   }
 });

 Template.notificaciones_Template.events({
   "click tbody > tr": function(event){
     event.preventDefault();
    event.stopPropagation();

     var dataTable = $(event.target).closest('table').DataTable();
     var rowData = dataTable.row(event.currentTarget).data();

     if(!rowData) return;

  //   console.log('rowData:' + JSON.stringify(rowData));
    Notificaciones.update({_id:rowData._id},{ $set: { not_status:'Leído' }});

    if(rowData.not_url){
      if(rowData.no_tipo=="Faltas"){
        var id=rowData.not_url.split("/")[3];
        Session.set('SearchEmployee',id);
        Router.go('/admin/outreports');
      }else{
        Session.set('parentPath','/admin/notificaciones');
        Router.go(rowData.not_url);
      }
    }
   }
 });
}
