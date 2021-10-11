import './filtroAdvancedMaterialize.html';
if (Meteor.isClient) {
    Session.set("ContadorFiltro", [1]);
    Session.set("FiltroSelector", '');
    Session.set("FiltroQueries", {});
    Session.set("FiltroOps", {});

    var FnObjectValues = function (obj) {
        var values = [];
        var keys = Object.keys(obj);
        for (var i in keys) {
            values.push(obj[keys[i]]);
        }
        return values;
    }

    DropdownSelect = function (elem, htmlid) {
        $("#" + htmlid + ":first-child").text(elem.label).append('<span class="caret"></span>');
        $("#" + htmlid + ":first-child").val(elem.value);
    }

    DoSelector = function (field, operator, value, type, options) {
        var select = {};
        switch (operator) {
            case "=":
                if (type == "Number")
                    value = Number(value);
                if (type == "Date")
                    value = new Date(value);
                if (type == "Boolean"){
                    var resultado=true;
                    switch (value) {
                        case true:
                        case "true":
                        case "yes":
                        case "si":
                            resultado=true
                        break;
                        case false:
                        case "false":
                        case "no":
                        case "No":
                                resultado=false
                        break;
                        default:
                            console.log("Error valor desconocido :"+value+" tipo Booleano ")
                        break;
                    }
                    value=resultado;
                }
                select[field] = value;
                return select;
                break;
            case ">":
                if (type == "Number")
                    value = Number(value);
                if (type == "Date")
                    value = new Date(value);
                select[field] = { $gt: value };
                return select;
                break;
            case "<":
                if (type == "Number")
                    value = Number(value);
                if (type == "Date")
                    value = new Date(value);
                select[field] = { $lt: value };
                return select;
                break;
            case containsValue:
                select[field] = { $regex: value, $options: 'i' };
                return select;
                break;
            case regExpValue:
                select[field] = { $regex: value, $options: options };
                return select;
                break;            
            case "has_key":
            select["$where"] = function() { return this.object.attribute };
            return select;
            break;
            case "has_value":
            select["$where"] = function() { return this.object[Object.keys(this.object)[0]] == "complex"};
            return select;
            break;            
            default:
                return {};
        }
    }

    Template.FilterOBV.rendered = function () {
        Session.set("FiltroSelector",undefined);
        var no = Session.get("ContadorFiltro");
        if(no){
            no = no[no.length - 1];
            Blaze.renderWithData(Template.SimpleFilterOBV, { "no": no }, document.getElementById('FilterOBV'));
        }        
    }

    Template.FilterSelectOBV.rendered=function(){ }
    Template.FilterOBV.helpers({ });


    function omitir(campo) {
        var result = false;
        switch (campo.toString()) {
            case "orion.image":
            case "ksrv:clockpicker":
            case "orion.createdBy":
            case "orion.updatedBy":
                result = true;
            break;
        }
        return result;
    }

    function createdUpdatedAt(campo) {
        var result = false;
        switch (campo.toString()) {
            case "orion.createdAt":
            case "ksrv:clockpicker":
            case "orion.updatedAt":
                result = true;
                break;
        }
        return result;
    }

    function createdUpdatedAtEtiqueta(campo) {
        var result = "Desconocido";
        switch (campo.toString()) {
            case "orion.createdAt":
                result = "Fecha de creación";
                break;
            case "orion.updatedAt":
                result = "Fecha de actualización";
                break;
        }
        return result;
    }

    Template.FilterButtonOBV.helpers({
        isBootstrap: function(){
            var result=true;
            if(Session.get("FiltroTabular") && 
            Session.get("FiltroTabular").design && 
            Session.get("FiltroTabular").design=="material"){
                result=false;
            }
            return result;
        }
    });

    Template.FilterOperationsOBV.helpers({
        isBootstrap: function(){
            var result=true;
            if(Session.get("FiltroTabular") && 
            Session.get("FiltroTabular").design && 
            Session.get("FiltroTabular").design=="material"){
                result=false;
            }else{
                return result;
            }            
        }
    });

    Template.FilterButtonDeleteOBV.helpers({
        isBootstrap: function(){
            var result=true;
            if(Session.get("FiltroTabular") && 
            Session.get("FiltroTabular").design && 
            Session.get("FiltroTabular").design=="material"){
                result=false;
            }else{
                return result;
            }            
        }
    });

    Template.FilterFieldsOBV.helpers({
        isBootstrap: function(){
            var result=true;
            if(Session.get("FiltroTabular") && 
            Session.get("FiltroTabular").design && 
            Session.get("FiltroTabular").design=="material"){
                result=false;
            }
            return result;
        },
        title: function () {
            var sess = Session.get("FiltroTabular")
            if (sess && (sess.label || sess.label == ''))
                return sess.label
            return 'On Field'
        },
        fields: function () {
            var input = Session.get("FiltroTabular")
            if (!input)
                input = Session.get("")
            if (input) {
                if (typeof input == 'object')
                    var schema = input.schema
                else
                    coleccion = input.schema;
                var colection = input.collection.toLowerCase();
                var fieldArr = [], ind;
                try {
                    var tabu = orion.collections.list[colection].tabular.columns;
                    var fieldObj = orion.collections.list[colection]._collection.simpleSchema()._schema;
                    var bb = _.pluck(tabu, 'data');
                    var keys = Object.keys(fieldObj);
                    for (k in keys) {
                        if (_.contains(bb, keys[k])) {
                            if (!fieldObj[keys[k]].tabularFilterOmit && keys[k].substring([keys[k].length - 2]) != '.$') {
                                ind = keys[k].indexOf('.$.')
                                if (ind !== -1) {
                                    fieldObj[keys[k]].value = keys[k].substring(0, ind) + keys[k].substring(ind + 2)
                                }
                                else {
                                    fieldObj[keys[k]].value = keys[k];
                                }
                                if (fieldObj[keys[k]] && fieldObj[keys[k]].autoform && fieldObj[keys[k]].autoform.type && omitir(fieldObj[keys[k]].autoform.type)) {

                                } else {
                                    if (fieldObj[keys[k]] && fieldObj[keys[k]].autoform && fieldObj[keys[k]].autoform.type && createdUpdatedAt(fieldObj[keys[k]].autoform.type)) {
                                        var obj = fieldObj[keys[k]];
                                        obj["label"] = createdUpdatedAtEtiqueta(fieldObj[keys[k]].autoform.type);
                                        if(obj.label){
                                            fieldArr.push(obj);
                                        }                                        
                                    } else {
                                        var obj = fieldObj[keys[k]];
                                        if(obj.label){
                                            fieldArr.push(obj);
                                        }                                        
                                    }
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.log("err " + err);
                }
                return fieldArr;
            }
        }
    });

    Template.FilterFieldsOBV.onCreated(function () {
        if ((ref = Session.get('FiltroTabular')) != null ? ref.regex_value : void 0) {
            regExpValue = Session.get('FiltroTabular').regex_value
        }
        else {
            regExpValue = "regex"
        }
        if ((ref = Session.get('FiltroTabular')) != null ? ref.contains_value : void 0) {
            containsValue = Session.get('FiltroTabular').contains_value
        }
        else {
            var userLang = navigator.language || navigator.userLanguage;
            containsValue = "Contiene";
            switch (userLang) {
                case "en":
                    containsValue = "Contains";
                    break;
            }
        }
        operators = {
            "StringExact": [
                "="
            ],
            "String": [
                "=",
                containsValue,
                //regExpValue
            ],
            "Number": [
                "=",
                ">",
                "<"
            ],
            "Boolean": [
                "="
            ],
            "Date": [
                "=",
                "<",
                ">"
            ],
            "Object": [
                "has value",
                "has key"
            ]
        }
        //FilterOperatorsOBV = ["true", "false", "AND", "OR", "FieldExpr"];
        var andLabel, orLabel;
        if ((ref = Session.get('FiltroTabular')) != null ? ref.and_label : void 0) {
            andLabel = Session.get('FiltroTabular').and_label
        }
        else {
            andLabel = 'AND'
        }

        if ((ref = Session.get('FiltroTabular')) != null ? ref.or_label : void 0) {
            orLabel = Session.get('FiltroTabular').or_label
        }
        else {
            orLabel = 'OR'
        }

        FilterOperatorsOBV = [{ key: "AND", label: andLabel }, { key: "OR", label: orLabel }];
    });

    Template.FilterFieldsOBV.events({
        'click .dropdown-content li a': function (event) {
            console.log("CLICK...");
            var no = Session.get("ContadorFiltro");
            no = no[no.length - 1];

            if ($(event.target.parentElement.parentElement).attr("aria-labelledby") == "field" + no) {
                if (!$('#FieldButtonOBV').length)
                    Blaze.render(Template.ButtonLocationsOBV, document.getElementById('SimpleFilterOBV' + no));
                Session.set("AutoformOptions", "{}");
                DropdownSelect($(this)[0], "field" + no);

                if($(this)[0] && $(this)[0].type && $(this)[0].type.name){
                    var type = $(this)[0].type.name;
                }
                
                if ($(this)[0].exactMatch) {
                    type = 'StringExact';
                }

                $("#field" + no + ":first-child").attr("field_type", type);
                $('#FieldOperationsOBV' + no).html('');
                Blaze.renderWithData(Template.FilterOperationsOBV, { first: operators[type][0], all: operators[type], no: no }, document.getElementById('FieldOperationsOBV' + no));
                $('#FieldValueOBV' + no).html('');
                $("#operator" + no + ":first-child").val(operators[type][0]);
                if ($(this)[0].allowedValues) {
                    try {
                        var labels=$(this)[0].allowedValues;
                        var filtros=[];
                        labels.forEach(element => { filtros.push({key:element,label:element}); });
                        Blaze.renderWithData(Template.FilterSelectOBV, { operators: filtros, no: no }, document.getElementById('FieldValueOBV' + no));    
                    } catch (error) {
                        console.log(JSON.stringify(error));
                    }
                }
                else
                
                    if (type == "Boolean"){
                        var filtros=[
                            { key:true,label:"Si" },
                            { key:false,label:"No" }
                        ];
                        Blaze.renderWithData(Template.FilterSelectOBV, { operators: filtros, no: no }, document.getElementById('FieldValueOBV' + no));    
                    }                    
                    else if (type == "Date")
                        Blaze.renderWithData(Template.FiltroDate, { no: no }, document.getElementById('FieldValueOBV' + no));
                    else
                        if ($(this)[0].autoform && $(this)[0].autoform.options) {
                            var options = $(this)[0].autoform.options();
                            var values = [];
                            var map = {};
                            for (o in options) {
                                values.push(options[o].label);
                                map[options[o].label] = options[o].value;
                            }
                            Session.set("AutoformOptions", JSON.stringify(map));
                            Blaze.renderWithData(Template.FilterSelectOBV, { options: values, no: no }, document.getElementById('FieldValueOBV' + no));
                        }
                        else
                            Blaze.renderWithData(Template.FilterInputOBV, { no: no }, document.getElementById('FieldValueOBV' + no));

                if ($('#FilterOperatorsOBV' + no).html() == '')
                    Blaze.renderWithData(Template.FilterOperatorsOBV, { operators: FilterOperatorsOBV, no: no }, document.getElementById('FilterOperatorsOBV' + no));
                if ($('#FilterButtonDeleteOBV' + no).html() == '')
                    Blaze.renderWithData(Template.FilterButtonDeleteOBV, { no: no }, document.getElementById('FilterButtonDeleteOBV' + no));
                if ($('#FieldButtonOBV_reset').html() == '')
                    Blaze.render(Template.FilterButtonOBV_reset, document.getElementById('FieldButtonOBV_reset'));
                if ($('#FieldButtonOBV').html() == '')
                    Blaze.render(Template.FilterButtonOBV, document.getElementById('FieldButtonOBV'));
            }
        },
        'click .dropdown-menu li a': function (event) {
            console.log("CLICK...");
            var no = Session.get("ContadorFiltro");
            no = no[no.length - 1];

            if ($(event.target.parentElement.parentElement).attr("aria-labelledby") == "field" + no) {
                if (!$('#FieldButtonOBV').length)
                    Blaze.render(Template.ButtonLocationsOBV, document.getElementById('SimpleFilterOBV' + no));
                Session.set("AutoformOptions", "{}");
                DropdownSelect($(this)[0], "field" + no);

                if($(this)[0] && $(this)[0].type && $(this)[0].type.name){
                    var type = $(this)[0].type.name;
                }
                
                if ($(this)[0].exactMatch) {
                    type = 'StringExact';
                }

                $("#field" + no + ":first-child").attr("field_type", type);
                $('#FieldOperationsOBV' + no).html('');
                Blaze.renderWithData(Template.FilterOperationsOBV, { first: operators[type][0], all: operators[type], no: no }, document.getElementById('FieldOperationsOBV' + no));
                $('#FieldValueOBV' + no).html('');
                $("#operator" + no + ":first-child").val(operators[type][0]);
                if ($(this)[0].allowedValues) {
                    try {
                        var labels=$(this)[0].allowedValues;
                        var filtros=[];
                        labels.forEach(element => { filtros.push({key:element,label:element}); });
                        Blaze.renderWithData(Template.FilterSelectOBV, { operators: filtros, no: no }, document.getElementById('FieldValueOBV' + no));    
                    } catch (error) {
                        console.log(JSON.stringify(error));
                    }
                }
                else
                
                    if (type == "Boolean"){
                        var filtros=[
                            { key:true,label:"Si" },
                            { key:false,label:"No" }
                        ];
                        Blaze.renderWithData(Template.FilterSelectOBV, { operators: filtros, no: no }, document.getElementById('FieldValueOBV' + no));    
                    }                    
                    else if (type == "Date")
                        Blaze.renderWithData(Template.FiltroDate, { no: no }, document.getElementById('FieldValueOBV' + no));
                    else
                        if ($(this)[0].autoform && $(this)[0].autoform.options) {
                            var options = $(this)[0].autoform.options();
                            var values = [];
                            var map = {};
                            for (o in options) {
                                values.push(options[o].label);
                                map[options[o].label] = options[o].value;
                            }
                            Session.set("AutoformOptions", JSON.stringify(map));
                            Blaze.renderWithData(Template.FilterSelectOBV, { options: values, no: no }, document.getElementById('FieldValueOBV' + no));
                        }
                        else
                            Blaze.renderWithData(Template.FilterInputOBV, { no: no }, document.getElementById('FieldValueOBV' + no));

                if ($('#FilterOperatorsOBV' + no).html() == '')
                    Blaze.renderWithData(Template.FilterOperatorsOBV, { operators: FilterOperatorsOBV, no: no }, document.getElementById('FilterOperatorsOBV' + no));
                if ($('#FilterButtonDeleteOBV' + no).html() == '')
                    Blaze.renderWithData(Template.FilterButtonDeleteOBV, { no: no }, document.getElementById('FilterButtonDeleteOBV' + no));
                if ($('#FieldButtonOBV_reset').html() == '')
                    Blaze.render(Template.FilterButtonOBV_reset, document.getElementById('FieldButtonOBV_reset'));
                if ($('#FieldButtonOBV').html() == '')
                    Blaze.render(Template.FilterButtonOBV, document.getElementById('FieldButtonOBV'));
            }
        }
    });

    Template.FilterOperationsOBV.events({
        'click .dropdown-menu li a': function (event) {
            var no = Session.get("ContadorFiltro");
            no = no[no.length - 1];
            if ($(event.target.parentElement.parentElement).attr("aria-labelledby") == "operator" + no) {
                var val = event.target.textContent;
                DropdownSelect({ "label": val, "value": val }, "operator" + no);
            }
        }
    });

    DoLogic = function (op) {
        switch (op) {
            case "AND":
                return "$and";
                break;
            case "OR":
                return "$or";
                break;
            default:
                return "$and";
        }
    }

    CreateFilterSelector = function (q, op, no) {
        var operator = DoLogic(op[no]);
        var result = {};
        if (no > 0) {
            var query1 = CreateFilterSelector(q, op, no - 1);
            result[operator] = [query1, q[no + 1]];
        }
        else
            result[operator] = [q[no], q[no + 1]];

        return result
    }

    SetSelector = function (no) {
        if ($('#filter_value' + no).val()) {
            if (Session.get("AutoformOptions") && Session.get("AutoformOptions") != "{}") {
                var map = Session.get("AutoformOptions");
                map = JSON.parse(map);
                var value = map[$('#filter_value' + no).val()];
            }
            else
                var value = $('#filter_value' + no).val();
            var field = $("#field" + no + ":first-child").val();
            var op = $("#operator" + no + ":first-child").val();
            var type = $("#field" + no + ":first-child").attr("field_type");
            var selector = DoSelector(field, op, value, type);
            var queries = Session.get("FiltroQueries");
            queries[no] = selector;
            Session.set("FiltroQueries", queries);
        }
    }

    Template.FilterButtonOBV.events({
        'click #call_filter': function () {
            var no = Session.get("ContadorFiltro");
            no = no[no.length - 1];
            SetSelector(no);
            if (Object.keys(Session.get("FiltroQueries")).length == 1) {
                Session.set("FiltroSelector", Session.get("FiltroQueries")[no]);
            }
            else {
                var ops = FnObjectValues(Session.get("FiltroOps"));
                if(ops.length!=0){
                    Session.set("FiltroSelector", CreateFilterSelector(FnObjectValues(Session.get("FiltroQueries")), ops, ops.length - 1));
                }                
            }
        }
    });

    Template.FilterButtonDeleteOBV.events({
        'click .delete_filter': function (event) {
            var no = Number(event.currentTarget.id.match(/[0-9]+$/)[0]);
            $('#SimpleFilterOBV' + no).remove();

            Session.set("AutoformOptions", "{}");
            var counter = Session.get("ContadorFiltro");
            counter.splice(counter.indexOf(no), 1);

            Session.set("ContadorFiltro", counter);
            var queries = Session.get("FiltroQueries");

            delete queries[no];
            Session.set("FiltroQueries", queries);

            var ops = Session.get("FiltroOps");
            delete ops[no];
            delete ops[no - 1];

            Session.set("FiltroOps", ops);
            $('#FilterOperatorsOBV_values' + counter[counter.length - 1]).val('...');

            if (counter.length == 0) {
                Session.set("ContadorFiltro", [1]);
                Blaze.renderWithData(Template.SimpleFilterOBV, { "no": 1 }, document.getElementById('FilterOBV'));
                Session.set("FiltroSelector", '');
            }
            else
                if (Object.keys(Session.get("FiltroQueries")).length == 1) {
                    Session.set("FiltroSelector", Session.get("FiltroQueries")[no - 1]);
                }
                else
                    Session.set("FiltroSelector", CreateFilterSelector(FnObjectValues(Session.get("FiltroQueries")), FnObjectValues(ops), Object.keys(ops).length - 1));

            var counter = Session.get("ContadorFiltro");

            Blaze.render(Template.ButtonLocationsOBV, document.getElementById('SimpleFilterOBV' + counter[counter.length - 1]));
            Blaze.render(Template.FilterButtonOBV, document.getElementById('FieldButtonOBV'));
        }
    });

    Template.FilterOperatorsOBV.events({
        'change .FilterOperatorsOBV': function (event) {
            var no = Number(event.currentTarget.id.match(/[0-9]+$/)[0]);
            SetSelector(no);
            var add = true;

            var op = $('#FilterOperatorsOBV_values' + no).val();
            var ops = Session.get("FiltroOps");
            if (ops[no])
                add = false;
            ops[no] = op;
            Session.set("FiltroOps", ops);

            if (add) {
                var counter = Session.get("ContadorFiltro");
                counter.push(counter[counter.length - 1] + 1);
                Session.set("ContadorFiltro", counter);

                Blaze.renderWithData(Template.SimpleFilterOBV, { "no": counter[counter.length - 1] }, document.getElementById('FilterOBV'));
                $('#FieldButtonOBV').remove();
                Blaze.render(Template.ButtonLocationsOBV, document.getElementById('SimpleFilterOBV' + counter[counter.length - 1]));
            }
        }
    });

    Template.FilterInputOBV.helpers({
        input_value_placeholder: function () {
            var sess = Session.get("FiltroTabular")
            if (sess && (sess.input_value_placeholder || sess.input_value_placeholder == ''))
                return sess.input_value_placeholder
            return '****'
        }
    });


}
