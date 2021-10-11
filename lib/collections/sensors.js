Sensors = new orion.collection('sensors', {
    singularName: 'Sensores',
    pluralName: 'Sensores',
    title: 'Sensores',
    parentPath: '/admin/principal',
    help: 'Sensores',
    link: { title: 'Sensores', parent: '_template' }
  });

  Sensors.attachSchema(new SimpleSchema({
    FingerService: { type: Boolean, label: 'FingerService', defaultValue: false},
    SyncService: { type: Boolean, label: 'SyncService', defaultValue: false},
    FaceService: { type: Boolean, label: 'FaceService', defaultValue: false},
    PrintService: { type: Boolean, label: 'PrintService', defaultValue: false},
    DeviceFingerConnect: { type: Boolean, label: 'DeviceFingerConnect', defaultValue: false},

    ShowFingerService: { type: Boolean, label: 'ShowFingerService', defaultValue: true},
    ShowSyncService: { type: Boolean, label: 'ShowSyncService', defaultValue: true},
    ShowFaceService: { type: Boolean, label: 'ShowFaceService', defaultValue: true},
    ShowPrintService: { type: Boolean, label: 'ShowPrintService', defaultValue: true},
    ShowDeviceFingerConnect: { type: Boolean, label: 'ShowDeviceFingerConnect', defaultValue: true},

    ProcessingFinger: { type: Boolean, label: 'ProcessingFinger', defaultValue: false},
    ProcessingFace: { type: Boolean, label: 'ProcessingFace', defaultValue: false},
    active: { type: Boolean, label: 'PrintService', defaultValue: true},
    updatedAt: orion.attribute('updatedAt', { optional: true }),
  }));

  Sensors.allow({
    insert: function() {
      return true;
    },
    update: function() {
      return true;
    },
    remove: function() {
      return true;
    }
  });


if(Meteor.isServer){
    Meteor.publish('getSensors', function () {
        return Sensors.find();
    });
}
if(Meteor.isClient){
    Meteor.subscribe('getSensors');
}
