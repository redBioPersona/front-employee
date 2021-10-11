Template.orionMaterializeCollectionsIndex_MisRegistros.helpers({
  filtro() {
    var _userId=Meteor.userId();
    var fechaInicio=Session.get('fechaInicio');
    var fechaFin=Session.get('fechaInicio');
    if (Roles.userHasRole(_userId, "admin") == true) {
      return {}
    }else {
      var res = Meteor.users.findOne({ "_id": _userId });
      if (res && res.profile && res.profile.idcompany) {
        var _idCompany = res.profile.idcompany;
        var _idMail = res.emails[0].address;
        var _idPerson=Persons.findOne({empEmail:_idMail});
        if (_idPerson!=undefined) {
          var _id=_idPerson._id;
            return {
              _idEmployee: _id
            }
        }
      } else {
        return { }
      }
    }
  }
});
