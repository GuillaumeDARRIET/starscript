
Star.SetConfig({
  //shorts paths
  paths:{
    'css':'web/css/',
    'js':'web/js/',
    'templates':'web/templates',
    'data':'web/data',
    
    'views':'web/js/views',
    'models':'web/js/models'
  },
  //debug options
  debug:{
    importStack:false
  }
});


Star.Import([
"[js]/Main.js"
],function(){
  
  //start
  var main = app.Main();
  
  
});

