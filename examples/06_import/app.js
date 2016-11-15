//you can define shorts paths in Star.SetConfig :
Star.SetConfig({
  paths:{
    'js':'web/js',
    'text':'web/text'
  },
  //you can trace all import or loading
  debug:{
    loaderSuccess:false,
    loaderError:false,
    loaderProgress:false,
    importStack:false
  }
});

//Star.Impot take two arguments :
//- an array with files' url
//- a callback function
Star.Import([
"[js]/MyClass.js"
],function(){
  
  var instance = app.MyClass();
  
});