
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


//to used builded file, uncommemt build.js in index.html

//to switch into builder mod, uncommemt starbuilder.min.js in index.html
if(Star.Builder){
  //Builder Mode
  Star.Builder.SetConfig({
    fileTypes:{
      json : { added : true },
      css : { added : true },
      html : { added : true }
    }
  })
}


Star.Import([
"[js]/Main.js"
],function(){
  
  //start
  var main = app.Main();
  
  
  //time to display page, compare with and without build.js
  var diff =  new Date().getTime() - startTime;
  var el = document.getElementById("main");
  el.innerHTML = "Display time : "+diff+"ms<br />"+el.innerHTML;
  
});

