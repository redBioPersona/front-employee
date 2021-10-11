getData = function (modulo, userId, Company) {
    switch (modulo) {
        case "Localidades":
            return {
                Headers: ["NOMBRE", "DESCRIPCION", "DIRECCION"],
                PathFileRead: "Archivos/Localidades/Aprocesar/",
                PathFileErr: "Archivos/Localidades/Error/",
                PathFileProc: "Archivos/Localidades/Procesados/",
                Collection: Locations,
                CollectionString: "locations",
                Constants: {
                    idcompany: [Company],
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "locationName", Valor: "NOMBRE", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                Data: {
                    NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "locationName" },
                    DESCRIPCION: { Tipo: "String", Requerido: false, FieldDBName: "locationDesc" },
                    DIRECCION: { Tipo: "String", Requerido: false, FieldDBName: "locationAddr" }
                }
            };
            break;
        case "Documentos":
            return {
                Headers: ["NOMBRE"],
                PathFileRead: "Archivos/Documentos/Aprocesar/",
                PathFileErr: "Archivos/Documentos/Error/",
                PathFileProc: "Archivos/Documentos/Procesados/",
                Collection: Documents,
                CollectionString: "documents",
                Constants: {
                    idcompany: Company,
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "name", Valor: "NOMBRE", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                Data: {
                    NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "name" }
                }
            };
            break;
            case "Areas":
            return {
                Headers: ["NOMBRE","DESCRIPCION","RESPONSABLE"],
                PathFileRead: "Archivos/Areas/Aprocesar/",
                PathFileErr: "Archivos/Areas/Error/",
                PathFileProc: "Archivos/Areas/Procesados/",
                Collection: Areas,
                CollectionString: "areas",
                Constants: {
                    idcompany: Company,
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "areaName", Valor: "NOMBRE", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                ForeignKey: {
                    RESPONSABLE: { 
                        Collection: Jefes, 
                        FieldCompare: "idEmp", 
                        FieldReturn: "_id", 
                        FieldUse: "idJefe",
                        Compania:{
                            idcompany:Company
                        }
                    },
                },
                Data: {
                    NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "areaName" },
                    DESCRIPCION: { Tipo: "String", Requerido: false, FieldDBName: "areaDesc" },
                    RESPONSABLE: { Tipo: "Array", Requerido: false, FieldDBName: "idJefe" }
                }
            };
            break;
            case "Jefes":
            return {
                Headers: ["NUMERO_COLABORADOR"],
                PathFileRead: "Archivos/Jefes/Aprocesar/",
                PathFileErr: "Archivos/Jefes/Error/",
                PathFileProc: "Archivos/Jefes/Procesados/",
                Collection: Jefes,
                CollectionString: "jefes",
                Constants: {
                    idcompany: Company,
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "idEmp", Valor: "NOMBRE", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                ForeignKey: {
                    NUMERO_COLABORADOR: { 
                        Collection: Persons, 
                        FieldCompare: "idEmployee", 
                        FieldReturn: "_id", 
                        FieldUse: "idEmployee",
                        Compania:{
                            idcompany:Company
                        }
                    },
                },
                Data: {
                    NUMERO_COLABORADOR: { Tipo: "Numero", Requerido: true, FieldDBName: "idEmp" },
                }
            };
            break;
            case "Proyectos":
            return {
                Headers: ["NOMBRE","DESCRIPCION"],
                PathFileRead: "Archivos/Proyectos/Aprocesar/",
                PathFileErr: "Archivos/Proyectos/Error/",
                PathFileProc: "Archivos/Proyectos/Procesados/",
                Collection: Proyectos,
                CollectionString: "proyectos",
                Constants: {
                    idcompany: Company,
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "proyectoName", Valor: "NOMBRE", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                Data: {
                    NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "proyectoName" },
                    DESCRIPCION: { Tipo: "String", Requerido: false, FieldDBName: "proyectoDesc" }
                }
            };
            break;
            case "Direcciones":
            return {
                Headers: ["NOMBRE","DESCRIPCION","RESPONSABLE"],
                PathFileRead: "Archivos/Direcciones/Aprocesar/",
                PathFileErr: "Archivos/Direcciones/Error/",
                PathFileProc: "Archivos/Direcciones/Procesados/",
                Collection: Direcciones,
                CollectionString: "direcciones",
                Constants: {
                    idcompany: Company,
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "direccionName", Valor: "NOMBRE", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                ForeignKey: {
                    RESPONSABLE: { 
                        Collection: Jefes, 
                        FieldCompare: "idEmp", 
                        FieldReturn: "_id", 
                        FieldUse: "idJefe",
                        Compania:{
                            idcompany:Company
                        }
                    },
                },
                Data: {
                    NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "direccionName" },
                    DESCRIPCION: { Tipo: "String", Requerido: false, FieldDBName: "direccionDesc" },
                    RESPONSABLE: { Tipo: "Numero", Requerido: false, FieldDBName: "idJefe" }
                }
            };
            break;
        case "Departamentos":
            return {
                Headers: ["NOMBRE", "DESCRIPCION", "LOCALIDAD","JEFE"],
                PathFileRead: "Archivos/Departamentos/Aprocesar/",
                PathFileErr: "Archivos/Departamentos/Error/",
                PathFileProc: "Archivos/Departamentos/Procesados/",
                Collection: Departments,
                CollectionString: "departments",
                Constants: {
                    idcompany: Company,
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "departmentName", Valor: "NOMBRE", Tipo: "Variable" },
                    { FieldDBName: "idLocation_txt", Valor: "LOCALIDAD", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                ForeignKey: {
                    LOCALIDAD: { 
                        Collection: Locations, 
                        FieldCompare: "locationName", 
                        FieldReturn: "_id", 
                        FieldUse: "idLocation", 
                        Compania:{
                            idcompany:[Company]
                        }
                    },
                    JEFE: { 
                        Collection: Jefes, 
                        FieldCompare: "idEmp", 
                        FieldReturn: "_id", 
                        FieldUse: "idmanager",
                        Compania:{
                            idcompany:Company
                        }
                    }
                },
                Data: {
                    NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "departmentName" },
                    DESCRIPCION: { Tipo: "String", Requerido: false, FieldDBName: "departmentDesc" },
                    LOCALIDAD: { Tipo: "String", Requerido: false, FieldDBName: "idLocation" },
                    JEFE: { Tipo: "Array", Requerido: false, FieldDBName: "idmanager" }
                }
            };
            break;
        case "Incidencias":
            return {
                Headers: ["NOMBRE", "DESCRIPCION"],
                PathFileRead: "Archivos/Incidencias/Aprocesar/",
                PathFileErr: "Archivos/Incidencias/Error/",
                PathFileProc: "Archivos/Incidencias/Procesados/",
                Collection: Incidencias,
                CollectionString: "incidencias",
                Constants: {
                    idcompany: Company,
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "razon", Valor: "NOMBRE", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                Data: {
                    NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "razon" },
                    DESCRIPCION: { Tipo: "String", Requerido: false, FieldDBName: "observaciones" }
                }
            };
            break;
        case "Colaboradores":
            return {
                Headers: ["NUMERO_COLABORADOR", "NOMBRE", "PUESTO", "DEPARTAMENTO", "LOCALIDAD", "FECHA_CONTRATACION", "TELEFONO", "MOVIL", "CORREO", "JEFE", "CUMPLEANIOS", "ROL", "IMPRIME_TICKET","OUTSOURCING","DIRECCION","AREAS","PROYECTOS"],
                PathFileRead: "Archivos/Colaboradores/Aprocesar/",
                PathFileErr: "Archivos/Colaboradores/Error/",
                PathFileProc: "Archivos/Colaboradores/Procesados/",
                Collection: Persons,
                CollectionString: "persons",
                Constants: {
                    idEmpStatus: "3eRz4SNtFFWbtmYBf",
                    mealsEmp: false,
                    permissionEnrol: false,
                    idcompany: [Company],
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "idEmployee", Valor: "NUMERO_COLABORADOR", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }                    
                ],
                ForeignKey: {
                    PUESTO: { 
                        Collection: Employeespositions, 
                        FieldCompare: "empPosName", 
                        FieldReturn: "_id", 
                        FieldUse: "idEmpPosition",
                        Compania:{
                            idcompany:Company
                        }
                    },
                    DEPARTAMENTO:{ 
                        Collection: Departments,
                        FieldCompare: "departmentName",
                        FieldReturn: "_id", 
                        FieldUse: "idDepartment",
                        Compania:{
                            idcompany:Company
                        }
                    },
                    LOCALIDAD:{ 
                        Collection: Locations, 
                        FieldCompare: "locationName", 
                        FieldReturn: "_id", 
                        FieldUse: "idLocation",
                        Compania:{
                            idcompany:[Company]
                        }
                    },
                    OUTSOURCING:{ 
                        Collection: Pagadoras, 
                        FieldCompare: "pagadoraName", 
                        FieldReturn: "_id", 
                        FieldUse: "idpagadora",
                        Compania:{
                            idcompany:Company
                        }
                    },
                    DIRECCION:{ 
                        Collection: Direcciones, 
                        FieldCompare: "direccionName", 
                        FieldReturn: "_id", 
                        FieldUse: "idDireccion",
                        Compania:{
                            idcompany:Company
                        }
                    },
                    AREAS:{ 
                        Collection: Areas, 
                        FieldCompare: "areaName", 
                        FieldReturn: "_id", 
                        FieldUse: "idArea",
                        Compania:{
                            idcompany:Company
                        }
                    },
                    PROYECTOS:{ 
                        Collection: Proyectos, 
                        FieldCompare: "proyectoName", 
                        FieldReturn: "_id", 
                        FieldUse: "idProyecto",
                        Compania:{
                            idcompany:Company
                        }
                    },
                    JEFE:{ 
                        Collection: Jefes, 
                        FieldCompare: "idEmp", 
                        FieldReturn: "_id", 
                        FieldUse: "idmanager",
                        Compania:{
                            idcompany:Company
                        }
                    }                         
                },
                Data: {
                    NUMERO_COLABORADOR: { Tipo: "Numero", Requerido: true, FieldDBName: "idEmployee" },
                    NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "employeeName", },
                    PUESTO: { Tipo: "String", Requerido: true, FieldDBName: "idEmpPosition" },
                    DEPARTAMENTO: { Tipo: "String", Requerido: true, FieldDBName: "idDepartment" },
                    LOCALIDAD: { Tipo: "String", Requerido: true, FieldDBName: "idLocation" },
                    FECHA_CONTRATACION: { Tipo: "String", Requerido: true, FieldDBName: "hireDate",Funcion:'ValidateStringToDate'},
                    TELEFONO: { Tipo: "Numero", Requerido: false, FieldDBName: "empPhoneNbr"},
                    MOVIL: { Tipo: "Numero", Requerido: false, FieldDBName: "empCellNbr"},
                    CORREO: { Tipo: "String", Requerido: false, FieldDBName: "empEmail"},
                    JEFE: { Tipo: "Numero", Requerido: false, FieldDBName: "idmanager"},
                    CUMPLEANIOS: { Tipo: "String", Requerido: false, FieldDBName: "cumple",Funcion:'ValidateStringToDate'},
                    ROL: { Tipo: "String", Requerido: false, FieldDBName: "roles",Funcion:'ValidateRolesToArray'},
                    IMPRIME_TICKET: { Tipo: "String", Requerido: false, FieldDBName: "mealsEmp",Funcion:'ValidateStringToBoolean'},
                    OUTSOURCING: { Tipo: "String", Requerido: false, FieldDBName: "idpagadora"},
                    DIRECCION: { Tipo: "String", Requerido: false, FieldDBName: "idDireccion"},
                    AREAS: { Tipo: "String", Requerido: false, FieldDBName: "idArea"},
                    PROYECTOS: { Tipo: "String", Requerido: false, FieldDBName: "idProyecto"},
                }
            };
            break;
        case "Puestos":
            return {
                Headers: ["NOMBRE", "DESCRIPCION"],
                PathFileRead: "Archivos/Puestos/Aprocesar/",
                PathFileErr: "Archivos/Puestos/Error/",
                PathFileProc: "Archivos/Puestos/Procesados/",
                Collection: Employeespositions,
                CollectionString: "employeespositions",
                Constants: {
                    idcompany: Company,
                    active: true,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "empPosName", Valor: "NOMBRE", Tipo: "Variable" },
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                Data: {
                    NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "empPosName" },
                    DESCRIPCION: { Tipo: "String", Requerido: false, FieldDBName: "empPosDesc" }
                }
            };
            break;
        case "Horarios":
            return {
                Headers: ["NUMERO_COLABORADOR", "JORNADA_LABORAL"],
                PathFileRead: "Archivos/Horarios/Aprocesar/",
                PathFileErr: "Archivos/Horarios/Error/",
                PathFileProc: "Archivos/Horarios/Procesados/",
                Collection: Days,
                CollectionString: "days",
                Constants: {
                    idcompany: [Company],
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedBy: userId,
                    updatedAt: new Date()
                },
                Key: [
                    { FieldDBName: "idEmp", Valor: "NUMERO_COLABORADOR", Tipo: "Variable" }, 
                    { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                ],
                ForeignKey: {
                    NUMERO_COLABORADOR: { 
                        Collection: Persons, 
                        FieldCompare: "idEmployee", 
                        FieldReturn: "_id", 
                        FieldUse: "idEmployee",
                        Compania:{
                            idcompany:[Company]
                        }
                    },
                    JORNADA_LABORAL:{ 
                        Collection: Horarios, 
                        FieldCompare: "clave", 
                        FieldReturn: "_id", 
                        FieldUse: "idHorario",
                        Compania:{
                            idcompany:[Company]
                        }
                    },
                },
                Data: {
                    NUMERO_COLABORADOR: { Tipo: "Numero", Requerido: true, FieldDBName: "idEmp" },
                    JORNADA_LABORAL: { Tipo: "String", Requerido: true, FieldDBName: "idHorario" }
                }
            };
            break;
            case "Outsourcing":
                return {
                    Headers: ["NOMBRE", "DESCRIPCION"],
                    PathFileRead: "Archivos/Outsourcing/Aprocesar/",
                    PathFileErr: "Archivos/Outsourcing/Error/",
                    PathFileProc: "Archivos/Outsourcing/Procesados/",
                    Collection: Pagadoras,
                    CollectionString: "pagadoras",
                    Constants: {
                        idcompany: Company,
                        createdBy: userId,
                        createdAt: new Date(),
                        updatedBy: userId,
                        updatedAt: new Date()
                    },
                    Key: [
                        { FieldDBName: "pagadoraName", Valor: "NOMBRE", Tipo: "Variable" }, 
                        { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                    ],
                    Data: {
                        NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "pagadoraName" },
                        DESCRIPCION: { Tipo: "String", Requerido: false, FieldDBName: "pagadoraDesc" }
                    }
                };
                break;
            case "Restaurantes":
                return {
                    Headers: ["NOMBRE", "DESCRIPCION","CONTACTO","EMAIL","TELEFONO","DIRECCION"],
                    PathFileRead: "Archivos/Restaurantes/Aprocesar/",
                    PathFileErr: "Archivos/Restaurantes/Error/",
                    PathFileProc: "Archivos/Restaurantes/Procesados/",
                    Collection: Restaurants,
                    CollectionString: "restaurants",
                    Constants: {
                        idcompany: Company,
                        createdBy: userId,
                        createdAt: new Date(),
                        updatedBy: userId,
                        updatedAt: new Date()
                    },
                    Key: [
                        { FieldDBName: "restaurantName", Valor: "NOMBRE", Tipo: "Variable" }, 
                        { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                    ],
                    Data: {
                        NOMBRE: { Tipo: "String", Requerido: true, FieldDBName: "restaurantName" },
                        DESCRIPCION: { Tipo: "String", Requerido: false, FieldDBName: "restaurantDesc" },
                        CONTACTO: { Tipo: "String", Requerido: false, FieldDBName: "contactPerson" },
                        EMAIL: { Tipo: "String", Requerido: false, FieldDBName: "restEmail" },
                        TELEFONO: { Tipo: "Numero", Requerido: false, FieldDBName: "restPhone" },
                        DIRECCION: { Tipo: "String", Requerido: false, FieldDBName: "restAddr" },
                    }
                };
                break;
                case "Sanciones":
                return {
                    Headers: ["CLAVE", "ETIQUETA","DESCRIPCION","DESCUENTO"],
                    PathFileRead: "Archivos/Sanciones/Aprocesar/",
                    PathFileErr: "Archivos/Sanciones/Error/",
                    PathFileProc: "Archivos/Sanciones/Procesados/",
                    Collection: Sanciones,
                    CollectionString: "sanciones",
                    Constants: {
                        idcompany: [Company],
                        createdBy: userId,
                        createdAt: new Date(),
                        updatedBy: userId,
                        updatedAt: new Date()
                    },
                    Key: [
                        { FieldDBName: "clave", Valor: "CLAVE", Tipo: "Variable" }, 
                        { FieldDBName: "idcompany", Valor: Company, Tipo: "Constante" }
                    ],
                    Data: {
                        CLAVE: { Tipo: "String", Requerido: true, FieldDBName: "clave" },
                        ETIQUETA: { Tipo: "String", Requerido: true, FieldDBName: "etiqueta" },
                        DESCRIPCION: { Tipo: "String", Requerido: true, FieldDBName: "descripcion" },
                        DESCUENTO: { Tipo: "String", Requerido: true, FieldDBName: "descuento" },
                    }
                };
                break;
        default:
            return undefined;
            break;
    }
}