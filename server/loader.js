if (Meteor.isServer) {
  Inject.rawHead("loader", '<div class="center" id="inject-loader-wrapper" style=\'width:100%;height:100vh;position: fixed;display: block;webkit-background-size: cover;-moz-background-size: cover;  -o-background-size: cover;background-size: cover;vertical-align:middle;text-align:center;\'><div style=\'position: absolute;top: 45%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%);width:450px;height:325px;border-radius: 10px 10px 10px 10px;background-color:#ffffff;box-shadow: 1px 1px 1px 1px #888888;\'><img src="/img/logo_automatiso.png" style=\'width:200px;height:auto;vertical-align:middle;position:relative;margin-top:65px;\'> </img><br><br><br><a style=\'color:#000000;font-size: 150%;\'>Espere un momento...<br><br><i class="fa fa-cog fa-spin" style=\'font-size:45px;color:red;\'></i></div></div>');
}
