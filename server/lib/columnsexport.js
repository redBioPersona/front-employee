if (Meteor.isServer) {
  getColumnsFromCollection = function (coleccion, columns) {
    switch (coleccion) {
      case "accesscontrol":
        columns[4]["Render"] = 'collection';
        columns[4]["CollectionRender"] = 'companies';
        columns[4]["Query"] = '_id';
        columns[4]["GetField"] = 'companyName';
        break;
        case "reportsconcentrados":
        columns[24]["Render"] = 'function';
        columns[24]["FunctionRender"] = 'getNameUserAccount';
        break;
      case "accessdetails":
        columns[3]["Render"] = 'function';
        columns[3]["FunctionRender"] = 'getRenderDevice';
        break;
      case "pagadoras":
        columns[3]["Render"] = 'function';
        columns[3]["FunctionRender"] = 'GeBooleano';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'getNameUserAccount';
        columns[6]["Render"] = 'function';
        columns[6]["FunctionRender"] = 'getNameUserAccount';
        break;
      case "restaurants":
        columns[6]["Render"] = 'collection';
        columns[6]["CollectionRender"] = 'companies';
        columns[6]["Query"] = '_id';
        columns[6]["GetField"] = 'companyName';
        columns[7]["Render"] = 'function';
        columns[7]["FunctionRender"] = 'GeBooleano';
        columns[8]["Render"] = 'function';
        columns[8]["FunctionRender"] = 'getNameUserAccount';
        columns[10]["Render"] = 'function';
        columns[10]["FunctionRender"] = 'getNameUserAccount';
        break;
      case "cargamasiva":
          columns[7]["Render"] = 'function';
          columns[7]["FunctionRender"] = 'getNameUserAccount';
        break;
      case "days":
        columns[2]["Render"] = 'function';
        columns[2]["FunctionRender"] = 'render_getHorarioLunes';
        columns[3]["Render"] = 'function';
        columns[3]["FunctionRender"] = 'render_getHorarioMartes';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'render_getHorarioMiercoles';
        columns[5]["Render"] = 'function';
        columns[5]["FunctionRender"] = 'render_getHorarioJueves';
        columns[6]["Render"] = 'function';
        columns[6]["FunctionRender"] = 'render_getHorarioViernes';
        columns[7]["Render"] = 'function';
        columns[7]["FunctionRender"] = 'render_getHorarioSabado';
        columns[8]["Render"] = 'function';
        columns[8]["FunctionRender"] = 'render_getHorarioDomingo';
        columns[9]["Render"] = 'function';
        columns[9]["FunctionRender"] = 'getNameUserAccount';
        columns[11]["Render"] = 'function';
        columns[11]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "persons":
        columns[5]["Render"] = 'collection';
        columns[5]["CollectionRender"] = 'companies';
        columns[5]["Query"] = '_id';
        columns[5]["GetField"] = 'companyName';
        columns[8]["Render"] = 'function';
        columns[8]["FunctionRender"] = 'formatSimpleDate';
        columns[14]["Render"] = 'function';
        columns[14]["FunctionRender"] = 'GeBooleano';
        columns[18]["Render"] = 'function';
        columns[18]["FunctionRender"] = 'getNameUserAccount';
        columns[20]["Render"] = 'function';
        columns[20]["FunctionRender"] = 'getNameUserAccount';
        columns.splice(2, 1);
        break;

      case "sanciones":
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'GeBooleano';
        columns[5]["Render"] = 'function';
        columns[5]["FunctionRender"] = 'getNameUserAccount';
        columns[7]["Render"] = 'function';
        columns[7]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "reglas_retardos":
        columns[5]["Render"] = 'function';
        columns[5]["FunctionRender"] = 'GeBooleano';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'render_tolerancia';
        columns[6]["Render"] = 'function';
        columns[6]["FunctionRender"] = 'getNameUserAccount';
        columns[8]["Render"] = 'function';
        columns[8]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "reglas_alimentos":
        columns[5]["Render"] = 'function';
        columns[5]["FunctionRender"] = 'GeBooleano';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'render_tolerancia';
        columns[6]["Render"] = 'function';
        columns[6]["FunctionRender"] = 'getNameUserAccount';
        columns[8]["Render"] = 'function';
        columns[8]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "horarios":
        columns[3]["Render"] = 'function';
        columns[3]["FunctionRender"] = 'horarios';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'horarios';
        columns[5]["Render"] = 'function';
        columns[5]["FunctionRender"] = 'horarios';
        columns[6]["Render"] = 'function';
        columns[6]["FunctionRender"] = 'horarios';
        columns[7]["Render"] = 'function';
        columns[7]["FunctionRender"] = 'horarios';
        columns[8]["Render"] = 'function';
        columns[8]["FunctionRender"] = 'horarios';
        columns[9]["Render"] = 'function';
        columns[9]["FunctionRender"] = 'horarios';

        columns[10]["Render"] = 'collection';
        columns[10]["CollectionRender"] = 'reglas_retardos';
        columns[10]["Query"] = '_id';
        columns[10]["GetField"] = 'clave';

        columns[11]["Render"] = 'collection';
        columns[11]["CollectionRender"] = 'reglas_alimentos';
        columns[11]["Query"] = '_id';
        columns[11]["GetField"] = 'clave';

        columns[13]["Render"] = 'function';
        columns[13]["FunctionRender"] = 'getNameUserAccount';

        columns[15]["Render"] = 'function';
        columns[15]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "departments":
        columns[0]["Render"] = 'function';
        columns[0]["FunctionRender"] = 'GeBooleano';        
        columns[6]["Render"] = 'function';
        columns[6]["FunctionRender"] = 'getNameUserAccount';
        columns[7]["Render"] = 'function';
        columns[7]["FunctionRender"] = 'formatSimpleDate';
        columns[8]["Render"] = 'function';
        columns[8]["FunctionRender"] = 'getNameUserAccount';
        columns[9]["Render"] = 'function';
        columns[9]["FunctionRender"] = 'formatSimpleDate';
        break;

      case "employeespositions":
        columns[0]["Render"] = 'function';
        columns[0]["FunctionRender"] = 'GeBooleano';
        columns[3]["Render"] = 'collection';
        columns[3]["CollectionRender"] = 'companies';
        columns[3]["Query"] = '_id';
        columns[3]["GetField"] = 'companyName';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'getNameUserAccount';
        columns[6]["Render"] = 'function';
        columns[6]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "documents":
        columns[1]["Render"] = 'function';
        columns[1]["FunctionRender"] = 'GeBooleano';
        columns[2]["Render"] = 'function';
        columns[2]["FunctionRender"] = 'getNameUserAccount';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'getNameUserAccount';
        break;

         case "direcciones":
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'GeBooleano';
        columns[5]["Render"] = 'function';
        columns[5]["FunctionRender"] = 'getNameUserAccount';
        columns[7]["Render"] = 'function';
        columns[7]["FunctionRender"] = 'getNameUserAccount';
        break;

        case "areas":
          columns[4]["Render"] = 'function';
          columns[4]["FunctionRender"] = 'GeBooleano';
          columns[5]["Render"] = 'function';
          columns[5]["FunctionRender"] = 'getNameUserAccount';
          columns[7]["Render"] = 'function';
          columns[7]["FunctionRender"] = 'getNameUserAccount';
          break;

          case "jefes":
          columns[6]["Render"] = 'function';
          columns[6]["FunctionRender"] = 'GeBooleano';
          columns[7]["Render"] = 'function';
          columns[7]["FunctionRender"] = 'getNameUserAccount';
          columns[9]["Render"] = 'function';
          columns[9]["FunctionRender"] = 'getNameUserAccount';
          columns.splice(0, 1)
          break;

          case "proyectos":
            columns[3]["Render"] = 'function';
            columns[3]["FunctionRender"] = 'GeBooleano';
            columns[4]["Render"] = 'function';
            columns[4]["FunctionRender"] = 'getNameUserAccount';
            columns[6]["Render"] = 'function';
            columns[6]["FunctionRender"] = 'getNameUserAccount';
            break;

      case "vacations":
        columns[0]["Render"] = 'function';
        columns[0]["FunctionRender"] = 'getIdPerson';
        columns[1]["Render"] = 'function';
        columns[1]["FunctionRender"] = 'getNamePerson';
        columns[5]["Render"] = 'function';
        columns[5]["FunctionRender"] = 'getNameUserAccount';
        columns[7]["Render"] = 'function';
        columns[7]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "permisos":
        columns[0]["Render"] = 'function';
        columns[0]["FunctionRender"] = 'getIdPerson';
        columns[2]["Render"] = 'function';
        columns[2]["FunctionRender"] = 'GeBooleano';
        columns[5]["Render"] = 'collection';
        columns[5]["CollectionRender"] = 'incidencias';
        columns[5]["Query"] = '_id';
        columns[5]["GetField"] = 'razon';
        columns[8]["Render"] = 'function';
        columns[8]["FunctionRender"] = 'getNameUserAccount';
        columns[10]["Render"] = 'function';
        columns[10]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "feriados":
        columns[2]["Render"] = 'function';
        columns[2]["FunctionRender"] = 'getNameUserAccount';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "incidencias":
        columns[2]["Render"] = 'function';
        columns[2]["FunctionRender"] = 'GeBooleano';
        columns[3]["Render"] = 'function';
        columns[3]["FunctionRender"] = 'getNameUserAccount';
        columns[5]["Render"] = 'function';
        columns[5]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "reports":
        if (columns[13] != undefined) {
          columns[13]["Render"] = 'function';
          columns[13]["FunctionRender"] = 'GetAnticipado';
        } else {
          columns[12]["Render"] = 'function';
          columns[12]["FunctionRender"] = 'GetAnticipado';
        }
        break;

      case "justificantes":
        columns[9]["Render"] = 'function';
        columns[9]["FunctionRender"] = 'GeBooleano';
        columns[10]["Render"] = 'function';
        columns[10]["FunctionRender"] = 'getNameUserAccount';
        columns[12]["Render"] = 'function';
        columns[12]["FunctionRender"] = 'getNameUserAccount';
        columns.splice(0, 1);
        columns.splice(5, 1);
        break;

      case "companies":
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'getNamePerson';
        columns[5]["Render"] = 'function';
        columns[5]["FunctionRender"] = 'GeBooleano';
        columns[6]["Render"] = 'function';
        columns[6]["FunctionRender"] = 'GeBooleano';
        columns[9]["Render"] = 'function';
        columns[9]["FunctionRender"] = 'getNameUserAccount';
        columns.splice(0, 1)
        break;

      case "enrollments":
        columns[3]["Render"] = 'function';
        columns[3]["FunctionRender"] = 'formatSimpleDate';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'getNameUserAccount';
        break;

      case "locations":
        columns[3]["Render"] = 'function';
        columns[3]["FunctionRender"] = 'GeBooleano';
        columns[4]["Render"] = 'function';
        columns[4]["FunctionRender"] = 'getNameUserAccount';
        columns[6]["Render"] = 'function';
        columns[6]["FunctionRender"] = 'getNameUserAccount';
        break;


      default:
        break;
    }
    return columns;
  }
}
