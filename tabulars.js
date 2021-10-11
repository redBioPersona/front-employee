import {Meteor} from 'meteor/meteor';
var echarts = require('echarts/lib/echarts');
var Tab_Reports=new Tabular.Table({
  name: 'Reports',
  collection: Reports,
  scrollX: true,
  processing: true,
  "language": {
    "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
    search: 'Buscar:',
    info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
    infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
    lengthMenu: 'Mostrar _MENU_ registros',
    emptyTable: 'Ningún dato disponible',
    paginate: {
      first: 'Primero',
      previous: 'Anterior',
      next: 'Siguiente',
      last: 'Último',
    }
  },
  buttons: [
    {
      extend: 'copyHtml5',
      text: '<i class="large material-icons">content_copy</i>',
      messageTop: 'Mis Registros',
      "className": 'btn-floating waves-effect waves-light blue'
    },
    {
      extend: 'csvHtml5',
      charset:'utf-8',
      bom: true,
      text: '<i class="large material-icons">cloud_download</i>',
      title: 'Mis Registros',
      "className": 'btn-floating waves-effect waves-light red'
    },
    {
      extend: 'pdfHtml5',
      text: '<i class="large material-icons">picture_as_pdf</i>',
      title:'Mis Registros',
      "className": 'btn-floating waves-effect waves-light orange',
      exportOptions: { modifier: { page: 'current' } }
    }
  ],
  columns:[
    { data: 'fecha', title: 'FECHA' },
    { data: 'inicioOficial', title: 'INICIO OFICIAL' },
    { data: 'primerRegistro', title: 'PRIMER REGISTRO', },
    { data: 'salidaOficial', title: 'SALIDA OFICIAL' },
    { data: 'ultimoRegistro', title: 'ÚLTIMO REGISTRO' },
    { data: 'tiempo', title: 'TIEMPO' },
    { data: 'horas', title: 'HORAS' },
    { data: 'estatus', title: 'ESTATUS' },
    {data: 'sancion', title: 'SANCIÓN' },
    { data: 'excepcion', title: 'EXCEPCIÓN' },
    { data: 'antes', title: 'SALIDA ANTICIPADA',render:function(val){
      var result="-";
        if(val=="false"){
          result="No"
        }else if(val=="true"){
          result="Si";
        }
        return result;
    }
  },
  {
    data:"estatus",
    title:"Justificar",
    tmpl: Meteor.isClient && Template.justificar_template
  }
]
});

var Tab_Justificantes=new Tabular.Table({
  name: 'Justificantes',
  collection: Justificantes,
  autoWidth: false,
  scrollX: true,
  responsive:true,
  processing: true,
  "language": {
    "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
    search: 'Buscar:',
    info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
    infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
    lengthMenu: 'Mostrar _MENU_ registros',
    emptyTable: 'Ningún dato disponible',
    paginate: {
      first: 'Primero',
      previous: 'Anterior',
      next: 'Siguiente',
      last: 'Último',
    }
  },
  dom: 'lBfrtip',
  lengthMenu: [
    [10, 25, 50, 100, 500,-1],
    ['10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas','Todo']
  ],
  buttons: [
    {
      extend: 'copyHtml5',
      text: '<i class="large material-icons">content_copy</i>',
      messageTop: 'Mis Justificantes',
      "className": 'btn-floating waves-effect waves-light blue'
    },
    {
      extend: 'csvHtml5',
      charset:'utf-8',
      bom: true,
      text: '<i class="large material-icons">cloud_download</i>',
      title: 'Mis Justificantes',
      "className": 'btn-floating waves-effect waves-light red'
    },
    {
      extend: 'pdfHtml5',
      text: '<i class="large material-icons">picture_as_pdf</i>',
      title:'Mis Justificantes',
      "className": 'btn-floating waves-effect waves-light orange',
      exportOptions: { modifier: { page: 'current' } }
    }
  ],
  selector:Selector_Justificantes,
  columns: [
    { data:"idEmp", title:"Id" },
    { data:"idEmpName", title:"Colaborador" },
    { data:"fecha", title:"Fecha" },
    { data: "razon_txt", title: "Razón de la Ausencia", },
    { data:"observaciones", title:"Obs. del Colaborador" },
    orion.attributeColumn('fileXP', 'documento', 'Documento'),
    { data:"estatus", title:"Estatus"},
    { data:"observaciones_admin", title:"Obs. RH",render(val){if(val){return val;}else{ return "Sin Comentarios";}}},
    {
      data:"procede",
      title:"Procede",
      render(val) {
            if (val) { return "<img src='/images/check.png' width='25px'>" }
           else { return "<img src='/images/denied.png' width='25lpx'>" }
          }
    },
    {
      data: "createdBy",
      title: "Insertó",
      render: function(val){ var Data = Meteor.users.findOne({_id:val}); if (Data !== undefined) { return Data.profile.name; }else { return "Sin Asignar"; } }
    },
    {
      data: "createdAt",
      title: "Insertado",
      render: function(val){ return formatADate(val); }
    },
    {
      data: "updatedBy",
      title: "Actualizó",
      render: function(val){ var Data = Meteor.users.findOne({_id:val}); if (Data !== undefined) { return Data.profile.name; }else { return "Sin Asignar"; } }
    },
    {
      data: "updatedAt",
      title: "Actualizado",
      render: function(val){ return formatADate(val); }
    }
  ]
});
