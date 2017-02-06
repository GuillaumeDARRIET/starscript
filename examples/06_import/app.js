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
  //,localStorageId:"my product version"

});
  //StarScript use localstorage with getTime id, if you want to get loaded file from localstorage you can add a storage ID
  //use Star.LocalStorageUpToDate() to know if your current version match with localStorage files 


//Star.Impot take two arguments :
//- an array with files' url
//- a callback function
Star.Import([
"[js]/MyClass.js"
],function(){
  
  var instance = app.MyClass();
  
});