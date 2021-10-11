ConfigRestService = new orion.collection('configRestService', {
    singularName: 'Configuración del servicio Rest',
    pluralName: 'Configuraciónes del servicio Rest',
    title: 'Configuración del Servicio',
    parentPath: '/admin/principal',
    help: 'Configuración Inicial de la Aplicación',
    link: { title: 'Configuración de la Aplicación', parent: '_template' },
    tabular: {
      scrollX: true,
      "processing": true,
      "language": {
        "processing": '<i class="fa fa-spinner fa-spin" style=\'font-size:45px;color:#2196f3;\'></i>',
        search: 'Buscar:',
        info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
        infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
        lengthMenu: 'Mostrar _MENU_ registros',
        emptyTable: 'Ningún dato disponible',
        paginate: {first: 'Primero',previous: 'Anterior',next: 'Siguiente',last: 'Último',}
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
          messageTop: 'Configuracion de la Aplicacion',
          "className": 'btn-floating waves-effect waves-light blue'
        },
        {
          extend: 'csvHtml5',
          charset:'utf-8',
          bom: true,
          text: '<i class="large material-icons">cloud_download</i>',
          title:"Configuracion de la Aplicacion",
          "className": 'btn-floating waves-effect waves-light red'
        },
        {
          extend: 'pdfHtml5',
          text: '<i class="large material-icons">picture_as_pdf</i>',
          title:"Configuracion de la Aplicacion",
          "className": 'btn-floating waves-effect waves-light orange',
          exportOptions: { modifier: { page: 'current' } }
        }
      ],
      columns: [{
          data: "isServer",
          title: "¿Es Servidor?",
          render(val) {
            if (!val) {
              return "<img src='/images/denied.png' width='25lpx'>"
            } else {
              return "<img src='/images/check.png' width='25px'>"
            }
          }
        },
        {
          data: "license",
          title: "Estatus de la Licencia",
          render(val) {
            if (val == "error") {
              return "<img src='/images/denied.png' width='25lpx'>"
            } else {
              return "<img src='/images/check.png' width='25px'>"
            }
          }
        },
        {
          data: "enroll_docs",
          title: "Enrolamiento de Documentos",
          render(val) {
            if (!val) {
              return "<img src='/images/denied.png' width='25lpx'>"
            } else {
              return "<img src='/images/check.png' width='25px'>"
            }
          }
        },
        {
          data: "enroll_face",
          title: "Enrolamiento Facial",
          render(val) {
            if (!val) {
              return "<img src='/images/denied.png' width='25lpx'>"
            } else {
              return "<img src='/images/check.png' width='25px'>"
            }
          }
        },
        {
          data: "enroll_sign",
          title: "Enrolamiento de Firma",
          render(val) {
            if (!val) {
              return "<img src='/images/denied.png' width='25lpx'>"
            } else {
              return "<img src='/images/check.png' width='25px'>"
            }
          }
        },
        {
          data: "serversync",
          title: "Sincronizar con el servidor",
          render(val) {
            if (!val) {
              return "<img src='/images/denied.png' width='25lpx'>"
            } else {
              return "<img src='/images/check.png' width='25px'>"
            }
          }
        }
      ]
    }
  });
