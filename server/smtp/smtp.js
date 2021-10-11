if (Meteor.isServer) {
  Meteor.startup(function() {
      //process.env.MAIL_URL = "smtp://mbes.system:pancholopez@smtp.gmail.com:587/";
      process.env.MAIL_URL = "smtp://notificacionTI@mainbit.com.mx:V4ngN0tTI.+1820@smtp.office365.com:587/";
  });

  Meteor.methods({
    sendEmail:function(to, cc,subject, text,color) {
      this.unblock();
      var htmlX = "<body><table class='container' width='100%' cellpadding='0' cellspacing='0' style='max-width: 600px;background-color:"+color+";padding:40px;border-radius:5px 5px 5px 5px;height:100%'> <tr><p></p><p></p><p></p> <td> <h2 style='font-family:Arial,Verdana,Sans-serif;color:white'>"+text+"</h2> <p></p><p></p><p></p> </td> </tr> </table> </body> ";
      try {
        Email.send({
          to: to,
          from: 'notificacionTI@vangentmexico.com.mx',
          cc:cc,
          subject: "MBES, " + subject,
          html: htmlX,
        });
      } catch (ex) {
        console.log("sendmail: error al enviar correo a:" + to + " excepcion:" + ex);
      }
    }
  });
}
