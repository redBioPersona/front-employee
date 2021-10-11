fingersName=function(dato) {
    var name="N/A";
        switch (dato) {
            case "left_pulgares":
            name = "Pulgar Izquierdo";
            break;
            case "left__indices":
            name = "Indice Izquierdo";
            break;
            case "left___medios":
            name = "Medio Izquierdo";
            break;
            case "left_anulares":
            name = "Anular Izquierdo";
            break;
            case "left_meniques":
            name = "Meñique Izquierdo";
            break;
            case "right_pulgars":
            name = "Pulgar Derecho";
            break;
            case "right_indices":
            name = "Indice Derecho";
            break;
            case "right__medios":
            name = "Medio Derecho";
            break;
            case "right__anular":
            name = "Anular Derecho";
            break;
            case "right_menique":
            name = "Meñique Derecho";
            break;
            default:
            name = "Dedo"
            break;
            
        }
        return name;
    }
